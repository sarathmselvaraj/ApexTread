(function(){
  'use strict';
  var root=document.documentElement;
  var dirSvg='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 7h11"></path><path d="m15 4 3 3-3 3"></path><path d="M17 17H6"></path><path d="m9 14-3 3 3 3"></path></svg>';
  function syncDirection(){
    var current=root.getAttribute('dir')==='rtl'?'RTL':'LTR';
    var next=current==='RTL'?'LTR':'RTL';
    document.querySelectorAll('[data-toggle-dir]').forEach(function(btn){
      var isMobile=btn.classList.contains('apex-mobile-setting-btn');
      var icon=btn.querySelector('.apex-action-icon');
      if(!icon){ icon=document.createElement('span'); icon.className='apex-action-icon'; btn.prepend(icon); }
      icon.innerHTML=dirSvg;
      var label=btn.querySelector('.apex-action-label');
      if(!label){ label=document.createElement('span'); label.className='apex-action-label'; btn.appendChild(label); }
      label.textContent=isMobile?current:'Direction '+current;
      btn.dataset.currentDirection=current;
      btn.setAttribute('aria-label','Current direction '+current+'. Switch to '+next);
      btn.setAttribute('title','Current: '+current+' · Switch to '+next);
    });
  }
  function mobileGuard(){
    var menu=document.querySelector('[data-toggle-menu]');
    var nav=document.getElementById('mobile-nav');
    if(!menu||!nav)return;
    function normalize(){
      var open=nav.classList.contains('is-open')&&!nav.classList.contains('hidden');
      menu.setAttribute('aria-expanded',open?'true':'false');
      nav.setAttribute('aria-hidden',open?'false':'true');
      document.body.classList.toggle('menu-open',open);
    }
    document.addEventListener('click',function(e){
      if(e.target.closest('#mobile-nav a')) requestAnimationFrame(normalize);
      if(e.target.closest('[data-close-drawer]')) requestAnimationFrame(normalize);
      if(e.target.closest('[data-toggle-menu]')) requestAnimationFrame(function(){setTimeout(normalize,0)});
    });
    window.addEventListener('resize',function(){ if(innerWidth>=1200){ nav.classList.add('hidden');nav.classList.remove('is-open');normalize(); }},{passive:true});
    normalize();
  }
  function init(){
    syncDirection();
    mobileGuard();
    new MutationObserver(function(m){if(m.some(function(x){return x.attributeName==='dir'}))syncDirection();}).observe(root,{attributes:true,attributeFilter:['dir']});
    document.addEventListener('click',function(e){if(e.target.closest('[data-toggle-dir]')||e.target.closest('[data-toggle-theme]'))requestAnimationFrame(function(){setTimeout(syncDirection,0)})});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
