import { SITE, NAV, SERVICES } from '../content/site.mjs';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const photos = JSON.parse(readFileSync(new URL('../assets/img/photos.json', import.meta.url)));

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const fullAddress = () => {
  const a = SITE.address;
  return `${a.street}, ${a.city}, ${a.region} ${a.zip}`;
};

// Photo URLs carry a short hash of the file, so a replaced photo is never served from an old cache
const photoHashes = new Map();
export function photoUrl(name, w, ext) {
  const file = `${name}-${w}.${ext}`;
  if (!photoHashes.has(file)) {
    const bytes = readFileSync(new URL(`../assets/img/photos/${file}`, import.meta.url));
    photoHashes.set(file, createHash('sha256').update(bytes).digest('hex').slice(0, 8));
  }
  return `/assets/img/photos/${file}?v=${photoHashes.get(file)}`;
}

// <picture> with AVIF and WebP sources built from assets/img/photos.json
export function picture(name, alt, { sizes = '100vw', cls = '', imgCls = '', priority = false, decorative = false } = {}) {
  const p = photos[name];
  if (!p) throw new Error(`Unknown photo "${name}"`);
  const set = (ext) => photoSrcset(name, ext);
  const largest = p.widths[p.widths.length - 1];
  const fallback = photoUrl(name, p.widths[Math.min(1, p.widths.length - 1)], 'webp');
  const h = Math.round(largest / p.ratio);
  const altAttr = decorative ? 'alt="" aria-hidden="true"' : `alt="${esc(alt)}"`;
  const load = priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  return `<picture${cls ? ` class="${cls}"` : ''}><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="${fallback}" ${altAttr} width="${largest}" height="${h}" ${load} decoding="async"${imgCls ? ` class="${imgCls}"` : ''}></picture>`;
}

export const photoSrcset = (name, ext) =>
  photos[name].widths.map((w) => `${photoUrl(name, w, ext)} ${w}w`).join(', ');

const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  phone:
    '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  fax: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M7 14h10v7H7z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 3 5 6v6c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  heart: '<path d="M19.5 12.6 12 20l-7.5-7.4a4.9 4.9 0 0 1 7-7l.5.5.5-.5a4.9 4.9 0 0 1 7 7Z"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  hands: '<path d="M4 15c2.5 2.5 5 4 8 4s5.5-1.5 8-4"/><path d="M12 15c-1.5 0-3-.8-3.5-2l3.5-1 3.5 1c-.5 1.2-2 2-3.5 2Z"/><path d="M12 4v3M6.5 6.5l2 2M17.5 6.5l-2 2"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
};

export const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

export const sun = (cls = 'sunmark') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="/assets/img/sprite.svg#sun"></use></svg>`;

export const emailHtml = (e) => e.replace('@', '@<wbr>');

export const newTab = '<span class="sr-only"> (opens in a new tab)</span>';

// ----------------------------------------------------------------- schema

export function businessSchema() {
  const a = SITE.address;
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.description,
    url: `${SITE.url}/`,
    logo: `${SITE.url}/assets/img/logo-1200.png`,
    image: `${SITE.url}/assets/img/og.jpg`,
    telephone: SITE.phoneE164,
    faxNumber: SITE.faxE164,
    email: SITE.email,
    priceRange: 'Covered by most major insurance plans',
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.zip,
      addressCountry: a.country,
    },
    hasMap: SITE.mapsUrl,
    areaServed: SITE.areas.map((name) => ({ '@type': 'City', name: `${name}, CA` })),
    medicalSpecialty: ['Nursing', 'Physiotherapy', 'Geriatric', 'SpeechPathology'],
    availableService: SERVICES.map((s) => ({
      '@type': 'MedicalTherapy',
      name: s.name,
      url: `${SITE.url}/services/${s.slug}/`,
    })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    knowsLanguage: ['en'],
    identifier: { '@type': 'PropertyValue', name: 'California home health agency license', value: SITE.license },
  };
}

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: `${SITE.url}/`,
  name: SITE.shortName,
  publisher: { '@id': `${SITE.url}/#business` },
  inLanguage: 'en-US',
});

