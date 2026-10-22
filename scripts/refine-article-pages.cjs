const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { pages } = JSON.parse(fs.readFileSync(path.join(root,'references/source-site/content.json'),'utf8'));
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child,tag))];
const icon = (name, size = 96) => `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const calendar = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1ZM8 14h2m4 0h2m-8 3h2"/></svg>';
const clock = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const categories = { 'Vehicle Finance':'car', 'Credit Tips':'credit', 'Business Finance':'briefcase', 'Leisure Finance':'leisure' };
const accents = { 'how-to-finance-a-car-queensland':'Queensland', 'new-vs-used-car-finance':'New vs Used', 'how-to-improve-credit-score-australia':'Credit Score', 'what-is-a-chattel-mortgage':'Chattel Mortgage', 'caravan-finance-guide-australia':'Caravan Finance' };
const dimensions = { 'how-to-finance-a-car-queensland':[1024,768], 'new-vs-used-car-finance':[1600,1200] };
const months = { January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',July:'07',August:'08',September:'09',October:'10',November:'11',December:'12' };
const stories = Object.entries(pages).filter(([route]) => route.startsWith('/blog/')).map(([route,page]) => {
  const hero = page.main.children.find(node => node.tag === 'section');
  const [category,read,date] = nodes(hero,'span').map(node => text(node).trim());
  const [day,month,year] = date.split(' ');
  const slug = route.split('/').pop();
  return { route,slug,page,title:page.title,category,read,date,isoDate:`${year}-${months[month]}-${day.padStart(2,'0')}`,intro:text(nodes(hero,'p')[0]),image:page.images[0],size:dimensions[slug] || [1200,900],body:nodes(page.main,'article')[0] };
});
if (stories.length !== 5 || stories.some(story => !story.body || !story.isoDate.match(/^\d{4}-\d{2}-\d{2}$/))) throw new Error('Expected the five captured article pages with complete metadata.');
const image = (story, eager = false) => `<img src="/assets/site/optimized/${path.basename(story.image.local)}.webp" width="${story.size[0]}" height="${story.size[1]}" alt="${esc(story.image.alt)}" loading="${eager ? 'eager' : 'lazy'}"${eager ? ' fetchpriority="high"' : ''} decoding="async" draggable="false">`;
const metadata = story => `<div class="article-metadata"><span>${clock}${esc(story.read)}</span><time datetime="${story.isoDate}">${calendar}${esc(story.date)}</time></div>`;
const action = (href,label,navy = false) => `<a class="button finance-hero-action article-action${navy ? ' finance-hero-action--navy' : ''}" href="${href}"><span class="finance-action-label">${label}</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow">${arrow}</span></span></a>`;

function renderBody(story) {
  let heading = 0;
  function render(node) {
    if (typeof node === 'string') return esc(node);
    const {tag,attrs = {},children = []} = node;
    if (['svg','path'].includes(tag) || !text(node).trim()) return '';
    if (tag === 'div' && (attrs.class || '').includes('border-t') && nodes(node,'p').some(p => text(p) === 'Smartway Finance Team')) {
      return `<footer class="article-author"><span class="article-author-icon">${icon('handshake')}</span><div>${nodes(node,'p').map(render).join('')}</div><a href="/about/">Meet the team ${arrow}</a></footer>`;
    }
    if (tag === 'div' && (attrs.class || '').includes('rounded-2xl') && nodes(node,'p').length) {
      return `<aside class="article-note" aria-label="Smartway note"><span class="article-note-icon">${icon(story.category === 'Credit Tips' ? 'shield' : 'clipboard')}</span><div>${nodes(node,'p').map(render).join('')}</div></aside>`;
    }
    let attributes = '';
    if (tag === 'h2') attributes = ` id="guide-${++heading}" tabindex="-1"`;
    if (tag === 'p' && (attrs.class || '').includes('font-bold')) attributes = ' class="article-strong"';
    if (tag === 'span' && /^\d+$/.test(text(node))) attributes = ' class="article-step-number" aria-hidden="true"';
    if (tag === 'ol') attributes = ' class="article-steps" role="list"';
    if (tag === 'a' && attrs.href) attributes = ` href="${esc(attrs.href)}"`;
    return `<${tag}${attributes}>${children.map(render).join('')}</${tag}>`;
  }
  return story.body.children.map(render).join('');
}

function relatedCard(story,index) {
  return `<a class="article-related-card" href="${story.route}/" aria-labelledby="related-title-${index}"><figure>${image(story)}</figure><div class="article-related-copy"><p class="article-related-category">${icon(categories[story.category])}<span>${esc(story.category)}</span></p><h3 id="related-title-${index}">${esc(story.title)}</h3>${metadata(story)}<span class="article-read-link">Read article ${arrow}</span></div></a>`;
}

