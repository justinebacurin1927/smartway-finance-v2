const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
const text = node => typeof node === 'string' ? node : node.children.map(text).join('');
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...node.children.flatMap(child => nodes(child, tag))];
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const sections = nodes(pages['/about'].main, 'section');
const intro = nodes(sections[0], 'p').map(text);
const mission = nodes(sections[1], 'p').map(text).slice(1);
const people = nodes(sections[3], 'p').map(text);
const credentials = nodes(sections[4], 'p').map(text);
const valueTitles = nodes(sections[2], 'h3').map(text);
const valueCopy = nodes(sections[2], 'p').map(text).slice(1);
const icon = (name, className = '') => `<svg class="ap-icon ${className}" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const action = (href, label, graphic = '', variant = 'navy') => `<a class="button finance-hero-action${variant === 'navy' ? ' finance-hero-action--navy' : ''}" href="${href}"><span class="finance-action-label">${graphic ? icon(graphic) : ''}<span>${label}</span></span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow">${arrow}</span></span></a>`;
const words = (items, serif = -1) => items.map((word, index) => `${index ? ' ' : ''}${index === serif ? '<em>' : ''}<span class="ap-motion-word">${esc(word)}</span>${index === serif ? '</em>' : ''}`).join('');
const patterns = [
  `<svg class="about-card-art about-card-art-blocks" viewBox="0 0 320 640" preserveAspectRatio="xMaxYMin slice" aria-hidden="true">${Array.from({ length: 8 }, (_, row) => Array.from({ length: 4 }, (_, col) => `<path fill="currentColor" opacity="${[.06,.22,.42,.16][(row * 3 + col) % 4]}" d="M${col*80} ${row*80}h80v80h-80z"/>`).join('')).join('')}</svg>`,
  '<svg class="about-card-art about-card-art-circles" viewBox="0 0 320 220" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="20"><circle cx="13" cy="64" r="93"/><circle cx="13" cy="64" r="57"/><circle cx="13" cy="64" r="21"/></g><path fill="currentColor" opacity=".45" d="M158 0h72v72h-72zM230 72h72v72h-72z"/><path fill="currentColor" opacity=".7" d="m158 144 72-72v144z"/></svg>',
  '<svg class="about-card-art about-card-art-angles" viewBox="0 0 320 220" aria-hidden="true"><g fill="currentColor"><path opacity=".35" d="M0 0h110v110zM110 110h110V0z"/><path opacity=".65" d="M0 110h110v110zM220 110h100V10z"/><path opacity=".45" d="M220 220a60 60 0 0 1 0-120v120Z"/></g></svg>'
];
const missionNames = ['Your goals.<br>Our starting point.', 'Clear guidance.<br>Every step.', 'Here to help.<br>Never to push.'];
const missionActions = [['/contact/', 'Get in touch'], ['/compare/', 'Explore your options'], ['tel:0755127080', '07 5512 7080']];
const cards = mission.map((copy, index) => `<article class="about-story-card about-story-card-${['main','lenders','support'][index]}${index === 0 ? ' is-active' : ''}" data-about-card="${index}">${patterns[index]}<button class="about-card-toggle" type="button" aria-labelledby="about-card-title-${index}" aria-controls="about-card-details-${index}" aria-pressed="${index === 0}" hidden></button><div class="about-card-copy"><p class="about-card-kicker">${['A personal approach','A smarter process','A real partnership'][index]}</p><h3 id="about-card-title-${index}">${missionNames[index]}</h3><div class="about-card-details" id="about-card-details-${index}"><div class="about-card-details-inner"><p>${esc(copy)}</p>${action(...missionActions[index], '', 'light')}</div></div></div></article>`).join('');
const profile = (name, image, credential, paragraphs, badge = '') => `<article class="ap-profile" aria-labelledby="${name.split(' ')[0].toLowerCase()}-name"><figure><img src="/assets/site/optimized/${image}" alt="${name} — Director and Senior Finance Broker, Smartway Finance" width="1440" height="1800" loading="lazy" draggable="false">${badge ? `<figcaption>${icon('review')}<span>${badge}</span></figcaption>` : ''}</figure><div class="ap-profile-copy"><p class="ap-profile-role">Director &amp; Senior Finance Broker</p><h3 id="${name.split(' ')[0].toLowerCase()}-name">${name}</h3><p class="ap-profile-credential">${esc(credential)}</p>${paragraphs.map(copy => `<p>${esc(copy)}</p>`).join('')}<a class="ap-profile-link" href="/contact/">Talk to our team ${arrow}</a></div></article>`;
const main = `<main id="main" class="source-page ap-main" data-about-page>
 <section class="ap-hero ap-wrap" aria-labelledby="ap-hero-title">
  <div class="ap-hero-stage"><div class="ap-hero-copy"><p class="ap-section-label">About Smartway Finance</p><h1 id="ap-hero-title">${words(['Smarter','finance.'])}<br>${words(['Tailored','for','you.'], 2)}</h1><p class="ap-hero-description">${esc(intro[1])}</p><div class="ap-hero-actions">${action('#ap-team', 'Meet the team', 'handshake')}${action('/contact/', 'Let’s talk', 'chat', 'light')}</div><p class="ap-location-note">${icon('bank')}Gold Coast home. Australia-wide support.</p></div>
   <figure class="ap-hero-photo"><div class="ap-portrait-frame"><img src="/assets/site/optimized/caraandalice.jpg.webp" alt="Cara Rogers and Alice Blay — Co-Directors of Smartway Finance" width="1800" height="1440" fetchpriority="high" draggable="false"></div><figcaption><span><strong>Cara Rogers &amp; Alice Blay</strong><span>Co-Directors · Smartway Finance</span></span><span class="ap-photo-mark" aria-hidden="true">${icon('handshake')}</span></figcaption><div class="ap-hero-award">${icon('review')}<div><p>${esc(intro[2])}</p><strong>${esc(intro[3])}</strong><span>${esc(intro[4])}</span></div></div></figure>
  </div>
 </section>
 <section id="about" class="about-editorial about-card-section ap-mission" aria-labelledby="ap-mission-title"><div class="ap-wrap about-intro-stage"><header class="ap-section-heading"><p class="ap-section-label">Our mission</p><h2 id="ap-mission-title">${words(['We','work','for','you.'])}<br>${words(['Not','the','banks.'], 2)}</h2></header><div class="about-story-cards" data-active-card="0" data-collapse-all>${cards}</div></div></section>
 <section id="ap-values" class="ap-values ap-wrap" aria-labelledby="ap-values-title"><header class="ap-section-heading ap-heading-split"><div><p class="ap-section-label">What we stand for</p><h2 id="ap-values-title">${words(['Our','core','values.'], 2)}</h2></div><p>Good finance starts with people<br>who put you first.</p></header><div class="ap-values-grid">${valueTitles.map((title, index) => `<article class="ap-value-card benefit-item">${icon(['scales','handshake','bank','clipboard'][index])}<div><h3>${esc(title)}</h3><p>${esc(valueCopy[index])}</p></div></article>`).join('')}</div></section>
 <section id="ap-team" class="ap-team" aria-labelledby="ap-team-title"><div class="ap-wrap"><header class="ap-section-heading ap-team-heading"><p class="ap-section-label">The team</p><h2 id="ap-team-title">${words(['Meet','Cara','&','Alice.'], 3)}</h2><p class="ap-team-intro">${esc(people[1])}</p></header><div class="ap-team-story"><div><p class="ap-section-label">Co-Directors</p><h3>Cara Rogers &amp; Alice Blay</h3><p class="ap-team-directors">${esc(people[2])}</p></div><div>${people.slice(3,5).map(copy => `<p>${esc(copy)}</p>`).join('')}</div></div><div class="ap-profiles">${profile('Cara Rogers','20260120AliceBlay0109-edit.jpg.webp',people[5],people.slice(6,8))}${profile('Alice Blay','20260120AliceBlay0115-edit.jpg.webp',people[8],people.slice(9,11),'NSW Broker of the Year 2024')}</div><div class="ap-team-actions">${action('/contact/', 'Work with us', 'handshake')}${action('tel:0755127080', 'Call us', 'phone', 'light')}</div></div></section>
 <section id="ap-credentials" class="ap-credentials" aria-labelledby="ap-credentials-title"><div class="ap-wrap"><header class="ap-section-heading ap-credentials-heading"><p class="ap-section-label">Our credentials</p><h2 id="ap-credentials-title">${words(['Fully','licensed.'])}<br>${words(['&','accredited.'], 1)}</h2><p>${esc(credentials[1])}</p></header><div class="ap-credential-grid">${['shield','briefcase','bank','scales'].map((graphic, index) => `<article class="ap-credential">${icon(graphic)}<p>${esc(credentials[2+index*3])}</p><h3>${esc(credentials[3+index*3])}</h3><span>${esc(credentials[4+index*3])}</span></article>`).join('')}</div></div></section>
 <section class="ap-invitation" aria-labelledby="ap-invitation-title"><div class="ap-checker" aria-hidden="true"></div><div class="ap-wrap"><p class="ap-section-label">Your next chapter</p><h2 id="ap-invitation-title">Ready to experience<br>the <em>Smartway difference?</em></h2><p>Get a free, no-obligation quote today. We’re here to help.</p><div class="ap-invitation-actions">${action('/apply/', 'Apply now', 'clipboard')}${action('/faqs/', 'Read FAQs', 'chat', 'light')}${action('tel:0755127080', '07 5512 7080', 'phone', 'light')}</div></div></section>
</main>`;