export const breadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE.url}${c.path}`,
  })),
});

const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// ----------------------------------------------------------------- chrome

function head(page, ctx) {
  const url = `${SITE.url}${page.path}`;
  const title = page.title;
  const desc = page.description;
  const robots = page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large';
  const ogImage = `${SITE.url}/assets/img/og.jpg`;
  const schemas = [...(page.schema || [])];
  const preload = page.preloadImage
    ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${photoSrcset(page.preloadImage, 'avif')}" imagesizes="${page.preloadSizes || '100vw'}" fetchpriority="high">`
    : '';
  const ga = SITE.gaId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(SITE.gaId)}"></script><script src="/assets/js/analytics.js?v=${ctx.v}" data-ga="${esc(SITE.gaId)}" defer></script>`
    : '';
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#FBF7F0">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.shortName)}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(page.ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Illuminate Home Health Care logo with the line Healing, brought home">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/outfit.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/fraunces-italic.woff2" as="font" type="font/woff2" crossorigin>
${preload}
<link rel="stylesheet" href="/assets/css/main.css?v=${ctx.v}">
<script src="/assets/vendor/gsap.min.js?v=${ctx.v}" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js?v=${ctx.v}" defer></script>
<script src="/assets/vendor/SplitText.min.js?v=${ctx.v}" defer></script>
<script src="/assets/js/main.js?v=${ctx.v}" defer></script>
${ga}
${schemas.map(ld).join('\n')}
</head>`;
}

function header(page) {
  const current = (href) => (page.path === href || (href !== '/' && page.path.startsWith(href)) ? ' aria-current="page"' : '');
  const links = NAV.map((n) => `<li><a class="nav__link" href="${n.href}"${current(n.href)}>${n.label}</a></li>`).join('');
  const menuLinks = NAV.map(
    (n, i) =>
      `<li><a class="menu__link" href="${n.href}"${current(n.href)}><span class="menu__num" aria-hidden="true">0${i + 1}</span>${n.label}</a></li>`,
  ).join('');
  return `<a class="skip" href="#main">Skip to main content</a>
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="/" aria-label="Illuminate Home Health Care, home">
      <img src="/assets/img/logo.svg" alt="" width="868" height="240">
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav__list">${links}</ul>
    </nav>
    <div class="site-header__actions">
      <a class="header-phone" href="${SITE.phoneHref}">${icon('phone')}<span>${SITE.phone}</span></a>
      <a class="btn btn--small btn--ink" href="/contact/" data-magnetic><span class="btn__label">Request care</span></a>
      <button class="menu-toggle" type="button" aria-haspopup="dialog" aria-controls="menu" data-menu-open>
        <span class="menu-toggle__bars" aria-hidden="true"><span></span><span></span></span>
        <span class="sr-only">Open menu</span>
      </button>
    </div>
  </div>
</header>
<dialog class="menu" id="menu" aria-label="Site menu" data-menu>
  <div class="menu__inner">
    <div class="menu__top">
      <a class="brand" href="/" aria-label="Illuminate Home Health Care, home"><img src="/assets/img/logo.svg" alt="" width="868" height="240"></a>
      <button class="menu__close" type="button" data-menu-close>${icon('close')}<span class="sr-only">Close menu</span></button>
    </div>
    <nav aria-label="Menu"><ul class="menu__list">${menuLinks}</ul></nav>
    <div class="menu__foot">
      <a href="${SITE.phoneHref}">${icon('phone')}${SITE.phone}</a>
      <a href="mailto:${SITE.email}">${icon('mail')}<span>${emailHtml(SITE.email)}</span></a>
    </div>
  </div>
</dialog>`;
}

function footer(ctx, page) {
  const showCta = !page.body.includes('class="cta-band"');
  const a = SITE.address;
  const serviceLinks = SERVICES.slice(0, 6)
    .map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`)
    .join('');
  return `<footer class="site-footer${showCta ? '' : ' site-footer--compact'}">
  ${showCta ? `<div class="footer-cta container" data-sunlight>
    <p class="footer-cta__eyebrow eyebrow">Ready when you are</p>
    <h2 class="footer-cta__title" data-split>Let’s bring care <em>home.</em></h2>
    <div class="footer-cta__actions">
      <a class="btn btn--sun" href="/contact/" data-magnetic><span class="btn__label">Request care</span>${icon('arrow')}</a>
      <a class="btn btn--ghost" href="${SITE.phoneHref}" data-magnetic><span class="btn__label">Call ${SITE.phone}</span></a>
    </div>
  </div>` : ''}
  <div class="footer-grid container">
    <div class="footer-brand">
      <a class="brand brand--footer" href="/" aria-label="Illuminate Home Health Care, home"><img src="/assets/img/logo.svg" alt="" width="868" height="240" loading="lazy"></a>
      <p>Skilled, compassionate home health care for patients and families across Los Angeles.</p>
      <p class="footer-license">State licensed home health agency<br>License No. ${SITE.license}</p>
    </div>
    <div>
      <h2 class="footer-title">Visit</h2>
      <address>
        <a href="${SITE.mapsUrl}" target="_blank" rel="noopener">${esc(a.street)}<br>${a.city}, ${a.region} ${a.zip}${newTab}</a>
      </address>
    </div>
    <div>
      <h2 class="footer-title">Contact</h2>
      <ul class="footer-list">
        <li><a href="${SITE.phoneHref}"><span class="footer-k">Phone</span> ${SITE.phone}</a></li>
        <li><a href="${SITE.faxHref}"><span class="footer-k">Fax</span> ${SITE.fax}</a></li>
        <li><a href="mailto:${SITE.email}">${emailHtml(SITE.email)}</a></li>
      </ul>
    </div>
    <nav aria-label="Footer">
      <h2 class="footer-title">Explore</h2>
      <ul class="footer-list">${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
    </nav>
    <nav aria-label="Services">
      <h2 class="footer-title">Services</h2>
      <ul class="footer-list">${serviceLinks}<li><a href="/services/">All services</a></li></ul>
    </nav>
  </div>
  <div class="footer-word" aria-hidden="true"><div class="footer-word__inner" data-footer-word><span>Illuminate</span></div></div>
  <div class="footer-bottom container">
    <p>© <span data-year>${ctx.year}</span> ${esc(SITE.name)} All rights reserved.</p>
    <ul class="footer-legal">
      <li><a href="/privacy/">Privacy Policy</a></li>
      <li><a href="/accessibility/">Accessibility</a></li>
      <li class="credit">Designed by <a href="${SITE.designer.url}" target="_blank" rel="noopener"><strong>${SITE.designer.name}</strong>${newTab}</a></li>
    </ul>
  </div>
</footer>`;
}

