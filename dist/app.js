const video = document.querySelector('.hero-video');
const toggle = document.querySelector('#video-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updatePlayback() {
  toggle.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
  toggle.querySelector('use').setAttribute('href', video.paused ? '#play' : '#pause');
}
function loadVideo() {
  const source = video.querySelector('source');
  if (!source.getAttribute('src')) {
    source.src = source.dataset.src;
    video.load();
  }
  return video.play().catch(updatePlayback);
}
if (video && toggle) {
  video.addEventListener('play', updatePlayback);
  video.addEventListener('pause', updatePlayback);
  toggle.addEventListener('click', () => video.paused ? loadVideo() : video.pause());
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) video.pause(); });
  if (!reducedMotion.matches && !navigator.connection?.saveData) loadVideo();
}
const menuButton = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  mobileMenu.hidden = !mobileMenu.hidden;
  menuButton.setAttribute('aria-expanded', String(!mobileMenu.hidden));
  menuButton.setAttribute('aria-label', mobileMenu.hidden ? 'Open navigation' : 'Close navigation');
});
mobileMenu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!mobileMenu.hidden) { closeMenu(); menuButton.focus(); }
    document.querySelector('.finance-menu').open = false;
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.finance-menu')) document.querySelector('.finance-menu').open = false;
  if (!event.target.closest('.header')) closeMenu();
});
const lenders = document.querySelector('.lenders');
const marqueeToggle = document.querySelector('#marquee-toggle');
function setMarqueePaused(paused) {
  lenders.classList.toggle('is-paused', paused);
  marqueeToggle.setAttribute('aria-label', paused ? 'Play lender marquee' : 'Pause lender marquee');
  marqueeToggle.querySelector('use').setAttribute('href', paused ? '#play' : '#pause');
}
setMarqueePaused(reducedMotion.matches);
marqueeToggle.addEventListener('click', () => {
  lenders.classList.add('motion-enabled');
  setMarqueePaused(!lenders.classList.contains('is-paused'));
});
reducedMotion.addEventListener('change', () => {
  lenders.classList.remove('motion-enabled');
  setMarqueePaused(reducedMotion.matches);
});
