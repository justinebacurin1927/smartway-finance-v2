const header = document.querySelector('.hero > .header');
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('pageshow', updateHeader);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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
  }
});
document.addEventListener('click', event => {
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
