const fs = require('node:fs');
const path = require('node:path');

const financeHeading = `<div class="finance-editorial-heading"><h2 id="finance-title"><span class="finance-title-piece">Finance</span> <span class="finance-title-piece">Made</span> <span class="finance-title-piece">Simple,</span> <em><span class="finance-title-piece">No</span> <span class="finance-title-piece">Matter</span> <span class="finance-title-piece">Your</span> <span class="finance-title-piece">Goals.</span></em></h2></div>`;

function refineBrandStory() {
  const file = path.join(__dirname, '../dist/index.html');
  let home = fs.readFileSync(file, 'utf8');
  home = home.replace(/<section id="brand-story"[\s\S]*?<\/section>\s*/, '');
  home = home.replace(/<div id="brand-story"[\s\S]*?<!-- \/brand-story -->\s*/, '');
  const marker = /<div class="finance-editorial-heading">[\s\S]*?(?=<div class="finance-theatre">)/;
  if (!marker.test(home)) throw new Error('Cannot find the Finance section heading.');
  home = home.replace(marker, financeHeading);
  if (!home.includes('/brand-story.css')) {
    home = home.replace('</head>', '<link rel="stylesheet" href="/brand-story.css?v=20261021-1"><script src="/brand-story.js?v=20261021-1" defer></script></head>');
  }
  home = home.replace(/(brand-story\.(?:css|js))\?v=[^"\s]+/g, '$1?v=20261021-about-cards');
  home = home.replace(/(brand-story\.js)\?v=[^"\s]+/g, '$1?v=20261021-benefit-card-motion');
  fs.writeFileSync(file, home);
}

module.exports = refineBrandStory;
module.exports.financeHeading = financeHeading;
if (require.main === module) refineBrandStory();
