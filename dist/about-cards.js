(() => {
  const grid = document.querySelector('.about-story-cards');
  if (!grid) return;
  const section = grid.closest('#about');
  const cards = [...grid.querySelectorAll('[data-about-card]')];
  if (cards.length !== 3) return;
  const compact = matchMedia('(max-width: 1100px)');
  const collapseAll = grid.hasAttribute('data-collapse-all');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let finishTimer = 0;
  let resizeFrame = 0;

  const notifyLayout = () => section.dispatchEvent(new Event('about:layout'));
  function sync() {
    grid.dataset.activeCard = String(active);
    cards.forEach((card, index) => {
      const selected = index === active;
      const toggle = card.querySelector('.about-card-toggle');
      const details = card.querySelector('.about-card-details');
      card.classList.toggle('is-active', selected);
      toggle.hidden = false;
      toggle.setAttribute('aria-pressed', String(selected));
      if (compact.matches || collapseAll) toggle.setAttribute('aria-expanded', String(selected));
      else toggle.removeAttribute('aria-expanded');
      details.inert = (compact.matches || collapseAll) && !selected;
      if (details.inert) details.setAttribute('aria-hidden', 'true');
      else details.removeAttribute('aria-hidden');
    });
  }

  function holdRowHeight() {
    grid.style.removeProperty('min-height');
    if (!compact.matches) grid.style.minHeight = `${grid.getBoundingClientRect().height}px`;
    notifyLayout();
  }

  function select(index) {
    if (index === active || !cards[index]) return;
    active = index;
    clearTimeout(finishTimer);
    const focusedDetails = document.activeElement?.closest('.about-card-details');
    if ((compact.matches || collapseAll) && focusedDetails && !cards[active].contains(focusedDetails)) {
      cards[active].querySelector('.about-card-toggle').focus({ preventScroll: true });
    }
    sync();
    notifyLayout();
    const finish = () => {
      notifyLayout();
      const top = cards[active].getBoundingClientRect().top;
      if (compact.matches && (top < 100 || top > innerHeight - 100)) {
        cards[active].scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' });
      }
    };
    if (motion.matches) finish();
    else finishTimer = setTimeout(finish, 680);
  }

  grid.classList.add('about-cards-ready');
  sync();
  holdRowHeight();
  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-about-card]');
    if (!card || event.target.closest('a') || getSelection()?.toString()) return;
    select(cards.indexOf(card));
  });
  grid.addEventListener('keydown', event => {
    if (!event.target.closest('.about-card-toggle')) return;
    const index = cards.indexOf(event.target.closest('[data-about-card]'));
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 :
      ['ArrowRight', 'ArrowDown'].includes(event.key) ? (index + 1) % cards.length :
      ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (index + cards.length - 1) % cards.length : null;
    if (next === null) return;
    event.preventDefault();
    cards[next].querySelector('.about-card-toggle').focus({ preventScroll: true });
    select(next);
  });
  function resize() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      sync();
      holdRowHeight();
    });
  }
  compact.addEventListener('change', resize);
  window.addEventListener('resize', resize, { passive: true });
  document.fonts?.ready.then(holdRowHeight);
})();
