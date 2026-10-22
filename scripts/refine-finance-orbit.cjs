const fs = require('node:fs');
const path = require('node:path');

function refineFinanceOrbit() {
  const file = path.resolve(__dirname, '../dist/index.html');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(/(<section id="finance"[^>]*>\s*<div class=")([^"]*)(")/, (_match, start, classes, end) =>
    start + [...new Set([...classes.split(/\s+/).filter(Boolean), 'finance-orbit-stage'])].join(' ') + end);
  if (!html.includes('finance-orbit-stage')) throw new Error('Cannot find the existing Finance section.');
  // Share the landing CTA's label/circular-arrow structure with every product link.
  html = html.replace(/<a\b([^>]*\bclass=")([^"]*\bfinance-explore\b[^"]*)(")([^>]*)>([\s\S]*?)<\/a>/g,
    (_match, before, classes, quote, after, body) => {
      const label = body.match(/<span class="finance-action-label">([\s\S]*?)<\/span>/)?.[1] || body;
      const names = [...new Set([...classes.split(/\s+/).filter(Boolean), 'button', 'finance-hero-action'])].join(' ');
      return `<a${before}${names}${quote}${after}><span class="finance-action-label">${label}</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;
    });
  html = html.replace(/(<nav class="finance-guidance"[^>]*>)([\s\S]*?)(<\/nav>)/,
    (_match, opening, links, closing) => {
      const guidance = {
        '/compare/': ['Compare loan types', 'scales'],
        '/finance-options/credit-sense/': ['Understand your credit', 'shield']
      };
      const start = opening.includes('id=') ? opening : opening.replace('>', ' id="finance-guidance">');
      return start + links.replace(/<a\b([^>]*\bhref="([^"]+)"[^>]*)>[\s\S]*?<\/a>/g,
        (original, attributes, href) => {
          if (!guidance[href]) return original;
          const [label, icon] = guidance[href];
          const classes = ['button', 'finance-hero-action', 'finance-guidance-action'];
          const attrs = /\bclass="/.test(attributes) ? attributes.replace(/class="([^"]*)"/,
            (_class, names) => `class="${[...new Set([...names.split(/\s+/).filter(Boolean), ...classes])].join(' ')}"`) :
            attributes + ` class="${classes.join(' ')}"`;
          return `<a${attrs}><span class="finance-action-label"><svg class="finance-guidance-icon" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${icon}"/></svg><span>${label}</span></span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;
        }) + closing;
    });
  html = html.replace(/<link rel="stylesheet" href="\/finance-orbit\.css[^\"]*">\s*/g, '');
  html = html.replace(/<script src="\/finance-orbit\.js[^\"]*" defer><\/script>\s*/g, '');
  html = html.replace('</head>', '<link rel="stylesheet" href="/finance-orbit.css?v=20261021-button-alignment"><script src="/finance-orbit.js?v=20261021-yuen-orbit" defer></script></head>');
  html = html.replace(/(hero-concept\.css\?v=)([^"\s]+)/g,
    (_match, prefix, version) => prefix + (version.includes('shared-cta') ? version : `${version}-shared-cta`));
  // Refresh the two existing controllers that coordinate with the new gallery.
  html = html.replace(/(enhance\.js)\?v=[^"\s]+/g, '$1?v=20261021-finance-orbit');
  html = html.replace(/(brand-story\.js)\?v=[^"\s]+/g, '$1?v=20261021-benefit-card-motion');
  if (html !== original) fs.writeFileSync(file, html);
}

module.exports = refineFinanceOrbit;
if (require.main === module) refineFinanceOrbit();
