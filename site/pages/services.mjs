import { SITE, SERVICES, STEPS } from '../content/site.mjs';
import { picture, icon, esc, pageHero, ctaBand, serviceCard, breadcrumbSchema, businessSchema, emailHtml } from '../templates/layout.mjs';

export function servicesIndex() {
  const rows = SERVICES.map(
    (s, i) => `<li class="svc-row" data-reveal>
    <a class="svc-row__link" href="/services/${s.slug}/" data-preview="${s.image}">
      <span class="svc-row__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <h2 class="svc-row__name">${esc(s.name)}</h2>
      <p class="svc-row__short">${esc(s.short)}</p>
      <span class="svc-row__arrow" aria-hidden="true">${icon('arrow')}</span>
    </a>
  </li>`,
  ).join('');

  const previews = SERVICES.map((s) => `<img src="/assets/img/photos/${s.image}-640.webp" alt="" data-preview-img="${s.image}" width="640" height="800" loading="lazy">`).join('');

  const body = `
${pageHero({
  eyebrow: 'Services',
  title: 'Skilled care, <em>delivered home.</em>',
  lead: 'From nursing and therapy to social services and personal care, our multidisciplinary team brings everything recovery requires to your door.',
  crumbs: [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/' },
  ],
})}
<section class="section section--tight" aria-label="All services">
  <div class="container">
    <ol class="svc-list">${rows}</ol>
  </div>
  <div class="hover-preview" aria-hidden="true" data-hover-preview>${previews}</div>
</section>

<section class="section section--sand" aria-labelledby="every-plan">
  <div class="container split">
    <div class="split__media" data-clip>${picture('nurse-smile', 'A nurse and an older woman share a warm smile during a home visit', { sizes: '(min-width: 960px) 45vw, 90vw' })}</div>
    <div>
      <p class="eyebrow" data-reveal>Every plan of care includes</p>
      <h2 class="h2" id="every-plan" data-split>One team, <em>one plan.</em></h2>
      <p class="lead" data-reveal>Your nurse, therapists, social worker and aide share a single plan that follows your physician’s orders and your personal goals.</p>
      <ul class="checklist" data-reveal>
        <li>${icon('check')}A full in home assessment by a licensed clinician</li>
        <li>${icon('check')}A written plan of care reviewed with your physician</li>
        <li>${icon('check')}Regular visits on a predictable schedule</li>
        <li>${icon('check')}Updates for your family and your doctor</li>
        <li>${icon('check')}A care team available 24/7 for urgent needs</li>
      </ul>
    </div>
  </div>
</section>
${ctaBand()}
`;

  return {
    id: 'services',
    path: '/services/',
    title: 'Home Health Services in Los Angeles | Illuminate Home Health Care',
    description:
      'Skilled nursing, physical therapy, occupational therapy, speech therapy, medical social services, home health aides and more, delivered at home across Los Angeles.',
    schema: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services/' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: SERVICES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: `${SITE.url}/services/${s.slug}/` })),
      },
    ],
    body,
  };
}

export function servicePage(s, index) {
  const related = [1, 2, 3].map((n) => SERVICES[(index + n) % SERVICES.length]);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/' },
    { name: s.name, path: `/services/${s.slug}/` },
  ];

  const body = `
${pageHero({
  eyebrow: `Service ${String(index + 1).padStart(2, '0')}`,
  title: esc(s.name),
  lead: esc(s.lead),
  crumbs,
  image: s.image,
  imageAlt: s.alt,
  actions: `<a class="btn btn--ink" href="/contact/?service=${s.slug}" data-magnetic><span class="btn__label">Ask about ${esc(s.name)}</span>${icon('arrow')}</a>`,
})}
<section class="detail">
  <div class="container detail__grid">
    <div>
      <div class="prose" data-reveal>${s.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="detail-block">
        <h2 class="detail-block__title" data-split>What’s included</h2>
        <ul class="checklist" data-reveal>${s.includes.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      </div>
      <div class="detail-block">
        <h2 class="detail-block__title" data-split>Who it helps</h2>
        <ul class="checklist" data-reveal>${s.helps.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      </div>
      <div class="detail-block">
        <h2 class="detail-block__title" data-split>How to get started</h2>
        <ol class="checklist" data-reveal>${STEPS.map((x, i) => `<li><span class="svc-card__num">0${i + 1}</span><span><b>${esc(x.title)}.</b> ${esc(x.text)}</span></li>`).join('')}</ol>
      </div>
    </div>
    <aside class="detail__aside" aria-label="Contact our care team">
      <div class="aside-card" data-reveal>
        <h2 class="aside-card__title">Questions about <em>${esc(s.name.toLowerCase().replace('alzheimer’s', 'Alzheimer’s'))}?</em></h2>
        <p>Our intake team can check your coverage, coordinate with your doctor and schedule your first visit.</p>
        <a class="btn" href="/contact/?service=${s.slug}"><span class="btn__label">Send us a message</span>${icon('arrow')}</a>
        <div class="aside-card__links">
          <a href="${SITE.phoneHref}">${icon('phone')}<span>${SITE.phone}</span></a>
          <a href="${SITE.faxHref}">${icon('fax')}<span>Fax ${SITE.fax}</span></a>
          <a href="mailto:${SITE.email}">${icon('mail')}<span>${emailHtml(SITE.email)}</span></a>
        </div>
      </div>
    </aside>
  </div>
</section>
<section class="related" aria-labelledby="related-title">
  <div class="container">
    <div class="section-head section-head--split">
      <h2 class="h2" id="related-title" data-split>Related <em>services.</em></h2>
      <p class="lead" data-reveal>Most patients receive more than one kind of care. Your team works together under one plan.</p>
    </div>
    <div class="related__grid">${related.map((r) => `<div data-reveal>${serviceCard(r, SERVICES.indexOf(r))}</div>`).join('')}</div>
  </div>
</section>
${ctaBand()}
`;

  return {
    id: 'service',
    path: `/services/${s.slug}/`,
    title: `${s.name} in Los Angeles | Illuminate Home Health`.length <= 62 ? `${s.name} in Los Angeles | Illuminate Home Health` : `${s.name} at Home | Illuminate Home Health`,
    description: `${s.short} Home health care in North Hollywood and greater Los Angeles.`,
    preloadImage: s.image,
    preloadSizes: '(min-width: 900px) 45vw, 100vw',
    schema: [
      breadcrumbSchema(crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.name,
        serviceType: s.name,
        description: s.lead,
        url: `${SITE.url}/services/${s.slug}/`,
        image: `${SITE.url}/assets/img/photos/${s.image}-1024.webp`,
        provider: { '@id': `${SITE.url}/#business`, '@type': 'MedicalBusiness', name: SITE.name },
        areaServed: SITE.areas.map((a) => ({ '@type': 'City', name: `${a}, CA` })),
      },
    ],
    body,
  };
}
