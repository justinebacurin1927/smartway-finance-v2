const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const {pages}=JSON.parse(fs.readFileSync(path.join(root,'references/source-site/content.json')));
const faqs=JSON.parse(fs.readFileSync(path.join(root,'references/source-site/faqs-expanded.json')));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const text=n=>typeof n==='string'?n:(n.children||[]).map(text).join('');
const nodes=(n,tag)=>typeof n==='string'?[]:[...(n.tag===tag?[n]:[]),...(n.children||[]).flatMap(c=>nodes(c,tag))];
function render(n){
 if(typeof n==='string')return esc(n);
 let {tag,attrs:a,children}=n;a={...a};const original=a.class||'';
 if(tag==='div'&&!text(n).trim()&&!nodes(n,'img').length&&!nodes(n,'iframe').length&&!nodes(n,'input').length&&!nodes(n,'a').length&&!nodes(n,'button').length)return '';
 if(tag==='a'&&!text(n).trim()&&a['aria-label'])children=[a['aria-label']];
 if(['svg','path','video','source','script','style'].includes(tag))return '';
 const classes=[];
 if(original.includes('font-bold')&&tag==='p')classes.push('strong-copy');
 if(tag==='section')classes.push('content-section');
 if(original.includes('max-w-'))classes.push('content-container');
 if(/grid/.test(original)){classes.push('content-grid');classes.push(/(?:grid-cols-4)/.test(original)?'cols-4':/grid-cols-3/.test(original)?'cols-3':'cols-2');}
 if(original.includes('col-span-2'))classes.push('span-2');
 if(original.includes('text-center'))classes.push('center');
 if(original.includes('uppercase'))classes.push('label');
 if(original.includes('rounded-')&&/border |border-|shadow-/.test(original)&&['div','article','form'].includes(tag))classes.push('surface');
 if(original.includes('mesh-bg'))classes.push('page-masthead');
 if(original.includes('bg-[#01579B]')&&tag==='section')classes.push('navy-section');
 if(original.includes('btn-gold')||original.includes('btn-primary')||(tag==='a'&&original.includes('font-bold')&&original.includes('rounded')))classes.push('button');
 if(tag==='span'&&original.includes('rounded'))classes.push('badge');
 if(tag==='img'){
 let src=a.src||'';const url=new URL(src,'https://www.swfin.com.au');if(url.pathname==='/_next/image')src=url.searchParams.get('url');
 a.src=src.includes('smartway-logo')?'/assets/smartway-logo.png':'/assets/site/'+path.basename(new URL(src,'https://www.swfin.com.au').pathname);
 {const optimized='/assets/site/optimized/'+path.basename(a.src)+'.webp';if(fs.existsSync(path.join(dist,optimized)))a.src=optimized;}
 a.loading='lazy';
 if(a.src.includes('leisure-finance-boat'))a.loading='eager';
 }
 if(a.href?.startsWith('https://swfin.com.au')||a.href?.startsWith('https://www.swfin.com.au'))a.href=new URL(a.href).pathname;
 if(tag==='iframe'){{const optimized='/assets/site/optimized/'+path.basename(a.src)+'.webp';if(fs.existsSync(path.join(dist,optimized)))a.src=optimized;}
 a.loading='lazy';
 if(a.src.includes('leisure-finance-boat'))a.loading='eager';a.title=a.src.includes('lend.com')?'Smartway Finance loan application':'Smartway Finance office location';}
 if(tag==='button'&&!a.type)a.type='button';
 if(tag==='button'&&faqs.some(f=>f.question===text(n).trim())){
 const f=faqs.find(f=>f.question===text(n).trim());return `<details class="faq-item"><summary>${esc(f.question)}<span>+</span></summary><p>${esc(f.answer)}</p></details>`;
 }
 a.class=classes.join(' ');
 const allowed=['class','id','href','src','alt','type','name','value','placeholder','required','min','max','step','for','role','aria-label','aria-expanded','colspan','loading','title'];
 let at=Object.entries(a).filter(([k,v])=>allowed.includes(k)&&v!==undefined).map(([k,v])=>` ${k}="${esc(v)}"`).join('');
 if(['img','input','br','hr'].includes(tag))return `<${tag}${at}>`;
 return `<${tag}${at}>${children.map(render).join('')}</${tag}>`;
}
let home=fs.readFileSync(path.join(dist,'index.html'),'utf8');
// Re-running the generator replaces only the sections it owns.
const footer=render(pages['/'].footer).replace('<footer','<footer id="site-footer"');
home=home.replace(/<footer[\s\S]*?<\/footer>/,footer);
home=home.replace('href="styles.css"','href="/styles.css"').replace('href="finance.css"','href="/finance.css"').replace('href="reviews.css"','href="/reviews.css"');
if(!home.includes('complete.css'))home=home.replace('</head>','<link rel="stylesheet" href="/complete.css"><script src="/complete.js" defer></script>\n</head>');
home=home.replace('A new car. A growing business. Your next adventure.<br class="desktop-break"> Finance that helps you move forward.','Access to a broad panel of lenders and competitive lending options — vehicle, personal and business finance.');
home=home.replace(/<div class="scene-caption">[\s\S]*?<\/div><\/div><\/div>/,'<div class="scene-caption"><span class="scene-line"></span><div>Award Winner · NSW Broker of the Year<small>2024 · Alice Blay, FBAA</small></div></div></div>');
const descriptions=['Access to competitive lending options across new and used vehicles — dealerships, private sellers and more.','Motorbike, boat, jet ski and caravan finance — tailored to your adventure.','Travel, renovations, medical, weddings and more.','Equipment, vehicles & assets to grow your business.','Expert guidance to protect and improve your credit profile.'];
let cardIndex=0;home=home.replace(/(<p class="finance-choice-description">)[\s\S]*?(<\/p>)/g,(m,a,b)=>a+esc(descriptions[cardIndex++])+b);
home=home.replace('Five ways forward. One team to help you find the right fit.','Explore tailored finance solutions for your every need — from your first car to commercial equipment.');
let index=0;home=home.replace(/(<div class="chapter-card">[\s\S]*?<h3>[\s\S]*?<\/h3><p>)[\s\S]*?(<\/p>)/g,(m,a,b)=>a+esc(descriptions[index++])+b);
home=home.replace('Finance that<br><em>moves with you.</em>','Finance Made Simple,<br><em>No Matter Your Goals</em>').replace('Five ways forward, shaped around what you’re trying to do next.','Explore tailored finance solutions for your every need — from your first car to commercial equipment.');
const sections=nodes(pages['/'].main,'section');
const about=render(sections[3]).replace('<section','<section id="about"');
const process=render(sections[4]).replace('<section','<section id="process"');
home=home.replace(/<section id="about"[\s\S]*?<\/section>(?:\n?<section id="process"[\s\S]*?<\/section>)?/,about+'\n'+process);
const contact=render(sections[6]).replace('<section','<section id="contact"');
home=home.replace(/<section id="contact"[\s\S]*?<\/section>/,contact);
home=home.replace(/<section id="faqs"[\s\S]*?<\/section>/,`<section id="faqs" class="faq-section wrap"><div><p class="eyebrow dark">Frequently Asked Questions</p><h2>Got Questions?<br>We've Got Answers.</h2><a class="text-link" href="/faqs/">View all FAQs ↗</a></div><div class="faqs">${faqs.slice(0,4).map(f=>`<details><summary>${esc(f.question)}<span>+</span></summary><p>${esc(f.answer)}</p></details>`).join('')}</div></section>`);
home=home.replace('Your next move.<br><span>Made possible.</span>','Finance Made Simple,<br><span>No Matter Your Goals</span>');
home=home.replace('What our clients say','Real Stories. Real Results.').replace('Real stories from people we’ve helped move forward.','See why Australians trust Smartway Finance.');
const routes=new Set(Object.keys(pages));
function localize(s){return s.replaceAll('src="assets/','src="/assets/').replace(/https:\/\/(?:www\.)?swfin\.com\.au(?=[/"#])/g,'').replace(/href="(\/[^"?#]*?)(?:\/)?"/g,(m,r)=>routes.has(r)?`href="${r==='/'?'/':r+'/'}"`:m);}
home=home.replace('We’re here to help — call us or get a free online quote today.',"We're here to help — call us or get a free online quote today.");
home=localize(home);
if(!home.includes('dropdown-credit'))home=home.replace('<div class="dropdown">','<div class="dropdown"><a id="dropdown-credit" href="/finance-options/credit-sense/">Credit Sense</a><a href="/finance-options/">View all options</a>');
// Product chips point directly to the complete product pages, including keyboard navigation.
const productRoutes={vehicle:'vehicle-loans',business:'business-finance',personal:'personal-loans',leisure:'leisure-finance'};
for(const [id,route]of Object.entries(productRoutes))home=home.replaceAll(`href="#${id}"`,`href="/finance-options/${route}/"`);
home=home.replaceAll('href="#" aria-label="Smartway Finance home"','href="/" aria-label="Smartway Finance home"');
fs.writeFileSync(path.join(dist,'index.html'),home);
const header=home.match(/<header[\s\S]*?<\/header>/)[0].replaceAll('src="assets/','src="/assets/').replaceAll('href="#about"','href="/about/"').replaceAll('href="#testimonials"','href="/testimonials/"').replaceAll('href="#faqs"','href="/faqs/"').replaceAll('href="#contact"','href="/contact/"').replaceAll('href="#finance"','href="/finance-options/"');
for(const [route,page]of Object.entries(pages)){
 if(route==='/')continue;
 const target=path.join(dist,route);fs.mkdirSync(target,{recursive:true});
 let main=render(page.main).replace('<main','<main id="main" class="source-page"');
 if(route==='/faqs')main=main.replace(/<p>(Who is Smartway Finance\?)<\/p>/g,'');
 const doc=`<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(page.title)} | Smartway Finance</title><meta name="description" content="${esc(page.description)}"><meta name="theme-color" content="#0b2635"><link rel="icon" href="/assets/smartway-logo.png"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/complete.css"><script src="/complete.js" defer></script></head><body class="inner-page" data-page="${route}"><a class="skip" href="#main">Skip to content</a>${header}${main}${footer}</body></html>`;
 fs.writeFileSync(path.join(target,'index.html'),localize(doc));
}
console.log(`Generated ${routes.size} pages from the source capture.`);
