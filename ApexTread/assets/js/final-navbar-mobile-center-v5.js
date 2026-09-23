(function(){
  'use strict';
  var root=document.documentElement;
  function syncDirectionLabels(){
    var current=root.getAttribute('dir')==='rtl'?'RTL':'LTR';
    var next=current==='RTL'?'LTR':'RTL';
    document.querySelectorAll('[data-toggle-dir]').forEach(function(btn){
      btn.querySelectorAll('.apex-action-icon').forEach(function(icon){icon.remove();});
      var label=btn.querySelector('.apex-action-label');
      if(!label){
        label=document.createElement('span');
        label.className='apex-action-label';
        btn.replaceChildren(label);
      }
      label.textContent=current;
      label.removeAttribute('aria-hidden');
      btn.dataset.currentDirection=current;
      btn.setAttribute('aria-label','Current direction '+current+'. Switch to '+next);
      btn.setAttribute('title','Current: '+current+' · Switch to '+next);
    });
  }
  function init(){
    syncDirectionLabels();
    var observer=new MutationObserver(function(records){
      if(records.some(function(r){return r.attributeName==='dir';})) syncDirectionLabels();
    });
    observer.observe(root,{attributes:true,attributeFilter:['dir']});
    document.addEventListener('click',function(e){
      if(e.target.closest('[data-toggle-dir]')){
        requestAnimationFrame(function(){setTimeout(syncDirectionLabels,0);});
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
