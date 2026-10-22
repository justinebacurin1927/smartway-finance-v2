const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/home/jaycee/Projects/huntly/node_modules/playwright');
const root = path.resolve(__dirname,'..');
const { pages } = require('../references/source-site/content.json');
const stories = Object.entries(pages).filter(([route]) => route.startsWith('/blog/'));
const nodes = (node,tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child,tag))];
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const clean = text => text.replace(/\s+/g,' ').trim();
const base = process.env.ARTICLE_PREVIEW_URL || 'http://localhost:4173';
const live = !base.includes('localhost');
const report = {base,layouts:[],checks:{}};

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    let errors = [], failed = [];
    page.on('pageerror',error => errors.push(error.message));
    page.on('response',response => { if(response.url().startsWith(base) && response.status() >= 400) failed.push(response.url()); });
    for (const [route,source] of stories) {
      const sourceBody=nodes(source.main,'article')[0];
      for (const width of [320,390,768,1024,1440,1915]) {
        errors=[]; failed=[];
        await page.setViewportSize({width,height:1000});
        await page.goto(base+route+(live ? '' : '/'),{waitUntil:'networkidle'});
        for(const tag of ['p','h2','h3','li']) {
          const original=nodes(sourceBody,tag).map(node=>clean(text(node)));
          const actual=await page.locator(`.article-prose ${tag}`).evaluateAll(elements=>elements.map(el=>el.textContent.replace(/\s+/g,' ').trim()));
          assert.deepEqual(actual,original,`${route}: original ${tag} copy`);
        }
        assert.equal(clean(await page.locator('h1').textContent()),source.title);
        assert.equal(await page.locator('h1').count(),1);
        assert.equal(await page.locator('main .breadcrumbs').count(),0);
        const hero=source.main.children.find(node=>node.tag==='section');
        const metadata=nodes(hero,'span').map(node=>text(node).trim());
        assert.equal(await page.locator('.article-heading .article-category').innerText(),metadata[0]);
        assert.equal(await page.locator('.article-heading .article-metadata>span').innerText(),metadata[1]);
        assert.equal(await page.locator('.article-heading time').innerText(),metadata[2]);
        await page.locator('.article-related').scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>[...document.querySelectorAll('main img')].every(image=>image.complete&&image.naturalWidth>0));
        const layout=await page.evaluate(()=>{
          const images=[...document.querySelectorAll('main img')];
          const actions=[...document.querySelectorAll('.article-action')];
          const meta=[...document.querySelectorAll('.article-heading .article-metadata>*')].map(el=>el.getBoundingClientRect());
          return {
            overflow:document.documentElement.scrollWidth>innerWidth,
            imageRatios:images.every(image=>{const r=image.getBoundingClientRect();return Math.abs(r.width/r.height-image.naturalWidth/image.naturalHeight)<.01&&getComputedStyle(image).objectFit==='contain'}),
            imagesUnDraggable:images.every(image=>!image.draggable),
            actionsFit:actions.every(action=>{const b=action.getBoundingClientRect(),label=action.querySelector('.finance-action-label').getBoundingClientRect(),arrow=action.querySelector('.finance-action-arrow').getBoundingClientRect();return b.left>=0&&b.right<=innerWidth+1&&label.left>=b.left&&label.right<=arrow.left-4}),
            metadataSeparated:meta[0].bottom<=meta[1].top+1||meta[0].right+8<=meta[1].left,
            columns:getComputedStyle(document.querySelector('.article-related-grid')).gridTemplateColumns.split(' ').length,
            bodySize:parseFloat(getComputedStyle(document.querySelector('.article-prose>p')).fontSize),
            sticky:getComputedStyle(document.querySelector('.article-help')).position
          };
        });
        assert(!layout.overflow && layout.imageRatios && layout.imagesUnDraggable && layout.actionsFit && layout.metadataSeparated,JSON.stringify({route,width,layout}));
        assert.equal(layout.columns,width>900?3:width>640?2:1); assert(layout.bodySize>=17);
        assert.equal(await page.locator('.article-related-card').count(),3);
        const related=await page.locator('.article-related-card').evaluateAll(links=>links.map(link=>link.getAttribute('href').replace(/\/$/,'')));
        assert.equal(new Set(related).size,3); assert(!related.includes(route));
        for(const original of nodes(source.main.children.at(-1),'a').map(a=>a.attrs.href)) assert(related.includes(original));
        assert.deepEqual(errors,[]); assert.deepEqual(failed,[]);
        report.layouts.push({route,width,...layout});
        if([390,1440].includes(width)) {
          await page.evaluate(()=>scrollTo(0,0));
          await page.screenshot({path:path.join(root,`previews/article-page-${route.split('/').pop()}-${width}.png`)});
        }
      }
      await page.setViewportSize({width:1440,height:1000});
      await page.evaluate(()=>scrollTo(0,0));
      const summary=page.locator('.article-contents>summary');
      await summary.focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('.article-contents').getAttribute('open'),'');
      const links=page.locator('.article-contents nav a');
      assert.equal(await links.count(),nodes(sourceBody,'h2').length);
      assert.equal(await links.evaluateAll(links=>links.every(link=>{const target=document.querySelector(link.getAttribute('href'));return target&&link.textContent.trim().endsWith(target.textContent.trim())})),true);
      const last=links.last(); const target=await last.getAttribute('href');
      await last.click();
      await page.waitForFunction(id=>{const top=document.querySelector(id).getBoundingClientRect().top;return top>=document.querySelector('.header').getBoundingClientRect().bottom+8&&top<innerHeight/2},target);
      assert.equal(await page.evaluate(()=>document.activeElement.id),target.slice(1));
      assert.equal(clean(await page.locator(target).textContent()),clean(text(nodes(sourceBody,'h2').at(-1))));
      assert.equal(await page.locator('main [id]').evaluateAll(elements=>new Set(elements.map(e=>e.id)).size===elements.length),true);
      console.log(`Verified six widths, source copy and native section jumps: ${route}`);
    }
    report.checks.allSourceCopyMetadataImagesAndRelatedLinks=true;
    report.checks.keyboardContentsAndTargetClearance=true;

    await page.goto(base+stories[0][0]+(live?'':'/'),{waitUntil:'networkidle'});
    const related=page.locator('.article-related-card').first(); await related.hover(); await page.waitForTimeout(300);
    assert.equal(await related.evaluate(el=>getComputedStyle(el).transform),'matrix(1, 0, 0, 1, 0, -6)');
    const action=page.locator('.article-conversation .article-action'); await action.focus(); await page.waitForTimeout(750);
    assert.equal(await action.locator('.finance-action-label').evaluate(el=>getComputedStyle(el).animationName),'finance-label-reveal');
    await page.emulateMedia({reducedMotion:'reduce'}); await related.hover();
    assert.equal(await related.evaluate(el=>getComputedStyle(el).transform),'none');
    await action.focus(); assert.equal(await action.locator('.finance-action-label').evaluate(el=>getComputedStyle(el).animationName),'none');
    report.checks.hoverFocusReducedMotion=true;
    await page.setViewportSize({width:720,height:450});
    await page.addStyleTag({content:'main p,main li,main h1,main h2,main h3,main a,main summary{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.equal(await page.locator('.article-help').evaluate(el=>getComputedStyle(el).position),'static');
    report.checks.reflowTextSpacingAndShortScreen=true;
    const staticPage=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await staticPage.goto(base+stories[3][0]+(live?'':'/'),{waitUntil:'networkidle'});
    await staticPage.locator('.article-contents>summary').click();
    assert.equal(await staticPage.locator('.article-contents').getAttribute('open'),'');
    await staticPage.locator('.article-contents nav a').first().click();
    assert(staticPage.url().endsWith('#guide-1'));
    assert((await staticPage.locator('.article-prose p').count())>5);
    report.checks.noJavaScriptContentsAndArticle=true;
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await mobile.goto(base+stories[0][0]+(live?'':'/'),{waitUntil:'networkidle'});
    await mobile.locator('.article-contents>summary').tap();
    assert.equal(await mobile.locator('.article-contents').getAttribute('open'),'');
    report.checks.touchContents=true;
    const destinations=new Set();
    for(const [route]of stories){await page.goto(base+route+(live?'':'/'),{waitUntil:'networkidle'});const hrefs=await page.locator('main a[href^="/"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));hrefs.forEach(href=>destinations.add(href));}
    for(const href of destinations){const response=await page.request.get(base+href);assert.equal(response.status(),200,href);}
    report.checks.localDestinations=destinations.size;
    fs.writeFileSync(path.join(root,`previews/article-pages-${live?'live-':''}verification.json`),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify({layouts:report.layouts.length,checks:report.checks},null,2));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
