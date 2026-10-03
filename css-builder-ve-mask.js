(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  const $=VBVE.$, esc=VBVE.esc, num=VBVE.num, emit=VBVE.emit, copyOutput=VBVE.copyOutput;
  function maskCss(){
  const m=VBVE.state.mask;
  const image=m.image||'linear-gradient(135deg, #000 0%, transparent 100%)';
  const pos=m.position||'center';
  const size=m.size||'100% 100%';
  const repeat=m.repeat||'no-repeat';
  const mode=m.mode||'alpha';
  return {
    image, position:pos, size, repeat, mode,
    css:`mask-image: ${image}; mask-position: ${pos}; mask-size: ${size}; mask-repeat: ${repeat}; mask-mode: ${mode};`
  };
}

function renderMask(){
  const m=VBVE.state.mask, x=maskCss();
  const stage=$('veMaskObject');
  if(stage){
    stage.style.maskImage=x.image;
    stage.style.maskPosition=x.position;
    stage.style.maskSize=x.size;
    stage.style.maskRepeat=x.repeat;
    stage.style.maskMode=x.mode;
    stage.style.webkitMaskImage=x.image;
    stage.style.webkitMaskPosition=x.position;
    stage.style.webkitMaskSize=x.size;
    stage.style.webkitMaskRepeat=x.repeat;
  }
  const out=$('veMaskOutput');if(out)out.textContent=x.css;
  ['veMaskImage','veMaskPosition','veMaskSize'].forEach((id,i)=>{const e=$(id);if(e)e.value=[m.image,m.position,m.size][i]||'';});
  const r=$('veMaskRepeat');if(r)r.value=m.repeat;
  const mo=$('veMaskMode');if(mo)mo.value=m.mode;
}

function injectMask(){
  if($('veMask'))return;
  const c=$('controls');if(!c)return;
  VBVE.state.mask=VBVE.state.mask||{image:'linear-gradient(135deg, #000 0%, transparent 100%)',position:'center',size:'100% 100%',repeat:'no-repeat',mode:'alpha'};
  const s=document.createElement('section');
  s.className='panel-section visual-editor-section';s.id='veMask';
  s.innerHTML=`
    <div class="section-title-row"><h2>18. Editor grafico — Mask</h2><span class="counter">mask-image</span></div>
    <p class="hint">La maschera determina quali parti dell'elemento risultano visibili.</p>
    <div class="ve-mask-stage"><div id="veMaskObject" class="ve-mask-object">MASK</div></div>
    <label class="mini-field wide"><span>Mask image</span><input id="veMaskImage" placeholder="linear-gradient(...), url(...)"></label>
    <div class="ve-fields">
      <label class="mini-field"><span>Position</span><input id="veMaskPosition" value="center"></label>
      <label class="mini-field"><span>Size</span><input id="veMaskSize" value="100% 100%"></label>
      <label class="mini-field"><span>Repeat</span><select id="veMaskRepeat"><option>no-repeat</option><option>repeat</option><option>repeat-x</option><option>repeat-y</option><option>space</option><option>round</option></select></label>
      <label class="mini-field"><span>Mode</span><select id="veMaskMode"><option>alpha</option><option>luminance</option><option>match-source</option></select></label>
    </div>
    <div class="complex-output"><code id="veMaskOutput"></code><button type="button" data-ve-copy="veMaskOutput">Copia</button></div>`;
  c.appendChild(s);
  ['veMaskImage','veMaskPosition','veMaskSize'].forEach((id,k)=>{
    const keys=['image','position','size'];
    $(id).addEventListener('input',e=>{VBVE.state.mask[keys[k]]=e.target.value;renderMask();emit('mask',maskCss().css);});
  });
  ['veMaskRepeat','veMaskMode'].forEach((id,k)=>{
    const keys=['repeat','mode'];
    $(id).addEventListener('change',e=>{VBVE.state.mask[keys[k]]=e.target.value;renderMask();emit('mask',maskCss().css);});
  });
  s.addEventListener('click',e=>{
    const b=e.target.closest('[data-ve-copy]');
    if(b){const el=$(b.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');b.textContent='Copiato';setTimeout(()=>b.textContent='Copia',800);}
  });
  renderMask();
}
  VBVE.ready(()=>{ injectMask(); });
})();
