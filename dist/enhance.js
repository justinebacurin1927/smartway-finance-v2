(() => {
  const finance=document.querySelector('.finance-experience');
  if(finance){
    const tabs=[...finance.querySelectorAll('[data-finance-choice]')];
    const scenes=[...finance.querySelectorAll('[data-finance-scene]')];
    let selected=0;
    function select(index,focus=false,source='control'){
      selected=index;
      tabs.forEach((tab,i)=>{tab.classList.toggle('is-active',i===index);tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
      scenes.forEach((scene,i)=>{scene.classList.toggle('is-active',i===index);scene.hidden=i!==index;});
      if(focus)tabs[index].focus();
      finance.dispatchEvent(new CustomEvent('finance:select',{detail:{index,source}}));
    }
    finance.addEventListener('finance:request',event=>{
      const {index,source='control'}=event.detail||{};
      if(Number.isInteger(index)&&index>=0&&index<tabs.length)select(index,false,source);
    });
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>select(i));
      tab.addEventListener('keydown',e=>{
        let next=selected;
        if(['ArrowDown','ArrowRight'].includes(e.key))next=(selected+1)%tabs.length;
        else if(['ArrowUp','ArrowLeft'].includes(e.key))next=(selected-1+tabs.length)%tabs.length;
        else if(e.key==='Home')next=0;
        else if(e.key==='End')next=tabs.length-1;
        else return;
        e.preventDefault();select(next,true);
      });
    });
    const compact=matchMedia('(max-width: 800px)');
    const orient=()=>finance.querySelector('[role=tablist]').setAttribute('aria-orientation',compact.matches?'horizontal':'vertical');
    orient();compact.addEventListener('change',orient);
    finance.classList.add('is-enhanced');select(0);
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const journey=document.querySelector('.process-journey');
  if(journey&&!reduced.matches&&'IntersectionObserver' in window){
    journey.classList.add('route-ready');
    const routeObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){journey.classList.add('route-visible');routeObserver.disconnect();}},{threshold:.15});
    routeObserver.observe(journey);
  }
  // Reveal motion never hides content before an observer or script can run.
  if(!reduced.matches&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.animate([{transform:'translateY(16px)'},{transform:'translateY(0)'}],{duration:550,easing:'ease-out'});
        observer.unobserve(entry.target);
      }
    }),{threshold:.06});
    document.querySelectorAll('#about,.editorial-journal,.faq-section,.inner-page .content-section:not(.page-masthead)').forEach(section=>observer.observe(section));
  }
})();
