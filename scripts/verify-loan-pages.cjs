const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const refine=require('./refine-loan-pages.cjs');
const noBreadcrumbs=require('./refine-no-breadcrumbs.cjs');
const root=path.resolve(__dirname,'..');
const base=process.env.PREVIEW_URL||'http://localhost:4173';
const normalize=value=>value.replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const widths=[320,390,640,768,1024,1440,1915];
const routes=['/finance-options',...refine.models.map(model=>model.route)];
const files=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(directory,entry.name)):entry.name.endsWith('.html')?[path.join(directory,entry.name)]:[]);

(async()=>{
 const browser=await chromium.launch({headless:true});
 const errors=[];const failedAssets=[];const results=[];
 fs.mkdirSync(path.join(root,'previews'),{recursive:true});
 try{
  for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)failedAssets.push({url:response.url(),status:response.status()});});
   for(const route of routes){
    await page.goto(`${base}${route}/`);
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('nav[aria-label="Breadcrumb"]').count(),0);
    assert.equal(await page.locator('[data-loan-page]').count(),1);
    assert.equal(await page.locator('.nav-explore').count(),1);
    assert.equal(await page.locator('#site-footer').count(),1);
    const header=page.locator('body>header.header');
    assert.equal((await header.boundingBox()).width,width,'Full-width navbar at top.');
    const model=refine.models.find(item=>item.route===route);
    if(model){
     const content=normalize(await page.locator('main').textContent());
     for(const copy of [model.description,model.subtitle,...model.benefits,...model.structures,...model.faqs.flatMap(faq=>[faq.question,faq.answer]),model.disclosure,model.closing])assert.ok(content.includes(normalize(copy)),`${route}: missing ${copy}`);
     assert.equal(await page.locator('.lp-benefit').count(),6);
     assert.equal(await page.locator('.lp-faq-list details').count(),3);
     assert.equal(await page.locator('.lp-hero-photo img').getAttribute('src'),model.image.src);
     await page.locator('.lp-hero-photo img').evaluate(img=>img.decode());
     if(model.rates.length>1){
      const rates=await page.locator('.lp-rates strong').evaluateAll(elements=>elements.map(el=>({size:getComputedStyle(el).fontSize,weight:getComputedStyle(el).fontWeight,color:getComputedStyle(el).color})));
      assert.deepEqual(rates[0],rates[1],'Interest and comparison rates must have equal prominence.');
      assert.equal(await page.locator('.lp-rates').count(),1,'One prominent rate panel.');
     }else{
      assert.equal(await page.locator('.lp-rates').count(),0);
      assert.equal(normalize(await page.locator('.lp-specialism').textContent()),model.rates[0]);
     }
     for(const faq of await page.locator('.lp-faq-list details').all()){
      await faq.locator('summary').click();
      assert.equal(await faq.getAttribute('open'),'');
      assert.equal(await faq.locator('p').isVisible(),true);
      await faq.locator('summary').click();
     }
    }else{
     assert.equal(await page.locator('.lp-overview-card').count(),5);
     assert.equal(await page.locator('.lp-specialist-grid>a').count(),7);
     for(const model of refine.models)assert.ok(await page.locator(`main a[href="${model.route}/"]`).count(),`Every product is discoverable: ${model.route}`);
     for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
    }
    const metrics=await page.evaluate(()=>({
     overflow:document.documentElement.scrollWidth>innerWidth,
     buttonSizes:[...document.querySelectorAll('main .finance-hero-action')].map(el=>({height:el.getBoundingClientRect().height,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})),
     images:[...document.querySelectorAll('main img')].every(img=>img.complete&&img.naturalWidth>0),
     transforms:[...document.querySelectorAll('.lp-word')].map(word=>getComputedStyle(word).transform)
    }));
    assert.equal(metrics.overflow,false,`${route} overflows at ${width}px.`);
    assert.equal(metrics.images,true);
    assert.ok(metrics.transforms.every(value=>value==='none'));
    for(const button of metrics.buttonSizes){assert.ok(button.height>=52);assert.ok(button.left>=-1&&button.right<=width+1,`${route}: button exceeds viewport`);}
    await page.evaluate(()=>scrollTo({top:300,behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('body>header').classList.contains('is-scrolled'));
    assert.ok((await header.boundingBox()).width<width);
    if(width<1001){
     await page.locator('.mobile-toggle').click();
     assert.equal(await page.locator('#mobile-nav').isVisible(),true);
     await page.keyboard.press('Escape');
     assert.equal(await page.locator('#mobile-nav').isVisible(),false);
    }
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(()=>!document.querySelector('body>header').classList.contains('is-scrolled'));
    assert.equal((await header.boundingBox()).width,width);
    if([390,1440].includes(width)&&['vehicle-loans','leisure-finance','business-finance','credit-sense','overview'].includes(model?.slug||'overview')){
     await page.screenshot({path:path.join(root,`previews/loans-${model?.slug||'overview'}-${width}.png`)});
     if(model?.slug==='vehicle-loans')for(const section of ['structures','benefits','faq','related','closing'])await page.locator(`.lp-${section}`).screenshot({path:path.join(root,`previews/loans-vehicle-${section}-${width}.png`)});
    }
    results.push({route,width,sourceContent:true,rateDisplay:true,navbar:true,noOverflow:true,loadedPhotos:true,faqs:true});
   }
   await page.close();
  }
  const moving=await browser.newPage({viewport:{width:1440,height:1000}});
  moving.on('pageerror',error=>errors.push(error.message));
  await moving.goto(`${base}/finance-options/vehicle-loans/`);
  await moving.evaluate(()=>document.fonts.ready);
  await moving.waitForFunction(()=>Number(document.querySelector('#loan-title').dataset.progress)>.99);
  const action=moving.locator('.lp-actions .finance-hero-action').first();
  await action.hover();
  assert.equal(await action.evaluate(el=>getComputedStyle(el,'::before').animationName),'finance-color-sweep');
  await action.focus();await moving.keyboard.press('Tab');await moving.keyboard.press('Shift+Tab');
  assert.equal(await action.evaluate(el=>getComputedStyle(el,'::before').animationName),'finance-color-sweep');
  await moving.locator('.lp-faq-list summary').first().focus();await moving.keyboard.press('Enter');
  assert.equal(await moving.locator('.lp-faq-list details').first().getAttribute('open'),'');
  await moving.emulateMedia({reducedMotion:'reduce'});
  assert.ok(await moving.locator('.lp-word').evaluateAll(words=>words.every(word=>getComputedStyle(word).transform==='none')));
  await moving.close();
  const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await nojs.goto(`${base}/finance-options/vehicle-loans/`);
  await nojs.locator('.lp-faq-list summary').first().click();
  assert.equal(await nojs.locator('.lp-faq-list details').first().locator('p').isVisible(),true);
  assert.equal(await nojs.locator('.lp-benefit').count(),6);
  assert.equal(await nojs.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await nojs.close();
  for(const file of files(path.join(root,'dist'))){
   const html=fs.readFileSync(file,'utf8');
   assert.equal(/<nav\b[^>]*(?:aria-label="Breadcrumb"|class="[^"]*\bbreadcrumbs\b)/.test(html),false,`Breadcrumb remains in ${file}`);
  }
  const before=routes.map(route=>fs.readFileSync(path.join(root,'dist',route,'index.html'),'utf8'));
  refine();assert.equal(noBreadcrumbs(),0);
  routes.forEach((route,index)=>assert.equal(fs.readFileSync(path.join(root,'dist',route,'index.html'),'utf8'),before[index]));
  // Check each shipped local destination and asset once, without sending forms or loading the provider.
  const urls=new Set();
  for(const route of routes){
   const html=fs.readFileSync(path.join(root,'dist',route,'index.html'),'utf8');
   for(const [,value]of html.matchAll(/(?:href|src)="(\/[^"#]*?)"/g))urls.add(value.replaceAll('&amp;','&').split('#')[0]);
  }
  const bad=[];
  for(const url of urls){const response=await fetch(base+url,{method:'HEAD'});if(!response.ok)bad.push({url,status:response.status});}
  assert.deepEqual(bad,[]);assert.deepEqual(errors,[]);assert.deepEqual(failedAssets,[]);
  const report={pageCount:routes.length,viewportChecks:results.length,widths,results,normalAndReducedMotion:true,noJavaScript:true,keyboardFAQ:true,all29PagesWithoutBreadcrumbs:true,linksChecked:urls.size,refinerIdempotence:true,errors,failedAssets};
  fs.writeFileSync(path.join(root,'previews/loan-pages-verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({...report,results:undefined},null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
