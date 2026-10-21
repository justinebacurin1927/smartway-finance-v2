(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const films=[];
  const ease='cubic-bezier(.22,1,.36,1)';
  class Film {
    constructor(root){
      this.root=root;this.duration=Number(root.dataset.duration);this.time=0;this.visible=false;this.wanted=true;this.ended=false;this.tracks=[];
      this.scenes=[...root.querySelectorAll('[data-scene]')];this.chapters=root.closest('#process')?.querySelectorAll('[data-film-chapter]')||[];
      root.classList.add('is-ready');
      this.scenes.forEach((scene,index)=>this.compose(scene,index));
      if(reduced.matches){this.time=this.duration-1800;this.wanted=false;}
      this.render();
    }
    track(element,frames,start,duration,options={}){
      if(!element)return;
      const animation=element.animate(frames,{duration,delay:start,easing:ease,fill:'both',...options});animation.pause();animation.currentTime=0;this.tracks.push(animation);
    }
    compose(scene,index){
      const at=Number(scene.dataset.start),find=s=>scene.querySelector(s);
      const track=(element,frames,start,duration,options)=>this.track(element,frames,at+(start-at)*4/3,duration*4/3,options);
      const final=index===this.scenes.length-1&&this.root.dataset.loop!=='true';
      track(scene,[{opacity:0,offset:0},{opacity:1,offset:.055},{opacity:1,offset:.935},{opacity:final?1:0,offset:1}],at,9000,{easing:'linear'});
      track(find('.film-camera'),[{transform:'translateX(0) scale(.975)'},{transform:'translateX(-5px) scale(1.025)'}],at,8200,{easing:'cubic-bezier(.2,.45,.3,1)'});
      track(find('.film-composer'),[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],at+100,600);
      track(find('.film-composer-text'),[{opacity:1,offset:0},{opacity:0,offset:.45},{opacity:0,offset:.75},{opacity:1,offset:1}],at+1800,750,{easing:'linear'});
      track(find('.film-send'),[{transform:'scale(1)'},{transform:'scale(.82)',offset:.4},{transform:'scale(1)'}],at+1750,400);
      const from=find('.film-composer').getBoundingClientRect(),to=find('.film-question').getBoundingClientRect();
      const dx=from.x+from.width/2-to.x-to.width/2,dy=from.y+from.height/2-to.y-to.height/2;
      track(find('.film-question'),[{opacity:0,transform:`translate(${dx}px,${dy}px) scale(${Math.min(1.15,from.width/to.width)},${Math.min(1,from.height/to.height)})`},{opacity:1,transform:'translate(0,0) scale(1,1)'}],at+1850,850);
      track(find('.film-thinking'),[{opacity:0,offset:0},{opacity:1,offset:.18},{opacity:1,offset:.8},{opacity:0,offset:1}],at+2650,850,{easing:'linear'});
      scene.querySelectorAll('.film-thinking i').forEach((dot,i)=>track(dot,[{transform:'translateY(0)',opacity:.4},{transform:'translateY(-4px)',opacity:1,offset:.45},{transform:'translateY(0)',opacity:.4}],at+2680+i*90,500,{iterations:2,easing:'ease-in-out'}));
      track(find('.film-answer'),[{opacity:0,transform:'translateY(22px)',clipPath:'inset(0 0 100% 0 round 15px)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0 0 round 0px)'}],at+3380,700);
      track(find('.film-object'),[{opacity:0,transform:'translateX(65px) translateY(20px) rotateY(-13deg) scale(.91)'},{opacity:1,transform:'translateX(0) translateY(0) rotateY(0) scale(1)'}],at+4750,1050);
      scene.querySelectorAll('.film-logo').forEach((logo,i)=>track(logo,[{opacity:0,transform:`translateX(${35+i*8}px)`},{opacity:1,transform:'translateX(0)'}],at+4900+i*110,850));
      scene.querySelectorAll('.film-task,.film-goal-line').forEach((row,i)=>track(row,[{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],at+5100+i*250,750));
      scene.querySelectorAll('.film-proof svg path').forEach((path,i)=>{
        const length=path.getTotalLength();path.style.strokeDasharray=String(length);
        track(path,[{strokeDashoffset:length},{strokeDashoffset:0}],at+5350+i*180,1000,{easing:'ease-in-out'});
      });
      track(find('.film-goal-photo'),[{clipPath:'inset(0 100% 0 0 round 10px)'},{clipPath:'inset(0 0 0 0 round 10px)'}],at+5000,1000);
      track(find('.film-goal-photo img'),[{transform:'scale(1.17)'},{transform:'scale(1)'}],at+5000,1800);
      track(find('.film-paper'),[{transform:'translateY(54px) rotateX(22deg)'},{transform:'translateY(-8px) rotateX(0)'}],at+5150,1300);
      scene.querySelectorAll('.film-settlement-route i').forEach((dot,i)=>track(dot,[{opacity:0,transform:'scale(.5)'},{opacity:1,transform:'scale(1)'}],at+5700+i*230,550));
    }
    get playing(){return this.wanted&&this.visible&&!document.hidden&&!reduced.matches&&!this.ended;}
    render(){
      this.tracks.forEach(animation=>animation.currentTime=this.time);
      this.scenes.forEach(scene=>{
        const local=(this.time-Number(scene.dataset.start))/(4/3),input=scene.querySelector('.film-composer-text'),reply=scene.querySelector('.film-reply');
        const prompt=input.dataset.copy,answer=reply.dataset.copy;
        const typed=local>=2350?'Message Smartway…':prompt.slice(0,Math.max(0,Math.min(prompt.length,Math.floor((local-350)/1450*prompt.length))));
        if(input.textContent!==typed)input.textContent=typed;
        const words=answer.split(' '),shown=words.slice(0,Math.max(0,Math.min(words.length,Math.ceil((local-3500)/1550*words.length)))).join(' ');
        if(reply.textContent!==shown)reply.textContent=shown;
      });
      const phase=Math.min(this.scenes.length-1,Math.floor(this.time/11500));
      this.chapters.forEach((chapter,i)=>chapter.dataset.active=String(i===phase));
      this.root.dataset.playing=String(this.playing);this.root.dataset.time=String(Math.round(this.time));this.root.dataset.chapter=String(phase);
    }
    advance(delta){
      this.time+=delta;
      if(this.time>=this.duration){
        if(this.root.dataset.loop==='true')this.time%=this.duration;
        else{this.time=this.duration;this.ended=true;this.wanted=false;}
      }
      this.render();
    }
  }
  let frame=null,last=0;
  function tick(now){
    frame=null;const delta=last?Math.min(80,now-last):0;last=now;
    films.forEach(film=>{if(film.playing)film.advance(delta);});
    if(films.some(f=>f.playing))frame=requestAnimationFrame(tick);else last=0;
  }
  function wake(){if(frame===null&&films.some(f=>f.playing)){last=0;frame=requestAnimationFrame(tick);}}
  document.querySelectorAll('[data-film]').forEach(root=>films.push(new Film(root)));
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    for(const entry of entries){const film=films.find(f=>f.root===entry.target);film.visible=entry.isIntersecting;film.render();}wake();
  },{threshold:.25}):null;
  films.forEach(f=>{if(observer)observer.observe(f.root);else f.visible=true;});
  document.addEventListener('visibilitychange',()=>{last=0;films.forEach(f=>f.render());wake();});
  reduced.addEventListener('change',()=>{
    films.forEach(f=>{if(reduced.matches){f.time=f.duration-1800;f.wanted=false;f.render();}});wake();
  });
  wake();
})();
