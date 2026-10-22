(() => {
  const root = document.querySelector('[data-application-flow]');
  if (!root) return;
  const form = root.querySelector('#application-form');
  const title = root.querySelector('#application-form-title');
  const description = root.querySelector('#application-form-description');
  const label = root.querySelector('#application-step-label');
  const count = root.querySelector('#application-step-count');
  const summary = root.querySelector('#application-validation');
  const back = form.querySelector('.application-back');
  const next = form.querySelector('.application-action');
  const panels = [...form.querySelectorAll('[data-form-step]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const purposeNames = { car: 'Car', motorcycle: 'Motorcycle', caravan: 'Caravan', 'other-vehicle': 'Other vehicle', 'personal-loan': 'Personal loan', equipment: 'Equipment & machinery', 'work-vehicle': 'Work vehicle', 'cash-flow': 'Cash flow', 'business-growth': 'Business growth', other: 'Something else' };
  const headings = [
    ['LET’S START WITH YOU', 'What can we help you with?', 'Choose your starting point. We’ll guide you through the rest.', 'handshake'],
    ['A LITTLE ABOUT YOUR PLANS', 'What’s the finance for?', 'Choose the option that best matches your plans.', 'target'],
    ['LET’S TALK NUMBERS', 'What amount do you have in mind?', 'Tell us what you need and when you’d like to get started.', 'money'],
    ['NICE TO MEET YOU', 'How can we reach you?', 'A few details so our team can get in touch.', 'chat'],
    ['THE DETAILS THAT HELP', 'A little more about you.', 'Help us understand your circumstances before we talk.', 'clipboard'],
    ['ONE LAST LOOK', 'Does everything look right?', 'Check your details. You can edit any section below.', 'review']
  ];
  let step = 0;
  const value = name => form.elements[name]?.value.trim() || '';
  const kind = () => value('finance');
  const business = () => kind() === 'business';
  const money = name => Number(value(name).replaceAll(',', '').replaceAll('$', '').replaceAll(' ', ''));
  const amountLabel = name => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(money(name));

  function syncFields() {
    root.querySelector('.application-preview-direct').href = JSON.parse(root.dataset.providerUrls)[kind()];
    form.querySelectorAll('[data-finance-fields]').forEach(group => {
      group.hidden = group.dataset.financeFields !== kind();
    });
    const personalLoan = !business() && value('personalPurpose') === 'personal-loan';
    form.querySelector('.application-personal-purpose').hidden = !personalLoan;
    panels.forEach((panel, index) => {
      panel.querySelectorAll('input,select').forEach(input => {
        input.disabled = index !== step || !!input.closest('[data-finance-fields]')?.hidden || (input.name === 'personalLoanPurpose' && !personalLoan);
      });
    });
  }

  function clearErrors() {
    summary.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    form.querySelectorAll('.application-field-error').forEach(error => { error.hidden = true; error.textContent = ''; });
  }

  function errorFor(input) {
    const raw = input.value.trim();
    if (input.required && (input.type === 'checkbox' ? !input.checked : !raw)) return input.type === 'checkbox' ? 'Please confirm your consent before sending.' : 'Please complete this field.';
    if (!raw) return '';
    if (input.type === 'email' && input.validity.typeMismatch) return 'Enter a valid email address, such as name@example.com.';
    if (input.name === 'phone') {
      const normalized = raw.replace(/[\s()-]/g, '').replace(/^\+61/, '0');
      if (!/^0[23478]\d{8}$/.test(normalized)) return 'Enter a valid Australian phone number, including the area code.';
    }
    if (input.name === 'postcode' && !/^\d{4}$/.test(raw)) return 'Enter a four-digit Australian postcode.';
    if (['amount', 'income', 'revenue'].includes(input.name)) {
      const numeric = raw.replace(/[,$ ]/g, '');
      if (!/^\d+(\.\d{1,2})?$/.test(numeric) || !Number.isFinite(Number(numeric)) || Number(numeric) < (input.name === 'amount' ? 1 : 0) || Number(numeric) > 99999999.99) return 'Enter a valid amount between ' + (input.name === 'amount' ? '$1' : '$0') + ' and $99,999,999.99.';
    }
    if (input.name === 'abn') {
      const digits = raw.replace(/\s/g, '');
      const weights = [10,1,3,5,7,9,11,13,15,17,19];
      if (!/^\d{11}$/.test(digits) || digits.split('').reduce((sum, digit, index) => sum + (Number(digit) - (index === 0 ? 1 : 0)) * weights[index], 0) % 89 !== 0) return 'Enter a valid 11-digit ABN.';
    }
    if (input.name === 'businessStarted' && raw > new Date().toLocaleDateString('en-CA')) return 'Choose a business start date that is today or earlier.';
    if (!input.validity.valid) return 'Please check this value.';
    return '';
  }

  function validate() {
    clearErrors();
    const controls = [...panels[step].querySelectorAll('input:not(:disabled),select:not(:disabled)')];
    const groups = [...new Set(controls.filter(input => input.type === 'radio').map(input => input.name))];
    for (const name of groups) {
      if (![...form.querySelectorAll(`input[name="${name}"]`)].some(input => input.checked)) {
        summary.textContent = 'Choose an option to continue.';
        summary.hidden = false;
        controls.find(input => input.name === name).focus();
        return false;
      }
    }
    const invalid = controls.filter(input => input.type !== 'radio').map(input => ({ input, message: errorFor(input) })).filter(error => error.message);
    for (const { input, message } of invalid) {
      input.setAttribute('aria-invalid', 'true');
      const error = form.querySelector(`#${input.id}-error`);
      if (error) { error.textContent = message; error.hidden = false; }
    }
    if (invalid.length) {
      summary.textContent = `Please check ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}.`;
      summary.hidden = false;
      invalid[0].input.focus();
      return false;
    }
    return true;
  }

  function review() {
    const personalLoan = value('personalPurpose') === 'personal-loan';
    const purpose = purposeNames[value(business() ? 'businessPurpose' : 'personalPurpose')] || '';
    const rows = [
      ['Finance', `${business() ? 'Business finance' : 'Personal & vehicle'} · ${purpose}${!business() && personalLoan ? ` · ${value('personalLoanPurpose')}` : ''}`, 0],
      ['Your plans', `${amountLabel('amount')} · ${value('timing')}`, 2],
      ['Contact', `${value('firstName')} ${value('lastName')} · ${value('email')} · ${value('phone')}`, 3],
      ['Details', business() ? `${value('businessName')} · ABN ${value('abn')} · Started ${value('businessStarted')} · ${amountLabel('revenue')} monthly revenue` : `${value('postcode')} · ${value('employment')}${value('income') ? ` · ${amountLabel('income')} annual income` : ''}${value('livingSituation') ? ` · ${value('livingSituation')}` : ''}`, 4]
    ];
    const list = form.querySelector('.application-review');
    list.replaceChildren();
    for (const [name, text, editStep] of rows) {
      const row = document.createElement('div');
      row.className = 'application-review-row';
      const heading = document.createElement('strong');
      heading.textContent = name;
      const details = document.createElement('p');
      details.textContent = text;
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.textContent = 'Edit';
      edit.setAttribute('aria-label', `Edit ${name.toLowerCase()}`);
      edit.addEventListener('click', () => showStep(editStep));
      row.append(heading, details, edit);
      list.append(row);
    }
    root.querySelector('.application-current-form').href = JSON.parse(root.dataset.providerUrls)[kind()];
  }

  function showStep(index, focus = true) {
    step = index;
    clearErrors();
    panels.forEach((panel, i) => { panel.hidden = i !== step; });
    document.body.classList.toggle('application-in-progress', step > 0);
    syncFields();
    const content = [...headings[step]];
    if (step === 4 && business()) { content[1] = 'Tell us about your business.'; content[2] = 'A few details about the business you’re financing.'; content[3] = 'briefcase'; }
    [label.textContent, title.textContent, description.textContent] = content;
    root.querySelector('.application-card-icon use').setAttribute('href', `/assets/icons/smartway-doodles.svg#${content[3]}`);
    count.textContent = `STEP ${String(step + 1).padStart(2, '0')} OF 06`;
    root.querySelector('.application-progress-kind').textContent = step ? (business() ? 'Business finance' : 'Personal & vehicle') : 'Your next chapter';
    root.querySelectorAll('[data-application-step]').forEach((item, i) => {
      if (i === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('is-complete', i < step);
    });
    back.hidden = step === 0;
    root.querySelector('.application-preview-direct').hidden = step !== 0;
    next.disabled = step === 5;
    next.querySelector('.application-action-label').textContent = step === 5 ? 'Sending not connected' : step === 4 ? 'Review details' : 'Continue';
    root.querySelector('.application-review-disclaimer').hidden = step !== 5;
    document.title = `Step ${step + 1} of 6: ${title.textContent} | Smartway Finance`;
    if (step === 5) review();
    if (focus) {
      title.focus({ preventScroll: true });
      root.querySelector('#application').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
      if (!motion.matches) panels[step].animate([{ opacity: .45, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step === 5) return; // Fail closed: never pretend to submit or send personal details from this preview.
    if (validate()) showStep(step + 1);
  });
  back.addEventListener('click', () => showStep(Math.max(0, step - 1)));
  form.addEventListener('change', event => {
    if (['finance', 'personalPurpose'].includes(event.target.name)) syncFields();
    if (event.target.name === 'finance') form.elements.consent.checked = false;
    if (event.target.type === 'radio') summary.hidden = true;
  });
  form.addEventListener('input', event => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      event.target.removeAttribute('aria-invalid');
      const error = form.querySelector(`#${event.target.id}-error`);
      if (error) error.hidden = true;
      const remaining = form.querySelectorAll('[aria-invalid="true"]').length;
      summary.hidden = remaining === 0;
      if (remaining) summary.textContent = `Please check ${remaining === 1 ? 'the highlighted field' : `the ${remaining} highlighted fields`}.`;
    }
    if (event.target.name !== 'consent') form.elements.consent.checked = false;
  });
  form.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => {
    form.elements.amount.value = Number(button.dataset.amount).toLocaleString('en-AU');
    form.elements.amount.dispatchEvent(new Event('input', { bubbles: true }));
    form.elements.amount.focus();
  }));
  if (new URLSearchParams(location.search).get('type') === 'business') form.elements.finance.value = 'business';
  form.elements.businessStarted.max = new Date().toLocaleDateString('en-CA');
  form.hidden = false;
  showStep(0, false);
})();
