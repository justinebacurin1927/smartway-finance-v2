const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
const text = node => typeof node === 'string' ? node : node.children.map(text).join('');
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...node.children.flatMap(child => nodes(child, tag))];
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const stories = nodes(pages['/blog'].main, 'a').filter(node => node.attrs.href?.startsWith('/blog/')).slice(0, 3);
const articleAction = route => `<a class="brex-article-link button finance-hero-action journal-action" href="${route}/"><span class="finance-action-label">Read article</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;
const markup = `<section id="journal" class="brex-journal journal-stacked" aria-labelledby="journal-title"><div class="wrap"><header><p class="brex-kicker">Finance Hub</p><h2 id="journal-title">Guides, Tips &amp; Advice</h2><p>Expert finance content from the Smartway team — helping you make smarter borrowing decisions.</p></header><div class="brex-articles">${stories.map((story, index) => {
  const route = story.attrs.href;
  const page = pages[route];
  const image = page.images[0];
  const description = nodes(story, 'p').map(text).find(copy => copy.length > 70) || page.description;
  const metadata = nodes(story, 'span').map(text).map(copy => copy.trim()).filter(copy => copy.length < 70 && /2026|min/.test(copy)).reverse().join(' · ');
  const category = index === 2 ? 'Credit Tips' : 'Vehicle Finance';
  return `<article class="brex-article journal-story" data-front="text" aria-labelledby="journal-story-title-${index}"><div class="journal-deck" id="journal-deck-${index}"><div class="journal-panel journal-copy" data-panel="text"><p class="brex-article-category">${category}</p><h3 id="journal-story-title-${index}">${esc(page.title)}</h3><p class="brex-article-description">${esc(description)}</p>${metadata ? `<p class="brex-article-meta">${esc(metadata)}</p>` : ''}</div><figure class="journal-panel journal-photo" data-panel="image"><img src="/assets/site/optimized/${path.basename(image.local)}.webp" alt="${esc(image.alt)}" loading="lazy"><figcaption><p class="journal-photo-heading">${category}</p>${metadata ? `<p class="brex-article-meta">${esc(metadata)}</p>` : ''}${articleAction(route)}</figcaption><button class="journal-swap" type="button" aria-controls="journal-deck-${index}" aria-pressed="false" aria-label="Show photo for ${esc(page.title)}" hidden></button></figure></div></article>`;
}).join('')}</div></div></section>`;

function refineJournalCards() {
  const file = path.join(root, 'dist/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<section id="journal"[\s\S]*?<\/section>/, markup);
  if (!html.includes('/journal-cards.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/journal-cards.css?v=20261021-photo-action-only"><script src="/journal-cards.js?v=20261021-photo-action-only" defer></script></head>');
  html = html.replace(/(journal-cards\.(?:css|js))\?v=[^"\s]+/g, '$1?v=20261021-photo-action-only');
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineJournalCards;
module.exports.markup = markup;
if (require.main === module) { refineJournalCards(); console.log('Applied three switchable mint article pairs with sliding-arrow links.'); }
