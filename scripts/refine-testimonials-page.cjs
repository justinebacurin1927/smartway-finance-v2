const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child, tag))];
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const sourceCards = nodes(pages['/testimonials'].main, 'div').filter(node => node.attrs?.class?.includes('shadow-sm'));
const reviews = sourceCards.map(card => {
  const paragraphs = nodes(card, 'p').map(text);
  const rating = nodes(card, 'svg').filter(node => node.attrs?.class?.includes('text-[#00B0FF]')).length;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error(`Missing source rating: ${paragraphs[1]}`);
  return { quote: paragraphs[0], name: paragraphs[1], date: paragraphs[2], rating, verified: nodes(card, 'span').some(node => text(node) === 'Verified') };
});
if (reviews.length !== 5) throw new Error('Expected the five original full-page testimonials.');
const average = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
const star = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>';
const stars = rating => `<span class="testimonial-stars" role="img" aria-label="${rating} out of 5 stars">${star.repeat(rating)}</span>`;
const icon = name => `<svg viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
const initials = name => name.includes('&') ? name.split('&').map(part => part.trim()[0]).join('&') : name.split(/\s+/).map(part => part[0]).slice(0, 2).join('');
const action = (href, label) => `<a class="button finance-hero-action testimonial-action" href="${href}"><span class="finance-action-label">${label}</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;
const cards = reviews.map((review, index) => `<article class="testimonial-card testimonial-card-${index + 1}" aria-labelledby="testimonial-person-${index + 1}"><header>${stars(review.rating)}<span class="testimonial-card-number" aria-hidden="true">0${index + 1} / 0${reviews.length}</span></header><figure><blockquote>${esc(review.quote)}</blockquote><figcaption><span class="testimonial-avatar" aria-hidden="true">${esc(initials(review.name))}</span><span class="testimonial-person"><strong id="testimonial-person-${index + 1}">${esc(review.name)}</strong><span>${esc(review.date)}</span></span>${review.verified ? '<span class="testimonial-verified"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m6 12 4 4 8-8"/></svg>Verified<span class="sr-only"> as stated on Smartway’s website</span></span>' : ''}</figcaption></figure></article>`).join('');
const main = `<main id="main" class="source-page testimonials-page">
<section class="testimonials-hero" aria-labelledby="testimonials-page-title"><div class="wrap testimonials-heading"><div class="testimonials-heading-copy"><p class="testimonials-kicker">Client Testimonials</p><h1 id="testimonials-page-title">Real Stories.<br><em>Real Results.</em></h1><p class="testimonials-intro">See how we’ve helped clients across Australia achieve their goals. Discover why Australians trust Smartway Finance.</p></div><div class="testimonial-rating-card"><span class="testimonial-rating-icon" aria-hidden="true">${icon('review')}</span><p class="testimonial-score"><strong>${average}</strong><span>/ 5.0</span></p>${stars(Number(average))}<p class="testimonial-rating-count">${reviews.length} ${reviews.every(review => review.verified) ? 'verified' : 'client'} reviews</p><p class="testimonial-rating-source">As published on Smartway’s website.</p></div></div></section>
<section class="testimonials-content" aria-label="Client stories"><div class="wrap"><div class="testimonial-grid">${cards}</div></div></section>
<section class="testimonials-closing" aria-labelledby="testimonials-closing-title"><div class="wrap"><div class="testimonials-closing-card"><span class="testimonials-closing-icon" aria-hidden="true">${icon('handshake')}</span><div class="testimonials-closing-copy"><p class="testimonials-kicker">Your next chapter</p><h2 id="testimonials-closing-title">Ready to write<br><em>your own story?</em></h2><p>Get a free, no-obligation quote and experience the Smartway difference.</p></div><div class="testimonials-actions">${action('/apply/', 'Apply now')}${action('tel:0755127080', '07 5512 7080')}</div></div></div></section>
</main>`;

function refineTestimonialsPage() {
  const file = path.join(root, 'dist/testimonials/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<main\b[\s\S]*?<\/main>/, main);
  for (const [asset, version] of [['arrow-action.css', '20261022-shared'], ['testimonials-page.css', '20261022-card-hover']]) {
    if (!html.includes(`"/${asset}`)) html = html.replace('</head>', `<link rel="stylesheet" href="/${asset}?v=${version}"></head>`);
    html = html.replace(new RegExp(`(${asset.replaceAll('.', '\\.')})(?:\\?[^"\\s]*)?`, 'g'), `$1?v=${version}`);
  }
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineTestimonialsPage;
if (require.main === module) { refineTestimonialsPage(); console.log('Refined Testimonials with the original five reviews and source ratings.'); }
