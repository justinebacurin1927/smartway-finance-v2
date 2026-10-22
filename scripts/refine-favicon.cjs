const fs = require('node:fs');
const path = require('node:path');

const version = '20261021-smartway-mark';
const links = `<link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48" href="/favicon.ico?v=${version}"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=${version}"><link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg?v=${version}">`;

function refineFavicon() {
  const dist = path.resolve(__dirname, '../dist');
  const visit = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() && entry.name !== 'assets' ? visit(path.join(directory, entry.name)) :
      entry.isFile() && entry.name === 'index.html' ? [path.join(directory, entry.name)] : []);
  const files = visit(dist);
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    let inserted = false;
    let html = original.replace(/<link\b(?=[^>]*\brel=["'](?:icon|shortcut icon)["'])[^>]*>/gi, () => {
      if (inserted) return '';
      inserted = true;
      return links;
    });
    if (!inserted) html = html.replace('</head>', links + '</head>');
    if (html !== original) fs.writeFileSync(file, html);
  }
  return files.length;
}

module.exports = refineFavicon;
module.exports.links = links;
if (require.main === module) console.log(`Updated favicons on ${refineFavicon()} pages.`);