function markup(story) {
  const phrase = accents[story.slug];
  const title = story.title.split(phrase).map(esc).join(`<em>${esc(phrase)}</em>`);
  const headings = nodes(story.body,'h2');
  const originals = nodes(story.page.main.children.at(-1),'a').map(a => a.attrs.href);
  const relatedRoutes = [...new Set([...originals,...stories.filter(other => other.category === story.category).map(other => other.route),...stories.map(other => other.route)])].filter(route => route !== story.route && stories.some(other => other.route === route)).slice(0,3);
  const related = relatedRoutes.map(route => stories.find(other => other.route === route));
  return `<main id="main" class="source-page article-page">
<section class="article-hero" aria-labelledby="article-title"><div class="wrap"><a class="article-hub-return" href="/blog/"><span>${arrow}</span>Finance Hub</a><div class="article-hero-grid"><header class="article-heading"><p class="article-category">${icon(categories[story.category])}<span>${esc(story.category)}</span></p>${metadata(story)}<h1 id="article-title" tabindex="-1">${title}</h1><p class="article-intro">${esc(story.intro)}</p></header><figure class="article-hero-photo">${image(story,true)}<span class="article-photo-icon">${icon(categories[story.category])}</span></figure></div></div></section>
<section class="article-reading wrap" aria-label="Article and useful tools"><div class="article-body-column"><details class="article-contents"><summary><span class="article-contents-icon">${icon('clipboard')}</span><span>In this guide<small>${headings.length} sections</small></span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></summary><nav aria-label="In this guide"><ol>${headings.map((node,index) => `<li><a href="#guide-${index + 1}"><span aria-hidden="true">${String(index + 1).padStart(2,'0')}</span>${esc(text(node))}</a></li>`).join('')}</ol></nav></details><article class="article-prose" aria-labelledby="article-title">${renderBody(story)}</article><a class="article-back-top" href="#article-title">Back to top <span>${arrow}</span></a></div>
<aside class="article-help" aria-label="Finance help and tools"><section class="article-help-card"><span class="article-help-icon">${icon('chat')}</span><p class="article-kicker">Personal service</p><h2>Your next step,<br><em>a little clearer.</em></h2><p>Get a no-obligation quote from our team. We compare 40+ lenders to find the right fit.</p>${action('/apply/','Get a free quote')}<a class="article-help-phone" href="tel:0755127080">${icon('phone',24)}07 5512 7080</a></section><a class="article-tool" href="/calculator/"><span>${icon('money')}</span><span><strong>Loan calculator</strong><small>Estimate your repayments</small></span>${arrow}</a><a class="article-tool" href="/compare/"><span>${icon('scales')}</span><span><strong>Compare loan types</strong><small>See options side by side</small></span>${arrow}</a></aside></section>
<section class="article-conversation wrap" aria-labelledby="article-conversation-title"><span class="article-conversation-icon">${icon('handshake')}</span><div><p class="article-kicker">A question about your own plans?</p><h2 id="article-conversation-title">Let’s talk it through.</h2></div>${action('/contact/','Start a conversation',true)}</section>
<section class="article-related" aria-labelledby="article-related-title"><div class="wrap"><header class="article-related-heading"><div><p class="article-kicker">Keep reading</p><h2 id="article-related-title">More ideas.<br><em>Smarter next steps.</em></h2></div>${action('/blog/','All articles')}</header><div class="article-related-grid">${related.map(relatedCard).join('')}</div></div></section>
</main>`;
}

function refineArticlePages() {
  for (const story of stories) {
    const file = path.join(root,'dist',story.route,'index.html');
    const original = fs.readFileSync(file,'utf8');
    let html = original.replace(/<main\b[\s\S]*?<\/main>/,markup(story));
    for (const [asset,version] of [['arrow-action.css','20261022-shared'],['article-pages.css','20261022-reading']]) {
      if (!html.includes(`"/${asset}`)) html = html.replace('</head>',`<link rel="stylesheet" href="/${asset}?v=${version}"></head>`);
      html = html.replace(new RegExp(`(${asset.replaceAll('.','\\.')})(?:\\?[^"\\s]*)?`,'g'),`$1?v=${version}`);
    }
    if (html !== original) fs.writeFileSync(file,html);
  }
  return stories.length;
}
module.exports = refineArticlePages;
if (require.main === module) console.log(`Refined ${refineArticlePages()} complete article pages.`);
