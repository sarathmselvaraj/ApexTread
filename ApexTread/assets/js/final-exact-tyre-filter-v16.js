(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const norm=v=>String(v||'').trim().toLowerCase();

  function initExactTyreFilter(){
    const grid=$('[data-tyre-grid]');
    const cards=$$('.tyre-product-card',grid||document);
    const brand=$('#apex-brand-filter');
    if(!grid||!cards.length||!brand) return;

    const search=$('#tyre-product-search');
    const vehicle=$('#apex-vehicle-filter');
    const size=$('#apex-size-filter');
    const price=$('#apex-price-filter');
    const type=$('#apex-type-filter');
    const sort=$('#apex-sort-filter');
    const tierButtons=$$('[data-tyre-tier-filter]');
    const reset=$('[data-reset-tyre-filters]');
    const clear=$('[data-tyre-search-clear]');
    const empty=$('[data-tyre-empty]');
    const status=$('#tyre-search-status');
    const original=cards.slice();

    function activeTier(){
      const active=tierButtons.find(b=>b.classList.contains('active'));
      return norm(active?.dataset.tyreTierFilter||'all')||'all';
    }
    function priceMatch(card,value){
      if(!value||value==='all') return true;
      const p=Number(card.dataset.price||0);
      if(value==='under7000') return p<7000;
      if(value==='7000-9000') return p>=7000&&p<=9000;
      if(value==='over9000') return p>9000;
      return true;
    }
    function searchText(card){
      return norm([
        card.dataset.brand,card.dataset.size,card.dataset.tier,
        card.dataset.tyreType,card.dataset.vehicle,card.textContent
      ].join(' '));
    }
    function applySort(){
      const mode=sort?.value||'recommended';
      const ordered=original.slice();
      if(mode==='price-asc') ordered.sort((a,b)=>Number(a.dataset.price||0)-Number(b.dataset.price||0));
      if(mode==='price-desc') ordered.sort((a,b)=>Number(b.dataset.price||0)-Number(a.dataset.price||0));
      if(mode==='brand-asc') ordered.sort((a,b)=>norm(a.dataset.brand).localeCompare(norm(b.dataset.brand)));
      ordered.forEach(card=>grid.appendChild(card));
    }
    function apply(){
      const selectedBrand=norm(brand.value||'all');
      const selectedTier=activeTier();
      const selectedVehicle=norm(vehicle?.value||'all');
      const selectedSize=String(size?.value||'all');
      const selectedType=norm(type?.value||'all');
      const selectedPrice=price?.value||'all';
      const query=norm(search?.value);
      let shown=0;

      cards.forEach(card=>{
        const cardBrand=norm(card.dataset.brand);
        const vehicles=norm(card.dataset.vehicle).split(',').map(v=>v.trim()).filter(Boolean);
        const visible=
          (selectedBrand==='all' || cardBrand===selectedBrand) &&
          (selectedTier==='all' || norm(card.dataset.tier)===selectedTier) &&
          (selectedVehicle==='all' || vehicles.includes(selectedVehicle)) &&
          (selectedSize==='all' || String(card.dataset.size||'')===selectedSize) &&
          (selectedType==='all' || norm(card.dataset.tyreType)===selectedType) &&
          priceMatch(card,selectedPrice) &&
          (!query || searchText(card).includes(query));

        card.hidden=!visible;
        card.classList.toggle('tyre-search-hidden',!visible);
        card.setAttribute('aria-hidden',visible?'false':'true');
        if(visible){
          card.style.removeProperty('display');
          shown++;
        }else{
          /* Inline !important is intentional: older theme layers force display:flex!important. */
          card.style.setProperty('display','none','important');
        }
      });

      applySort();
      if(status){
        const brandLabel=selectedBrand==='all'?'':` · ${brand.options[brand.selectedIndex]?.text||selectedBrand}`;
        status.innerHTML=`<strong data-tyre-result-count>${shown}</strong>${shown===1?' tyre available':' tyres available'}${brandLabel}`;
      }
      const count=$('[data-tyre-result-count]');
      if(count) count.textContent=String(shown);
      if(empty){
        empty.hidden=shown!==0;
        empty.classList.toggle('is-visible',shown===0);
        empty.setAttribute('aria-hidden',shown===0?'false':'true');
      }
      if(clear) clear.classList.toggle('is-visible',!!query);
    }
    function schedule(){
      queueMicrotask(apply);
      requestAnimationFrame(apply);
    }

    [brand,vehicle,size,price,type,sort].forEach(control=>control&&control.addEventListener('change',schedule));
    search&&search.addEventListener('input',schedule);
    search&&search.addEventListener('search',schedule);
    tierButtons.forEach(btn=>btn.addEventListener('click',schedule));
    reset&&reset.addEventListener('click',schedule);
    clear&&clear.addEventListener('click',schedule);

    /* Expose a tiny QA hook for deterministic filter verification. */
    window.ApexTreadTyreFilter={apply};
    apply();
  }

  document.addEventListener('DOMContentLoaded',initExactTyreFilter);
})();
