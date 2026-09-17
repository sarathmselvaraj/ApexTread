(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function getSession(){
    for(const store of [localStorage,sessionStorage]){
      try{const raw=store.getItem('at-session'); if(raw){const s=JSON.parse(raw); if(s&&s.email)return s;}}catch(_){ }
    }
    return null;
  }
  function syncAuth(){
    const s=getSession();
    $$('[data-auth-guest]').forEach(el=>{el.hidden=!!s;el.classList.toggle('hidden',!!s);});
    $$('[data-auth-user]').forEach(el=>{el.hidden=!s;el.classList.toggle('hidden',!s);});
    $$('.apex-mobile-nav-inner').forEach(inner=>{
      let user=$('.apex-mobile-user',inner);
      if(!user){
        user=document.createElement('div');
        user.className='apex-mobile-user hidden';
        user.setAttribute('data-mobile-auth-user','');
        const guest=$('.apex-mobile-auth',inner);
        if(guest)guest.insertAdjacentElement('afterend',user); else inner.prepend(user);
      }
      user.hidden=!s; user.classList.toggle('hidden',!s);
      if(s){
        const name=((s.first||'Driver')+' '+(s.last||'')).trim();
        user.innerHTML='<span class="apex-mobile-user-avatar">'+String(s.first||'D').charAt(0).toUpperCase()+'</span><span class="apex-mobile-user-copy"><strong>'+name.replace(/[<>&]/g,'')+'</strong><small>'+String(s.email||'').replace(/[<>&]/g,'')+'</small></span><span class="apex-mobile-user-actions"><a href="profile.html">Profile</a><button type="button" data-logout>Sign out</button></span>';
      }
    });
  }

  function blogFilterFix(){
    const grid=$('#blog-grid'), buttons=$$('[data-blog-filter]'), search=$('#blog-search');
    if(!grid||!buttons.length)return;
    let category=(buttons.find(b=>b.classList.contains('active'))?.dataset.blogFilter||'all').toLowerCase();
    let status=$('#blog-filter-status');
    if(!status){status=document.createElement('p');status.id='blog-filter-status';status.className='blog-filter-status';status.setAttribute('aria-live','polite');$('#blog-filter-panel')?.appendChild(status);}
    let empty=$('#blog-filter-empty');
    if(!empty){empty=document.createElement('div');empty.id='blog-filter-empty';empty.className='blog-filter-empty';empty.hidden=true;empty.textContent='No articles match these filters. Try All or clear the search.';grid.insertAdjacentElement('afterend',empty);}
    function run(){
      const q=(search?.value||'').trim().toLowerCase();
      const cards=$$('[data-blog-card]',grid); let shown=0;
      cards.forEach(card=>{
        const cardCat=(card.dataset.category||'').trim().toLowerCase();
        const matchCategory=category==='all'||cardCat===category;
        const matchSearch=!q||card.textContent.toLowerCase().includes(q);
        const show=matchCategory&&matchSearch;
        card.hidden=!show; card.classList.toggle('hidden',!show); card.setAttribute('aria-hidden',show?'false':'true');
        if(show)shown++;
      });
      if(status)status.textContent=shown+' article'+(shown===1?'':'s')+' shown';
      if(empty){empty.hidden=shown!==0;empty.classList.toggle('hidden',shown!==0);}
    }
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      category=(btn.dataset.blogFilter||'all').toLowerCase();
      buttons.forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false');});
      run();
    }));
    search?.addEventListener('input',run);
    search?.addEventListener('search',run);
    run();
  }

  syncAuth();
  blogFilterFix();
  window.addEventListener('pageshow',syncAuth);
  window.addEventListener('storage',syncAuth);
})();
