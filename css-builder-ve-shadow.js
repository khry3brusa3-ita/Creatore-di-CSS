(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  const $=VBVE.$, esc=VBVE.esc, num=VBVE.num, copyOutput=VBVE.copyOutput;
  function shadowCss(){
  const s=VBVE.state.shadow;
  const alpha=Math.max(0,Math.min(1,num(s.alpha,0.2)));
  const c=s.color||'#000000';
  const rgba=/^#[0-9a-f]{6}$/i.test(c)
    ? `rgba(${parseInt(c.slice(1,3),16)}, ${parseInt(c.slice(3,5),16)}, ${parseInt(c.slice(5,7),16)}, ${alpha})`
    : c;
  return `${s.inset?'inset ':''}${num(s.x)}px ${num(s.y)}px ${num(s.blur)}px ${num(s.spread)}px ${rgba}`;
}

function emit(type,css){
  document.dispatchEvent(new CustomEvent('cvb:visual-editor-change',{detail:{type,css,state:VBVE.state}}));
}

function transformPreview(){
  const box=$('veTransformObject');
  if(box) box.style.transform=transformCss();
  const out=$('veTransformOutput'); if(out) out.textContent=transformCss();
}

function renderTransform(){
  const t=VBVE.state.transform;
  const fields={
    veTx:t.x,veTy:t.y,veTz:t.z,veRx:t.rx,veRy:t.ry,veRz:t.rz,
    veSx:t.sx,veSy:t.sy,veSkx:t.skx,veSky:t.sky,vePerspective:t.perspective
  };
  Object.entries(fields).forEach(([id,v])=>{const e=$(id);if(e)e.value=v;});
  const stage=$('veTransformStage');
  if(stage) stage.style.perspective=t.perspective>0?`${t.perspective}px`:'none';
  transformPreview();
}

function injectTransform(){
  if($('veTransform')) return;
  const c=$('controls'); if(!c) return;
  const s=document.createElement('section');
  s.className='panel-section visual-editor-section';
  s.id='veTransform';
  s.innerHTML=`
    <div class="section-title-row"><h2>12. Editor grafico — Transform</h2><span class="counter">2D / 3D</span></div>
    <p class="hint">Trascina il punto centrale oppure usa i controlli. L'output è una singola proprietà <code>transform</code>.</p>
    <div class="ve-transform-stage" id="veTransformStage">
      <div class="ve-transform-grid"></div>
      <div class="ve-transform-object" id="veTransformObject"><span>BOX</span></div>
      <div class="ve-transform-hint">X ↔ &nbsp;&nbsp; Y ↕</div>
    </div>
    <div class="ve-fields">
      ${[['veTx','Translate X','-500','500','1'],['veTy','Translate Y','-500','500','1'],['veTz','Translate Z','-500','500','1'],
        ['veRx','Rotate X','-180','180','1'],['veRy','Rotate Y','-180','180','1'],['veRz','Rotate Z','-180','180','1'],
        ['veSx','Scale X','0','4','0.01'],['veSy','Scale Y','0','4','0.01'],['veSkx','Skew X','-90','90','1'],['veSky','Skew Y','-90','90','1'],
        ['vePerspective','Perspective','0','2000','10']].map(([id,l,min,max,step])=>`
          <label class="mini-field"><span>${l}</span><input id="${id}" type="number" min="${min}" max="${max}" step="${step}"></label>`).join('')}
    </div>
    <div class="complex-output"><code id="veTransformOutput"></code><button type="button" data-ve-copy="veTransformOutput">Copia</button></div>`;
  c.appendChild(s);

  Object.keys(VBVE.state.transform).forEach(k=>{
    const map={x:'veTx',y:'veTy',z:'veTz',rx:'veRx',ry:'veRy',rz:'veRz',sx:'veSx',sy:'veSy',skx:'veSkx',sky:'veSky',perspective:'vePerspective'};
    const e=$(map[k]); if(e) e.addEventListener('input',()=>{VBVE.state.transform[k]=Number(e.value);renderTransform();emit('transform',transformCss());});
  });

  const stage=$('veTransformStage');
  let dragging=false,startX=0,startY=0,ox=0,oy=0;
  stage.addEventListener('pointerdown',e=>{
    if(e.target.closest('#veTransformObject') || e.target===stage || e.target.closest('.ve-transform-grid')){
      dragging=true;stage.setPointerCapture?.(e.pointerId);startX=e.clientX;startY=e.clientY;ox=num(VBVE.state.transform.x);oy=num(VBVE.state.transform.y);e.preventDefault();
    }
  });
  stage.addEventListener('pointermove',e=>{
    if(!dragging)return;
    VBVE.state.transform.x=Math.round(ox+(e.clientX-startX));
    VBVE.state.transform.y=Math.round(oy+(e.clientY-startY));
    renderTransform();emit('transform',transformCss());
  });
  stage.addEventListener('pointerup',()=>dragging=false);
  stage.addEventListener('pointercancel',()=>dragging=false);

  s.addEventListener('click',e=>{
    const b=e.target.closest('[data-ve-copy]'); if(b){const el=$(b.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');b.textContent='Copiato';setTimeout(()=>b.textContent='Copia',800);}
  });
  renderTransform();
}

function renderShadow(){
  const s=VBVE.state.shadow;
  const vals={veShX:s.x,veShY:s.y,veShBlur:s.blur,veShSpread:s.spread,veShAlpha:s.alpha};
  Object.entries(vals).forEach(([id,v])=>{const e=$(id);if(e)e.value=v;});
  const c=$('veShColor');if(c)c.value=/^#[0-9a-f]{6}$/i.test(s.color)?s.color:'#000000';
  const inset=$('veShInset');if(inset)inset.checked=!!s.inset;
  const obj=$('veShadowObject');if(obj)obj.style.boxShadow=shadowCss();
  const out=$('veShadowOutput');if(out)out.textContent=shadowCss();
}

function injectShadow(){
  if($('veShadow'))return;
  const c=$('controls');if(!c)return;
  const s=document.createElement('section');s.className='panel-section visual-editor-section';s.id='veShadow';
  s.innerHTML=`
    <div class="section-title-row"><h2>13. Editor grafico — Box Shadow</h2><span class="counter">visuale</span></div>
    <p class="hint">Regola offset, sfocatura, spread, colore e inset con controlli separati.</p>
    <div class="ve-shadow-stage"><div id="veShadowObject" class="ve-shadow-object">BOX</div></div>
    <div class="ve-fields">
      <label class="mini-field"><span>X</span><input id="veShX" type="number" min="-200" max="200"></label>
      <label class="mini-field"><span>Y</span><input id="veShY" type="number" min="-200" max="200"></label>
      <label class="mini-field"><span>Blur</span><input id="veShBlur" type="number" min="0" max="200"></label>
      <label class="mini-field"><span>Spread</span><input id="veShSpread" type="number" min="-100" max="100"></label>
      <label class="mini-field"><span>Colore</span><input id="veShColor" type="color"></label>
      <label class="mini-field"><span>Alpha</span><input id="veShAlpha" type="number" min="0" max="1" step=".01"></label>
      <label class="mini-field ve-check"><span>Inset</span><input id="veShInset" type="checkbox"></label>
    </div>
    <div class="complex-output"><code id="veShadowOutput"></code><button type="button" data-ve-copy="veShadowOutput">Copia</button></div>`;
  c.appendChild(s);
  const map={veShX:'x',veShY:'y',veShBlur:'blur',veShSpread:'spread',veShAlpha:'alpha'};
  Object.entries(map).forEach(([id,k])=>$(id).addEventListener('input',e=>{VBVE.state.shadow[k]=Number(e.target.value);renderShadow();emit('box-shadow',shadowCss());}));
  $('veShColor').addEventListener('input',e=>{VBVE.state.shadow.color=e.target.value;renderShadow();emit('box-shadow',shadowCss());});
  $('veShInset').addEventListener('change',e=>{VBVE.state.shadow.inset=e.target.checked;renderShadow();emit('box-shadow',shadowCss());});
  s.addEventListener('click',e=>{const b=e.target.closest('[data-ve-copy]');if(b){const el=$(b.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');b.textContent='Copiato';setTimeout(()=>b.textContent='Copia',800);}});
  renderShadow();
}
  VBVE.ready(()=>{ injectShadow(); });
})();
