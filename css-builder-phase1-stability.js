(()=>{
  'use strict';

  /*
     CSS Builder Phase 1 — stability patch
     Keeps visual-editor sections outside #controls so app.js can safely
     rerender the normal CSS property controls without deleting them.
  */
  const hostId='cvbVisualEditorsHost';
  const ensureHost=()=>{
    const controls=document.getElementById('controls');
    if(!controls) return null;
    let host=document.getElementById(hostId);
    if(!host){
      host=document.createElement('div');
      host.id=hostId;
      host.className='cvb-visual-editors-host';
      controls.parentElement?.appendChild(host);
    }
    return host;
  };

  const moveEditors=()=>{
    const controls=document.getElementById('controls');
    const host=ensureHost();
    if(!controls || !host) return;
    [...controls.children].filter(el=>el.classList.contains('visual-editor-section')).forEach(el=>host.appendChild(el));
  };

  const boot=()=>{
    const controls=document.getElementById('controls');
    const host=ensureHost();
    if(!controls || !host) return;
    moveEditors();
    if(!controls.__cvbVisualHostObserver){
      const observer=new MutationObserver(()=>moveEditors());
      observer.observe(controls,{childList:true});
      controls.__cvbVisualHostObserver=observer;
    }
  };

  const style=document.createElement('style');
  style.id='cvb-visual-host-style';
  style.textContent=`
    #${hostId}{display:grid;gap:9px;margin-top:0}
    #${hostId}>.visual-editor-section{margin:0;border-bottom:1px solid var(--border)}
    #veBoxModelStage{touch-action:none;overscroll-behavior:contain}
    #veFlex .ve-flex-stage,#veGrid .ve-grid-stage,#veClipPoints .ve-clip-stage,#veBezier .ve-bezier-stage,#veTransition .ve-transition-preview{overscroll-behavior:contain}
  `;
  document.head.appendChild(style);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.CVB_PHASE1_STABILITY={version:'1.0',hostId,moveEditors};
})();
