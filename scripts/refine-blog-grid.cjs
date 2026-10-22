const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child, tag))];
const categories = [['All', 'clipboard'], ['Vehicle Finance', 'car'], ['Business Finance', 'briefcase'], ['Personal Finance', 'wallet'], ['Leisure Finance', 'leisure'], ['Credit Tips', 'credit']];
const icon = (name, className = '') => `<svg class="${className}" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
const stories = nodes(pages['/blog'].main, 'a').filter(node => node.attrs.href?.startsWith('/blog/')).map(node => {
  const route = node.attrs.href, spans = nodes(node, 'span').map(text), image = pages[route].images[0];
  return { route, title: pages[route].title, category: spans[0], read: spans[1].trim(), date: spans[2], description: text(nodes(node, 'p')[0]), image };
});
const cards = stories.map((story, index) => `<a class="edition-story hub-card" data-category="${esc(story.category)}" href="${story.route}/" aria-labelledby="hub-story-${index + 1}"><div class="hub-card-cover"><figure><img src="/assets/site/optimized/${path.basename(story.image.local)}.webp" alt="${esc(story.image.alt)}" loading="${index < 3 ? 'eager' : 'lazy'}" draggable="false"></figure><span class="hub-card-number" aria-hidden="true">0${index + 1}</span><div class="hub-card-caption"><span class="hub-card-category">${icon(categories.find(([label]) => label === story.category)?.[1] || 'clipboard')}<span>${esc(story.category)}</span></span><h2 id="hub-story-${index + 1}">${esc(story.title)}</h2></div></div><p class="hub-card-summary">${esc(story.description)}</p><div class="hub-card-footer"><p class="story-date">${esc(story.date)} <span aria-hidden="true">·</span> ${esc(story.read)}</p><span class="hub-card-read">Read article<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div></a>`).join('');
const markup = `<section class="journal-edition hub-grid-edition wrap" aria-labelledby="hub-title"><header class="edition-heading"><p class="inner-kicker">Smartway Finance / Finance Hub</p><h1 id="hub-title">Guides, Tips<br><em>&amp; Advice.</em></h1><div class="hub-heading-art" aria-hidden="true"><span class="hub-heading-symbol hub-heading-symbol-main">${icon('clipboard')}</span><span class="hub-heading-symbol hub-heading-symbol-small">${icon('chat')}</span></div><div class="edition-intro"><p>Expert finance content from the Smartway team — helping you make smarter borrowing decisions.</p><span>Practical knowledge.<br>For what comes next.</span></div></header><div class="hub-filterbar"><div class="hub-filter-intro"><p class="inner-kicker">Browse articles</p><p class="journal-filter-status" role="status" aria-live="polite">${stories.length} articles</p></div><nav class="journal-categories" aria-label="Article categories">${categories.map(([label, symbol], index) => `<button type="button" aria-pressed="${index === 0}" data-category-filter="${label}">${icon(symbol)}<span>${label}</span></button>`).join('')}</nav></div><noscript><style>.hub-grid-edition .journal-categories{display:none!important}</style><p class="hub-nojs-note">All articles are shown below.</p></noscript><div class="edition-stories">${cards}</div><p class="filter-empty" hidden>No articles in this category yet.</p></section>`;

function refineBlogGrid() {
  const file = path.join(root, 'dist/blog/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<section class="journal-edition[^\"]*"[^>]*>[\s\S]*?<\/section>/, markup);
  if (!html.includes('hub-grid-edition')) {
    const breadcrumb = original.match(/<nav class="breadcrumbs wrap"[\s\S]*?<\/nav>/)?.[0] || '';
    const closing = `<section class="inner-closing"><div class="wrap"><p class="inner-kicker">Your next chapter</p><div><h2>Ready to take<br>the next step?</h2><p>Get a free, no-obligation quote from our team — we’ll find the right fit for your situation.</p><a href="/apply/">Get a Free Quote</a><a href="tel:0755127080">07 5512 7080</a></div></div></section>`;
    html = html.replace(/<main\b[\s\S]*?<\/main>/, `<main id="main" class="source-page refined-page">${breadcrumb}${markup}${closing}</main>`);
  }
  if (!html.includes('/blog-grid.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/blog-grid.css?v=20261022-hub-grid-icons"></head>');
  html = html.replace(/blog-grid\.css(?:\?[^"\s]*)?/g, 'blog-grid.css?v=20261022-hub-grid-icons');
  html = html.replace(/src="\/complete\.js(?:\?[^"\s]*)?"/g, 'src="/complete.js?v=20261022-hub-grid-icons"');
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineBlogGrid;
if (require.main === module) { refineBlogGrid(); console.log('Applied the Finance Hub card grid and matching icons.'); }
