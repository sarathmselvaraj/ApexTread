(function(){
  function initBrandMarquee(){
    var track=document.querySelector('.home-brand-img-track');
    if(!track || track.dataset.marqueeReady==='true') return;
    var cards=Array.prototype.slice.call(track.querySelectorAll(':scope > .brand-img-card'));
    if(!cards.length) return;
    track.dataset.marqueeReady='true';
    track.classList.add('brand-marquee-viewport');
    var runner=document.createElement('div');
    runner.className='brand-marquee-runner';
    var setA=document.createElement('div');
    setA.className='brand-marquee-set';
    cards.forEach(function(card){ setA.appendChild(card); });
    var setB=setA.cloneNode(true);
    setB.setAttribute('aria-hidden','true');
    Array.prototype.forEach.call(setB.querySelectorAll('a,button,input,select,textarea,[tabindex]'),function(el){el.setAttribute('tabindex','-1');});
    runner.appendChild(setA);
    runner.appendChild(setB);
    track.appendChild(runner);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initBrandMarquee,{once:true});
  else initBrandMarquee();
})();
