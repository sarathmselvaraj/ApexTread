
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

  function advancedTyreFilters(){
    const cards=$$('.tyre-product-card');
    if(!cards.length || !$('#apex-vehicle-filter')) return;

    const controls=['vehicle','size','brand','price','type'].reduce((o,k)=>(o[k]=$(`#apex-${k}-filter`),o),{});
    const search=$('#tyre-product-search');
    const tierBtns=$$('[data-tyre-tier-filter]');
    const count=$('[data-tyre-result-count]');
    const status=$('#tyre-search-status');
    const sort=$('#apex-sort-filter');
    const grid=$('[data-tyre-grid]');
    const reset=$('[data-reset-tyre-filters]');
    const clear=$('[data-tyre-search-clear]');
    const empty=$('[data-tyre-empty]');
    const originalOrder=cards.slice();
    let tier='all';

    function normalize(value){return String(value||'').trim().toLowerCase();}
    function priceOk(card,val){
      if(val==='all') return true;
      const p=Number(card.dataset.price||0);
      if(val==='under7000') return p<7000;
      if(val==='7000-9000') return p>=7000&&p<=9000;
      if(val==='over9000') return p>9000;
      return true;
    }
    function searchableText(card){
      return normalize([
        card.textContent,
        card.dataset.brand,
        card.dataset.size,
        card.dataset.tier,
        card.dataset.tyreType,
        card.dataset.vehicle
      ].join(' '));
    }
    function updateEmptyState(shown){
      if(!empty) return;
      empty.hidden=shown!==0;
      empty.classList.toggle('is-visible',shown===0);
      empty.setAttribute('aria-hidden',shown===0?'false':'true');
    }
    function updateStatus(shown){
      if(count) count.textContent=String(shown);
      if(status){
        status.innerHTML='<strong data-tyre-result-count>'+shown+'</strong>'+(shown===1?' tyre available':' tyres available');
      }
    }
    function sortCards(){
      if(!grid) return;
      const mode=sort?.value||'recommended';
      const ordered=originalOrder.slice();
      if(mode==='price-asc') ordered.sort((a,b)=>Number(a.dataset.price||0)-Number(b.dataset.price||0));
      else if(mode==='price-desc') ordered.sort((a,b)=>Number(b.dataset.price||0)-Number(a.dataset.price||0));
      else if(mode==='brand-asc') ordered.sort((a,b)=>normalize(a.dataset.brand).localeCompare(normalize(b.dataset.brand)));
      ordered.forEach(card=>grid.appendChild(card));
    }
    function run(){
      const q=normalize(search?.value);
      let shown=0;
      cards.forEach(card=>{
        const okTier=tier==='all'||normalize(card.dataset.tier)===tier;
        const selectedVehicle=normalize(controls.vehicle?.value||'all');
        const vehicles=normalize(card.dataset.vehicle).split(',').map(v=>v.trim()).filter(Boolean);
        const okVehicle=selectedVehicle==='all'||vehicles.includes(selectedVehicle);
        const selectedSize=controls.size?.value||'all';
        const okSize=selectedSize==='all'||String(card.dataset.size||'')===selectedSize;
        const selectedBrand=normalize(controls.brand?.value||'all');
        const okBrand=selectedBrand==='all'||normalize(card.dataset.brand)===selectedBrand;
        const selectedType=normalize(controls.type?.value||'all');
        const okType=selectedType==='all'||normalize(card.dataset.tyreType)===selectedType;
        const okPrice=priceOk(card,controls.price?.value||'all');
        const okQuery=!q||searchableText(card).includes(q);
        const visible=okTier&&okVehicle&&okSize&&okBrand&&okType&&okPrice&&okQuery;
        card.hidden=!visible;
        card.classList.toggle('tyre-search-hidden',!visible);
        card.setAttribute('aria-hidden',visible?'false':'true');
        if(visible) shown++;
      });
      sortCards();
      updateStatus(shown);
      updateEmptyState(shown);
      if(clear) clear.classList.toggle('is-visible',!!q);
    }
    function setTier(btn){
      tier=normalize(btn?.dataset.tyreTierFilter||'all')||'all';
      tierBtns.forEach(x=>{
        const on=x===btn;
        x.classList.toggle('active',on);
        x.setAttribute('aria-pressed',on?'true':'false');
      });
      run();
    }

    tierBtns.forEach(btn=>{
      btn.setAttribute('aria-pressed',btn.classList.contains('active')?'true':'false');
      btn.addEventListener('click',()=>setTier(btn));
    });
    Object.values(controls).forEach(control=>control&&control.addEventListener('change',run));
    if(search){
      search.addEventListener('input',run);
      search.addEventListener('search',run);
    }
    if(sort) sort.addEventListener('change',run);
    if(clear) clear.addEventListener('click',()=>{
      if(search){search.value=''; search.focus();}
      run();
    });
    if(reset) reset.addEventListener('click',()=>{
      Object.values(controls).forEach(control=>{if(control) control.value='all';});
      if(search) search.value='';
      if(sort) sort.value='recommended';
      tier='all';
      tierBtns.forEach(btn=>{
        const on=normalize(btn.dataset.tyreTierFilter||'all')==='all';
        btn.classList.toggle('active',on);
        btn.setAttribute('aria-pressed',on?'true':'false');
      });
      run();
    });

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
