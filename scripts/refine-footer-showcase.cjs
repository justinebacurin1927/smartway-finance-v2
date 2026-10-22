const fs = require('node:fs');
const path = require('node:path');

const photographs = [
  ['new-car-finance-loans-05-smartway-finance.jpg.webp', '14% 20%', 2.2, '0% 0%'],
  ['business-finance-tradie.png.webp', '50% 30%', 1.8, '50% 0%'],
  ['caravan-finance-loans-03-smartway-finance.jpg.webp', '78% 30%', 1.8, '50% 50%'],
  ['20260120AliceBlay0109-edit.jpg.webp', '50% 32%', 1.8, '50% 0%'],
  ['commerical-finance-loans-australia-02-smartway-finance.jpg.webp', '35% 30%', 1.8, '50% 0%'],
  ['20260120AliceBlay0115-edit.jpg.webp', '50% 30%', 1.8, '50% 0%'],
  ['personal-loans-02-smartway-finance.jpg.webp', '50% 30%', 1.8, '50% 0%'],
  ['leisure-finance-boat.png.webp', '68% 25%', 1.6, '50% 20%'],
  ['caravan-finance-loans-03-smartway-finance.jpg.webp', '94% 25%', 1.9, '80% 40%'],
  ['personal-loans-wedding.jpg.webp', '50% 48%', 1.5, '50% 50%'],
  ['new-car-finance-loans-05-smartway-finance.jpg.webp', '28% 22%', 2.2, '0% 0%']
];
const angles = [-16, 18, -24, 33, -20, -12, 21, -25, 14, -20, 22];
const mobile = [0, 2, 3, 5, 7, 8, 10];
const arc = x => 66 - 40 * Math.exp(-Math.pow((x - 53) / 25, 2));
const cards = photographs.map(([file, position, zoom, origin], index) => {
  const x = -3 + index * 10.6;
  const mobileIndex = mobile.indexOf(index);
  const mobileX = mobileIndex * 100 / (mobile.length - 1);
  const front = [0, 2, 3, 6, 8, 10].includes(index);
  const style = `--card-x:${x}%;--card-y:${arc(x).toFixed(2)}%;--card-angle:${angles[index]}deg;--photo-position:${position};--photo-zoom:${zoom};--photo-origin:${origin}${mobileIndex < 0 ? '' : `;--mobile-x:${mobileX}%;--mobile-y:${arc(mobileX).toFixed(2)}%`}`;
  return `<div class="footer-showcase-card${front ? ' is-front' : ''}"${mobileIndex < 0 ? '' : ' data-mobile'} style="${style}"><img src="/assets/site/optimized/${file}" alt="" loading="lazy" decoding="async" width="180" height="180"></div>`;
}).join('');
const showcase = `<div id="footer-showcase" class="footer-showcase" aria-hidden="true"><svg class="footer-showcase-word" viewBox="0 0 1440 560" preserveAspectRatio="none" focusable="false"><text x="720" y="420" text-anchor="middle" textLength="1240" lengthAdjust="spacingAndGlyphs">SMARTWAY</text></svg>${cards}</div><!-- /footer-showcase -->`;

function refineFooterShowcase() {
  const dist = path.resolve(__dirname, '../dist');
  const visit = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() && entry.name !== 'assets' ? visit(path.join(directory, entry.name)) : entry.isFile() && entry.name === 'index.html' ? [path.join(directory, entry.name)] : []);
  let count = 0;
  for (const file of visit(dist)) {
    const original = fs.readFileSync(file, 'utf8');
    if (!original.includes('id="site-footer"')) continue;
    let html = original.replace(/<div id="footer-showcase"[\s\S]*?<!-- \/footer-showcase -->\s*/g, '');
    html = html.replace(/(<footer id="site-footer" class=")([^"]*)(")/, (_match, start, classes, end) => `${start}${classes.split(/\s+/).filter(Boolean).filter(name => name !== 'has-footer-showcase').concat('has-footer-showcase').join(' ')}${end}`);
    html = html.replace('</footer>', `${showcase}</footer>`);
    if (!html.includes('/footer-showcase.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/footer-showcase.css?v=20261021-footer-match"><script src="/footer-showcase.js?v=20261021-ribbon" defer></script></head>');
    html = html.replace(/(footer-showcase\.css)\?v=[^"\s]+/g, '$1?v=20261021-footer-match');
    if (html !== original) fs.writeFileSync(file, html);
    count++;
  }
  return count;
}

module.exports = refineFooterShowcase;
if (require.main === module) console.log(`Applied the Smartway footer ribbon to ${refineFooterShowcase()} pages.`);
