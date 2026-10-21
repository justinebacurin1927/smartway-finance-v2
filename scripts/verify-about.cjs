const{chromium}=require('/home/nami/.claude/skills/gstack/node_modules/playwright'),assert=require('assert'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),p=await b.newPage();
 await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.emulateMedia({reducedMotion:'reduce'});
 await p.goto('http://127.0.0.1:4173/?v=about-editorial');
 const text=n=>typeof n==='string'?n:n.children.map(text).join('');const nodes=(n,t)=>typeof n==='string'?[]:[...(n.tag===t?[n]:[]),...n.children.flatMap(c=>nodes(c,t))];
 const {pages}=JSON.parse(fs.readFileSync('references/source-site/content.json'));
 const source=nodes(pages['/'].main,'section').find(n=>text(n).includes('About Smartway Finance'));
 const paragraphs=nodes(source,'p').map(text),start=paragraphs.findIndex(s=>s.startsWith('At Smartway Finance,'));
 for(const copy of paragraphs.slice(start))assert((await p.locator('#about').textContent()).includes(copy));
 const results=[];
 for(const width of [1920,1440,1024,768,390,320]){
  await p.setViewportSize({width,height:1000});
  await p.locator('.about-editorial-photo img').evaluate(i=>i.decode());
  const value=await p.locator('#about').evaluate(e=>{const i=e.querySelector('img'),r=i.getBoundingClientRect();return{width:innerWidth,scroll:document.documentElement.scrollWidth,ratio:r.width/r.height,native:i.naturalWidth/i.naturalHeight,fit:getComputedStyle(i).objectFit,principles:e.querySelectorAll('.about-editorial-rows article').length};});
  assert(value.scroll<=width);assert(Math.abs(value.ratio-value.native)<.002);assert.equal(value.fit,'contain');assert.equal(value.principles,4);results.push(value);
  if([1440,390].includes(width)){await p.evaluate(()=>document.activeElement?.blur());await p.locator('#about').screenshot({path:`previews/about-editorial-${width}.png`});}
 }
 const nojs=await b.newPage({javaScriptEnabled:false});await nojs.goto('http://127.0.0.1:4173/');assert(await nojs.locator('.about-editorial-photo img').isVisible());assert.equal(await nojs.locator('.about-editorial-rows article:visible').count(),4);
 assert.deepEqual(errors,[]);fs.writeFileSync('previews/about-verification.json',JSON.stringify({results,sourceCopyPreserved:true,errors,noJavaScript:true},null,2));
 console.log('About: six widths, native image ratio, full original copy, four benefits, no JS and no page errors PASS.');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
