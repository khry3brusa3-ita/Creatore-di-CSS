(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  if(!VBVE) return;
  const $=VBVE.$, num=VBVE.num, esc=VBVE.esc, emitVisual=VBVE.emitVisual;

  function copy(root,e){
    const b=e.target.closest('[data-ve-copy]');
    if(!b || !root.contains(b)) return false;
    const el=$(b.dataset.veCopy);
    const text=el?.textContent||'';
    navigator.clipboard?.writeText(text);
    b.textContent='Copiato';
    setTimeout(()=>b.textContent='Copia',800);
    return true;
  }

  function boxDefaults(){
    const b=VBVE.state.boxModel||{};
    b.margin={t:16,r:16,b:16,l:16,...(b.margin||{})};
    b.border={t:2,r:2,b:2,l:2,...(b.border||{})};
    b.padding={t:18,r:18,b:18,l:18,...(b.padding||{})};
    if(!('width' in b)) b.width=180;
    if(!('height' in b)) b.height=90;
    if(!b.borderColor) b.borderColor='#6ea8ff';
    if(!b.borderStyle) b.borderStyle='solid';
    if(!b.boxSizing) b.boxSizing='border-box';
    VBVE.state.boxModel=b;
    return b;
  }
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,num(v,min)));
  const visualThickness=v=>8+Math.min(34,Math.max(0,num(v))*0.18);

  function boxCss(){
    const b=boxDefaults(), f=v=>Math.round(clamp(v,0,200));
    const width=b.width==='auto'?'auto':`${Math.max(40,clamp(b.width,40,500))}px`;
    const height=b.height==='auto'?'auto':`${Math.max(30,clamp(b.height,30,300))}px`;
    return [
      `margin: ${f(b.margin.t)}px ${f(b.margin.r)}px ${f(b.margin.b)}px ${f(b.margin.l)}px;`,
      `border-width: ${Math.round(clamp(b.border.t,0,30))}px ${Math.round(clamp(b.border.r,0,30))}px ${Math.round(clamp(b.border.b,0,30))}px ${Math.round(clamp(b.border.l,0,30))}px;`,
      `border-style: ${b.borderStyle||'solid'};`,
      `border-color: ${b.borderColor||'#6ea8ff'};`,
      `padding: ${f(b.padding.t)}px ${f(b.padding.r)}px ${f(b.padding.b)}px ${f(b.padding.l)}px;`,
      `width: ${width};`,
      `height: ${height};`,
      `box-sizing: ${b.boxSizing||'border-box'};`
    ].join('\n');
  }

  function renderBox(){
    const b=boxDefaults(), stage=$('veBoxModelStage'), canvas=$('veBoxModelCanvas');
    const out=$('veBoxModelOutput');
    if(out) out.textContent=boxCss();
    const values={
      veBmMt:b.margin.t,veBmMr:b.margin.r,veBmMb:b.margin.b,veBmMl:b.margin.l,
      veBmBt:b.border.t,veBmBr:b.border.r,veBmBb:b.border.b,veBmBl:b.border.l,
      veBmPt:b.padding.t,veBmPr:b.padding.r,veBmPb:b.padding.b,veBmPl:b.padding.l
    };
    Object.entries(values).forEach(([id,v])=>{const e=$(id);if(e)e.value=Math.round(num(v));});
    const w=$('veBmWidth'),h=$('veBmHeight');
    if(w)w.value=b.width==='auto'?'':b.width;
    if(h)h.value=b.height==='auto'?'':b.height;
    const wa=$('veBmWidthAuto'),ha=$('veBmHeightAuto');
    if(wa)wa.checked=b.width==='auto';
    if(ha)ha.checked=b.height==='auto';
    const bc=$('veBmBorderColor');if(bc)bc.value=b.borderColor||'#6ea8ff';
    const bs=$('veBmBorderStyle');if(bs)bs.value=b.borderStyle||'solid';
    const bi=$('veBmBoxSizing');if(bi)bi.value=b.boxSizing||'border-box';
    if(!stage||!canvas)return;

    const M={t:visualThickness(b.margin.t),r:visualThickness(b.margin.r),b:visualThickness(b.margin.b),l:visualThickness(b.margin.l)};
    const B={t:Math.max(4,visualThickness(b.border.t)*0.45),r:Math.max(4,visualThickness(b.border.r)*0.45),b:Math.max(4,visualThickness(b.border.b)*0.45),l:Math.max(4,visualThickness(b.border.l)*0.45)};
    const P={t:visualThickness(b.padding.t),r:visualThickness(b.padding.r),b:visualThickness(b.padding.b),l:visualThickness(b.padding.l)};
    const outerW=320, outerH=225;
    const borderW=Math.max(120,outerW-M.l-M.r), borderH=Math.max(100,outerH-M.t-M.b);
    const padW=Math.max(90,borderW-B.l-B.r), padH=Math.max(70,borderH-B.t-B.b);
    const contentW=Math.max(56,padW-P.l-P.r), contentH=Math.max(38,padH-P.t-P.b);
    canvas.style.width=`${outerW}px`;canvas.style.height=`${outerH}px`;
    const border=$('veBoxModelBorderLayer'),padding=$('veBoxModelPaddingLayer'),content=$('veBoxModelContent');
    if(border){border.style.width=`${borderW}px`;border.style.height=`${borderH}px`;border.style.borderTopWidth=`${B.t}px`;border.style.borderRightWidth=`${B.r}px`;border.style.borderBottomWidth=`${B.b}px`;border.style.borderLeftWidth=`${B.l}px`;}
    if(padding){padding.style.width=`${padW}px`;padding.style.height=`${padH}px`;padding.style.paddingTop=`${P.t}px`;padding.style.paddingRight=`${P.r}px`;padding.style.paddingBottom=`${P.b}px`;padding.style.paddingLeft=`${P.l}px`;}
    if(content){content.style.width=`${contentW}px`;content.style.height=`${contentH}px`;}
    canvas.style.setProperty('--bm-margin-color','#e8a45e');
    canvas.style.setProperty('--bm-padding-color','#4fd38b');
    canvas.style.setProperty('--bm-border-color',b.borderColor||'#6ea8ff');

    const handles=canvas.querySelectorAll('[data-bm-group]');
    handles.forEach(h=>{
      const g=h.dataset.bmGroup,s=h.dataset.bmSide;
      const map={
        margin:{t:[50,Math.max(7,M.t/outerH*100)],r:[Math.max(93,100-M.r/outerW*100),50],b:[50,Math.max(93,100-M.b/outerH*100)],l:[Math.max(7,M.l/outerW*100),50]},
        border:{t:[50,(M.t+B.t*0.5)/outerH*100],r:[100-(M.r+B.r*0.5)/outerW*100,50],b:[50,100-(M.b+B.b*0.5)/outerH*100],l:[(M.l+B.l*0.5)/outerW*100,50]},
        padding:{t:[50,(M.t+B.t+P.t*0.35)/outerH*100],r:[100-(M.r+B.r+P.r*0.35)/outerW*100,50],b:[50,100-(M.b+B.b+P.b*0.35)/outerH*100],l:[(M.l+B.l+P.l*0.35)/outerW*100,50]}
      };
      const pos=map[g]?.[s];if(!pos)return;
      h.style.left=`${pos[0]}%`;h.style.top=`${pos[1]}%`;
      const current=Math.round(num(b[g][s]));
      h.innerHTML=`<span>${g==='margin'?'M':'P'} ${current}px</span>`;
      h.setAttribute('aria-label',`${g} ${s}: ${current} pixel`);
    });
  }

  function refineBox(){
    const old=$('veBoxModel');
    if(!old || old.dataset.refined==='1') return;
    const b=boxDefaults();
    const section=document.createElement('section');
    section.className='panel-section visual-editor-section';
    section.id='veBoxModel';
    section.dataset.refined='1';
    section.innerHTML=`
      <div class="section-title-row"><h2>19. Editor grafico — Box Model</h2><span class="counter">visuale + drag</span></div>
      <p class="hint">Pensa a questo schema come a quattro strati: <strong>margin</strong> (spazio esterno), <strong>border</strong>, <strong>padding</strong> (spazio interno) e <strong>content</strong>. Trascina una maniglia oppure usa i valori sotto.</p>
      <div class="ve-boxmodel-legend"><span><i class="m"></i>Margin</span><span><i class="b"></i>Border</span><span><i class="p"></i>Padding</span><span><i class="c"></i>Content</span></div>
      <div class="ve-boxmodel-stage ve-boxmodel-stage-new" id="veBoxModelStage">
        <div class="ve-boxmodel-canvas" id="veBoxModelCanvas">
          <div class="ve-boxmodel-zone ve-boxmodel-margin-zone"><span>SPAZIO ESTERNO</span></div>
          <div class="ve-boxmodel-border-zone" id="veBoxModelBorderLayer">
            <span class="ve-boxmodel-zone-label">BORDER</span>
            <div class="ve-boxmodel-padding-zone" id="veBoxModelPaddingLayer">
              <span class="ve-boxmodel-zone-label">PADDING</span>
              <div class="ve-boxmodel-content-new" id="veBoxModelContent">CONTENT</div>
            </div>
          </div>
          ${['margin','border','padding'].flatMap(g=>['t','r','b','l'].map(side=>`<button type="button" class="ve-bm-handle ve-bm-${g}" data-bm-group="${g}" data-bm-side="${side}"></button>`)).join('')}
          <div class="ve-boxmodel-axis"><span>← spazio esterno →</span><b>elemento selezionato</b></div>
        </div>
      </div>
      <div class="ve-boxmodel-target"><span>Target</span><code>${esc(VBVE.$('controlSelector')?.textContent?.trim()||'elemento selezionato')}</code></div>
      <div class="ve-bm-section-head"><h3>Margin</h3><button type="button" data-bm-action="uniform-margin">Uniforma</button></div>
      <div class="ve-quad-grid">${[['veBmMt','Alto','t'],['veBmMr','Destra','r'],['veBmMb','Basso','b'],['veBmMl','Sinistra','l']].map(([id,l])=>`<label class="mini-field"><span>${l}</span><input id="${id}" type="number" min="0" max="200"></label>`).join('')}</div>
      <div class="ve-bm-section-head"><h3>Border</h3></div>
      <div class="ve-quad-grid">${[['veBmBt','Alto'],['veBmBr','Destra'],['veBmBb','Basso'],['veBmBl','Sinistra']].map(([id,l])=>`<label class="mini-field"><span>${l}</span><input id="${id}" type="number" min="0" max="30"></label>`).join('')}</div>
      <div class="ve-quad-grid"><label class="mini-field"><span>Stile</span><select id="veBmBorderStyle"><option>solid</option><option>dashed</option><option>dotted</option><option>double</option><option>groove</option><option>ridge</option><option>inset</option><option>outset</option><option>none</option></select></label><label class="mini-field"><span>Colore</span><input id="veBmBorderColor" type="color"></label></div>
      <div class="ve-bm-section-head"><h3>Padding</h3><button type="button" data-bm-action="uniform-padding">Uniforma</button></div>
      <div class="ve-quad-grid">${[['veBmPt','Alto'],['veBmPr','Destra'],['veBmPb','Basso'],['veBmPl','Sinistra']].map(([id,l])=>`<label class="mini-field"><span>${l}</span><input id="${id}" type="number" min="0" max="200"></label>`).join('')}</div>
      <div class="ve-bm-section-head"><h3>Dimensioni</h3></div>
      <div class="ve-quad-grid"><label class="mini-field"><span>Larghezza</span><input id="veBmWidth" type="number" min="40" max="500"></label><label class="mini-field"><span>Altezza</span><input id="veBmHeight" type="number" min="30" max="300"></label></div>
      <div class="ve-quad-grid"><label class="ve-linked"><input id="veBmWidthAuto" type="checkbox"> larghezza <code>auto</code></label><label class="ve-linked"><input id="veBmHeightAuto" type="checkbox"> altezza <code>auto</code></label></div>
      <label class="mini-field"><span>Box sizing</span><select id="veBmBoxSizing"><option>border-box</option><option>content-box</option></select></label>
      <div class="preset-row editor"><button data-bm-preset="0">0</button><button data-bm-preset="8">8px</button><button data-bm-preset="16">16px</button><button data-bm-preset="24">24px</button><button data-bm-action="reset">Reset</button></div>
      <div class="complex-output"><code id="veBoxModelOutput"></code><button type="button" data-ve-copy="veBoxModelOutput">Copia</button></div>`;

    old.replaceWith(section);

    const emit=()=>{renderBox();emitVisual('box-model',boxCss(),VBVE.state.boxModel);};
    const fields={
      veBmMt:['margin','t'],veBmMr:['margin','r'],veBmMb:['margin','b'],veBmMl:['margin','l'],
      veBmBt:['border','t'],veBmBr:['border','r'],veBmBb:['border','b'],veBmBl:['border','l'],
      veBmPt:['padding','t'],veBmPr:['padding','r'],veBmPb:['padding','b'],veBmPl:['padding','l']
    };
    Object.entries(fields).forEach(([id,[g,k]])=>$(id)?.addEventListener('input',e=>{b[g][k]=clamp(e.target.value,0,g==='border'?30:200);emit();}));
    $('veBmWidth')?.addEventListener('input',e=>{if(!$('veBmWidthAuto')?.checked)b.width=e.target.value===''?'auto':clamp(e.target.value,40,500);emit();});
    $('veBmHeight')?.addEventListener('input',e=>{if(!$('veBmHeightAuto')?.checked)b.height=e.target.value===''?'auto':clamp(e.target.value,30,300);emit();});
    $('veBmWidthAuto')?.addEventListener('change',e=>{b.width=e.target.checked?'auto':180;emit();});
    $('veBmHeightAuto')?.addEventListener('change',e=>{b.height=e.target.checked?'auto':90;emit();});
    $('veBmBorderColor')?.addEventListener('input',e=>{b.borderColor=e.target.value;emit();});
    $('veBmBorderStyle')?.addEventListener('change',e=>{b.borderStyle=e.target.value;emit();});
    $('veBmBoxSizing')?.addEventListener('change',e=>{b.boxSizing=e.target.value;emit();});

    let drag=null;
    section.addEventListener('pointerdown',e=>{
      const h=e.target.closest('[data-bm-group]');
      if(!h)return;
      drag={group:h.dataset.bmGroup,side:h.dataset.bmSide,startX:e.clientX,startY:e.clientY,startValue:num(b[h.dataset.bmGroup][h.dataset.bmSide]),pointerId:e.pointerId};
      h.setPointerCapture?.(e.pointerId);
      section.classList.add('is-dragging');
      e.preventDefault();
      e.stopPropagation();
    });
    section.addEventListener('pointermove',e=>{
      if(!drag)return;
      const {group,side}=drag;
      const delta=(side==='l'?drag.startX-e.clientX:side==='r'?e.clientX-drag.startX:side==='t'?drag.startY-e.clientY:e.clientY-drag.startY)/2;
      b[group][side]=clamp(Math.round(drag.startValue+delta),0,group==='border'?30:200);
      renderBox();
      emitVisual('box-model',boxCss(),b);
      e.preventDefault();
    });
    const end=()=>{drag=null;section.classList.remove('is-dragging');};
    section.addEventListener('pointerup',end);section.addEventListener('pointercancel',end);
    section.addEventListener('click',e=>{
      const action=e.target.closest('[data-bm-action]');
      if(action){
        const a=action.dataset.bmAction;
        if(a==='uniform-margin'){const v=b.margin.t;b.margin={t:v,r:v,b:v,l:v};}
        else if(a==='uniform-padding'){const v=b.padding.t;b.padding={t:v,r:v,b:v,l:v};}
        else if(a==='reset'){b.margin={t:16,r:16,b:16,l:16};b.border={t:2,r:2,b:2,l:2};b.padding={t:18,r:18,b:18,l:18};b.width=180;b.height=90;b.borderColor='#6ea8ff';b.borderStyle='solid';b.boxSizing='border-box';}
        emit();return;
      }
      const p=e.target.closest('[data-bm-preset]');
      if(p){const v=num(p.dataset.bmPreset);b.margin={t:v,r:v,b:v,l:v};b.padding={t:v,r:v,b:v,l:v};emit();return;}
      copy(section,e);
    });
    renderBox();
  }

  function refineClip(){
    const old=$('veClipPoints');
    if(!old || old.dataset.refined==='1')return;
    const st=VBVE.state.clipPoints||{points:[{x:15,y:15},{x:85,y:15},{x:85,y:85},{x:15,y:85}]};
    VBVE.state.clipPoints=st;
    const section=old.cloneNode(false);section.dataset.refined='1';
    section.innerHTML=`<div class="section-title-row"><h2>22. Editor grafico — Clip Path</h2><span class="counter">punti + overlay</span></div><p class="hint">I vertici sono sopra la forma, non dentro di essa: così restano sempre visibili mentre trascini.</p><div class="ve-clip-stage ve-clip-stage-new"><div id="veClipCanvas" class="ve-clip-canvas"><div id="veClipObject" class="ve-clip-object"></div><div id="veClipPointsLayer" class="ve-clip-points-layer"></div></div></div><div id="veClipPointsTable" class="ve-points-table"></div><div class="preset-row editor"><button id="veClipAddPoint" type="button">+ Punto</button><button data-cp-preset="triangle">Triangolo</button><button data-cp-preset="diamond">Diamante</button><button data-cp-preset="hex">Esagono</button><button data-cp-preset="reset">Reset</button></div><div class="complex-output"><code id="veClipOutput"></code><button type="button" data-ve-copy="veClipOutput">Copia</button></div>`;
    old.replaceWith(section);
    const value=()=>`polygon(${st.points.map(p=>`${Math.round(p.x)}% ${Math.round(p.y)}%`).join(', ')})`;
    const render=()=>{
      const obj=$('veClipObject'),layer=$('veClipPointsLayer'),table=$('veClipPointsTable'),out=$('veClipOutput');
      if(obj)obj.style.clipPath=value();
      if(layer)layer.innerHTML=st.points.map((p,i)=>`<button type="button" class="ve-clip-point" style="left:${p.x}%;top:${p.y}%" data-cp-point="${i}">P${i+1}</button>`).join('');
      if(table)table.innerHTML=st.points.map((p,i)=>`<div class="ve-point-row"><b>P${i+1}</b><input type="number" min="0" max="100" value="${Math.round(p.x)}" data-cp-index="${i}" data-cp-axis="x"><input type="number" min="0" max="100" value="${Math.round(p.y)}" data-cp-index="${i}" data-cp-axis="y"><button type="button" data-cp-remove="${i}">×</button></div>`).join('');
      if(out)out.textContent=`clip-path: ${value()};`;
    };
    const apply=()=>emitVisual('clip-path',value(),st);
    let active=null;
    section.addEventListener('pointerdown',e=>{const h=e.target.closest('[data-cp-point]');if(!h)return;active=Number(h.dataset.cpPoint);h.setPointerCapture?.(e.pointerId);section.classList.add('is-dragging');e.preventDefault();e.stopPropagation();});
    section.addEventListener('pointermove',e=>{if(active===null)return;const r=$('veClipCanvas').getBoundingClientRect(),p=st.points[active];p.x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100));p.y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));render();apply();e.preventDefault();});
    const end=()=>{active=null;section.classList.remove('is-dragging');};section.addEventListener('pointerup',end);section.addEventListener('pointercancel',end);
    section.addEventListener('input',e=>{if(!e.target.matches('[data-cp-index]'))return;const p=st.points[Number(e.target.dataset.cpIndex)];p[e.target.dataset.cpAxis]=Math.max(0,Math.min(100,num(e.target.value)));render();apply();});
    section.addEventListener('click',e=>{if(e.target.closest('#veClipAddPoint')){const pts=st.points,last=pts[pts.length-1]||{x:50,y:50},first=pts[0]||{x:50,y:50};pts.push({x:(last.x+first.x)/2,y:(last.y+first.y)/2});render();apply();return;}const rem=e.target.closest('[data-cp-remove]');if(rem&&st.points.length>3){st.points.splice(Number(rem.dataset.cpRemove),1);render();apply();return;}const presets={triangle:[{x:50,y:5},{x:95,y:95},{x:5,y:95}],diamond:[{x:50,y:5},{x:95,y:50},{x:50,y:95},{x:5,y:50}],hex:[{x:25,y:5},{x:75,y:5},{x:95,y:50},{x:75,y:95},{x:25,y:95},{x:5,y:50}],reset:[{x:15,y:15},{x:85,y:15},{x:85,y:85},{x:15,y:85}]};const pre=e.target.closest('[data-cp-preset]');if(pre){st.points=presets[pre.dataset.cpPreset].map(p=>({...p}));render();apply();return;}copy(section,e);});
    render();
  }

  function refineTransition(){
    const old=$('veTransition');
    if(!old || old.dataset.refined==='1')return;
    const t=VBVE.state.transition||{rows:[{property:'transform',duration:300,timing:'ease-out',delay:0}]};VBVE.state.transition=t;
    const section=old.cloneNode(false);section.dataset.refined='1';
    section.innerHTML=`<div class="section-title-row"><h2>24. Editor grafico — Transition</h2><span class="counter">preview reale</span></div><p class="hint">La prova usa davvero il timing della riga <code>transform</code> (o la prima riga disponibile), così il grafico corrisponde alla transizione generata.</p><div class="ve-transition-preview ve-transition-preview-new"><div class="ve-transition-track"><div id="veTransitionBall" class="ve-transition-ball"></div></div></div><div class="ve-transition-caption"><span>Inizio</span><span>Fine</span></div><button type="button" id="veTransitionPlay" class="primary">▶ Prova transizione</button><div id="veTransitionList" class="ve-transition-list"></div><div class="preset-row editor"><button data-tr-preset="snappy">Rapida</button><button data-tr-preset="soft">Morbida</button><button data-tr-preset="bounce">Elastica</button><button id="veTransitionAdd" type="button">+ Proprietà</button></div><div class="complex-output"><code id="veTransitionOutput"></code><button type="button" data-ve-copy="veTransitionOutput">Copia</button></div>`;
    old.replaceWith(section);
    const css=()=>t.rows.map(r=>`${r.property} ${Math.max(0,num(r.duration))}ms ${r.timing} ${Math.max(0,num(r.delay))}ms`).join(', ');
    const render=()=>{
      const list=$('veTransitionList'),out=$('veTransitionOutput');if(out)out.textContent=`transition: ${css()};`;
      if(list)list.innerHTML=t.rows.map((r,i)=>`<div class="ve-transition-row"><select data-tr-i="${i}" data-tr-k="property">${['all','opacity','transform','background-color','color','box-shadow','width','height','filter'].map(v=>`<option ${r.property===v?'selected':''}>${v}</option>`).join('')}</select><input type="number" min="0" max="10000" step="50" value="${r.duration}" data-tr-i="${i}" data-tr-k="duration"><select data-tr-i="${i}" data-tr-k="timing"><option ${r.timing==='ease'?'selected':''}>ease</option><option ${r.timing==='linear'?'selected':''}>linear</option><option ${r.timing==='ease-in'?'selected':''}>ease-in</option><option ${r.timing==='ease-out'?'selected':''}>ease-out</option><option ${r.timing==='ease-in-out'?'selected':''}>ease-in-out</option><option ${r.timing==='cubic-bezier(.25,.1,.25,1)'?'selected':''}>cubic-bezier(.25,.1,.25,1)</option></select><input type="number" min="0" max="10000" step="50" value="${r.delay}" data-tr-i="${i}" data-tr-k="delay"><button type="button" data-tr-remove="${i}">×</button></div>`).join('');
    };
    const apply=()=>{render();emitVisual('transition',css(),t);};
    section.addEventListener('input',e=>{if(!e.target.matches('[data-tr-i]'))return;const r=t.rows[Number(e.target.dataset.trI)];if(r)r[e.target.dataset.trK]=['property','timing'].includes(e.target.dataset.trK)?e.target.value:num(e.target.value);apply();});
    section.addEventListener('change',e=>{if(!e.target.matches('[data-tr-i]'))return;const r=t.rows[Number(e.target.dataset.trI)];if(r)r[e.target.dataset.trK]=['property','timing'].includes(e.target.dataset.trK)?e.target.value:num(e.target.value);apply();});
    section.addEventListener('click',e=>{
      const add=e.target.closest('#veTransitionAdd');if(add){t.rows.push({property:'opacity',duration:250,timing:'ease',delay:0});apply();return;}
      const rem=e.target.closest('[data-tr-remove]');if(rem&&t.rows.length>1){t.rows.splice(Number(rem.dataset.trRemove),1);apply();return;}
      const pre=e.target.closest('[data-tr-preset]');if(pre){const P={snappy:{duration:180,timing:'cubic-bezier(.2,.8,.2,1)'},soft:{duration:500,timing:'ease-in-out'},bounce:{duration:700,timing:'cubic-bezier(.34,1.56,.64,1)'}}[pre.dataset.trPreset];t.rows.forEach(r=>Object.assign(r,P));apply();return;}
      if(e.target.closest('#veTransitionPlay')){const ball=$('veTransitionBall'),r=t.rows.find(x=>x.property==='transform')||t.rows[0];if(!ball||!r)return;const duration=Math.max(0,num(r.duration)),delay=Math.max(0,num(r.delay));ball.style.transition=`transform ${duration}ms ${r.timing} ${delay}ms`;ball.style.transform='translateX(0)';requestAnimationFrame(()=>requestAnimationFrame(()=>ball.style.transform='translateX(calc(100% - 34px))'));window.setTimeout(()=>{ball.style.transition='none';ball.style.transform='translateX(0)';},duration+delay+120);return;}
      copy(section,e);
    });
    render();
  }

  function addStyles(){
    if($('cvb-phase1-refined-style'))return;
    const st=document.createElement('style');st.id='cvb-phase1-refined-style';st.textContent=`
      .ve-boxmodel-stage-new{padding:12px;background:linear-gradient(135deg,rgba(232,164,94,.04),rgba(79,211,139,.04));}
      .ve-boxmodel-canvas{position:relative;width:320px;height:225px;margin:auto;display:grid;place-items:center;user-select:none;touch-action:none;}
      .ve-boxmodel-zone,.ve-boxmodel-border-zone,.ve-boxmodel-padding-zone,.ve-boxmodel-content-new{position:absolute;display:grid;place-items:center;box-sizing:border-box;}
      .ve-boxmodel-margin-zone{inset:0;border:1px dashed rgba(232,164,94,.65);background:repeating-linear-gradient(45deg,rgba(232,164,94,.07) 0 8px,rgba(232,164,94,.13) 8px 16px);color:#f2bd82;font-size:9px;}
      .ve-boxmodel-border-zone{border-style:solid;background:rgba(110,168,255,.07);}
      .ve-boxmodel-padding-zone{background:rgba(79,211,139,.08);border:1px dashed rgba(79,211,139,.65);}
      .ve-boxmodel-content-new{background:rgba(156,124,255,.16);border:1px solid rgba(156,124,255,.7);border-radius:7px;color:#e2d9ff;font:700 10px ui-monospace,monospace;}
      .ve-boxmodel-zone-label{position:absolute;top:4px;left:5px;font:700 8px ui-monospace,monospace;color:#c8d4e5;pointer-events:none;}
      .ve-bm-handle{position:absolute;min-width:40px;height:24px;padding:0 5px;border:2px solid #fff;border-radius:999px;transform:translate(-50%,-50%);z-index:8;cursor:grab;touch-action:none;box-shadow:0 2px 8px rgba(0,0,0,.3);font:700 8px ui-monospace,monospace;color:#10131a;}
      .ve-bm-margin{background:#e8a45e}.ve-bm-border{background:#6ea8ff}.ve-bm-padding{background:#4fd38b}.ve-bm-handle:active{cursor:grabbing}.ve-boxmodel-canvas:has(.ve-bm-handle:hover) .ve-bm-handle{opacity:.72}.ve-bm-section-head{display:flex;align-items:center;justify-content:space-between;margin:13px 0 6px}.ve-bm-section-head h3{margin:0;font-size:12px}.ve-bm-section-head button{padding:5px 7px;font-size:9px}.ve-boxmodel-legend{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0;color:var(--muted);font-size:9px}.ve-boxmodel-legend span{display:inline-flex;align-items:center;gap:4px}.ve-boxmodel-legend i{width:9px;height:9px;border-radius:50%;display:inline-block}.ve-boxmodel-legend .m{background:#e8a45e}.ve-boxmodel-legend .b{background:#6ea8ff}.ve-boxmodel-legend .p{background:#4fd38b}.ve-boxmodel-legend .c{background:#9c7cff}.ve-boxmodel-target{display:flex;gap:6px;align-items:center;margin:8px 0;padding:7px 8px;border:1px dashed var(--border);border-radius:7px;background:#10151e;min-width:0}.ve-boxmodel-target span{color:var(--muted);font-size:9px}.ve-boxmodel-target code{min-width:0;overflow:auto;white-space:nowrap;color:#cfe0ff;font-size:9px}.ve-boxmodel-axis{position:absolute;left:8px;right:8px;bottom:5px;display:flex;justify-content:space-between;color:#8995a8;font-size:8px;pointer-events:none}.ve-boxmodel-axis b{font-weight:600}.ve-clip-stage-new{padding:14px}.ve-clip-canvas{position:relative;width:min(100%,300px);height:220px;margin:auto}.ve-clip-canvas #veClipObject{position:absolute;inset:24px 35px;background:linear-gradient(135deg,#4f8cff,#9c7cff);touch-action:none}.ve-clip-points-layer{position:absolute;inset:24px 35px;z-index:4;pointer-events:none}.ve-clip-point{position:absolute;transform:translate(-50%,-50%);width:28px;height:20px;padding:0;border:2px solid #111;border-radius:999px;background:#fff;color:#111;font:700 8px ui-monospace,monospace;cursor:grab;pointer-events:auto;touch-action:none;box-shadow:0 2px 7px rgba(0,0,0,.3)}.ve-clip-point:active{cursor:grabbing}.ve-transition-caption{display:flex;justify-content:space-between;margin:-2px 7% 7px;color:var(--muted);font-size:8px}.ve-transition-preview-new{padding:0 5%;}.ve-transition-preview-new .ve-transition-track{height:3px}.ve-transition-preview-new .ve-transition-ball{will-change:transform}
      .visual-editor-section.is-dragging,.visual-editor-section.is-dragging *{overscroll-behavior:contain}
      @media(max-width:520px){.ve-boxmodel-canvas{transform:scale(.9);transform-origin:center}.ve-boxmodel-stage-new{overflow:hidden}.ve-boxmodel-target{max-width:100%}}
    `;document.head.appendChild(st);
  }

  function init(){
    addStyles();
    refineBox();
    refineClip();
    refineTransition();
  }
  VBVE.ready(()=>setTimeout(init,0));
  VBVE.phase1Refinements={version:'1.1',init};
})();
