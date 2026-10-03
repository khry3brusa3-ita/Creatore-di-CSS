(()=>{
  'use strict';
  function sync(){
    const p=window.CVB_PHASE3;
    const e=document.getElementById('cvbP3Editor');
    if(p&&e) p.code=e.value||'';
  }
  function boot(){
    const e=document.getElementById('cvbP3Editor');
    if(e && !e.dataset.persistBound){
      e.dataset.persistBound='1';
      e.addEventListener('input',sync);
      e.addEventListener('change',sync);
      sync();
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
  new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();
