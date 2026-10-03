(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  const $=VBVE.$, esc=VBVE.esc, num=VBVE.num, emit=VBVE.emit, copyOutput=VBVE.copyOutput;
  function gradientCss(){
  const g=VBVE.state.gradient;
  const stops=(g.stops||[]).map(s=>`${s.color||'#000'} ${s.pos||'0%'}`).join(', ');
  if(g.type==='linear-gradient' || g.type==='repeating-linear-gradient')
    return `${g.type}(${g.angle||'90deg'}, ${stops})`;
  if(g.type==='radial-gradient' || g.type==='repeating-radial-gradient')
    return `${g.type}(${g.shape||'circle'} ${g.position||'at center'}, ${stops})`;
  if(g.type==='conic-gradient' || g.type==='repeating-conic-gradient')
    return `${g.type}(from ${g.angle||'0deg'} at ${g.position||'center'}, ${stops})`;
  return `linear-gradient(${g.angle||'90deg'}, ${stops})`;
}

function renderGradient(){
  const g=VBVE.state.gradient;
  const stage=$('veGradientStage');
  if(stage) stage.style.backgroundImage=gradientCss();
  const out=$('veGradientOutput'); if(out) out.textContent=gradientCss();
  const type=$('veGradientType'),angle=$('veGradientAngle'),pos=$('veGradientPosition');
  if(type) type.value=g.type;
  if(angle) angle.value=g.angle||'90deg';
  if(pos) pos.value=g.position||'center';
  const stops=$('veGradientStops');
  if(!stops)return;
  stops.innerHTML=(g.stops||[]).map((s,i)=>`
    <div class="ve-stop-row">
      <input type="color" value="${/^#[0-9a-f]{6}$/i.test(s.color||'')?s.color:'#000000'}" data-vg-index="${i}" data-vg-key="color" title="Colore">
      <input value="${esc(s.color||'')}" placeholder="#4f8cff / red" data-vg-index="${i}" data-vg-key="colorText">
      <input value="${esc(s.pos||'')}" placeholder="0% / 50% / 100%" data-vg-index="${i}" data-vg-key="pos">
      <button type="button" data-vg-remove="${i}" title="Rimuovi stop">×</button>
    </div>`).join('');
}

function injectGradient(){
  if($('veGradient'))return;
  const c=$('controls');if(!c)return;
  VBVE.state.gradient=VBVE.state.gradient||{
    type:'linear-gradient',angle:'90deg',position:'center',shape:'circle',
    stops:[{color:'#4f8cff',pos:'0%'},{color:'#8b5cf6',pos:'100%'}]
  };
  const s=document.createElement('section');
  s.className='panel-section visual-editor-section';s.id='veGradient';
  s.innerHTML=`
    <div class="section-title-row"><h2>14. Editor grafico — Gradient</h2><span class="counter">multi-stop</span></div>
    <p class="hint">Trascina gli stop sulla barra per cambiarne la posizione oppure modificali numericamente.</p>
    <div class="ve-gradient-stage-wrap">
      <div id="veGradientStage" class="ve-gradient-stage"></div>
      <div id="veGradientTrack" class="ve-gradient-track"></div>
    </div>
    <div class="ve-fields">
      <label class="mini-field"><span>Tipo</span><select id="veGradientType">
        <option value="linear-gradient">linear-gradient</option>
        <option value="repeating-linear-gradient">repeating-linear-gradient</option>
        <option value="radial-gradient">radial-gradient</option>
        <option value="repeating-radial-gradient">repeating-radial-gradient</option>
        <option value="conic-gradient">conic-gradient</option>
        <option value="repeating-conic-gradient">repeating-conic-gradient</option>
      </select></label>
      <label class="mini-field"><span>Angolo</span><input id="veGradientAngle" value="90deg"></label>
      <label class="mini-field"><span>Posizione</span><input id="veGradientPosition" value="center"></label>
    </div>
    <div id="veGradientStops"></div>
    <button type="button" id="veGradientAddStop">+ Aggiungi stop</button>
    <div class="complex-output"><code id="veGradientOutput"></code><button type="button" data-ve-copy="veGradientOutput">Copia</button></div>`;
  c.appendChild(s);

  const update=()=>{
    const t=$('veGradientType'); const a=$('veGradientAngle'); const p=$('veGradientPosition');
    if(t)VBVE.state.gradient.type=t.value;
    if(a)VBVE.state.gradient.angle=a.value;
    if(p)VBVE.state.gradient.position=p.value;
    renderGradient(); emit('background-image',gradientCss());
  };
  ['veGradientType','veGradientAngle','veGradientPosition'].forEach(id=>$(id)?.addEventListener('input',update));
  $('veGradientAddStop')?.addEventListener('click',()=>{
    const stops=VBVE.state.gradient.stops;
    stops.push({color:'#ffffff',pos:'100%'});
    renderGradient();emit('background-image',gradientCss());
  });
  s.addEventListener('input',e=>{
    const t=e.target;
    if(!t.matches('[data-vg-index]'))return;
    const stop=VBVE.state.gradient.stops[Number(t.dataset.vgIndex)];
    if(!stop)return;
    if(t.dataset.vgKey==='color')stop.color=t.value;
    if(t.dataset.vgKey==='colorText')stop.color=t.value;
    if(t.dataset.vgKey==='pos')stop.pos=t.value;
    renderGradient();emit('background-image',gradientCss());
  });
  s.addEventListener('click',e=>{
    const r=e.target.closest('[data-vg-remove]');
    if(r){
      VBVE.state.gradient.stops.splice(Number(r.dataset.vgRemove),1);
      if(!VBVE.state.gradient.stops.length)VBVE.state.gradient.stops.push({color:'#000000',pos:'0%'});
      renderGradient();emit('background-image',gradientCss());
    }
    const b=e.target.closest('[data-ve-copy]');
    if(b){const el=$(b.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');b.textContent='Copiato';setTimeout(()=>b.textContent='Copia',800);}
  });

  // Drag stops on the visual track
  const track=$('veGradientTrack');
  let active=null;
  function syncTrack(){
    track.innerHTML=VBVE.state.gradient.stops.map((st,i)=>{
      const p=Math.max(0,Math.min(100,parseFloat(st.pos)||0));
      return `<button type="button" class="ve-gradient-stop" style="left:${p}%" data-track-stop="${i}" title="${esc(st.pos||'0%')}"></button>`;
    }).join('');
  }
  track.addEventListener('pointerdown',e=>{
    const b=e.target.closest('[data-track-stop]');
    if(!b)return;
    active=Number(b.dataset.trackStop);track.setPointerCapture?.(e.pointerId);e.preventDefault();
  });
  track.addEventListener('pointermove',e=>{
    if(active===null)return;
    const rect=track.getBoundingClientRect();
    const pct=Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100));
    VBVE.state.gradient.stops[active].pos=`${Math.round(pct)}%`;
    renderGradient();syncTrack();emit('background-image',gradientCss());
  });
  const end=()=>{active=null};
  track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);
  const oldRender=renderGradient;
  // Small wrapper so the draggable track stays synchronized.
  const originalStageRender=renderGradient;
  window.CVB_VISUAL_EDITORS.renderGradient=()=>{originalStageRender();syncTrack();};
  window.CVB_VISUAL_EDITORS.renderGradient();
}
  VBVE.ready(()=>{ injectGradient(); });
})();
