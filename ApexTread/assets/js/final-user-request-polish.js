
(function(){
  'use strict';
  const root=document.documentElement;
  function syncDirButtons(){document.querySelectorAll('[data-set-dir]').forEach(b=>b.classList.toggle('is-active',(root.getAttribute('dir')||'ltr')===b.dataset.setDir));}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-set-dir]');if(!b)return;e.preventDefault();const dir=b.dataset.setDir==='rtl'?'rtl':'ltr';root.setAttribute('dir',dir);try{localStorage.setItem('at-dir',dir)}catch(_){}syncDirButtons();});
  const observer=new MutationObserver(m=>{if(m.some(x=>x.attributeName==='dir'))syncDirButtons()});observer.observe(root,{attributes:true});syncDirButtons();

  // Robust service search + category filter. Works independently from earlier filter code.
  const search=document.getElementById('service-search');
  const cards=[...document.querySelectorAll('[data-service-card]')];
  if(search&&cards.length){
    const buttons=[...document.querySelectorAll('[data-service-filter]')];
    const catalogue=document.querySelector('.service-catalogue');
    let active=(buttons.find(b=>b.classList.contains('active'))||{}).dataset?.serviceFilter||'all';
    let feedback=document.querySelector('.service-search-feedback');
    if(!feedback){feedback=document.createElement('p');feedback.className='service-search-feedback';feedback.setAttribute('aria-live','polite');search.closest('.filter-panel, .service-filter-panel, div')?.appendChild(feedback);}
    let empty=document.querySelector('.service-no-results');
    if(!empty){empty=document.createElement('div');empty.className='service-no-results hidden';empty.innerHTML='<strong>No matching service found.</strong><br><span>Try another keyword or choose All services.</span>';cards[0].parentElement?.appendChild(empty);}
    function apply(){
      const q=search.value.trim().toLowerCase();let visible=0;
      cards.forEach(card=>{const category=(card.dataset.category||'').toLowerCase();const hay=(card.textContent+' '+category).toLowerCase();const ok=(active==='all'||category===active)&&(!q||hay.includes(q));card.classList.toggle('hidden',!ok);card.classList.toggle('is-filtered-out',!ok);card.hidden=!ok;card.setAttribute('aria-hidden',ok?'false':'true');if(ok){card.style.removeProperty('display');visible++;}else{card.style.setProperty('display','none','important');}});
      feedback.innerHTML='<strong>'+visible+'</strong> service'+(visible===1?'':'s')+' found'+(q?' for “'+search.value.trim().replace(/[<>]/g,'')+'”':'')+'.';
      empty.classList.toggle('hidden',visible!==0);
    }
    buttons.forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.serviceFilter||'all';buttons.forEach(x=>x.classList.toggle('active',x===btn));apply();}));
    search.addEventListener('input',apply);search.addEventListener('search',apply);apply();
  }
})();
