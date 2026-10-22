const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const paragraphs = node => typeof node === 'string' ? [] : [...(node.tag === 'p' ? [node] : []), ...(node.children || []).flatMap(paragraphs)];
const disclaimer = paragraphs(pages['/calculator'].main).map(text).find(value => value.includes('Disclaimer:'));
if (!disclaimer) throw new Error('Calculator source disclaimer not found.');
const esc = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

const calculatorIcon = `<svg viewBox="0 0 96 96" focusable="false"><path fill="#75c8be" d="m29 13 39 2q10 0 10 10l-2 52q0 9-10 9l-39-2q-9 0-9-10l1-50q0-11 10-11Z"/><g fill="none" stroke="#39063e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="m27 10 38 2q9 0 9 9l-2 51q0 10-10 9l-37-2q-9 0-9-9l2-50q0-10 9-10Z"/><path d="m29 24 31 1-1 13-31-1ZM30 49h3m12 0h3m12 1h2M30 61h3m12 0h3m12 1h2M29 72h3m12 0h3m12-10v11"/></g></svg>`;
const arrow = `<span class="calculator-action-track" aria-hidden="true"><span class="calculator-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>`;
const field = (id, label, value, min, max, step, display) => `<div class="calc-field"><label for="${id}">${label}<output id="${id}-value" for="${id}">${display}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" style="--calculator-progress:${100 * (value - min) / (max - min)}%" disabled></div>`;
const rows = [['Loan Amount', '$25,000'], ['Interest Rate', '7.99% p.a.'], ['Loan Term', '5 years (60 payments)'], ['Balloon / Residual', '$0'], ['Total Repayable', '$30,407.41'], ['Total Interest', '$5,407.41']].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
const main = `<main id="main" class="source-page calculator-page">
<section class="calculator-masthead" aria-labelledby="calculator-title"><div class="wrap calculator-heading-layout"><div><p class="calculator-kicker">Loan Calculator</p><h1 id="calculator-title">Calculate Repayments<br><em>With Ease</em></h1><p class="calculator-intro">Use our easy-to-use loan calculator to estimate your repayments in seconds. Simply adjust the sliders below to get a quick snapshot.</p></div><div class="calculator-heading-art" aria-hidden="true"><span class="calculator-symbol calculator-symbol-main">${calculatorIcon}</span><span class="calculator-symbol calculator-symbol-small"><svg viewBox="0 0 96 96" focusable="false"><use href="/assets/icons/smartway-doodles.svg#money"/></svg></span></div></div></section>
<section class="content-section calculator-workspace" data-calculator-workspace aria-labelledby="calculator-controls-title"><div class="wrap"><div class="calc-layout"><div class="calculator-controls"><h2 class="calculator-kicker" id="calculator-controls-title">Adjust Your Loan</h2><div class="calc-controls">${field('amount', 'Loan Amount', 25000, 3000, 200000, 500, '$25,000')}${field('term', 'Loan Term', 5, 1, 7, 1, '5 years')}${field('rate', 'Interest Rate (p.a.)', 7.99, 4, 20, .01, '7.99%')}${field('balloon', 'Balloon / Residual', 0, 0, 10000, 500, '$0')}</div><div class="calculator-published-rates"><p>Interest Rate from<strong>5.95% p.a.</strong></p><p>Comparison Rate from<strong>5.95% p.a.*</strong></p></div><noscript><p class="calculator-static-note">This shows an estimate for the values above. Enable JavaScript to adjust your loan, or request a quote from our team.</p></noscript></div><div class="estimate" aria-labelledby="calculator-estimate-title"><h2 class="calculator-kicker" id="calculator-estimate-title">Your Estimate</h2><div class="calculator-estimate-summary" role="status" aria-live="polite" aria-atomic="true"><p>Estimated Monthly Repayment</p><strong id="monthly">$506.79</strong><p id="period">per month for 5 years</p></div><dl id="breakdown">${rows}</dl><a class="button calculator-action" href="/apply/"><span class="calculator-action-label">Get a free quote</span>${arrow}</a><p class="calculator-quote-note">No obligation. Response within 1 business day.</p></div></div><p class="calc-note">${esc(disclaimer)}</p></div></section>
</main>`;

function refineCalculatorPage() {
  const file = path.join(root, 'dist/calculator/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<main\b[\s\S]*?<\/main>/, main);
  if (!html.includes('/calculator-page.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/calculator-page.css?v=20261022-calculator-refresh"></head>');
  html = html.replace(/calculator-page\.css(?:\?[^"\s]*)?/g, 'calculator-page.css?v=20261022-calculator-refresh');
  html = html.replace(/src="\/complete\.js(?:\?[^"\s]*)?"/g, 'src="/complete.js?v=20261022-calculator-refresh"');
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineCalculatorPage;
if (require.main === module) { refineCalculatorPage(); console.log('Refined the calculator heading, controls, estimate and quote action.'); }
