/*
 CSS Visual Builder — Extensions layer v2.0
 -------------------------------------------
 Mantiene app.js stabile e aggiunge:
 - @media
 - @container
 - @supports
 - @layer
 - @scope
 - @starting-style
 - proprietà CSS modificabili dentro ogni at-rule
*/
(function(){
  'use strict';

  const ext = window.CVB_EXTENSIONS = window.CVB_EXTENSIONS || {};
  ext.atRules = Array.isArray(ext.atRules) ? ext.atRules : [];
  ext.version = '2.7-special-at-rules';

  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
  const cssSafe = v => String(v ?? '').replace(/[{};]/g,'').trim();
  const cssDb = Array.isArray(window.CSS_PROPERTY_DATABASE) ? window.CSS_PROPERTY_DATABASE : [];

  function selectedSelector(){
    return $('controlSelector')?.textContent?.trim() || $('selectedSelector')?.textContent?.trim() || 'body';
  }

  function defaultRule(type){
    const sel = selectedSelector();
    const base = {type, selector:sel, search:'', styles:{}};
    if(type==='media') return {...base,mediaType:'screen',feature:'min-width',value:'768px'};
    if(type==='container') return {...base,name:'',feature:'min-width',value:'600px'};
    if(type==='supports') return {...base,property:'display',value:'grid'};
    if(type==='layer') return {...base,name:'components'};
    if(type==='scope') return {...base,root:sel,limit:''};
    if(type==='starting-style') return base;
    return base;
  }

  function addAtRule(type){
    ext.atRules.push(defaultRule(type));
    renderAtRules();
    refresh();
  }

  function ruleText(r){
    if(r.type==='media') return `@media ${cssSafe(r.mediaType||'screen')} and (${cssSafe(r.feature||'min-width')}: ${cssSafe(r.value||'768px')})`;
    if(r.type==='container') return `@container${cssSafe(r.name)?` ${cssSafe(r.name)}`:''} (${cssSafe(r.feature||'min-width')}: ${cssSafe(r.value||'600px')})`;
    if(r.type==='supports') return `@supports (${cssSafe(r.property||'display')}: ${cssSafe(r.value||'grid')})`;
    if(r.type==='layer') return `@layer ${cssSafe(r.name)||'components'}`;
    if(r.type==='scope') return `@scope${cssSafe(r.root)?` (${cssSafe(r.root)})`:''}${cssSafe(r.limit)?` to (${cssSafe(r.limit)})`:''}`;
    if(r.type==='starting-style') return '@starting-style';
    return '';
  }

  function enabledEntries(r){
    return Object.entries(r.styles||{}).filter(([,e])=>e && e.enabled && String(e.value??'').trim()!=='');
  }

  function blockText(r){
    const sel = cssSafe(r.selector || 'body') || 'body';
    const entries = enabledEntries(r);
    const declaration = entries.length
      ? entries.map(([k,e])=>`    ${cssSafe(k)}: ${String(e.value).replace(/[{}]/g,'')};`).join('\n')
      : '    /* Nessuna proprietà attiva */';
    return `${ruleText(r)} {\n  ${sel} {\n${declaration}\n  }\n}`;
  }

  function extensionCss(){
    return [ext.atRules.map(blockText).filter(Boolean).join('\n\n'), timelinesCss()].filter(Boolean).join('\n\n');
  }

  function refresh(){
    if(typeof window.updateCssAndPreview === 'function') window.updateCssAndPreview();
    else if(typeof window.renderAll === 'function') window.renderAll();
  }

  function setRuleValue(index,key,value){
    const r=ext.atRules[index]; if(!r) return;
    r[key]=value;
    renderAtRules();
    refresh();
  }

  function setRuleProperty(index,key,value,enabled=true,rerender=true){
    const r=ext.atRules[index]; if(!r) return;
    r.styles=r.styles||{};
    if(enabled){
      r.styles[key]={enabled:true,value:String(value??'')};
    }else{
      delete r.styles[key];
    }
    if(rerender) renderAtRules();
    refresh();
  }

  function clearRuleProperty(index,key){
    const r=ext.atRules[index]; if(!r?.styles) return;
    delete r.styles[key];
    renderAtRules();
    refresh();
  }

  function propertyDefinition(key){ return cssDb.find(d=>d.key===key) || {key,label:key,category:'Personalizzata',type:'text',defaultValue:''}; }

  function propertyEditor(index,d,entry){
    const value=entry?.value ?? d.defaultValue ?? '';
    const type=d.type || 'text';
    let input;
    if(type==='color'){
      input=`<input type="color" value="${esc(/^#[0-9a-f]{3,8}$/i.test(value)?value:'#000000')}" data-rule-index="${index}" data-rule-prop="${esc(d.key)}" data-rule-kind="color">`;
    }else if(type==='select'){
      const opts=(d.options||[]).map(o=>`<option value="${esc(o)}" ${String(o)===String(value)?'selected':''}>${esc(o)}</option>`).join('');
      input=`<select data-rule-index="${index}" data-rule-prop="${esc(d.key)}" data-rule-kind="select">${opts}</select>`;
    }else if(type==='range-number'){
      const min=d.min??-1000,max=d.max??1000,step=d.step??1;
      input=`<div class="rule-range"><input type="range" min="${min}" max="${max}" step="${step}" value="${Number(value)||0}" data-rule-index="${index}" data-rule-prop="${esc(d.key)}" data-rule-kind="range"><input class="rule-number" type="number" min="${min}" max="${max}" step="${step}" value="${Number(value)||0}" data-rule-index="${index}" data-rule-prop="${esc(d.key)}" data-rule-kind="number"><span>${esc(d.unit||'')}</span></div>`;
    }else if(type==='box-model' || type==='radius-4' || type==='shadow' || type==='text-shadow' || type==='transform-advanced' || type==='filter-editor' || type==='gradient-visual' || type==='background-visual' || type==='border-visual' || type==='clip-visual' || type==='grid-template' || type==='position-2d' || type==='transition' || type==='animation' || type==='motion-visual'){
      input=`<input type="text" value="${esc(value)}" placeholder="${esc(d.defaultValue||'es. 10px / auto / ...')}" data-rule-index="${index}" data-rule-prop="${esc(d.key)}" data-rule-kind="text">`;
    }else{
      input=`<input type="text" value="${esc(value)}" placeholder="${esc(d.defaultValue||'Valore CSS')}" data-rule-index="${index}" data-rule-prop="${esc(d.key)}" data-rule-kind="text">`;
    }
    return `<div class="rule-property"><div class="rule-property-head"><label>${esc(d.label||d.key)} <span>${esc(d.key)}</span></label><button type="button" data-rule-remove="${index}" data-rule-prop-remove="${esc(d.key)}">×</button></div>${input}</div>`;
  }

  function renderProperties(r,index){
    const styles=r.styles||{};
    const keys=Object.keys(styles);
    const q=String(r.search||'').trim().toLowerCase();
    const visible=keys.filter(k=>!q||`${k} ${propertyDefinition(k).label} ${propertyDefinition(k).category}`.toLowerCase().includes(q));
    const active=visible.map(k=>propertyEditor(index,propertyDefinition(k),styles[k])).join('');
    const options=cssDb.filter(d=>!keys.includes(d.key)).sort((a,b)=>(a.label||a.key).localeCompare(b.label||b.key)).map(d=>`<option value="${esc(d.key)}">${esc(d.label||d.key)} · ${esc(d.key)}</option>`).join('');
    return `<div class="rule-properties">
      <div class="rule-prop-toolbar"><input class="rule-search" type="search" placeholder="Cerca proprietà..." value="${esc(r.search||'')}" data-rule-index="${index}" data-rule-search><select data-rule-index="${index}" data-rule-add-property><option value="">+ Aggiungi proprietà CSS</option>${options}</select></div>
      <div class="rule-property-list">${active || '<div class="hint">Nessuna proprietà attiva in questa regola.</div>'}</div>
    </div>`;
  }

  function renderCard(r,i){
    let fields='';
    if(r.type==='media') fields=`
      <label class="mini-field"><span>Tipo</span><select data-at-index="${i}" data-at-key="mediaType"><option value="screen" ${r.mediaType==='screen'?'selected':''}>screen</option><option value="print" ${r.mediaType==='print'?'selected':''}>print</option><option value="all" ${r.mediaType==='all'?'selected':''}>all</option></select></label>
      <label class="mini-field"><span>Condizione</span><select data-at-index="${i}" data-at-key="feature"><option value="min-width" ${r.feature==='min-width'?'selected':''}>min-width</option><option value="max-width" ${r.feature==='max-width'?'selected':''}>max-width</option><option value="orientation" ${r.feature==='orientation'?'selected':''}>orientation</option><option value="prefers-color-scheme" ${r.feature==='prefers-color-scheme'?'selected':''}>prefers-color-scheme</option><option value="hover" ${r.feature==='hover'?'selected':''}>hover</option></select></label>
      <label class="mini-field wide"><span>Valore</span><input value="${esc(r.value||'768px')}" data-at-index="${i}" data-at-key="value"></label>`;
    if(r.type==='container') fields=`
      <label class="mini-field"><span>Nome container</span><input value="${esc(r.name||'')}" placeholder="sidebar" data-at-index="${i}" data-at-key="name"></label>
      <label class="mini-field"><span>Condizione</span><select data-at-index="${i}" data-at-key="feature"><option value="min-width" ${r.feature==='min-width'?'selected':''}>min-width</option><option value="max-width" ${r.feature==='max-width'?'selected':''}>max-width</option><option value="orientation" ${r.feature==='orientation'?'selected':''}>orientation</option></select></label>
      <label class="mini-field wide"><span>Valore</span><input value="${esc(r.value||'600px')}" data-at-index="${i}" data-at-key="value"></label>`;
    if(r.type==='supports') fields=`
      <label class="mini-field"><span>Proprietà</span><input value="${esc(r.property||'display')}" data-at-index="${i}" data-at-key="property"></label>
      <label class="mini-field"><span>Valore</span><input value="${esc(r.value||'grid')}" data-at-index="${i}" data-at-key="value"></label>`;
    if(r.type==='layer') fields=`<label class="mini-field wide"><span>Nome layer</span><input value="${esc(r.name||'components')}" data-at-index="${i}" data-at-key="name"></label>`;
    if(r.type==='scope') fields=`
      <label class="mini-field"><span>Root</span><input value="${esc(r.root||'')}" placeholder=".card" data-at-index="${i}" data-at-key="root"></label>
      <label class="mini-field"><span>Limite opzionale</span><input value="${esc(r.limit||'')}" placeholder=".footer" data-at-index="${i}" data-at-key="limit"></label>`;
    if(r.type==='starting-style') fields=`<div class="hint wide">Qui puoi definire lo stato iniziale. Le proprietà attive vengono inserite dentro <code>@starting-style</code>.</div>`;

    return `<div class="at-rule-card">
      <div class="at-rule-head"><div><div class="at-rule-title">@${esc(r.type)}</div><div class="at-rule-code">${esc(ruleText(r))}</div></div><button type="button" class="at-rule-remove" data-at-remove="${i}">Rimuovi</button></div>
      <div class="at-rule-grid">${fields}<label class="mini-field wide"><span>Selettore</span><input value="${esc(r.selector||selectedSelector())}" data-at-index="${i}" data-at-key="selector"></label></div>
      ${renderProperties(r,i)}
      <div class="at-rule-preview"><code>${esc(blockText(r))}</code></div>
    </div>`;
  }

  function renderAtRules(){
    const host=$('atRules'),count=$('atRuleCount'); if(!host) return;
    if(count) count.textContent=String(ext.atRules.length);
    host.innerHTML=ext.atRules.length ? ext.atRules.map(renderCard).join('') : '<span class="hint">Nessuna regola. Aggiungi una regola CSS per iniziare.</span>';
  }



  // ---------------------------------------------------------------------------
  // Scroll-driven animations: named scroll/view timelines + animation attachment
  // ---------------------------------------------------------------------------
  ext.timelines = Array.isArray(ext.timelines) ? ext.timelines : [];

  function defaultTimeline(type){
    const sel = selectedSelector();
    if(type === 'scroll') return {
      type:'scroll', name:'--scroll-timeline', selector:sel, axis:'block', scroller:sel
    };
    return {
      type:'view', name:'--view-timeline', selector:sel, axis:'block', inset:'0% 0%'
    };
  }

  function timelineCss(t){
    const name = cssSafe(t.name || '--timeline') || '--timeline';
    const selector = cssSafe(t.selector || selectedSelector()) || 'body';
    if(t.type === 'scroll'){
      const axis = cssSafe(t.axis || 'block') || 'block';
      const scroller = cssSafe(t.scroller || selector) || selector;
      return `${scroller} { scroll-timeline: ${name} ${axis}; }`;
    }
    const axis = cssSafe(t.axis || 'block') || 'block';
    const inset = cssSafe(t.inset || '0% 0%') || '0% 0%';
    return `${selector} { view-timeline: ${name} ${axis}; view-timeline-inset: ${inset}; }`;
  }

  function animationTimelineCss(t){
    const selector = cssSafe(t.target || selectedSelector()) || 'body';
    let timeline = t.mode === 'view-anonymous' ? `view(${cssSafe(t.axis||'block')||'block'})`
      : t.mode === 'scroll-anonymous' ? `scroll(${cssSafe(t.axis||'block')||'block'} root)`
      : cssSafe(t.name || '--timeline') || '--timeline';
    const lines = [`  animation-timeline: ${timeline};`];
    if(t.range) lines.push(`  animation-range: ${cssSafe(t.range)};`);
    if(t.rangeStart) lines.push(`  animation-range-start: ${cssSafe(t.rangeStart)};`);
    if(t.rangeEnd) lines.push(`  animation-range-end: ${cssSafe(t.rangeEnd)};`);
    return `${selector} {\n${lines.join('\n')}\n}`;
  }

  function timelinesCss(){
    return ext.timelines.map(t=>{
      if(t.kind === 'attachment') return animationTimelineCss(t);
      return timelineCss(t);
    }).join('\n\n');
  }

  function renderTimelines(){
    const host=$('scrollTimelineRules'), count=$('timelineCount');
    if(!host) return;
    if(count) count.textContent=String(ext.timelines.length);
    host.innerHTML = ext.timelines.length ? ext.timelines.map((t,i)=>{
      if(t.kind === 'attachment') return `<div class="timeline-card">
        <div class="at-rule-head"><div><div class="at-rule-title">Animazione guidata dallo scroll</div><div class="at-rule-code">${esc(animationTimelineCss(t))}</div></div><button type="button" class="at-rule-remove" data-timeline-remove="${i}">Rimuovi</button></div>
        <div class="at-rule-grid">
          <label class="mini-field wide"><span>Elemento animato (selettore)</span><input value="${esc(t.target||selectedSelector())}" data-tl-index="${i}" data-tl-key="target"></label>
          <label class="mini-field"><span>Tipo timeline</span><select data-tl-index="${i}" data-tl-key="mode">
            <option value="named" ${t.mode==='named'?'selected':''}>Nome timeline</option>
            <option value="scroll-anonymous" ${t.mode==='scroll-anonymous'?'selected':''}>scroll()</option>
            <option value="view-anonymous" ${t.mode==='view-anonymous'?'selected':''}>view()</option>
          </select></label>
          ${t.mode==='named' ? `<label class="mini-field"><span>Nome</span><input value="${esc(t.name||'--timeline')}" data-tl-index="${i}" data-tl-key="name"></label>` : `<label class="mini-field"><span>Asse</span><select data-tl-index="${i}" data-tl-key="axis"><option value="block" ${t.axis==='block'?'selected':''}>block</option><option value="inline" ${t.axis==='inline'?'selected':''}>inline</option><option value="x" ${t.axis==='x'?'selected':''}>x</option><option value="y" ${t.axis==='y'?'selected':''}>y</option></select></label>`}
          <label class="mini-field wide"><span>Animation range (opzionale)</span><input value="${esc(t.range||'')}" placeholder="es. cover 10% 90%" data-tl-index="${i}" data-tl-key="range"></label>
        </div>
      </div>`;
      return `<div class="timeline-card">
        <div class="at-rule-head"><div><div class="at-rule-title">Timeline ${esc(t.type==='scroll'?'scroll':'view')}</div><div class="at-rule-code">${esc(timelineCss(t))}</div></div><button type="button" class="at-rule-remove" data-timeline-remove="${i}">Rimuovi</button></div>
        <div class="at-rule-grid">
          <label class="mini-field"><span>Nome timeline</span><input value="${esc(t.name||'--timeline')}" data-tl-index="${i}" data-tl-key="name"></label>
          <label class="mini-field"><span>Asse</span><select data-tl-index="${i}" data-tl-key="axis"><option value="block" ${t.axis==='block'?'selected':''}>block</option><option value="inline" ${t.axis==='inline'?'selected':''}>inline</option><option value="x" ${t.axis==='x'?'selected':''}>x</option><option value="y" ${t.axis==='y'?'selected':''}>y</option></select></label>
          <label class="mini-field wide"><span>${t.type==='scroll'?'Scroller':'Elemento osservato'} (selettore)</span><input value="${esc(t.type==='scroll'?(t.scroller||t.selector||selectedSelector()):(t.selector||selectedSelector()))}" data-tl-index="${i}" data-tl-key="${t.type==='scroll'?'scroller':'selector'}"></label>
          ${t.type==='view' ? `<label class="mini-field wide"><span>Inset</span><input value="${esc(t.inset||'0% 0%')}" placeholder="es. 20% 10%" data-tl-index="${i}" data-tl-key="inset"></label>`:''}
        </div>
      </div>`;
    }).join('') : '<span class="hint">Nessuna timeline configurata.</span>';
  }

  function addTimeline(type){
    if(type === 'attachment') ext.timelines.push({kind:'attachment',mode:'named',name:'--scroll-timeline',target:selectedSelector(),range:''});
    else ext.timelines.push(defaultTimeline(type));
    renderTimelines(); refresh();
  }

  function injectTimelineUi(){
    if($('scrollTimelineRules')) return;
    const controls=$('controls'); if(!controls) return;
    const section=document.createElement('section');
    section.className='panel-section timeline-section';
    section.innerHTML=`
      <div class="section-title-row"><h2>7. Scroll &amp; View Timelines</h2><span id="timelineCount" class="counter">0</span></div>
      <p class="hint">Crea timeline comandate dallo scroll o dalla visibilità dell'elemento e collegale alle animazioni CSS.</p>
      <div class="at-rule-toolbar">
        <select id="timelineType">
          <option value="scroll">Timeline scroll nominata</option>
          <option value="view">Timeline view nominata</option>
          <option value="attachment">Collega un'animazione alla timeline</option>
        </select>
        <button id="addTimelineButton" type="button">+ Aggiungi</button>
      </div>
      <div id="scrollTimelineRules" class="at-rules"></div>`;
    document.querySelector('.atrules-section')?.after(section) || controls.appendChild(section);
    $('addTimelineButton')?.addEventListener('click',()=>addTimeline($('timelineType')?.value||'scroll'));
    $('scrollTimelineRules')?.addEventListener('input',e=>{
      const i=e.target.dataset.tlIndex; const key=e.target.dataset.tlKey;
      if(i===undefined || !key) return;
      ext.timelines[Number(i)][key]=e.target.value;
      renderTimelines(); refresh();
    });
    $('scrollTimelineRules')?.addEventListener('change',e=>{
      const i=e.target.dataset.tlIndex; const key=e.target.dataset.tlKey;
      if(i===undefined || !key) return;
      ext.timelines[Number(i)][key]=e.target.value;
      renderTimelines(); refresh();
    });
    $('scrollTimelineRules')?.addEventListener('click',e=>{
      const b=e.target.closest('[data-timeline-remove]');
      if(!b) return;
      ext.timelines.splice(Number(b.dataset.timelineRemove),1);
      renderTimelines(); refresh();
    });
    renderTimelines();
  }


  // ---------------------------------------------------------------------------
  // v2.4 — Resizable sidebar
  // ---------------------------------------------------------------------------
  function injectWorkspaceResizer(){
    const ws=document.querySelector('.workspace');
    const left=document.querySelector('.left-panel');
    const preview=document.querySelector('.preview-panel');
    if(!ws || !left || !preview || document.querySelector('.workspace-resizer')) return;

    const handle=document.createElement('div');
    handle.className='workspace-resizer';
    handle.setAttribute('role','separator');
    handle.setAttribute('aria-orientation','vertical');
    handle.setAttribute('aria-label','Ridimensiona pannello impostazioni');
    handle.tabIndex=0;
    handle.title='Trascina per allargare o restringere il pannello';

    // Insert between sidebar and preview.
    ws.insertBefore(handle, preview);

    const key='css-builder-sidebar-width-v24';
    const stored=parseInt(localStorage.getItem(key) || '',10);
    const min=340;
    const max=Math.max(min, Math.floor(window.innerWidth*0.65));
    if(Number.isFinite(stored)) ws.style.setProperty('--sidebar-width', `${Math.min(max,Math.max(min,stored))}px`);

    let dragging=false, startX=0, startWidth=0;

    function clamp(v){
      const currentMax=Math.max(min, Math.floor(window.innerWidth*0.65));
      return Math.min(currentMax, Math.max(min, Math.round(v)));
    }
    function setWidth(v,save=true){
      const width=clamp(v);
      ws.style.setProperty('--sidebar-width', `${width}px`);
      if(save) localStorage.setItem(key,String(width));
    }
    function move(e){
      if(!dragging) return;
      setWidth(startWidth + (e.clientX - startX), false);
    }
    function stop(){
      if(!dragging) return;
      dragging=false;
      handle.classList.remove('dragging');
      document.body.classList.remove('is-resizing');
      const raw=getComputedStyle(ws).getPropertyValue('--sidebar-width').trim();
      const value=parseInt(raw,10);
      if(Number.isFinite(value)) localStorage.setItem(key,String(value));
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',stop);
      window.removeEventListener('pointercancel',stop);
    }
    handle.addEventListener('pointerdown',e=>{
      if(window.innerWidth<=980) return;
      dragging=true;
      startX=e.clientX;
      const raw=getComputedStyle(ws).getPropertyValue('--sidebar-width').trim();
      startWidth=parseInt(raw,10) || left.getBoundingClientRect().width;
      handle.classList.add('dragging');
      document.body.classList.add('is-resizing');
      handle.setPointerCapture?.(e.pointerId);
      window.addEventListener('pointermove',move);
      window.addEventListener('pointerup',stop);
      window.addEventListener('pointercancel',stop);
      e.preventDefault();
    });
    handle.addEventListener('keydown',e=>{
      if(window.innerWidth<=980) return;
      const raw=getComputedStyle(ws).getPropertyValue('--sidebar-width').trim();
      const current=parseInt(raw,10) || left.getBoundingClientRect().width;
      if(e.key==='ArrowLeft'){ setWidth(current-20); e.preventDefault(); }
      if(e.key==='ArrowRight'){ setWidth(current+20); e.preventDefault(); }
      if(e.key==='Home'){ setWidth(min); e.preventDefault(); }
      if(e.key==='End'){ setWidth(Math.floor(window.innerWidth*0.65)); e.preventDefault(); }
    });
    window.addEventListener('resize',()=>{
      const raw=getComputedStyle(ws).getPropertyValue('--sidebar-width').trim();
      const value=parseInt(raw,10);
      if(Number.isFinite(value) && window.innerWidth>980) setWidth(value);
    });
  }


  // ---------------------------------------------------------------------------
  // v2.7 — Special at-rules
  // ---------------------------------------------------------------------------
  ext.specialAtRules = Array.isArray(ext.specialAtRules) ? ext.specialAtRules : [];

  const SPECIAL_AT_RULES = {
    'font-face': {
      title:'@font-face',
      fields:[
        ['family','Font family','MyFont'],
        ['src','Sorgente font','url("fonts/font.woff2") format("woff2")'],
        ['display','Font display','swap'],
        ['style','Stile','normal'],
        ['weight','Peso','400'],
        ['stretch','Stretch','normal'],
        ['unicodeRange','Unicode range','U+0000-00FF']
      ]
    },
    'property': {
      title:'@property',
      fields:[
        ['name','Nome custom property','--accent'],
        ['syntax','Syntax','<color>'],
        ['inherits','Inherits','true'],
        ['initialValue','Valore iniziale','teal']
      ]
    },
    'page': {
      title:'@page',
      fields:[
        ['selector','Selettore pagina',':first'],
        ['size','Dimensione','A4'],
        ['margin','Margine','20mm'],
        ['pageOrientation','Orientamento','portrait']
      ]
    },
    'counter-style': {
      title:'@counter-style',
      fields:[
        ['name','Nome stile','my-counter'],
        ['system','System','cyclic'],
        ['symbols','Symbols','① ② ③'],
        ['prefix','Prefix',''],
        ['suffix','Suffix','. '],
        ['range','Range',''],
        ['fallback','Fallback','decimal'],
        ['negative','Negative','']
      ]
    },
    'view-transition': {
      title:'@view-transition',
      fields:[
        ['navigation','Navigation','auto'],
        ['types','Types','']
      ]
    },
    'import': {
      title:'@import',
      fields:[
        ['url','URL / percorso','styles.css'],
        ['layer','Layer',''],
        ['supports','Supports',''],
        ['media','Media','']
      ]
    },
    'namespace': {
      title:'@namespace',
      fields:[
        ['prefix','Prefix','svg'],
        ['url','URL namespace','http://www.w3.org/2000/svg']
      ]
    },
    'charset': {
      title:'@charset',
      fields:[
        ['value','Encoding','UTF-8']
      ]
    }
  };

  function specialDefault(type){
    const d={type};
    (SPECIAL_AT_RULES[type]?.fields||[]).forEach(([k,,def])=>d[k]=def||'');
    return d;
  }

  function specialCss(r){
    const v=k=>cssSafe(r[k]||'');
    if(r.type==='font-face'){
      const parts=[];
      if(v('family')) parts.push(`  font-family: ${v('family')};`);
      if(v('src')) parts.push(`  src: ${v('src')};`);
      if(v('display')) parts.push(`  font-display: ${v('display')};`);
      if(v('style')) parts.push(`  font-style: ${v('style')};`);
      if(v('weight')) parts.push(`  font-weight: ${v('weight')};`);
      if(v('stretch')) parts.push(`  font-stretch: ${v('stretch')};`);
      if(v('unicodeRange')) parts.push(`  unicode-range: ${v('unicodeRange')};`);
      return `@font-face {\n${parts.length?parts.join('\n'):'  /* Inserisci almeno src */'}\n}`;
    }
    if(r.type==='property'){
      const name=v('name')||'--custom';
      const parts=[];
      if(v('syntax')) parts.push(`  syntax: "${v('syntax')}";`);
      if(v('inherits')) parts.push(`  inherits: ${v('inherits')};`);
      if(v('initialValue')) parts.push(`  initial-value: ${v('initialValue')};`);
      return `@property ${name} {\n${parts.join('\n')||'  /* Configura la custom property */'}\n}`;
    }
    if(r.type==='page'){
      const sel=v('selector');
      const parts=[];
      if(v('size')) parts.push(`  size: ${v('size')};`);
      if(v('margin')) parts.push(`  margin: ${v('margin')};`);
      if(v('pageOrientation')) parts.push(`  page-orientation: ${v('pageOrientation')};`);
      return `@page${sel?` ${sel}`:''} {\n${parts.join('\n')||'  /* Imposta le proprietà di stampa */'}\n}`;
    }
    if(r.type==='counter-style'){
      const name=v('name')||'my-counter';
      const parts=[];
      [['system','system'],['symbols','symbols'],['prefix','prefix'],['suffix','suffix'],['range','range'],['fallback','fallback'],['negative','negative']]
        .forEach(([k,label])=>{ if(v(k)) parts.push(`  ${label}: ${v(k)};`); });
      return `@counter-style ${name} {\n${parts.join('\n')||'  /* Definisci lo stile del contatore */'}\n}`;
    }
    if(r.type==='view-transition'){
      const parts=[];
      if(v('navigation')) parts.push(`  navigation: ${v('navigation')};`);
      if(v('types')) parts.push(`  types: ${v('types')};`);
      return `@view-transition {\n${parts.join('\n')||'  /* Configura la view transition */'}\n}`;
    }
    if(r.type==='import'){
      let out=`@import url("${v('url')||'styles.css'}")`;
      if(v('layer')) out+=` layer(${v('layer')})`;
      if(v('supports')) out+=` supports(${v('supports')})`;
      if(v('media')) out+=` ${v('media')}`;
      return out+';';
    }
    if(r.type==='namespace'){
      const prefix=v('prefix');
      return `@namespace${prefix?' '+prefix:''} url("${v('url')||''}");`;
    }
    if(r.type==='charset'){
      return `@charset "${v('value')||'UTF-8'}";`;
    }
    return '';
  }

  function specialCard(r,i){
    const cfg=SPECIAL_AT_RULES[r.type];
    if(!cfg) return '';
    const fields=cfg.fields.map(([key,label,def])=>
      `<label class="mini-field"><span>${esc(label)}</span><input value="${esc(r[key]??'')}" placeholder="${esc(def||'')}" data-sa-index="${i}" data-sa-key="${esc(key)}"></label>`
    ).join('');
    return `<div class="at-rule-card special-at-rule-card">
      <div class="at-rule-head"><div><div class="at-rule-title">${esc(cfg.title)}</div><div class="at-rule-code">${esc(specialCss(r))}</div></div><button type="button" class="at-rule-remove" data-sa-remove="${i}">Rimuovi</button></div>
      <div class="at-rule-grid">${fields}</div>
      <div class="at-rule-preview"><code>${esc(specialCss(r))}</code></div>
    </div>`;
  }

  function renderSpecialAtRules(){
    const host=$('specialAtRules'), count=$('specialAtRuleCount');
    if(!host) return;
    if(count) count.textContent=String(ext.specialAtRules.length);
    host.innerHTML=ext.specialAtRules.length
      ? ext.specialAtRules.map(specialCard).join('')
      : '<span class="hint">Nessuna at-rule speciale.</span>';
  }

  function specialCssAll(){
    return ext.specialAtRules.map(specialCss).filter(Boolean).join('\n\n');
  }

  const prevExtensionCssSpecial = extensionCss;
  extensionCss = function(){
    return [prevExtensionCssSpecial(), specialCssAll()].filter(Boolean).join('\n\n');
  }

  function injectSpecialAtRuleUi(){
    if($('specialAtRules')) return;
    const controls=$('controls'); if(!controls) return;
    const section=document.createElement('section');
    section.className='panel-section special-at-rules-section';
    section.innerHTML=`
      <div class="section-title-row"><h2>7. At-rule speciali</h2><span id="specialAtRuleCount" class="counter">0</span></div>
      <p class="hint">Regole CSS con sintassi propria, separate dalle at-rule condizionali.</p>
      <div class="at-rule-toolbar">
        <select id="specialAtRuleType">
          <option value="font-face">@font-face</option>
          <option value="property">@property</option>
          <option value="page">@page</option>
          <option value="counter-style">@counter-style</option>
          <option value="view-transition">@view-transition</option>
          <option value="import">@import</option>
          <option value="namespace">@namespace</option>
          <option value="charset">@charset</option>
        </select>
        <button id="addSpecialAtRuleButton" type="button">+ Aggiungi</button>
      </div>
      <div id="specialAtRules"></div>`;
    document.querySelector('.advanced-visual-section')?.before(section) || controls.appendChild(section);

    $('addSpecialAtRuleButton')?.addEventListener('click',()=>{
      const type=$('specialAtRuleType')?.value||'font-face';
      ext.specialAtRules.push(specialDefault(type));
      renderSpecialAtRules();
      refresh();
    });
    $('specialAtRules')?.addEventListener('input',e=>{
      const t=e.target;
      if(!t.matches('[data-sa-index]')) return;
      const r=ext.specialAtRules[Number(t.dataset.saIndex)];
      if(!r) return;
      r[t.dataset.saKey]=t.value;
      const code=t.closest('.special-at-rule-card')?.querySelector('.at-rule-code');
      const preview=t.closest('.special-at-rule-card')?.querySelector('.at-rule-preview code');
      if(code) code.textContent=specialCss(r);
      if(preview) preview.textContent=specialCss(r);
      refresh();
    });
    $('specialAtRules')?.addEventListener('click',e=>{
      const b=e.target.closest('[data-sa-remove]');
      if(!b) return;
      ext.specialAtRules.splice(Number(b.dataset.saRemove),1);
      renderSpecialAtRules();
      refresh();
    });
    renderSpecialAtRules();
  }


  // ---------------------------------------------------------------------------
  // v2.8 — Selector composer + CSS nesting
  // ---------------------------------------------------------------------------
  ext.selectorLab = ext.selectorLab || {
    base: '',
    mode: 'pseudo',
    value: '',
    element: '',
    combinator: ' ',
    nested: '&:hover',
    declarations: []
  };
  ext.nestingRules = Array.isArray(ext.nestingRules) ? ext.nestingRules : [];

  const SELECTOR_PSEUDOS = [
    [':hover','Al passaggio del mouse'],
    [':focus','Quando riceve il focus'],
    [':focus-visible','Focus visibile'],
    [':active','Durante il click'],
    [':visited','Link visitato'],
    [':checked','Checkbox/radio selezionato'],
    [':disabled','Elemento disabilitato'],
    [':enabled','Elemento abilitato'],
    [':required','Campo obbligatorio'],
    [':optional','Campo facoltativo'],
    [':valid','Valore valido'],
    [':invalid','Valore non valido'],
    [':first-child','Primo figlio'],
    [':last-child','Ultimo figlio'],
    [':nth-child(2n)','Figli pari'],
    [':not(...)','Negazione / esclusione'],
    ['::before','Pseudo-elemento prima'],
    ['::after','Pseudo-elemento dopo'],
    ['::placeholder','Placeholder'],
    ['::selection','Testo selezionato'],
    ['::marker','Marker lista']
  ];

  function selectorPreview(s){
    return String(s||'').trim().replace(/[{};]/g,'');
  }

  function composedSelector(){
    const lab=ext.selectorLab;
    const base=selectorPreview(lab.base || selectedSelector()) || 'body';
    const mode=lab.mode;
    if(mode==='pseudo'){
      return base + (lab.value || ':hover');
    }
    if(mode==='child'){
      return `${base} > ${selectorPreview(lab.element)||'*'}`;
    }
    if(mode==='descendant'){
      return `${base} ${selectorPreview(lab.element)||'*'}`;
    }
    if(mode==='sibling'){
      return `${base} + ${selectorPreview(lab.element)||'*'}`;
    }
    if(mode==='general-sibling'){
      return `${base} ~ ${selectorPreview(lab.element)||'*'}`;
    }
    if(mode==='attribute'){
      return `${base}[${selectorPreview(lab.value)||'data-state'}]`;
    }
    return base;
  }

  function renderSelectorLab(){
    const host=$('selectorLab'),out=$('selectorLabOutput'), target=$('selectorLabTarget');
    if(!host) return;
    const lab=ext.selectorLab;
    const outSel=composedSelector();
    if(out) out.textContent=outSel;
    if(target) target.value=outSel;
    const pseudo=$('selectorPseudo');
    const element=$('selectorElement');
    const attr=$('selectorAttribute');
    if(pseudo) pseudo.value=lab.value && SELECTOR_PSEUDOS.some(x=>x[0]===lab.value)?lab.value:':hover';
    if(element) element.value=lab.element || '';
    if(attr) attr.value=lab.value || '';
    ['selectorElement','selectorAttribute'].forEach(id=>{
      const el=$(id); if(el) el.closest('.selector-extra')?.classList.toggle('hidden', lab.mode!=='child' && lab.mode!=='descendant' && lab.mode!=='sibling' && lab.mode!=='general-sibling' && lab.mode!=='attribute');
    });
  }

  function injectSelectorLab(){
    if($('selectorLab')) return;
    const section=document.createElement('section');
    section.className='panel-section selector-lab-section';
    section.innerHTML=`
      <div class="section-title-row"><h2>9. Costruttore di selettori</h2><span class="counter">CSS</span></div>
      <p class="hint">Componi selettori senza ricordare tutta la sintassi CSS. Il risultato può essere usato nell'editor avanzato.</p>
      <div class="selector-lab-grid">
        <label class="mini-field wide"><span>Selettore di base</span><input id="selectorBase" placeholder=".card, #menu, button"></label>
        <label class="mini-field"><span>Tipo di combinazione</span>
          <select id="selectorMode">
            <option value="pseudo">Pseudo-class / pseudo-element</option>
            <option value="child">Figlio diretto ( &gt; )</option>
            <option value="descendant">Discendente</option>
            <option value="sibling">Fratello successivo ( + )</option>
            <option value="general-sibling">Fratelli successivi ( ~ )</option>
            <option value="attribute">Attributo [ ... ]</option>
          </select>
        </label>
        <label class="mini-field" id="selectorPseudoWrap"><span>Pseudo</span>
          <select id="selectorPseudo">${SELECTOR_PSEUDOS.map(([v,l])=>`<option value="${esc(v)}">${esc(l)} — ${esc(v)}</option>`).join('')}</select>
        </label>
        <label class="mini-field selector-extra hidden"><span>Elemento correlato</span><input id="selectorElement" placeholder="li, a, .icon"></label>
        <label class="mini-field selector-extra hidden"><span>Attributo</span><input id="selectorAttribute" placeholder="data-state"></label>
      </div>
      <div class="selector-lab-result"><code id="selectorLabOutput">body:hover</code><button id="selectorUseButton" type="button">Usa nell'editor avanzato</button></div>`;
    const controls=$('controls');
    controls?.parentElement?.insertBefore(section, controls.parentElement.firstElementChild) || document.body.appendChild(section);

    const base=$('selectorBase'),mode=$('selectorMode'),pseudo=$('selectorPseudo'),element=$('selectorElement'),attr=$('selectorAttribute');
    base.value=ext.selectorLab.base || selectedSelector() || '';
    mode.value=ext.selectorLab.mode || 'pseudo';
    [base,mode,pseudo,element,attr].forEach(el=>el?.addEventListener('input',()=>{
      ext.selectorLab.base=base.value; ext.selectorLab.mode=mode.value;
      if(mode.value==='pseudo') ext.selectorLab.value=pseudo.value;
      else if(mode.value==='attribute') ext.selectorLab.value=attr.value;
      else ext.selectorLab.element=element.value;
      renderSelectorLab();
    }));
    mode.addEventListener('change',()=>{
      ext.selectorLab.mode=mode.value;
      renderSelectorLab();
    });
    $('selectorUseButton')?.addEventListener('click',()=>{
      const t=$('advancedTarget');
      if(t){t.value=composedSelector(); t.dispatchEvent(new Event('input',{bubbles:true}));}
    });
    renderSelectorLab();
  }

  function nestingCss(r){
    const parent=selectorPreview(r.parent)||'body';
    const nested=selectorPreview(r.nested)||'&:hover';
    const lines=(r.declarations||[]).filter(d=>selectorPreview(d.prop)&&String(d.value||'').trim()!=='')
      .map(d=>`    ${selectorPreview(d.prop)}: ${String(d.value).replace(/[{};]/g,'')};`);
    return `${parent} {\n  ${nested} {\n${lines.length?lines.join('\n'):'    /* Aggiungi proprietà */'}\n  }\n}`;
  }

  function addNestingDeclaration(i){
    ext.nestingRules[i].declarations.push({prop:'color',value:''});
    renderNesting();
    refresh();
  }

  function renderNesting(){
    const host=$('nestingRules'),count=$('nestingCount');
    if(!host) return;
    if(count) count.textContent=String(ext.nestingRules.length);
    host.innerHTML=ext.nestingRules.length ? ext.nestingRules.map((r,i)=>`
      <div class="nesting-card">
        <div class="at-rule-head"><div><div class="at-rule-title">CSS nesting</div><div class="at-rule-code">${esc(nestingCss(r))}</div></div><button class="at-rule-remove" type="button" data-nesting-remove="${i}">Rimuovi</button></div>
        <div class="at-rule-grid">
          <label class="mini-field"><span>Selettore padre</span><input value="${esc(r.parent||selectedSelector())}" data-nesting-index="${i}" data-nesting-key="parent"></label>
          <label class="mini-field"><span>Selettore annidato</span><input value="${esc(r.nested||'&:hover')}" data-nesting-index="${i}" data-nesting-key="nested"></label>
        </div>
        <div class="nesting-declarations">
          ${(r.declarations||[]).map((d,j)=>`<div class="nesting-decl">
            <input value="${esc(d.prop||'')}" placeholder="color" data-nd-index="${i}" data-nd-row="${j}" data-nd-key="prop">
            <input value="${esc(d.value||'')}" placeholder="red / var(--colore)" data-nd-index="${i}" data-nd-row="${j}" data-nd-key="value">
            <button type="button" data-nd-remove="${i}" data-nd-row="${j}" title="Rimuovi">×</button>
          </div>`).join('')}
        </div>
        <button type="button" class="secondary-button" data-nd-add="${i}">+ Aggiungi proprietà</button>
        <div class="at-rule-preview"><code>${esc(nestingCss(r))}</code></div>
      </div>`).join('') : '<span class="hint">Nessuna regola annidata.</span>';
  }

  function nestingCssAll(){
    return ext.nestingRules.map(nestingCss).join('\n\n');
  }

  const prevExtensionCssNesting=extensionCss;
  extensionCss=function(){
    return [prevExtensionCssNesting(), nestingCssAll()].filter(Boolean).join('\n\n');
  };

  function injectNestingUi(){
    if($('nestingRules')) return;
    const section=document.createElement('section');
    section.className='panel-section nesting-section';
    section.innerHTML=`
      <div class="section-title-row"><h2>10. CSS Nesting</h2><span id="nestingCount" class="counter">0</span></div>
      <p class="hint">Crea regole annidate del tipo <code>.card { &:hover { ... } }</code>.</p>
      <button id="addNestingButton" type="button">+ Nuova regola annidata</button>
      <div id="nestingRules"></div>`;
    const selectorSection=$('selectorLab');
    selectorSection?.parentElement?.insertBefore(section, selectorSection.nextSibling) || document.body.appendChild(section);
    $('addNestingButton')?.addEventListener('click',()=>{
      ext.nestingRules.push({parent:selectedSelector()||'body',nested:'&:hover',declarations:[]});
      renderNesting(); refresh();
    });
    $('nestingRules')?.addEventListener('input',e=>{
      const t=e.target;
      if(t.matches('[data-nesting-index]')){
        const r=ext.nestingRules[Number(t.dataset.nestingIndex)]; if(!r)return;
        r[t.dataset.nestingKey]=t.value;
        const card=t.closest('.nesting-card'); const code=card?.querySelector('.at-rule-code'); const pre=card?.querySelector('.at-rule-preview code');
        if(code) code.textContent=nestingCss(r);
        if(pre) pre.textContent=nestingCss(r);
        refresh();
      } else if(t.matches('[data-nd-index]')){
        const r=ext.nestingRules[Number(t.dataset.ndIndex)]; const d=r?.declarations?.[Number(t.dataset.ndRow)];
        if(!d)return; d[t.dataset.ndKey]=t.value;
        const card=t.closest('.nesting-card'); const code=card?.querySelector('.at-rule-code'); const pre=card?.querySelector('.at-rule-preview code');
        if(code) code.textContent=nestingCss(r); if(pre) pre.textContent=nestingCss(r); refresh();
      }
    });
    $('nestingRules')?.addEventListener('click',e=>{
      const add=e.target.closest('[data-nd-add]');
      if(add){addNestingDeclaration(Number(add.dataset.ndAdd));return;}
      const rem=e.target.closest('[data-nd-remove]');
      if(rem){
        const r=ext.nestingRules[Number(rem.dataset.ndRemove)];
        r?.declarations?.splice(Number(rem.dataset.ndRow),1);
        renderNesting(); refresh();
        return;
      }
      const remove=e.target.closest('[data-nesting-remove]');
      if(remove){
        ext.nestingRules.splice(Number(remove.dataset.nestingRemove),1);
        renderNesting(); refresh();
      }
    });
    renderNesting();
  }



  // ---------------------------------------------------------------------------
  // v2.9 — Complex value builders
  // ---------------------------------------------------------------------------
  ext.valueLab = ext.valueLab || {
    color: {hex:'#4f8cff', alpha:'1'},
    math: {a:'100%', op:'-', b:'20px', fn:'calc'},
    gradient: {type:'linear-gradient', angle:'90deg', stops:[
      {color:'#4f8cff', pos:'0%'},
      {color:'#8b5cf6', pos:'100%'}
    ]},
    filter: [
      {fn:'blur', value:'0', unit:'px'},
      {fn:'brightness', value:'1', unit:''},
      {fn:'contrast', value:'1', unit:''},
      {fn:'saturate', value:'1', unit:''},
      {fn:'grayscale', value:'0', unit:''},
      {fn:'opacity', value:'1', unit:''}
    ]
  };

  const VALUE_FILTERS = {
    blur:['px','0'],
    brightness:['','1'],
    contrast:['','1'],
    saturate:['','1'],
    grayscale:['','0'],
    opacity:['','1'],
    'hue-rotate':['deg','0'],
    invert:['','0'],
    sepia:['','0']
  };

  function valueLabColor(){
    const c=ext.valueLab.color||{};
    const hex=(c.hex||'#4f8cff').trim();
    const a=(c.alpha||'1').trim();
    if(/^#[0-9a-f]{6}$/i.test(hex)){
      const n=parseInt(hex.slice(1),16);
      const r=n>>16,g=(n>>8)&255,b=n&255;
      if(a!=='' && a!=='1') return `rgb(${r} ${g} ${b} / ${a})`;
    }
    return hex || '#4f8cff';
  }
  function valueLabMath(){
    const m=ext.valueLab.math||{};
    const fn=['calc','min','max','clamp'].includes(m.fn)?m.fn:'calc';
    if(fn==='clamp') return `clamp(${m.a||'0px'}, ${m.op||'50vw'}, ${m.b||'1000px'})`;
    if(fn==='min'||fn==='max') return `${fn}(${m.a||'0px'}, ${m.op||'100%'})`;
    return `calc(${m.a||'100%'} ${m.op||'-'} ${m.b||'20px'})`;
  }
  function gradientCss(g=ext.valueLab.gradient){
    const type=g.type||'linear-gradient';
    const args=(g.stops||[]).map(s=>`${s.color||'#000'} ${s.pos||'0%'}`).join(', ');
    if(type==='linear-gradient') return `linear-gradient(${g.angle||'90deg'}, ${args})`;
    if(type==='repeating-linear-gradient') return `repeating-linear-gradient(${g.angle||'90deg'}, ${args})`;
    if(type==='radial-gradient') return `radial-gradient(${g.shape||'circle'} ${g.size||'at center'}, ${args})`;
    if(type==='repeating-radial-gradient') return `repeating-radial-gradient(${g.shape||'circle'} ${g.size||'at center'}, ${args})`;
    if(type==='conic-gradient') return `conic-gradient(from ${g.angle||'0deg'} at ${g.position||'center'}, ${args})`;
    if(type==='repeating-conic-gradient') return `repeating-conic-gradient(from ${g.angle||'0deg'} at ${g.position||'center'}, ${args})`;
    return `linear-gradient(${g.angle||'90deg'}, ${args})`;
  }
  function filterCss(){
    return (ext.valueLab.filter||[]).filter(f=>f.fn && String(f.value)!=='').map(f=>{
      const u=f.unit||VALUE_FILTERS[f.fn]?.[0]||'';
      return `${f.fn}(${f.value}${u})`;
    }).join(' ') || 'none';
  }

  function updateValueLabOutputs(){
    const set=(id,val)=>{const el=$(id);if(el)el.textContent=val;};
    set('valueLabColorOut',valueLabColor());
    set('valueLabMathOut',valueLabMath());
    set('valueLabGradientOut',gradientCss());
    set('valueLabFilterOut',filterCss());
  }

  function renderFilterLab(){
    const host=$('valueLabFilterRows'); if(!host) return;
    host.innerHTML=(ext.valueLab.filter||[]).map((f,i)=>`
      <div class="complex-row">
        <select data-vf-index="${i}" data-vf-key="fn">
          ${Object.keys(VALUE_FILTERS).map(k=>`<option value="${esc(k)}" ${f.fn===k?'selected':''}>${esc(k)}</option>`).join('')}
        </select>
        <input value="${esc(f.value)}" placeholder="0 / 1 / 20" data-vf-index="${i}" data-vf-key="value">
        <span class="unit-label">${esc(f.unit||'')}</span>
        <button type="button" data-vf-remove="${i}" title="Rimuovi">×</button>
      </div>`).join('');
  }

  function renderGradientLab(){
    const g=ext.valueLab.gradient||{};
    const host=$('valueLabGradientStops'); if(!host) return;
    host.innerHTML=(g.stops||[]).map((s,i)=>`
      <div class="complex-row">
        <input type="color" value="${esc(/^#[0-9a-f]{6}$/i.test(s.color||'')?s.color:'#000000')}" data-vg-index="${i}" data-vg-key="color" title="Colore">
        <input value="${esc(s.color||'')}" placeholder="#4f8cff / red" data-vg-index="${i}" data-vg-key="colorText">
        <input value="${esc(s.pos||'')}" placeholder="0% / 50% / 100%" data-vg-index="${i}" data-vg-key="pos">
        <button type="button" data-vg-remove="${i}" title="Rimuovi">×</button>
      </div>`).join('');
  }

  function injectValueLab(){
    if($('valueLab')) return;
    const section=document.createElement('section');
    section.className='panel-section value-lab-section';
    section.innerHTML=`
      <div class="section-title-row"><h2>11. Costruttori di valori complessi</h2><span class="counter">CSS</span></div>
      <p class="hint">Componi valori avanzati e copia il risultato nell'editor della proprietà corrispondente.</p>

      <div class="value-lab-card">
        <h3>Colore + alpha</h3>
        <div class="value-lab-grid">
          <label class="mini-field"><span>Colore</span><input id="valueLabColorHex" type="text" value="${esc(ext.valueLab.color.hex)}" placeholder="#4f8cff"></label>
          <label class="mini-field"><span>Alpha</span><input id="valueLabColorAlpha" type="number" min="0" max="1" step="0.01" value="${esc(ext.valueLab.color.alpha)}"></label>
        </div>
        <div class="complex-output"><code id="valueLabColorOut"></code><button type="button" data-copy-value="valueLabColorOut">Copia</button></div>
      </div>

      <div class="value-lab-card">
        <h3>Funzioni matematiche</h3>
        <div class="value-lab-grid">
          <label class="mini-field"><span>Funzione</span><select id="valueLabMathFn"><option value="calc">calc()</option><option value="min">min()</option><option value="max">max()</option><option value="clamp">clamp()</option></select></label>
          <label class="mini-field"><span>Valore A</span><input id="valueLabMathA" value="${esc(ext.valueLab.math.a)}" placeholder="100%"></label>
          <label class="mini-field"><span>Operatore / valore centrale</span><input id="valueLabMathOp" value="${esc(ext.valueLab.math.op)}" placeholder="-"></label>
          <label class="mini-field"><span>Valore B</span><input id="valueLabMathB" value="${esc(ext.valueLab.math.b)}" placeholder="20px"></label>
        </div>
        <div class="complex-output"><code id="valueLabMathOut"></code><button type="button" data-copy-value="valueLabMathOut">Copia</button></div>
      </div>

      <div class="value-lab-card">
        <h3>Gradienti</h3>
        <div class="value-lab-grid">
          <label class="mini-field"><span>Tipo</span><select id="valueLabGradientType">
            <option value="linear-gradient">linear-gradient()</option>
            <option value="repeating-linear-gradient">repeating-linear-gradient()</option>
            <option value="radial-gradient">radial-gradient()</option>
            <option value="repeating-radial-gradient">repeating-radial-gradient()</option>
            <option value="conic-gradient">conic-gradient()</option>
            <option value="repeating-conic-gradient">repeating-conic-gradient()</option>
          </select></label>
          <label class="mini-field"><span>Angolo</span><input id="valueLabGradientAngle" value="${esc(ext.valueLab.gradient.angle||'90deg')}" placeholder="90deg"></label>
        </div>
        <div id="valueLabGradientStops"></div>
        <button id="addValueLabGradientStop" type="button">+ Aggiungi stop</button>
        <div class="complex-output"><code id="valueLabGradientOut"></code><button type="button" data-copy-value="valueLabGradientOut">Copia</button></div>
      </div>

      <div class="value-lab-card">
        <h3>Filtri combinati</h3>
        <div id="valueLabFilterRows"></div>
        <button id="addValueLabFilter" type="button">+ Aggiungi filtro</button>
        <div class="complex-output"><code id="valueLabFilterOut"></code><button type="button" data-copy-value="valueLabFilterOut">Copia</button></div>
      </div>`;
    document.querySelector('.nesting-section')?.after(section) || document.body.appendChild(section);

    const col=ext.valueLab.color, math=ext.valueLab.math, grad=ext.valueLab.gradient;
    $('valueLabMathFn').value=math.fn||'calc';
    $('valueLabGradientType').value=grad.type||'linear-gradient';

    section.addEventListener('input',e=>{
      const t=e.target;
      if(t.id==='valueLabColorHex') col.hex=t.value;
      else if(t.id==='valueLabColorAlpha') col.alpha=t.value;
      else if(t.id==='valueLabMathFn') math.fn=t.value;
      else if(t.id==='valueLabMathA') math.a=t.value;
      else if(t.id==='valueLabMathOp') math.op=t.value;
      else if(t.id==='valueLabMathB') math.b=t.value;
      else if(t.id==='valueLabGradientType') grad.type=t.value;
      else if(t.id==='valueLabGradientAngle') grad.angle=t.value;
      else if(t.matches('[data-vg-index]')){
        const s=grad.stops[Number(t.dataset.vgIndex)]; if(!s)return;
        if(t.dataset.vgKey==='color'){s.color=t.value;}
        if(t.dataset.vgKey==='colorText'){s.color=t.value;}
        if(t.dataset.vgKey==='pos'){s.pos=t.value;}
      } else if(t.matches('[data-vf-index]')){
        const f=ext.valueLab.filter[Number(t.dataset.vfIndex)]; if(!f)return;
        f[t.dataset.vfKey]=t.value;
        if(t.dataset.vfKey==='fn') f.unit=VALUE_FILTERS[t.value]?.[0]||'';
      }
      renderGradientLab(); renderFilterLab(); updateValueLabOutputs();
    });
    section.addEventListener('change',e=>{
      const t=e.target;
      if(t.matches('[data-vg-index]') || t.matches('[data-vf-index]')) renderValueLabOnly();
    });
    $('addValueLabGradientStop')?.addEventListener('click',()=>{
      grad.stops.push({color:'#ffffff',pos:grad.stops.length>=1?'100%':'0%'});
      renderGradientLab(); updateValueLabOutputs();
    });
    $('addValueLabFilter')?.addEventListener('click',()=>{
      ext.valueLab.filter.push({fn:'blur',value:'4',unit:'px'});
      renderFilterLab(); updateValueLabOutputs();
    });
    section.addEventListener('click',e=>{
      const copy=e.target.closest('[data-copy-value]');
      if(copy){
        const el=$(copy.dataset.copyValue);
        navigator.clipboard?.writeText(el?.textContent||'');
        copy.textContent='Copiato';
        setTimeout(()=>copy.textContent='Copia',800);
      }
      const gr=e.target.closest('[data-vg-remove]');
      if(gr){grad.stops.splice(Number(gr.dataset.vgRemove),1);renderGradientLab();updateValueLabOutputs();}
      const fr=e.target.closest('[data-vf-remove]');
      if(fr){ext.valueLab.filter.splice(Number(fr.dataset.vfRemove),1);renderFilterLab();updateValueLabOutputs();}
    });
    renderValueLabOnly();
  }
  function renderValueLabOnly(){
    renderGradientLab(); renderFilterLab(); updateValueLabOutputs();
  }


  // ---------------------------------------------------------------------------
  // v2.2 — Advanced visual editors
  // ---------------------------------------------------------------------------
  ext.visualAdvanced = ext.visualAdvanced || {};
  ext.visualAdvanced.rules = ext.visualAdvanced.rules || {};

  const ADVANCED_GROUPS = {
    sizing: [
      {key:'box-sizing', label:'Box sizing', type:'select', options:['content-box','border-box'], def:'border-box'},
      {key:'aspect-ratio', label:'Aspect ratio', type:'text', def:'auto', placeholder:'auto, 1 / 1, 16 / 9'},
      {key:'object-fit', label:'Object fit', type:'select', options:['fill','contain','cover','none','scale-down'], def:'fill'},
      {key:'object-position', label:'Object position', type:'text', def:'50% 50%', placeholder:'50% 50%'},
      {key:'resize', label:'Resize', type:'select', options:['none','both','horizontal','vertical','block','inline'], def:'none'},
      {key:'contain-intrinsic-size', label:'Contain intrinsic size', type:'text', def:'auto', placeholder:'auto, 300px, 300px 200px'},
      {key:'min-width', label:'Min width', type:'text', def:'', placeholder:'auto / 120px / 50%'},
      {key:'max-width', label:'Max width', type:'text', def:'', placeholder:'none / 600px / 100%'},
      {key:'min-height', label:'Min height', type:'text', def:'', placeholder:'auto / 120px / 50%'},
      {key:'max-height', label:'Max height', type:'text', def:'', placeholder:'none / 600px / 100%'}
    ],
    scrolling: [
      {key:'scroll-behavior', label:'Scroll behavior', type:'select', options:['auto','smooth'], def:'auto'},
      {key:'scroll-snap-type', label:'Scroll snap type', type:'select', options:['none','x mandatory','y mandatory','both mandatory','x proximity','y proximity','both proximity'], def:'none'},
      {key:'scroll-snap-align', label:'Scroll snap align', type:'select', options:['none','start','end','center','start center','center center','end center'], def:'none'},
      {key:'scroll-snap-stop', label:'Scroll snap stop', type:'select', options:['normal','always'], def:'normal'},
      {key:'overscroll-behavior', label:'Overscroll behavior', type:'select', options:['auto','contain','none','x contain','y contain'], def:'auto'},
      {key:'scrollbar-gutter', label:'Scrollbar gutter', type:'select', options:['auto','stable','stable both-edges'], def:'auto'},
      {key:'scroll-margin', label:'Scroll margin', type:'text', def:'', placeholder:'16px / 20px 10px'},
      {key:'scroll-padding', label:'Scroll padding', type:'text', def:'', placeholder:'16px / 20px 10px'}
    ],
    logical: [
      {key:'margin-block', label:'Margin block', type:'text', def:'', placeholder:'10px / 10px 20px'},
      {key:'margin-inline', label:'Margin inline', type:'text', def:'', placeholder:'auto / 10px 20px'},
      {key:'padding-block', label:'Padding block', type:'text', def:'', placeholder:'10px / 10px 20px'},
      {key:'padding-inline', label:'Padding inline', type:'text', def:'', placeholder:'10px / 10px 20px'},
      {key:'inset-block', label:'Inset block', type:'text', def:'', placeholder:'0 / 10px 20px'},
      {key:'inset-inline', label:'Inset inline', type:'text', def:'', placeholder:'0 / 10px 20px'},
      {key:'border-block', label:'Border block', type:'text', def:'', placeholder:'1px solid #000'},
      {key:'border-inline', label:'Border inline', type:'text', def:'', placeholder:'1px solid #000'},
      {key:'border-start-start-radius', label:'Radius start-start', type:'text', def:'', placeholder:'8px'},
      {key:'border-end-end-radius', label:'Radius end-end', type:'text', def:'', placeholder:'8px'}
    ],
    typography: [
      {key:'text-wrap', label:'Text wrap', type:'select', options:['wrap','nowrap','balance','pretty','stable'], def:'wrap'},
      {key:'white-space', label:'White space', type:'select', options:['normal','nowrap','pre','pre-wrap','pre-line','break-spaces'], def:'normal'},
      {key:'overflow-wrap', label:'Overflow wrap', type:'select', options:['normal','break-word','anywhere'], def:'normal'},
      {key:'word-break', label:'Word break', type:'select', options:['normal','break-all','keep-all','auto-phrase','break-word'], def:'normal'},
      {key:'hyphens', label:'Hyphens', type:'select', options:['none','manual','auto'], def:'manual'},
      {key:'line-clamp', label:'Line clamp', type:'text', def:'', placeholder:'3 / none'},
      {key:'text-indent', label:'Text indent', type:'text', def:'', placeholder:'0 / 1em / 20px'},
      {key:'text-overflow', label:'Text overflow', type:'select', options:['clip','ellipsis','fade'], def:'clip'},
      {key:'vertical-align', label:'Vertical align', type:'select', options:['baseline','sub','super','text-top','text-bottom','middle','top','bottom'], def:'baseline'}
    ],
    masking: [
      {key:'mask-image', label:'Mask image', type:'text', def:'', placeholder:'url(...) / linear-gradient(...)'},
      {key:'mask-repeat', label:'Mask repeat', type:'select', options:['repeat','no-repeat','repeat-x','repeat-y','space','round'], def:'repeat'},
      {key:'mask-position', label:'Mask position', type:'text', def:'', placeholder:'center / 50% 50%'},
      {key:'mask-size', label:'Mask size', type:'text', def:'', placeholder:'cover / contain / 100% 100%'},
      {key:'mask-origin', label:'Mask origin', type:'select', options:['border-box','padding-box','content-box','fill-box','stroke-box','view-box'], def:'border-box'},
      {key:'mask-clip', label:'Mask clip', type:'select', options:['border-box','padding-box','content-box','fill-box','stroke-box','view-box','no-clip'], def:'border-box'},
      {key:'mask-mode', label:'Mask mode', type:'select', options:['match-source','alpha','luminance'], def:'match-source'},
      {key:'mask-composite', label:'Mask composite', type:'select', options:['add','subtract','intersect','exclude'], def:'add'},
      {key:'mask-type', label:'Mask type', type:'select', options:['luminance','alpha'], def:'luminance'},
      {key:'clip-rule', label:'Clip rule (SVG)', type:'select', options:['nonzero','evenodd'], def:'nonzero'}
    ],
    compositing: [
      {key:'opacity', label:'Opacity', type:'text', def:'', placeholder:'0.8 / 80%'},
      {key:'mix-blend-mode', label:'Mix blend mode', type:'select', options:['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'], def:'normal'},
      {key:'isolation', label:'Isolation', type:'select', options:['auto','isolate'], def:'auto'},
      {key:'background-blend-mode', label:'Background blend mode', type:'select', options:['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'], def:'normal'},
      {key:'backdrop-filter', label:'Backdrop filter', type:'text', def:'', placeholder:'blur(8px) saturate(140%)'},
      {key:'will-change', label:'Will change', type:'text', def:'', placeholder:'transform, opacity, contents'},
      {key:'transform-style', label:'Transform style', type:'select', options:['flat','preserve-3d'], def:'flat'},
      {key:'backface-visibility', label:'Backface visibility', type:'select', options:['visible','hidden'], def:'visible'}
    ],
    svg: [
      {key:'fill', label:'SVG fill', type:'text', def:'', placeholder:'none / #fff / currentColor'},
      {key:'fill-opacity', label:'Fill opacity', type:'text', def:'', placeholder:'0.5 / 50%'},
      {key:'fill-rule', label:'Fill rule', type:'select', options:['nonzero','evenodd'], def:'nonzero'},
      {key:'stroke', label:'SVG stroke', type:'text', def:'', placeholder:'none / currentColor'},
      {key:'stroke-width', label:'Stroke width', type:'text', def:'', placeholder:'2 / 2px'},
      {key:'stroke-opacity', label:'Stroke opacity', type:'text', def:'', placeholder:'1 / 80%'},
      {key:'stroke-linecap', label:'Stroke linecap', type:'select', options:['butt','round','square'], def:'butt'},
      {key:'stroke-linejoin', label:'Stroke linejoin', type:'select', options:['miter','round','bevel'], def:'miter'},
      {key:'stroke-dasharray', label:'Stroke dasharray', type:'text', def:'', placeholder:'5 3 / none'},
      {key:'stroke-dashoffset', label:'Stroke dashoffset', type:'text', def:'', placeholder:'0 / 10px'},
      {key:'paint-order', label:'Paint order', type:'select', options:['normal','fill','stroke','markers','stroke fill','markers stroke fill'], def:'normal'},
      {key:'vector-effect', label:'Vector effect', type:'select', options:['none','non-scaling-stroke','non-scaling-size','non-rotation','fixed-position'], def:'none'}
    ],
    uiForms: [
      {key:'appearance', label:'Appearance', type:'select', options:['auto','none','textfield','button','menulist-button','checkbox','radio'], def:'auto'},
      {key:'accent-color', label:'Accent color', type:'text', def:'', placeholder:'auto / #4f8 / red'},
      {key:'caret-color', label:'Caret color', type:'text', def:'', placeholder:'auto / #4f8'},
      {key:'color-scheme', label:'Color scheme', type:'select', options:['normal','light','dark','light dark','only light','only dark'], def:'normal'},
      {key:'cursor', label:'Cursor', type:'select', options:['auto','default','pointer','move','text','grab','grabbing','not-allowed','wait','crosshair','zoom-in','zoom-out','none'], def:'auto'},
      {key:'pointer-events', label:'Pointer events', type:'select', options:['auto','none','visiblePainted','visibleFill','visibleStroke','visible','painted','fill','stroke','all'], def:'auto'},
      {key:'user-select', label:'User select', type:'select', options:['auto','text','none','all'], def:'auto'},
      {key:'touch-action', label:'Touch action', type:'select', options:['auto','none','pan-x','pan-y','pinch-zoom','manipulation'], def:'auto'},
      {key:'field-sizing', label:'Field sizing', type:'select', options:['fixed','content'], def:'fixed'},
      {key:'resize', label:'Resize', type:'select', options:['none','both','horizontal','vertical','block','inline'], def:'none'}
    ],
    columnsPaging: [
      {key:'columns', label:'Columns', type:'text', def:'', placeholder:'2 / 200px / 100px 3'},
      {key:'column-count', label:'Column count', type:'text', def:'', placeholder:'2 / auto'},
      {key:'column-width', label:'Column width', type:'text', def:'', placeholder:'240px / auto'},
      {key:'column-gap', label:'Column gap', type:'text', def:'', placeholder:'24px / normal'},
      {key:'column-rule', label:'Column rule', type:'text', def:'', placeholder:'1px solid #ccc'},
      {key:'column-fill', label:'Column fill', type:'select', options:['balance','auto','balance-all'], def:'balance'},
      {key:'column-span', label:'Column span', type:'select', options:['none','all'], def:'none'},
      {key:'break-before', label:'Break before', type:'select', options:['auto','avoid','always','all','column','page','left','right'], def:'auto'},
      {key:'break-after', label:'Break after', type:'select', options:['auto','avoid','always','all','column','page','left','right'], def:'auto'},
      {key:'break-inside', label:'Break inside', type:'select', options:['auto','avoid','avoid-column','avoid-page','avoid-region'], def:'auto'},
      {key:'orphans', label:'Orphans', type:'text', def:'', placeholder:'2'},
      {key:'widows', label:'Widows', type:'text', def:'', placeholder:'2'}
    ],
    containment: [
      {key:'contain', label:'Contain', type:'select', options:['none','strict','content','size','inline-size','layout','paint','style'], def:'none'},
      {key:'container-type', label:'Container type', type:'select', options:['normal','size','inline-size','scroll-state'], def:'normal'},
      {key:'container-name', label:'Container name', type:'text', def:'', placeholder:'sidebar'},
      {key:'content-visibility', label:'Content visibility', type:'select', options:['visible','hidden','auto'], def:'visible'},
      {key:'contain-intrinsic-width', label:'Contain intrinsic width', type:'text', def:'', placeholder:'auto / 500px'},
      {key:'contain-intrinsic-height', label:'Contain intrinsic height', type:'text', def:'', placeholder:'auto / 300px'},
      {key:'contain-intrinsic-size', label:'Contain intrinsic size', type:'text', def:'', placeholder:'auto / 500px 300px'},
      {key:'anchor-name', label:'Anchor name', type:'text', def:'', placeholder:'--card-anchor'},
      {key:'position-anchor', label:'Position anchor', type:'text', def:'', placeholder:'--card-anchor'},
      {key:'anchor-scope', label:'Anchor scope', type:'text', def:'', placeholder:'--card-anchor'}
    ],
    rendering: [
      {key:'image-rendering', label:'Image rendering', type:'select', options:['auto','smooth','high-quality','crisp-edges','pixelated'], def:'auto'},
      {key:'shape-rendering', label:'Shape rendering', type:'select', options:['auto','optimizeSpeed','crispEdges','geometricPrecision'], def:'auto'},
      {key:'text-rendering', label:'Text rendering', type:'select', options:['auto','optimizeSpeed','optimizeLegibility','geometricPrecision'], def:'auto'},
      {key:'color-interpolation', label:'Color interpolation', type:'select', options:['auto','sRGB','linearRGB'], def:'auto'},
      {key:'color-interpolation-filters', label:'Filter interpolation', type:'select', options:['auto','sRGB','linearRGB'], def:'auto'},
      {key:'forced-color-adjust', label:'Forced colors', type:'select', options:['auto','none','preserve-parent-color'], def:'auto'},
      {key:'print-color-adjust', label:'Print color adjust', type:'select', options:['economy','exact'], def:'economy'},
      {key:'text-size-adjust', label:'Text size adjust', type:'text', def:'', placeholder:'auto / none / 100%'},
      {key:'content', label:'Content', type:'text', def:'', placeholder:'none / "Testo" / attr(data-x)'},
      {key:'visibility', label:'Visibility', type:'select', options:['visible','hidden','collapse'], def:'visible'}
    ],
    cssValues: [
      {key:'--colore-principale', label:'Variabile colore', type:'text', def:'', placeholder:'#4f8 / o un altro valore'},
      {key:'--spazio-base', label:'Variabile spazio', type:'text', def:'', placeholder:'16px / 1rem'},
      {key:'--dimensione-titolo', label:'Variabile dimensione', type:'text', def:'', placeholder:'clamp(1.5rem, 4vw, 3rem)'},
      {key:'--ombra-card', label:'Variabile ombra', type:'text', def:'', placeholder:'0 8px 30px rgb(0 0 0 / .15)'},
      {key:'color', label:'Color con var()', type:'text', def:'', placeholder:'var(--colore-principale)'},
      {key:'width', label:'Width con funzione', type:'text', def:'', placeholder:'clamp(200px, 50vw, 800px)'},
      {key:'height', label:'Height con funzione', type:'text', def:'', placeholder:'calc(100vh - 80px)'},
      {key:'margin-inline', label:'Spazio con calc()', type:'text', def:'', placeholder:'calc(var(--spazio-base) * 2)'},
      {key:'font-size', label:'Font con clamp()', type:'text', def:'', placeholder:'clamp(1rem, 2vw, 2rem)'},
      {key:'filter', label:'Filtro con funzioni', type:'text', def:'', placeholder:'blur(4px) brightness(1.1)'}
    ],
    backgroundAdvanced: [
      {key:'background-repeat', label:'Ripetizione', type:'select', options:['repeat','no-repeat','repeat-x','repeat-y','space','round'], def:'repeat'},
      {key:'background-position', label:'Posizione', type:'text', def:'', placeholder:'center / 50% 50%'},
      {key:'background-size', label:'Dimensione', type:'text', def:'', placeholder:'cover / contain / 100% 100%'},
      {key:'background-attachment', label:'Attachment', type:'select', options:['scroll','fixed','local'], def:'scroll'},
      {key:'background-origin', label:'Origine', type:'select', options:['padding-box','border-box','content-box'], def:'padding-box'},
      {key:'background-clip', label:'Clip', type:'select', options:['border-box','padding-box','content-box','text'], def:'border-box'},
      {key:'background-blend-mode', label:'Blend', type:'select', options:['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'], def:'normal'},
      {key:'background-color', label:'Colore sfondo', type:'text', def:'', placeholder:'#fff / var(--colore-principale)'},
      {key:'background-image', label:'Immagine / gradiente', type:'text', def:'', placeholder:'url(...) / linear-gradient(...)'},
      {key:'background-position-x', label:'Posizione X', type:'text', def:'', placeholder:'center / 50%'},
      {key:'background-position-y', label:'Posizione Y', type:'text', def:'', placeholder:'center / 50%'},
      {key:'background-size-x', label:'Dimensione X', type:'text', def:'', placeholder:'100%'},
      {key:'background-size-y', label:'Dimensione Y', type:'text', def:'', placeholder:'100%'}
    ],
    typographyAdvanced: [
      {key:'font-family', label:'Famiglia font', type:'text', def:'', placeholder:'system-ui, sans-serif'},
      {key:'font-size', label:'Dimensione', type:'text', def:'', placeholder:'16px / 1rem / clamp(...)'},
      {key:'font-weight', label:'Peso', type:'select', options:['100','200','300','400','500','600','700','800','900','normal','bold','lighter','bolder'], def:'400'},
      {key:'font-style', label:'Stile', type:'select', options:['normal','italic','oblique'], def:'normal'},
      {key:'font-stretch', label:'Condensazione', type:'select', options:['normal','ultra-condensed','extra-condensed','condensed','semi-condensed','semi-expanded','expanded','extra-expanded','ultra-expanded'], def:'normal'},
      {key:'line-height', label:'Interlinea', type:'text', def:'', placeholder:'normal / 1.5 / 24px'},
      {key:'letter-spacing', label:'Spaziatura lettere', type:'text', def:'', placeholder:'normal / 0.04em'},
      {key:'word-spacing', label:'Spaziatura parole', type:'text', def:'', placeholder:'normal / 4px'},
      {key:'text-align', label:'Allineamento', type:'select', options:['start','end','left','right','center','justify'], def:'start'},
      {key:'text-decoration-line', label:'Decorazione', type:'select', options:['none','underline','overline','line-through','underline overline','underline line-through'], def:'none'},
      {key:'text-decoration-style', label:'Stile decorazione', type:'select', options:['solid','double','dotted','dashed','wavy'], def:'solid'},
      {key:'text-decoration-color', label:'Colore decorazione', type:'text', def:'', placeholder:'currentColor / #f00'},
      {key:'text-underline-offset', label:'Offset sottolineatura', type:'text', def:'', placeholder:'auto / 3px / 0.1em'},
      {key:'text-transform', label:'Trasformazione', type:'select', options:['none','capitalize','uppercase','lowercase','full-width','full-size-kana'], def:'none'},
      {key:'font-variant', label:'Varianti', type:'text', def:'', placeholder:'normal / small-caps'},
      {key:'font-feature-settings', label:'OpenType features', type:'text', def:'', placeholder:'"liga" 1, "kern" 1'},
      {key:'font-variation-settings', label:'Variazioni font', type:'text', def:'', placeholder:'"wght" 600'},
      {key:'font-kerning', label:'Kerning', type:'select', options:['auto','normal','none'], def:'auto'},
      {key:'font-optical-sizing', label:'Optical sizing', type:'select', options:['auto','none'], def:'auto'}
    ],
    flexbox: [
      {key:'display', label:'Display', type:'select', options:['flex','inline-flex'], def:'flex'},
      {key:'flex-direction', label:'Direzione', type:'select', options:['row','row-reverse','column','column-reverse'], def:'row'},
      {key:'flex-wrap', label:'A capo', type:'select', options:['nowrap','wrap','wrap-reverse'], def:'nowrap'},
      {key:'justify-content', label:'Distribuzione principale', type:'select', options:['normal','start','end','flex-start','flex-end','center','space-between','space-around','space-evenly','stretch'], def:'normal'},
      {key:'align-items', label:'Allineamento elementi', type:'select', options:['normal','stretch','start','end','center','flex-start','flex-end','self-start','self-end','baseline'], def:'normal'},
      {key:'align-content', label:'Allineamento righe', type:'select', options:['normal','stretch','start','end','center','flex-start','flex-end','space-between','space-around','space-evenly'], def:'normal'},
      {key:'gap', label:'Gap', type:'text', def:'', placeholder:'16px / 10px 20px'},
      {key:'row-gap', label:'Row gap', type:'text', def:'', placeholder:'16px'},
      {key:'column-gap', label:'Column gap', type:'text', def:'', placeholder:'16px'},
      {key:'place-content', label:'Place content', type:'text', def:'', placeholder:'center / space-between center'},
      {key:'place-items', label:'Place items', type:'text', def:'', placeholder:'center'},
      {key:'flex-flow', label:'Flex flow', type:'text', def:'', placeholder:'row wrap'}
    ],
    flexItem: [
      {key:'order', label:'Ordine', type:'text', def:'', placeholder:'0 / 2 / -1'},
      {key:'flex', label:'Flex shorthand', type:'text', def:'', placeholder:'1 1 auto'},
      {key:'flex-grow', label:'Flex grow', type:'text', def:'', placeholder:'0 / 1'},
      {key:'flex-shrink', label:'Flex shrink', type:'text', def:'', placeholder:'1 / 0'},
      {key:'flex-basis', label:'Flex basis', type:'text', def:'', placeholder:'auto / 200px'},
      {key:'align-self', label:'Align self', type:'select', options:['auto','normal','stretch','start','end','center','flex-start','flex-end','self-start','self-end','baseline'], def:'auto'}
    ],
    grid: [
      {key:'display', label:'Display', type:'select', options:['grid','inline-grid'], def:'grid'},
      {key:'grid-template-columns', label:'Colonne', type:'text', def:'', placeholder:'repeat(3, 1fr)'},
      {key:'grid-template-rows', label:'Righe', type:'text', def:'', placeholder:'auto 1fr auto'},
      {key:'grid-template-areas', label:'Aree', type:'text', def:'', placeholder:'"header header" "main aside"'},
      {key:'grid-template', label:'Template shorthand', type:'text', def:'', placeholder:'...'},
      {key:'grid-auto-columns', label:'Auto colonne', type:'text', def:'', placeholder:'auto / 1fr'},
      {key:'grid-auto-rows', label:'Auto righe', type:'text', def:'', placeholder:'auto / minmax(100px, auto)'},
      {key:'grid-auto-flow', label:'Auto flow', type:'select', options:['row','column','dense','row dense','column dense'], def:'row'},
      {key:'gap', label:'Gap', type:'text', def:'', placeholder:'16px / 10px 20px'},
      {key:'justify-content', label:'Distribuzione X', type:'select', options:['normal','start','end','center','stretch','space-between','space-around','space-evenly'], def:'normal'},
      {key:'align-content', label:'Distribuzione Y', type:'select', options:['normal','start','end','center','stretch','space-between','space-around','space-evenly'], def:'normal'},
      {key:'justify-items', label:'Allineamento cella X', type:'select', options:['normal','stretch','start','end','center'], def:'normal'},
      {key:'align-items', label:'Allineamento cella Y', type:'select', options:['normal','stretch','start','end','center'], def:'normal'},
      {key:'place-content', label:'Place content', type:'text', def:'', placeholder:'center'},
      {key:'place-items', label:'Place items', type:'text', def:'', placeholder:'center'}
    ],
    gridItem: [
      {key:'grid-column', label:'Colonna', type:'text', def:'', placeholder:'1 / 3 / span 2'},
      {key:'grid-column-start', label:'Colonna inizio', type:'text', def:'', placeholder:'1'},
      {key:'grid-column-end', label:'Colonna fine', type:'text', def:'', placeholder:'3'},
      {key:'grid-row', label:'Riga', type:'text', def:'', placeholder:'1 / 3 / span 2'},
      {key:'grid-row-start', label:'Riga inizio', type:'text', def:'', placeholder:'1'},
      {key:'grid-row-end', label:'Riga fine', type:'text', def:'', placeholder:'3'},
      {key:'grid-area', label:'Area', type:'text', def:'', placeholder:'header'},
      {key:'justify-self', label:'Justify self', type:'select', options:['auto','normal','stretch','start','end','center'], def:'auto'},
      {key:'align-self', label:'Align self', type:'select', options:['auto','normal','stretch','start','end','center'], def:'auto'},
      {key:'place-self', label:'Place self', type:'text', def:'', placeholder:'center'}
    ]
  };

  function advancedKey(target, prop){ return `${target}@@${prop}`; }
  function advancedValue(target, prop){
    return ext.visualAdvanced.rules[advancedKey(target,prop)]?.value ?? '';
  }
  function setAdvancedValue(target, prop, value, rerender=true){
    const t = cssSafe(target || 'body') || 'body';
    const key = advancedKey(t, prop);
    if(String(value ?? '').trim()===''){
      delete ext.visualAdvanced.rules[key];
    } else {
      ext.visualAdvanced.rules[key] = {target:t, prop, value:String(value)};
    }
    if(rerender) renderAdvancedEditors();
    refresh();
  }
  function advancedCss(){
    const byTarget = {};
    Object.values(ext.visualAdvanced.rules).forEach(e=>{
      if(!byTarget[e.target]) byTarget[e.target] = [];
      byTarget[e.target].push(e);
    });
    return Object.entries(byTarget).map(([target, entries])=>{
      const body = entries.map(e=>`  ${cssSafe(e.prop)}: ${String(e.value).replace(/[{};]/g,'')};`).join('\n');
      return `${cssSafe(target) || 'body'} {\n${body}\n}`;
    }).join('\n\n');
  }

  function advancedEditor(group, target){
    const rows = ADVANCED_GROUPS[group].map(d=>{
      const value = advancedValue(target, d.key);
      let input = '';
      if(d.type === 'select'){
        input = `<select data-adv-target="${esc(target)}" data-adv-prop="${esc(d.key)}"><option value="">— non impostato —</option>${
          d.options.map(o=>`<option value="${esc(o)}" ${o===value?'selected':''}>${esc(o)}</option>`).join('')
        }</select>`;
      } else {
        input = `<input type="text" value="${esc(value)}" placeholder="${esc(d.placeholder || d.def || 'Valore CSS')}" data-adv-target="${esc(target)}" data-adv-prop="${esc(d.key)}">`;
      }
      return `<label class="advanced-field"><span>${esc(d.label)} <code>${esc(d.key)}</code></span>${input}</label>`;
    }).join('');
    return `<div class="advanced-group"><h3>${esc({
      sizing:'Dimensioni & oggetti',
      scrolling:'Scrolling & snap',
      logical:'Box model logico',
      typography:'Tipografia avanzata',
      masking:'Masking & clip SVG',
      compositing:'Compositing & rendering layer',
      svg:'SVG & pittura vettoriale',
      uiForms:'UI, form & interazione',
      columnsPaging:'Colonne & paginazione',
      containment:'Containment & anchor positioning',
      rendering:'Rendering, accessibilità & contenuto',
      cssValues:'Variabili & funzioni CSS',
      backgroundAdvanced:'Background avanzato',
      typographyAdvanced:'Tipografia avanzata',
      flexbox:'Flexbox — contenitore',
      flexItem:'Flexbox — elemento',
      grid:'Grid — contenitore',
      gridItem:'Grid — elemento'
    }[group])}</h3><div class="advanced-fields">${rows}</div></div>`;
  }

  function renderAdvancedEditors(){
    const host=$('advancedVisualEditors');
    if(!host) return;
    const target = cssSafe($('advancedTarget')?.value || selectedSelector()) || 'body';
    host.innerHTML = Object.keys(ADVANCED_GROUPS).map(g=>advancedEditor(g,target)).join('');
    const code=$('advancedVisualOutput')?.querySelector('code');
    if(code) code.textContent=advancedCss() || '/* Nessuna proprietà avanzata */';
    updateAdvancedCount();
  }

  function injectAdvancedUi(){
    if($('advancedVisualEditors')) return;
    const controls=$('controls'); if(!controls) return;
    const section=document.createElement('section');
    section.className='panel-section advanced-visual-section';
    section.innerHTML=`
      <div class="section-title-row"><h2>8. Editor visuali avanzati</h2><span id="advancedVisualCount" class="counter">0</span></div>
      <p class="hint">Controlli visuali per proprietà moderne che non richiedono necessariamente un editor grafico complesso.</p>
      <div class="advanced-target-row">
        <label class="mini-field wide"><span>Elemento / selettore da modificare</span><input id="advancedTarget" value="${esc(selectedSelector())}" placeholder=".card, #menu, body"></label>
        <button type="button" id="advancedUseSelected">Usa elemento selezionato</button>
        <button type="button" id="advancedClearTarget">Cancella proprietà di questo selettore</button>
      </div>
      <div id="advancedVisualEditors"></div>
      <div id="advancedVisualOutput" class="at-rule-preview secondary-code-output"><code></code></div>`;
    document.querySelector('.timeline-section')?.after(section) || controls.appendChild(section);

    $('advancedUseSelected')?.addEventListener('click',()=>{
      const input=$('advancedTarget');
      if(input){ input.value=selectedSelector(); renderAdvancedEditors(); }
    });
    $('advancedClearTarget')?.addEventListener('click',()=>{
      const target=cssSafe($('advancedTarget')?.value || selectedSelector()) || 'body';
      Object.keys(ext.visualAdvanced.rules).forEach(k=>{
        if(ext.visualAdvanced.rules[k]?.target===target) delete ext.visualAdvanced.rules[k];
      });
      renderAdvancedEditors(); refresh();
    });
    $('advancedTarget')?.addEventListener('input',renderAdvancedEditors);
    $('advancedVisualEditors')?.addEventListener('input',e=>{
      const t=e.target;
      if(!t.matches('[data-adv-target]')) return;
      setAdvancedValue(t.dataset.advTarget,t.dataset.advProp,t.value,false);
    });
    $('advancedVisualEditors')?.addEventListener('change',e=>{
      const t=e.target;
      if(!t.matches('[data-adv-target]')) return;
      setAdvancedValue(t.dataset.advTarget,t.dataset.advProp,t.value,true);
    });
    renderAdvancedEditors();
  }

  const prevExtensionCss = extensionCss;
  extensionCss = function(){
    const base = prevExtensionCss();
    const extra = advancedCss();
    return [base,extra].filter(Boolean).join('\n\n');
  };

  function updateAdvancedCount(){
    const c=$('advancedVisualCount'); if(c) c.textContent=String(Object.keys(ext.visualAdvanced.rules).length);
  }

  function injectUi(){
    if($('atRules')) return;
    const controls=$('controls'); if(!controls) return;
    const section=document.createElement('section');
    section.className='panel-section atrules-section';
    section.innerHTML=`
      <div class="section-title-row"><h2>6. Regole CSS</h2><span id="atRuleCount" class="counter">0</span></div>
      <p class="hint">Regole strutturali e condizionali con proprietà CSS modificabili visualmente.</p>
      <div class="at-rule-toolbar"><select id="atRuleType"><option value="media">@media</option><option value="container">@container</option><option value="supports">@supports</option><option value="layer">@layer</option><option value="scope">@scope</option><option value="starting-style">@starting-style</option></select><button id="addAtRuleButton" type="button">+ Aggiungi</button></div>
      <div id="atRules" class="at-rules"></div>`;
    controls.closest('.controls-section')?.after(section);

    $('addAtRuleButton')?.addEventListener('click',()=>addAtRule($('atRuleType')?.value||'media'));
    $('atRules')?.addEventListener('input',onRuleEvent);
    $('atRules')?.addEventListener('change',onRuleEvent);
    $('atRules')?.addEventListener('click',e=>{
      const remove=e.target.closest('[data-at-remove]');
      if(remove){ext.atRules.splice(Number(remove.dataset.atRemove),1);renderAtRules();refresh();return;}
      const propRemove=e.target.closest('[data-rule-remove]');
      if(propRemove){clearRuleProperty(Number(propRemove.dataset.ruleRemove),propRemove.dataset.propRemove);return;}
    });
    renderAtRules();
  }

  function onRuleEvent(e){
    const t=e.target;
    if(t.dataset.atIndex!==undefined){
      setRuleValue(Number(t.dataset.atIndex),t.dataset.atKey,t.value);
      return;
    }
    const idx=t.dataset.ruleIndex;
    if(idx===undefined) return;
    const i=Number(idx);
    if(t.hasAttribute('data-rule-search')){ext.atRules[i].search=t.value;renderAtRules();return;}
    if(t.hasAttribute('data-rule-add-property')){
      if(!t.value) return;
      const d=propertyDefinition(t.value);
      setRuleProperty(i,t.value,d.defaultValue??'');
      return;
    }
    const prop=t.dataset.ruleProp;
    if(!prop) return;
    if(t.dataset.ruleKind==='color' || t.dataset.ruleKind==='range' || t.dataset.ruleKind==='number' || t.dataset.ruleKind==='select' || t.dataset.ruleKind==='text') setRuleProperty(i,prop,t.value,true,false);
  }

  function injectOutput(){
    if($('cssAtRuleOutput')) return;
    const out=$('cssOutput'); if(!out) return;
    const wrap=document.createElement('pre'); wrap.id='cssAtRuleOutput'; wrap.className='css-output secondary-code-output'; wrap.innerHTML='<code></code>';
    out.parentElement?.appendChild(wrap);
  }

  const originalBuildCss=window.buildCss;
  if(typeof originalBuildCss==='function' && !window.CVB_EXTENSIONS._buildCssWrapped){
    window.CVB_EXTENSIONS._buildCssWrapped=true;
    window.buildCss=function(){
      const base=originalBuildCss();
      const extra=extensionCss();
      return [base,extra].filter(Boolean).join('\n\n');
    };
  }

  const oldUpdate=window.updateCssAndPreview;
  if(typeof oldUpdate==='function' && !window.CVB_EXTENSIONS._updateWrapped){
    window.CVB_EXTENSIONS._updateWrapped=true;
    window.updateCssAndPreview=function(){
      oldUpdate();
      const code=$('cssAtRuleOutput')?.querySelector('code');
      if(code) code.textContent=extensionCss()||'/* Nessuna at-rule */';
    };
  }

  injectWorkspaceResizer(); injectUi(); injectSpecialAtRuleUi(); injectOutput(); injectTimelineUi(); injectAdvancedUi(); injectSelectorLab(); injectNestingUi(); injectValueLab(); renderAtRules(); renderSpecialAtRules(); renderTimelines(); renderAdvancedEditors(); renderSelectorLab(); renderNesting(); renderValueLabOnly();
  if(typeof window.updateCssAndPreview==='function') window.updateCssAndPreview();
})();
