const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const faqs = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/faqs-expanded.json'), 'utf8')).slice(0, 4);
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const faqIcon = (name, className) => `<span class="${className}" aria-hidden="true"><svg viewBox="0 0 96 96" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg></span>`;
const faqAction = (href, label) => `<a class="button finance-hero-action faq-action" href="${href}"><span class="finance-action-label">${label}</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;
const topics = [
  ['About Smartway', 'Meet the team behind your loan.', 'chat'],
  ['Your broker', 'Understand how we work for you.', 'handshake'],
  ['Our lenders', 'Explore our panel of lenders.', 'bank'],
  ['Loan options', 'Finance for more than your next car.', 'car']
];
const tabs = faqs.map((faq, index) => {
  const [title, summary, icon] = topics[index];
  return `<button class="faq-topic-tab${index === 0 ? ' is-selected' : ''}" id="faq-topic-${index}" type="button" role="tab" aria-label="${esc(faq.question)}" aria-selected="${index === 0}" aria-controls="faq-panel-${index}" tabindex="${index === 0 ? 0 : -1}"><span class="faq-topic-symbol" aria-hidden="true"><svg viewBox="0 0 96 96" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${icon}"/></svg></span><span class="faq-topic-label"><span class="faq-topic-title">${title}</span><span class="faq-topic-summary">${summary}</span></span></button>`;
}).join('');
const panels = faqs.map((faq, index) => `<details class="faq-topic-panel" id="faq-panel-${index}"><summary><span>${esc(faq.question)}</span><span class="brex-faq-toggle" aria-hidden="true">+</span></summary><div class="faq-answer-inner"><div class="faq-answer-copy"><span class="faq-answer-category" data-faq-enhanced hidden>0${index + 1} / ${topics[index][0]}</span><h3 data-faq-enhanced hidden>${esc(faq.question)}</h3><p>${esc(faq.answer)}</p></div><div class="faq-answer-footer" data-faq-enhanced hidden><span>Real people. Personal service.<br>Every step of the way.</span>${faqAction('/contact/', 'Let’s talk')}</div></div></details>`).join('');
const markup = `<section id="faqs" class="brex-faq faq-topics" aria-labelledby="faq-title"><div class="wrap"><header class="faq-topic-intro"><div><p class="brex-kicker">Frequently Asked Questions</p><h2 id="faq-title">Got Questions?<br><span>We've Got Answers.</span></h2></div><div class="faq-topic-aside">${faqIcon('handshake', 'faq-intro-icon')}<p>Get to know the team, how we work and the finance options available to you.</p></div></header><div class="faq-topic-layout"><div class="faq-topic-list" role="tablist" aria-label="Finance questions" aria-orientation="vertical" hidden>${tabs}</div><div class="brex-faq-list faq-topic-panels">${panels}</div></div><div class="brex-faq-help"><div class="faq-help-intro">${faqIcon('chat', 'faq-support-icon')}<div><strong>Prefer a conversation?</strong><p>Real people. Personal service. Every step of the way.</p></div></div>${faqAction('tel:0755127080', '07 5512 7080')}${faqAction('/faqs/', 'View all FAQs')}</div></div></section>`;

function refineHomeFaq() {
  const file = path.join(root, 'dist/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<section id="faqs"[\s\S]*?<\/section>/, markup);
  if (!html.includes('/faq-topics.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/faq-topics.css?v=20261021-faq-white"><script src="/faq-topics.js?v=20261021-faq-white" defer></script></head>');
  html = html.replace(/(faq-topics\.(?:css|js))\?v=[^"\s]+/g, '$1?v=20261021-faq-white');
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineHomeFaq;
module.exports.markup = markup;
if (require.main === module) { refineHomeFaq(); console.log('Applied RM Internet topic-card FAQ layout with Smartway content.'); }
