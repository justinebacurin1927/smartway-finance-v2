(() => {
  const section = document.querySelector('#finance');
  if (!section?.classList.contains('is-enhanced')) return;
  const stage = section.querySelector('.finance-orbit-stage');
  const scenes = [...section.querySelectorAll('[data-finance-scene]')];
  const tabs = [...section.querySelectorAll('[data-finance-choice]')];
  const container = section.querySelector('.finance-scenes');
  if (!stage || scenes.length !== 5 || scenes.some(scene => !scene.querySelector('.finance-photo-mask img'))) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const roomy = matchMedia('(min-width: 1101px) and (min-height: 760px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const gallery = document.createElement('div');
  gallery.className = 'finance-orbit-gallery';
  gallery.setAttribute('role', 'group');
  gallery.setAttribute('aria-label', 'Browse finance options');
  const number = document.createElement('span');
  number.className = 'finance-orbit-number';
  number.setAttribute('aria-hidden', 'true');
  gallery.append(number);
  const items = scenes.map((scene, index) => {
    const image = scene.querySelector('.finance-photo-mask img');
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'finance-orbit-item';
    item.dataset.index = index;
    const picture = image.cloneNode();
    picture.alt = '';
    picture.loading = 'eager';
    picture.draggable = false;
    item.append(picture);
    item.addEventListener('click', () => request(index, 'control'));
    gallery.append(item);
    return item;
  });
  const ring = scenes[0].querySelector('.finance-orbit')?.cloneNode(true);
  if (ring) {
    ring.querySelector('path').id = 'finance-orbit-gallery-path';
    ring.querySelector('textPath').setAttribute('href', '#finance-orbit-gallery-path');
    gallery.append(ring);
  }
  const instruction = section.querySelector('.finance-selector-note');
  instruction.classList.add('finance-orbit-instruction');
  instruction.innerHTML = '<span>Scroll through your options. </span>Select a loan or smaller photo.';
  container.prepend(gallery);
  section.classList.add('has-finance-orbit');

  let selected = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
  let frame = 0;
  let measureNeeded = true;
  let distance = 0;
  let pinned = false;
  let visible = false;
  const pinTop = 94;

  function request(index, source) {
    section.dispatchEvent(new CustomEvent('finance:request', { detail: { index, source } }));
  }

  function render(index) {
    const focused = gallery.contains(document.activeElement);
    selected = index;
    items.forEach((item, itemIndex) => {
      const relative = (itemIndex - index + items.length) % items.length;
      const slot = relative === 0 ? 'active' : relative === 1 ? 'next' : relative === items.length - 1 ? 'prev' : 'back';
      item.dataset.slot = slot;
      const interactive = slot === 'prev' || slot === 'next';
      item.tabIndex = interactive ? 0 : -1;
      item.setAttribute('aria-hidden', String(!interactive));
      item.setAttribute('aria-label', `Show ${slot === 'prev' ? 'previous' : 'next'} option: ${tabs[itemIndex].textContent.trim()}`);
    });
    number.textContent = String(index + 1).padStart(2, '0');
    gallery.dataset.selected = index;
    // Preserve keyboard focus when a thumbnail becomes the large decorative image.
    if (focused) tabs[index].focus({ preventScroll: true });
  }

  function measure() {
    const wasPinned = pinned;
    pinned = roomy.matches && !motion.matches;
    section.classList.toggle('is-orbit-pinned', pinned);
    if (pinned && stage.getBoundingClientRect().height > innerHeight - pinTop - 8) {
      pinned = false;
      section.classList.remove('is-orbit-pinned');
    }
    distance = pinned ? innerHeight * 1.65 : 0;
    if (pinned) section.style.height = `${stage.getBoundingClientRect().height + distance}px`;
    else section.style.removeProperty('height');
    if (wasPinned !== pinned) section.dispatchEvent(new Event('finance:layout'));
    measureNeeded = false;
  }

  function tick() {
    frame = 0;
    if (measureNeeded) measure();
    if (!pinned || !visible) return;
    const top = section.getBoundingClientRect().top;
    const progress = clamp((pinTop - top) / distance);
    // Keep manual selections when this section has left the viewport.
    if (top > innerHeight || top + section.offsetHeight < 0) return;
    const index = Math.round(progress * (items.length - 1));
    if (index !== selected) request(index, 'scroll');
    section.dataset.orbitProgress = progress.toFixed(4);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  section.addEventListener('finance:select', event => {
    const { index, source } = event.detail;
    render(index);
    if (source === 'control' && pinned) {
      const sectionTop = scrollY + section.getBoundingClientRect().top;
      // The stage stays still; only the orbit animates to the selected option.
      scrollTo({ top: sectionTop - pinTop + index / (items.length - 1) * distance, behavior: 'instant' });
    }
  });
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { rootMargin: '100px' });
  observer.observe(section);
  const resizeObserver = new ResizeObserver(() => { measureNeeded = true; schedule(); });
  resizeObserver.observe(stage);
  addEventListener('scroll', () => { if (visible) schedule(); }, { passive: true });
  addEventListener('resize', () => { measureNeeded = true; schedule(); }, { passive: true });
  addEventListener('pageshow', () => { measureNeeded = true; schedule(); });
  motion.addEventListener('change', () => { measureNeeded = true; schedule(); });
  document.fonts?.ready.then(() => { measureNeeded = true; schedule(); });
  render(selected);
  measure();
  schedule();
})();
