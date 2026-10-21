const reviewSection = document.querySelector('#testimonials');
const reviewSlides = [...reviewSection.querySelectorAll('.review-slide')];
const reviewDots = [...reviewSection.querySelectorAll('.review-dot')];
let activeReview = 0;
function showReview(index) {
  activeReview = (index + reviewSlides.length) % reviewSlides.length;
  reviewSlides.forEach((slide, position) => {
    const rawOffset = (position - activeReview + reviewSlides.length) % reviewSlides.length;
    const offset = rawOffset > reviewSlides.length / 2 ? rawOffset - reviewSlides.length : rawOffset;
    slide.style.setProperty('--offset', offset);
    slide.style.setProperty('--distance', Math.abs(offset));
    slide.style.zIndex = reviewSlides.length - Math.abs(offset);
    slide.classList.toggle('is-current', offset === 0);
    slide.classList.toggle('is-distant', Math.abs(offset) > 2);
    slide.setAttribute('aria-hidden', String(offset !== 0));
    reviewDots[position].classList.toggle('is-active', offset === 0);
    if (offset === 0) reviewDots[position].setAttribute('aria-current', 'true');
    else reviewDots[position].removeAttribute('aria-current');
  });
  const name = reviewSlides[activeReview].querySelector('strong').textContent;
  document.querySelector('#review-status').textContent = `Review ${activeReview + 1} of ${reviewSlides.length}, ${name}`;
}
document.querySelector('#review-previous').addEventListener('click', () => showReview(activeReview - 1));
document.querySelector('#review-next').addEventListener('click', () => showReview(activeReview + 1));
reviewDots.forEach((dot, index) => dot.addEventListener('click', () => showReview(index)));
reviewSection.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showReview(activeReview + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

showReview(0);
