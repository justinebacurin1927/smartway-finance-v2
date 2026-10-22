const fs = require('node:fs');
const path = require('node:path');

const resources = [
  ['Tools & guides', [['Compare Loans', '/compare/'], ['Loan Calculator', '/calculator/'], ['Finance Hub', '/blog/']]],
  ['About Smartway', [['About Us', '/about/'], ['FAQs', '/faqs/'], ['Testimonials', '/testimonials/']]]
];
const arrow = '<span class="footer-nav-arrow" aria-hidden="true">↗</span>';
const links = (items, current, footer = false) => items.map(([label, href]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}${footer ? arrow : ''}</a>`).join('');
const groups = current => resources.map(([label, items]) => `<div class="nav-resource-group"><p>${label}</p>${links(items, current)}</div>`).join('');
const footerGroup = (label, items, current) => `<nav aria-label="${label}"><p class="footer-nav-heading">${label}</p><ul>${items.map(item => `<li>${links([item], current, true)}</li>`).join('')}</ul></nav>`;

function refineNavigation() {
  const dist = path.resolve(__dirname, '../dist');
  const visit = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() && entry.name !== 'assets' ? visit(path.join(directory, entry.name)) : entry.isFile() && entry.name === 'index.html' ? [path.join(directory, entry.name)] : []);
  let count = 0;
  for (const file of visit(dist)) {
    const original = fs.readFileSync(file, 'utf8');
    if (!original.includes('class="desktop-nav"')) continue;
    const relative = path.relative(dist, file).split(path.sep).join('/');
    const current = relative === 'index.html' ? '/' : '/' + relative.replace(/index\.html$/, '');
    const home = current === '/' ? '' : '/';
    const primary = `<a href="${home}#finance">Finance</a><a href="${home}#about">About</a><a href="${home}#contact">Contact</a>`;
    const desktop = `<nav class="desktop-nav" aria-label="Main navigation">${primary}<details class="nav-explore"><summary>Explore<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4"/></svg></summary><div class="nav-explore-panel">${groups(current)}</div></details></nav>`;
    const mobile = `<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden><div class="mobile-primary-links">${primary}</div><div class="mobile-resources">${groups(current)}</div></nav>`;
    let html = original.replace(/<nav\b(?=[^>]*\bclass="desktop-nav")[^>]*>[\s\S]*?<\/nav>/, desktop).replace(/<nav\b(?=[^>]*\bclass="mobile-nav")[^>]*>[\s\S]*?<\/nav>/, mobile);
    const directory = `<!-- footer-directory --><div class="footer-directory">${footerGroup('Explore Smartway', [['Home', '/'], ['About Us', '/about/'], ['Finance Options', '/finance-options/'], ['Contact Us', '/contact/']], current)}${footerGroup('Tools & resources', [['Compare Loans', '/compare/'], ['Loan Calculator', '/calculator/'], ['Finance Hub', '/blog/'], ['FAQs', '/faqs/'], ['Testimonials', '/testimonials/']], current)}</div><!-- /footer-directory -->`;
    if (html.includes('<!-- footer-directory -->')) html = html.replace(/<!-- footer-directory -->[\s\S]*?<!-- \/footer-directory -->/, directory);
    else html = html.replace(/<div\b[^>]*>\s*<p\b[^>]*>Quick Links<\/p>\s*<ul\b[^>]*>[\s\S]*?<\/ul>\s*<\/div>/, directory);
    if (!html.includes('<!-- footer-directory -->')) throw new Error(`Quick Links column not found: ${file}`);
    if (!html.includes('/navigation.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/navigation.css?v=20261021-explore-pages"></head>');
    if (!html.includes('/nav-explore.js')) html = html.replace('</head>', '<script src="/nav-explore.js?v=20261021-explore-pages" defer></script></head>');
    html = html.replace(/(navigation\.css|nav-explore\.js)(?:\?[^"\s]*)?/g, '$1?v=20261021-explore-pages');
    if (html !== original) fs.writeFileSync(file, html);
    count++;
  }
  return count;
}

module.exports = refineNavigation;
if (require.main === module) console.log(`Updated navigation and footer directory on ${refineNavigation()} pages.`);
