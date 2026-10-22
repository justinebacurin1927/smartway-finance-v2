const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const widths = [[1915, 966], [1440, 900], [1366, 768], [1280, 800], [1024, 768], [768, 1024], [390, 844], [320, 667], [844, 390]];
  const results = [];
  const root = path.resolve(__dirname, '..');
  fs.mkdirSync(path.join(root, 'previews'), { recursive: true });
  const scroll = async top => {
    await page.evaluate(value => scrollTo({ top: value, behavior: 'instant' }), top);
    await page.waitForTimeout(100);
  };
  const geometry = () => page.locator('#finance').evaluate(section => ({
    top: scrollY + section.getBoundingClientRect().top,
    pinned: section.classList.contains('is-orbit-pinned'),
    distance: innerHeight * 1.65
  }));
  for (const [width, height] of widths) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Escape');
    await page.locator('#smartway-intro').waitFor({ state: 'detached' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.finance-orbit-gallery').count(), 1);
    assert.equal(await page.locator('.finance-orbit-item').count(), 5);
    assert.equal(await page.locator('.finance-word-icon').count(), 5);
    assert(await page.locator('.finance-orbit-item img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
    let g = await geometry();
    if (width >= 1280 && height >= 768) assert(g.pinned, `${width}: desktop scroll sequence enabled`);

    await scroll(g.top - height * .7);
    assert(Number(await page.locator('#finance-title').getAttribute('data-progress')) < .03, `${width}: scattered headline`);
    assert(await page.locator('.finance-title-piece').evaluateAll(words => words.some(word => Math.abs(new DOMMatrix(getComputedStyle(word).transform).m42) > 60)), `${width}: scatter movement`);
    await scroll(g.top - height * .42);
    await page.waitForFunction(() => {
      const progress = Number(document.querySelector('#finance-title').dataset.progress);
      return progress > .3 && progress < .8;
    });
    const middle = Number(await page.locator('#finance-title').getAttribute('data-progress'));
    assert(middle > .3 && middle < .8, `${width}: intermediate headline ${middle}`);
    await scroll(g.top - 94);
    assert.equal(await page.locator('#finance-title').getAttribute('data-progress'), '1.0000');
    assert(await page.locator('.finance-title-piece').evaluateAll(words => words.every(word => {
      const matrix = new DOMMatrix(getComputedStyle(word).transform);
      return Math.abs(matrix.m41) < .1 && Math.abs(matrix.m42) < .1;
    })), `${width}: assembled headline`);

    if (g.pinned) {
      for (let index = 0; index < 5; index++) {
        g = await geometry();
        await scroll(g.top - 94 + index / 4 * g.distance);
        await page.waitForTimeout(800);
        assert.equal(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), String(index));
        assert.equal(await page.locator(`#finance-tab-${index}`).getAttribute('aria-selected'), 'true');
        assert(await page.locator(`#finance-panel-${index} .finance-scene-copy`).isVisible());
        const bounds = await page.locator('.finance-orbit-stage').boundingBox();
        assert(Math.abs(bounds.y - 94) < 2, `${width}: sticky stage`);
        assert(bounds.y + bounds.height <= height + 1, `${width}: full information remains in viewport`);
      }
      await scroll(g.top - 94);
      await page.waitForTimeout(800);
      assert.equal(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), '0', `${width}: reverse scroll`);
      if (width === 1915) {
        await page.screenshot({ path: path.join(root, 'previews/finance-orbit-desktop-start.png') });
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(1000);
        assert.notEqual(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), '0', 'real wheel changes loan');
        await page.screenshot({ path: path.join(root, 'previews/finance-orbit-desktop-next.png') });
      }
    }

    for (let index = 0; index < 5; index++) {
      await page.locator(`#finance-tab-${index}`).click();
      assert.equal(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), String(index), `${width}: manual loan ${index}`);
      assert(await page.locator(`#finance-panel-${index} .finance-explore`).isVisible());
    }
    await page.keyboard.press('Home');
    assert.equal(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), '0');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), '1');
    await page.waitForTimeout(850);
    await page.locator('.finance-orbit-item[data-slot="next"]').click();
    assert.equal(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), '2');
    assert.equal(await page.locator('#finance-tab-2').evaluate(tab => tab === document.activeElement), true, `${width}: thumbnail focus return`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: no horizontal overflow`);
    if (width === 390 || width === 320) {
      await page.waitForTimeout(850);
      await page.locator('.finance-orbit-gallery').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(root, `previews/finance-orbit-mobile-${width}.png`) });
    }
    results.push({ width, height, pinned: g.pinned, controls: true, headline: true });
    console.log(`${width} × ${height}: headline, ${g.pinned ? 'scroll orbit, ' : ''}selectors, thumbnails, keyboard and overflow PASS`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  assert(await page.locator('#finance').evaluate(section => section.classList.contains('is-orbit-pinned')));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(150);
  assert(!(await page.locator('#finance').evaluate(section => section.classList.contains('is-orbit-pinned'))));
  assert.equal(await page.locator('#finance').evaluate(section => section.style.height), '');
  assert.equal(await page.locator('.finance-orbit-item').first().evaluate(item => getComputedStyle(item).transitionDuration), '0s');
  await page.locator('#finance-tab-4').click();
  assert.equal(await page.locator('.finance-orbit-gallery').getAttribute('data-selected'), '4');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(150);
  assert(await page.locator('#finance').evaluate(section => section.classList.contains('is-orbit-pinned')));

  const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await nojs.goto('http://127.0.0.1:4173/', { waitUntil: 'load' });
  assert.equal(await nojs.locator('.finance-scene:visible').count(), 5);
  assert.equal(await nojs.locator('.finance-orbit-gallery').count(), 0);
  assert.equal(await nojs.locator('.finance-scene-visual:visible').count(), 5);
  assert(await nojs.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(root, 'previews/finance-orbit-verification.json'), JSON.stringify({ results, liveReducedMotion: true, noJavaScript: true, errors }, null, 2));
  console.log('Live motion preference, no-JavaScript fallback and browser errors PASS.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
