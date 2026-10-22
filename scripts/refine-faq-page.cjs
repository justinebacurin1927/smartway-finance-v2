const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
const answers = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/faqs-expanded.json'), 'utf8'));
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child, tag))];
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const content = nodes(pages['/faqs'].main, 'section')[1];
const symbols = ['chat', 'clipboard', 'car', 'wallet', 'handshake'];
const icon = name => `<svg viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
const groups = nodes(content, 'div').filter(node => node.children.some(child => typeof child !== 'string' && child.tag === 'h2')).map((node, index) => ({
  title: text(nodes(node, 'h2')[0]), symbol: symbols[index], id: `faq-topic-${index + 1}`,
  items: nodes(node, 'button').map(button => {
    const question = text(button).trim();
    const answer = answers.find(item => item.question === question);
    if (!answer) throw new Error(`Missing source answer: ${question}`);
    return answer;
  })
}));
if (groups.length !== 5 || groups.reduce((count, group) => count + group.items.length, 0) !== 26) throw new Error('Expected the five source FAQ categories and 26 answers.');
const action = (href, label) => `<a class="button finance-hero-action faq-page-action" href="${href}"><span class="finance-action-label">${label}</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;
const main = `<main id="main" class="source-page faq-page">
<section class="faq-page-hero" aria-labelledby="faq-page-title"><div class="wrap faq-page-heading"><div><p class="faq-page-kicker">Frequently Asked Questions</p><h1 id="faq-page-title">Got Questions?<br><em>We’ve Got Answers.</em></h1><p class="faq-page-intro">Everything you need to know about finance, loans, and working with Smartway.</p></div><div class="faq-page-art" aria-hidden="true"><span class="faq-page-symbol faq-page-symbol-main">${icon('chat')}</span><span class="faq-page-symbol faq-page-symbol-small">${icon('clipboard')}</span></div></div></section>
<section class="faq-page-content" aria-label="Finance questions and answers"><div class="wrap"><nav class="faq-page-topics" aria-label="FAQ categories">${groups.map(group => `<a href="#${group.id}">${icon(group.symbol)}<span>${esc(group.title)}</span></a>`).join('')}</nav><div class="faq-page-groups">${groups.map(group => `<section class="faq-page-group" id="${group.id}" aria-labelledby="${group.id}-title"><header><span class="faq-page-category-icon" aria-hidden="true">${icon(group.symbol)}</span><h2 id="${group.id}-title">${esc(group.title)}</h2></header>${group.items.map(item => `<details class="faq-page-item"><summary><span>${esc(item.question)}</span><svg class="faq-page-toggle" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M12 5v14"/></svg></summary><p>${esc(item.answer)}</p></details>`).join('')}</section>`).join('')}</div></div></section>
<section class="faq-page-contact" aria-labelledby="faq-contact-title"><div class="wrap"><div class="faq-page-contact-card"><span class="faq-page-contact-icon" aria-hidden="true">${icon('handshake')}</span><div class="faq-page-contact-copy"><p class="faq-page-kicker">Talk to our team</p><h2 id="faq-contact-title">Still have questions?</h2><p>Our team is happy to help. Get in touch today for a free, no-obligation chat.</p></div><div class="faq-page-actions">${action('/contact/', 'Contact us')}${action('tel:0755127080', '07 5512 7080')}</div></div></div></section>
</main>`;

function refineFaqPage() {
  const file = path.join(root, 'dist/faqs/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<main\b[\s\S]*?<\/main>/, main);
  html = html.replace(/<link rel="stylesheet" href="\/faq-motion\.css[^\"]*">/g, '').replace(/<script src="\/faq-motion\.js[^\"]*"[^>]*><\/script>/g, '');
  for (const [type, asset] of [['link', 'arrow-action.css'], ['link', 'faq-page.css'], ['script', 'faq-page.js']]) {
    if (!html.includes(`"/${asset}`)) html = html.replace('</head>', type === 'link' ? `<link rel="stylesheet" href="/${asset}?v=20261022-faq-page"></head>` : `<script src="/${asset}?v=20261022-faq-page" defer></script></head>`);
    const version = asset === 'arrow-action.css' ? '20261022-shared' : '20261022-faq-page';
    html = html.replace(new RegExp(`(${asset.replaceAll('.', '\\.')})(?:\\?[^"\\s]*)?`, 'g'), `$1?v=${version}`);
  }
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineFaqPage;
if (require.main === module) { refineFaqPage(); console.log('Refined the full FAQ page with the original 26 answers.'); }
