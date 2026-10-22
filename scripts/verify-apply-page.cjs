const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { providerUrls } = require('./refine-apply-page.cjs');
const base = process.env.PREVIEW_URL || 'http://localhost:4173';
const capture = (page, name) => page.screenshot({ path: path.join(root, `previews/${name}.png`) });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const posted = [];
  const external = [];
  const results = [];
  const widths = [320, 390, 640, 768, 1024, 1440, 1915];
  fs.mkdirSync(path.join(root, 'previews'), { recursive: true });
  function watch(page) {
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.method() === 'POST') posted.push(request.url());
      if (request.url().includes('application.lend.com.au')) external.push(request.url());
    });
  }
  async function layout(page, width) {
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      frames: document.querySelectorAll('iframe').length,
      visibleSteps: [...document.querySelectorAll('[data-form-step]')].filter(panel => !panel.hidden).length,
      innerScrollers: [...document.querySelectorAll('#application, #application *')].filter(element => {
        const style = getComputedStyle(element);
        return /auto|scroll/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 2 && style.display !== 'none';
      }).map(element => element.className),
      titleVisible: (() => { const rect = document.querySelector('#application-form-title').getBoundingClientRect(); return rect.bottom > 0 && rect.top < innerHeight; })()
    }));
    assert.equal(result.overflow, false, `Horizontal overflow at ${width}px.`);
    assert.equal(result.frames, 0, 'Native form must not contain any embedded form.');
    assert.equal(result.visibleSteps, 1);
    assert.deepEqual(result.innerScrollers, [], 'There must be no nested scrolling panel.');
    return result;
  }
  async function next(page) { await page.locator('.application-action').click(); }
  async function contact(page) {
    await page.locator('#firstName').fill('Preview');
    await page.locator('#lastName').fill('Example');
    await page.locator('#email').fill('preview@example.com');
    await page.locator('#phone').fill('+61 400 000 000');
  }
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width < 640 ? 844 : 1000 }, reducedMotion: 'reduce' });
    watch(page);
    await page.goto(`${base}/apply/`);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('#application-form').isVisible(), true);
    assert.equal(await page.locator('.application-preview-note').isVisible(), true);
    assert.equal(await page.locator('.application-preview-direct').getAttribute('href'), providerUrls.personal);
    await layout(page, width);
    if ([390,1440].includes(width)) await capture(page, `apply-native-page-${width}`);
    await next(page);
    assert.equal(await page.locator('#application-form-title').textContent(), 'What’s the finance for?');
    assert.equal(await page.locator('.application-intro').isVisible(), false);
    assert.equal(await page.locator('.application-preview-direct').isVisible(), false);
    assert.equal(await page.locator(':focus').getAttribute('id'), 'application-form-title');
    await next(page);
    assert.equal(await page.locator('#application-validation').textContent(), 'Choose an option to continue.');
    await page.locator('input[value="car"]').check();
    await layout(page, width);
    if ([390,1440].includes(width)) await capture(page, `apply-native-purpose-${width}`);
    await next(page);
    await page.locator('#amount').fill('0');
    await next(page);
    assert.equal(await page.locator('#amount').getAttribute('aria-invalid'), 'true');
    await page.locator('[data-amount="25000"]').click();
    await page.locator('#timing').selectOption({ label: 'Within a month' });
    await layout(page, width);
    await next(page);
    await page.locator('#email').fill('invalid');
    await page.locator('#phone').fill('123');
    await next(page);
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 4);
    await contact(page);
    assert.equal(await page.locator('#application-validation').isVisible(), false, 'Correcting all fields must clear the error summary.');
    await layout(page, width);
    if ([390,1440].includes(width)) await capture(page, `apply-native-contact-${width}`);
    await next(page);
    await page.locator('#postcode').fill('abc');
    await next(page);
    assert.equal(await page.locator('#postcode').getAttribute('aria-invalid'), 'true');
    await page.locator('#postcode').fill('4000');
    await page.locator('#employment').selectOption({ label: 'Employed full time' });
    await layout(page, width);
    await next(page);
    assert.equal(await page.locator('.application-review-row').count(), 4);
    assert.equal(await page.locator('.application-action').isDisabled(), true);
    assert.equal(await page.locator('.application-current-form').getAttribute('href'), providerUrls.personal);
    assert.ok((await page.locator('.application-review').textContent()).includes('$25,000'));
    await layout(page, width);
    if ([390,1440].includes(width)) await capture(page, `apply-native-review-${width}`);
    await page.getByRole('button', { name: 'Edit contact', exact: true }).click();
    assert.equal(await page.locator('#email').inputValue(), 'preview@example.com');
    await next(page); await next(page);
    assert.equal(await page.locator('#application-step-count').textContent(), 'STEP 06 OF 06');
    await page.getByRole('button', { name: 'Edit finance', exact: true }).click();
    await page.locator('input[value="business"]').check();
    await next(page);
    assert.equal(await page.locator('input[name="personalPurpose"]:enabled').count(), 0);
    await page.locator('input[value="equipment"]').check();
    await next(page);
    assert.equal(await page.locator('#amount').inputValue(), '25,000');
    await page.locator('#amount').fill('25000.99');
    await next(page); await next(page);
    assert.equal(await page.locator('#application-form-title').textContent(), 'Tell us about your business.');
    await page.locator('#businessName').fill('Preview Example Pty Ltd');
    await page.locator('#abn').fill('123');
    await page.locator('#businessStarted').fill('2099-01-01');
    await page.locator('#revenue').fill('-100');
    await next(page);
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 3);
    await page.locator('#abn').fill('12 612 877 442');
    await page.locator('#businessStarted').fill('2020-01-01');
    await page.locator('#revenue').fill('45000');
    await layout(page, width);
    if ([390,1440].includes(width)) await capture(page, `apply-native-business-${width}`);
    await next(page);
    assert.equal(await page.locator('.application-current-form').getAttribute('href'), providerUrls.business);
    assert.ok((await page.locator('.application-review').textContent()).includes('$25,000.99'));
    await page.locator('#consent').check();
    assert.equal(await page.locator('.application-action').isDisabled(), true);
    await layout(page, width);
    assert.equal(await page.evaluate(() => localStorage.length), 0, 'The form must not persist personal data.');
    results.push({ width, sixSteps: true, bothFinanceTypes: true, noIframe: true, noNestedScroll: true, validation: true, editAndRetention: true });
    await page.close();
  }
  const keyboard = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watch(keyboard);
  await keyboard.goto(`${base}/apply/?type=business`);
  assert.equal(await keyboard.locator('input[value="business"]').isChecked(), true);
  await keyboard.locator('input[value="personal"]').focus();
  await keyboard.keyboard.press('ArrowRight');
  assert.equal(await keyboard.locator('input[value="business"]').isChecked(), true);
  await keyboard.locator('.mobile-toggle').click();
  assert.equal(await keyboard.locator('#mobile-nav').isVisible(), true);
  await keyboard.keyboard.press('Escape');
  assert.equal(await keyboard.locator('#mobile-nav').isVisible(), false);
  await keyboard.locator('input[value="personal"]').check();
  await next(keyboard);
  await keyboard.locator('input[value="personal-loan"]').check();
  assert.equal(await keyboard.locator('#personalLoanPurpose').isEnabled(), true);
  await next(keyboard);
  assert.equal(await keyboard.locator('#personalLoanPurpose').getAttribute('aria-invalid'), 'true');
  await keyboard.locator('#personalLoanPurpose').selectOption({ label: 'Debt consolidation' });
  await next(keyboard);
  await keyboard.locator('.application-back').click();
  assert.equal(await keyboard.locator('#personalLoanPurpose').inputValue(), 'Debt consolidation');
  await keyboard.locator('input[value="car"]').check();
  assert.equal(await keyboard.locator('#personalLoanPurpose').isDisabled(), true);
  await keyboard.close();

  const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await nojs.goto(`${base}/apply/`);
  assert.equal(await nojs.locator('#application-form').isVisible(), false);
  assert.equal(await nojs.locator('.application-direct-choice:visible').count(), 2);
  for (const [index, kind] of ['personal', 'business'].entries()) assert.equal(await nojs.locator('.application-direct-choice').nth(index).getAttribute('href'), providerUrls[kind]);
  await nojs.close();

  const file = path.join(root, 'dist/apply/index.html');
  const before = fs.readFileSync(file, 'utf8');
  require('./refine-apply-page.cjs')();
  assert.equal(fs.readFileSync(file, 'utf8'), before, 'Refiner must be idempotent.');
  assert.deepEqual(errors, []);
  assert.deepEqual(posted, [], 'No application must be sent by the preview or its checks.');
  assert.deepEqual(external, [], 'Lend must load only when the user explicitly follows a hosted-form link.');
  await browser.close();
  const report = { results, keyboard: true, mobileNavigation: true, conditionalPersonalPurpose: true, reducedAndNormalMotion: true, noJavaScript: true, idempotence: true, applicationRequests: posted.length, externalProviderLoads: external.length, errors };
  fs.writeFileSync(path.join(root, 'previews/apply-page-verification.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
