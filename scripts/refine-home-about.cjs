const fs=require('fs'),path=require('path');
const dist=path.resolve(__dirname,'../dist');
const {pages}=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../references/source-site/content.json')));
const text=n=>typeof n==='string'?n:n.children.map(text).join('');
const nodes=(n,t)=>typeof n==='string'?[]:[...(n.tag===t?[n]:[]),...n.children.flatMap(c=>nodes(c,t))];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const source=nodes(pages['/'].main,'section').find(n=>text(n).includes('About Smartway Finance'));
const paragraphs=nodes(source,'p').map(text),start=paragraphs.findIndex(p=>p.startsWith('At Smartway Finance,')),benefits=paragraphs.slice(start+2);
const supportCopy=paragraphs[start+1].split(/(?<=\.)\s+(?=[A-Z])/);
const pattern=(name,art,viewBox='0 0 320 220')=>`<svg class="about-card-art about-card-art-${name}" viewBox="${viewBox}" preserveAspectRatio="xMaxYMin slice" fill="none" aria-hidden="true" focusable="false">${art}</svg>`;
const blocks=pattern('blocks',Array.from({length:8},(_,row)=>Array.from({length:4},(_,col)=>`<path fill="currentColor" opacity="${[.06,.22,.42,.16][(row*3+col)%4]}" d="M${col*80} ${row*80}h80v80h-80z"/>`).join('')).join(''),'0 0 320 640');
const circles=pattern('circles','<g stroke="currentColor" stroke-width="20"><circle cx="13" cy="64" r="93"/><circle cx="13" cy="64" r="57"/><circle cx="13" cy="64" r="21"/></g><path fill="currentColor" opacity=".45" d="M158 0h72v72h-72zM230 72h72v72h-72z"/><path fill="currentColor" opacity=".7" d="m158 144 72-72v144z"/>');
const angles=pattern('angles','<g fill="currentColor"><path opacity=".35" d="M0 0h110v110zM110 110h110V0z"/><path opacity=".65" d="M0 110h110v110zM220 110h100V10z"/><path opacity=".45" d="M220 220a60 60 0 0 1 0-120v120Z"/></g>');
const cardLink=(href,label)=>`<a class="about-card-link" href="${href}">${label}<span aria-hidden="true">↗</span></a>`;
const storyCard=(index,variant,art,title,body,href,label,kicker='')=>`<article class="about-story-card about-story-card-${variant}${index===0?' is-active':''}" data-about-card="${index}">${art}<button class="about-card-toggle" type="button" aria-labelledby="about-card-title-${index}" aria-controls="about-card-details-${index}" aria-pressed="${index===0}" hidden></button><div class="about-card-copy">${kicker?`<p class="about-card-kicker">${kicker}</p>`:''}<h3 id="about-card-title-${index}">${title}</h3><div class="about-card-details" id="about-card-details-${index}"><div class="about-card-details-inner"><p>${esc(body)}</p>${cardLink(href,label)}</div></div></div></article>`;
const cards=[
 storyCard(0,'main',blocks,'Your goals.<br> Our starting point.',paragraphs[start],'/about/','Get to know Smartway','A personal approach'),
 storyCard(1,'lenders',circles,'40+ lenders.<br> One team on your side.',supportCopy[0],'/compare/','Explore your options'),
 storyCard(2,'support',angles,'Clear guidance.<br> Every step.',supportCopy.slice(1).join(' '),'/contact/','Let’s talk')
].join('');
const section=`<section id="about" class="about-editorial about-card-section" aria-labelledby="about-title"><div class="wrap"><div class="about-intro-stage"><header class="about-editorial-heading"><p class="about-editorial-label">About Smartway Finance</p><h2 id="about-title"><span class="about-title-piece">Smarter</span> <span class="about-title-piece">finance.</span> <span class="about-title-piece">Tailored</span> <span class="about-title-piece">for</span> <em><span class="about-title-piece">you.</span></em></h2></header><div class="about-story-cards" data-active-card="0">${cards}</div></div><div id="benefits" class="benefit-stories" aria-labelledby="benefit-title"><header class="benefit-stories-heading"><div><p class="about-editorial-label">The Smartway difference</p><h3 id="benefit-title"><span class="benefit-title-piece">Less</span> <span class="benefit-title-piece">back</span> <span class="benefit-title-piece">and</span> <span class="benefit-title-piece">forth.</span><br> <span class="benefit-title-piece">More</span> <span class="benefit-title-piece">looking</span> <span class="benefit-title-piece">forward.</span></h3></div><a class="button finance-hero-action benefit-contact-action" href="/contact/"><span class="finance-action-label"><svg class="benefit-contact-icon" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#chat"/></svg><span>Let’s talk</span></span><span class="finance-action-track" aria-hidden="true"><span class="finance-action-arrow"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a></header><div class="benefit-list">${['bank','clipboard','target','shield'].map((name,i)=>`<article class="benefit-item"><svg class="doodle-icon benefit-icon" data-doodle="${name}" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><use href="/assets/icons/smartway-doodles.svg#${name}"/></svg><div><h3>${esc(benefits[i*2])}</h3><p>${esc(benefits[i*2+1])}</p></div><span class="benefit-arrow" aria-hidden="true">↗</span></article>`).join('')}</div></div></div></section>`;
module.exports=section;
if(require.main===module){
 const file=path.join(dist,'index.html');
 let html=fs.readFileSync(file,'utf8');
 html=html.replace(/<section id="about"[\s\S]*?<\/section>/,section);
 html=html.replace(/(brand-story\.css|brand-story\.js)\?v=[^"\s]+/g,'$1?v=20261021-benefit-card-motion');
 html=html.replace(/(about\.css)\?v=[^"\s]+/g,'$1?v=20261021-benefit-contact-cta');
 if(!html.includes('/benefit-cards.js'))html=html.replace('</head>','<script src="/benefit-cards.js?v=20261021-benefit-card-motion" defer></script></head>');
 if(!html.includes('/about-cards.js'))html=html.replace('</head>','<script src="/about-cards.js?v=20261021-about-card-expand" defer></script></head>');
 html=html.replace(/(brand-story\.js)\?v=[^"\s]+/g,'$1?v=20261021-benefit-card-motion');
 fs.writeFileSync(file,html);
 console.log('Applied the About cards with the first card expanded by default.');
}
