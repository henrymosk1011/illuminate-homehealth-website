import { SITE, SERVICES, FAQS } from '../content/site.mjs';
import { picture, icon, sun, esc, pageHero, ctaBand, faqList, breadcrumbSchema, businessSchema, fullAddress, newTab, emailHtml } from '../templates/layout.mjs';

const crumbsFor = (name, path) => [
  { name: 'Home', path: '/' },
  { name, path },
];

// ---------------------------------------------------------------- referrals

export function referrals() {
  const crumbs = crumbsFor('Referrals', '/referrals/');
  const send = [
    'Face sheet with demographics and insurance information',
    'Signed physician orders for home health services',
    'Recent history and physical, or the hospital discharge summary',
    'Current medication list',
    'Wound, therapy or other specialty notes when they apply',
  ];
  const steps = [
    ['Send the referral', `Fax orders and clinical documents to ${SITE.fax}, or call our intake team at ${SITE.phone}.`],
    ['We verify and schedule', 'Our team confirms eligibility and insurance, then contacts the patient or family to schedule the start of care.'],
    ['Start of care visit', 'A licensed clinician completes a comprehensive assessment in the home and begins the plan of care.'],
    ['Plan sent for signature', 'We send the plan of care to the ordering physician for review and signature, with updates as the patient progresses.'],
  ];
  const body = `
${pageHero({
  eyebrow: 'For physicians and discharge planners',
  title: 'Referrals made <em>simple.</em>',
  lead: 'Partner with a responsive home health team that communicates clearly and keeps your patients on track after they leave your care.',
  crumbs,
  image: 'after-hospital',
  imageAlt: 'A clinician talks with an older man in his living room during a follow up visit',
  actions: `<a class="btn btn--ink" href="${SITE.faxHref}" data-magnetic><span class="btn__label">Fax ${SITE.fax}</span>${icon('fax')}</a><a class="btn btn--ghost" href="${SITE.phoneHref}" data-magnetic><span class="btn__label">Call ${SITE.phone}</span></a>`,
})}
<section class="section section--tight" aria-labelledby="ref-steps">
  <div class="container">
    <div class="section-head section-head--split">
      <h2 class="h2" id="ref-steps" data-split>How referrals <em>work.</em></h2>
      <p class="lead" data-reveal>Four clear steps from your order to the first visit, with your office kept informed throughout.</p>
    </div>
    <ol class="process__steps">
      ${steps
        .map(
          ([t, d], i) => `<li class="process__step" data-reveal><span class="process__num" aria-hidden="true">0${i + 1}</span><h3 class="process__title"><span class="sr-only">Step ${i + 1}: </span>${t}</h3><p class="process__text">${esc(d)}</p></li>`,
        )
        .join('')}
    </ol>
  </div>
</section>
<section class="section section--sand" aria-labelledby="ref-send">
  <div class="container split">
    <div>
      <p class="eyebrow" data-reveal>What to include</p>
      <h2 class="h2" id="ref-send" data-split>Helpful documents <em>to send.</em></h2>
      <p class="lead" data-reveal>Send what you have. Our intake team will follow up for anything else we need.</p>
      <ul class="checklist" data-reveal>${send.map((x) => `<li>${icon('check')}${x}</li>`).join('')}</ul>
    </div>
    <div>
      <p class="eyebrow" data-reveal>Services we provide</p>
      <ul class="roles" data-reveal>${SERVICES.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('')}</ul>
      <div class="info-cards" data-reveal>
        <a class="info-card" href="${SITE.faxHref}">${icon('fax')}<span class="info-card__k">Referral fax</span><span class="info-card__v">${SITE.fax}</span></a>
        <a class="info-card" href="${SITE.phoneHref}">${icon('phone')}<span class="info-card__k">Intake phone</span><span class="info-card__v">${SITE.phone}</span></a>
      </div>
    </div>
  </div>
</section>
${ctaBand({ title: 'Have a patient <em>ready to go home?</em>', text: 'Call our intake team to talk through eligibility, timing and coverage. We will take it from there.' })}
`;
  return {
    id: 'referrals',
    path: '/referrals/',
    title: 'Physician Referrals | Illuminate Home Health Care, Los Angeles',
    description: `Refer patients to Illuminate Home Health Care. Fax orders to ${SITE.fax} or call ${SITE.phone}. Skilled nursing and therapy across Los Angeles.`,
    preloadImage: 'after-hospital',
    preloadSizes: '(min-width: 900px) 45vw, 100vw',
    schema: [breadcrumbSchema(crumbs)],
    body,
  };
}

