(() => {
  function animateHeading(config) {
    const title = document.querySelector(config.title);
    if (!title) return;

    const section = title.closest(config.section);
    const panel = section.querySelector(config.panel);
    const words = [...title.querySelectorAll(config.words)];
    if (words.length !== config.anchors.length || !panel) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const clamp = value => Math.max(0, Math.min(1, value));
    const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
    const anchors = config.anchors;
    let geometry;
    let surfaces = [];
    let needsMeasure = true;
    let frame = 0;
    let visible = false;
    let displayedProgress = 0;
    let previousTime = 0;

    function measure() {
      const bounds = title.getBoundingClientRect();
      const field = ((config.field && section.querySelector(config.field)) || section).getBoundingClientRect();
      // With stacked cards, gather within the first card's artwork, above its copy.
      if (config.compact && innerWidth <= 1100) {
        const firstCopy = section.querySelector('.about-card-copy')?.getBoundingClientRect();
        if (firstCopy) field.height = Math.min(field.height, firstCopy.top - field.top - 12);
      }
      const relative = rect => ({ x: rect.left - field.left, y: rect.top - field.top, width: rect.width, height: rect.height });
      const protectedAreas = [...section.querySelectorAll(config.protected)].flatMap(element => {
        if (element.matches('.finance-scene-copy, .finance-word-icon, .about-card-copy, .benefit-item, .process-intro, .process-cinema .motion-film, .process-cinema-bottom, .reviews-heading-icon, .reviews-carousel, .reviews-controls')) return [relative(element.getBoundingClientRect())];
        const range = document.createRange();
        range.selectNodeContents(element);
        return [...range.getClientRects()].map(relative);
      });
      const photo = config.photos?.map(selector => section.querySelector(selector)).find(Boolean);
      if (photo) protectedAreas.push(relative(photo.getBoundingClientRect()));
      surfaces = config.surfaces ? [...section.querySelectorAll(config.surfaces)].map(element => ({ ...relative(element.getBoundingClientRect()), color: getComputedStyle(element).color })) : [];
      const placed = [];
      const intersects = (a, b, gap = 8) => a.x < b.x + b.width + gap && a.x + a.width + gap > b.x && a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;

      const placementOrder = words.map((_word, index) => index);
      // Reserve room for long words before filling the gaps with shorter ones.
      if (config.packLargestFirst) placementOrder.sort((a, b) => words[b].offsetWidth - words[a].offsetWidth);
      geometry = new Array(words.length);
      placementOrder.forEach(index => {
        const word = words[index];
        const width = word.offsetWidth;
        const height = word.offsetHeight;
        const maxX = field.width - width - 16;
        const maxY = field.height - height - 16;
        const desired = { x: 16 + (maxX - 16) * anchors[index].x, y: 16 + (maxY - 16) * anchors[index].y };
        const candidates = [];
        for (let y = 16; y <= maxY; y += 20) {
          for (let x = 16; x <= maxX; x += 20) {
            const candidate = { x, y, width, height };
            if (!protectedAreas.some(area => intersects(candidate, area)) && !placed.some(area => intersects(candidate, area, 16))) {
              candidates.push(candidate);
            }
          }
        }
        candidates.sort((a, b) => Math.hypot((a.x - desired.x) / field.width, (a.y - desired.y) / field.height) - Math.hypot((b.x - desired.x) / field.width, (b.y - desired.y) / field.height));
        const start = candidates[0] ?? { ...desired, width, height };
        placed.push(start);
        geometry[index] = {
          x: field.left + start.x - bounds.left - word.offsetLeft,
          y: field.top + start.y - bounds.top - word.offsetTop,
          homeX: bounds.left - field.left + word.offsetLeft + width / 2,
          homeY: bounds.top - field.top + word.offsetTop + height / 2
        };
      });
      needsMeasure = false;
    }

    function render(time) {
      frame = 0;
      if (motion.matches) return;
      if (needsMeasure) measure();

      const top = section.getBoundingClientRect().top;
      const entry = innerHeight * .7;
      const finish = config.finish ? config.finish(innerHeight) : Math.max(100, innerHeight * .14);
      const target = clamp((entry - top) / Math.max(1, entry - finish));
      let progress = target;
      if (config.response) {
        if (document.documentElement.classList.contains('intro-active')) {
          displayedProgress = 0;
          previousTime = 0;
        } else if (visible) {
          const elapsed = previousTime ? Math.min(64, time - previousTime) : 16;
          previousTime = time;
          displayedProgress += (target - displayedProgress) * (1 - Math.exp(-elapsed / config.response));
          if (Math.abs(target - displayedProgress) < .001) displayedProgress = target;
        } else {
          previousTime = 0;
          if (top > innerHeight) displayedProgress = 0;
        }
        progress = displayedProgress;
      }
      // Bring the words into sentence order before closing the vertical gaps.
      const horizontal = smooth(progress / .7);
      const vertical = smooth((progress - .5) / .5);
      words.forEach((word, index) => {
        const start = geometry[index];
        const x = start.x * (1 - horizontal);
        const y = start.y * (1 - vertical);
        word.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (config.surfaces) {
          const surface = surfaces.find(area => start.homeX + x >= area.x && start.homeX + x <= area.x + area.width && start.homeY + y >= area.y && start.homeY + y <= area.y + area.height);
          if (surface) word.style.color = surface.color;
          else word.style.removeProperty('color');
        }
      });
      title.dataset.progress = progress.toFixed(4);
      if (config.response && visible && Math.abs(target - progress) >= .001 && !document.documentElement.classList.contains('intro-active')) schedule();
    }

    function schedule() {
      if (!frame && !motion.matches) frame = requestAnimationFrame(render);
    }

    function updateMotion() {
      title.classList.toggle(config.motionClass, !motion.matches);
      needsMeasure = true;
      if (motion.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        words.forEach(word => { word.style.removeProperty('transform'); word.style.removeProperty('color'); });
        title.dataset.progress = '1';
      } else {
        displayedProgress = 0;
        previousTime = 0;
        schedule();
      }
    }

    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }, { rootMargin: '150px 0px' });
    observer.observe(section);
    const sizeObserver = new ResizeObserver(() => { needsMeasure = true; schedule(); });
    sizeObserver.observe(title);
    sizeObserver.observe(section);
    const sceneObserver = new MutationObserver(() => { needsMeasure = true; schedule(); });
    sceneObserver.observe(panel, { attributes: true, attributeFilter: ['hidden'], subtree: true });
    window.addEventListener('scroll', () => { if (visible) schedule(); }, { passive: true });
    window.addEventListener('resize', () => { needsMeasure = true; schedule(); }, { passive: true });
    window.addEventListener('pageshow', () => { needsMeasure = true; schedule(); });
    if (config.layoutEvent) section.addEventListener(config.layoutEvent, () => { needsMeasure = true; schedule(); });
    if (config.response) window.addEventListener('hashchange', () => {
      if (location.hash === `#${section.id}`) {
        displayedProgress = 0;
        previousTime = 0;
        schedule();
      }
    });
    motion.addEventListener('change', updateMotion);
    document.fonts?.ready.then(() => { needsMeasure = true; schedule(); });
    if (config.response && document.documentElement.classList.contains('intro-active')) {
      const introObserver = new MutationObserver(() => {
        schedule();
        if (!document.documentElement.classList.contains('intro-active')) introObserver.disconnect();
      });
      introObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
    updateMotion();
  }

  // The About page uses this same engine with its own protected content and headings.
  window.SmartwayHeadingMotion = animateHeading;

  // Reuse the scatter-and-gather motion as each section enters the viewport.
  animateHeading({
    title: '#finance-title', section: '#finance', panel: '.finance-theatre',
    words: '.finance-title-piece', field: '.finance-orbit-stage', motionClass: 'finance-title-motion',
    protected: '.finance-word-title, .finance-word-number, .finance-word-icon, .finance-selector-note, .finance-scene.is-active .finance-scene-copy, .finance-section-foot a, .finance-section-foot > span',
    photos: ['.finance-orbit-item[data-slot="active"]', '.finance-scene.is-active .finance-photo-mask'],
    layoutEvent: 'finance:layout',
    anchors: [{ x: .03, y: .04 }, { x: .87, y: .16 }, { x: .46, y: .43 }, { x: .025, y: .64 }, { x: .2, y: .87 }, { x: .94, y: .63 }, { x: .6, y: .92 }]
  });
  animateHeading({
    title: '#about-title', section: '#about', panel: '.about-story-cards',
    words: '.about-title-piece', field: '.about-intro-stage', motionClass: 'about-title-motion',
    protected: '.about-editorial-heading .about-editorial-label, .about-card-copy',
    surfaces: '.about-story-card', compact: true, layoutEvent: 'about:layout',
    // Settle above the cards, including when the fixed navigation opens About.
    response: 160, finish: height => Math.max(240, height * .3),
    anchors: [{ x: .03, y: .08 }, { x: .9, y: .34 }, { x: .43, y: .42 }, { x: .07, y: .76 }, { x: .72, y: .7 }]
  });
  animateHeading({
    title: '#benefit-title', section: '#benefits', panel: '.benefit-list',
    words: '.benefit-title-piece', motionClass: 'benefit-title-motion', layoutEvent: 'benefits:layout',
    protected: '.benefit-stories-heading .about-editorial-label, .benefit-stories-heading > a, .benefit-item',
    response: 160, finish: height => Math.max(240, height * .3),
    anchors: [{ x: .05, y: .05 }, { x: .87, y: .12 }, { x: .48, y: .39 }, { x: .03, y: .57 }, { x: .76, y: .6 }, { x: .25, y: .85 }, { x: .9, y: .91 }]
  });
  animateHeading({
    title: '#process-title', section: '#process', panel: '.motion-film',
    words: '.process-title-piece', motionClass: 'process-title-motion',
    protected: '.process-kicker, .process-intro, .motion-film, .process-cinema-bottom',
    packLargestFirst: true,
    response: 160, finish: height => Math.max(240, height * .3),
    anchors: [{ x: .02, y: .08 }, { x: .7, y: .13 }, { x: .35, y: .68 }, { x: .89, y: .9 }, { x: .12, y: .86 }, { x: .55, y: .4 }, { x: .82, y: .55 }, { x: .25, y: .15 }, { x: .47, y: .92 }, { x: .04, y: .48 }]
  });
  animateHeading({
    title: '#reviews-title', section: '#testimonials', panel: '.reviews-carousel',
    words: '.reviews-title-piece', motionClass: 'reviews-title-motion',
    protected: '.reviews-heading .eyebrow, .reviews-description, .reviews-heading-icon, .reviews-carousel, .reviews-controls, .reviews-source',
    packLargestFirst: true,
    response: 160, finish: height => Math.max(240, height * .3),
    anchors: [{ x: .02, y: .08 }, { x: .64, y: .28 }, { x: .2, y: .74 }, { x: .88, y: .84 }]
  });
})();
