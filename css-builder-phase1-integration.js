(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  if(!VBVE)return;
  const $=VBVE.$;
  const core=()=>window.CVB_CORE_API||null;
  const target=()=>core()?.getActiveSelector?.()||$('controlSelector')?.textContent?.trim()||null;
  function set(key,value){const api=core(),sel=target();if(!api?.setProperty||!sel)return;api.setProperty(sel,key,String(value??''),true,false);api.updateCssAndPreview?.();}
  function declarations(text){const api=core(),sel=target();if(!api?.setProperty||!sel)return;String(text||'').split(/\n+/).forEach(line=>{const m=line.match(/^\s*([\w-]+):\s*(.*?)\s*;?\s*$/);if(m)api.setProperty(sel,m[1],m[2],true,false);});api.updateCssAndPreview?.();}
  function on(detail){
    const type=detail?.type, css=String(detail?.css||'');
    if(!type)return;
    switch(type){
      case'box-shadow': set('box-shadow',css); break;
      case'transform': set('transform',css); break;
      case'background-image': set('background-image',css); break;
      case'border': declarations(css.replace(/\s*;\s*/g,';\n')); break;
      case'filter': set('filter',css); break;
      case'backdrop-filter': set('backdrop-filter',css); break;
      case'text-shadow': set('text-shadow',css); break;
      case'mask': declarations(css.replace(/\s*;\s*/g,';\n')); break;
      default: break;
    }
  }
  document.addEventListener('cvb:visual-editor-change',e=>on(e.detail));
  VBVE.phase1Integration={version:'1.0'};
})();
