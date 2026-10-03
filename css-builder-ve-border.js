(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  const $=VBVE.$, esc=VBVE.esc, num=VBVE.num, emit=VBVE.emit, copyOutput=VBVE.copyOutput;
  function borderCss(){
  const b=VBVE.state.border;
  const sides=['top','right','bottom','left'].map(s=>{
    const v=b.sides[s];
    return `${v.width||'0px'} ${v.style||'solid'} ${v.color||'#000000'}`;
  });
  const radius=b.radius.map(v=>v||'0px').join(' / ');
  return {
    border: sides[0]===sides[1]&&sides[1]===sides[2]&&sides[2]===sides[3] ? sides[0] : '',
    borderTop:sides[0],borderRight:sides[1],borderBottom:sides[2],borderLeft:sides[3],
    borderRadius:radius
  };
}

function renderBorder(){
  const b=VBVE.state.border, stage=$('veBorderObject'),out=$('veBorderOutput');
  const css=borderCss();
  if(stage){
    stage.style.borderTop=css.borderTop;
    stage.style.borderRight=css.borderRight;
    stage.style.borderBottom=css.borderBottom;
    stage.style.borderLeft=css.borderLeft;
    stage.style.borderRadius=css.borderRadius;
  }
  if(out)out.textContent=css.border?`border: ${css.border};\n  border-radius: ${css.borderRadius};`:
    `border-top: ${css.borderTop};\n  border-right: ${css.borderRight};\n  border-bottom: ${css.borderBottom};\n  border-left: ${css.borderLeft};\n  border-radius: ${css.borderRadius};`;
  ['top','right','bottom','left'].forEach(side=>{
    const v=b.sides[side];
    const w=$(`veBorder${side}Width`),st=$(`veBorder${side}Style`),co=$(`veBorder${side}Color`);
    if(w)w.value=v.width||'0px';if(st)st.value=v.style||'solid';if(co&&/^#[0-9a-f]{6}$/i.test(v.color||''))co.value=v.color;
  });
  ['TL','TR','BR','BL'].forEach((key,i)=>{const el=$(`veRadius${key}`);if(el)el.value=b.radius[i]||'0px';});
}

function injectBorder(){
  if($('veBorder'))return;
  const c=$('controls');if(!c)return;
  VBVE.state.border=VBVE.state.border||{
    sides:{top:{width:'2px',style:'solid',color:'#4f8cff'},right:{width:'2px',style:'solid',color:'#4f8cff'},bottom:{width:'2px',style:'solid',color:'#4f8cff'},left:{width:'2px',style:'solid',color:'#4f8cff'}},
    radius:['12px','12px','12px','12px']
  };
  const sides=['top','right','bottom','left'];
  const sideRows=sides.map(side=>`
    <div class="ve-border-row">
      <b>${side}</b>
      <input id="veBorder${side}Width" placeholder="2px" value="2px">
      <select id="veBorder${side}Style"><option>solid</option><option>dashed</option><option>dotted</option><option>double</option><option>groove</option><option>ridge</option><option>inset</option><option>outset</option><option>none</option></select>
      <input id="veBorder${side}Color" type="color" value="#4f8cff">
    </div>`).join('');
  const s=document.createElement('section');
  s.className='panel-section visual-editor-section';s.id='veBorder';
  s.innerHTML=`
    <div class="section-title-row"><h2>15. Editor grafico — Border & Radius</h2><span class="counter">4 lati</span></div>
    <p class="hint">Imposta ogni lato separatamente e controlla i quattro angoli con una preview reale.</p>
    <div class="ve-border-stage"><div id="veBorderObject" class="ve-border-object">BOX</div></div>
    <div class="ve-border-editor">${sideRows}</div>
    <div class="ve-fields">
      <label class="mini-field"><span>Raggio alto sinistra</span><input id="veRadiusTL" value="12px"></label>
      <label class="mini-field"><span>Raggio alto destra</span><input id="veRadiusTR" value="12px"></label>
      <label class="mini-field"><span>Raggio basso destra</span><input id="veRadiusBR" value="12px"></label>
      <label class="mini-field"><span>Raggio basso sinistra</span><input id="veRadiusBL" value="12px"></label>
    </div>
    <div class="complex-output"><code id="veBorderOutput"></code><button type="button" data-ve-copy="veBorderOutput">Copia</button></div>`;
  c.appendChild(s);
  const update=()=>{
    sides.forEach(side=>{
      const v=VBVE.state.border.sides[side];
      v.width=$(`veBorder${side}Width`).value||'0px';
      v.style=$(`veBorder${side}Style`).value||'solid';
      v.color=$(`veBorder${side}Color`).value||'#000000';
    });
    VBVE.state.border.radius=['TL','TR','BR','BL'].map(k=>$(`veRadius${k}`).value||'0px');
    renderBorder();
    const css=borderCss();
    emit('border',css.border?`border: ${css.border}; border-radius: ${css.borderRadius};`:`border-top:${css.borderTop};border-right:${css.borderRight};border-bottom:${css.borderBottom};border-left:${css.borderLeft};border-radius:${css.borderRadius};`);
  };
  s.addEventListener('input',e=>{
    if(e.target.matches('input,select'))update();
  });
  s.addEventListener('click',e=>{
    const b=e.target.closest('[data-ve-copy]');
    if(b){const el=$(b.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');b.textContent='Copiato';setTimeout(()=>b.textContent='Copia',800);}
  });
  renderBorder();
}
  VBVE.ready(()=>{ injectBorder(); });
})();
