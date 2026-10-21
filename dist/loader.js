(() => {
  const intro = document.querySelector('#smartway-intro');
  const content = document.querySelector('#site-content');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let exitTimer;
  let removeTimer;
  let exiting = false;

  function removeIntro() {
    const hadFocus = intro.contains(document.activeElement);
    clearTimeout(window.smartwayIntroSafety);
    clearTimeout(exitTimer);
    clearTimeout(removeTimer);
    root.classList.remove('intro-active', 'intro-revealing');
    content.inert = false;
    intro.remove();
    if (hadFocus) content.querySelector('.skip').focus({ preventScroll: true });
    document.removeEventListener('keydown', onKey);
    motion.removeEventListener('change', onMotionChange);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('resize', removeIntro);
  }

  function exitIntro(skip = false) {
    if (exiting) return;
    exiting = true;
    if (skip || motion.matches) { removeIntro(); return; }

    const logo = intro.querySelector('.intro-logo');
    const from = logo.getBoundingClientRect();
    const to = content.querySelector('.header .brand img').getBoundingClientRect();
    logo.style.left = `${from.left}px`;
    logo.style.top = `${from.top}px`;
    logo.style.transform = 'none';
    if (to.bottom > 0 && to.top < innerHeight) {
      logo.animate([
        { transform: 'translate(0, 0) scale(1)', filter: 'brightness(0) invert(1) drop-shadow(0 16px 28px #0005)' },
        { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})`, filter: 'brightness(0) invert(1) drop-shadow(0 0 0 transparent)' }
      ], { duration: 1000, easing: 'cubic-bezier(.65, 0, .25, 1)', fill: 'forwards' });
    } else {
      logo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
    }
    intro.querySelector('.intro-backdrop').animate([{ opacity: .92 }, { opacity: 0 }], {
      duration: 900, delay: 100, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards'
    });
    intro.querySelector('.intro-skip').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    intro.classList.add('intro-exiting');
    root.classList.add('intro-revealing');
    removeTimer = setTimeout(removeIntro, 1050);
  }

  function onKey(event) { if (event.key === 'Escape') exitIntro(true); }
  function onMotionChange() { if (motion.matches) removeIntro(); }
  function onPageShow(event) { if (event.persisted) removeIntro(); }

  if (intro.hidden || motion.matches) { removeIntro(); return; }
  intro.querySelector('.intro-skip').addEventListener('click', () => exitIntro(true));
  document.addEventListener('keydown', onKey);
  motion.addEventListener('change', onMotionChange);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('resize', removeIntro);
  exitTimer = setTimeout(() => exitIntro(), 650);
})();
