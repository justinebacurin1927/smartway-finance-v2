(() => {
 const root=document.querySelector('[data-loan-page]');
 if(!root)return;
 const header=document.querySelector('body.loan-page>header.header');
 const updateHeader=()=>header?.classList.toggle('is-scrolled',scrollY>20);
 updateHeader();
 addEventListener('scroll',updateHeader,{passive:true});
 addEventListener('pageshow',updateHeader);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const animate=window.SmartwayHeadingMotion;
 if(animate){
  const setups=[
   {title:'#loan-title',section:root.classList.contains('lp-overview')?'.lp-overview-hero':'.lp-hero',panel:root.classList.contains('lp-overview')?'.lp-overview-stage':'.lp-hero-stage',field:root.classList.contains('lp-overview')?'.lp-overview-stage':'.lp-hero-stage',protected:'.lp-kicker,.lp-product-icon,.lp-subtitle,.lp-actions,.lp-rates,.lp-specialism,.lp-hero-photo,.lp-overview-intro'},
   {title:'#loan-benefits-title',section:'.lp-benefits',panel:'.lp-benefit-grid',protected:'.lp-kicker,.lp-benefit'},
   {title:'#loan-faq-title',section:'.lp-faq',panel:'.lp-faq-list',field:'.lp-faq>.lp-wrap',protected:'.lp-kicker,.lp-section-heading>p,.lp-section-heading>a,.lp-faq-list'},
   {title:'#loan-related-title',section:'.lp-related',panel:'.lp-related-grid',protected:'.lp-kicker,.lp-heading-split>a,.lp-related-card'},
   {title:'#loan-specialists-title',section:'.lp-specialists',panel:'.lp-specialist-grid',protected:'.lp-kicker,.lp-specialist-grid'}
  ];
  setups.forEach(config=>{
   const title=root.querySelector(config.title);
   if(!title)return;
   const count=title.querySelectorAll('.lp-word').length;
   const anchors=Array.from({length:count},(_,index)=>({x:(index*.37)%1,y:(index*.29+.06)%1}));
   animate({...config,words:'.lp-word',motionClass:'lp-heading-motion',anchors,response:160,finish:height=>Math.max(220,height*.3),packLargestFirst:true});
  });
 }
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   if(!motion.matches)entry.target.animate([{transform:'translateY(14px)'},{transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.22,1,.36,1)'});
   observer.unobserve(entry.target);
  }),{threshold:.1});
  root.querySelectorAll('.lp-benefit,.lp-related-card,.lp-overview-card,.lp-specialist-grid>a').forEach(card=>observer.observe(card));
 }
})();
