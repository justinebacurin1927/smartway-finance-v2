const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/home/jaycee/Projects/huntly/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.CONTACT_PREVIEW_URL || 'http://localhost:4173';
const live = !base.includes('localhost');
const report = { base, widths:[], checks:{} };
const pageUrl = finance => `${base}/contact${live ? '' : '/'}${finance ? `?finance=${encodeURIComponent(finance)}` : ''}`;
const nodes = (node, tag) => typeof node === 'string' ? [] : [...(node.tag === tag ? [node] : []), ...(node.children || []).flatMap(child => nodes(child, tag))];
const text = node => typeof node === 'string' ? node : (node.children || []).map(text).join('');
const source = JSON.parse(fs.readFileSync(path.join(root, 'references/source-site/content.json'), 'utf8')).pages['/contact'].main;

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of live ? [1440,390] : [320,390,768,1024,1440,1915]) {
      const page = await browser.newPage({viewport:{width,height:1000}});
      const errors = [], failed = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if(response.url().startsWith(base) && response.status() >= 400) failed.push(response.url()); });
      await page.goto(pageUrl(), {waitUntil:'networkidle'});
      await page.locator('.contact-team img').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.contact-team img').naturalWidth > 0);
      const layout = await page.evaluate(() => {
        const form = document.querySelector('#contact-enquiry');
        const controls = [...form.querySelectorAll('input,select,textarea')];
        return {
          overflow:document.documentElement.scrollWidth > innerWidth,
          labels:controls.every(control => [...control.labels].some(label => label.textContent.trim())),
          controlsFit:controls.every(control => { const r=control.getBoundingClientRect(); return r.left>=0 && r.right<=innerWidth+1; }),
          inputSize:Math.min(...controls.filter(c=>c.type!=='checkbox').map(c=>parseFloat(getComputedStyle(c).fontSize))),
          inputHeight:Math.min(...controls.filter(c=>c.type!=='checkbox').map(c=>c.getBoundingClientRect().height)),
          columns:getComputedStyle(document.querySelector('.contact-workspace-grid')).gridTemplateColumns.split(' ').length,
          photoDraggable:document.querySelector('.contact-team img').draggable,
          breadcrumbs:document.querySelectorAll('main .breadcrumbs').length,
          oldNotice:document.querySelectorAll('.form-notice').length
        };
      });
      assert.equal(layout.overflow,false); assert(layout.labels && layout.controlsFit);
      assert(layout.inputSize>=16 && layout.inputHeight>=52); assert.equal(layout.photoDraggable,false);
      assert.equal(layout.columns,width>900 ? 2 : 1); assert.equal(layout.breadcrumbs,0); assert.equal(layout.oldNotice,0);
      for (const control of nodes(source,'select')) {
        const actual = await page.locator(`[name="${control.attrs.name}"] option`).allTextContents();
        assert.deepEqual(actual,nodes(control,'option').map(text));
      }
      const content = await page.locator('main').innerText();
      for(const original of ['07 5512 7080','info@swfin.com.au','38/207 Currumburra Rd','Ashmore QLD 4214','8:00am – 5:00pm','By appointment','Closed','FBAA Member','AFCA Member','ACL #566769','42 682 496 779']) assert(content.includes(original),original);
      assert.deepEqual(errors,[]); assert.deepEqual(failed,[]);
      report.widths.push({width,...layout,errors,failed});
      if([320,390,1440].includes(width)) {
        await page.evaluate(()=>scrollTo(0,0));
        await page.screenshot({path:path.join(root,`previews/contact-page-${live ? 'live-' : ''}${width}.png`)});
      }
      await page.close();
    }
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    await page.goto(pageUrl(),{waitUntil:'networkidle'});
    const submit = page.locator('#contact-enquiry button[type="submit"]');
    await submit.click();
    assert.equal(await page.locator('[aria-invalid="true"]').count(),5);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-firstName');
    assert.equal(await page.locator('#contact-firstName').evaluate(el=>getComputedStyle(el).borderColor),'rgb(160, 44, 53)');
    await page.locator('#contact-firstName').fill('QA & Review');
    await page.locator('#contact-lastName').fill("O’Example");
    await page.locator('#contact-email').fill('invalid-email');
    await page.locator('#contact-phone').fill('+61 400 000 000');
    await page.locator('#contact-consent').check();
    await submit.click();
    assert.equal(await page.locator('[aria-invalid="true"]').count(),1);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-email');
    assert((await page.locator('#contact-email-error').innerText()).includes('name@example.com'));
    await page.locator('#contact-email').fill('qa@example.invalid');
    await page.locator('#contact-financeType').selectOption({label:'Business Finance'});
    await page.locator('#contact-loanAmount').selectOption({label:'$25,000 – $50,000'});
    await page.locator('#contact-callTime').selectOption({label:'Afternoon (12pm–3pm)'});
    const message = 'A vehicle & equipment? <test>\nA second line with # and +.';
    await page.locator('#contact-message').fill(message);
    await submit.focus(); await page.keyboard.press('Enter');
    const draft = page.locator('.contact-draft');
    assert(await draft.isVisible()); assert.equal(await page.locator('[aria-invalid="true"]').count(),0);
    assert.equal(await page.evaluate(()=>document.activeElement.className),'contact-draft-link');
    const href = new URL(await page.locator('.contact-draft-link').getAttribute('href'));
    assert.equal(href.protocol,'mailto:'); assert.equal(href.pathname,'info@swfin.com.au');
    assert.equal(href.searchParams.get('subject'),'Smartway Finance enquiry');
    const body = href.searchParams.get('body');
    for(const expected of ['QA & Review','O’Example','qa@example.invalid','+61 400 000 000','Business Finance','$25,000 – $50,000','Afternoon (12pm–3pm)',message,'Privacy Policy']) assert(body.includes(expected));
    assert.equal(page.url(),pageUrl()); // Preparing never navigates or sends a message.
    if(!live) await page.screenshot({path:path.join(root,'previews/contact-page-draft-1440.png')});
    await page.locator('#contact-message').fill('Changed after preparing.');
    assert.equal(await draft.isVisible(),false);
    assert.equal(await page.locator('.contact-draft-link').getAttribute('href'),'mailto:info@swfin.com.au');
    await submit.click(); assert(await draft.isVisible());
    assert(new URL(await page.locator('.contact-draft-link').getAttribute('href')).searchParams.get('body').includes('Changed after preparing.'));
    report.checks.validationAndFocus = true; report.checks.draftEncodingAndRetry = true;

    for(const [chosen,expected] of [['Chattel Mortgage','Business Finance'],['Finance Lease','Business Finance'],['Secured Car Loan','New & Used Vehicle Loans'],['Unsecured Personal Loan','Personal Loans'],['Leisure Finance','Leisure Finance'],['constructor',''],['<script>unknown</script>','']]) {
      await page.goto(pageUrl(chosen),{waitUntil:'networkidle'});
      assert.equal(await page.locator('#contact-financeType').inputValue(),expected);
      assert.equal(await page.locator('#contact-message').inputValue(),expected ? `I would like to enquire about ${chosen}.` : '');
    }
    report.checks.financePrefill = true;
    await page.goto(pageUrl(),{waitUntil:'networkidle'});
    const card=page.locator('.contact-method').first(); await card.hover(); await page.waitForTimeout(300);
    assert.equal(await card.evaluate(el=>getComputedStyle(el).transform),'matrix(1, 0, 0, 1, 0, -4)');
    const action=page.locator('.contact-next .contact-action'); await action.focus(); await page.waitForTimeout(750);
    assert.equal(await action.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
    assert.equal(await action.locator('.finance-action-label').evaluate(el=>getComputedStyle(el).animationName),'finance-label-reveal');
    await page.emulateMedia({reducedMotion:'reduce'}); await card.hover();
    assert.equal(await card.evaluate(el=>getComputedStyle(el).transform),'none');
    assert.equal(await card.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
    await action.focus(); assert.equal(await action.locator('.finance-action-label').evaluate(el=>getComputedStyle(el).animationName),'none');
    report.checks.hoverKeyboardAndReducedMotion = true;

    await page.setViewportSize({width:720,height:450});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    report.checks.reflow200PercentEquivalent = true;
    await page.setViewportSize({width:844,height:390}); await page.evaluate(()=>scrollTo(0,0));
    await page.locator('.mobile-toggle').click(); assert(await page.locator('#mobile-nav').isVisible());
    await page.keyboard.press('Escape'); assert.equal(await page.locator('#mobile-nav').isVisible(),false);
    report.checks.landscapeNavigation = true;

    const staticPage = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await staticPage.goto(pageUrl(),{waitUntil:'networkidle'});
    assert.equal(await staticPage.locator('#contact-enquiry').isVisible(),false);
    assert(await staticPage.locator('.contact-no-js').isVisible());
    assert.equal(await staticPage.locator('.contact-no-js a').count(),3);
    report.checks.noJavaScriptAlternatives = true;
    const touch = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await touch.goto(pageUrl(),{waitUntil:'networkidle'});
    await touch.locator('label[for="contact-firstName"]').tap();
    assert.equal(await touch.evaluate(()=>document.activeElement.id),'contact-firstName');
    report.checks.touchLabel = true;

    const file=path.join(root,`previews/contact-page-${live ? 'live-' : ''}verification.json`);
    fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
