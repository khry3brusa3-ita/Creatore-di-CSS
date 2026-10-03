(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  if(!VBVE) return;
  const $=VBVE.$, num=VBVE.num, esc=VBVE.esc, emitVisual=VBVE.emitVisual;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,num(v,min)));
  const sideNames={t:'Alto',r:'Destra',b:'Basso',l:'Sinistra'};
  const sideWords={t:'superiore',r:'destro',b:'inferiore',l:'sinistro'};

  function defaults(){
    const b=VBVE.state.boxModel||{};
    b.margin={t:16,r:16,b:16,l:16,...(b.margin||{})};
    b.border={t:1,r:1,b:1,l:1,...(b.border||{})};
    b.padding={t:16,r:16,b:16,l:16,...(b.padding||{})};
    if(!('width' in b)) b.width='auto';
    if(!('height' in b)) b.height='auto';
    b.borderColor=b.borderColor||'#6ea8ff';
    b.borderStyle=b.borderStyle||'solid';
    b.boxSizing=b.boxSizing||'border-box';
    VBVE.state.boxModel=b;
    return b;
  }

  function css(){
    const b=defaults();
    const four=(o,allowNegative=false,max=200)=>['t','r','b','l'].map(k=>{
      const v=clamp(o[k],allowNegative?-max:0,max);
      return `${Math.round(v)}px`;
    }).join(' ');
    const width=b.width==='auto'?'auto':`${clamp(b.width,40,1400)}px`;
    const height=b.height==='auto'?'auto':`${clamp(b.height,30,1000)}px`;
    return [
      `margin: ${four(b.margin,true,200)};`,
      `border-width: ${four(b.border,false,30)};`,
      `border-style: ${b.borderStyle||'solid'};`,
      `border-color: ${b.borderColor||'#6ea8ff'};`,
      `padding: ${four(b.padding,false,200)};`,
      `width: ${width};`,
      `height: ${height};`,
      `box-sizing: ${b.boxSizing||'border-box'};`
    ].join('\n');
  }

  function vis(v){
    // Logarithmic-ish visual scaling: real CSS numbers stay readable without making
    // a 200px value collapse the content area or push labels on top of each other.
    return 8 + 48*(1-Math.exp(-Math.max(0,num(v))/38));
  }

  function render(){
    const b=defaults();
    const stage=$('veBoxModelStageUX'), canvas=$('veBoxModelCanvasUX'), out=$('veBoxModelOutput');
    const values={
      veBmMt:b.margin.t,veBmMr:b.margin.r,veBmMb:b.margin.b,veBmMl:b.margin.l,
      veBmBt:b.border.t,veBmBr:b.border.r,veBmBb:b.border.b,veBmBl:b.border.l,
      veBmPt:b.padding.t,veBmPr:b.padding.r,veBmPb:b.padding.b,veBmPl:b.padding.l
    };
    Object.entries(values).forEach(([id,v])=>{const e=$(id);if(e)e.value=Math.round(num(v));});
    const w=$('veBmWidth'),h=$('veBmHeight');
    if(w) w.value=b.width==='auto'?'':b.width;
    if(h) h.value=b.height==='auto'?'':b.height;
    const wa=$('veBmWidthAuto'),ha=$('veBmHeightAuto');
    if(wa) wa.checked=b.width==='auto';
    if(ha) ha.checked=b.height==='auto';
    const bc=$('veBmBorderColor');if(bc)bc.value=b.borderColor;
    const bs=$('veBmBorderStyle');if(bs)bs.value=b.borderStyle;
    const bi=$('veBmBoxSizing');if(bi)bi.value=b.boxSizing;
    if(out) out.textContent=css();
    if(!stage||!canvas) return;

    const margin={t:vis(b.margin.t),r:vis(Math.max(0,b.margin.r)),b:vis(b.margin.b),l:vis(Math.max(0,b.margin.l))};
    const border={t:Math.max(3,Math.min(16,b.border.t*.42+3)),r:Math.max(3,Math.min(16,b.border.r*.42+3)),b:Math.max(3,Math.min(16,b.border.b*.42+3)),l:Math.max(3,Math.min(16,b.border.l*.42+3))};
    const padding={t:vis(b.padding.t),r:vis(b.padding.r),b:vis(b.padding.b),l:vis(b.padding.l)};
    const W=336,H=236;
    const bw=Math.max(150,W-margin.l-margin.r), bh=Math.max(112,H-margin.t-margin.b);
    const pw=Math.max(108,bw-border.l-border.r), ph=Math.max(78,bh-border.t-border.b);
    const cw=Math.max(76,pw-padding.l-padding.r), ch=Math.max(52,ph-padding.t-padding.b);
    const borderBox=$('veBmBorderLayerUX'), padBox=$('veBmPaddingLayerUX'), content=$('veBmContentUX');
    canvas.style.width=`${W}px`;canvas.style.height=`${H}px`;
    if(borderBox){borderBox.style.width=`${bw}px`;borderBox.style.height=`${bh}px`;borderBox.style.borderTopWidth=`${border.t}px`;borderBox.style.borderRightWidth=`${border.r}px`;borderBox.style.borderBottomWidth=`${border.b}px`;borderBox.style.borderLeftWidth=`${border.l}px`;}
    if(padBox){padBox.style.width=`${pw}px`;padBox.style.height=`${ph}px`;}
    if(content){content.style.width=`${cw}px`;content.style.height=`${ch}px`;}

    const positions={
      margin:{t:[50,Math.max(5,(margin.t*.42)/H*100)],r:[Math.min(96,100-(margin.r*.42)/W*100),50],b:[50,Math.min(96,100-(margin.b*.42)/H*100)],l:[Math.max(4,(margin.l*.42)/W*100),50]},
      padding:{t:[50,Math.max(22,(margin.t+border.t+padding.t*.18)/H*100)],r:[Math.min(78,100-(margin.r+border.r+padding.r*.18)/W*100),50],b:[50,Math.min(78,100-(margin.b+border.b+padding.b*.18)/H*100)],l:[Math.max(22,(margin.l+border.l+padding.l*.18)/W*100),50]}
    };
    canvas.querySelectorAll('[data-bm-group]').forEach(el=>{
      const g=el.dataset.bmGroup, side=el.dataset.bmSide, pos=positions[g]?.[side];
      if(!pos)return;
      el.style.left=`${pos[0]}%`;el.style.top=`${pos[1]}%`;
      el.innerHTML=`<span>${g==='margin'?'M':'P'} ${Math.round(num(b[g][side]))}px</span>`;
      el.setAttribute('aria-label',`${g} ${sideWords[side]}: ${Math.round(num(b[g][side]))} px`);
    });
  }

  function emit(){
    render();
    emitVisual('box-model',css(),VBVE.state.boxModel);
  }

  function replace(){
    const old=$('veBoxModel');
    if(!old || old.dataset.ux2==='1') return;
    const b=defaults();
    const section=document.createElement('section');
    section.className='panel-section visual-editor-section';
    section.id='veBoxModel';
    section.dataset.ux2='1';
    section.innerHTML=`
      <div class="section-title-row"><h2>19. Editor grafico — Box Model</h2><span class="counter">spaziatura + dimensioni</span></div>
      <p class="hint">Qui stai modificando il <strong>box dell'elemento</strong>: margin = spazio fuori, border = contorno, padding = spazio dentro, width/height = dimensioni.</p>

      <div class="ve-bm-quick-help">
        <div><b>Margin</b><span>spazio tra questo elemento e ciò che lo circonda</span></div>
        <div><b>Padding</b><span>spazio tra bordo e contenuto interno</span></div>
        <div><b>Border</b><span>contorno dell'elemento</span></div>
        <div><b>Width / Height</b><span>dimensioni dichiarate del box</span></div>
      </div>

      <div class="ve-boxmodel-stage ve-boxmodel-stage-ux2" id="veBoxModelStageUX">
        <div class="ve-bm-outer-label">AREA ESTERNA · MARGIN</div>
        <div class="ve-boxmodel-canvas ve-boxmodel-canvas-ux2" id="veBoxModelCanvasUX">
          <div class="ve-bm-margin-zone"></div>
          <div class="ve-bm-border-zone" id="veBmBorderLayerUX">
            <span class="ve-bm-zone-label">BORDER</span>
            <div class="ve-bm-padding-zone" id="veBmPaddingLayerUX">
              <span class="ve-bm-zone-label">PADDING</span>
              <div class="ve-bm-content-zone" id="veBmContentUX">CONTENT</div>
            </div>
          </div>
          ${['margin','padding'].flatMap(g=>['t','r','b','l'].map(side=>`<button type="button" class="ve-bm-drag-handle ve-bm-drag-${g}" data-bm-group="${g}" data-bm-side="${side}"></button>`)).join('')}
          <div class="ve-bm-guide-row"><span>← spazio esterno</span><span>spazio interno →</span></div>
        </div>
      </div>

      <div class="ve-bm-target"><span>Elemento selezionato</span><code>${esc($('controlSelector')?.textContent?.trim()||'—')}</code></div>

      <div class="ve-bm-section-head"><h3>Margin <small>spazio esterno</small></h3><button type="button" data-bm-action="uniform-margin">Uniforma</button></div>
      <div class="ve-quad-grid ve-bm-number-grid">
        ${[['veBmMt','Alto','t'],['veBmMr','Destra','r'],['veBmMb','Basso','b'],['veBmMl','Sinistra','l']].map(([id,label])=>`<label class="mini-field"><span>${label}</span><input id="${id}" type="number" min="-200" max="200" step="1"><small>px</small></label>`).join('')}
      </div>
      <div class="ve-bm-note">I valori negativi di <code>margin</code> sono consentiti nel CSS; la maniglia visuale si ferma a zero, per mantenere la geometria leggibile.</div>

      <div class="ve-bm-section-head"><h3>Border <small>contorno</small></h3></div>
      <div class="ve-quad-grid ve-bm-number-grid">
        ${[['veBmBt','Alto','t'],['veBmBr','Destra','r'],['veBmBb','Basso','b'],['veBmBl','Sinistra','l']].map(([id,label])=>`<label class="mini-field"><span>${label}</span><input id="${id}" type="number" min="0" max="30" step="1"><small>px</small></label>`).join('')}
      </div>
      <div class="ve-quad-grid"><label class="mini-field"><span>Stile</span><select id="veBmBorderStyle"><option>solid</option><option>dashed</option><option>dotted</option><option>double</option><option>groove</option><option>ridge</option><option>inset</option><option>outset</option><option>none</option></select></label><label class="mini-field"><span>Colore</span><input id="veBmBorderColor" type="color"></label></div>

      <div class="ve-bm-section-head"><h3>Padding <small>spazio interno</small></h3><button type="button" data-bm-action="uniform-padding">Uniforma</button></div>
      <div class="ve-quad-grid ve-bm-number-grid">
        ${[['veBmPt','Alto','t'],['veBmPr','Destra','r'],['veBmPb','Basso','b'],['veBmPl','Sinistra','l']].map(([id,label])=>`<label class="mini-field"><span>${label}</span><input id="${id}" type="number" min="0" max="200" step="1"><small>px</small></label>`).join('')}
      </div>

      <div class="ve-bm-section-head"><h3>Dimensioni <small>del box</small></h3></div>
      <div class="ve-quad-grid ve-bm-size-grid"><label class="mini-field"><span>Larghezza</span><input id="veBmWidth" type="number" min="40" max="1400" step="1"><small>px oppure auto</small></label><label class="mini-field"><span>Altezza</span><input id="veBmHeight" type="number" min="30" max="1000" step="1"><small>px oppure auto</small></label></div>
      <div class="ve-quad-grid"><label class="ve-linked"><input id="veBmWidthAuto" type="checkbox"> larghezza <code>auto</code></label><label class="ve-linked"><input id="veBmHeightAuto" type="checkbox"> altezza <code>auto</code></label></div>
      <label class="mini-field"><span>Box sizing</span><select id="veBmBoxSizing"><option value="border-box">border-box <small>bordo + padding inclusi nelle dimensioni</small></option><option value="content-box">content-box <small>width/height riguardano il contenuto</small></option></select></label>

      <div class="ve-bm-usage">
        <strong>Quando usare questo editor?</strong>
        <span><code>padding</code> → spazio <em>dentro</em> un componente</span>
        <span><code>margin</code> → spazio <em>fuori</em> dal componente</span>
        <span><code>gap</code> → distanza tra elementi <em>Flex/Grid</em></span>
        <span><code>top/left</code> → spostamento di un elemento posizionato</span>
        <span><code>transform</code> → spostamento/rotazione <em>visiva</em></span>
      </div>

      <div class="preset-row editor"><button data-bm-preset="compact">Compatto</button><button data-bm-preset="card">Card</button><button data-bm-preset="spacious">Spaziato</button><button data-bm-action="reset">Reset</button></div>
      <div class="complex-output"><code id="veBoxModelOutput"></code><button type="button" data-ve-copy="veBoxModelOutput">Copia</button></div>`;
    old.replaceWith(section);

    const fields={
      veBmMt:['margin','t'],veBmMr:['margin','r'],veBmMb:['margin','b'],veBmMl:['margin','l'],
      veBmBt:['border','t'],veBmBr:['border','r'],veBmBb:['border','b'],veBmBl:['border','l'],
      veBmPt:['padding','t'],veBmPr:['padding','r'],veBmPb:['padding','l']
    };
    // Correct the final padding mapping explicitly to avoid positional assumptions.
    fields.veBmPb=['padding','b']; fields.veBmPl=['padding','l'];
    Object.entries(fields).forEach(([id,[g,k]])=>$(id)?.addEventListener('input',e=>{b[g][k]=num(e.target.value);emit();}));

    $('veBmWidth')?.addEventListener('input',e=>{if(!$('veBmWidthAuto')?.checked)b.width=e.target.value===''?'auto':clamp(e.target.value,40,1400);emit();});
    $('veBmHeight')?.addEventListener('input',e=>{if(!$('veBmHeightAuto')?.checked)b.height=e.target.value===''?'auto':clamp(e.target.value,30,1000);emit();});
    $('veBmWidthAuto')?.addEventListener('change',e=>{b.width=e.target.checked?'auto':180;emit();});
    $('veBmHeightAuto')?.addEventListener('change',e=>{b.height=e.target.checked?'auto':90;emit();});
    $('veBmBorderColor')?.addEventListener('input',e=>{b.borderColor=e.target.value;emit();});
    $('veBmBorderStyle')?.addEventListener('change',e=>{b.borderStyle=e.target.value;emit();});
    $('veBmBoxSizing')?.addEventListener('change',e=>{b.boxSizing=e.target.value;emit();});

    let drag=null;
    section.addEventListener('pointerdown',e=>{
      const h=e.target.closest('[data-bm-group]'); if(!h)return;
      const group=h.dataset.bmGroup, side=h.dataset.bmSide;
      drag={group,side,startX:e.clientX,startY:e.clientY,startValue:num(b[group][side]),pointerId:e.pointerId};
      h.setPointerCapture?.(e.pointerId);
      section.classList.add('is-dragging');
      e.preventDefault();e.stopPropagation();
    });
    section.addEventListener('pointermove',e=>{
      if(!drag)return;
      const side=drag.side, group=drag.group;
      const d=(side==='l'?drag.startX-e.clientX:side==='r'?e.clientX-drag.startX:side==='t'?drag.startY-e.clientY:e.clientY-drag.startY)/2;
      const min=group==='margin'?-200:0,max=group==='border'?30:200;
      b[group][side]=clamp(Math.round(drag.startValue+d),min,max);
      render();
      emitVisual('box-model',css(),b);
      e.preventDefault();
    });
    const end=()=>{if(!drag)return;drag=null;section.classList.remove('is-dragging');emit();};
    section.addEventListener('pointerup',end);section.addEventListener('pointercancel',end);

    section.addEventListener('click',e=>{
      const action=e.target.closest('[data-bm-action]');
      if(action){
        const a=action.dataset.bmAction;
        if(a==='uniform-margin'){const v=num(b.margin.t);b.margin={t:v,r:v,b:v,l:v};}
        else if(a==='uniform-padding'){const v=num(b.padding.t);b.padding={t:v,r:v,b:v,l:v};}
        else if(a==='reset'){Object.assign(b,{margin:{t:16,r:16,b:16,l:16},border:{t:1,r:1,b:1,l:1},padding:{t:16,r:16,b:16,l:16},width:'auto',height:'auto',borderColor:'#6ea8ff',borderStyle:'solid',boxSizing:'border-box'});}
        emit();return;
      }
      const p=e.target.closest('[data-bm-preset]');
      if(p){
        const preset=p.dataset.bmPreset;
        const presets={
          compact:{m:8,p:8,w:'auto',h:'auto'},
          card:{m:16,p:20,w:320,h:180},
          spacious:{m:24,p:32,w:'auto',h:'auto'}
        }[preset];
        if(presets){b.margin={t:presets.m,r:presets.m,b:presets.m,l:presets.m};b.padding={t:presets.p,r:presets.p,b:presets.p,l:presets.p};b.width=presets.w;b.height=presets.h;emit();}
        return;
      }
      const copy=e.target.closest('[data-ve-copy]');
      if(copy){const el=$(copy.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');copy.textContent='Copiato';setTimeout(()=>copy.textContent='Copia',800);}
    });
    render();
  }

  function improveHints(){
    const defs={
      '#veFlex':'<strong>Flexbox</strong> è la scelta tipica per distribuire elementi su una direzione principale. Usa <code>gap</code> per la distanza tra figli; usa le proprietà dell\'item solo quando vuoi cambiare un singolo elemento.',
      '#veGrid':'<strong>Grid</strong> è più adatto a righe + colonne. Trascina le linee per cambiare le proporzioni delle tracce; usa <code>gap</code> per la distanza tra celle.',
      '#veClipPoints':'<strong>Clip Path</strong> modifica la forma visibile dell\'elemento, non il suo spazio nel layout. Per spostare davvero l\'elemento usa layout/position/transform.',
      '#veBezier':'<strong>Cubic-bezier</strong> cambia la velocità nel tempo, non la proprietà finale. È soprattutto utile per transition e animation.',
      '#veTransition':'<strong>Transition</strong> è pensata per passaggi tra due stati, per esempio normale → hover. Per sequenze con più tappe usa <strong>Animation Studio</strong>.'
    };
    Object.entries(defs).forEach(([sel,html])=>{const el=document.querySelector(sel);if(!el||el.querySelector('.ve-usage-hint'))return;const p=document.createElement('div');p.className='ve-usage-hint';p.innerHTML=html;el.querySelector('.section-title-row')?.after(p);});
  }

  function styles(){
    if($('cvb-phase1-ux2-style'))return;
    const s=document.createElement('style');s.id='cvb-phase1-ux2-style';s.textContent=`
      .ve-boxmodel-stage-ux2{height:300px;padding:8px 6px;background:linear-gradient(135deg,rgba(232,164,94,.035),rgba(79,211,139,.035));overflow:hidden}
      .ve-boxmodel-canvas-ux2{position:relative;display:grid;place-items:center;margin:auto;max-width:100%;user-select:none;touch-action:none}
      .ve-bm-margin-zone,.ve-bm-border-zone,.ve-bm-padding-zone,.ve-bm-content-zone{position:absolute;display:grid;place-items:center;box-sizing:border-box}
      .ve-bm-margin-zone{inset:0;border:1px dashed rgba(232,164,94,.75);background:repeating-linear-gradient(45deg,rgba(232,164,94,.06) 0 8px,rgba(232,164,94,.12) 8px 16px);pointer-events:none}
      .ve-bm-border-zone{border-style:solid;border-color:var(--bm-border-color,#6ea8ff);background:rgba(110,168,255,.05);pointer-events:none}
      .ve-bm-padding-zone{border:1px dashed rgba(79,211,139,.75);background:rgba(79,211,139,.07);pointer-events:none}
      .ve-bm-content-zone{background:rgba(156,124,255,.18);border:1px solid rgba(156,124,255,.75);border-radius:8px;color:#ebe4ff;font:700 11px ui-monospace,monospace;pointer-events:none}
      .ve-bm-zone-label{position:absolute;top:4px;left:6px;font:700 8px ui-monospace,monospace;color:#d5dfef;opacity:.9}
      .ve-bm-outer-label{margin:0 0 2px 4px;color:#c59a6b;font:700 8px ui-monospace,monospace;text-align:left}
      .ve-bm-drag-handle{position:absolute;width:84px;height:32px;border:2px solid #fff;border-radius:999px;transform:translate(-50%,-50%);z-index:10;cursor:grab;touch-action:none;box-shadow:0 3px 10px rgba(0,0,0,.32);font:700 10px ui-monospace,monospace;color:#10131a;display:grid;place-items:center;padding:0}
      .ve-bm-drag-handle::after{content:'↕';opacity:.6;margin-left:4px}.ve-bm-drag-handle[data-bm-side='l']::after,.ve-bm-drag-handle[data-bm-side='r']::after{content:'↔'}
      .ve-bm-drag-margin{background:#f0ad62}.ve-bm-drag-padding{background:#4fd38b}
      .ve-bm-drag-handle:active{cursor:grabbing;transform:translate(-50%,-50%) scale(.98)}
      .ve-bm-guide-row{position:absolute;left:10px;right:10px;bottom:5px;display:flex;justify-content:space-between;color:#8592a5;font-size:8px;pointer-events:none}
      .ve-bm-target{display:flex;gap:7px;align-items:center;margin:8px 0;padding:8px 9px;border:1px dashed var(--border);border-radius:8px;background:#10151e;min-width:0}
      .ve-bm-target span{color:var(--muted);font-size:9px}.ve-bm-target code{min-width:0;overflow:auto;white-space:nowrap;color:#cfe0ff;font-size:9px}
      .ve-bm-section-head{display:flex;align-items:center;justify-content:space-between;margin:13px 0 6px}.ve-bm-section-head h3{margin:0;font-size:12px}.ve-bm-section-head h3 small{color:var(--muted);font-weight:400;font-size:9px}.ve-bm-section-head button{padding:5px 7px;font-size:9px}
      .ve-bm-number-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}.ve-bm-number-grid .mini-field{position:relative}.ve-bm-number-grid .mini-field small,.ve-bm-size-grid .mini-field small{color:var(--muted);font-size:8px}
      .ve-bm-note{margin-top:7px;color:var(--muted);font-size:9px;line-height:1.35}.ve-bm-note code{color:#cfe0ff}
      .ve-bm-size-grid{grid-template-columns:1fr 1fr!important}
      .ve-bm-quick-help{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:9px 0}.ve-bm-quick-help>div{padding:7px 8px;border:1px solid var(--border);border-radius:8px;background:#121823;min-width:0}.ve-bm-quick-help b{display:block;font-size:10px;margin-bottom:3px}.ve-bm-quick-help span{display:block;color:var(--muted);font-size:8px;line-height:1.3}
      .ve-bm-usage{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding:8px;border:1px dashed var(--border);border-radius:8px;background:#10151e;color:var(--muted);font-size:9px;line-height:1.35}.ve-bm-usage strong{width:100%;color:#dbe7f8;font-size:10px}.ve-bm-usage span{padding:4px 6px;border:1px solid rgba(127,127,127,.17);border-radius:6px}.ve-bm-usage code{color:#cfe0ff}
      .ve-usage-hint{margin:8px 0;padding:8px 9px;border:1px dashed var(--border);border-radius:8px;background:#10151e;color:var(--muted);font-size:9px;line-height:1.4}.ve-usage-hint strong{color:#dbe7f8}.ve-usage-hint code{color:#cfe0ff}
      .visual-editor-section.is-dragging,.visual-editor-section.is-dragging *{overscroll-behavior:contain}
      @media(max-width:800px){.ve-bm-quick-help{grid-template-columns:1fr 1fr}.ve-bm-number-grid{grid-template-columns:1fr 1fr!important}}
      @media(max-width:520px){.ve-boxmodel-stage-ux2{height:280px}.ve-boxmodel-canvas-ux2{transform:scale(.88);transform-origin:center}.ve-bm-drag-handle{width:76px;height:30px;font-size:9px}.ve-bm-size-grid{grid-template-columns:1fr!important}.ve-bm-quick-help{grid-template-columns:1fr 1fr}}
    `;document.head.appendChild(s);
  }

  function api(){return window.CVB_CORE_API||null;}
  function raw(selector,key){return api()?.getProperty?.(selector,key)?.value||'';}
  function parseFour(v, fallback){
    const parts=String(v||'').trim().split(/\s+/).filter(Boolean);
    if(!parts.length)return fallback.slice();
    const n=parts.map(x=>{const m=x.match(/^(-?\d+(?:\.\d+)?)px$/);return m?Number(m[1]):null;});
    if(n.some(x=>x===null))return fallback.slice();
    if(n.length===1)return [n[0],n[0],n[0],n[0]];
    if(n.length===2)return [n[0],n[1],n[0],n[1]];
    if(n.length===3)return [n[0],n[1],n[2],n[1]];
    return [n[0],n[1],n[2],n[3]];
  }
  function syncBoxFromCore(){
    const selector=api()?.getSelectedSelector?.();
    if(!selector)return;
    const b=defaults();
    const m=parseFour(raw(selector,'margin'),[b.margin.t,b.margin.r,b.margin.b,b.margin.l]);
    const p=parseFour(raw(selector,'padding'),[b.padding.t,b.padding.r,b.padding.b,b.padding.l]);
    const bw=parseFour(raw(selector,'border-width'),[b.border.t,b.border.r,b.border.b,b.border.l]);
    b.margin={t:m[0],r:m[1],b:m[2],l:m[3]};
    b.padding={t:p[0],r:p[1],b:p[2],l:p[3]};
    b.border={t:bw[0],r:bw[1],b:bw[2],l:bw[3]};
    const width=raw(selector,'width'),height=raw(selector,'height');
    if(width==='auto' || width==='') b.width='auto'; else if(/^\d+(?:\.\d+)?px$/.test(width)) b.width=Number.parseFloat(width);
    if(height==='auto' || height==='') b.height='auto'; else if(/^\d+(?:\.\d+)?px$/.test(height)) b.height=Number.parseFloat(height);
    const bs=raw(selector,'border-style');if(bs)b.borderStyle=bs.split(/\s+/)[0]||b.borderStyle;
    const bc=raw(selector,'border-color');if(/^#[0-9a-f]{3,8}$/i.test(bc))b.borderColor=bc;
    const bx=raw(selector,'box-sizing');if(bx)b.boxSizing=bx;
    render();
  }
  function installSelectionSync(){
    const node=$('controlSelector');
    if(node){
      let last='';
      const run=()=>{const sel=api()?.getSelectedSelector?.()||'';if(!sel||sel===last)return;last=sel;window.setTimeout(syncBoxFromCore,30);};
      new MutationObserver(run).observe(node,{childList:true,characterData:true,subtree:true});
      run();
    }
    $('previewFrame')?.addEventListener('load',()=>window.setTimeout(syncBoxFromCore,30));
  }

  function init(){
    styles();
    replace();
    improveHints();
    syncBoxFromCore();
    installSelectionSync();
    VBVE.phase1UX2={version:'1.1',reflow:render,syncBox:syncBoxFromCore};
  }
  VBVE.ready(()=>setTimeout(init,20));
})();
