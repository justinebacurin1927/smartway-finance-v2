(() => {
  const hero = document.querySelector('.hero');
  const video = hero?.querySelector('.hero-motion');
  if (!video) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = hero.getBoundingClientRect().bottom > 0;
  let failed = false;
  video.muted = true;
  video.defaultMuted = true;

  function sync() {
    if (motion.matches || failed) {
      video.pause();
      video.classList.remove('is-playing');
      return;
    }
    if (!visible || document.hidden) {
      video.pause();
      return;
    }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    video.play().catch(() => {
      // Keep the still poster when the browser blocks autoplay.
      if (video.paused) video.classList.remove('is-playing');
    });
  }

  video.addEventListener('playing', () => {
    if (motion.matches || !visible || document.hidden || failed) {
      video.pause();
      return;
    }
    video.classList.add('is-playing');
  });
  video.addEventListener('error', () => { failed = true; sync(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pageshow', sync);
  motion.addEventListener('change', sync);
  sync();
})();
