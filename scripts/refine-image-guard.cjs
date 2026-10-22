const fs = require('node:fs');
const path = require('node:path');

const version = '20261021-no-image-drag';
const assets = `<link rel="stylesheet" href="/image-guard.css?v=${version}"><script src="/image-guard.js?v=${version}" defer></script>`;

function refineImageGuard() {
  const dist = path.resolve(__dirname, '../dist');
  const visit = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() && entry.name !== 'assets' ? visit(path.join(directory, entry.name)) :
      entry.isFile() && entry.name.endsWith('.html') ? [path.join(directory, entry.name)] : []);
  const files = visit(dist);
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    let html = original.replace(/<img\b([^>]*?)>/gi, (_match, attributes) => {
      const clean = attributes.replace(/\s+draggable(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '');
      return `<img${clean} draggable="false">`;
    });
    html = html.replace(/<link\b[^>]*href="\/image-guard\.css[^\"]*"[^>]*>/g, '');
    html = html.replace(/<script\b[^>]*src="\/image-guard\.js[^\"]*"[^>]*><\/script>/g, '');
    html = html.replace('</head>', assets + '</head>');
    if (html !== original) fs.writeFileSync(file, html);
  }
  return files.length;
}

module.exports = refineImageGuard;
if (require.main === module) console.log(`Disabled image grabbing on ${refineImageGuard()} pages.`);
