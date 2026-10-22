const fs = require('node:fs');
const path = require('node:path');

const icon = (name, className) => `<span class="${className}" aria-hidden="true"><svg viewBox="0 0 96 96" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg></span>`;
const masthead = `<section class="comparison-masthead" aria-labelledby="compare-title"><div class="wrap comparison-heading-layout"><div class="comparison-heading-copy"><p class="inner-kicker">Compare Finance</p><h1 id="compare-title">Compare Loan Types.<br><em>Side by Side.</em></h1><p class="comparison-intro">Adjust your loan amount and term to see estimated repayments across different loan structures — instantly.</p></div><div class="comparison-heading-art" aria-hidden="true">${icon('scales', 'comparison-symbol comparison-symbol-main')}${icon('clipboard', 'comparison-symbol comparison-symbol-small')}</div></div></section>`;
const action = (href, label) => `<a class="button compare-action" href="${href}"><span class="compare-action-label">${label}</span><span class="compare-action-track" aria-hidden="true"><span class="compare-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;

function refineComparePage() {
  const file = path.resolve(__dirname, '../dist/compare/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<nav\b[^>]*class="breadcrumbs wrap"[^>]*>[\s\S]*?<\/nav>/g, '');
  html = html.replace(/<section\b[^>]*class="comparison-masthead"[^>]*>[\s\S]*?<\/section>/, masthead);
  // The base generator's first section is a source masthead before refinement.
  if (!html.includes('id="compare-title"')) html = html.replace(/<main\b([^>]*)>\s*<section[\s\S]*?<\/section>/, `<main$1>${masthead}`);
  html = html.replace(/(<section class="content-section navy-section">)([\s\S]*?)(<\/section>)/, (_match, start, content, end) => {
    content = content.replace(/<div class="(?:comparison-actions)?">\s*<a\b[^>]*href="\/contact\/"[\s\S]*?<\/a>\s*<a\b[^>]*href="tel:0755127080"[\s\S]*?<\/a>\s*<\/div>/, `<div class="comparison-actions">${action('/contact/', 'See Your Eligibility')}${action('tel:0755127080', '07 5512 7080')}</div>`);
    return start + content + end;
  });
  if (!html.includes('class="comparison-actions"')) throw new Error('Comparison closing links not found.');
  if (!html.includes('/compare-page.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/compare-page.css?v=20261022-heading-actions"></head>');
  html = html.replace(/compare-page\.css(?:\?[^"\s]*)?/g, 'compare-page.css?v=20261022-heading-actions');
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineComparePage;
module.exports.masthead = masthead;
if (require.main === module) { refineComparePage(); console.log('Updated the comparison heading, breadcrumb and closing actions.'); }
