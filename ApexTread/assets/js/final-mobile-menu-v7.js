(function(){
  'use strict';
  var root=document.documentElement;
  var body=document.body;
  var MENU_BP=1200;
  var menu=document.querySelector('[data-toggle-menu]');
  var nav=document.getElementById('mobile-nav');
  if(!menu||!nav)return;

  /* The drawer must be a body child so no sticky/header stacking context can dim it. */
  if(nav.parentElement!==body) body.appendChild(nav);

  var backdrop=document.querySelector(':scope > .mobile-menu-backdrop');
  if(!backdrop){
    backdrop=document.createElement('div');
    backdrop.className='mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    body.appendChild(backdrop);
  }

  var menuIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>';
  var closeIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
  var dirIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 7h11"></path><path d="m15 4 3 3-3 3"></path><path d="M17 17H6"></path><path d="m9 14-3 3 3 3"></path></svg>';
  var moonIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5z"></path></svg>';
  var sunIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>';

  function iconHost(btn){
    var host=btn.querySelector('.apex-action-icon');
    if(!host){host=document.createElement('span');host.className='apex-action-icon';btn.prepend(host);}
    return host;
  }
  function labelHost(btn){
    var label=btn.querySelector('.apex-action-label');
    if(!label){label=document.createElement('span');label.className='apex-action-label';btn.appendChild(label);}
    return label;
  }
  function syncControls(){
    var currentDir=root.getAttribute('dir')==='rtl'?'RTL':'LTR';
    var nextDir=currentDir==='RTL'?'LTR':'RTL';
    document.querySelectorAll('[data-toggle-dir]').forEach(function(btn){
      iconHost(btn).innerHTML=dirIcon;
      var label=labelHost(btn);
      label.textContent=btn.closest('#mobile-nav')?('Direction · '+currentDir):currentDir;
      btn.dataset.currentDirection=currentDir;
      btn.setAttribute('aria-label','Current direction '+currentDir+'. Switch to '+nextDir);
      btn.setAttribute('title','Current direction: '+currentDir+' · switch to '+nextDir);
    });
    var dark=root.getAttribute('data-theme')==='dark';
    document.querySelectorAll('[data-toggle-theme]').forEach(function(btn){
      iconHost(btn).innerHTML=dark?sunIcon:moonIcon;
      var label=labelHost(btn);
      label.textContent=btn.closest('#mobile-nav')?(dark?'Light mode':'Dark mode'):(dark?'Light':'Dark');
      btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
      btn.setAttribute('title',dark?'Switch to light mode':'Switch to dark mode');
    });
  }
  function setMenuIcon(open){
    var host=iconHost(menu);host.innerHTML=open?closeIcon:menuIcon;
  }
  function isOpen(){return nav.classList.contains('is-open')&&!nav.classList.contains('hidden');}
  function applyOpen(open,focusClose){
    if(window.innerWidth>=MENU_BP) open=false;
    nav.classList.toggle('hidden',!open);
    nav.classList.toggle('is-open',open);
    nav.setAttribute('aria-hidden',open?'false':'true');
    body.classList.toggle('menu-open',open);
    backdrop.setAttribute('aria-hidden',open?'false':'true');
    menu.classList.toggle('active',open);
    menu.setAttribute('aria-expanded',open?'true':'false');
    menu.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
    menu.setAttribute('title',open?'Close menu':'Open menu');
    setMenuIcon(open);
    if(open&&focusClose){
      var close=nav.querySelector('[data-close-drawer]');
      if(close) setTimeout(function(){close.focus({preventScroll:true});},30);
    }
  }

  /* Direct handlers run before the legacy document-level listeners. */
  menu.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    applyOpen(!isOpen(),true);
  });
  nav.querySelectorAll('[data-close-drawer]').forEach(function(btn){
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();applyOpen(false);menu.focus({preventScroll:true});});
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){applyOpen(false);});
  });
  backdrop.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();applyOpen(false);});

  /* Keep the mobile Home <details> local and reliable. */
  nav.querySelectorAll('.apex-mobile-home > summary').forEach(function(summary){
    summary.addEventListener('click',function(e){e.stopPropagation();});
  });

  /* Theme and direction controls need visible state after legacy handlers run. */
  document.querySelectorAll('[data-toggle-dir],[data-toggle-theme]').forEach(function(btn){
    btn.addEventListener('click',function(){setTimeout(syncControls,0);});
  });

  window.addEventListener('resize',function(){if(window.innerWidth>=MENU_BP)applyOpen(false);},{passive:true});
  window.addEventListener('orientationchange',function(){setTimeout(function(){if(window.innerWidth>=MENU_BP)applyOpen(false);},80);},{passive:true});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen()){e.preventDefault();applyOpen(false);menu.focus({preventScroll:true});}});

  new MutationObserver(function(records){
    if(records.some(function(r){return r.attributeName==='dir'||r.attributeName==='data-theme';}))syncControls();
  }).observe(root,{attributes:true,attributeFilter:['dir','data-theme']});

  syncControls();
  applyOpen(false);
})();
