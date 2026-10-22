(() => {
  const menuButton=document.querySelector('.mobile-toggle');
  const menu=document.querySelector('#mobile-nav');
  if(document.body.classList.contains('inner-page')){
    const close=()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');};
    menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));menuButton.setAttribute('aria-label',menu.hidden?'Open navigation':'Close navigation');});
    menu.addEventListener('click',e=>{if(e.target.closest('a'))close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close();menuButton.focus();}});
    document.addEventListener('click',e=>{if(!e.target.closest('.header'))close();});
  }
  const route=document.body.dataset.page;
  const main=document.querySelector('.source-page');
  if(!main)return;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const numberFrames=new Map();
  const ease='cubic-bezier(.22,1,.36,1)';
  function reveal(element,delay=0,distance=18){
    if(reducedMotion.matches)return;
    element.getAnimations().forEach(animation=>animation.cancel());
    element.animate([{opacity:.25,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}],{duration:650,delay,easing:ease});
  }
  function countTo(element,value,decimals,start=performance.now()){
    const previous=Number(element.dataset.displayValue??value);
    const running=numberFrames.get(element);if(running)cancelAnimationFrame(running.frame);
    element.dataset.displayValue=previous;
    element.setAttribute('aria-label',money(value,decimals));
    const finish=()=>{element.textContent=money(value,decimals);element.dataset.displayValue=value;numberFrames.delete(element);};
    if(reducedMotion.matches||previous===value){finish();return;}
    const job={finish,frame:0};numberFrames.set(element,job);
    function tick(now){
      const progress=Math.max(0,Math.min(1,(now-start)/420)),current=previous+(value-previous)*(1-Math.pow(1-progress,3));
      element.textContent=money(current,decimals);element.dataset.displayValue=current;
      if(progress<1)job.frame=requestAnimationFrame(tick);else finish();
    }
    job.frame=requestAnimationFrame(tick);
  }
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){for(const job of [...numberFrames.values()]){cancelAnimationFrame(job.frame);job.finish();}main.getAnimations({subtree:true}).forEach(a=>a.cancel());}});
  const money=(n,d=0)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
  const payment=(principal,rate,years,balloon=0)=>{const r=rate/1200,n=years*12;return r===0?(principal-balloon)/n:(principal-balloon/Math.pow(1+r,n))*r/(1-Math.pow(1+r,-n));};
  function field(id,label,value,min,max,step,format){return `<div class="calc-field"><label for="${id}">${label}<output id="${id}-value">${format(value)}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;}
  if(route==='/calculator'){
    const section=main.querySelectorAll('section')[1];
    const disclaimer=[...section.querySelectorAll('p')].find(p=>p.textContent.includes('Disclaimer:'))?.textContent||'';
    if (!section.hasAttribute('data-calculator-workspace')) section.innerHTML=`<div class="content-container"><div class="calc-layout"><div><p class="label">Adjust Your Loan</p><div class="calc-controls">${field('amount','Loan Amount',25000,3000,200000,500,money)}${field('term','Loan Term',5,1,7,1,n=>n+' years')}${field('rate','Interest Rate (p.a.)',7.99,4,20,.01,n=>Number(n).toFixed(2)+'%')}${field('balloon','Balloon / Residual',0,0,10000,500,money)}</div><p>Interest Rate from <b>5.95% p.a.</b><br>Comparison Rate from <b>5.95% p.a.*</b></p></div><div class="estimate" aria-live="polite" aria-atomic="true"><p class="label">Your Estimate</p><p>Estimated Monthly Repayment</p><strong id="monthly"></strong><p id="period"></p><dl id="breakdown"></dl><a class="button" href="/apply/">Get a Real Quote — It's Free ↗</a><p>No obligation. Response within 1 business day.</p></div></div><p class="calc-note">${disclaimer}</p></div>`;
    section.querySelectorAll('input[type=range]').forEach(input=>{input.disabled=false;});
    function update(){const a=+document.querySelector('#amount').value,t=+document.querySelector('#term').value,r=+document.querySelector('#rate').value,b=+document.querySelector('#balloon').value,m=payment(a,r,t,b),total=m*t*12+b;
      section.querySelectorAll('input[type=range]').forEach(input=>input.style.setProperty('--calculator-progress',100*(input.value-input.min)/(input.max-input.min)+'%'));
      document.querySelector('#amount-value').textContent=money(a);document.querySelector('#term-value').textContent=t+' years';document.querySelector('#rate-value').textContent=r.toFixed(2)+'%';document.querySelector('#balloon-value').textContent=money(b);
      document.querySelector('#monthly').textContent=money(m,2);document.querySelector('#period').textContent=`per month for ${t} years`;
      document.querySelector('#breakdown').innerHTML=[['Loan Amount',money(a)],['Interest Rate',r.toFixed(2)+'% p.a.'],['Loan Term',`${t} years (${t*12} payments)`],['Balloon / Residual',money(b)],['Total Repayable',money(total,2)],['Total Interest',money(total-a,2)]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    }section.addEventListener('input',update);update();
  }
  if(route==='/compare'){
    const section=main.querySelectorAll('section')[1];
    const disclaimer=[...section.querySelectorAll('p')].find(p=>p.textContent.includes('Disclaimer:'))?.textContent||'';
    section.classList.add('comparison-workspace');
    section.innerHTML=`<div class="wrap"><div class="compare-inputs"><div class="compare-inputs-heading"><span class="inner-kicker">01 / Shape your loan</span><p>A clearer view<br>of your options.</p></div>${field('amount','Loan Amount',30000,5000,150000,1000,money)}${field('term','Loan Term',5,1,7,1,n=>n+' years')}<div class="compare-purpose"><p class="inner-kicker">Loan Purpose</p><div class="filter-tabs"><button id="personal-purpose" type="button" aria-pressed="true">Personal</button><button id="business-purpose" type="button" aria-pressed="false">Business</button></div></div></div><div class="compare-results-heading"><p class="inner-kicker">02 / Side by side</p><p id="compare-status" role="status" aria-live="polite"></p></div><p class="compare-scroll-hint">Scroll the table sideways to compare both options. Use arrow keys when the table is focused.</p><div class="comparison-results" tabindex="0" role="region" aria-label="Loan comparison table, scroll horizontally for both options"></div><p class="compare-method">Monthly estimates use the midpoint of the published 5.95–24.99% rate range. Both products share that indicative range; their loan structures differ. Estimates exclude fees.</p><p class="calc-note">${disclaimer}</p></div>`;
    let purpose='personal';
    const productSets={personal:[{name:'Secured Car Loan',tag:'Most Popular',maxTerm:7,features:['Lowest rates','Terms up to 84 months','New & used vehicles','PPSR support included']},{name:'Unsecured Personal Loan',tag:'Flexible',maxTerm:7,features:['No asset required as security','Own the vehicle outright','Flexible use','Fast approvals']}],business:[{name:'Chattel Mortgage',tag:'Business',maxTerm:7,features:['Own asset from day one','GST may be claimable upfront','Interest may be tax-deductible','Balloon payment option']},{name:'Finance Lease',tag:'Business',maxTerm:5,features:['Lower monthly repayments','Off-balance-sheet option','Upgrade at end of term','Running costs may be included']}]};
    let renderedPurpose;
    function update(){
      const amount=+document.querySelector('#amount').value,years=+document.querySelector('#term').value;
      const changeStarted=performance.now(),termOutput=document.querySelector('#term-value');
      countTo(document.querySelector('#amount-value'),amount,0,changeStarted);
      if(termOutput.textContent!==years+' years'){termOutput.textContent=years+' years';reveal(termOutput,0,6);}
      for(const slider of section.querySelectorAll('input[type=range]'))slider.style.setProperty('--range-progress',100*(slider.value-slider.min)/(slider.max-slider.min)+'%');
      const products=productSets[purpose].map(p=>{const term=Math.min(years,p.maxTerm),monthly=payment(amount,15.47,term);return {...p,term,monthly,total:monthly*term*12,low:payment(amount,5.95,term),high:payment(amount,24.99,term)};});
      document.querySelector('#compare-status').textContent=`${money(amount)} over ${years} years · ${purpose==='personal'?'Personal':'Business'} finance`;
      const row=(label,values,cls='')=>`<tr class="${cls}"><th scope="row">${label}</th>${values.map(v=>`<td>${v}</td>`).join('')}</tr>`;
      const markup=`<table class="loan-ledger"><caption class="sr-only">Indicative loan comparison for ${money(amount)} over ${years} years</caption><thead><tr><td class="ledger-corner">Your options</td>${products.map((p,i)=>`<th scope="col"><span class="ledger-index">0${i+1} / ${p.tag}</span><h2>${p.name}</h2></th>`).join('')}</tr></thead><tbody>${row('Estimated monthly repayment',products.map(p=>`<strong class="ledger-payment">${money(p.monthly,2)}</strong><span class="ledger-unit">per month · ${p.term} years</span>`),'ledger-payment-row')}${row('Estimated monthly range',products.map(p=>`${money(p.low,2)} – ${money(p.high,2)}`))}${row('Interest rate from',products.map(()=>'5.95% p.a.'))}${row('Comparison rate from*',products.map(()=>'5.95% p.a.'))}${row('Rate range',products.map(()=>'5.95–24.99%'))}${row('Maximum term',products.map(p=>p.maxTerm+' years'))}${row('Term used in this estimate',products.map(p=>p.term+' years'))}${row('Estimated total repayments',products.map(p=>money(p.total)))}${row('What’s included',products.map(p=>`<ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>`),'ledger-features')}${row('Next step',products.map(p=>`<a class="ledger-enquire" href="/contact/?finance=${encodeURIComponent(p.name)}">Enquire about this option<span class="sr-only">: ${p.name}</span></a>`),'ledger-actions')}</tbody></table>`;
      const results=section.querySelector('.comparison-results');
      const switching=renderedPurpose!==undefined&&renderedPurpose!==purpose;
      if(renderedPurpose===undefined)results.innerHTML=markup;
      else {
        const template=document.createElement('template');template.innerHTML=markup;
        const current=[...results.querySelectorAll('th,td,caption')];
        template.content.querySelectorAll('th,td,caption').forEach((cell,index)=>{
          const target=current[index];
          if(target.querySelector('.ledger-payment')){const unit=target.querySelector('.ledger-unit'),nextUnit=cell.querySelector('.ledger-unit');if(unit.textContent!==nextUnit.textContent){unit.textContent=nextUnit.textContent;reveal(unit,0,6);}return;}
          if(target.innerHTML!==cell.innerHTML){target.innerHTML=cell.innerHTML;if(!target.matches('caption'))reveal(target,(index%3)*35,8);}
        });
      }
      results.querySelectorAll('.ledger-payment').forEach((node,index)=>countTo(node,products[index].monthly,2,changeStarted));
      if(switching)results.querySelectorAll('thead th,.ledger-features td,.ledger-actions td').forEach((node,index)=>reveal(node,index%2*65,12));
      renderedPurpose=purpose;
    }
    for(const type of ['personal','business'])document.querySelector('#'+type+'-purpose').addEventListener('click',()=>{if(purpose===type)return;purpose=type;for(const v of ['personal','business'])document.querySelector('#'+v+'-purpose').setAttribute('aria-pressed',String(v===type));update();});
    section.addEventListener('input',update);update();
  }
  if(route==='/apply' && !main.hasAttribute('data-application-flow')){
    const buttons=[...main.querySelectorAll('.page-masthead button')],frames=[...main.querySelectorAll('iframe')];
    frames.forEach((frame,i)=>{frame.hidden=i!==0;frame.title=i===0?'Personal and vehicle finance application':'Business finance application';if(i===1){frame.dataset.src=frame.src;frame.removeAttribute('src');}});
    buttons.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>{buttons.forEach((other,j)=>other.setAttribute('aria-pressed',String(i===j)));frames.forEach((frame,j)=>{frame.hidden=i!==j;if(i===j&&!frame.getAttribute('src'))frame.src=frame.dataset.src;});});});
  }
  if(route==='/blog'){
    const tabs=[...main.querySelectorAll('[data-category-filter]')];
    const articles=[...main.querySelectorAll('.edition-story')];
    const empty=main.querySelector('.filter-empty'),status=main.querySelector('.journal-filter-status');
    tabs.forEach(button=>button.addEventListener('click',()=>{
      if(button.getAttribute('aria-pressed')==='true')return;
      const before=new Map(articles.filter(a=>!a.hidden).map(a=>[a,a.getBoundingClientRect()]));
      const category=button.dataset.categoryFilter;
      tabs.forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));
      articles.forEach(article=>{article.hidden=category!=='All'&&article.dataset.category!==category;});
      const count=articles.filter(article=>!article.hidden).length;
      empty.hidden=count>0;
      if(!reducedMotion.matches)articles.filter(a=>!a.hidden).forEach((article,index)=>{
        article.getAnimations().forEach(a=>a.cancel());
        const old=before.get(article),next=article.getBoundingClientRect();
        if(old)article.animate([{transform:`translate(${old.left-next.left}px,${old.top-next.top}px)`},{transform:'translate(0,0)'}],{duration:550,easing:ease});
        else reveal(article,index*55,20);
      });
      if(!count)reveal(empty);
      status.textContent=count+' '+(count===1?'article':'articles')+(category==='All'?'':' in '+category);
    }));
  }
  if(route==='/contact'&&!main.classList.contains('contact-page')){
    const form=main.querySelector('form');
    const chosen=new URLSearchParams(location.search).get('finance');
    if(chosen){const finance=form.querySelector('[name=financeType]');finance.value=['Chattel Mortgage','Finance Lease'].includes(chosen)?'Business Finance':chosen==='Unsecured Personal Loan'?'Personal Loans':chosen==='Secured Car Loan'?'New & Used Vehicle Loans':'';const message=form.querySelector('textarea');if(message)message.value='I would like to enquire about '+chosen+'.';}
    for(const control of form.querySelectorAll('input,select,textarea')){if(!control.id)control.id='enquiry-'+control.name;let wrapper=control.parentElement;const label=wrapper.querySelector('label');if(label&&!label.htmlFor)label.htmlFor=control.id;}
    const notice=document.createElement('p');notice.className='form-notice';notice.textContent='This preview opens your enquiry in your email app. You can also call 07 5512 7080 or use the live Smartway contact form.';form.prepend(notice);
    const link=document.createElement('a');link.href='https://www.swfin.com.au/contact';link.textContent='Use the live contact form';link.className='text-link';notice.append(document.createTextNode(' '),link);
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const values=new FormData(form);const body=[...values].map(([k,v])=>k+': '+v).join('\n');location.href='mailto:info@swfin.com.au?subject='+encodeURIComponent('Smartway Finance enquiry')+'&body='+encodeURIComponent(body);});
  }
  if(main.classList.contains('refined-page')){
    main.querySelectorAll('h1,.edition-intro,.comparison-masthead .wrap>p:last-child,.contact-masthead>p:last-child,.stories-rating,.compare-inputs').forEach((element,index)=>reveal(element,index*65,22));
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){reveal(entry.target,0,24);observer.unobserve(entry.target);}
      }),{threshold:.08});
      main.querySelectorAll('.edition-story,.client-story,.contact-letter,.contact-human figure,.inner-closing>.wrap,.contact-map>.wrap,.loan-ledger').forEach(element=>observer.observe(element));
    }
  }
})();
