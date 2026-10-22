const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const source = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8')).pages['/contact'].main;
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child, tag))];
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const sourceControls = Object.fromEntries(nodes(source, 'select').map(node => [node.attrs.name, node]));
const icon = (name, size = 96) => `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg?v=20261022-contact#${name}"/></svg>`;
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const actionContent = label => `<span class="finance-action-label">${label}</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow">${arrow}</span></span>`;
const action = (href, label, extra = '') => `<a class="button finance-hero-action contact-action" href="${href}" ${extra}>${actionContent(label)}</a>`;
const label = (name, title, optional) => `<label for="contact-${name}">${title}${optional ? ' <span>(optional)</span>' : ' <span class="contact-required" aria-hidden="true">*</span>'}</label>`;
const error = name => `<p class="contact-field-error" id="contact-${name}-error" hidden></p>`;
const input = (name, title, type, autocomplete, placeholder) => `<div class="contact-field">${label(name, title)}<input id="contact-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" placeholder="${placeholder}" maxlength="${type === 'email' ? '254' : '100'}" required aria-describedby="contact-${name}-error">${error(name)}</div>`;
function select(name, title) {
  const control = sourceControls[name];
  if (!control) throw new Error(`Missing original contact choice: ${name}`);
  const options = nodes(control, 'option').map(option => `<option${option.attrs?.value !== undefined ? ` value="${esc(option.attrs.value)}"` : ''}>${esc(text(option))}</option>`).join('');
  return `<div class="contact-field">${label(name, title, true)}<select id="contact-${name}" name="${name}">${options}</select></div>`;
}
const map = 'https://www.google.com/maps/search/?api=1&amp;query=38%2F207%20Currumburra%20Rd%20Ashmore%20QLD%204214';
const quickCard = (type, title, value, detail, href, extra = '') => `<a class="contact-method contact-method-${type}" href="${href}" ${extra}><span class="contact-method-icon">${icon(type === 'phone' ? 'phone' : type === 'email' ? 'mail' : 'location', type === 'phone' ? 24 : 96)}</span><span class="contact-method-copy"><span class="contact-method-label">${title}</span><strong>${value}</strong><span>${detail}</span></span><span class="contact-method-arrow">${arrow}</span></a>`;
const main = `<main id="main" class="source-page contact-page">
<section class="contact-hero" aria-labelledby="contact-title"><div class="wrap contact-hero-grid"><div class="contact-hero-copy"><p class="contact-kicker">Contact Smartway Finance</p><h1 id="contact-title">Let’s start a<br><em>conversation.</em></h1><p>We’d love to help. Send us an enquiry or give us a call — we’re here to answer your questions.</p></div><div class="contact-hero-art" aria-hidden="true"><span class="contact-bubble-back">${icon('chat')}</span><div class="contact-bubble-front"><span>${icon('chat')}</span><p>Real people.<br><strong>Personal service.</strong></p><span class="contact-bubble-dots"><i></i><i></i><i></i></span></div><svg class="contact-spark" viewBox="0 0 48 48"><path d="M24 4v13m0 14v13M4 24h13m14 0h13M10 10l8 8m12 12 8 8m0-28-8 8M18 30l-8 8"/></svg></div></div></section>
<section class="contact-options wrap" aria-label="Contact options">${quickCard('phone','Give us a call','07 5512 7080','Mon–Fri, business hours','tel:0755127080')}${quickCard('email','Drop us a line','info@swfin.com.au','Response within 1 business day','mailto:info@swfin.com.au')}${quickCard('visit','Find us in Ashmore','Our Gold Coast home','38/207 Currumburra Rd, Ashmore QLD 4214',map,'target="_blank" rel="noopener noreferrer" aria-label="Find our Ashmore office in Google Maps (opens in a new tab)"')}</section>
<section class="contact-workspace" aria-label="Your enquiry and our team"><div class="wrap contact-workspace-grid">
<section class="contact-form-panel" aria-labelledby="contact-form-title"><header class="contact-form-heading"><span class="contact-panel-icon">${icon('clipboard')}</span><div><p class="contact-kicker">Your next step</p><h2 id="contact-form-title">What do you have in mind?</h2></div></header><p class="contact-form-intro" id="contact-form-help">Tell us a little about yourself and what you need. We’ll prepare an email draft for you to review and send in your email app.</p><p class="contact-form-required" id="contact-required-help">Fields marked <span aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>
<form id="contact-enquiry" class="contact-enquiry-form" action="mailto:info@swfin.com.au" method="post" enctype="text/plain" aria-describedby="contact-form-help contact-required-help">
<p class="contact-error-summary" role="alert" hidden></p>
<fieldset><legend><span>01</span> Your details</legend><div class="contact-fields">${input('firstName','First name','text','given-name','e.g. Jane')}${input('lastName','Last name','text','family-name','e.g. Smith')}${input('email','Email','email','email','you@example.com')}${input('phone','Phone','tel','tel','e.g. 04xx xxx xxx')}</div></fieldset>
<fieldset><legend><span>02</span> A little about your plans</legend><div class="contact-fields"><div class="contact-field-wide">${select('financeType','Finance type')}</div>${select('loanAmount','Approximate loan amount')}${select('callTime','Best time to call')}<div class="contact-field contact-field-wide">${label('message','Anything else you’d like us to know?',true)}<textarea id="contact-message" name="message" rows="4" maxlength="3000" placeholder="Your plans, questions, or where you’d like a little guidance…"></textarea></div></div></fieldset>
<div class="contact-consent"><input id="contact-consent" name="consent" type="checkbox" value="Agreed to the privacy policy" required aria-describedby="contact-consent-error"><div><label for="contact-consent">I consent to Smartway Finance collecting and using my information in accordance with the <a href="/privacy-disclosure.pdf">Privacy Policy</a>. <span class="contact-required" aria-hidden="true">*</span></label>${error('consent')}</div></div>
<div class="contact-submit-row"><button class="button finance-hero-action finance-hero-action--navy contact-action" type="submit">${actionContent('Prepare email enquiry')}</button><span>Review first.<br> Send when you’re ready.</span></div>
<div class="contact-draft" hidden><p role="status" id="contact-draft-status"></p><a class="contact-draft-link" href="mailto:info@swfin.com.au">Open email app ${arrow}</a><p>Your details haven’t been sent from this website.</p></div>
<p class="contact-online-alternative">Prefer an online form? <a href="https://www.swfin.com.au/contact">Use Smartway’s live contact form ${arrow}</a></p>
</form><noscript><style>.contact-enquiry-form,.contact-form-required{display:none}</style><p class="contact-no-js">To make an enquiry, <a href="mailto:info@swfin.com.au">email info@swfin.com.au</a>, <a href="tel:0755127080">call 07 5512 7080</a>, or <a href="https://www.swfin.com.au/contact">use Smartway’s live contact form</a>.</p></noscript></section>
<aside class="contact-sidebar" aria-label="Meet the team and office hours"><section class="contact-team"><div class="contact-team-copy"><span class="contact-panel-icon">${icon('handshake')}</span><p class="contact-kicker">A real team. On your side.</p><h2>People first.<br><em>Every time.</em></h2><p>Personal service. Honest advice. Support every step of the way.</p><a href="/about/">Meet the Smartway team ${arrow}</a></div><figure><img src="/assets/site/optimized/caraandalice.jpg.webp" width="6397" height="5118" alt="Cara Rogers and Alice Blay, Co-Directors of Smartway Finance" loading="lazy" decoding="async" draggable="false"><figcaption><strong>Cara Rogers &amp; Alice Blay</strong><span>Co-Directors, Smartway Finance</span></figcaption></figure></section>
<section class="contact-hours" aria-labelledby="contact-hours-title"><span class="contact-panel-icon">${icon('clock')}</span><h2 id="contact-hours-title">Here when you need us.</h2><dl><div><dt>Monday – Friday</dt><dd>8:00am – 5:00pm</dd></div><div><dt>Saturday</dt><dd>By appointment</dd></div><div><dt>Sunday</dt><dd>Closed</dd></div></dl><div class="contact-credentials"><span>FBAA Member</span><span>AFCA Member</span><p>ACL #566769 · ABN 42 682 496 779</p></div></section>
<a class="contact-faq-link" href="/faqs/"><span>${icon('chat')}</span><span><strong>A quick question?</strong><span>Find answers in our FAQs</span></span>${arrow}</a></aside>
</div></section>
<section class="contact-next wrap" aria-labelledby="contact-next-title"><span class="contact-next-icon">${icon('car')}</span><div><p class="contact-kicker">Already know your next move?</p><h2 id="contact-next-title">Let’s get you moving.</h2></div>${action('/apply/','Start your application')}</section>
</main>`;

function refineContactPage() {
  const file = path.join(root, 'dist/contact/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<main\b[\s\S]*?<\/main>/, main);
  for (const [asset, version] of [['arrow-action.css','20261022-shared'],['contact-page.css','20261022-contact'],['contact-page.js','20261022-contact']]) {
    if (!html.includes(`"/${asset}`)) html = html.replace('</head>', asset.endsWith('.js') ? `<script src="/${asset}?v=${version}" defer></script></head>` : `<link rel="stylesheet" href="/${asset}?v=${version}"></head>`);
    html = html.replace(new RegExp(`(${asset.replaceAll('.', '\\.')})(?:\\?[^"\\s]*)?`, 'g'), `$1?v=${version}`);
  }
  html = html.replace(/(complete\.js)(?:\?[^"\s]*)?/g, '$1?v=20261022-contact');
  if (html !== original) fs.writeFileSync(file, html);
}
module.exports = refineContactPage;
if (require.main === module) { refineContactPage(); console.log('Refined Contact with the Smartway enquiry and team design.'); }
