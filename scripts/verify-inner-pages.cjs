const{chromium}=require('/home/nami/.claude/skills/gstack/node_modules/playwright');
const assert=require('assert'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage();
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});
 const results=[];
 for(const route of ['compare','blog','testimonials','contact'])for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:4173/'+route+'/',{waitUntil:'domcontentloaded'});
  await page.evaluate(async()=>{[...document.images].forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const info=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}));
  assert(info.scroll<=info.width);assert.equal(info.h1,1);assert.deepEqual(info.broken,[]);results.push({route,...info});
  if(width===1440||width===390)await page.screenshot({path:`previews/${route}-edition-${width}.png`,fullPage:true});
 }
 await page.goto('http://127.0.0.1:4173/compare/',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.ledger-payment').first().innerText(),'$721.12');
 await page.locator('#amount').fill('150000');await page.locator('#amount').dispatchEvent('input');
 const repayment=(principal,years)=>{const r=15.47/1200,n=years*12;return principal*r/(1-Math.pow(1+r,-n));};
 const usd=n=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(n);
 assert.equal(await page.locator('.ledger-payment').first().innerText(),usd(repayment(150000,5)));
 await page.locator('#business-purpose').click();await page.locator('#term').fill('7');await page.locator('#term').dispatchEvent('input');
 assert.equal(await page.locator('.loan-ledger thead th').count(),2);assert((await page.locator('.loan-ledger').innerText()).includes('Chattel Mortgage'));
 assert.equal(await page.locator('.ledger-payment').nth(1).innerText(),usd(repayment(150000,5)));
 assert.equal(await page.locator('.ledger-payment').first().innerText(),usd(repayment(150000,7)));
 await page.locator('#amount').fill('5000');await page.locator('#term').fill('1');await page.locator('#term').dispatchEvent('input');assert.equal(await page.locator('.ledger-payment').first().innerText(),usd(repayment(5000,1)));
 await page.locator('.ledger-enquire').nth(1).click();await page.waitForURL('**/contact/**');assert.equal(await page.locator('[name=financeType]').inputValue(),'Business Finance');assert((await page.locator('textarea').inputValue()).includes('Finance Lease'));
 assert(!(await page.locator('form').evaluate(f=>f.checkValidity())));
 for(const [name,value]of Object.entries({firstName:'Preview',lastName:'Check',phone:'0400000000',email:'invalid'}))await page.locator('[name='+name+']').fill(value);
 assert(!(await page.locator('form').evaluate(f=>f.checkValidity())));await page.locator('[name=email]').fill('preview@example.com');assert(!(await page.locator('form').evaluate(f=>f.checkValidity())));await page.locator('#consent').check();assert(await page.locator('form').evaluate(f=>f.checkValidity()));
 assert((await page.locator('button[type=submit]').innerText()).includes('Prepare email enquiry'));
 assert.equal(await page.locator('input,select,textarea').evaluateAll(controls=>controls.filter(c=>!document.querySelector('label[for="'+c.id+'"]')).length),0);
 const portrait=await page.locator('.contact-human img').evaluate(async i=>{await i.decode();const r=i.getBoundingClientRect();return{shown:r.width/r.height,native:i.naturalWidth/i.naturalHeight};});assert(Math.abs(portrait.shown-portrait.native)<.002);
 await page.goto('http://127.0.0.1:4173/blog/',{waitUntil:'domcontentloaded'});
 for(const [category,count]of Object.entries({'All':5,'Vehicle Finance':2,'Business Finance':1,'Personal Finance':0,'Leisure Finance':1,'Credit Tips':1})){
  await page.locator('[data-category-filter="'+category+'"]').click();assert.equal(await page.locator('.edition-story:visible').count(),count);assert.equal(await page.locator('.filter-empty').isVisible(),count===0);
 }
 await page.locator('[data-category-filter="All"]').click();for(const href of await page.locator('.edition-story').evaluateAll(as=>as.map(a=>a.href))){const response=await page.request.get(href);assert.equal(response.status(),200);}
 await page.goto('http://127.0.0.1:4173/testimonials/',{waitUntil:'domcontentloaded'});
 const source=JSON.parse(fs.readFileSync('references/source-site/content.json')).pages['/testimonials'].main;
 const text=n=>typeof n==='string'?n:n.children.map(text).join('');const nodes=(n,tag)=>typeof n==='string'?[]:[...(n.tag===tag?[n]:[]),...n.children.flatMap(c=>nodes(c,tag))];
 const original=nodes(source,'div').filter(n=>n.attrs.class?.includes('shadow-sm')).map(n=>text(nodes(n,'p')[0]));
 assert.deepEqual(await page.locator('.client-story blockquote').allTextContents(),original);
 const nojs=await browser.newPage({javaScriptEnabled:false});
 for(const route of ['blog','testimonials','contact']){await nojs.goto('http://127.0.0.1:4173/'+route+'/',{waitUntil:'domcontentloaded'});if(route==='blog')assert.equal(await nojs.locator('.edition-story:visible').count(),5);if(route==='testimonials')assert.equal(await nojs.locator('.client-story:visible').count(),5);if(route==='contact'){assert(!(await nojs.locator('form').isVisible()));assert(await nojs.locator('noscript a[href^="mailto:"]').isVisible());}}
 assert.deepEqual(errors,[]);
 const report={results,errors,checks:['default and boundary repayments','both purposes','lease five-year cap','enquiry destination and prefill','required fields, invalid email and consent','static form labels and native portrait ratio','six categories and empty state','five exact source quotes','article destinations','no-JavaScript reading and contact fallback'],remoteSubmissions:0,checkedAt:new Date().toISOString()};
 fs.writeFileSync('previews/inner-page-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pages:4,viewports:[1440,768,390,320],errors,checks:report.checks,remoteSubmissions:0}));await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
