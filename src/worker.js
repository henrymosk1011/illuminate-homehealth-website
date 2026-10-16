// Cloudflare Worker for illuminatehomehealth.com
// Serves the static site in dist/ (Workers Static Assets), handles the contact form
// at /api/contact by emailing the clinic through Resend, sends the bare domain to www,
// and adds security headers to every response.
//
// Required secret:   RESEND_API_KEY   (npx wrangler secret put RESEND_API_KEY)
// Plain variables:   CONTACT_TO, CONTACT_FROM, ALLOWED_ORIGINS, CANONICAL_HOST (wrangler.jsonc "vars")

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 2500; // people take longer than this to fill in the form

const LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 160,
  phone: 40,
  role: 60,
  service: 80,
  message: 4000,
};

const ROLES = new Set(['Patient', 'Family member or caregiver', 'Physician or referral source', 'Job applicant', 'Other']);

const SERVICES = new Set([
  'Not sure yet',
  'Skilled Nursing',
  'Physical Therapy',
  'Occupational Therapy',
  'Speech Therapy',
  'Medical Social Services',
  'Home Health Aide',
  'Alzheimer’s and Dementia Care',
  'Care After Hospitalization',
  'Medication Management',
  'Geriatric Care Management',
]);

// Google Analytics hosts are allowed ahead of time so analytics can be switched on
// from site/content/site.mjs without touching this file.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com",
  "style-src 'self'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

const API_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // illuminatehomehealth.com -> www.illuminatehomehealth.com
    const canonical = env.CANONICAL_HOST;
    if (canonical && url.hostname !== canonical && url.hostname === canonical.replace(/^www\./, '')) {
      url.hostname = canonical;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/contact') {
      try {
        return await handleContact(request, env, url);
      } catch (err) {
        console.error('contact: unexpected error', err && err.message);
        return reply(request, 500, { ok: false, message: genericFailure(env) });
      }
    }

    if (url.pathname.startsWith('/api/')) {
      return json(404, { ok: false, message: 'Not found.' });
    }

    const response = await env.ASSETS.fetch(request);
    return withSiteHeaders(response, url);
  },
};

function withSiteHeaders(response, url) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  const type = headers.get('Content-Type') || '';
  if (url.pathname.startsWith('/assets/')) {
    // CSS and JS URLs carry ?v=<hash> from the build, so they can be cached for a year.
    const versioned = url.searchParams.has('v');
    headers.set('Cache-Control', versioned ? 'public, max-age=31536000, immutable' : 'public, max-age=2592000');
  } else if (type.includes('text/html')) {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function handleContact(request, env, url) {
  if (request.method !== 'POST') {
    return json(405, { ok: false, message: 'Method not allowed.' }, { Allow: 'POST' });
  }

  // Same origin only. Browsers always send Origin on cross site POSTs.
  const origin = request.headers.get('Origin');
  const allowed = new Set([url.origin, ...String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)]);
  if (origin && !allowed.has(origin)) {
    return json(403, { ok: false, message: 'Forbidden.' });
  }

  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > MAX_BODY_BYTES) {
    return reply(request, 413, { ok: false, message: 'That message is a little too long. Please shorten it and try again.' });
  }

  if (env.CONTACT_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.CONTACT_LIMITER.limit({ key: `contact:${ip}` });
    if (!success) {
      return reply(request, 429, { ok: false, message: 'Too many messages in a short time. Please wait a minute and try again.' });
    }
  }

  const raw = await readBody(request);
  if (!raw) {
    return reply(request, 400, { ok: false, message: 'We could not read that submission. Please try again.' });
  }

  // Spam traps: a hidden field people never see, and a minimum fill time.
  // Bots get a quiet success so they do not learn what tripped them.
  const started = Number(raw.started || 0);
  if (clean(raw.website, 200) || (started && Date.now() - started < MIN_FILL_MS)) {
    return reply(request, 200, { ok: true });
  }

  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) data[key] = clean(raw[key], max, key === 'message');
  if (!ROLES.has(data.role)) data.role = 'Other';
  if (!SERVICES.has(data.service)) data.service = 'Not sure yet';

  const errors = validate(data);
  if (Object.keys(errors).length) {
    return reply(request, 422, { ok: false, message: 'Please correct the highlighted fields.', errors });
  }

  if (env.DRY_RUN) {
    console.log('contact (dry run):', JSON.stringify({ ...data, message: `${data.message.slice(0, 60)}...` }));
    return reply(request, 200, { ok: true });
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error('contact: RESEND_API_KEY, CONTACT_TO or CONTACT_FROM is not configured');
    return reply(request, 503, { ok: false, message: genericFailure(env) });
  }

  const name = `${data.firstName} ${data.lastName}`.trim();
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: `${name.replace(/[<>",]/g, '')} <${data.email}>`,
      subject: `New website inquiry from ${name} (${data.role})`,
      text: emailText(data),
      html: emailHtml(data),
      tags: [{ name: 'source', value: 'website_contact' }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('contact: Resend rejected the message', res.status, detail.slice(0, 300));
    return reply(request, 502, { ok: false, message: genericFailure(env) });
  }

  return reply(request, 200, { ok: true });
}

