(() => {
  const section = document.querySelector('#benefits');
  const cards = [...(section?.querySelectorAll('.benefit-item') || [])];
  if (!cards.length || !('IntersectionObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const played = new WeakSet();
  const animations = new Set();
  const notifyLayout = () => section.dispatchEvent(new Event('benefits:layout'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || motion.matches || played.has(entry.target)) return;
      const card = entry.target;
      played.add(card);
      observer.unobserve(card);
      const animation = card.animate([
        { opacity: .55, translate: '0 34px', scale: .965 },
        { opacity: 1, translate: '0 -3px', scale: 1.005, offset: .78 },
        { opacity: 1, translate: '0 0', scale: 1 }
      ], {
        duration: 850,
        delay: (cards.indexOf(card) % 2) * 100,
        easing: 'cubic-bezier(.22,1,.36,1)',
        fill: 'backwards'
      });
      animations.add(animation);
      animation.finished.then(() => {
        animations.delete(animation);
        notifyLayout();
      }).catch(() => animations.delete(animation));
    });
  }, { threshold: .12 });

  function updateMotion() {
    if (motion.matches) {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      notifyLayout();
    } else cards.forEach(card => { if (!played.has(card)) observer.observe(card); });
  }
  motion.addEventListener('change', updateMotion);
  updateMotion();
})();
