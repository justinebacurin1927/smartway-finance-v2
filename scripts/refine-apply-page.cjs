const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const source = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8')).pages['/apply'];
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...node.children.flatMap(child => nodes(child, tag))];
const providerUrls = Object.fromEntries(nodes(source.main, 'iframe').map(frame => {
  const url = new URL(frame.attrs.src);
  const kind = url.searchParams.get('application_type') === 'commercial' ? 'business' : 'personal';
  url.searchParams.set('brand_colour', '0b2635');
  url.searchParams.set('text_colour', 'FFFFFF');
  url.searchParams.set('control_colour', '0b2635');
  url.searchParams.delete('iframe');
  return [kind, url.href];
}));
const icon = (name, size = 96, className = '') => `<svg${className ? ` class="${className}"` : ''} viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const action = (label, attrs = '') => `<button class="application-action" ${attrs}><span class="application-action-label">${label}</span><span class="application-action-track" aria-hidden="true"><span class="application-action-arrow">${arrow}</span></span></button>`;
const header = `<header class="header application-header"><a class="brand" href="/" aria-label="Smartway Finance home"><img src="/assets/smartway-logo.png" alt="Smartway Finance" width="155" height="56"></a><nav class="desktop-nav" aria-label="Main navigation"><a href="/#finance">Finance</a><a href="/#about">About</a><a href="/#contact">Contact</a></nav><div class="header-actions"><a class="application-header-help" href="tel:0755127080">Need help?</a><a class="application-nav-action" href="#application">Get started ${arrow}</a><button class="mobile-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation"><span></span><span></span></button></div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden><a href="/#finance">Finance</a><a href="/#about">About</a><a href="/#contact">Contact</a><a href="tel:0755127080">Call 07 5512 7080</a></nav></header>`;
const choices = [
  { kind: 'personal', name: 'Personal & vehicle', icon: 'car', copy: 'A new car, a weekend adventure, or a personal goal.', examples: 'Cars · Motorcycles · Caravans · Personal loans' },
  { kind: 'business', name: 'Business finance', icon: 'briefcase', copy: 'The equipment, vehicles and assets to grow your business.', examples: 'Equipment · Work vehicles · Business lending' }
];
const main = `<main id="main" class="source-page application-main" data-application-flow data-provider-urls="${esc(JSON.stringify(providerUrls))}">
  <section class="application-intro" aria-labelledby="application-title">
    <p class="application-eyebrow">A SMARTER WAY FORWARD</p>
    <h1 id="application-title"><span class="application-title-row"><span class="application-word application-word-start">Start</span> <span class="application-word application-word-your">your</span></span> <span class="application-title-row"><span class="application-word application-word-journey">journey</span><span class="application-title-icon" aria-hidden="true">${arrow}</span></span> <span class="application-title-row"><span class="application-word application-word-smartway">with Smartway.</span></span></h1>
    <p class="application-intro-copy">Personal plans. Business ambitions.<br>Let’s find the finance that moves you forward.</p>
    <ul class="application-reassurance"><li>${icon('check', 24)}40+ lenders</li><li>${icon('check', 24)}Personal guidance</li><li>${icon('check', 24)}No obligation</li></ul>
  </section>
  <section id="application" class="application-section" aria-labelledby="application-form-title">
    <div class="application-card">
      ${require('./application-form.cjs')({ icon, arrow, action, choices, providerUrls, esc })}
      <p class="application-privacy">By submitting an application, you consent to Smartway Finance collecting and using your information in accordance with its <a href="/privacy-disclosure.pdf">Privacy Policy</a>. Smartway Finance Pty Ltd · ACL 566769 · ABN 42 682 496 779.</p>
    </div>
    <div class="application-human-help"><span class="application-help-icon">${icon('chat')}</span><div><h2>A real team. On your side.</h2><p>Talk it through with us before you apply.</p></div><a href="tel:0755127080">07 5512 7080 ${arrow}</a><a href="/contact/">Send an enquiry ${arrow}</a></div>
  </section>
</main>`;

function refineApplyPage() {
  const file = path.join(root, 'dist/apply/index.html');
  const original = fs.readFileSync(file, 'utf8');
  // Keep the shared Explore/mobile navigation when rebuilding this custom header.
  const currentHeader = original.match(/<header[\s\S]*?<\/header>/)?.[0] || '';
  const navigationSource = currentHeader.includes('nav-explore') ? currentHeader : fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8').match(/<header[\s\S]*?<\/header>/)?.[0] || currentHeader;
  let pageHeader = header.replace('width="155" height="56"', 'width="155" height="56" draggable="false"');
  for (const className of ['desktop-nav', 'mobile-nav']) {
    const pattern = new RegExp(`<nav\\b(?=[^>]*\\bclass="${className}")[^>]*>[\\s\\S]*?<\\/nav>`);
    const navigation = navigationSource.match(pattern)?.[0];
    if (navigation) pageHeader = pageHeader.replace(pattern, navigation.replaceAll('href="#', 'href="/#'));
  }
  let html = original.replace(/<header[\s\S]*?<\/header>/, pageHeader).replace(/<main[\s\S]*?<\/main>/, main);
  html = html.replace(/<body([^>]*?)class="[^"]*"/, '<body$1class="inner-page application-page"');
  html = html.replace(/(complete\.js)\?v=[^"\s]+/g, '$1?v=20261021-apply-flow');
  if (!html.includes('/apply-page.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/apply-page.css?v=20261022-native-application"><script src="/apply-page.js?v=20261022-native-application" defer></script></head>');
  html = html.replace(/(apply-page\.(?:css|js))\?v=[^"\s]+/g, '$1?v=20261022-native-application');
  if (html !== original) fs.writeFileSync(file, html);
}
module.exports = refineApplyPage;
module.exports.providerUrls = providerUrls;
module.exports.main = main;
if (require.main === module) { refineApplyPage(); console.log('Applied the native Smartway application flow.'); }
