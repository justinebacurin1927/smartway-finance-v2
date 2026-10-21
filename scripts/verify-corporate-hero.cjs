const {chromium}=require('/home/nami/.claude/skills/gstack/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch();
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const findings=[];
 for(const [width,height] of [[1440,900],[1920,1080],[1366,768],[768,1024],[390,844],[375,667]]){
  await page.setViewportSize({width,height});
  await page.goto('http://localhost:4173/?v=corporate-video-2',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(2100);
  await page.waitForFunction(()=>document.querySelector('.hero-video').currentTime>0);
  const state=await page.evaluate(()=>{const v=document.querySelector('.hero-video'),h=document.querySelector('.hero'),c=document.querySelector('.hero-actions');return {width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,playing:!v.paused,muted:v.muted,loop:v.loop,videoWidth:v.videoWidth,heroBottom:h.getBoundingClientRect().bottom,ctaBottom:c.getBoundingClientRect().bottom,src:v.currentSrc}});
  assert(!state.overflow);assert(state.playing&&state.muted&&state.loop);assert.equal(state.videoWidth,1920);
  assert.equal(await page.locator('.hero-phone').count(),0);
  assert.equal(await page.locator('.hero-actions a').first().getAttribute('href'),'/apply/');
  await page.screenshot({path:`previews/corporate-hero-${width}.png`});
  findings.push(state);
 }
 await page.locator('#video-toggle').click();
 assert(await page.locator('.hero-video').evaluate(v=>v.paused));
 assert.equal(await page.locator('#video-toggle').getAttribute('aria-label'),'Play background video');
 await page.locator('#video-toggle').click();
 await page.waitForFunction(()=>!document.querySelector('.hero-video').paused);
 await page.locator('.mobile-toggle').click();assert(await page.locator('#mobile-nav').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('#mobile-nav').isVisible()));
 await page.setViewportSize({width:1440,height:900});await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(2000);
 await page.locator('.finance-menu summary').click();assert(await page.locator('.dropdown').isVisible());await page.keyboard.press('Escape');
 await page.locator('.hero-video').evaluate(v=>{v.currentTime=v.duration-.3});
 await page.waitForFunction(()=>{const v=document.querySelector('.hero-video');return !v.paused&&v.currentTime<2},{},{timeout:10000});
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'domcontentloaded'});
 assert(await page.locator('.hero-video').evaluate(v=>v.paused&&!!v.poster&&!v.querySelector('source').getAttribute('src')));
 await page.locator('#video-toggle').click();await page.waitForFunction(()=>document.querySelector('.hero-video').currentTime>0);
 assert.deepEqual(errors,[]);
 fs.writeFileSync('previews/corporate-hero-verification.json',JSON.stringify({findings,checks:['pause/resume','mobile menu/Escape','finance dropdown','loop boundary','reduced-motion poster and manual play'],errors},null,2));
 console.log(JSON.stringify({viewports:findings.length,errors,checks:'passed'}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
