const {chromium}=require('/home/nami/.claude/skills/gstack/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage();
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.emulateMedia({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
 for(const width of [1720,1440,768,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:4173/#journal',{waitUntil:'domcontentloaded'});
  const journal=page.locator('#journal');await journal.scrollIntoViewIfNeeded();
  const result=await journal.evaluate(async section=>{
   const images=[...section.querySelectorAll('img')];await Promise.all(images.map(i=>i.decode()));
   const boxes=images.map(i=>{const r=i.getBoundingClientRect();return{width:r.width,height:r.height,ratio:r.width/r.height,native:i.naturalWidth/i.naturalHeight,fit:getComputedStyle(i).objectFit};});
   const video=document.querySelector('.hero-video');
   return{width:innerWidth,scroll:document.documentElement.scrollWidth,boxes,stories:section.querySelectorAll('.journal-story').length,video:video.querySelector('source').dataset.src,links:[...section.querySelectorAll('.journal-story')].map(a=>a.getAttribute('href'))};
  });
  assert(result.scroll<=width);assert.equal(result.stories,3);assert.equal(result.video,'/assets/coastal-full-motion-loop.mp4');
  result.boxes.forEach(box=>{assert(Math.abs(box.ratio-box.native)<.003);assert.equal(box.fit,'contain');assert(box.width>=Math.min(270,width-50));});
  const summary=await page.locator('.journal-summary').evaluateAll(items=>items.every(p=>getComputedStyle(p).display!=='none'&&parseFloat(getComputedStyle(p).fontSize)>=14));assert(summary);
  for(const href of result.links){const response=await page.request.get('http://127.0.0.1:4173'+href);assert.equal(response.status(),200);}
  if(width!==320)await journal.screenshot({path:`previews/journal-spread-${width}.png`});results.push(result);
 }
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto('http://127.0.0.1:4173/#journal');assert.equal(await nojs.locator('#journal .journal-story:visible').count(),3);
 assert.deepEqual(errors,[]);fs.writeFileSync('previews/journal-spread-verification.json',JSON.stringify({results,errors,noJavaScript:true,checkedAt:new Date().toISOString()},null,2));await browser.close();console.log('PASS: 5 widths, full image ratios, readable summaries, links, original video source and no-JS content.');
})().catch(e=>{console.error(e);process.exit(1)});