function refineAboutPage() {
  const file = path.join(dist, 'about/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/<main[\s\S]*?<\/main>/, main).replace(/<body([^>]*?)class="[^"]*"/, '<body$1class="inner-page about-page"');
  const assets = [
    ['link','/about.css?v=20261021-benefit-contact-cta'],
    ['link','/arrow-action.css?v=20261022-shared'],
    ['link','/about-page.css?v=20261022-scroll-header'],
    ['script','/about-cards.js?v=20261022-collapse-option'],
    ['script','/brand-story.js?v=20261022-reusable'],
    ['script','/about-page.js?v=20261022-scroll-header']
  ];
  for (const [tag, url] of assets) {
    const base = url.split('?')[0];
    if (!html.includes(`"${base}`)) html = html.replace('</head>', `${tag === 'link' ? `<link rel="stylesheet" href="${url}">` : `<script src="${url}" defer></script>`}</head>`);
    else html = html.replace(new RegExp(`${base.replaceAll('.', '\\.')}\\?v=[^"\\s]+`, 'g'), url);
  }
  if (html !== original) fs.writeFileSync(file, html);
}
module.exports = refineAboutPage;
module.exports.main = main;
module.exports.sourceParagraphs = sections.flatMap(section => nodes(section,'p').map(text));
if (require.main === module) { refineAboutPage(); console.log('Applied the shared Smartway design to the full About page.'); }
