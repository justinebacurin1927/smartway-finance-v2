const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.PREVIEW_URL || 'http://localhost:4173';
const refine = require('./refine-about-page.cjs');
const normal = value => value.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const errors = [];
  const widths = [320,390,640,768,1024,1440,1915];
  fs.mkdirSync(path.join(root, 'previews'), { recursive: true });
  const shots = async (page, width) => {
    await page.evaluate(() => scrollTo(0,0));
    await page.screenshot({ path: path.join(root, `previews/about-page-hero-${width}.png`) });
    for (const name of ['mission','values','team','credentials','invitation']) await page.locator(`.ap-${name}`).screenshot({ path: path.join(root, `previews/about-page-${name}-${width}.png`) });
  };
  function watch(page) { page.on('pageerror', error => errors.push(error.message)); }
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    watch(page);
    await page.goto(`${base}/about/`);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('nav[aria-label="Breadcrumb"]').count(),0);
    const header = page.locator('body>header.header');
    let headerBox = await header.boundingBox();
    assert.equal(headerBox.x,0);
    assert.equal(headerBox.y,0);
    assert.equal(headerBox.width,width,'The navbar starts at full width.');
    const mainTop = await page.locator('main').evaluate(el => el.getBoundingClientRect().top + scrollY);
    await page.evaluate(() => scrollTo({top:300,behavior:'instant'}));
    await page.waitForFunction(() => document.querySelector('body>header.header').classList.contains('is-scrolled'));
    headerBox = await header.boundingBox();
    assert.ok(headerBox.x>0 && headerBox.y>0 && headerBox.width<width,'Scrolling contracts the navbar into its inset pill.');
    assert.equal(await page.locator('main').evaluate(el => el.getBoundingClientRect().top + scrollY),mainTop,'Navbar changes must not move the document layout.');
    await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(() => !document.querySelector('body>header.header').classList.contains('is-scrolled'));
    assert.equal((await header.boundingBox()).width,width,'Returning to the top restores the full-width navbar.');
    for (const photo of await page.locator('main img').all()) {
      await photo.scrollIntoViewIfNeeded();
      await photo.evaluate(img => img.decode());
    }
    await page.evaluate(() => scrollTo(0,0));
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main>section').count(), 6);
    assert.equal(await page.locator('.ap-value-card').count(), 4);
    assert.equal(await page.locator('.ap-credential').count(), 4);
    assert.equal(await page.locator('.ap-profile').count(), 2);
    assert.equal(await page.locator('.nav-explore').count(), 1);
    const content = normal(await page.locator('main').textContent());
    for (const paragraph of refine.sourceParagraphs.filter(copy => copy.length > 28)) assert.ok(content.includes(normal(paragraph)), `Missing original text: ${paragraph}`);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      headingTransforms: [...document.querySelectorAll('.ap-motion-word')].map(word => getComputedStyle(word).transform),
      cardBackground: getComputedStyle(document.querySelector('.about-story-card-main')).backgroundColor,
      toggleBackground: getComputedStyle(document.querySelector('.about-card-toggle')).backgroundColor,
      photoRatios: [...document.querySelectorAll('main img')].map(img => ({ source: img.naturalWidth / img.naturalHeight, displayed: img.clientWidth / img.clientHeight, loaded: img.complete && img.naturalWidth > 0 })),
      linkMinHeight: Math.min(...[...document.querySelectorAll('main .finance-hero-action')].filter(a => !a.closest('[inert]')).map(a => a.getBoundingClientRect().height))
    }));
    assert.equal(layout.overflow,false,`Overflow at ${width}px.`);
    assert.equal(layout.cardBackground,'rgb(20, 47, 64)');
    assert.equal(layout.toggleBackground,'rgba(0, 0, 0, 0)');
    assert.ok(layout.headingTransforms.every(value => value === 'none'));
    assert.ok(layout.linkMinHeight >= 52);
    for (const photo of layout.photoRatios) { assert.equal(photo.loaded,true); assert.ok(Math.abs(photo.source-photo.displayed) < .015); }
    for (const index of [1,2,0]) {
      const toggle = page.locator('.about-card-toggle').nth(index);
      await toggle.click({ position: { x:12,y:12 } });
      assert.equal(await page.locator('.about-story-cards').getAttribute('data-active-card'),String(index));
      assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('.about-card-details:not([inert])').count(),1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
    }
    await page.locator('.about-card-toggle').first().focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.about-story-cards').getAttribute('data-active-card'),'1');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('.about-story-cards').getAttribute('data-active-card'),'0');
    assert.equal(await page.locator('main .ap-profiles p').filter({ hasText: 'Dachshunds' }).isVisible(),true);
    assert.equal(await page.locator('main .ap-profiles p').filter({ hasText: 'splash on the horizon' }).isVisible(),true);
    if (width <= 768) {
      await page.locator('.mobile-toggle').click();
      assert.equal(await page.locator('#mobile-nav').isVisible(),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobile-nav').isVisible(),false);
    }
    if ([390,1440].includes(width)) await shots(page,width);
    results.push({width,noBreadcrumb:true,scrollHeader:true,sourceNarrative:true,nativePhotoRatios:true,cardSelection:true,keyboard:true,noOverflow:true});
    await page.close();
  }
  const moving = await browser.newPage({ viewport: { width:1440,height:1000 } });
  watch(moving);
  await moving.goto(`${base}/about/`);
  await moving.evaluate(() => document.fonts.ready);
  await moving.waitForFunction(() => Number(document.querySelector('#ap-hero-title').dataset.progress) > .99);
  await moving.locator('.ap-hero-actions .finance-hero-action').first().hover();
  assert.equal(await moving.locator('.ap-hero-actions .finance-hero-action').first().evaluate(a => getComputedStyle(a,'::before').animationName),'finance-color-sweep');
  await moving.locator('.ap-hero-actions .finance-hero-action').first().focus();
  await moving.keyboard.press('Tab'); await moving.keyboard.press('Shift+Tab');
  assert.equal(await moving.locator('.ap-hero-actions .finance-hero-action').first().evaluate(a => getComputedStyle(a,'::before').animationName),'finance-color-sweep');
  await moving.locator('.ap-values').scrollIntoViewIfNeeded();
  await moving.waitForFunction(() => Number(document.querySelector('#ap-values-title').dataset.progress) > .99);
  await moving.emulateMedia({reducedMotion:'reduce'});
  assert.ok(await moving.locator('.ap-motion-word').evaluateAll(words => words.every(word => getComputedStyle(word).transform === 'none')));
  await moving.close();

  const nojs = await browser.newPage({ javaScriptEnabled:false,viewport:{width:390,height:844} });
  await nojs.goto(`${base}/about/`);
  assert.equal(await nojs.locator('.about-card-details:visible').count(),3);
  assert.equal(await nojs.locator('.about-card-toggle:visible').count(),0);
  assert.equal(await nojs.locator('.ap-profile').count(),2);
  assert.equal(await nojs.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
  await nojs.close();

  // Shared controllers must retain the homepage's existing card and heading behavior.
  const home = await browser.newPage({ viewport:{width:1440,height:1000},reducedMotion:'reduce' });
  watch(home);
  await home.goto(`${base}/`);
  assert.equal(await home.locator('#about .about-story-card').count(),3);
  await home.locator('#about .about-card-toggle').nth(2).click({position:{x:10,y:10}});
  assert.equal(await home.locator('#about .about-story-cards').getAttribute('data-active-card'),'2');
  assert.equal(await home.locator('#about .about-card-details:not([inert])').count(),3,'Homepage desktop cards retain their existing visible copy.');
  assert.equal(await home.locator('#finance-title .finance-title-piece').count(),7);
  await home.close();

  const file = path.join(root,'dist/about/index.html');
  const before = fs.readFileSync(file,'utf8'); refine();
  assert.equal(fs.readFileSync(file,'utf8'),before);
  assert.deepEqual(errors,[]);
  await browser.close();
  const report={results,normalAndReducedMotion:true,noJavaScript:true,sharedHomepageRegression:true,refinerIdempotence:true,errors};
  fs.writeFileSync(path.join(root,'previews/about-page-verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
})().catch(error => { console.error(error); process.exit(1); });
