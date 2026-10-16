import { SITE, STATS, VALUES, TEAM_ROLES } from '../content/site.mjs';
import { picture, icon, sun, esc, pageHero, ctaBand, breadcrumbSchema, businessSchema, fullAddress, newTab, emailHtml } from '../templates/layout.mjs';

export default function about() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about/' },
  ];
  const body = `
${pageHero({
  eyebrow: 'About Illuminate',
  title: 'Rooted in care. <em>Guided by light.</em>',
  lead: 'We grow not by chasing giant leaps, but by committing every day to serve our patients the very best we can, one steady step at a time.',
  crumbs,
})}

<section class="section section--tight" aria-labelledby="story-title">
  <div class="container split">
    <div class="split__media" data-clip>${picture('dancing', 'An older woman laughs and dances with a caregiver in a bright common room', { sizes: '(min-width: 960px) 45vw, 90vw' })}</div>
    <div>
      <p class="eyebrow" data-reveal>Our story</p>
      <h2 class="h2" id="story-title" data-split>Why we love <em>what we do.</em></h2>
      <div class="prose" data-reveal>
        <p>Illuminate Home Health Care, Inc. is a state licensed home health agency based in North Hollywood, California.</p>
        <p>For ${SITE.founded}, our nurses, therapists, social workers and home health aides have brought skilled, physician directed care to patients across the San Fernando Valley and greater Los Angeles. We started with a simple belief that healing feels lighter at home, and we have built every part of our agency around it.</p>
      </div>
    </div>
  </div>
</section>

<section class="stats section" aria-label="Illuminate by the numbers">
  <div class="container">
    <dl class="stats__grid">
      ${STATS.map((s) => `<div class="stat" data-reveal><dt>${s.label}</dt><dd><span data-count="${s.value}">${s.value}</span>${s.suffix}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="values section--sand" aria-labelledby="values-title">
  <div class="container values__grid">
    <div class="values__intro">
      <p class="eyebrow" data-reveal>Our values</p>
      <h2 class="h2" id="values-title" data-split>Care and compassion, <em>in every visit.</em></h2>
      <p class="lead" data-reveal>Four commitments guide how we hire, how we train and how we show up at your door.</p>
    </div>
    <ol class="values__list" data-stack>
      ${VALUES.map(
        (v, i) => `<li class="value-card">
        <div class="value-card__top"><span class="value-card__num">0${i + 1}</span>${sun()}</div>
        <h3 class="value-card__title">${v.title}</h3>
        <p class="value-card__text">${v.text}</p>
      </li>`,
      ).join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="team-title">
  <div class="container split split--flip">
    <div class="split__media" data-clip>${picture('nurse-smile', 'A nurse in blue scrubs smiles with an older woman during a visit', { sizes: '(min-width: 960px) 45vw, 90vw' })}</div>
    <div>
      <p class="eyebrow" data-reveal>Our team</p>
      <h2 class="h2" id="team-title" data-split>Specialists who <em>work as one.</em></h2>
      <p class="lead" data-reveal>Every patient is supported by a multidisciplinary team that shares one plan and one goal: helping you thrive at home.</p>
      <ul class="roles" data-reveal>${TEAM_ROLES.map((r) => `<li>${r}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="section section--sand" aria-labelledby="visit-title">
  <div class="container split">
    <div class="split__media split__media--wide" data-clip>${picture('exercise', 'An older man and his grandson stretch together in a bright living room', { sizes: '(min-width: 960px) 45vw, 90vw' })}</div>
    <div>
      <p class="eyebrow" data-reveal>Come and visit us</p>
      <h2 class="h2" id="visit-title" data-split>North Hollywood, <em>in the heart of LA.</em></h2>
      <p class="lead" data-reveal>Our office is a short drive from Burbank, Studio City and the rest of the Valley. Stop by, call or send us a message.</p>
      <div class="info-cards" data-reveal>
        <a class="info-card" href="${SITE.mapsUrl}" target="_blank" rel="noopener">${icon('pin')}<span class="info-card__k">Address</span><span class="info-card__v">${esc(fullAddress())}</span>${newTab}</a>
        <a class="info-card" href="${SITE.phoneHref}">${icon('phone')}<span class="info-card__k">Phone</span><span class="info-card__v">${SITE.phone}</span></a>
        <a class="info-card" href="mailto:${SITE.email}">${icon('mail')}<span class="info-card__k">Email</span><span class="info-card__v">${emailHtml(SITE.email)}</span></a>
        <div class="info-card">${icon('shield')}<span class="info-card__k">License</span><span class="info-card__v">No. ${SITE.license}</span></div>
      </div>
      <h3 class="eyebrow" data-reveal>Communities we serve</h3>
      <ul class="areas" data-reveal>${SITE.areas.map((a) => `<li>${a}</li>`).join('')}</ul>
    </div>
  </div>
</section>
${ctaBand({ title: 'Let’s talk about <em>your care.</em>' })}
`;
  return {
    id: 'about',
    path: '/about/',
    title: 'About Us | Illuminate Home Health Care, North Hollywood',
    description:
      'Illuminate Home Health Care is a licensed home health agency in North Hollywood, caring for Los Angeles families for more than ten years.',
    schema: [breadcrumbSchema(crumbs), businessSchema()],
    body,
  };
}
