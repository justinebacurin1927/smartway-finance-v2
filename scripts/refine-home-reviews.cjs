const fs = require('node:fs');
const path = require('node:path');

const star = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>';
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child, tag))];

function refineHomeReviews() {
  const root = path.resolve(__dirname, '..');
  const file = path.join(root, 'dist/index.html');
  const original = fs.readFileSync(file, 'utf8');
  const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
  const source = nodes(pages['/'].main, 'section').find(section => text(section).includes('Real Stories. Real Results.'));
  const sourceCards = nodes(source, 'div').filter(node => node.attrs?.class?.includes('rounded-3xl p-7'));
  // Ratings come from the captured source's star rows, matched to each quote.
  const ratings = new Map(sourceCards.map(card => [text(nodes(card, 'p')[0]).replace(/[“”]/g, ''), nodes(card, 'svg').length]));
  const decode = value => value.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const header = '<div class="wrap reviews-heading"><p class="eyebrow">Real people. Real experiences.</p><h2 id="reviews-title"><span class="reviews-title-piece">Real</span> <span class="reviews-title-piece">Stories.</span> <span class="reviews-title-piece">Real</span> <span class="reviews-title-piece">Results.</span></h2><p class="reviews-description">See why Australians trust Smartway Finance.</p><span class="reviews-heading-icon" aria-hidden="true"><svg viewBox="0 0 96 96" focusable="false"><use href="/assets/icons/smartway-doodles.svg#review"/></svg></span></div>';
  let html = original.replace(/(<section\b[^>]*\bid="testimonials"[^>]*>)([\s\S]*?)(<\/section>)/, (_match, opening, body, closing) => {
    body = body.replace(/<div class="wrap reviews-heading">[\s\S]*?<\/div>/, header);
    body = body.replace(/<div class="review-rating"[^>]*>[\s\S]*?<\/div>/g, '');
    body = body.replace(/(<article\b[^>]*\bclass="[^"]*\breview-slide\b[^>]*>)([\s\S]*?)(<\/article>)/g, (_card, start, content, end) => {
      const quote = content.match(/<blockquote>([\s\S]*?)<\/blockquote>/)?.[1];
      const rating = ratings.get(decode(quote || '').replace(/[“”]/g, ''));
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error(`Cannot verify the source rating for ${quote}`);
      content = content.replace('<blockquote>', `<div class="review-rating" role="img" aria-label="${rating} out of 5 stars">${star.repeat(rating)}</div><blockquote>`);
      return start + content + end;
    });
    return opening + body + closing;
  });
  html = html.replace(/(reviews\.css)(?:\?v=[^"\s]+)?(?=")/g, '$1?v=20261021-colour-stars');
  html = html.replace(/(brand-story\.js)\?v=[^"\s]+/g, '$1?v=20261021-reviews-heading-motion');
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineHomeReviews;
if (require.main === module) { refineHomeReviews(); console.log('Applied animated review heading, matching icon, and source-backed star ratings.'); }
