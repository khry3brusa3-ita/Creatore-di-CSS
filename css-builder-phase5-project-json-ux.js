(()=>{
  'use strict';
  const api=()=>window.CVB_CORE_API||{};
  const P3=()=>window.CVB_PHASE3||{};
  let wired=false;

  function syncCodeToState(){
    const editor=document.getElementById('cvbP3Editor');
    if(editor && window.CVB_PHASE3) window.CVB_PHASE3.code=editor.value||'';
  }

  function syncEditorFromState(){
    const editor=document.getElementById('cvbP3Editor');
    if(editor && window.CVB_PHASE3 && typeof window.CVB_PHASE3.code==='string' && editor.value!==window.CVB_PHASE3.code){
      editor.value=window.CVB_PHASE3.code;
    }
  }

  function moveProjectActionsTop(){
    const section=document.getElementById('cvbPhase5');
    const header=document.querySelector('.header-actions');
    const actions=section?.querySelector('.cvb-p5-actions');
    if(!section||!header||!actions||actions.dataset.movedTop==='1') return false;
    actions.dataset.movedTop='1';
    header.insertBefore(actions, header.firstElementChild);
    const status=section.querySelector('#cvbP5Status');
    if(status){
      status.classList.add('cvb-p5-top-status');
      header.insertBefore(status, actions.nextSibling);
    }
    section.classList.add('cvb-p5-secondary');
    return true;
  }

  function patchProjectLoad(){
    const core=api();
    if(!core.loadProjectSnapshot || core.loadProjectSnapshot.__phase5uxWrapped) return false;
    const original=core.loadProjectSnapshot;
    const wrapped=function(data){
      syncCodeToState();
      const result=original(data);
      setTimeout(()=>{
        syncEditorFromState();
        window.CVB_PHASE3?.render?.();
        syncEditorFromState();
      },30);
      return result;
    };
    wrapped.__phase5uxWrapped=true;
    core.loadProjectSnapshot=wrapped;
    return true;
  }

  function patchProjectSnapshot(){
    const core=api();
    if(!core.projectSnapshot || core.projectSnapshot.__phase5uxWrapped) return false;
    const original=core.projectSnapshot;
    const wrapped=function(){
      syncCodeToState();
      const data=original();
      if(data && data.phase3 && window.CVB_PHASE3){
        data.phase3.code=window.CVB_PHASE3.code||'';
      }
      return data;
    };
    wrapped.__phase5uxWrapped=true;
    core.projectSnapshot=wrapped;
    core.exportProjectSnapshot=wrapped;
    return true;
  }

  function install(){
    const editor=document.getElementById('cvbP3Editor');
    if(editor && !wired){
      wired=true;
      editor.addEventListener('input',syncCodeToState);
      editor.addEventListener('change',syncCodeToState);
    }
    moveProjectActionsTop();
    patchProjectLoad();
    patchProjectSnapshot();
  }

  function boot(){
    install();
    const observer=new MutationObserver(()=>install());
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>{
      syncCodeToState();
      patchProjectLoad();
      patchProjectSnapshot();
      moveProjectActionsTop();
    },100);
    setTimeout(()=>observer.disconnect(),10000);
  }

  document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`
    .header-actions{position:relative}
    .header-actions .cvb-p5-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:0}
    .header-actions .cvb-p5-file{display:inline-flex;align-items:center;white-space:nowrap}
    .cvb-p5-top-status{font-size:10px;color:var(--muted);white-space:nowrap;margin-left:2px}
    .cvb-p5-secondary{padding-top:10px}
    .cvb-p5-secondary .cvb-p5-actions{display:none!important}
    @media(max-width:900px){.header-actions .cvb-p5-actions{width:100%;order:3}.cvb-p5-top-status{order:4}.header-actions{width:100%}}
  `}));

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
