const fs = require('node:fs');
const path = require('node:path');

function refineHeroArt() {
  const file = path.resolve(__dirname, '../dist/index.html');
  let html = fs.readFileSync(file, 'utf8');
  const sizes = '(max-width: 640px) 217vw, (max-width: 1000px) 177vw, 120vw';
  const poster = '/assets/hero-fingertips-poster-1920.webp';
  const srcset = '/assets/hero-fingertips-poster-960.webp 960w, /assets/hero-fingertips-poster-1920.webp 1920w';
  const art = `<img class="hero-art hero-poster" src="${poster}" srcset="${srcset}" sizes="${sizes}" width="1920" height="1080" alt="" fetchpriority="high" decoding="async" aria-hidden="true"><video class="hero-art hero-motion" data-src="/assets/hero-fingertips-motion.mp4" poster="${poster}" width="1920" height="1080" muted loop playsinline preload="none" disablepictureinpicture tabindex="-1" aria-hidden="true"></video>`;
  // Replace only the owned media layers, leaving the live headline and actions intact.
  html = html.replace(/<video class="hero-art hero-motion"[\s\S]*?<\/video>/g, '');
  html = html.replace(/<video class="hero-video"[\s\S]*?<\/video>|<img class="hero-art(?: hero-poster)?"[^>]*>/, art);
  html = html.replace(/<button class="hero-motion-toggle"[\s\S]*?<\/button>/g, '');
  html = html.replace(/<div class="hero-controls">[\s\S]*?<\/div>/, '');
  const money = name => `<svg class="hero-money-icon hero-money-icon-${name}" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg?v=hero-money-1#money"/></svg>`;
  const heading = `<span class="hero-headline-anchor">Finance${money('finance')}</span> <span class="hero-headline-anchor">that${money('that')}</span><br>moves <span class="hero-headline-anchor">you${money('you')}</span><br><span class="hero-headline-anchor">forward.${money('forward')}</span>`;
  html = html.replace(/(<div class="hero-copy">[\s\S]*?<h1>)[\s\S]*?(<\/h1>)/, (_match, start, end) => start + heading + end);
  const action = (label, modifier = '') => `<a class="button finance-hero-action${modifier ? ` ${modifier}` : ''}" href="/apply/"><span class="finance-action-label">${label}</span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>`;
  html = html.replace(/(<div class="hero-actions">)<a\b[^>]*>[\s\S]*?<\/a>/, (_match, start) => start + action('Find my finance'));
  html = html.replace(/(<section class="finance-help finance-help-after"[^>]*>)([\s\S]*?)(<\/section>)/,
    (_match, start, body, end) => {
      const opening = start.includes('id=') ? start : start.replace('>', ' id="finance-help">');
      return opening + body.replace(/<a\b[^>]*href="\/apply\/"[^>]*>[\s\S]*?<\/a>/,
        action('Apply online', 'finance-hero-action--navy')) + end;
    });
  html = html.replace('class="hero-trust-sky"', 'class="hero-trust"');
  html = html.replace(/<span class="scene-line"><\/span>/g, '');
  if (!html.includes('class="hero-trust"')) {
    html = html.replace(/(<div class="hero-bottom wrap">[\s\S]*?<section id="lenders"[\s\S]*?<\/section>)/, '<div class="hero-trust">$1</div>');
  }
  if (!html.includes('class="hero-stats-band"')) {
    html = html.replace(/(<div class="hero-trust">)(<div class="hero-bottom wrap">[\s\S]*?)(\s*<section id="lenders")/,
      (_match, start, stats, lenders) => start + '<div class="hero-stats-band">' + stats + '</div>' + lenders);
  }
  html = html.replace('<div class="hero-stats-band">', '<div class="hero-stats-band" id="stats">');
  html = html.replace(/(<div class="metrics">)([\s\S]*?)(<\/div>)(?=<div class="scene-caption">)/,
    (_match, start, stats, end) => {
      const names = ['bank', 'handshake', 'shield'];
      let index = 0;
      const clean = stats.replace(/<svg class="hero-stat-icon"[\s\S]*?<\/svg>/g, '');
      return start + clean.replace(/<div>/g, opening => {
        const name = names[index++];
        return opening + `<svg class="hero-stat-icon" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
      }) + end;
    });
  html = html.replace(/(hero-concept\.css\?v=)([^"\s]+)/g,
    (_match, prefix, version) => prefix + '20261022-no-video-button' + (version.includes('shared-cta') ? '-shared-cta' : ''));
  html = html.replace(/(app\.js|loader\.css)\?v=[^"\s]+/g, '$1?v=20261021-money-overlays-4');
  html = html.replace('href="loader.css"', 'href="loader.css?v=20261021-clean-fintech"');
  html = html.replace(/\s*<link rel="preload" href="\/assets\/hero-(?:card-handoff|fintech-clean|fingertips-poster)[^>]*>/g, '');
  html = html.replace('</title>', `</title>\n<link rel="preload" href="${poster}" as="image" imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`);
  html = html.replace(/<script src="\/hero-video\.js[^\"]*" defer><\/script>/g, '');
  html = html.replace('</head>', '<script src="/hero-video.js?v=20261022-no-video-button" defer></script></head>');
  fs.writeFileSync(file, html);
}

module.exports = refineHeroArt;
if (require.main === module) refineHeroArt();
