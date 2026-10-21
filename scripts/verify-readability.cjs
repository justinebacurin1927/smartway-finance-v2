const {chromium}=require('/home/nami/.claude/skills/gstack/node_modules/playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage();
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const routes=Object.keys(JSON.parse(fs.readFileSync('references/source-site/content.json')).pages);
 const base='http://127.0.0.1:4173';let canonical;
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  for(const route of routes){
   await page.goto(base+route+(route==='/'?'':'/')+'?check=readability',{waitUntil:'domcontentloaded'});
   const footer=page.locator('#site-footer');
   assert.equal(await footer.count(),1,route);
   const markup=await footer.evaluate(e=>e.outerHTML);
   canonical??=markup;assert.equal(markup,canonical,route+' footer differs');
   assert(await footer.evaluate(e=>e.classList.contains('brex-footer')));
   assert(await footer.locator('a[href="/privacy-disclosure.pdf"]').count());
   assert(await footer.locator('a[href="/credit-guide-and-quote.pdf"]').count());
   assert(await footer.getByText('WARNING:',{exact:true}).count());
   assert(await footer.evaluate(e=>parseFloat(getComputedStyle(e.querySelector('li')).fontSize)>=14));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow at '+width);
   assert.equal(await page.locator('.is-pending').count(),0,route+' hidden content');
  }
  await page.goto(base+'/?check=finance',{waitUntil:'domcontentloaded'});
  await page.keyboard.press('Escape');
  for(let i=0;i<5;i++){
   const tab=page.locator(`[data-finance-choice="${i}"]`);
   await tab.click();
   assert.equal(await tab.getAttribute('aria-selected'),'true');
   assert.equal(await page.locator('[data-finance-scene]:visible').count(),1);
   const scene=page.locator(`[data-finance-scene="${i}"]`);
   assert(await scene.isVisible());
   assert((await scene.locator('p').innerText()).length>20);
   assert(await scene.locator('p').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
   const destination=await scene.locator('a').getAttribute('href');
   assert.equal((await page.request.get(base+destination)).status(),200);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.locator('[data-finance-choice="4"]').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-finance-choice="0"]').getAttribute('aria-selected'),'true');
  await page.keyboard.press('End');assert.equal(await page.locator('[data-finance-choice="4"]').getAttribute('aria-selected'),'true');
  if([1440,390].includes(width)){
   await page.waitForTimeout(800);
   await page.locator('[data-finance-choice="4"]').blur();
   await page.locator('#finance').screenshot({path:`previews/finance-readable-${width}.png`});
   await page.goto(base+'/about/?check=about',{waitUntil:'domcontentloaded'});
   await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   assert.equal(await page.locator('.about-values h3').count(),4);
   const portrait=page.locator('img[src*="caraandalice"]');
   assert(await portrait.evaluate(i=>Math.abs(i.clientWidth/i.clientHeight-i.naturalWidth/i.naturalHeight)<.01));
   assert.equal(await page.locator('.about-invitation a').first().getAttribute('href'),'/apply/');
   await page.screenshot({path:`previews/about-readable-${width}.png`,fullPage:true});
   await page.locator('#site-footer').screenshot({path:`previews/footer-readable-${width}.png`});
  }
 }
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await nojs.goto(base+'/?check=nojs');assert.equal(await nojs.locator('[data-finance-scene]:visible').count(),5);
 await nojs.goto(base+'/about/?check=nojs');assert(await nojs.locator('.about-credentials h2').isVisible());
 assert.deepEqual(errors,[]);
 const result={pages:routes.length,widths:[1440,768,390,320],financeOptions:5,footerIdentical:true,pageErrors:errors,noJavaScript:true};
 fs.writeFileSync('previews/readability-verification.json',JSON.stringify(result,null,2));console.log(result);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
