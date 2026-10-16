/* Illuminate Home Health Care
   Interactions and scroll animation (GSAP + ScrollTrigger + SplitText).
   Native scrolling throughout: every scroll effect is tied directly to the scroll position.
   With "reduce motion" turned on, all motion is skipped and the page renders as a calm static layout. */

(() => {
  const d = document;
  const root = d.documentElement;
  const $ = (s, el = d) => el.querySelector(s);
  const $$ = (s, el = d) => Array.from(el.querySelectorAll(s));
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  // Copyright year always matches the visitor's current year
  $$('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

  initHeader();
  initMenu();
  initFaq();
  initForm();
  rollingLabels();

  const gsap = window.gsap;
  if (!gsap || !window.ScrollTrigger || !window.SplitText) {
    // Animation library missing: show everything right away.
    $$('[data-reveal],[data-hero-in],[data-hero-title],[data-split="hero"],[data-clip]').forEach((el) => (el.style.opacity = '1'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  root.classList.add('motion-ready');

  const fontsReady = Promise.race([d.fonts ? d.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 700))]);

  fontsReady.then(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('[data-reveal],[data-hero-in],[data-hero-title],[data-split="hero"],[data-clip]', { opacity: 1, clearProps: 'transform' });
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      homeHero();
      pageHero();
      splitHeadings();
      illuminate();
      counters();
      parallax();
      clipReveals();
      const undoMarquee = marquees();
      stack();
      band();
      drift();
      footerWord();
      reveals();
      return () => undoMarquee && undoMarquee();
    });

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px)', () => {
      const undoH = horizontal();
      const undoP = processPinned();
      return () => {
        undoH && undoH();
        undoP && undoP();
      };
    });

    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 899px)', () => {
      processSimple();
    });

    mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      magnetic();
      const undoPreview = hoverPreview();
      const undoLight = sunlight();
      const undoTilt = heroTilt();
      return () => {
        undoPreview && undoPreview();
        undoLight && undoLight();
        undoTilt && undoTilt();
      };
    });

    // Triggers are created per feature, not in page order: sort them by position
    // (pins first) and measure again so everything below a pinned section lines up.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    // Lazy images and late layout changes
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });

  // ------------------------------------------------------------- heroes

  function homeHero() {
    const hero = $('[data-hero]');
    if (!hero) return;
    const title = $('[data-hero-title]', hero);
    const media = $('[data-hero-media]', hero);
    const img = $('img', media);

    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'ln' });
    gsap.set(title, { opacity: 1 });
    gsap.set('[data-hero-in]', { y: 28 });

    // The photo rises into view like the sun: a circle opening from the bottom edge
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(split.lines, { yPercent: 115, filter: 'blur(14px)', duration: 1.6, stagger: 0.13 }, 0.15)
      .fromTo(media, { clipPath: 'circle(0% at 50% 100%)' }, { clipPath: 'circle(150% at 50% 100%)', duration: 2, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
      .from(img, { scale: 1.5, duration: 2.8 }, 0)
      .from('.hero__badge', { scale: 0, rotation: -120, duration: 1.6, ease: 'back.out(1.6)' }, 0.9)
      .to('[data-hero-in]', { opacity: 1, y: 0, duration: 1.3, stagger: 0.09 }, 0.55);

    const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(media, { yPercent: -10, ease: 'none', scrollTrigger: scrub });
    gsap.to($('picture', media), { scale: 1.14, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-hero-glow]', { yPercent: 30, scale: 1.2, ease: 'none', scrollTrigger: scrub });
    gsap.to('.hero__copy', { yPercent: -12, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-badge-ring]', { rotation: 220, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: scrub });
  }

  // Pointer moves tilt the hero photo in 3D while the badge floats the other way
  function heroTilt() {
    const hero = $('[data-hero]');
    if (!hero) return null;
    const media = $('[data-hero-media]', hero);
    const badge = $('.hero__badge', hero);
    const rx = gsap.quickTo(media, 'rotationX', { duration: 1, ease: 'expo.out' });
    const ry = gsap.quickTo(media, 'rotationY', { duration: 1, ease: 'expo.out' });
    const bx = gsap.quickTo(badge, 'xPercent', { duration: 1.2, ease: 'expo.out' });
    const by = gsap.quickTo(badge, 'yPercent', { duration: 1.2, ease: 'expo.out' });
    const move = (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 12);
      rx(py * -9);
      bx(px * -28);
      by(py * -28);
    };
    const leave = () => {
      rx(0);
      ry(0);
      bx(0);
      by(0);
    };
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
    };
  }

  // The logo's sun (rays and all) glows softly behind the hero and the call to action
  // panels and follows the pointer. Its rays turn as the pointer moves sideways.
  function sunlight() {
    const undo = [];
    $$('[data-sunlight]').forEach((zone) => {
      const glow = d.createElement('div');
      glow.className = 'sunlight';
      glow.setAttribute('aria-hidden', 'true');
      glow.innerHTML = '<svg viewBox="10 4 248 160" aria-hidden="true" focusable="false"><use href="/assets/img/sprite.svg#sun"></use></svg>';
      zone.prepend(glow);
      // Anchor the center of the sun disc (not the box) on the pointer
      gsap.set(glow, { xPercent: -49.6, yPercent: -74, transformOrigin: '49.6% 74%', scale: 0.7 });
      const x = gsap.quickTo(glow, 'x', { duration: 1.1, ease: 'expo.out' });
      const y = gsap.quickTo(glow, 'y', { duration: 1.1, ease: 'expo.out' });
      const turn = gsap.quickTo(glow, 'rotation', { duration: 1.6, ease: 'expo.out' });
      const pos = (e) => {
        const r = zone.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top, (e.clientX - r.left) / r.width];
      };
      const enter = (e) => {
        const [px, py] = pos(e);
        gsap.set(glow, { x: px, y: py });
        x(px);
        y(py);
        gsap.to(glow, { opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out', overwrite: 'auto' });
      };
      const move = (e) => {
        const [px, py, fx] = pos(e);
        x(px);
        y(py);
        turn((fx - 0.5) * 50);
      };
      const leave = () => gsap.to(glow, { opacity: 0, scale: 0.7, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
      zone.addEventListener('pointerenter', enter);
      zone.addEventListener('pointermove', move);
      zone.addEventListener('pointerleave', leave);
      undo.push(() => {
        zone.removeEventListener('pointerenter', enter);
        zone.removeEventListener('pointermove', move);
        zone.removeEventListener('pointerleave', leave);
        glow.remove();
      });
    });
    return () => undo.forEach((f) => f());
  }

  function pageHero() {
    const title = $('[data-split="hero"]');
    if (!title) return;
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'ln' });
    gsap.set(title, { opacity: 1 });
    gsap.from(split.lines, { yPercent: 115, filter: 'blur(12px)', duration: 1.5, stagger: 0.12, ease: 'expo.out', delay: 0.1 });
    const sun = $('[data-hero-sun]');
    if (sun) {
      gsap.from(sun, { rotation: -40, scale: 0.6, opacity: 0, duration: 2, ease: 'expo.out', delay: 0.2 });
      gsap.to(sun, { rotation: 30, yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  // ------------------------------------------------------- text effects

  function splitHeadings() {
    $$('[data-split]:not([data-split="hero"])').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'ln',
        autoSplit: true,
        // aria-label is only allowed on headings here; paragraphs keep their real text
        aria: /^H\d$/.test(el.tagName) ? 'auto' : 'none',
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            filter: 'blur(10px)',
            duration: 1.3,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
      });
    });
  }

  // Words "light up" to full ink as the paragraph scrolls through.
  // The faint state stays at 46% so it still clears WCAG 3:1 for large text.
  function illuminate() {
    $$('[data-illuminate]').forEach((el) => {
      SplitText.create(el, {
        type: 'words',
        autoSplit: true,
        aria: 'none',
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: (i, w) => (w.closest('em') ? 0.7 : 0.46) },
            { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true } },
          ),
      });
    });
  }

  // The real number stays in the HTML (for search engines and screen readers);
  // it only counts up from zero once the stat scrolls into view.
  function counters() {
    $$('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          const obj = { v: 0 };
          gsap.to(obj, { v: end, duration: 2.2, ease: 'expo.out', onUpdate: () => (el.textContent = String(Math.round(obj.v))) });
        },
      });
    });
  }

  function reveals() {
    const els = $$('[data-reveal]');
    if (!els.length) return;
    gsap.set(els, { y: 44 });
    ScrollTrigger.batch(els, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, overwrite: true }),
    });
  }

  // --------------------------------------------------------- imagery

  function parallax() {
    $$('[data-parallax]').forEach((el) => {
      gsap.to(el, { yPercent: Number(el.dataset.parallax), ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  function clipReveals() {
    $$('[data-clip]').forEach((el) => {
      const img = $('img', el);
      gsap.set(el, { opacity: 1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      // Photos open like a sunrise: a circle growing up from the bottom edge
      tl.fromTo(el, { clipPath: 'circle(0% at 50% 100%)' }, { clipPath: 'circle(150% at 50% 100%)', duration: 1.7, ease: 'expo.inOut', clearProps: 'clipPath' });
      if (!img) return;
      // The photo rests a little larger than its frame, so the scroll drift never uncovers an edge
      gsap.set(img, { scale: 1.12 });
      tl.from(img, { scale: 1.4, duration: 2.2, ease: 'expo.out' }, 0);
      gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  function band() {
    const el = $('[data-band]');
    if (!el) return;
    const media = $('[data-band-media]', el);
    const img = $('img', media);
    gsap.fromTo(media, { clipPath: 'inset(9% 7% 9% 7% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 30px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 10%', scrub: true } });
    gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ------------------------------------------------ horizontal motion

  // Services: the section pins and the cards travel sideways as you scroll down
  function horizontal() {
    const section = $('[data-hscroll]');
    if (!section) return null;
    const pin = $('[data-hpin]', section);
    const track = $('[data-htrack]', section);
    const viewport = $('[data-hviewport]', section);
    const head = $('.hsec__head', section);
    const count = $('[data-hcount]', section);
    const bar = $('[data-hprogress]', section);
    const items = $$('.hsec__item', track);

    // The heading becomes the first panel of the moving track
    const intro = d.createElement('li');
    intro.className = 'hsec__item hsec__intro';
    intro.appendChild(head);
    track.prepend(intro);
    section.classList.add('is-pinned');

    const distance = () => Math.max(0, track.scrollWidth - root.clientWidth);
    let shown = -1;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance() * 0.9}`,
        pin: true,
        // A short catch up evens out mouse wheel steps so the cards glide instead of jumping
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Pinned sections add scroll space, so measure them before everything below them
        refreshPriority: 2,
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${0.06 + self.progress * 0.94})`;
          const i = Math.min(items.length - 2, Math.floor(self.progress * (items.length - 1)));
          if (count && i !== shown) {
            shown = i;
            count.textContent = String(i + 1).padStart(2, '0');
          }
        },
      },
    });

    // Load and decode every card photo before the section arrives, so none pops in mid scroll
    const imgs = $$('img', track);
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom+=1200',
      once: true,
      onEnter: () =>
        imgs.forEach((img) => {
          img.loading = 'eager';
          if (img.decode) img.decode().catch(() => {});
        }),
    });

    // Photos drift inside their frames as the cards pass
    $$('.svc-card__media img', track).forEach((img) => {
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', force3D: true, scrollTrigger: { trigger: img.closest('.hsec__item'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });

    // Keyboard users: bring a focused card into view. Mouse and touch focus is left alone,
    // otherwise the track jumps between press and release and the click lands on another card.
    const fromKeyboard = (el) => {
      try {
        return el.matches(':focus-visible');
      } catch {
        return true;
      }
    };
    const onFocus = (e) => {
      const item = e.target.closest('.hsec__item');
      const st = tween.scrollTrigger;
      if (!item || !st || !fromKeyboard(e.target)) return;
      const left = item.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || 0);
      const progress = Math.min(1, Math.max(0, left / distance()));
      scrollTo({ top: st.start + progress * (st.end - st.start), behavior: 'instant' });
    };
    track.addEventListener('focusin', onFocus);
    viewport.scrollLeft = 0;

    return () => {
      track.removeEventListener('focusin', onFocus);
      section.classList.remove('is-pinned');
      section.querySelector('.hsec__pin').insertBefore(head, viewport);
      intro.remove();
      if (bar) bar.style.transform = '';
    };
  }

  // Big words run like a ticker, but only when you scroll: scroll down and the rows
  // travel in opposite directions, scroll up and they reverse. Faster scrolling
  // pushes them harder and leans the letters; they glide to a stop when you do.
  // (No motion without scrolling, so nothing moves on its own.)
  function marquees() {
    const rows = $$('[data-marquee]');
    if (!rows.length) return null;
    const section = rows[0].parentElement;
    const items = rows.map((row) => ({
      row,
      dir: Number(row.dataset.marquee) || 1,
      x: 0,
      half: 1,
      setX: gsap.quickSetter(row, 'x', 'px'),
      setSkew: gsap.quickSetter(row, 'skewX', 'deg'),
    }));
    const measure = () => items.forEach((it) => (it.half = Math.max(1, it.row.scrollWidth / 2)));
    measure();
    items.forEach((it, i) => {
      it.x = i % 2 ? -it.half * 0.5 : 0;
      it.setX(it.x);
    });

    let lastY = scrollY;
    let vel = 0;
    let active = false;
    const clampSkew = gsap.utils.clamp(-12, 12);
    const tick = () => {
      const y = scrollY;
      const dy = y - lastY;
      lastY = y;
      vel += (dy - vel) * 0.12;
      if (Math.abs(vel) < 0.01) vel = 0;
      if (!active || (!vel && !dy)) return;
      const skew = clampSkew(vel * -0.35);
      items.forEach((it) => {
        it.x -= it.dir * vel * 1.6;
        if (it.x <= -it.half) it.x += it.half;
        if (it.x > 0) it.x -= it.half;
        it.setX(it.x);
        it.setSkew(skew * it.dir);
      });
    };
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        active = self.isActive;
        lastY = scrollY;
      },
    });
    gsap.ticker.add(tick);
    ScrollTrigger.addEventListener('refresh', measure);
    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener('refresh', measure);
      st.kill();
      gsap.set(rows, { clearProps: 'transform' });
    };
  }

  // Testimonials glide sideways while the section scrolls past
  function drift() {
    $$('[data-drift]').forEach((track) => {
      if (getComputedStyle(track).overflowX !== 'visible') return;
      gsap.fromTo(
        track,
        { x: () => Math.min(0, root.clientWidth * 0.08) },
        { x: () => -Math.max(0, track.scrollWidth - root.clientWidth) - root.clientWidth * 0.04, ease: 'none', scrollTrigger: { trigger: track, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } },
      );
    });
  }

  // --------------------------------------------------- stacking cards

  function stack() {
    $$('[data-stack]').forEach((list) => {
      const cards = $$(':scope > li', list);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(
          card,
          { scale: 1, rotationX: 0, filter: 'brightness(1)' },
          { scale: 0.9, rotationX: 9, transformPerspective: 1400, filter: 'brightness(0.95)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 30%', scrub: true } },
        );
      });
    });
  }

  // --------------------------------------------------------- process

  // Large screens: the section pins while the sun rises across four steps
  function processPinned() {
    const section = $('[data-process]');
    if (!section) return null;
    const arc = $('[data-process-arc]', section);
    const sun = $('.process__sun', section);
    const steps = $$('.process__step', section);
    section.classList.add('is-pinned');
    gsap.set(steps, { opacity: 0, y: 50 });
    gsap.set(steps[0], { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${steps.length * 0.75 * innerHeight}`, pin: true, scrub: true, invalidateOnRefresh: true, refreshPriority: 1 },
    });
    tl.fromTo(arc, { rotation: -62 }, { rotation: 62, ease: 'none', duration: steps.length }, 0);
    tl.fromTo(sun, { rotation: 62 }, { rotation: -62, ease: 'none', duration: steps.length }, 0);
    steps.forEach((step, i) => {
      if (!i) return;
      tl.to(steps[i - 1], { opacity: 0, y: -60, duration: 0.25, ease: 'power2.in' }, i - 0.3);
      tl.fromTo(step, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', immediateRender: false }, i - 0.05);
    });
    tl.to({}, { duration: 0.3 });

    return () => {
      section.classList.remove('is-pinned');
      gsap.set(steps, { clearProps: 'all' });
    };
  }

  function processSimple() {
    const section = $('[data-process]');
    if (!section) return;
    const steps = $$('.process__step', section);
    gsap.fromTo($('[data-process-arc]', section), { rotation: -62 }, { rotation: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'center center', scrub: true } });
    gsap.from(steps, { opacity: 0, y: 44, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: steps[0], start: 'top 88%', once: true } });
  }

  // ----------------------------------------------------------- footer

  function footerWord() {
    const el = $('[data-footer-word]');
    if (!el) return;
    gsap.from(el, {
      yPercent: 70,
      scaleY: 0.6,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  }

  // ------------------------------------------------------ pointer fx

  function magnetic() {
    $$('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expo.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expo.out' });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.22);
        y((e.clientY - (r.top + r.height / 2)) * 0.32);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
    });
  }

  // Services index: a photo follows the pointer over each row
  function hoverPreview() {
    const box = $('[data-hover-preview]');
    if (!box) return;
    const imgs = $$('[data-preview-img]', box);
    const x = gsap.quickTo(box, 'x', { duration: 0.7, ease: 'expo.out' });
    const y = gsap.quickTo(box, 'y', { duration: 0.7, ease: 'expo.out' });
    const r = gsap.quickTo(box, 'rotation', { duration: 0.9, ease: 'expo.out' });
    gsap.set(box, { scale: 0.85 });
    let px = -1;
    let py = -1;
    let lastX = 0;
    let current = null;
    let queued = false;

    const show = (row) => {
      if (row === current) return;
      const appearing = !current;
      current = row;
      if (!row) {
        gsap.to(box, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        return;
      }
      imgs.forEach((im) => im.classList.toggle('is-active', im.dataset.previewImg === row.dataset.preview));
      if (appearing) {
        // Start right at the pointer instead of gliding over from wherever it was last seen
        x(px + 32, px + 32);
        y(py - box.offsetHeight / 2, py - box.offsetHeight / 2);
      }
      gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    };

    // Rows slide under a still pointer while the page scrolls, and browsers send enter and leave
    // events late or not at all then. So look up the row under the pointer on every move and scroll.
    const check = () => {
      queued = false;
      const el = px < 0 ? null : d.elementFromPoint(px, py);
      show(el ? el.closest('[data-preview]') : null);
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(check);
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      x(px + 32);
      y(py - box.offsetHeight / 2);
      r(gsap.utils.clamp(-8, 8, (px - lastX) * 0.4));
      lastX = px;
      queue();
    };
    const away = () => {
      px = -1;
      show(null);
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('scroll', queue, { passive: true });
    root.addEventListener('pointerleave', away);
    addEventListener('blur', away);

    return () => {
      removeEventListener('pointermove', onMove);
      removeEventListener('scroll', queue);
      root.removeEventListener('pointerleave', away);
      removeEventListener('blur', away);
    };
  }

  // ------------------------------------------- no animation required

  // Button and nav labels roll up to a fresh copy on hover (the copy is hidden from screen readers)
  function rollingLabels() {
    $$('.btn__label:not([data-submit-label]), .nav__link').forEach((el) => {
      if (el.querySelector('.roll') || el.children.length) return;
      const text = el.textContent;
      const a = d.createElement('span');
      a.className = 'roll__a';
      a.textContent = text;
      const b = d.createElement('span');
      b.className = 'roll__b';
      b.setAttribute('aria-hidden', 'true');
      b.textContent = text;
      const wrap = d.createElement('span');
      wrap.className = 'roll';
      wrap.append(a, b);
      el.replaceChildren(wrap);
    });
  }

  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;
    let last = scrollY;
    let ticking = false;
    const update = () => {
      const y = scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      if (y > last + 4 && y > 240) header.classList.add('is-hidden');
      else if (y < last - 4) header.classList.remove('is-hidden');
      last = y;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function initMenu() {
    const dialog = $('[data-menu]');
    const openBtn = $('[data-menu-open]');
    if (!dialog || !openBtn || typeof dialog.showModal !== 'function') return;
    const closeBtn = $('[data-menu-close]', dialog);
    const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

    const open = () => {
      dialog.classList.remove('is-closing');
      dialog.showModal();
      openBtn.setAttribute('aria-expanded', 'true');
      root.style.overflow = 'hidden';
    };
    const close = () => {
      if (!dialog.open) return;
      const done = () => {
        dialog.classList.remove('is-closing');
        dialog.close();
      };
      if (reduce()) return done();
      dialog.classList.add('is-closing');
      dialog.addEventListener('animationend', done, { once: true });
    };
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      close();
    });
    dialog.addEventListener('close', () => {
      openBtn.setAttribute('aria-expanded', 'false');
      root.style.overflow = '';
      openBtn.focus();
    });
    // Close if the screen grows past the mobile menu breakpoint
    matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && dialog.open && dialog.close());
  }

  function initFaq() {
    $$('[data-faq]').forEach((faq) => {
      faq.classList.add('is-enhanced');
      $$('[data-faq-toggle]', faq).forEach((btn) => {
        const item = btn.closest('.faq__item');
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') !== 'true';
          btn.setAttribute('aria-expanded', String(open));
          item.classList.toggle('is-open', open);
        });
      });
    });
  }

  function initForm() {
    const form = $('[data-contact-form]');
    if (!form) return;
    const status = $('[data-form-status]', form);
    const submit = $('button[type="submit"]', form);
    const label = $('[data-submit-label]', form);
    const started = $('[data-started]', form);
    const wrap = $('[data-form-wrap]');
    const done = $('[data-form-done]');
    started.value = String(Date.now());

    // ?service=physical-therapy preselects the matching service
    const slug = new URLSearchParams(location.search).get('service');
    if (slug) {
      const opt = $$('#service option', form).find((o) => o.dataset.slug === slug);
      if (opt) opt.selected = true;
    }

    const rules = {
      firstName: (v) => (v ? '' : 'Please enter your first name.'),
      lastName: (v) => (v ? '' : 'Please enter your last name.'),
      email: (v) => (!v ? 'Please enter your email address.' : /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[A-Za-z]{2,}$/.test(v) ? '' : 'Please enter a valid email address, like name@example.com.'),
      phone: (v) => (!v || /^[0-9+().\s]{7,40}$/.test(v.replace(/[‐-―-]/g, ' ')) ? '' : 'Please enter a valid phone number.'),
      message: (v) => (v ? '' : 'Please tell us a little about how we can help.'),
    };

    const setError = (name, msg) => {
      const input = form.elements[name];
      const out = $(`#${name}-error`, form);
      if (!input || !out) return;
      if (msg) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      out.textContent = msg || '';
    };

    // Errors appear on submit and clear as soon as the field is fixed.
    // (Validating on blur would shift the layout under the pointer and swallow the submit click.)
    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener('input', () => {
        if (input.hasAttribute('aria-invalid') && !rules[name](input.value.trim())) setError(name, '');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form__status';

      let first = null;
      for (const [name, check] of Object.entries(rules)) {
        const msg = check(form.elements[name].value.trim());
        setError(name, msg);
        if (msg && !first) first = form.elements[name];
      }
      if (first) {
        status.classList.add('is-error');
        status.textContent = 'Please correct the highlighted fields.';
        first.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      submit.setAttribute('aria-disabled', 'true');
      submit.disabled = true;
      label.textContent = 'Sending';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body.ok) {
          wrap.hidden = true;
          done.hidden = false;
          done.focus();
          return;
        }
        if (body.errors) {
          Object.entries(body.errors).forEach(([k, v]) => setError(k, v));
          const firstErr = Object.keys(body.errors)[0];
          if (form.elements[firstErr]) form.elements[firstErr].focus();
        }
        throw new Error(body.message || 'Something went wrong.');
      } catch (err) {
        status.classList.add('is-error');
        status.textContent = err && err.message && !/fetch|network/i.test(err.message) ? err.message : 'Sorry, we could not send your message. Please try again or call us at (818) 987 4173.';
      } finally {
        submit.removeAttribute('aria-disabled');
        submit.disabled = false;
        label.textContent = 'Send message';
      }
    });
  }
})();
