(() => {
  const form = document.querySelector('#contact-enquiry');
  if (!form) return;
  form.noValidate = true;
  const summary = form.querySelector('.contact-error-summary');
  const draft = form.querySelector('.contact-draft');
  const draftLink = form.querySelector('.contact-draft-link');
  const status = form.querySelector('#contact-draft-status');
  const required = [...form.querySelectorAll('[required]')];
  const field = name => form.elements.namedItem(name);
  const finance = field('financeType');
  const chosen = new URLSearchParams(location.search).get('finance');
  const aliases = { 'Chattel Mortgage':'Business Finance', 'Finance Lease':'Business Finance', 'Unsecured Personal Loan':'Personal Loans', 'Secured Car Loan':'New & Used Vehicle Loans' };
  const allowed = [...finance.options].map(option => option.value).filter(Boolean);
  const mapped = (Object.hasOwn(aliases, chosen) ? aliases[chosen] : '') || (allowed.includes(chosen) ? chosen : '');
  if (mapped) {
    finance.value = mapped;
    field('message').value = `I would like to enquire about ${chosen}.`;
  }

  function errorFor(control) {
    const value = control.value.trim();
    if (control.type === 'checkbox') return control.checked ? '' : 'Please agree to the Privacy Policy to prepare your enquiry.';
    if (!value) return ({ firstName:'Enter your first name.', lastName:'Enter your last name.', email:'Enter your email address.', phone:'Enter your phone number.' })[control.name];
    if (control.type === 'email' && control.validity.typeMismatch) return 'Enter an email address in the format name@example.com.';
    return '';
  }
  function showError(control) {
    const message = errorFor(control);
    const error = document.getElementById(`${control.id}-error`);
    error.textContent = message;
    error.hidden = !message;
    if (message) control.setAttribute('aria-invalid','true');
    else control.removeAttribute('aria-invalid');
    return Boolean(message);
  }
  function clearDraft() {
    if (!draft.hidden) {
      draft.hidden = true;
      draftLink.href = 'mailto:info@swfin.com.au';
      status.textContent = '';
    }
  }
  function updateErrors(control) {
    if (!control.hasAttribute('aria-invalid')) return;
    showError(control);
    const count = required.filter(input => input.hasAttribute('aria-invalid')).length;
    summary.hidden = !count;
    summary.textContent = count ? `Please check ${count === 1 ? 'the highlighted field' : `the ${count} highlighted fields`} below.` : '';
  }
  form.addEventListener('input', event => {
    clearDraft();
    updateErrors(event.target);
  });
  form.addEventListener('change', event => {
    clearDraft();
    updateErrors(event.target);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearDraft();
    const errors = required.filter(showError);
    if (errors.length) {
      summary.textContent = `Please check ${errors.length === 1 ? 'the highlighted field' : `the ${errors.length} highlighted fields`} below.`;
      summary.hidden = false;
      errors[0].focus();
      return;
    }
    summary.hidden = true;
    summary.textContent = '';
    const value = name => field(name).value.trim();
    const lines = [
      'Hello Smartway Finance,', '',
      `Name: ${value('firstName')} ${value('lastName')}`,
      `Email: ${value('email')}`,
      `Phone: ${value('phone')}`,
      `Finance type: ${value('financeType') || 'Not specified'}`,
      `Approximate loan amount: ${value('loanAmount') || 'Not specified'}`,
      `Best time to call: ${value('callTime') || 'Any time'}`, '',
      value('message') || 'I would like to discuss my finance options.', '',
      'I consent to Smartway Finance collecting and using my information in accordance with its Privacy Policy.'
    ];
    draftLink.href = 'mailto:info@swfin.com.au?subject=' + encodeURIComponent('Smartway Finance enquiry') + '&body=' + encodeURIComponent(lines.join('\n'));
    draft.hidden = false;
    status.textContent = 'Your email draft is ready. Open your email app to review and send it.';
    draftLink.focus();
  });
})();