export function render(page, ctx) {
  return `<!doctype html>
<html lang="en-US" class="page-${page.id || 'default'}">
${head(page, ctx)}
<body>
${header(page)}
<main id="main" tabindex="-1">
${page.body}
</main>
${footer(ctx, page)}
</body>
</html>
`;
}

// ------------------------------------------------------------ shared blocks

export function pageHero({ eyebrow, title, lead, crumbs = [], image, imageAlt, actions = '' }) {
  const bc = crumbs.length
    ? `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
        .map((c, i) =>
          i === crumbs.length - 1
            ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
            : `<li><a href="${c.path}">${esc(c.name)}</a><span class="crumbs__sep" aria-hidden="true">/</span></li>`,
        )
        .join('')}</ol></nav>`
    : '';
  return `<section class="page-hero${image ? ' page-hero--image' : ''}">
  <div class="container page-hero__grid">
    <div class="page-hero__copy">
      ${bc}
      ${eyebrow ? `<p class="eyebrow" data-reveal>${eyebrow}</p>` : ''}
      <h1 class="page-hero__title" data-split="hero">${title}</h1>
      ${lead ? `<p class="lead" data-reveal>${lead}</p>` : ''}
      ${actions ? `<div class="page-hero__actions" data-reveal>${actions}</div>` : ''}
    </div>
    ${
      image
        ? `<div class="page-hero__media" data-clip>${picture(image, imageAlt, { sizes: '(min-width: 900px) 45vw, 100vw', priority: true })}</div>`
        : `<div class="page-hero__sun" aria-hidden="true" data-hero-sun>${sun('sunmark sunmark--hero')}</div>`
    }
  </div>
</section>`;
}

export function ctaBand({ title = 'Questions about care? <em>We’re here.</em>', text = 'Talk with our intake team about services, insurance and getting started. We will guide you through every step.' } = {}) {
  return `<section class="cta-band">
  <div class="container cta-band__inner" data-sunlight>
    <div class="cta-band__glow" aria-hidden="true"></div>
    <h2 class="cta-band__title" data-split>${title}</h2>
    <p class="cta-band__text" data-reveal>${text}</p>
    <div class="cta-band__actions" data-reveal>
      <a class="btn btn--ink" href="/contact/" data-magnetic><span class="btn__label">Send a message</span>${icon('arrow')}</a>
      <a class="btn btn--ghost" href="${SITE.phoneHref}" data-magnetic><span class="btn__label">Call ${SITE.phone}</span></a>
    </div>
  </div>
</section>`;
}

export function faqList(items, { headingLevel = 3 } = {}) {
  return `<div class="faq" data-faq>${items
    .map(
      (f, i) => `<div class="faq__item" data-reveal>
    <h${headingLevel} class="faq__q"><button type="button" aria-expanded="true" aria-controls="faq-${i}" id="faq-q-${i}" data-faq-toggle><span>${esc(f.q)}</span><span class="faq__icon" aria-hidden="true"></span></button></h${headingLevel}>
    <div class="faq__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div class="faq__a-inner"><p>${esc(f.a)}</p></div></div>
  </div>`,
    )
    .join('')}</div>`;
}

export function serviceCard(s, i, { headingLevel = 3 } = {}) {
  return `<article class="svc-card">
  <a class="svc-card__link" href="/services/${s.slug}/">
    <div class="svc-card__media">${picture(s.image, '', { sizes: '(min-width: 900px) 30vw, 80vw', decorative: true })}</div>
    <div class="svc-card__body">
      <span class="svc-card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <h${headingLevel} class="svc-card__title">${esc(s.name)}</h${headingLevel}>
      <p class="svc-card__text">${esc(s.short)}</p>
      <span class="svc-card__more" aria-hidden="true">Learn more ${icon('arrow')}</span>
    </div>
  </a>
</article>`;
}
