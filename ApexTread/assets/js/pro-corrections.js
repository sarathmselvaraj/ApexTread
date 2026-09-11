
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

  function advancedTyreFilters(){
    const cards=$$('.tyre-product-card');
    if(!cards.length || !$('#apex-vehicle-filter')) return;
    const controls=['vehicle','size','brand','price','type'].reduce((o,k)=>(o[k]=$(`#apex-${k}-filter`),o),{});
    const search=$('#tyre-product-search'), tierBtns=$$('[data-tyre-tier-filter]'), count=$('[data-tyre-result-count]'), status=$('#tyre-search-status'), sort=$('#apex-sort-filter'), grid=$('[data-tyre-grid]');
    let tier='all';
    tierBtns.forEach(b=>b.addEventListener('click',()=>{tier=b.dataset.tyreTierFilter||'all';tierBtns.forEach(x=>x.classList.toggle('active',x===b));run();}));
    Object.values(controls).forEach(c=>c&&c.addEventListener('change',run));
    if(search) search.addEventListener('input',run);
    if(sort) sort.addEventListener('change',run);
    const reset=$('[data-reset-tyre-filters]');
    if(reset) reset.addEventListener('click',()=>{Object.values(controls).forEach(c=>{if(c)c.value='all'}); if(search)search.value=''; if(sort)sort.value='recommended'; tier='all'; tierBtns.forEach(b=>b.classList.toggle('active',(b.dataset.tyreTierFilter||'all')==='all')); run();});
    function priceOk(card,val){if(val==='all')return true;const p=Number(card.dataset.price||0);if(val==='under7000')return p<7000;if(val==='7000-9000')return p>=7000&&p<=9000;if(val==='over9000')return p>9000;return true}
    function run(){
      const q=(search?.value||'').trim().toLowerCase(); let shown=0;
      cards.forEach(card=>{
        const okTier=tier==='all'||card.dataset.tier===tier;
        const okVehicle=!controls.vehicle||controls.vehicle.value==='all'||(card.dataset.vehicle||'').split(',').includes(controls.vehicle.value);
        const okSize=!controls.size||controls.size.value==='all'||card.dataset.size===controls.size.value;
        const okBrand=!controls.brand||controls.brand.value==='all'||card.dataset.brand===controls.brand.value;
        const okType=!controls.type||controls.type.value==='all'||card.dataset.tyreType===controls.type.value;
        const okPrice=!controls.price||priceOk(card,controls.price.value);
        const okQ=!q||card.textContent.toLowerCase().includes(q);
        const ok=okTier&&okVehicle&&okSize&&okBrand&&okType&&okPrice&&okQ;
        card.hidden=!ok;card.classList.toggle('tyre-search-hidden',!ok); if(ok)shown++;
      });
      if(count)count.textContent=String(shown);
      if(status) status.innerHTML='<strong data-tyre-result-count>'+shown+'</strong>'+(shown===1?' tyre available':' tyres available');
      if(grid && sort){const ordered=cards.slice(), mode=sort.value; if(mode==='price-asc')ordered.sort((a,b)=>Number(a.dataset.price||0)-Number(b.dataset.price||0)); else if(mode==='price-desc')ordered.sort((a,b)=>Number(b.dataset.price||0)-Number(a.dataset.price||0)); else if(mode==='brand-asc')ordered.sort((a,b)=>(a.dataset.brand||'').localeCompare(b.dataset.brand||'')); ordered.forEach(c=>grid.appendChild(c));}
    }
    run();
  }

  function purchaseModal(){
    document.addEventListener('click',e=>{
      const btn=e.target.closest('[data-tyre-purchase]'); if(!btn)return;
      e.preventDefault();
      const name=btn.dataset.tyrePurchase||'Selected tyre', size=btn.dataset.tyreSize||'';
      const old=$('#tyre-purchase-modal'); if(old)old.remove();
      const wrap=document.createElement('div'); wrap.id='tyre-purchase-modal'; wrap.className='booking-overlay';
      wrap.innerHTML=`<div class="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="tyre-purchase-title"><button class="booking-x" type="button" data-close-tyre-purchase aria-label="Close">×</button><span class="booking-eyebrow">Tyre purchase enquiry</span><h2 id="tyre-purchase-title">Reserve ${esc(name)}</h2><p class="booking-intro">Confirm fitment availability and fitted price before visiting the workshop.</p><form id="tyre-purchase-form"><div class="booking-grid"><label class="booking-full">Tyre<input class="form-input" name="tyre" value="${esc(name)}" readonly></label><label>Size<input class="form-input" name="size" value="${esc(size)}" readonly></label><label>Quantity<select class="form-input" name="qty"><option>1</option><option>2</option><option>4</option></select></label><label>Full name<input class="form-input" name="name" required autocomplete="name"></label><label>Phone<input class="form-input" name="phone" required autocomplete="tel"></label><label>Email<input class="form-input" type="email" name="email" required autocomplete="email"></label><label>Vehicle<input class="form-input" name="vehicle" placeholder="Car / SUV / bike model" required></label><label>Preferred fitting date<input class="form-input" type="date" name="date" required></label><label class="booking-full">Notes<textarea class="form-input" name="notes" rows="3" placeholder="Variant, registration or other requirements"></textarea></label></div><div class="booking-actions"><button class="btn-primary" type="submit">Continue to secure checkout</button><button class="btn-ghost" type="button" data-close-tyre-purchase>Cancel</button></div><div id="tyre-purchase-status"></div></form></div>`;
      document.body.appendChild(wrap); document.body.classList.add('modal-open');
      const f=$('#tyre-purchase-form'); f.elements.date.min=new Date().toISOString().slice(0,10);
      f.addEventListener('submit',ev=>{ev.preventDefault(); if(!f.checkValidity()){f.reportValidity();return;} const data=Object.fromEntries(new FormData(f)); try{sessionStorage.setItem('at-checkout-item',JSON.stringify({name,size,qty:Number(data.qty||1),customer:{name:data.name,email:data.email,phone:data.phone,vehicle:data.vehicle},preferredDate:data.date,notes:data.notes||''}))}catch(_){} location.href='checkout.html';});
    });
    document.addEventListener('click',e=>{if(e.target.closest('[data-close-tyre-purchase]')||e.target.id==='tyre-purchase-modal'){const m=$('#tyre-purchase-modal');if(m)m.remove();document.body.classList.remove('modal-open')}});
  }

  function cleanNavIcons(){
    $$('.apex-main-nav .apex-nav-icon,.apex-mobile-nav .nav-link>.apex-nav-icon,.nav-home>summary>.apex-nav-icon').forEach(x=>x.remove());
    const obs=new MutationObserver(()=>$$('.apex-main-nav .apex-nav-icon,.apex-mobile-nav .nav-link>.apex-nav-icon,.nav-home>summary>.apex-nav-icon').forEach(x=>x.remove()));
    obs.observe(document.documentElement,{subtree:true,childList:true});
  }

  document.addEventListener('DOMContentLoaded',()=>{cleanNavIcons();advancedTyreFilters();purchaseModal();});
})();
