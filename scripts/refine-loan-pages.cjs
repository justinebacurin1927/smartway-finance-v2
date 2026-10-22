const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const { pages } = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8'));
const text = n => typeof n === 'string' ? n : (n.children || []).map(text).join('');
const nodes = (n, tag) => typeof n === 'string' ? [] : [...(n.tag === tag ? [n] : []), ...(n.children || []).flatMap(child => nodes(child, tag))];
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const config = {
 'vehicle-loans': { icon:'car', group:'vehicle' }, 'new-car-finance': { icon:'car', group:'vehicle' }, 'used-car-finance': { icon:'car', group:'vehicle' },
 'leisure-finance': { icon:'leisure', group:'leisure' }, 'motorbike-finance': { icon:'motorcycle', group:'leisure' }, 'boat-finance': { icon:'leisure', group:'leisure' }, 'jet-ski-finance': { icon:'leisure', group:'leisure' }, 'caravan-finance': { icon:'caravan', group:'leisure' },
 'personal-loans': { icon:'wallet', group:'personal' }, 'business-finance': { icon:'briefcase', group:'business' }, 'commercial-finance': { icon:'briefcase', group:'business' }, 'credit-sense': { icon:'shield', group:'credit' }
};
const icon = name => `<svg class="lp-icon" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg>`;
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const action = (href, label, graphic = '', dark = true) => `<a class="button finance-hero-action${dark ? ' finance-hero-action--navy' : ''}" href="${esc(href)}"><span class="finance-action-label">${graphic ? icon(graphic) : ''}<span>${esc(label)}</span></span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow">${arrow}</span></span></a>`;
const words = (copy, accent = true) => copy.split(/\s+/).map((word, index, all) => `${index ? ' ' : ''}${accent && index === all.length-1 ? '<em>' : ''}<span class="lp-word">${esc(word)}</span>${accent && index === all.length-1 ? '</em>' : ''}`).join('');
const photo = page => {
 const image = page.images[0];
 const name = path.basename(image.local);
 return { src:`/assets/site/optimized/${name}.webp`, alt:image.alt || page.title };
};
const sourceModels = Object.entries(config).map(([slug, settings]) => {
 const route = `/finance-options/${slug}`;
 const page = pages[route];
 const sections = nodes(page.main,'section');
 const intro = nodes(sections[0],'p').map(text);
 const info = nodes(sections[2],'p').map(text);
 const questionStart = info.indexOf('Common Questions') + 1;
 return { slug, route, ...settings, title:text(nodes(sections[0],'h1')[0]), subtitle:intro[0], description:intro[1], image:photo(page), rates:nodes(sections[0],'span').map(text), structures:nodes(sections[1],'span').map(text), benefits:info.slice(1,questionStart-1), why:text(nodes(sections[2],'h2')[0]), faqs:Array.from({length:(info.length-questionStart)/2},(_,i)=>({question:info[questionStart+i*2],answer:info[questionStart+i*2+1]})), disclosure:text(nodes(sections[3],'p')[0]), closing:text(nodes(sections[4],'p')[0]), related:nodes(sections[5],'a').filter(a=>nodes(a,'h3').length).map(a=>({route:a.attrs.href,title:text(nodes(a,'h3')[0]),description:text(nodes(a,'p')[0])})), paragraphs:sections.flatMap(section=>nodes(section,'p').map(text)) };
});
const find = route => sourceModels.find(model => model.route === route);
const applyHref = model => `/apply/${model.group === 'business' ? '?type=business' : ''}`;
function ratePanel(model) {
 if (model.rates.length > 1) return `<div class="lp-rates" aria-label="Advertised interest and comparison rates">${model.rates.map((rate,index)=>`<div><span>${index ? 'Comparison rate' : 'Interest rate'}</span><strong>${esc(rate.replace(/^Comparison rate\s*/i,''))}</strong></div>`).join('')}<a href="#loan-rate-information">Rate information &amp; comparison-rate warning ↓</a></div>`;
 return `<p class="lp-specialism">${icon(model.icon)}<span>${esc(model.rates[0])}</span></p>`;
}
function subtypeLinks(model) {
 const related = sourceModels.filter(m=>m.group===model.group && m.slug!==model.slug);
 if (!related.length) return '';
 return `<nav class="lp-subtypes" aria-label="Related ${model.group} finance"><span>Explore ${model.group} finance</span><div>${related.map(m=>`<a href="${m.route}/">${icon(m.icon)}<span>${esc(m.title)}</span>${arrow}</a>`).join('')}</div></nav>`;
}
function relatedCard(item,index) {
 const model = find(item.route);
 return `<article class="lp-related-card lp-related-${index%3}"><div class="lp-card-pattern" aria-hidden="true"></div>${icon(model.icon)}<h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${action(`${item.route}/`,'Learn more','',false)}</article>`;
}
function closing(title, description, href='/apply/', contact=false) {
 return `<section class="lp-closing" aria-labelledby="loan-closing-title"><div class="lp-checker" aria-hidden="true"></div><div class="lp-wrap"><div>${icon('chat')}<p class="lp-kicker">Your next chapter</p><h2 id="loan-closing-title">${title}</h2><p>${esc(description)}</p></div><div class="lp-closing-actions">${action(contact?'/contact/':href,contact?'Talk to our team':"Apply Now — It's Free",contact?'chat':'clipboard',false)}${action('tel:0755127080','07 5512 7080','phone',false)}</div></div></section>`;
}
function productMain(model) {
 const disclosure = esc(model.disclosure).replace('WARNING:', '<strong>WARNING:</strong>');
 return `<main id="main" class="source-page lp-main" data-loan-page="${model.slug}">
  <section class="lp-hero lp-wrap" aria-labelledby="loan-title"><div class="lp-hero-stage"><div class="lp-hero-copy"><p class="lp-kicker">Finance options</p><div class="lp-product-icon">${icon(model.icon)}</div><h1 id="loan-title">${words(model.title)}</h1><p class="lp-subtitle">${esc(model.subtitle)}</p><div class="lp-actions">${action(applyHref(model),'Apply now','clipboard')}${action('tel:0755127080','Call our team','phone',false)}</div>${ratePanel(model)}</div><figure class="lp-hero-photo"><div class="lp-photo-field"><img src="${model.image.src}" alt="${esc(model.title)}" width="900" height="700" fetchpriority="high" draggable="false"></div><figcaption>${icon('handshake')}<span>Personal guidance.<br><strong>From enquiry to settlement.</strong></span></figcaption><span class="lp-photo-symbol" aria-hidden="true">${icon(model.icon)}</span></figure></div>
   <div class="lp-introduction"><div>${icon('handshake')}<span>A smarter way forward</span></div><p>${esc(model.description)}</p></div><aside id="loan-rate-information" class="lp-rate-information" aria-label="Rate information and comparison-rate warning"><p>${disclosure}</p></aside>
  </section>
  <section class="lp-structures" aria-labelledby="loan-structures-title"><div class="lp-wrap"><header><p class="lp-kicker">Find your fit</p><h2 id="loan-structures-title">${model.group==='credit' ? 'Credit guidance, <em>made clear.</em>' : 'Available loan <em>structures.</em>'}</h2></header><ul>${model.structures.map((structure,index)=>`<li>${icon(['wallet','car','briefcase','clipboard','shield'][index%5])}<span>${esc(structure)}</span></li>`).join('')}</ul>${subtypeLinks(model)}</div></section>
  <section class="lp-benefits lp-wrap" aria-labelledby="loan-benefits-title"><header class="lp-section-heading"><p class="lp-kicker">What’s included</p><h2 id="loan-benefits-title">${words(model.why)}</h2></header><div class="lp-benefit-grid">${model.benefits.map((benefit,index)=>`<article class="lp-benefit">${icon(['target','scales','clipboard','handshake','shield','bank'][index%6])}<p>${esc(benefit)}</p></article>`).join('')}</div></section>
  <section class="lp-faq" aria-labelledby="loan-faq-title"><div class="lp-wrap"><header class="lp-section-heading"><p class="lp-kicker">Common questions</p><h2 id="loan-faq-title">${words('Frequently asked.')}</h2><p>A little clarity before your next move.</p>${action('/faqs/','View all FAQs','chat')}</header><div class="lp-faq-list">${model.faqs.map(faq=>`<details><summary><span>${esc(faq.question)}</span><span class="lp-faq-toggle" aria-hidden="true">+</span></summary><div><p>${esc(faq.answer)}</p></div></details>`).join('')}</div></div></section>
  <section class="lp-related lp-wrap" aria-labelledby="loan-related-title"><header class="lp-section-heading lp-heading-split"><div><p class="lp-kicker">Explore more</p><h2 id="loan-related-title">${words('Other finance options.')}</h2></div>${action('/finance-options/','View all finance options','scales',false)}</header><div class="lp-related-grid">${model.related.map(relatedCard).join('')}</div></section>
  ${closing('Ready to<br><em>get started?</em>',model.closing,applyHref(model))}
 </main>`;
}
function overviewMain() {
 const source = nodes(pages['/finance-options'].main,'section');
 const introduction = nodes(source[0],'p').map(text);
 const cards = nodes(source[1],'a').filter(a=>nodes(a,'h2').length).map((a,index)=>{
  const model=find(a.attrs.href);
  const spans=nodes(a,'span').map(text);
  return `<article class="lp-overview-card"><figure><img src="${model.image.src}" alt="${esc(model.title)}" width="900" height="650" loading="lazy" draggable="false"><span>${icon(model.icon)}</span></figure><div class="lp-overview-copy"><p class="lp-kicker">${esc(spans[0])}</p><h2>${words(model.title)}</h2><p>${esc(text(nodes(a,'p')[0]))}</p><ul>${spans.slice(1).map(item=>`<li><span aria-hidden="true">✓</span>${esc(item)}</li>`).join('')}</ul>${model.rates.length>1?ratePanel(model):''}${action(`${model.route}/`,'Explore '+model.title,'',true)}</div></article>`;
 });
 const mains = ['vehicle-loans','leisure-finance','personal-loans','business-finance','credit-sense'];
 const specialists=sourceModels.filter(model=>!mains.includes(model.slug));
 return `<main id="main" class="source-page lp-main lp-overview" data-loan-page="overview"><section class="lp-overview-hero lp-wrap" aria-labelledby="loan-title"><div class="lp-overview-stage"><p class="lp-kicker">Finance options</p><h1 id="loan-title">${words('Finance made simple,')}<br>${words('no matter your goals.')}</h1><div class="lp-overview-intro"><p>${esc(introduction[1])}</p>${icon('handshake')}</div></div></section><section class="lp-overview-products lp-wrap" aria-label="Finance options">${cards.join('')}<aside id="loan-rate-information" class="lp-rate-information" aria-label="Rate information and comparison-rate warning"><p>${esc(sourceModels[0].disclosure).replace('WARNING:','<strong>WARNING:</strong>')}</p></aside></section><section class="lp-specialists" aria-labelledby="loan-specialists-title"><div class="lp-wrap"><header class="lp-section-heading"><p class="lp-kicker">Your next move</p><h2 id="loan-specialists-title">${words('Explore your options.')}</h2></header><div class="lp-specialist-grid">${specialists.map(model=>`<a href="${model.route}/">${icon(model.icon)}<span>${esc(model.title)}</span>${arrow}</a>`).join('')}</div></div></section>${closing('Not sure which option<br>is right <em>for you?</em>',text(nodes(source[2],'p')[0]),'/apply/',true)}</main>`;
}
function refineLoanPages() {
 const entries=[['/finance-options',overviewMain()],...sourceModels.map(model=>[model.route,productMain(model)])];
 for(const [route,main]of entries){
  const file=path.join(dist,route,'index.html');
  const original=fs.readFileSync(file,'utf8');
  let html=original.replace(/<main\b[\s\S]*?<\/main>/,main).replace(/<body([^>]*?)class="[^"]*"/,'<body$1class="inner-page loan-page"');
  for(const [asset,tag]of [['arrow-action.css','link'],['loan-pages.css','link'],['brand-story.js','script'],['loan-pages.js','script']]){
   const url=`/${asset}?v=20261022-renovated-loans`;
   if(!html.includes(`"/${asset}`))html=html.replace('</head>',`${tag==='link'?`<link rel="stylesheet" href="${url}">`:`<script src="${url}" defer></script>`}</head>`);
   else html=html.replace(new RegExp(`/${asset.replaceAll('.','\\.')}(?:\\?[^"\\s]*)?`,'g'),url);
  }
  if(html!==original)fs.writeFileSync(file,html);
 }
 return entries.length;
}
module.exports=refineLoanPages;
module.exports.models=sourceModels;
module.exports.overviewMain=overviewMain;
if(require.main===module)console.log(`Renovated ${refineLoanPages()} finance pages.`);
