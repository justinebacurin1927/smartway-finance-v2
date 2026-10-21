(() => {
  const demo=document.querySelector('.process-demo');
  if(!demo)return;
  const messages=[...demo.querySelectorAll('[data-loan-message]')];
  const panels=[...demo.querySelectorAll('[data-loan-panel]')];
  const steps=[...demo.querySelectorAll('[data-loan-step]')];
  const typing=demo.querySelector('.loan-typing');
  const transcript=demo.querySelector('.loan-chat-scroll');
  const status=demo.querySelector('[data-loan-status]');
  const play=demo.querySelector('[data-loan-play]');
  const replay=demo.querySelector('[data-loan-replay]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const phases=['Tell us what you need','Understand your options','Support through settlement'];
  const events=[{delay:1200,message:1,phase:0},{delay:3300,message:2},{delay:1500,message:3,phase:1},{delay:3800,message:4},{delay:1500,message:5,phase:2},{delay:2500,done:true}];
  let cursor=0,timer=null,remaining=events[0].delay,started=0,wanted=false,inView=false,hasStarted=false,phase=0;
  const animate=(element,kind='message')=>{
    if(reduced.matches)return;
    if(kind==='message'){
      element.animate([
        {opacity:0,transform:'translateY(24px) scale(.76)',offset:0},
        {opacity:1,transform:'translateY(-4px) scale(1.035)',offset:.58},
        {opacity:1,transform:'translateY(2px) scale(.988)',offset:.8},
        {opacity:1,transform:'translateY(0) scale(1)',offset:1}
      ],{duration:720,easing:'cubic-bezier(.2,.75,.3,1)'});
      return;
    }
    element.animate([{opacity:0,transform:'translateY(18px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:480,easing:'cubic-bezier(.16,1,.3,1)'});
    element.querySelector('.loan-document-icon').animate([
      {transform:'translateY(12px) rotate(-9deg) scale(.55)',opacity:0},
      {transform:'translateY(-5px) rotate(4deg) scale(1.1)',opacity:1,offset:.6},
      {transform:'translateY(0) rotate(0) scale(1)',opacity:1}
    ],{duration:850,easing:'cubic-bezier(.22,.8,.3,1)'});
    element.querySelectorAll('li').forEach((item,i)=>{
      item.animate([{opacity:0,transform:'translateX(18px)'},{opacity:1,transform:'translateX(0)'}],{duration:520,delay:180+i*100,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
      item.querySelector('span').animate([{transform:'scale(0)'},{transform:'scale(1.3)',offset:.65},{transform:'scale(1)'}],{duration:600,delay:200+i*100,easing:'cubic-bezier(.2,.75,.3,1)',fill:'backwards'});
    });
  };
  const scroll=()=>transcript.scrollTo({top:transcript.scrollHeight,behavior:reduced.matches?'instant':'smooth'});
  function setPhase(next,motion=true){
    phase=next;
    steps.forEach((s,i)=>s.setAttribute('aria-pressed',String(i===next)));
    panels.forEach((p,i)=>p.hidden=i!==next);
    demo.querySelector('[data-loan-phase]').textContent=`0${next+1} / 03`;
    demo.querySelector('.loan-progress-track i').style.width=`${(next+1)/3*100}%`;
    demo.dataset.phase=String(next);
    if(motion){
      animate(panels[next],'panel');
      if(!reduced.matches)steps[next].querySelector('.loan-step-number').animate([{transform:'scale(.7)'},{transform:'scale(1.22)',offset:.58},{transform:'scale(.94)',offset:.82},{transform:'scale(1)'}],{duration:650,easing:'cubic-bezier(.2,.75,.3,1)'});
    }
    status.textContent=`Step ${next+1} of 3 · ${phases[next]}.`;
  }
  function stopTimer(){
    if(timer!==null){clearTimeout(timer);timer=null;remaining=Math.max(0,remaining-(performance.now()-started));}
  }
  function sync(){
    stopTimer();
    const running=wanted&&inView&&!document.hidden&&cursor<events.length;
    demo.dataset.state=cursor>=events.length?'complete':running?'playing':'paused';
    play.hidden=cursor>=events.length;
    play.textContent=running?'Pause demo':hasStarted?'Continue demo':'Play demo';
    play.setAttribute('aria-label',running?'Pause the example walkthrough':'Play the example walkthrough');
    replay.hidden=!hasStarted;
    const wasTyping=!typing.hidden;
    typing.hidden=!running||![0,2,4].includes(cursor);
    if(!typing.hidden&&!wasTyping&&!reduced.matches)typing.animate([{opacity:0,transform:'translateY(8px) scale(.6)'},{opacity:1,transform:'translateY(-2px) scale(1.08)',offset:.7},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:500,easing:'ease-out'});
    if(running){
      started=performance.now();
      timer=setTimeout(()=>{
        timer=null;
        const event=events[cursor++];
        if(event.done){wanted=false;typing.hidden=true;status.textContent='Example complete · Your team, from enquiry to settlement.';}
        else{
          messages[event.message].hidden=false;animate(messages[event.message]);
          if(event.phase!==undefined&&event.phase!==phase)setPhase(event.phase);
          scroll();
        }
        remaining=events[cursor]?.delay||0;sync();
      },remaining);
    }
  }
  function reset(){
    stopTimer();
    demo.getAnimations({subtree:true}).filter(a=>!('animationName' in a)).forEach(a=>a.cancel());
    cursor=0;remaining=events[0].delay;wanted=false;
    messages.forEach((m,i)=>m.hidden=i!==0);
    typing.hidden=true;transcript.scrollTop=0;setPhase(0,false);
  }
  function finish(){
    stopTimer();wanted=false;cursor=events.length;remaining=0;
    messages.forEach(m=>m.hidden=false);typing.hidden=true;setPhase(2,false);
    demo.getAnimations({subtree:true}).filter(a=>!('animationName' in a)).forEach(a=>a.cancel());
    status.textContent='Example complete · Your team, from enquiry to settlement.';scroll();sync();
  }
  play.addEventListener('click',()=>{
    hasStarted=true;
    if(reduced.matches){finish();return;}
    wanted=!wanted;sync();
  });
  replay.addEventListener('click',()=>{
    reset();hasStarted=true;
    if(reduced.matches){finish();return;}
    wanted=true;sync();
  });
  steps.forEach((step,i)=>step.addEventListener('click',()=>{
    stopTimer();wanted=false;hasStarted=true;cursor=[1,3,events.length][i];remaining=events[cursor]?.delay||0;
    messages.forEach((m,index)=>m.hidden=index>i*2+1);typing.hidden=true;setPhase(i);scroll();sync();
  }));
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
  if(reduced.matches){hasStarted=true;finish();}
  else{reset();sync();}
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0].isIntersecting;
      if(inView&&!hasStarted&&!reduced.matches){hasStarted=true;wanted=true;}
      sync();
    },{threshold:.15});
    observer.observe(demo.querySelector('.loan-walkthrough'));
  }else{inView=true;sync();}
})();