// ----------------------------------------------------------------------- faq

export function faq() {
  const crumbs = crumbsFor('FAQ', '/faq/');
  const body = `
${pageHero({
  eyebrow: 'Frequently asked questions',
  title: 'Answers, <em>clearly.</em>',
  lead: 'Everything families usually ask about home health care, insurance and getting started with Illuminate.',
  crumbs,
})}
<section class="section section--tight" aria-label="Questions and answers">
  <div class="container faq-wrap">
    <div class="faq-wrap__head">
      <h2 class="h2" data-split>Still have <em>questions?</em></h2>
      <p class="lead" data-reveal>Call us at ${SITE.phone} or send a message. A real person from our team will get back to you.</p>
      <a class="btn btn--ink" href="/contact/" data-reveal data-magnetic><span class="btn__label">Contact us</span>${icon('arrow')}</a>
    </div>
    ${faqList(FAQS)}
  </div>
</section>
${ctaBand()}
`;
  return {
    id: 'faq',
    path: '/faq/',
    title: 'Home Health Care FAQ | Illuminate Home Health Care',
    description: 'Answers about home health care, who qualifies, insurance coverage, referrals and getting started with Illuminate Home Health Care in Los Angeles.',
    schema: [
      breadcrumbSchema(crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
    body,
  };
}

// ------------------------------------------------------------------- contact

export function contact() {
  const crumbs = crumbsFor('Contact', '/contact/');
  const roles = ['Patient', 'Family member or caregiver', 'Physician or referral source', 'Job applicant', 'Other'];
  const opts = [['', 'Not sure yet'], ...SERVICES.map((s) => [s.slug, s.name])];
  const field = (id, label, input, { full = false, required = false, hint = '' } = {}) => `<div class="field${full ? ' field--full' : ''}">
      <label for="${id}">${label}${required ? ' <span class="req">(required)</span>' : ''}</label>
      ${hint ? `<span class="field__hint" id="${id}-hint">${hint}</span>` : ''}
      ${input}
      <span class="field__error" id="${id}-error" aria-live="polite"></span>
    </div>`;
  const desc = (id, hint) => `aria-describedby="${hint ? `${id}-hint ` : ''}${id}-error"`;

  const body = `
${pageHero({
  eyebrow: 'Contact',
  title: 'Let’s start <em>a conversation.</em>',
  lead: 'Tell us a little about what you need. Our team will reach out to answer questions, verify insurance and plan next steps.',
  crumbs,
})}
<section class="contact" aria-label="Contact options">
  <div class="container contact__grid">
    <div class="contact__aside">
      <div class="info-cards" data-reveal>
        <a class="info-card" href="${SITE.phoneHref}">${icon('phone')}<span class="info-card__k">Call</span><span class="info-card__v">${SITE.phone}</span></a>
        <a class="info-card" href="${SITE.faxHref}">${icon('fax')}<span class="info-card__k">Fax</span><span class="info-card__v">${SITE.fax}</span></a>
        <a class="info-card" href="mailto:${SITE.email}">${icon('mail')}<span class="info-card__k">Email</span><span class="info-card__v">${emailHtml(SITE.email)}</span></a>
        <a class="info-card" href="${SITE.mapsUrl}" target="_blank" rel="noopener">${icon('pin')}<span class="info-card__k">Visit</span><span class="info-card__v">${esc(fullAddress())}</span>${newTab}</a>
      </div>
      <div class="form__note" data-reveal>${icon('clock')}<p>Our care team is available 24/7 for urgent needs of current patients. In a medical emergency, call 911.</p></div>
    </div>

    <div class="form" data-reveal>
      <div data-form-wrap>
        <h2 class="form__title">Send us a message</h2>
        <p class="form__intro">Fields marked required are needed so we can reach you.</p>
        <form action="/api/contact" method="post" novalidate data-contact-form>
          <div class="form__grid">
            ${field('firstName', 'First name', `<input id="firstName" name="firstName" type="text" autocomplete="given-name" required maxlength="80" ${desc('firstName')}>`, { required: true })}
            ${field('lastName', 'Last name', `<input id="lastName" name="lastName" type="text" autocomplete="family-name" required maxlength="80" ${desc('lastName')}>`, { required: true })}
            ${field('email', 'Email', `<input id="email" name="email" type="email" autocomplete="email" required maxlength="160" ${desc('email')}>`, { required: true })}
            ${field('phone', 'Phone', `<input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="40" ${desc('phone')}>`)}
            ${field('role', 'I am a', `<select id="role" name="role" ${desc('role')}>${roles.map((r) => `<option>${r}</option>`).join('')}</select>`)}
            ${field('service', 'Service of interest', `<select id="service" name="service" ${desc('service')}>${opts.map(([slug, o]) => `<option${slug ? ` data-slug="${slug}"` : ''}>${esc(o)}</option>`).join('')}</select>`)}
            ${field('message', 'How can we help?', `<textarea id="message" name="message" required maxlength="4000" ${desc('message', true)}></textarea>`, { full: true, required: true, hint: 'Please share general needs only. Do not include detailed medical information.' })}
          </div>
          <div class="hp" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
          <input type="hidden" name="started" value="" data-started>
          <div class="form__note">${icon('shield')}<p>We use your details only to respond to your message. See our <a href="/privacy/">Privacy Policy</a>.</p></div>
          <button class="btn btn--ink form__submit" type="submit" data-magnetic><span class="btn__label" data-submit-label>Send message</span>${icon('arrow')}</button>
          <div class="form__status" role="status" aria-live="polite" data-form-status></div>
          <p class="form__status is-error form__fallback-error" id="form-error">Sorry, your message could not be sent. Please check the required fields and try again, or call us at ${SITE.phone}.</p>
        </form>
      </div>
      <div class="form__done" hidden tabindex="-1" data-form-done>
        ${sun()}
        <h2>Thank you. <em>We’ll be in touch.</em></h2>
        <p class="lead">Your message is on its way to our care team. For anything urgent, call us at <a href="${SITE.phoneHref}">${SITE.phone}</a>.</p>
      </div>
    </div>
  </div>
</section>
<section class="section section--sand" aria-labelledby="contact-faq">
  <div class="container faq-wrap">
    <div class="faq-wrap__head">
      <p class="eyebrow" data-reveal>Before you write</p>
      <h2 class="h2" id="contact-faq" data-split>Common <em>questions.</em></h2>
    </div>
    ${faqList(FAQS.slice(1, 5))}
  </div>
</section>
`;
  return {
    id: 'contact',
    path: '/contact/',
    title: 'Contact Us | Illuminate Home Health Care, North Hollywood',
    description: `Contact Illuminate Home Health Care in North Hollywood. Call ${SITE.phone}, email ${SITE.email} or send us a message online.`,
    schema: [breadcrumbSchema(crumbs), businessSchema()],
    body,
  };
}

// --------------------------------------------------------------------- legal

const li = (items) => `<ul>${items.map((x) => `<li>${icon('check')}<span>${x}</span></li>`).join('')}</ul>`;

export function privacy({ updated }) {
  const crumbs = crumbsFor('Privacy Policy', '/privacy/');
  const body = `
${pageHero({ eyebrow: 'Legal', title: 'Privacy <em>Policy.</em>', lead: `Last updated ${updated}.`, crumbs })}
<section class="legal">
  <div class="container legal__body" data-reveal>
    <p>This policy explains how ${esc(SITE.name)} (“Illuminate”, “we”, “us”) handles information collected through this website. It applies only to this website. How we protect the health information of our patients is described separately in our Notice of Privacy Practices, which is available on request.</p>
    <h2>Information we collect</h2>
    ${li([
      'Information you choose to send us through the contact form, such as your name, email address, phone number and message.',
      'Basic technical information that web servers record automatically, such as IP address, browser type and the pages you visit. Our hosting provider uses this information to keep the site secure and reliable.',
      'If we enable website analytics in the future, aggregated usage information about how visitors use the site.',
    ])}
    <h2>How we use information</h2>
    ${li([
      'To respond to your questions and requests for care.',
      'To operate, secure and improve this website.',
      'To comply with legal obligations.',
    ])}
    <p>We do not sell or rent your personal information, and we do not use it for advertising.</p>
    <h2>Please do not send medical details</h2>
    <p>The contact form is not intended for detailed medical information. Messages sent through this website are not part of your medical record. To discuss your health or care, please call us at <a href="${SITE.phoneHref}">${SITE.phone}</a>.</p>
    <h2>Service providers</h2>
    <p>We use trusted providers to host this website and deliver contact form messages to our team by email. They process information only on our behalf and only as needed to provide those services.</p>
    <h2>Cookies</h2>
    <p>This website does not use advertising cookies. If we add analytics, it may use cookies to measure visits, and you can block or delete cookies in your browser settings.</p>
    <h2>Your choices and rights</h2>
    <p>You may ask us to access, correct or delete personal information you have sent through this website. California residents may have additional rights under state law. To make a request, email <a href="mailto:${SITE.email}">${SITE.email}</a> or call <a href="${SITE.phoneHref}">${SITE.phone}</a>.</p>
    <h2>Children</h2>
    <p>This website is not directed to children under 13, and we do not knowingly collect their personal information online.</p>
    <h2>Changes to this policy</h2>
    <p>We may update this policy from time to time. The date at the top of this page shows when it last changed.</p>
    <h2>Contact</h2>
    <p>${esc(SITE.name)}<br>${esc(fullAddress())}<br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
  </div>
</section>
`;
  return {
    id: 'legal',
    path: '/privacy/',
    title: 'Privacy Policy | Illuminate Home Health Care',
    description: 'How Illuminate Home Health Care collects, uses and protects information submitted through this website.',
    schema: [breadcrumbSchema(crumbs)],
    body,
  };
}

export function accessibility({ updated }) {
  const crumbs = crumbsFor('Accessibility', '/accessibility/');
  const body = `
${pageHero({ eyebrow: 'Accessibility', title: 'Accessible to <em>everyone.</em>', lead: `Last reviewed ${updated}.`, crumbs })}
<section class="legal">
  <div class="container legal__body" data-reveal>
    <p>${esc(SITE.name)} is committed to making this website usable by everyone, including people with disabilities. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA.</p>
    <h2>What we have done</h2>
    ${li([
      'Semantic page structure with clear headings, landmarks and a skip to content link.',
      'Full keyboard access with a visible focus indicator on every interactive element.',
      'Text and interface colors chosen to meet WCAG AA contrast ratios.',
      'Descriptive text alternatives for meaningful images.',
      'Form fields with visible labels, clear instructions and error messages announced to screen readers.',
      'Respect for your device’s reduced motion setting. When it is on, scrolling effects and animations are turned off.',
      'Layouts that adapt to zoom up to 400 percent and to small screens without losing content.',
    ])}
    <h2>Feedback and help</h2>
    <p>If you have trouble using any part of this website, or need information in another format, please let us know. We will work with you to provide the information you need.</p>
    ${li([
      `Phone: <a href="${SITE.phoneHref}">${SITE.phone}</a>`,
      `Email: <a href="mailto:${SITE.email}">${SITE.email}</a>`,
      `Mail: ${esc(fullAddress())}`,
    ])}
    <p>We review accessibility regularly and welcome suggestions for improvement.</p>
  </div>
</section>
`;
  return {
    id: 'legal',
    path: '/accessibility/',
    title: 'Accessibility Statement | Illuminate Home Health Care',
    description: 'Illuminate Home Health Care is committed to an accessible website that meets WCAG 2.2 Level AA. Learn what we do and how to request help.',
    schema: [breadcrumbSchema(crumbs)],
    body,
  };
}

// ---------------------------------------------------------------- utilities

export function notFound() {
  const body = `
<section class="notfound">
  <div>
    ${sun()}
    <h1>This page <em>wandered off.</em></h1>
    <p class="lead">The page you are looking for may have moved. Let’s get you back on track.</p>
    <div class="notfound__actions">
      <a class="btn btn--ink" href="/" data-magnetic><span class="btn__label">Back to home</span>${icon('arrow')}</a>
      <a class="btn btn--ghost" href="/services/" data-magnetic><span class="btn__label">Our services</span></a>
    </div>
  </div>
</section>`;
  return {
    id: 'notfound',
    path: '/404.html',
    file: '404.html',
    noindex: true,
    title: 'Page not found | Illuminate Home Health Care',
    description: 'The page you are looking for could not be found.',
    body,
  };
}

export function thanks() {
  const body = `
<section class="notfound">
  <div>
    ${sun()}
    <h1>Thank you. <em>We’ll be in touch.</em></h1>
    <p class="lead">Your message is on its way to our care team. For anything urgent, call us at <a href="${SITE.phoneHref}">${SITE.phone}</a>.</p>
    <div class="notfound__actions">
      <a class="btn btn--ink" href="/" data-magnetic><span class="btn__label">Back to home</span>${icon('arrow')}</a>
    </div>
  </div>
</section>`;
  return {
    id: 'notfound',
    path: '/thanks/',
    noindex: true,
    title: 'Message sent | Illuminate Home Health Care',
    description: 'Thank you for contacting Illuminate Home Health Care.',
    body,
  };
}
