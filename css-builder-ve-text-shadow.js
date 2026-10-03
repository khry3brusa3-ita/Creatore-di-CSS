(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  const $=VBVE.$, esc=VBVE.esc, num=VBVE.num, emit=VBVE.emit, copyOutput=VBVE.copyOutput;
  function textShadowCss(){
  const s=VBVE.state.textShadow;
  const alpha=Math.max(0,Math.min(1,num(s.alpha,0.25)));
  const c=s.color||'#000000';
  const rgba=/^#[0-9a-f]{6}$/i.test(c)
    ? `rgba(${parseInt(c.slice(1,3),16)}, ${parseInt(c.slice(3,5),16)}, ${parseInt(c.slice(5,7),16)}, ${alpha})`
    : c;
  return `${num(s.x)}px ${num(s.y)}px ${num(s.blur)}px ${rgba}`;
}

function renderTextShadow(){
  const s=VBVE.state.textShadow;
  const m={veTsX:s.x,veTsY:s.y,veTsBlur:s.blur,veTsAlpha:s.alpha};
  Object.entries(m).forEach(([id,v])=>{const e=$(id);if(e)e.value=v;});
  const c=$('veTsColor');if(c&&/^#[0-9a-f]{6}$/i.test(s.color||''))c.value=s.color;
  const obj=$('veTextShadowObject');if(obj)obj.style.textShadow=textShadowCss();
  const out=$('veTextShadowOutput');if(out)out.textContent=textShadowCss();
}

function injectTextShadow(){
  if($('veTextShadow'))return;
  const c=$('controls');if(!c)return;
  VBVE.state.textShadow=VBVE.state.textShadow||{x:2,y:4,blur:8,color:'#000000',alpha:0.25};
  const s=document.createElement('section');
  s.className='panel-section visual-editor-section';s.id='veTextShadow';
  s.innerHTML=`
    <div class="section-title-row"><h2>17. Editor grafico — Text Shadow</h2><span class="counter">testo</span></div>
    <p class="hint">Modifica offset, sfocatura, colore e trasparenza della <code>text-shadow</code>.</p>
    <div class="ve-text-shadow-stage"><div id="veTextShadowObject" class="ve-text-shadow-object">CSS BUILDER</div></div>
    <div class="ve-fields">
      <label class="mini-field"><span>X offset</span><input id="veTsX" type="number" min="-100" max="100"></label>
      <label class="mini-field"><span>Y offset</span><input id="veTsY" type="number" min="-100" max="100"></label>
      <label class="mini-field"><span>Blur</span><input id="veTsBlur" type="number" min="0" max="100"></label>
      <label class="mini-field"><span>Colore</span><input id="veTsColor" type="color"></label>
      <label class="mini-field"><span>Alpha</span><input id="veTsAlpha" type="number" min="0" max="1" step=".01"></label>
    </div>
    <div class="complex-output"><code id="veTextShadowOutput"></code><button type="button" data-ve-copy="veTextShadowOutput">Copia</button></div>`;
  c.appendChild(s);
  ['veTsX','veTsY','veTsBlur','veTsAlpha'].forEach((id,k)=>{
    const keys=['x','y','blur','alpha'];
    $(id).addEventListener('input',e=>{VBVE.state.textShadow[keys[k]]=Number(e.target.value);renderTextShadow();emit('text-shadow',textShadowCss());});
  });
  $('veTsColor').addEventListener('input',e=>{VBVE.state.textShadow.color=e.target.value;renderTextShadow();emit('text-shadow',textShadowCss());});
  s.addEventListener('click',e=>{
    const b=e.target.closest('[data-ve-copy]');
    if(b){const el=$(b.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');b.textContent='Copiato';setTimeout(()=>b.textContent='Copia',800);}
  });
  renderTextShadow();
}
  VBVE.ready(()=>{ injectTextShadow(); });
})();
