(()=>{
  'use strict';
  const VBVE = window.CVB_VISUAL_EDITORS = window.CVB_VISUAL_EDITORS || {
    version:'2.19',
    state:{
      transform:{x:0,y:0,z:0,rx:0,ry:0,rz:0,sx:1,sy:1,skx:0,sky:0,perspective:0},
      shadow:{x:0,y:8,blur:20,spread:0,color:'#000000',alpha:0.20,inset:false}
    }
  };
  VBVE.version='2.19';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
  function emit(type,css){document.dispatchEvent(new CustomEvent('cvb:visual-editor-change',{detail:{type,css,state:VBVE.state}}));}
  function emitVisual(property,css,state){emit(property,css,state);}
  function copyOutput(root,e){
    const b=e.target.closest('[data-ve-copy]');
    if(!b || !root.contains(b)) return false;
    const el=$(b.dataset.veCopy);
    navigator.clipboard?.writeText(el?.textContent||'');
    b.textContent='Copiato';
    setTimeout(()=>b.textContent='Copia',800);
    return true;
  }
  VBVE.ready=fn=>{
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  };
  function selectedTarget(){
    const el=$('controlSelector');
    const value=el?.textContent?.trim();
    return value && value!=='—' ? value : null;
  }
  function core(){return window.CVB_CORE_API||null;}
  function setCoreProperty(selector,key,value){
    const api=core();
    if(!api?.setProperty || !selector || !key) return false;
    api.setProperty(selector,key,String(value??''),true,false);
    api.renderControls?.();
    return true;
  }
  function applyDeclarations(css){
    const selector=selectedTarget();
    if(!selector) return;
    const api=core();
    if(!api?.setProperty) return;
    const declarations=[];
    String(css||'').split(/\n+/).forEach(line=>{
      const m=line.match(/^\s*([\w-]+):\s*(.*?)\s*;?\s*$/);
      if(m) declarations.push([m[1],m[2]]);
    });
    for(const [key,value] of declarations) api.setProperty(selector,key,value,true,false);
    api.renderControls?.();
    api.updateCssAndPreview?.();
  }
  function applyVisualEvent(detail){
    const type=detail?.type;
    if(!type) return;
    if(type==='box-model'||type==='flex'||type==='grid') applyDeclarations(detail.css);
    else if(type==='clip-path') setCoreProperty(selectedTarget(), 'clip-path', String(detail.css||'').replace(/^clip-path:\s*/i,''));
    else if(type==='transition') setCoreProperty(selectedTarget(), 'transition', String(detail.css||'').replace(/^transition:\s*/i,''));
    else if(type==='cubic-bezier') VBVE.lastBezier=String(detail.css||'');
    const status=$('previewStatus');
    if(status){
      const labels={'box-model':'Box Model','flex':'Flexbox','grid':'Grid','clip-path':'Clip Path','transition':'Transition','cubic-bezier':'Cubic Bezier'};
      const sel=selectedTarget();
      status.textContent=sel?`${labels[type]||type} · applicato a ${sel}`:`${labels[type]||type}`;
    }
  }
  document.addEventListener('cvb:visual-editor-change',e=>applyVisualEvent(e.detail));
  function ensureExtraVisualStyle(){
    if($('cvb-extra-ve-style')) return;
    const st=document.createElement('style');st.id='cvb-extra-ve-style';
    st.textContent=`
      .ve-boxmodel-stage,.ve-flex-stage,.ve-grid-stage,.ve-clip-stage,.ve-bezier-stage{position:relative;margin:10px 0;border:1px solid var(--border);border-radius:10px;background:#0f141d;overflow:hidden}
      .ve-boxmodel-stage{height:310px;display:grid;place-items:center}
      .ve-boxmodel-layer{position:relative;display:grid;place-items:center;text-align:center;font:700 10px ui-monospace,monospace;color:#dbe7ff}
      .ve-boxmodel-margin{width:310px;height:230px;padding:38px;background:repeating-linear-gradient(45deg,rgba(255,180,90,.08) 0 8px,rgba(255,180,90,.14) 8px 16px);border:1px dashed rgba(255,180,90,.5)}
      .ve-boxmodel-border{width:230px;height:170px;padding:24px;background:rgba(127,127,127,.08);border:8px solid rgba(110,168,255,.55)}
      .ve-boxmodel-padding{width:170px;height:115px;padding:18px;background:rgba(79,211,139,.10);border:1px dashed rgba(79,211,139,.6)}
      .ve-boxmodel-content{width:125px;height:62px;display:grid;place-items:center;background:rgba(156,124,255,.16);border:1px solid rgba(156,124,255,.7);border-radius:7px}
      .ve-boxmodel-label{position:absolute;left:8px;top:8px;font-size:9px;color:var(--muted)}
      .ve-bm-handle{position:absolute;width:13px;height:13px;border:2px solid #fff;border-radius:50%;background:var(--accent);transform:translate(-50%,-50%);z-index:4;cursor:grab;touch-action:none;box-shadow:0 2px 8px rgba(0,0,0,.35)}
      .ve-bm-handle[data-bm-group="margin"]{background:#e8a45e}.ve-bm-handle[data-bm-group="padding"]{background:#4fd38b}
      .ve-bm-handle:active{cursor:grabbing}
      .ve-quad-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .ve-flex-stage{min-height:240px;padding:18px;display:flex;align-items:center;justify-content:center}
      .ve-flex-container{width:100%;min-height:160px;display:flex;gap:12px;padding:14px;border:1px dashed var(--border);border-radius:10px;background:rgba(127,127,127,.035);transition:.15s}
      .ve-flex-item{min-width:62px;min-height:54px;display:grid;place-items:center;border:1px solid var(--accent);border-radius:8px;background:rgba(110,168,255,.14);font-size:10px;cursor:grab;user-select:none;transition:transform .12s,opacity .12s}.ve-flex-item:active{cursor:grabbing}.ve-flex-item.active{outline:2px solid var(--accent-2);outline-offset:2px;opacity:.65}
      .ve-grid-stage{min-height:300px;padding:18px;display:grid;place-items:center}.ve-grid-canvas{width:100%;min-height:220px;display:grid;gap:6px;padding:8px;border:1px dashed var(--border);background:rgba(127,127,127,.035);position:relative}.ve-grid-cell{min-height:54px;display:grid;place-items:center;border:1px dashed rgba(110,168,255,.55);border-radius:6px;background:rgba(110,168,255,.08);font-size:9px;color:#b9c7df;cursor:pointer}.ve-grid-cell.active{background:rgba(156,124,255,.18);border-color:var(--accent-2)}
      .ve-grid-divider{position:absolute;z-index:6;background:rgba(255,255,255,.72);box-shadow:0 0 0 1px rgba(110,168,255,.18);touch-action:none}.ve-grid-divider.col{top:0;bottom:0;width:5px;transform:translateX(-50%);cursor:col-resize}.ve-grid-divider.row{left:0;right:0;height:5px;transform:translateY(-50%);cursor:row-resize}
      .ve-clip-stage{height:270px;display:grid;place-items:center}.ve-clip-object{width:210px;height:145px;background:linear-gradient(135deg,#4f8cff,#9c7cff);position:relative;touch-action:none}.ve-clip-point{position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #111;transform:translate(-50%,-50%);cursor:grab;touch-action:none;box-shadow:0 2px 7px rgba(0,0,0,.3);z-index:3}
      .ve-points-table{display:grid;gap:5px;margin-top:8px}.ve-point-row{display:grid;grid-template-columns:34px 1fr 1fr 34px;gap:6px;align-items:center}.ve-point-row input{min-width:0;padding:7px;border:1px solid var(--border);border-radius:7px;background:var(--input);color:var(--text)}
      .ve-bezier-stage{height:250px;padding:20px}.ve-bezier-chart{position:relative;height:100%;border-left:1px solid #526076;border-bottom:1px solid #526076;background:linear-gradient(#252c38 1px,transparent 1px) 0 0/100% 25%,linear-gradient(90deg,#252c38 1px,transparent 1px) 0 0/25% 100%}.ve-bezier-chart svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}.ve-bezier-handle{position:absolute;width:14px;height:14px;border-radius:50%;transform:translate(-50%,-50%);background:var(--accent);border:2px solid #fff;cursor:grab;touch-action:none;z-index:3;box-shadow:0 2px 8px rgba(0,0,0,.35)}.ve-bezier-line{position:absolute;height:1px;background:rgba(110,168,255,.7);transform-origin:0 50%;pointer-events:none}
      .ve-cubic-readout{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin-top:8px;padding:8px;border:1px dashed var(--border);border-radius:8px;background:#10151e}.ve-cubic-readout code{overflow:auto;white-space:nowrap;color:#cfe0ff}
      .ve-transition-list{display:grid;gap:7px;margin:8px 0}.ve-transition-row{display:grid;grid-template-columns:minmax(100px,1fr) 90px minmax(130px,1fr) 80px 34px;gap:6px}.ve-transition-row input,.ve-transition-row select,.ve-transition-row button{min-width:0;padding:7px;border:1px solid var(--border);border-radius:7px;background:var(--input);color:var(--text)}.ve-transition-preview{margin:10px 0;height:100px;border:1px dashed var(--border);border-radius:9px;display:grid;place-items:center;background:linear-gradient(90deg,rgba(110,168,255,.08),rgba(156,124,255,.1))}.ve-transition-track{position:relative;width:90%;height:2px;background:var(--border)}.ve-transition-ball{position:absolute;left:0;top:50%;width:34px;height:34px;border-radius:50%;background:var(--accent);transform:translate(-50%,-50%)}
      @media(max-width:760px){.ve-transition-row{grid-template-columns:1fr 1fr}.ve-transition-row button{grid-column:1/-1}.ve-quad-grid{grid-template-columns:1fr}.ve-flex-stage{padding:10px}.ve-grid-stage{padding:10px}}
    `;
    document.head.appendChild(st);
  }
  ensureExtraVisualStyle();
  VBVE.$=$;VBVE.esc=esc;VBVE.num=num;VBVE.emit=emit;VBVE.emitVisual=emitVisual;VBVE.copyOutput=copyOutput;VBVE.applyDeclarations=applyDeclarations;
})();
