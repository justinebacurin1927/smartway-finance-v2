const fs = require('fs');
const path = require('path');

const sprite = '/assets/icons/smartway-doodles.svg';
const services = ['car', 'leisure', 'wallet', 'briefcase', 'credit'];
const products = ['vehicle-loans', 'leisure-finance', 'personal-loans', 'business-finance', 'credit-sense'];
const benefits = ['bank', 'clipboard', 'target', 'shield'];
const icon = (name, className = '') => `<svg class="doodle-icon${className ? ` ${className}` : ''}" data-doodle="${name}" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="${sprite}#${name}"/></svg>`;

function refineDoodleIcons() {
  const dist = path.resolve(__dirname, '../dist');
  const visit = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() && entry.name !== 'assets' ? visit(path.join(directory, entry.name)) :
      entry.isFile() && entry.name === 'index.html' ? [path.join(directory, entry.name)] : []);
  const files = visit(dist);
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    // Remove only our own additions so rerunning never duplicates an illustration.
    let html = original.replace(/<svg class="doodle-icon[^\"]*"[\s\S]*?<\/svg>/g, '');
    html = html.replace(/<link rel="stylesheet" href="\/doodle-icons\.css[^\"]*">\s*/g, '');
    html = html.replace('</head>', '<link rel="stylesheet" href="/doodle-icons.css?v=20261021-phone-size"></head>');
    // External symbols also work on secondary pages, which have no local SVG definitions.
    html = html.replace(/<svg class="icon"[^>]*>\s*<use href="(?:#|\/assets\/icons\/smartway-doodles\.svg#)(phone|check)"\s*\/>\s*<\/svg>/g,
      (_match, name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="${sprite}#${name}"/></svg>`);

    if (file === path.join(dist, 'index.html')) {
      html = html.replace(/(<button[^>]*data-finance-choice="(\d)"[^>]*>)(?:<span class="finance-word-number">\d+<\/span>)?/g,
        (_match, opening, index) => opening + icon(services[Number(index)], 'finance-word-icon'));
      let benefitIndex = 0;
      html = html.replace(/(<article class="benefit-item">)(?:<span class="benefit-index"[^>]*>\d+<\/span>)?/g,
        (_match, opening) => opening + icon(benefits[benefitIndex++], 'benefit-icon'));
      html = html.replace(/(<nav class="finance-guidance"[^>]*>)([\s\S]*?)(<\/nav>)/, (_match, opening, links, closing) => {
        links = links.replace(/(<a href="\/compare\/">)/, '$1' + icon('scales'));
        links = links.replace(/(<a href="\/finance-options\/credit-sense\/">)/, '$1' + icon('shield'));
        return opening + links + closing;
      });
      html = html.replace(/(<div class="film-(?:result|paper)">)<svg[^>]*>[\s\S]*?<\/svg>/g,
        '$1<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="' + sprite + '#check"/></svg>');
    }

    if (file === path.join(dist, 'finance-options/index.html')) {
      let index = 0;
      html = html.replace(/(<h2 class="">)/g, opening => index < services.length ? icon(services[index++], 'doodle-product-icon') + opening : opening);
    }
    const product = products.find(route => file === path.join(dist, 'finance-options', route, 'index.html'));
    if (product) {
      html = html.replace(/(<h1\b[^>]*>)/, icon(services[products.indexOf(product)], 'doodle-product-icon') + '$1');
    }
    if (file === path.join(dist, 'contact/index.html')) {
      html = html.replace('<aside class="contact-human">', '<aside class="contact-human">' + icon('chat'));
    }
    if (html !== original) fs.writeFileSync(file, html);
  }
  return files.length;
}

module.exports = refineDoodleIcons;
if (require.main === module) console.log(`Applied the mint and plum icon family to ${refineDoodleIcons()} pages.`);