// ------------------------------------------------------------------ helpers

async function readBody(request) {
  const type = (request.headers.get('Content-Type') || '').toLowerCase();
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    if (type.includes('application/json')) {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    }
    if (type.includes('application/x-www-form-urlencoded')) {
      return Object.fromEntries(new URLSearchParams(text));
    }
  } catch {
    return null;
  }
  return null;
}

function clean(value, max, multiline = false) {
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  let s = String(value).normalize('NFC');
  // Strip control characters. Keep newlines and tabs only in the message.
  s = multiline ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : s.replace(/[\u0000-\u001F\u007F]/g, ' ');
  s = s.replace(/[​-‏‪-‮⁦-⁩]/g, '').trim();
  return s.slice(0, max);
}

function validate(d) {
  const e = {};
  if (!d.firstName) e.firstName = 'Please enter your first name.';
  if (!d.lastName) e.lastName = 'Please enter your last name.';
  if (!d.email) e.email = 'Please enter your email address.';
  else if (!/^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[A-Za-z]{2,}$/.test(d.email)) e.email = 'Please enter a valid email address, like name@example.com.';
  if (d.phone && !/^[0-9+().\s‐-―-]{7,40}$/.test(d.phone)) e.phone = 'Please enter a valid phone number.';
  if (!d.message) e.message = 'Please tell us a little about how we can help.';
  return e;
}

function rows(d) {
  return [
    ['Name', `${d.firstName} ${d.lastName}`],
    ['Email', d.email],
    ['Phone', d.phone || 'Not provided'],
    ['I am a', d.role],
    ['Service', d.service],
  ];
}

function emailText(d) {
  return [
    'New inquiry from illuminatehomehealth.com',
    '',
    ...rows(d).map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    d.message,
    '',
    'Reply to this email to respond directly to the sender.',
  ].join('\n');
}

function emailHtml(d) {
  const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const tr = rows(d)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#5a534b;font:600 12px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;color:#15130f;font:16px/1.5 Arial,sans-serif">${esc(v)}</td></tr>`,
    )
    .join('');
  return `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#fbf7f0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px">
<tr><td style="padding:32px 32px 8px">
<p style="margin:0 0 6px;color:#a8361f;font:600 12px/1.4 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase">Illuminate Home Health</p>
<h1 style="margin:0 0 20px;color:#15130f;font:500 26px/1.2 Arial,sans-serif">New inquiry from ${esc(d.firstName)}</h1>
<table role="presentation" cellpadding="0" cellspacing="0">${tr}</table>
<h2 style="margin:28px 0 8px;color:#a8361f;font:600 12px/1.4 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase">Message</h2>
<p style="margin:0 0 28px;color:#15130f;font:16px/1.6 Arial,sans-serif;white-space:pre-wrap">${esc(d.message)}</p>
<p style="margin:0 0 32px;color:#5a534b;font:14px/1.5 Arial,sans-serif">Reply to this email to respond directly to ${esc(d.firstName)}.</p>
</td></tr></table></body></html>`;
}

function genericFailure(env) {
  const to = String(env.CONTACT_TO || 'contact@illuminatehomehealth.com').split(',')[0].trim();
  return `Sorry, something went wrong and your message was not sent. Please try again, call us at (818) 987 4173, or email ${to}.`;
}

function json(status, body, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...API_HEADERS, ...extra },
  });
}

// JavaScript submissions get JSON. Plain HTML form posts get a redirect.
function reply(request, status, body) {
  const accept = request.headers.get('Accept') || '';
  const type = request.headers.get('Content-Type') || '';
  const wantsJson = accept.includes('application/json') || type.includes('application/json');
  if (wantsJson) return json(status, body);
  const target = body.ok ? '/thanks/' : '/contact/#form-error';
  return new Response(null, { status: 303, headers: { Location: target, ...API_HEADERS } });
}
