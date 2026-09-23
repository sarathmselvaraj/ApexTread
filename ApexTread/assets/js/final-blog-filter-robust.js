(function(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    if((document.body && document.body.dataset.pageName)!=='blog') return;
    const grid=document.getElementById('blog-grid');
    const panel=document.getElementById('blog-filter-panel');
    const search=document.getElementById('blog-search');
    if(!grid||!panel) return;
    const buttons=Array.from(panel.querySelectorAll('[data-blog-filter]'));
    if(!buttons.length) return;
    let active=(buttons.find(b=>b.classList.contains('active'))?.dataset.blogFilter||'all').trim().toLowerCase();
    let status=document.getElementById('blog-filter-status');
    if(!status){
      status=document.createElement('p');
      status.id='blog-filter-status';
      status.className='blog-filter-status';
      status.setAttribute('aria-live','polite');
      panel.appendChild(status);
    }
    let empty=document.getElementById('blog-filter-empty');
    if(!empty){
      empty=document.createElement('div');
      empty.id='blog-filter-empty';
      empty.className='blog-filter-empty';
      empty.textContent='No articles match the selected filter. Try All or clear the search.';
      grid.insertAdjacentElement('afterend',empty);
    }
    function cards(){ return Array.from(grid.querySelectorAll('[data-blog-card]')); }
    function apply(){
      const q=(search?.value||'').trim().toLowerCase();
      let shown=0;
      cards().forEach(card=>{
        const cat=(card.dataset.category||'').trim().toLowerCase();
        const text=(card.textContent||'').toLowerCase();
        const visible=(active==='all'||cat===active)&&(!q||text.includes(q));
        card.hidden=!visible;
        card.classList.toggle('hidden',!visible);
        card.setAttribute('aria-hidden',visible?'false':'true');
        card.style.display=visible?'':'none';
        if(visible) shown++;
      });
      status.textContent=shown+' article'+(shown===1?'':'s')+' shown';
      empty.hidden=shown!==0;
      empty.style.display=shown===0?'block':'none';
    }
    panel.addEventListener('click',function(e){
      const btn=e.target.closest('[data-blog-filter]');
      if(!btn) return;
      active=(btn.dataset.blogFilter||'all').trim().toLowerCase();
      buttons.forEach(b=>{
        const on=b===btn;
        b.classList.toggle('active',on);
        b.setAttribute('aria-pressed',on?'true':'false');
      });
      requestAnimationFrame(apply);
    });
    if(search){
      search.addEventListener('input',apply);
      search.addEventListener('search',apply);
    }
    /* main.js renders cards during deferred execution; run now and once after the stack settles. */
    apply();
    setTimeout(apply,0);
  });
})();
