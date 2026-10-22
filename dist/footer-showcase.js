(() => {
  const root = document.querySelector('.footer-showcase');
  if (!root) return;
  const cards = [...root.querySelectorAll('.footer-showcase-card')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let visible = false;

  function render() {
    frame = 0;
    if (motion.matches) return;
    const bounds = root.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    const travel = Math.min(bounds.width * .055, 72);
    cards.forEach((card, index) => {
      card.style.setProperty('--ribbon-shift', `${(progress - .5) * travel}px`);
      card.style.setProperty('--ribbon-lift', `${Math.sin(index * .8 + progress * Math.PI) * 9}px`);
      card.style.setProperty('--ribbon-turn', `${(progress - .5) * (index % 2 ? 7 : -7)}deg`);
    });
  }

  function schedule() {
    if (!frame && !motion.matches) frame = requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) schedule();
  });
  observer.observe(root);
  window.addEventListener('scroll', () => { if (visible) schedule(); }, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  motion.addEventListener('change', () => {
    if (motion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      cards.forEach(card => ['--ribbon-shift', '--ribbon-lift', '--ribbon-turn'].forEach(name => card.style.removeProperty(name)));
    } else schedule();
  });
  schedule();
})();
