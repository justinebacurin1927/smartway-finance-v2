const{chromium}=require('/home/nami/.claude/skills/gstack/node_modules/playwright'),assert=require('assert'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage();
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const url='http://127.0.0.1:4173/?v=process-demo';
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1920,1440,1024,768,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.evaluate(async()=>{await document.fonts.ready;document.activeElement?.blur()});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
  assert.equal(await page.locator('[data-loan-message]:visible').count(),6);
  assert.equal(await page.locator('.process-demo').getAttribute('data-state'),'complete');
  for(let i=0;i<3;i++){
   await page.locator(`[data-loan-step="${i}"]`).click();
   assert.equal(await page.locator(`[data-loan-step="${i}"]`).getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('[data-loan-panel]:visible').count(),1);
   assert.equal(await page.locator('[data-loan-message]:visible').count(),(i+1)*2);
  }
  if([1440,390].includes(width)){await page.locator('.loan-chat-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);await page.evaluate(()=>document.activeElement?.blur());await page.locator('#process').screenshot({path:`previews/process-demo-${width}.png`});}
 }
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(url);
 await page.locator('.loan-walkthrough').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
 await page.waitForFunction(()=>document.querySelector('.process-demo').dataset.state==='playing');
 await page.waitForFunction(()=>!document.querySelector('[data-loan-message="1"]').hidden);
 await page.locator('[data-loan-play]').click();
 assert.equal(await page.locator('.process-demo').getAttribute('data-state'),'paused');
 const pausedCount=await page.locator('[data-loan-message]:visible').count();await page.waitForTimeout(1800);
 assert.equal(await page.locator('[data-loan-message]:visible').count(),pausedCount);
 await page.locator('[data-loan-play]').click();
 await page.waitForFunction(()=>document.querySelector('.process-demo').dataset.phase==='1');
 assert.equal(await page.locator('[data-loan-message]:visible').count(),4);
 await page.waitForTimeout(700);await page.evaluate(()=>document.activeElement?.blur());await page.locator('#process').screenshot({path:'previews/process-demo-playing-1440.png'});
 await page.waitForFunction(()=>document.querySelector('.process-demo').dataset.state==='complete',{},{timeout:15000});
 assert.equal(await page.locator('[data-loan-message]:visible').count(),6);
 await page.locator('[data-loan-replay]').click();assert.equal(await page.locator('[data-loan-message]:visible').count(),1);
 await page.locator('[data-loan-play]').click();await page.waitForTimeout(1600);assert.equal(await page.locator('[data-loan-message]:visible').count(),1);
 await page.locator('[data-loan-step="1"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-loan-message]:visible').count(),4);
 await page.locator('[data-loan-play]').click();await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('.process-demo').dataset.state==='paused');
 const offscreen=await page.locator('[data-loan-message]:visible').count();await page.waitForTimeout(1800);assert.equal(await page.locator('[data-loan-message]:visible').count(),offscreen);
 await page.locator('.loan-walkthrough').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForFunction(()=>document.querySelector('.process-demo').dataset.state==='playing');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.process-demo').dataset.state==='complete');assert.equal(await page.locator('[data-loan-message]:visible').count(),6);
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await nojs.goto(url);assert.equal(await nojs.locator('[data-loan-message]:visible').count(),6);assert.equal(await nojs.locator('.loan-demo-steps li').count(),3);
 assert.deepEqual(errors,[]);const result={widths:[1920,1440,1024,768,390,320],autoplay:true,pauseResume:true,replay:true,keyboardSteps:true,offscreenPause:true,liveReducedMotion:true,noJavaScript:true,errors};fs.writeFileSync('previews/process-demo-verification.json',JSON.stringify(result,null,2));console.log(result);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
