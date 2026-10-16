import { SITE, SERVICES, STATS, VALUES, STEPS, TESTIMONIALS, FAQS } from '../content/site.mjs';
import { picture, icon, sun, esc, serviceCard, faqList, businessSchema, websiteSchema } from '../templates/layout.mjs';

export default function home() {

  const words = ['Skilled Nursing', 'Physical Therapy', 'Speech Therapy', 'Occupational Therapy', 'Home Health Aides'];
  const words2 = ['Compassion', 'Dignity', 'Respect', 'Love', 'Responsibility'];
  const row = (list) => list.map((w) => `<span class="bigtype__item">${w}${sun()}</span>`).join('');

  const body = `
<section class="hero" data-hero data-sunlight>
  <div class="hero__glow" aria-hidden="true" data-hero-glow></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow" data-hero-in>Home health care in Los Angeles</p>
      <h1 class="hero__title" data-hero-title><span class="hero__line">Healing,</span> <span class="hero__line">brought <em>home.</em></span></h1>
      <p class="lead hero__lead" data-hero-in>Skilled nursing, therapy and compassionate support for patients across the San Fernando Valley and greater Los Angeles, from a licensed team that treats you like family.</p>
      <div class="hero__actions" data-hero-in>
        <a class="btn btn--ink" href="/contact/" data-magnetic><span class="btn__label">Request care</span>${icon('arrow')}</a>
        <a class="btn btn--ghost" href="${SITE.phoneHref}" data-magnetic><span class="btn__label">Call ${SITE.phone}</span></a>
      </div>
      <ul class="hero__facts" data-hero-in>
        <li>${icon('shield')}State licensed agency</li>
        <li>${icon('clock')}24/7 support for urgent needs</li>
        <li>${icon('heart')}Most major insurance accepted</li>
      </ul>
    </div>
    <div class="hero__visual">
      <div class="hero__media" data-hero-media>
        ${picture('hero-care', 'A caregiver checks on an older man resting comfortably in bed at home', { sizes: '(min-width: 960px) 40vw, 86vw', priority: true })}
      </div>
      <div class="hero__badge" aria-hidden="true" data-hero-in>
        <svg class="badge-ring" viewBox="0 0 200 200" data-badge-ring><defs><path id="badge-circle" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0"/></defs><text><textPath href="#badge-circle" textLength="500" lengthAdjust="spacing">Illuminate Home Health ✦ Los Angeles ✦</textPath></text></svg>
        ${sun()}
      </div>
    </div>
  </div>
</section>

<section class="statement" aria-labelledby="statement-title">
  <div class="container statement__grid">
    <div>
      <h2 class="eyebrow" id="statement-title" data-reveal>Our promise</h2>
      <p class="statement__text" data-illuminate>We believe recovery happens best where life feels familiar. For ${SITE.founded}, Illuminate has brought skilled nurses, therapists and caring aides into homes across Los Angeles, treating every patient like <em>family</em> and every home with respect.</p>
    </div>
    <div class="statement__media" aria-hidden="true">
      <div data-parallax="-12">${picture('holding-hands', '', { sizes: '(min-width: 1100px) 16vw, 45vw', decorative: true })}</div>
      <div data-parallax="10">${picture('nurse-smile', '', { sizes: '(min-width: 1100px) 16vw, 45vw', decorative: true })}</div>
    </div>
  </div>
</section>

<section class="stats" aria-label="Illuminate by the numbers">
  <div class="container">
    <dl class="stats__grid">
      ${STATS.map((s) => `<div class="stat" data-reveal><dt>${s.label}</dt><dd><span data-count="${s.value}">${s.value}</span>${s.suffix}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="hsec" data-hscroll aria-labelledby="services-title">
  <div class="hsec__pin" data-hpin>
    <div class="container hsec__head">
      <div>
        <p class="eyebrow" data-reveal>What we do</p>
        <h2 class="h2" id="services-title" data-split>Care for every step <em>of recovery.</em></h2>
        <p class="lead" data-reveal>Ten services, one coordinated team. Every visit follows your physician’s orders and a plan built around your goals.</p>
      </div>
      <div class="hsec__meta" data-reveal>
        <p class="hsec__count" aria-hidden="true"><b data-hcount>01</b> / ${String(SERVICES.length).padStart(2, '0')}</p>
        <a class="text-link" href="/services/">All services ${icon('arrow')}</a>
      </div>
    </div>
    <div class="hsec__viewport" data-hviewport>
      <ul class="hsec__track" data-htrack>
        ${SERVICES.map((s, i) => `<li class="hsec__item">${serviceCard(s, i)}</li>`).join('')}
        <li class="hsec__item">
          <a class="svc-end" href="/contact/">
            ${sun()}
            <span>
              <span class="svc-end__title">Not sure what you need? <em>Let’s talk.</em></span>
              <span class="svc-end__cta">Ask our care team ${icon('arrow')}</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
    <div class="container"><div class="hsec__progress" aria-hidden="true"><span data-hprogress></span></div></div>
  </div>
</section>

<section class="bigtype" aria-hidden="true">
  <div class="bigtype__row" data-marquee="-1">${row(words)}${row(words)}</div>
  <div class="bigtype__row bigtype__row--outline" data-marquee="1">${row(words2)}${row(words2)}</div>
</section>

<section class="values" aria-labelledby="values-title">
  <div class="container values__grid">
    <div class="values__intro">
      <p class="eyebrow" data-reveal>Why families choose us</p>
      <h2 class="h2" id="values-title" data-split>The right care for the people <em>you love.</em></h2>
      <p class="lead" data-reveal>Rooted in care and compassion, we bring expert home health services that leave every patient feeling valued, supported and nurtured in their own home.</p>
      <a class="btn btn--ghost" href="/about/" data-reveal data-magnetic><span class="btn__label">More about us</span>${icon('arrow')}</a>
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

<section class="band" data-band aria-labelledby="band-quote">
  <div class="band__media" data-band-media>
    ${picture('woman-smiling', 'An older woman smiles warmly in a sunlit room', { sizes: '100vw' })}
    <div class="band__copy">
      <p class="band__quote" id="band-quote" data-split>Every patient deserves to feel seen, safe and <em>at home.</em></p>
    </div>
  </div>
</section>

<section class="process" data-process aria-labelledby="process-title">
  <div class="process__pin container" data-process-pin>
    <div class="section-head section-head--split">
      <div>
        <p class="eyebrow" data-reveal>How care begins</p>
        <h2 class="h2" id="process-title" data-split>From first call to <em>first visit.</em></h2>
      </div>
      <p class="lead" data-reveal>Starting home health care should feel simple. We handle the coordination so you can focus on getting better.</p>
    </div>
    <div class="process__stage">
      <div class="process__sky" aria-hidden="true">
        <div class="process__arc" data-process-arc><div class="process__sun">${sun()}</div></div>
        <div class="process__ground"></div>
      </div>
      <ol class="process__steps" data-process-steps>
        ${STEPS.map(
          (s, i) => `<li class="process__step">
          <span class="process__num" aria-hidden="true">0${i + 1}</span>
          <h3 class="process__title"><span class="sr-only">Step ${i + 1}: </span>${s.title}</h3>
          <p class="process__text">${s.text}</p>
        </li>`,
        ).join('')}
      </ol>
    </div>
  </div>
</section>

<section class="network section--sand" aria-labelledby="network-title">
  <div class="container network__grid">
    <div>
      <p class="eyebrow" data-reveal>Insurance</p>
      <h2 class="network__title" id="network-title" data-split>Working with the plans <em>you already have.</em></h2>
      <p class="lead" data-reveal>We work with most major insurance providers. Call us and we will verify your coverage before care begins.</p>
    </div>
    <ul class="network__logos" data-reveal>
      ${SITE.insurers.map((n) => `<li><img src="${n.logo}" alt="${esc(n.name)}" width="${n.w}" height="${n.h}" loading="lazy" decoding="async"></li>`).join('')}
    </ul>
  </div>
</section>

<section class="voices" aria-labelledby="voices-title">
  <div class="container section-head section-head--split">
    <div>
      <p class="eyebrow" data-reveal>Kind words</p>
      <h2 class="h2" id="voices-title" data-split>Trusted by patients <em>and families.</em></h2>
    </div>
    <p class="lead" data-reveal>The best measure of our work is how people feel when we leave the room.</p>
  </div>
  <div class="voices__track" data-drift tabindex="0" role="region" aria-label="Patient testimonials">
    ${TESTIMONIALS.map(
      (t) => `<figure class="voice">
      <div>${sun('sunmark voice__mark')}<blockquote><p>“${esc(t.quote)}”</p></blockquote></div>
      <figcaption><b>${esc(t.name)}</b><span>${esc(t.place)}</span></figcaption>
    </figure>`,
    ).join('')}
  </div>
</section>

<section class="refer" aria-labelledby="refer-title">
  <div class="container refer__grid">
    <div class="refer__media" data-clip>${picture('holding-hands-2', 'A nurse in navy scrubs holds the hands of an older patient', { sizes: '(min-width: 960px) 40vw, 90vw' })}</div>
    <div>
      <p class="eyebrow" data-reveal>For physicians and discharge planners</p>
      <h2 class="h2" id="refer-title" data-split>Refer a patient <em>with confidence.</em></h2>
      <p class="lead" data-reveal>Our intake team moves quickly, keeps you informed and sends every plan of care back for your signature.</p>
      <div class="refer__list" data-reveal>
        <a href="${SITE.faxHref}">${icon('fax')}<span>Fax referrals to ${SITE.fax}<small>Orders, face sheet and recent clinical notes</small></span></a>
        <a href="${SITE.phoneHref}">${icon('phone')}<span>Call intake at ${SITE.phone}<small>Questions about eligibility or timing</small></span></a>
      </div>
      <a class="text-link" href="/referrals/" data-reveal>How referrals work ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section--sand" aria-labelledby="faq-title">
  <div class="container faq-wrap">
    <div class="faq-wrap__head">
      <p class="eyebrow" data-reveal>Questions</p>
      <h2 class="h2" id="faq-title" data-split>Answers for <em>families.</em></h2>
      <p class="lead" data-reveal>Still wondering about something? Our team is happy to talk it through.</p>
      <a class="btn btn--ghost" href="/faq/" data-reveal data-magnetic><span class="btn__label">See all questions</span>${icon('arrow')}</a>
    </div>
    ${faqList(FAQS.slice(0, 5))}
  </div>
</section>
`;

  return {
    id: 'home',
    path: '/',
    title: 'Illuminate Home Health Care | Home Health Care in Los Angeles',
    ogTitle: 'Illuminate Home Health Care | Healing, brought home',
    description:
      'Licensed home health care in North Hollywood and Los Angeles. Skilled nursing, physical, occupational and speech therapy, and home health aides. Call (818) 987 4173.',
    preloadImage: 'hero-care',
    preloadSizes: '(min-width: 960px) 40vw, 86vw',
    schema: [businessSchema(), websiteSchema()],
    body,
  };
}
