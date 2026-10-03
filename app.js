const defaultHtml = `
<header>
  <h1>La mia pagina</h1>
  <p>Un piccolo esempio da abbellire visualmente.</p>
</header>
<main>
  <div class="card">
    <h2>Titolo</h2>
    <p>Questo testo cambierà aspetto quando selezionerai le proprietà CSS.</p>
    <a href="#">Un collegamento</a>
  </div>
  <ul>
    <li>Elemento uno</li>
    <li>Elemento due</li>
    <li>Elemento tre</li>
  </ul>
</main>
<footer id="footer">Piè di pagina</footer>`;

const propertyDefinitions = Array.isArray(window.CSS_PROPERTY_DATABASE) ? window.CSS_PROPERTY_DATABASE : [];
const state = {html:defaultHtml,nodes:[],tags:[],selected:null,layoutSelection:new Set(),layoutMulti:false,styles:new Map(),keyframes:new Map(),pseudo:'normal',dragMode:false,dragSnap:8};
const els = Object.fromEntries(Object.entries({htmlInput:'htmlInput',applyHtmlButton:'applyHtmlButton',fileInput:'fileInput',resetButton:'resetButton',downloadButton:'downloadButton',domSearch:'domSearch',domTree:'domTree',nodeCount:'nodeCount',selectedSelector:'selectedSelector',tagSearch:'tagSearch',tagList:'tagList',tagCount:'tagCount',selectedLabel:'selectedLabel',controlSelector:'controlSelector',clearStylesButton:'clearStylesButton',propertySearch:'propertySearch',controls:'controls',previewFrame:'previewFrame',previewFrameWrap:'previewFrameWrap',previewHelp:'previewHelp',dragModeToggle:'dragModeToggle',dragSnap:'dragSnap',desktopButton:'desktopButton',mobileButton:'mobileButton',cssOutput:'cssOutput',copyCssButton:'copyCssButton',previewStatus:'previewStatus',layoutMultiToggle:'layoutMultiToggle',layoutSelectionCount:'layoutSelectionCount',layoutGap:'layoutGap',layoutActions:'layoutActions',cssPropertyCount:'cssPropertyCount'}).map(([k,id])=>[k,document.getElementById(id)]));
els.cssOutput=document.querySelector('#cssOutput code');

function esc(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}
function parseHtml(html){return new DOMParser().parseFromString(`<body>${html}</body>`,'text/html').body;}
function makeSelector(el){if(el.id)return '#'+CSS.escape(el.id);const parts=[];let cur=el;while(cur&&cur.tagName&&cur.tagName.toLowerCase()!=='body'){let p=cur.tagName.toLowerCase();if(cur.classList.length)p+='.'+[...cur.classList].map(CSS.escape).join('.');const siblings=cur.parentElement?[...cur.parentElement.children].filter(x=>x.tagName===cur.tagName):[];if(siblings.length>1)p+=`:nth-of-type(${siblings.indexOf(cur)+1})`;parts.unshift(p);cur=cur.parentElement;}return parts.join(' > ');}
function buildNodes(){const body=parseHtml(state.html),nodes=[],tagSet=new Set();let index=0;[...body.querySelectorAll('*')].forEach(el=>{const selector=makeSelector(el);const node={id:String(index++),tag:el.tagName.toLowerCase(),className:el.className?.toString()||'',elementId:el.id||'',text:(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,42),selector,parentSelector:el.parentElement&&el.parentElement.tagName.toLowerCase()!=='body'?makeSelector(el.parentElement):'body',depth:getDepth(el)};nodes.push(node);tagSet.add(node.tag);});state.nodes=nodes;state.tags=[...tagSet].sort();}
function getDepth(el){let d=0;while(el.parentElement&&el.parentElement.tagName.toLowerCase()!=='body'){d++;el=el.parentElement;}return d;}
function styleMap(selector){if(!state.styles.has(selector))state.styles.set(selector,{});return state.styles.get(selector);}
function styleEntry(selector,key,create=true){const map=create?styleMap(selector):state.styles.get(selector);if(!map)return null;if(!map[key]&&create)map[key]={enabled:false,value:''};return map[key]||null;}
function setProperty(selector,key,value,enabled=true,rerender=false){const map=styleMap(selector);if(!map[key])map[key]={enabled:false,value:''};map[key].value=value;map[key].enabled=enabled;if(!enabled&&value==='')delete map[key];if(rerender)renderAll();else updateCssAndPreview();}
function getValue(selector,d){const e=styleEntry(selector,d.key,false);return e?e.value:'';}
function propertyValues(selector){const raw=state.styles.get(selector)||{};return Object.fromEntries(Object.entries(raw).map(([k,e])=>[k,e?.value??'']));}
function isEnabled(selector,d){const e=styleEntry(selector,d.key,false);return !!e?.enabled;}
function activeSelector(){if(!state.selected)return null;const pseudo=state.pseudo||'normal';return pseudo==='normal'?state.selected:state.selected+pseudo;}
function pseudoLabel(){return state.pseudo==='normal'?'Stato normale':state.pseudo;}
function enableProperty(selector,d,enabled){const e=styleEntry(selector,d.key,enabled);if(!e)return;const current=e.value!==''?e.value:(d.defaultValue??'');e.value=current;e.enabled=enabled;updateCssAndPreview();updateControlVisual(d.key);}
function removeProperty(selector,key){const map=state.styles.get(selector);if(!map)return;delete map[key];if(Object.keys(map).length===0)state.styles.delete(selector);updateCssAndPreview();}
function selectorMatchesTag(tag){if(!state.selected)return false;return state.selected===tag;}
function renderDom(){const q=els.domSearch.value.trim().toLowerCase();els.nodeCount.textContent=String(state.nodes.length);const list=state.nodes.filter(n=>!q||`${n.tag} ${n.className} ${n.elementId} ${n.selector}`.toLowerCase().includes(q));els.domTree.innerHTML=list.length?list.map(n=>`<button type="button" class="dom-node ${state.selected===n.selector?'active':''} ${state.layoutSelection.has(n.selector)?'layout-selected':''}" style="--depth:${Math.min(n.depth,8)}" data-selector="${esc(n.selector)}"><span class="node-check">${state.layoutSelection.has(n.selector)?'✓':'○'}</span><span class="node-tag">&lt;${esc(n.tag)}&gt;</span>${n.elementId?`<span class="node-meta">#${esc(n.elementId)}</span>`:''}${n.className?`<span class="node-meta">.${esc(n.className.split(/\s+/).join('.'))}</span>`:''}<span class="node-text">${esc(n.text)}</span></button>`).join(''):'<span class="hint">Nessun elemento trovato.</span>';}
function renderTags(){const q=els.tagSearch.value.trim().toLowerCase();const filtered=state.tags.filter(t=>t.includes(q));els.tagCount.textContent=String(state.tags.length);els.tagList.innerHTML=filtered.length?filtered.map(tag=>`<button type="button" class="tag-button ${selectorMatchesTag(tag)?'active':''}" data-tag="${esc(tag)}">&lt;${esc(tag)}&gt;</button>`).join(''):'<span class="hint">Nessun tag trovato.</span>';}

function animationKey(selector){return selector||'body';}
function defaultKeyframes(selector){
  const k=animationKey(selector);
  if(!state.keyframes.has(k)) state.keyframes.set(k,{
    0:{transform:'translateX(-40px) scale(.96) rotate(0deg)',opacity:'0',color:'',backgroundColor:''},
    25:{transform:'translateX(-15px) scale(.98) rotate(0deg)',opacity:'0.45',color:'',backgroundColor:''},
    50:{transform:'translateX(8px) scale(1.01) rotate(0deg)',opacity:'0.8',color:'',backgroundColor:''},
    75:{transform:'translateX(-3px) scale(1) rotate(0deg)',opacity:'0.95',color:'',backgroundColor:''},
    100:{transform:'translateX(0) scale(1) rotate(0deg)',opacity:'1',color:'',backgroundColor:''}
  });
  return state.keyframes.get(k);
}
function keyframesFor(selector){
  return state.keyframes.get(animationKey(selector)) || {};
}
function renderKeyframeTimeline(selector,d,base){
  const frames=defaultKeyframes(selector);
  const perc=[0,25,50,75,100];
  const rows=perc.map(pc=>{
    const f=frames[pc]||{transform:'',opacity:'',color:'',backgroundColor:''};
    return `<div class="kf-row" data-keyframe="${pc}">
      <div class="kf-percent"><span>${pc}%</span><span class="kf-dot"></span></div>
      <label class="mini-field"><span>Transform</span><input type="text" value="${esc(f.transform||'')}" placeholder="translateX(0) scale(1)" data-property="${esc(d.key)}" data-kind="keyframe-transform" data-frame="${pc}"></label>
      <label class="mini-field"><span>Opacità</span><input type="number" min="0" max="1" step="0.05" value="${esc(f.opacity??'')}" placeholder="0 → 1" data-property="${esc(d.key)}" data-kind="keyframe-opacity" data-frame="${pc}"></label>
      <label class="mini-field"><span>Colore</span><input type="color" value="${esc(normalizeColorHex(f.color,'#000000'))}" data-property="${esc(d.key)}" data-kind="keyframe-color" data-frame="${pc}"></label>
      <label class="mini-field"><span>Sfondo</span><input type="color" value="${esc(normalizeColorHex(f.backgroundColor,'#000000'))}" data-property="${esc(d.key)}" data-kind="keyframe-bg" data-frame="${pc}"></label>
    </div>`;
  }).join('');
  const presetButtons=`<div class="preset-row editor"><button type="button" data-action="keyframe-preset" data-property="${esc(d.key)}" data-preset="entrance">Ingresso</button><button type="button" data-action="keyframe-preset" data-property="${esc(d.key)}" data-preset="fade">Dissolvenza</button><button type="button" data-action="keyframe-preset" data-property="${esc(d.key)}" data-preset="bounce">Rimbalzo</button><button type="button" data-action="keyframe-preset" data-property="${esc(d.key)}" data-preset="reset">Azzera</button></div>`;
  return `<div class="keyframe-editor editor"><div class="timeline-ruler"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div><div class="keyframe-timeline">${rows}</div>${presetButtons}<div class="hint animation-help">I fotogrammi vengono trasformati automaticamente in <code>@keyframes</code>. Puoi modificare transform, opacità e colori per ogni tappa.</div></div>`;
}
function editorInput(d,s){
  const selector=activeSelector();
  const cur=getValue(selector,d), enabled=isEnabled(selector,d);
  const base=cur!==''?cur:(d.defaultValue??'');
  if(d.type==='color')return `<div class="editor control-row"><input class="value-input" type="text" value="${esc(cur)}" placeholder="${esc(d.defaultValue||'#000000')}" data-property="${esc(d.key)}" data-kind="color-text"><input type="color" value="${esc(/^#[0-9a-f]{6}$/i.test(base)?base:'#000000')}" data-property="${esc(d.key)}" data-kind="color-picker"></div>`;
  if(d.type==='range-number')return `<div class="editor control-row"><input type="range" min="${d.min}" max="${d.max}" step="${d.step}" value="${Number.isFinite(parseFloat(base))?parseFloat(base):d.min}" data-property="${esc(d.key)}" data-kind="range" data-unit="${esc(d.unit||'')}"><input class="value-input" type="number" min="${d.min}" max="${d.max}" step="${d.step}" value="${esc(parseFloat(base))}" data-property="${esc(d.key)}" data-kind="number" data-unit="${esc(d.unit||'')}"></div>`;
  if(d.type==='box-model')return `<div class="editor editor-grid grid-4">${[['top','Top'],['right','Destra'],['bottom','Basso'],['left','Sinistra']].map(([side,label])=>`<label class="mini-field"><span>${label}</span><input type="number" min="${d.min}" max="${d.max}" step="${d.step}" value="${esc(parseBoxSide(base,side))}" data-property="${esc(d.key)}" data-kind="box-side" data-side="${side}" data-unit="${esc(d.unit||'')}"></label>`).join('')}</div><div class="preset-row editor"><button type="button" data-action="box-preset" data-property="${esc(d.key)}" data-preset="0">0</button><button type="button" data-action="box-preset" data-property="${esc(d.key)}" data-preset="8">8px</button><button type="button" data-action="box-preset" data-property="${esc(d.key)}" data-preset="16">16px</button><button type="button" data-action="box-preset" data-property="${esc(d.key)}" data-preset="24">24px</button></div>`;
  if(d.type==='radius-4')return `<div class="editor editor-grid grid-4">${[['tl','Alto SX'],['tr','Alto DX'],['br','Basso DX'],['bl','Basso SX']].map(([corner,label])=>`<label class="mini-field"><span>${label}</span><input type="number" min="0" max="250" step="1" value="${esc(parseRadius(base,corner))}" data-property="${esc(d.key)}" data-kind="radius-side" data-corner="${corner}"></label>`).join('')}</div><div class="preset-row editor"><button type="button" data-action="radius-preset" data-property="${esc(d.key)}" data-value="0">0</button><button type="button" data-action="radius-preset" data-property="${esc(d.key)}" data-value="8">8px</button><button type="button" data-action="radius-preset" data-property="${esc(d.key)}" data-value="16">16px</button><button type="button" data-action="radius-preset" data-property="${esc(d.key)}" data-value="999">Pill</button></div>`;
  if(d.type==='shadow')return `<div class="editor-grid editor grid-2"><label class="mini-field"><span>X</span><input type="number" value="${esc(parseShadow(base).x)}" data-property="${esc(d.key)}" data-kind="shadow-x"></label><label class="mini-field"><span>Y</span><input type="number" value="${esc(parseShadow(base).y)}" data-property="${esc(d.key)}" data-kind="shadow-y"></label><label class="mini-field"><span>Blur</span><input type="number" min="0" value="${esc(parseShadow(base).blur)}" data-property="${esc(d.key)}" data-kind="shadow-blur"></label><label class="mini-field"><span>Spread</span><input type="number" value="${esc(parseShadow(base).spread)}" data-property="${esc(d.key)}" data-kind="shadow-spread"></label><label class="mini-field"><span>Colore</span><input type="color" value="${esc(normalizeColorHex(parseShadow(base).color,'#000000'))}" data-property="${esc(d.key)}" data-kind="shadow-color-picker"></label></div><div class="preset-row editor"><button type="button" data-action="shadow-preset" data-property="${esc(d.key)}" data-value="none">Nessuna</button><button type="button" data-action="shadow-preset" data-property="${esc(d.key)}" data-value="0 4px 12px rgba(0,0,0,.15)">Morbida</button><button type="button" data-action="shadow-preset" data-property="${esc(d.key)}" data-value="0 10px 30px rgba(0,0,0,.22)">Forte</button></div>`;
  if(d.type==='text-shadow')return `<div class="editor-grid editor grid-2"><label class="mini-field"><span>X</span><input type="number" value="${esc(parseTextShadow(base).x)}" data-property="${esc(d.key)}" data-kind="text-shadow-x"></label><label class="mini-field"><span>Y</span><input type="number" value="${esc(parseTextShadow(base).y)}" data-property="${esc(d.key)}" data-kind="text-shadow-y"></label><label class="mini-field"><span>Blur</span><input type="number" min="0" value="${esc(parseTextShadow(base).blur)}" data-property="${esc(d.key)}" data-kind="text-shadow-blur"></label><label class="mini-field"><span>Colore</span><input type="color" value="${esc(normalizeColorHex(parseTextShadow(base).color,'#000000'))}" data-property="${esc(d.key)}" data-kind="text-shadow-color"></label></div><div class="preset-row editor"><button type="button" data-action="text-shadow-preset" data-property="${esc(d.key)}" data-value="none">Nessuna</button><button type="button" data-action="text-shadow-preset" data-property="${esc(d.key)}" data-value="2px 2px 4px rgba(0,0,0,.25)">Morbida</button><button type="button" data-action="text-shadow-preset" data-property="${esc(d.key)}" data-value="0 0 8px rgba(110,168,255,.8)">Glow</button></div>`;
  if(d.type==='transform-advanced'){const t=parseTransform(base);return `<div class="editor transform-advanced"><div class="editor-grid grid-3"><label class="mini-field"><span>↔ X (px)</span><input type="number" value="${esc(t.tx)}" data-property="${esc(d.key)}" data-kind="transform-tx"></label><label class="mini-field"><span>↕ Y (px)</span><input type="number" value="${esc(t.ty)}" data-property="${esc(d.key)}" data-kind="transform-ty"></label><label class="mini-field"><span>↗ Z (px)</span><input type="number" value="${esc(t.tz)}" data-property="${esc(d.key)}" data-kind="transform-tz"></label><label class="mini-field"><span>Scala X</span><input type="number" min="0" max="5" step="0.05" value="${esc(t.sx)}" data-property="${esc(d.key)}" data-kind="transform-sx"></label><label class="mini-field"><span>Scala Y</span><input type="number" min="0" max="5" step="0.05" value="${esc(t.sy)}" data-property="${esc(d.key)}" data-kind="transform-sy"></label><label class="mini-field"><span>Rotazione Z°</span><input type="number" min="-360" max="360" value="${esc(t.rz)}" data-property="${esc(d.key)}" data-kind="transform-rz"></label><label class="mini-field"><span>Rotazione X°</span><input type="number" min="-360" max="360" value="${esc(t.rx)}" data-property="${esc(d.key)}" data-kind="transform-rx"></label><label class="mini-field"><span>Rotazione Y°</span><input type="number" min="-360" max="360" value="${esc(t.ry)}" data-property="${esc(d.key)}" data-kind="transform-ry"></label><label class="mini-field"><span>Skew X°</span><input type="number" min="-90" max="90" value="${esc(t.skx)}" data-property="${esc(d.key)}" data-kind="transform-skx"></label><label class="mini-field"><span>Skew Y°</span><input type="number" min="-90" max="90" value="${esc(t.sky)}" data-property="${esc(d.key)}" data-kind="transform-sky"></label></div><div class="preset-row editor"><button type="button" data-action="transform-reset" data-property="${esc(d.key)}">Reset</button><button type="button" data-action="transform-preset" data-property="${esc(d.key)}" data-value="translate3d(0,0,0) scale(1.05,1.05) rotateX(0deg) rotateY(0deg) rotateZ(4deg) skewX(0deg) skewY(0deg)">Leggero</button><button type="button" data-action="transform-preset" data-property="${esc(d.key)}" data-value="translate3d(0,0,0) scale(1,1) rotateX(0deg) rotateY(0deg) rotateZ(12deg) skewX(0deg) skewY(0deg)">Ruota</button></div><div class="transform-live-value"><code>${esc(base||'none')}</code></div></div>`;}
  if(d.type==='filter-editor'){const f=parseFilter(base);return `<div class="editor filter-editor"><div class="filter-row"><label>Blur <output>${esc(f.blur)}px</output></label><input type="range" min="0" max="30" step="1" value="${esc(f.blur)}" data-property="${esc(d.key)}" data-kind="filter-blur"></div><div class="filter-row"><label>Luminosità <output>${Math.round(Number(f.brightness)*100)}%</output></label><input type="range" min="0" max="200" value="${Math.round(Number(f.brightness)*100)}" data-property="${esc(d.key)}" data-kind="filter-brightness"></div><div class="filter-row"><label>Contrasto <output>${Math.round(Number(f.contrast)*100)}%</output></label><input type="range" min="0" max="200" value="${Math.round(Number(f.contrast)*100)}" data-property="${esc(d.key)}" data-kind="filter-contrast"></div><div class="filter-row"><label>Scala di grigi <output>${Math.round(Number(f.grayscale)*100)}%</output></label><input type="range" min="0" max="100" value="${Math.round(Number(f.grayscale)*100)}" data-property="${esc(d.key)}" data-kind="filter-grayscale"></div><div class="filter-row"><label>Seppia <output>${Math.round(Number(f.sepia)*100)}%</output></label><input type="range" min="0" max="100" value="${Math.round(Number(f.sepia)*100)}" data-property="${esc(d.key)}" data-kind="filter-sepia"></div><div class="filter-row"><label>Saturazione <output>${Math.round(Number(f.saturate)*100)}%</output></label><input type="range" min="0" max="300" value="${Math.round(Number(f.saturate)*100)}" data-property="${esc(d.key)}" data-kind="filter-saturate"></div><div class="filter-row"><label>Tonalità <output>${esc(f.hue)}°</output></label><input type="range" min="-180" max="180" value="${esc(f.hue)}" data-property="${esc(d.key)}" data-kind="filter-hue"></div><div class="filter-row"><label>Inverti <output>${Math.round(Number(f.invert)*100)}%</output></label><input type="range" min="0" max="100" value="${Math.round(Number(f.invert)*100)}" data-property="${esc(d.key)}" data-kind="filter-invert"></div><div class="filter-row"><label>Opacità <output>${Math.round(Number(f.opacity)*100)}%</output></label><input type="range" min="0" max="100" value="${Math.round(Number(f.opacity)*100)}" data-property="${esc(d.key)}" data-kind="filter-opacity"></div><label class="mini-field"><span>Ombra (opzionale)</span><input type="text" placeholder="0 4px 12px rgba(0,0,0,.25)" value="${esc(f.dropShadow)}" data-property="${esc(d.key)}" data-kind="filter-drop-shadow"></label><div class="preset-row editor"><button type="button" data-action="filter-preset" data-property="${esc(d.key)}" data-value="none">Reset</button><button type="button" data-action="filter-preset" data-property="${esc(d.key)}" data-value="brightness(1.12) contrast(1.05) saturate(1.15)">Vivace</button><button type="button" data-action="filter-preset" data-property="${esc(d.key)}" data-value="grayscale(1) contrast(1.1)">B&N</button><button type="button" data-action="filter-preset" data-property="${esc(d.key)}" data-value="sepia(.25) saturate(1.25) contrast(1.05)">Caldo</button></div></div>`;}
  if(d.type==='gradient-visual'){const g=parseGradientVisual(base);return `<div class="editor visual-editor gradient-visual"><div class="visual-preview gradient-live" style="background:${esc(g.css)}"></div><div class="visual-grid"><label class="mini-field"><span>Tipo</span><select data-property="${esc(d.key)}" data-kind="gradient-type"><option ${g.type==='linear'?'selected':''} value="linear">Lineare</option><option ${g.type==='radial'?'selected':''} value="radial">Radiale</option><option ${g.type==='conic'?'selected':''} value="conic">Conico</option></select></label><label class="mini-field"><span>Angolo (°)</span><input type="range" min="0" max="360" value="${esc(g.angle)}" data-property="${esc(d.key)}" data-kind="gradient-angle-v"><output>${esc(g.angle)}°</output></label><label class="mini-field"><span>Colore 1</span><input type="color" value="${esc(g.c1)}" data-property="${esc(d.key)}" data-kind="gradient-c1"></label><label class="mini-field"><span>Stop 1 (%)</span><input type="range" min="0" max="100" value="${esc(g.s1)}" data-property="${esc(d.key)}" data-kind="gradient-s1"><output>${esc(g.s1)}%</output></label><label class="mini-field"><span>Colore 2</span><input type="color" value="${esc(g.c2)}" data-property="${esc(d.key)}" data-kind="gradient-c2"></label><label class="mini-field"><span>Stop 2 (%)</span><input type="range" min="0" max="100" value="${esc(g.s2)}" data-property="${esc(d.key)}" data-kind="gradient-s2"><output>${esc(g.s2)}%</output></label></div><div class="preset-row editor"><button type="button" data-action="gradient-visual-preset" data-property="${esc(d.key)}" data-value="sunset">Tramonto</button><button type="button" data-action="gradient-visual-preset" data-property="${esc(d.key)}" data-value="ocean">Oceano</button><button type="button" data-action="gradient-visual-preset" data-property="${esc(d.key)}" data-value="mono">Monocromatico</button><button type="button" data-action="gradient-visual-preset" data-property="${esc(d.key)}" data-value="reset">Reset</button></div><div class="visual-css-value"><code>${esc(g.css)}</code></div></div>`;}
  if(d.type==='background-visual'){const b=parseBackgroundVisual(base);return `<div class="editor visual-editor background-visual"><div class="visual-preview background-live" style="background:${esc(b.css)}"></div><div class="visual-grid"><label class="mini-field"><span>Colore</span><input type="color" value="${esc(b.color)}" data-property="${esc(d.key)}" data-kind="bgv-color"></label><label class="mini-field"><span>Tipo</span><select data-property="${esc(d.key)}" data-kind="bgv-type"><option value="solid" ${b.type==='solid'?'selected':''}>Colore pieno</option><option value="linear" ${b.type==='linear'?'selected':''}>Gradiente lineare</option><option value="radial" ${b.type==='radial'?'selected':''}>Gradiente radiale</option></select></label><label class="mini-field"><span>Angolo</span><input type="range" min="0" max="360" value="${esc(b.angle)}" data-property="${esc(d.key)}" data-kind="bgv-angle"><output>${esc(b.angle)}°</output></label><label class="mini-field"><span>Posizione X</span><select data-property="${esc(d.key)}" data-kind="bgv-posx"><option>left</option><option>center</option><option>right</option><option>25%</option><option>75%</option></select></label><label class="mini-field"><span>Posizione Y</span><select data-property="${esc(d.key)}" data-kind="bgv-posy"><option>top</option><option selected>center</option><option>bottom</option><option>25%</option><option>75%</option></select></label><label class="mini-field"><span>Dimensione</span><select data-property="${esc(d.key)}" data-kind="bgv-size"><option>auto</option><option>cover</option><option>contain</option><option>100% 100%</option></select></label><label class="mini-field"><span>Ripetizione</span><select data-property="${esc(d.key)}" data-kind="bgv-repeat"><option>repeat</option><option>no-repeat</option><option>repeat-x</option><option>repeat-y</option><option>space</option><option>round</option></select></label><label class="mini-field"><span>Blend</span><select data-property="${esc(d.key)}" data-kind="bgv-blend"><option>normal</option><option>multiply</option><option>screen</option><option>overlay</option><option>darken</option><option>lighten</option></select></label></div><div class="preset-row editor"><button type="button" data-action="background-visual-preset" data-property="${esc(d.key)}" data-value="solid">Pieno</button><button type="button" data-action="background-visual-preset" data-property="${esc(d.key)}" data-value="blue">Blu</button><button type="button" data-action="background-visual-preset" data-property="${esc(d.key)}" data-value="sunset">Tramonto</button><button type="button" data-action="background-visual-preset" data-property="${esc(d.key)}" data-value="reset">Reset</button></div><div class="visual-css-value"><code>${esc(b.css)}</code></div></div>`;}
  if(d.type==='border-visual'){const b=parseBorderVisual(base);return `<div class="editor visual-editor border-visual"><div class="border-demo"><div class="border-demo-box" style="border:${esc(b.css)}"></div></div><div class="visual-grid"><label class="mini-field"><span>Spessore</span><input type="range" min="0" max="30" value="${esc(b.width)}" data-property="${esc(d.key)}" data-kind="border-width-v"><output>${esc(b.width)}px</output></label><label class="mini-field"><span>Stile</span><select data-property="${esc(d.key)}" data-kind="border-style-v">${['none','solid','dashed','dotted','double','groove','ridge','inset','outset'].map(v=>`<option ${b.style===v?'selected':''}>${v}</option>`).join('')}</select></label><label class="mini-field"><span>Colore</span><input type="color" value="${esc(b.color)}" data-property="${esc(d.key)}" data-kind="border-color-v"></label></div><div class="preset-row editor"><button type="button" data-action="border-visual-preset" data-property="${esc(d.key)}" data-value="1px solid #cccccc">Sottile</button><button type="button" data-action="border-visual-preset" data-property="${esc(d.key)}" data-value="3px solid #6ea8ff">Evidente</button><button type="button" data-action="border-visual-preset" data-property="${esc(d.key)}" data-value="3px dashed #9c7cff">Tratteggiato</button><button type="button" data-action="border-visual-preset" data-property="${esc(d.key)}" data-value="none">Reset</button></div><div class="visual-css-value"><code>${esc(b.css)}</code></div></div>`;}
  if(d.type==='clip-visual'){const c=parseClipVisual(base);return `<div class="editor visual-editor clip-visual"><div class="clip-demo"><div class="clip-demo-shape" style="clip-path:${esc(c.css)}"></div></div><div class="visual-grid"><label class="mini-field"><span>Forma</span><select data-property="${esc(d.key)}" data-kind="clip-shape"><option value="none" ${c.shape==='none'?'selected':''}>Nessuna</option><option value="circle" ${c.shape==='circle'?'selected':''}>Cerchio</option><option value="ellipse" ${c.shape==='ellipse'?'selected':''}>Ellisse</option><option value="inset" ${c.shape==='inset'?'selected':''}>Riquadro</option><option value="triangle" ${c.shape==='triangle'?'selected':''}>Triangolo</option><option value="diamond" ${c.shape==='diamond'?'selected':''}>Diamante</option><option value="hex" ${c.shape==='hex'?'selected':''}>Esagono</option><option value="custom" ${c.shape==='custom'?'selected':''}>Personalizzato</option></select></label><label class="mini-field"><span>Dimensione</span><input type="range" min="10" max="100" value="${esc(c.size)}" data-property="${esc(d.key)}" data-kind="clip-size-v"><output>${esc(c.size)}%</output></label><label class="mini-field"><span>Centro X</span><input type="range" min="0" max="100" value="${esc(c.x)}" data-property="${esc(d.key)}" data-kind="clip-x-v"><output>${esc(c.x)}%</output></label><label class="mini-field"><span>Centro Y</span><input type="range" min="0" max="100" value="${esc(c.y)}" data-property="${esc(d.key)}" data-kind="clip-y-v"><output>${esc(c.y)}%</output></label></div><input class="value-input editor-wide" type="text" value="${esc(c.css)}" data-property="${esc(d.key)}" data-kind="clip-css-v" placeholder="clip-path: ..."><div class="preset-row editor"><button type="button" data-action="clip-visual-preset" data-property="${esc(d.key)}" data-value="circle">Cerchio</button><button type="button" data-action="clip-visual-preset" data-property="${esc(d.key)}" data-value="triangle">Triangolo</button><button type="button" data-action="clip-visual-preset" data-property="${esc(d.key)}" data-value="diamond">Diamante</button><button type="button" data-action="clip-visual-preset" data-property="${esc(d.key)}" data-value="reset">Reset</button></div><div class="visual-css-value"><code>${esc(c.css)}</code></div></div>`;}
  if(d.type==='motion-visual'){const m=parseMotionVisual(base);return `<div class="editor visual-editor motion-visual"><div class="motion-demo"><div class="motion-path-line ${esc(m.previewClass)}"></div><div class="motion-demo-dot" style="offset-path:${esc(m.path)};offset-distance:${esc(m.distance)}%;offset-rotate:${esc(m.rotate)}"></div></div><div class="visual-grid"><label class="mini-field"><span>Percorso</span><select data-property="${esc(d.key)}" data-kind="motion-path-v"><option value="none" ${m.preset==='none'?'selected':''}>Nessuno</option><option value="circle" ${m.preset==='circle'?'selected':''}>Cerchio</option><option value="wave" ${m.preset==='wave'?'selected':''}>Onda</option><option value="arc" ${m.preset==='arc'?'selected':''}>Arco</option><option value="zigzag" ${m.preset==='zigzag'?'selected':''}>Zig-zag</option><option value="line" ${m.preset==='line'?'selected':''}>Linea</option><option value="custom" ${m.preset==='custom'?'selected':''}>Personalizzato</option></select></label><label class="mini-field"><span>Distanza</span><input type="range" min="0" max="100" value="${esc(m.distance)}" data-property="${esc(d.key)}" data-kind="motion-distance-v"><output>${esc(m.distance)}%</output></label><label class="mini-field"><span>Rotazione</span><select data-property="${esc(d.key)}" data-kind="motion-rotate-v"><option value="auto" ${m.rotate==='auto'?'selected':''}>Segui percorso</option><option value="reverse" ${m.rotate==='reverse'?'selected':''}>Invertita</option><option value="0deg" ${m.rotate==='0deg'?'selected':''}>0°</option><option value="90deg" ${m.rotate==='90deg'?'selected':''}>90°</option></select></label><label class="mini-field"><span>Ancoraggio</span><select data-property="${esc(d.key)}" data-kind="motion-anchor-v"><option>auto</option><option>center</option><option>top left</option><option>bottom right</option></select></label></div><input class="value-input editor-wide" type="text" value="${esc(m.path)}" data-property="${esc(d.key)}" data-kind="motion-path-text-v" placeholder='path("M 0 50 ...")'><div class="visual-css-value"><code>${esc(m.path)} · ${esc(m.distance)}% · ${esc(m.rotate)}</code></div></div>`;}
  if(d.type==='gradient'){
    const g=base&&base!=='none'?base:'linear-gradient(90deg, #6ea8ff, #9c7cff)';
    return `<div class="editor gradient-editor"><div class="gradient-preview" style="background:${safeGradient(g)}"></div><div class="editor-grid grid-2"><label class="mini-field"><span>Preset</span><select data-property="${esc(d.key)}" data-kind="gradient-select"><option value="linear-gradient(90deg, #6ea8ff, #9c7cff)">Blu → viola</option><option value="linear-gradient(135deg, #ff9966, #ff5e62)">Arancio → rosso</option><option value="linear-gradient(135deg, #56ab2f, #a8e063)">Verde</option><option value="radial-gradient(circle, #ffffff, #6ea8ff)">Radiale</option><option value="none">Nessun gradiente</option></select></label><label class="mini-field"><span>Angolo</span><input type="number" min="0" max="360" step="1" value="${esc(parseGradientAngle(g))}" data-property="${esc(d.key)}" data-kind="gradient-angle"></label><label class="mini-field"><span>Colore 1</span><input type="color" value="${esc(parseGradientColor(g,0))}" data-property="${esc(d.key)}" data-kind="gradient-color1"></label><label class="mini-field"><span>Colore 2</span><input type="color" value="${esc(parseGradientColor(g,1))}" data-property="${esc(d.key)}" data-kind="gradient-color2"></label></div><input class="value-input editor-wide" type="text" value="${esc(cur)}" placeholder="linear-gradient(90deg,#6ea8ff,#9c7cff)" data-property="${esc(d.key)}" data-kind="gradient-text"></div>`;
  }
  if(d.type==='background-editor')return `<div class="editor background-editor"><div class="swatch-row"><span>Colore</span><input type="color" value="${esc(parseBackgroundColor(base,'#ffffff'))}" data-property="${esc(d.key)}" data-kind="background-color"></div><div class="editor-grid grid-2"><label class="mini-field"><span>Tipo</span><select data-property="${esc(d.key)}" data-kind="background-type"><option value="solid">Colore</option><option value="linear">Gradiente lineare</option><option value="radial">Gradiente radiale</option></select></label><label class="mini-field"><span>Angolo</span><input type="number" min="0" max="360" step="1" value="${esc(parseGradientAngle(base)||90)}" data-property="${esc(d.key)}" data-kind="background-angle"></label><label class="mini-field"><span>Posizione</span><select data-property="${esc(d.key)}" data-kind="background-position"><option value="center">Centro</option><option value="top">Alto</option><option value="bottom">Basso</option><option value="left">Sinistra</option><option value="right">Destra</option></select></label><label class="mini-field"><span>Dimensione</span><select data-property="${esc(d.key)}" data-kind="background-size"><option>auto</option><option>cover</option><option>contain</option><option>100% 100%</option></select></label></div><div class="preset-row editor"><button type="button" data-action="background-preset" data-property="${esc(d.key)}" data-value="#ffffff">Bianco</button><button type="button" data-action="background-preset" data-property="${esc(d.key)}" data-value="linear-gradient(90deg,#6ea8ff,#9c7cff)">Blu → viola</button><button type="button" data-action="background-preset" data-property="${esc(d.key)}" data-value="linear-gradient(135deg,#ff9966,#ff5e62)">Arancio → rosso</button></div><input class="value-input editor-wide" type="text" value="${esc(cur)}" placeholder="#ffffff o linear-gradient(...)" data-property="${esc(d.key)}" data-kind="background-text"></div>`;
  if(d.type==='border-editor')return `<div class="editor border-editor"><div class="editor-grid grid-3"><label class="mini-field"><span>Spessore</span><input type="number" min="0" max="50" step="1" value="${esc(parseBorder(base).width)}" data-property="${esc(d.key)}" data-kind="border-width"></label><label class="mini-field"><span>Stile</span><select data-property="${esc(d.key)}" data-kind="border-style">${['none','solid','dashed','dotted','double','groove','ridge','inset','outset'].map(v=>`<option ${parseBorder(base).style===v?'selected':''}>${v}</option>`).join('')}</select></label><label class="mini-field"><span>Colore</span><input type="color" value="${esc(parseBorderColor(base,'#000000'))}" data-property="${esc(d.key)}" data-kind="border-color"></label></div><div class="preset-row editor"><button type="button" data-action="border-preset" data-property="${esc(d.key)}" data-value="1px solid #cccccc">Sottile</button><button type="button" data-action="border-preset" data-property="${esc(d.key)}" data-value="2px solid #6ea8ff">Blu</button><button type="button" data-action="border-preset" data-property="${esc(d.key)}" data-value="3px dashed #9c7cff">Tratteggiato</button><span class="hint">Il raggio si regola con <code>border-radius</code>.</span></div></div>`;
  if(d.type==='clip-path')return `<div class="editor clip-editor"><div class="editor-grid grid-2"><label class="mini-field"><span>Forma</span><select data-property="${esc(d.key)}" data-kind="clip-preset"><option value="none">Nessuna</option><option value="circle(50% at 50% 50%)">Cerchio</option><option value="ellipse(50% 40% at 50% 50%)">Ellisse</option><option value="inset(10% round 12px)">Riquadro arrotondato</option><option value="polygon(50% 0%,100% 100%,0% 100%)">Triangolo</option><option value="polygon(50% 0%,100% 50%,50% 100%,0% 50%)">Diamante</option></select></label><label class="mini-field"><span>CSS personalizzato</span><input type="text" value="${esc(cur)}" data-property="${esc(d.key)}" data-kind="clip-text"></label></div></div>`;
  if(d.type==='grid-template'){
    const isRows=d.key==='grid-template-rows';
    const parsed=parseGridTemplate(base,isRows);
    return `<div class="editor-grid grid-2 editor"><label class="mini-field"><span>${isRows?'Righe':'Colonne'}</span><select data-property="${esc(d.key)}" data-kind="grid-template-preset"><option value="auto" ${base==='auto'?'selected':''}>Auto</option><option value="repeat(2, 1fr)" ${base==='repeat(2, 1fr)'?'selected':''}>2 ${isRows?'righe':'colonne'}</option><option value="repeat(3, 1fr)" ${base==='repeat(3, 1fr)'?'selected':''}>3 ${isRows?'righe':'colonne'}</option><option value="repeat(4, 1fr)" ${base==='repeat(4, 1fr)'?'selected':''}>4 ${isRows?'righe':'colonne'}</option><option value="repeat(auto-fit, minmax(180px, 1fr))" ${base==='repeat(auto-fit, minmax(180px, 1fr))'?'selected':''}>Responsive</option></select></label><label class="mini-field"><span>Numero elementi</span><input type="number" min="1" max="12" value="${esc(parsed.count)}" data-property="${esc(d.key)}" data-kind="grid-template-count"></label></div><div class="preset-row editor"><button type="button" data-action="grid-template-preset" data-property="${esc(d.key)}" data-value="repeat(2, 1fr)">2</button><button type="button" data-action="grid-template-preset" data-property="${esc(d.key)}" data-value="repeat(3, 1fr)">3</button><button type="button" data-action="grid-template-preset" data-property="${esc(d.key)}" data-value="repeat(4, 1fr)">4</button><button type="button" data-action="grid-template-preset" data-property="${esc(d.key)}" data-value="repeat(auto-fit, minmax(180px, 1fr))">Responsive</button></div>`;
  }
  if(d.type==='position-2d')return `<div class="editor-grid grid-2 editor"><label class="mini-field"><span>X</span><select data-property="${esc(d.key)}" data-kind="position-x"><option>left</option><option>center</option><option>right</option><option>25%</option><option>75%</option></select></label><label class="mini-field"><span>Y</span><select data-property="${esc(d.key)}" data-kind="position-y"><option>top</option><option>center</option><option>bottom</option><option>25%</option><option>75%</option></select></label></div>`;
  if(d.type==='transition')return `<div class="editor-grid grid-2 editor"><label class="mini-field"><span>Proprietà</span><select data-property="${esc(d.key)}" data-kind="transition-property"><option>all</option><option>opacity</option><option>transform</option><option>background-color</option><option>color</option><option>box-shadow</option></select></label><label class="mini-field"><span>Timing</span><select data-property="${esc(d.key)}" data-kind="transition-timing"><option>ease</option><option>linear</option><option>ease-in</option><option>ease-out</option><option>ease-in-out</option></select></label><label class="mini-field"><span>Durata (ms)</span><input type="number" step="50" min="0" value="${esc(parseTransition(base).duration)}" data-property="${esc(d.key)}" data-kind="transition-duration"></label><label class="mini-field"><span>Ritardo (ms)</span><input type="number" step="50" min="0" value="${esc(parseTransition(base).delay)}" data-property="${esc(d.key)}" data-kind="transition-delay"></label></div>`;
  if(d.type==='animation'){const a=parseAnimation(base);return `<div class="editor-grid grid-2 editor"><label class="mini-field"><span>Nome</span><input type="text" value="${esc(a.name)}" placeholder="entrata" data-property="${esc(d.key)}" data-kind="animation-name"></label><label class="mini-field"><span>Durata (s)</span><input type="number" min="0" step="0.1" value="${esc(a.duration)}" data-property="${esc(d.key)}" data-kind="animation-duration"></label><label class="mini-field"><span>Timing</span><select data-property="${esc(d.key)}" data-kind="animation-timing"><option ${a.timing==='ease'?'selected':''}>ease</option><option ${a.timing==='linear'?'selected':''}>linear</option><option ${a.timing==='ease-in'?'selected':''}>ease-in</option><option ${a.timing==='ease-out'?'selected':''}>ease-out</option><option ${a.timing==='ease-in-out'?'selected':''}>ease-in-out</option></select></label><label class="mini-field"><span>Ripetizioni</span><select data-property="${esc(d.key)}" data-kind="animation-iteration"><option value="1" ${a.iteration==='1'?'selected':''}>1</option><option value="2" ${a.iteration==='2'?'selected':''}>2</option><option value="3" ${a.iteration==='3'?'selected':''}>3</option><option value="infinite" ${a.iteration==='infinite'?'selected':''}>Infinite</option></select></label><label class="mini-field"><span>Direzione</span><select data-property="${esc(d.key)}" data-kind="animation-direction"><option ${a.direction==='normal'?'selected':''}>normal</option><option ${a.direction==='reverse'?'selected':''}>reverse</option><option ${a.direction==='alternate'?'selected':''}>alternate</option><option ${a.direction==='alternate-reverse'?'selected':''}>alternate-reverse</option></select></label><label class="mini-field"><span>Fill mode</span><select data-property="${esc(d.key)}" data-kind="animation-fill"><option ${a.fill==='none'?'selected':''}>none</option><option ${a.fill==='forwards'?'selected':''}>forwards</option><option ${a.fill==='backwards'?'selected':''}>backwards</option><option ${a.fill==='both'?'selected':''}>both</option></select></label></div>${renderKeyframeTimeline(selector,d,base)}`;}
  if(d.type==='text')return `<div class="editor control-row"><input type="text" value="${esc(cur)}" placeholder="${esc(d.defaultValue||'')}" data-property="${esc(d.key)}" data-kind="text" style="max-width:none"></div>`;
  return `<div class="editor control-row"><select data-property="${esc(d.key)}" data-kind="select">${(d.values||[]).map(v=>`<option value="${esc(v)}" ${v===cur||(!cur&&v===d.defaultValue)?'selected':''}>${esc(v)}</option>`).join('')}</select></div>`;
}
function hex3(v){const s=String(v||'').trim();if(/^#[0-9a-f]{6}$/i.test(s))return s;if(/^#[0-9a-f]{3}$/i.test(s))return '#'+[s[1],s[1],s[2],s[2],s[3],s[3]].join('');return '#6ea8ff';}
function parseGradientVisual(v){const s=String(v||'');const type=s.includes('radial-gradient')?'radial':s.includes('conic-gradient')?'conic':'linear';const angle=(s.match(/(?:linear|conic)-gradient\(\s*(-?[\d.]+)deg/i)||[])[1]||90;const cols=s.match(/#[0-9a-f]{3,6}/ig)||[];const c1=hex3(cols[0]||'#6ea8ff'),c2=hex3(cols[1]||'#9c7cff');const stops=[...s.matchAll(/#[0-9a-f]{3,6}(?:\s+([\d.]+)%){0,1}/ig)].map(m=>Number(m[1])).filter(Number.isFinite);return{type,angle:Number(angle),c1,c2,s1:stops[0]??0,s2:stops[1]??100,css:s||`linear-gradient(90deg, ${c1} 0%, ${c2} 100%)`};}
function gradientVisualFromInputs(k='background-image'){const type=els.controls.querySelector(`[data-kind="gradient-type"][data-property="${CSS.escape(k)}"]`)?.value||'linear';const angle=Number(els.controls.querySelector(`[data-kind="gradient-angle-v"][data-property="${CSS.escape(k)}"]`)?.value||90);const c1=els.controls.querySelector(`[data-kind="gradient-c1"][data-property="${CSS.escape(k)}"]`)?.value||'#6ea8ff';const c2=els.controls.querySelector(`[data-kind="gradient-c2"][data-property="${CSS.escape(k)}"]`)?.value||'#9c7cff';const s1=Number(els.controls.querySelector(`[data-kind="gradient-s1"][data-property="${CSS.escape(k)}"]`)?.value||0),s2=Number(els.controls.querySelector(`[data-kind="gradient-s2"][data-property="${CSS.escape(k)}"]`)?.value||100);if(type==='radial')return `radial-gradient(circle, ${c1} ${s1}%, ${c2} ${s2}%)`;if(type==='conic')return `conic-gradient(from ${angle}deg, ${c1} ${s1}%, ${c2} ${s2}%)`;return `linear-gradient(${angle}deg, ${c1} ${s1}%, ${c2} ${s2}%)`;}
function parseBackgroundVisual(v){const s=String(v||'');const color=hex3((s.match(/#[0-9a-f]{6}/i)||[])[0]||'#ffffff');const type=s.includes('radial-gradient')?'radial':s.includes('linear-gradient')?'linear':'solid';const angle=Number((s.match(/linear-gradient\(\s*([\d.]+)deg/i)||[])[1]||90);return{type,angle,color,css:s||color};}
function backgroundVisualFromInputs(k='background'){const type=els.controls.querySelector(`[data-kind="bgv-type"][data-property="${CSS.escape(k)}"]`)?.value||'solid';const angle=Number(els.controls.querySelector(`[data-kind="bgv-angle"][data-property="${CSS.escape(k)}"]`)?.value||90);const color=els.controls.querySelector(`[data-kind="bgv-color"][data-property="${CSS.escape(k)}"]`)?.value||'#ffffff';if(type==='radial')return `radial-gradient(circle, ${color}, #ffffff) center / cover no-repeat`;if(type==='linear')return `linear-gradient(${angle}deg, ${color}, #ffffff) center / cover no-repeat`;return color;}
function parseBorderVisual(v){const b=parseBorder(v);return{width:Number(b.width)||0,style:b.style||'none',color:hex3(b.color||'#cccccc'),css:v||'0px none #cccccc'};}
function borderVisualFromInputs(k='border'){const w=Number(els.controls.querySelector(`[data-kind="border-width-v"][data-property="${CSS.escape(k)}"]`)?.value||0);const st=els.controls.querySelector(`[data-kind="border-style-v"][data-property="${CSS.escape(k)}"]`)?.value||'none';const c=els.controls.querySelector(`[data-kind="border-color-v"][data-property="${CSS.escape(k)}"]`)?.value||'#cccccc';return `${w}px ${st} ${c}`;}
function parseClipVisual(v){const s=String(v||'');let shape='custom',size=50,x=50,y=50;if(s==='none'||!s){shape='none';}else if(/circle\(/.test(s)){shape='circle';size=Number((s.match(/circle\(([-\d.]+)%?/)||[])[1]||50);const m=s.match(/at\s+([\d.]+)%\s+([\d.]+)%/);x=Number(m?.[1]??50);y=Number(m?.[2]??50);}else if(/ellipse\(/.test(s)){shape='ellipse';size=Number((s.match(/ellipse\(([-\d.]+)%/)||[])[1]||50);const m=s.match(/at\s+([\d.]+)%\s+([\d.]+)%/);x=Number(m?.[1]??50);y=Number(m?.[2]??50);}else if(/polygon\(/.test(s)){if(/50%\s+0%.*100%\s+50%.*50%\s+100%.*0%\s+50%/.test(s))shape='diamond';else if(/50%\s+0%.*100%\s+100%.*0%\s+100%/.test(s))shape='triangle';else if(/25%\s+0%.*75%\s+0%.*100%\s+50%/.test(s))shape='hex';}else if(/inset\(/.test(s))shape='inset';return{shape,size,x,y,css:s||'none'};}
function clipVisualFromInputs(k='clip-path'){const shape=els.controls.querySelector(`[data-kind="clip-shape"][data-property="${CSS.escape(k)}"]`)?.value||'none';const size=Number(els.controls.querySelector(`[data-kind="clip-size-v"][data-property="${CSS.escape(k)}"]`)?.value||50),x=Number(els.controls.querySelector(`[data-kind="clip-x-v"][data-property="${CSS.escape(k)}"]`)?.value||50),y=Number(els.controls.querySelector(`[data-kind="clip-y-v"][data-property="${CSS.escape(k)}"]`)?.value||50);if(shape==='circle')return `circle(${size}% at ${x}% ${y}%)`;if(shape==='ellipse')return `ellipse(${size}% ${Math.max(10,size*.75).toFixed(0)}% at ${x}% ${y}%)`;if(shape==='inset')return `inset(${Math.max(0,100-size)}% round 12px)`;if(shape==='triangle')return 'polygon(50% 0%, 100% 100%, 0% 100%)';if(shape==='diamond')return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';if(shape==='hex')return 'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)';return 'none';}
const MOTION_PATHS={circle:'path("M 50 10 C 105 10 105 90 50 90 C -5 90 -5 10 50 10 Z")',wave:'path("M 5 50 C 25 5 45 95 65 50 C 85 5 105 95 125 50")',arc:'path("M 5 80 C 35 10 95 10 125 80")',zigzag:'path("M 5 80 L 35 20 L 65 80 L 95 20 L 125 80")',line:'path("M 5 50 L 125 50")'};
function parseMotionVisual(v){const s=String(v||'');const preset=Object.entries(MOTION_PATHS).find(([,p])=>p===s)?.[0]||'custom';const distance=Number((s.match(/offset-distance:\s*([\d.]+)%/)||[])[1]||0);return{preset,path:s||'none',distance,rotate:'auto',previewClass:preset};}
function motionPathFromPreset(v){return v==='none'?'none':MOTION_PATHS[v]||'path("M 5 50 L 125 50")';}
function parseRadius(v,corner){const raw=String(v).replaceAll('px','').trim().split(/\s+/).map(x=>parseFloat(x)||0);if(!raw.length)return 0;if(raw.length===1)return raw[0];if(raw.length===2)return corner==='tl'||corner==='br'?raw[0]:raw[1];if(raw.length===3)return corner==='tl'?raw[0]:corner==='br'?raw[1]:raw[2];return corner==='tl'?raw[0]:corner==='tr'?raw[1]:corner==='br'?raw[2]:raw[3];}
function radiusFromInputs(){const q=k=>els.controls.querySelector(`[data-property="${CSS.escape('border-radius')}"][data-kind="radius-side"][data-corner="${k}"]`)?.value;return `${q('tl')||0}px ${q('tr')||0}px ${q('br')||0}px ${q('bl')||0}px`;}
function parseTextShadow(v){const m=String(v).match(/^(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s*(.*)$/);if(!m)return{x:0,y:2,blur:4,color:'rgba(0,0,0,.25)'};return{x:m[1],y:m[2],blur:m[3],color:m[4]||'rgba(0,0,0,.25)'};}
function textShadowFromInputs(){const q=k=>els.controls.querySelector(`[data-kind="text-shadow-${k}"]`)?.value;return `${q('x')||0}px ${q('y')||2}px ${q('blur')||4}px ${q('color')||'rgba(0,0,0,.25)'}`;}
function normalizeColorHex(v,fallback){const m=String(v||'').match(/^#([0-9a-f]{6})$/i);return m?'#'+m[1]:fallback;}
function parseGradientAngle(v){const m=String(v).match(/(?:linear-gradient\()\s*([\d.]+)deg/i);return m?Number(m[1]):90;}
function parseGradientColor(v,i){const m=String(v).match(/#([0-9a-f]{6}|[0-9a-f]{3})/ig)||[];const c=m[i]||['#6ea8ff','#9c7cff'][i]||'#000000';return c.length===4?'#'+[c[1],c[1],c[2],c[2],c[3],c[3]].join(''):c;}
function gradientFromInputs(){const angle=Number(els.controls.querySelector('[data-kind="gradient-angle"]')?.value||90);const c1=els.controls.querySelector('[data-kind="gradient-color1"]')?.value||'#6ea8ff';const c2=els.controls.querySelector('[data-kind="gradient-color2"]')?.value||'#9c7cff';return `linear-gradient(${angle}deg, ${c1}, ${c2})`;}
function parseBackgroundColor(v,fallback){return normalizeColorHex(String(v).match(/#[0-9a-f]{6}/i)?.[0]||'',fallback);}
function backgroundFromInputs(){const type=els.controls.querySelector('[data-kind="background-type"]')?.value||'solid';const angle=Number(els.controls.querySelector('[data-kind="background-angle"]')?.value||90);const pos=els.controls.querySelector('[data-kind="background-position"]')?.value||'center';const size=els.controls.querySelector('[data-kind="background-size"]')?.value||'auto';const color=els.controls.querySelector('[data-kind="background-color"]')?.value||'#ffffff';let bg=type==='solid'?color:(type==='radial'?`radial-gradient(circle, ${color}, #ffffff)`:`linear-gradient(${angle}deg, ${color}, #ffffff)`);return `${bg} ${pos} / ${size}`;}
function parseBorder(v){const m=String(v).match(/^(\d+(?:\.\d+)?)px\s+(none|solid|dashed|dotted|double|groove|ridge|inset|outset)\s+(.+)$/);return m?{width:m[1],style:m[2],color:m[3]}:{width:1,style:'solid',color:'#cccccc'};}
function parseBorderColor(v,fallback){const p=parseBorder(v).color||'';return normalizeColorHex(p,fallback);}
function parseBorderRadiusFromShorthand(v){const m=String(v).match(/(-?[\d.]+)px/);return m?Math.max(0,Number(m[1])):0;}
function borderFromInputs(){const w=Number(els.controls.querySelector('[data-kind="border-width"]')?.value||1);const st=els.controls.querySelector('[data-kind="border-style"]')?.value||'solid';const c=els.controls.querySelector('[data-kind="border-color"]')?.value||'#cccccc';return `${w}px ${st} ${c}`;}
function parseGridTemplate(v,isRows){const m=String(v).match(/repeat\((\d+)\s*,/);return{count:m?Number(m[1]):(v==='auto'?1:3)};}
function parseTransition(v){const m=String(v).match(/^\s*(\S+)\s+([\d.]+)(ms|s)\s+(\S+)(?:\s+([\d.]+)(ms|s))?/);if(!m)return{property:'all',duration:250,timing:'ease',delay:0};const toMs=(n,u)=>Math.round(Number(n)*(u==='s'?1000:1));return{property:m[1],duration:toMs(m[2],m[3]),timing:m[4],delay:m[5]?toMs(m[5],m[6]):0};}
function transitionFromInputs(){const p=els.controls.querySelector('[data-kind="transition-property"]')?.value||'all';const t=els.controls.querySelector('[data-kind="transition-timing"]')?.value||'ease';const d=Math.max(0,Number(els.controls.querySelector('[data-kind="transition-duration"]')?.value||250));const delay=Math.max(0,Number(els.controls.querySelector('[data-kind="transition-delay"]')?.value||0));return `${p} ${d}ms ${t} ${delay}ms`;}
function parseAnimation(v){const p=String(v).trim().split(/\s+/);return{name:p[0]||'none',duration:parseFloat(p[1])||0.8,timing:p[2]||'ease',iteration:p[3]||'1',direction:p[4]||'normal',fill:p[5]||'none'};}
function animationFromInputs(){const name=els.controls.querySelector('[data-kind="animation-name"]')?.value.trim()||'none';const dur=Math.max(0,Number(els.controls.querySelector('[data-kind="animation-duration"]')?.value||0.8));const timing=els.controls.querySelector('[data-kind="animation-timing"]')?.value||'ease';const it=els.controls.querySelector('[data-kind="animation-iteration"]')?.value||'1';const dir=els.controls.querySelector('[data-kind="animation-direction"]')?.value||'normal';const fill=els.controls.querySelector('[data-kind="animation-fill"]')?.value||'none';return `${name} ${dur}s ${timing} ${it} ${dir} ${fill}`;}
function parseBoxSide(v,side){const p=String(v).replaceAll('px','').trim().split(/\s+/).filter(Boolean);const n=p.map(x=>parseFloat(x)||0);if(!n.length)return 0;if(n.length===1)return n[0];if(n.length===2)return side==='top'||side==='bottom'?n[0]:n[1];if(n.length===3)return side==='top'?n[0]:side==='bottom'?n[1]:n[1];return side==='top'?n[0]:side==='right'?n[1]:side==='bottom'?n[2]:n[3];}
function boxFromInputs(d){const q=[...els.controls.querySelectorAll(`[data-property="${CSS.escape(d.key)}"][data-kind="box-side"]`)];const vals={top:'0',right:'0',bottom:'0',left:'0'};q.forEach(x=>vals[x.dataset.side]=`${x.value}${x.dataset.unit}`);return `${vals.top} ${vals.right} ${vals.bottom} ${vals.left}`;}
function parseShadow(v){const m=String(v).match(/^(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?\s*(.*)$/);if(!m)return{x:0,y:4,blur:12,spread:0,color:'rgba(0,0,0,.15)'};return{x:m[1],y:m[2],blur:m[3],spread:m[4]||0,color:m[5]||'rgba(0,0,0,.15)'};}
function shadowFromInputs(){const g=k=>els.controls.querySelector(`[data-kind="shadow-${k}"]`)?.value;return `${g('x')||0}px ${g('y')||4}px ${g('blur')||12}px ${g('spread')||0}px ${g('color')||'rgba(0,0,0,.15)'}`;}
function numField(kind,fallback=0,propertyKey=null){const sel=propertyKey?`[data-property="${CSS.escape(propertyKey)}"][data-kind="${kind}"]`:`[data-kind="${kind}"]`;const v=els.controls.querySelector(sel)?.value;const n=Number(v);return Number.isFinite(n)?n:fallback;}
function parseTransform(v){const s=String(v);const t3=s.match(/translate3d\((-?[\d.]+)px\s*,\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px\)/);const sxsy=s.match(/scale\((-?[\d.]+)\s*,\s*(-?[\d.]+)\)/);return{tx:t3?t3[1]:(s.match(/translateX\((-?[\d.]+)px\)/)||[])[1]||0,ty:t3?t3[2]:(s.match(/translateY\((-?[\d.]+)px\)/)||[])[1]||0,tz:t3?t3[3]:(s.match(/translateZ\((-?[\d.]+)px\)/)||[])[1]||0,sx:sxsy?sxsy[1]:(s.match(/scaleX\(([\d.]+)\)/)||[])[1]||1,sy:sxsy?sxsy[2]:(s.match(/scaleY\(([\d.]+)\)/)||[])[1]||1,rx:(s.match(/rotateX\((-?[\d.]+)deg\)/)||[])[1]||0,ry:(s.match(/rotateY\((-?[\d.]+)deg\)/)||[])[1]||0,rz:(s.match(/rotateZ\((-?[\d.]+)deg\)/)||[])[1]||0,skx:(s.match(/skewX\((-?[\d.]+)deg\)/)||[])[1]||0,sky:(s.match(/skewY\((-?[\d.]+)deg\)/)||[])[1]||0};}
function transformFromInputs(propertyKey='transform'){const v={tx:numField('transform-tx',0,propertyKey),ty:numField('transform-ty',0,propertyKey),tz:numField('transform-tz',0,propertyKey),sx:numField('transform-sx',1,propertyKey),sy:numField('transform-sy',1,propertyKey),rx:numField('transform-rx',0,propertyKey),ry:numField('transform-ry',0,propertyKey),rz:numField('transform-rz',0,propertyKey),skx:numField('transform-skx',0,propertyKey),sky:numField('transform-sky',0,propertyKey)};return `translate3d(${v.tx}px, ${v.ty}px, ${v.tz}px) scale(${v.sx}, ${v.sy}) rotateX(${v.rx}deg) rotateY(${v.ry}deg) rotateZ(${v.rz}deg) skewX(${v.skx}deg) skewY(${v.sky}deg)`;}
function parseFilter(v){const s=String(v||'');const get=(re,def)=>{const m=s.match(re);return m?m[1]:def};return{blur:get(/blur\((-?[\d.]+)px\)/,0),brightness:get(/brightness\((-?[\d.]+)\)/,1),contrast:get(/contrast\((-?[\d.]+)\)/,1),grayscale:get(/grayscale\((-?[\d.]+)\)/,0),sepia:get(/sepia\((-?[\d.]+)\)/,0),saturate:get(/saturate\((-?[\d.]+)\)/,1),hue:get(/hue-rotate\((-?[\d.]+)deg\)/,0),invert:get(/invert\((-?[\d.]+)\)/,0),opacity:get(/opacity\((-?[\d.]+)\)/,1),dropShadow:get(/drop-shadow\((.+)\)/,'')};}
function filterFromInputs(propertyKey='filter'){const blur=numField('filter-blur',0,propertyKey),brightness=numField('filter-brightness',100,propertyKey)/100,contrast=numField('filter-contrast',100,propertyKey)/100,gray=numField('filter-grayscale',0,propertyKey)/100,sepia=numField('filter-sepia',0,propertyKey)/100,saturate=numField('filter-saturate',100,propertyKey)/100,hue=numField('filter-hue',0,propertyKey),invert=numField('filter-invert',0,propertyKey)/100,opacity=numField('filter-opacity',100,propertyKey)/100;const parts=[];if(blur)parts.push(`blur(${blur}px)`);if(brightness!==1)parts.push(`brightness(${brightness})`);if(contrast!==1)parts.push(`contrast(${contrast})`);if(gray)parts.push(`grayscale(${gray})`);if(sepia)parts.push(`sepia(${sepia})`);if(saturate!==1)parts.push(`saturate(${saturate})`);if(hue)parts.push(`hue-rotate(${hue}deg)`);if(invert)parts.push(`invert(${invert})`);if(opacity!==1)parts.push(`opacity(${opacity})`);const ds=els.controls.querySelector(`[data-property="${CSS.escape(propertyKey)}"][data-kind="filter-drop-shadow"]`)?.value.trim();if(ds)parts.push(`drop-shadow(${ds})`);return parts.length?parts.join(' '):'none';}
function safeGradient(g){return /^((linear|radial|conic)-gradient)\(/.test(g)?esc(g):'linear-gradient(90deg,#6ea8ff,#9c7cff)';}
function controlHtml(d,s){const selector=activeSelector();const enabled=isEnabled(selector,d);return `<div class="control ${enabled?'':'is-off'}" data-control="${esc(d.key)}"><div class="control-top"><div class="toggle"><label class="switch"><input type="checkbox" data-action="toggle" data-property="${esc(d.key)}" ${enabled?'checked':''}><span class="switch-ui"></span></label><label>${esc(d.label)}</label><span class="property">${esc(d.key)}</span></div><span class="off-note">${enabled?'ON':'OFF'}</span></div>${editorInput(d,s)}</div>`;}
function renderControls(){const selector=activeSelector();els.selectedSelector.textContent=state.selected||'Nessuno';els.controlSelector.textContent=selector||'—';els.selectedLabel.textContent=selector?`${selector} · ${pseudoLabel()}`:'Nessun elemento';if(!selector){els.controls.innerHTML='<p class="hint">Seleziona un elemento dalla struttura DOM, dai TAG oppure cliccane uno nella preview.</p>';return;}const q=els.propertySearch.value.trim().toLowerCase();const s=propertyValues(selector);const defs=propertyDefinitions.filter(d=>(!q||`${d.key} ${d.label} ${d.category}`.toLowerCase().includes(q))&&(!d.onlyWhen||d.onlyWhen(s)));const cats=[...new Set(defs.map(d=>d.category))];els.controls.innerHTML=cats.map(cat=>`<div class="property-category"><div class="category-title">${esc(cat)}</div>${defs.filter(d=>d.category===cat).map(d=>controlHtml(d,s)).join('')}</div>`).join('');}
function commonLayoutParent(){const chosen=state.nodes.filter(n=>state.layoutSelection.has(n.selector));if(chosen.length<2)return null;const parents=chosen.map(n=>n.parentSelector);return parents.every(x=>x===parents[0])?parents[0]:null;}
function applyLayout(kind){const parent=commonLayoutParent();if(!parent){els.layoutActions?.setAttribute('data-msg','Seleziona almeno 2 elementi con lo stesso contenitore.');setTimeout(()=>els.layoutActions?.removeAttribute('data-msg'),1600);return;}const gap=`${Math.max(0,Number(els.layoutGap?.value||20))}px`;const display=kind==='grid'?'grid':'flex';setProperty(parent,'display',display,true,false);setProperty(parent,'gap',gap,true,false);if(kind==='row'){setProperty(parent,'flex-direction','row',true,false);}if(kind==='column'){setProperty(parent,'flex-direction','column',true,false);}if(kind==='center'){setProperty(parent,'justify-content','center',true,false);setProperty(parent,'align-items','center',true,false);}if(kind==='space'){setProperty(parent,'justify-content','space-between',true,false);setProperty(parent,'align-items','center',true,false);}if(kind==='grid'){setProperty(parent,'grid-template-columns',`repeat(${state.layoutSelection.size}, minmax(0,1fr))`,true,false);}els.selectedSelector.textContent=parent;els.controlSelector.textContent=parent;els.selectedLabel.textContent=`Layout → ${parent}`;updateCssAndPreview();renderControls();}
function buildCss(){
  const blocks=[];
  for(const [sel,map] of state.styles){
    const entries=Object.entries(map).filter(([,e])=>e&&e.enabled&&e.value!=='');
    if(!entries.length)continue;
    blocks.push(`${sel} {\n${entries.map(([p,e])=>`  ${p}: ${e.value};`).join('\n')}\n}`);
    const anim=map.animation;
    if(anim?.enabled&&anim.value){
      const parsed=parseAnimation(anim.value), frames=keyframesFor(sel), validName=String(parsed.name||'').trim();
      if(validName&&validName!=='none'){
        const kf=Object.entries(frames).filter(([,f])=>f&&Object.values(f).some(v=>String(v||'').trim()!==''));
        if(kf.length){
          const body=kf.map(([pc,f])=>{const lines=[];if(f.transform)lines.push(`  transform: ${f.transform};`);if(f.opacity!=='')lines.push(`  opacity: ${f.opacity};`);if(f.color)lines.push(`  color: ${f.color};`);if(f.backgroundColor)lines.push(`  background-color: ${f.backgroundColor};`);return `${pc}% {\n${lines.join('\n')}\n}`;}).join('\n');
          blocks.push(`@keyframes ${validName} {\n${body}\n}`);
        }
      }
    }
  }
  return blocks.join('\n\n');
}
function previewDoc(){
  const css=buildCss();
  const dragMode=state.dragMode?'true':'false';
  const snap=Math.max(0,Number(state.dragSnap)||0);
  return `<!doctype html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>
*{box-sizing:border-box}html,body{margin:0}body{font-family:Arial,sans-serif;padding:24px;color:#222;min-height:100%}a{color:inherit}
#__cvb_selected{outline:3px solid #6ea8ff;outline-offset:2px}
.__cvb_dragging{outline:3px dashed #9c7cff !important;outline-offset:4px;cursor:grabbing !important}
.__cvb_drag_candidate{outline:2px dashed rgba(110,168,255,.55) !important;outline-offset:2px}
body.__cvb_drag_mode *{cursor:grab}body.__cvb_drag_mode{user-select:none;touch-action:none}. __cvb_dragging{touch-action:none}
.__cvb_guide{position:fixed;z-index:2147483647;pointer-events:none;background:#6ea8ff;box-shadow:0 0 0 1px rgba(255,255,255,.25)}
.__cvb_guide.v{width:1px;top:0;bottom:0}.__cvb_guide.h{height:1px;left:0;right:0}
.__cvb_drag_label{position:fixed;z-index:2147483647;pointer-events:none;right:10px;top:10px;padding:6px 8px;border-radius:7px;background:rgba(17,22,32,.92);color:#eef3fb;font:12px/1.2 Arial,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25)}
.__cvb_drag_label strong{color:#b9d1ff}
${css}</style></head><body class="${state.dragMode?'__cvb_drag_mode':''}">${state.html}
<script>
const DRAG_MODE=${dragMode};const SNAP=${snap};
function makeSelector(el){
  if(el.id&&el.id!=='__cvb_selected')return '#'+CSS.escape(el.id);
  const parts=[];let cur=el;
  while(cur&&cur.tagName&&cur.tagName.toLowerCase()!=='body'){
    let p=cur.tagName.toLowerCase();
    if(cur.classList.length)p+='.'+[...cur.classList].filter(c=>c!=='__cvb_dragging'&&c!=='__cvb_drag_candidate').map(CSS.escape).join('.');
    const siblings=cur.parentElement?[...cur.parentElement.children].filter(x=>x.tagName===cur.tagName):[];
    if(siblings.length>1)p+=':nth-of-type('+(siblings.indexOf(cur)+1)+')';
    parts.unshift(p);cur=cur.parentElement;
  }
  return parts.join(' > ');
}
const dragState={el:null,startX:0,startY:0,baseLeft:0,baseTop:0,pointerId:null,moved:false,guideV:null,guideH:null,label:null,originRect:null};
function num(v){const n=parseFloat(v);return Number.isFinite(n)?n:0}
function snapVal(v){return SNAP>0?Math.round(v/SNAP)*SNAP:v}
function makeGuide(kind,pos){const g=document.createElement('div');g.className='__cvb_guide '+kind; if(kind==='v')g.style.left=pos+'px';else g.style.top=pos+'px';document.body.appendChild(g);return g}
function removeGuides(){if(dragState.guideV)dragState.guideV.remove();if(dragState.guideH)dragState.guideH.remove();if(dragState.label)dragState.label.remove();dragState.guideV=dragState.guideH=dragState.label=null}
function setLabel(text){if(!dragState.label){dragState.label=document.createElement('div');dragState.label.className='__cvb_drag_label';document.body.appendChild(dragState.label)}dragState.label.innerHTML=text}
function alignSnap(rawX,rawY,target){
  let x=rawX,y=rawY,sx=null,sy=null;
  const elRect=dragState.originRect; if(!elRect)return {x,y,sx,sy};
  const moving={left:elRect.left+rawX, right:elRect.right+rawX, centerX:elRect.left+elRect.width/2+rawX, top:elRect.top+rawY, bottom:elRect.bottom+rawY, centerY:elRect.top+elRect.height/2+rawY};
  const tr=target.getBoundingClientRect(); const threshold=8;
  const candidatesX=[['left',tr.left],['centerX',tr.left+tr.width/2],['right',tr.right]];
  const movingX=[['left',moving.left],['centerX',moving.centerX],['right',moving.right]];
  let bestX=null;
  for(const [mk,mv] of movingX)for(const [tk,tv] of candidatesX){const d=tv-mv;if(Math.abs(d)<=threshold&&(bestX===null||Math.abs(d)<Math.abs(bestX.d)))bestX={d,mk,tk,pos:tv}}
  const candidatesY=[['top',tr.top],['centerY',tr.top+tr.height/2],['bottom',tr.bottom]];
  const movingY=[['top',moving.top],['centerY',moving.centerY],['bottom',moving.bottom]];
  let bestY=null;
  for(const [mk,mv] of movingY)for(const [tk,tv] of candidatesY){const d=tv-mv;if(Math.abs(d)<=threshold&&(bestY===null||Math.abs(d)<Math.abs(bestY.d)))bestY={d,mk,tk,pos:tv}}
  if(bestX){x+=bestX.d;sx=bestX.pos}else if(bestY){ }
  if(bestY){y+=bestY.d;sy=bestY.pos}
  return {x,y,sx,sy}
}
function nearestSnap(dx,dy){
  let best=null,bestDist=Infinity;
  const moving=dragState.el; if(!moving)return {x:dx,y:dy,sx:null,sy:null,label:''};
  for(const other of [...document.body.querySelectorAll('*')]){
    if(
      other===moving ||
      other===dragState.label ||
      other===dragState.guideV ||
      other===dragState.guideH ||
      other.tagName==='SCRIPT' ||
      other.tagName==='STYLE' ||
      other===document.body ||
      other===document.documentElement
    ) continue;
    // Do not snap to ancestors/descendants of the element being dragged.
    // The moving element must be compared with peer elements, otherwise its
    // own container can constantly force the drag back to its original place.
    if(other.contains(moving) || moving.contains(other)) continue;
    const r=other.getBoundingClientRect();
    if(r.width<1||r.height<1)continue;
    const cand=alignSnap(dx,dy,other);
    if(cand.sx!==null||cand.sy!==null){
      const dist=Math.hypot(cand.x-dx,cand.y-dy);
      if(dist<bestDist){bestDist=dist;best={...cand,other}}
    }
  }
  return best||{x:dx,y:dy,sx:null,sy:null,label:''};
}
function updateGuides(snapResult){
  if(snapResult.sx!==null){if(!dragState.guideV)dragState.guideV=makeGuide('v',snapResult.sx);else dragState.guideV.style.left=snapResult.sx+'px'}else if(dragState.guideV){dragState.guideV.remove();dragState.guideV=null}
  if(snapResult.sy!==null){if(!dragState.guideH)dragState.guideH=makeGuide('h',snapResult.sy);else dragState.guideH.style.top=snapResult.sy+'px'}else if(dragState.guideH){dragState.guideH.remove();dragState.guideH=null}
}
function describeAlignment(r){if(!r||!r.other)return 'Spostamento libero';const a=[];if(r.sx!==null)a.push('allineamento orizzontale');if(r.sy!==null)a.push('allineamento verticale');return a.join(' + ')||'Spostamento libero'}
function pickDragTarget(e){
  let t=e.target;
  if(!(t instanceof Element)) return null;
  // Ignore the builder overlay elements and scripts/styles.
  while(t && t !== document.body){
    if(t.matches('script,style,link,meta')) return null;
    if(t.hasAttribute('data-no-drag')) return null;
    return t;
  }
  return null;
}
function startDrag(e){
  if(!DRAG_MODE || e.button!==0)return;
  const t=pickDragTarget(e); if(!t)return;
  // Do not start on the body itself.
  if(t===document.documentElement || t===document.body)return;
  dragState.el=t;
  dragState.startX=e.clientX;
  dragState.startY=e.clientY;
  dragState.pointerId=e.pointerId;
  dragState.moved=false;
  dragState.originRect=t.getBoundingClientRect();
  const cs=getComputedStyle(t);
  dragState.baseLeft=num(cs.left);
  dragState.baseTop=num(cs.top);
  t.classList.add('__cvb_drag_candidate');
  try{t.setPointerCapture(e.pointerId)}catch{}
  setLabel('<strong>Trascina</strong> · muovi per spostare · avvicinati agli altri elementi per agganciare');
  // Prevent the browser from treating this gesture as text selection/scrolling.
  e.preventDefault();
  e.stopPropagation();
}
document.addEventListener('pointerdown',startDrag,{capture:true,passive:false});
document.addEventListener('pointermove',e=>{
  const t=dragState.el;
  if(!t||e.pointerId!==dragState.pointerId)return;
  e.preventDefault();
  e.stopPropagation();
  const deltaX=e.clientX-dragState.startX;
  const deltaY=e.clientY-dragState.startY;
  // Require a tiny movement before changing the element, avoiding jitter on a click.
  if(!dragState.moved && Math.abs(deltaX)+Math.abs(deltaY)<3)return;
  dragState.moved=true;
  const rawDx=snapVal(deltaX),rawDy=snapVal(deltaY);
  const sr=nearestSnap(rawDx,rawDy);
  const cs=getComputedStyle(t);
  if(cs.position==='static')t.style.position='relative';
  t.style.left=(dragState.baseLeft+sr.x)+'px';
  t.style.top=(dragState.baseTop+sr.y)+'px';
  updateGuides(sr);
  setLabel('<strong>'+describeAlignment(sr)+'</strong> · X '+Math.round(sr.x)+'px · Y '+Math.round(sr.y)+'px');
  t.classList.remove('__cvb_drag_candidate');
  t.classList.add('__cvb_dragging');
},{capture:true,passive:false});
document.addEventListener('pointerup',e=>{
  const t=dragState.el;
  if(!t||e.pointerId!==dragState.pointerId)return;
  e.preventDefault();
  e.stopPropagation();
  const rawDx=snapVal(e.clientX-dragState.startX),rawDy=snapVal(e.clientY-dragState.startY);
  const sr=nearestSnap(rawDx,rawDy);
  const dx=sr.x,dy=sr.y;
  const left=(dragState.baseLeft+dx)+'px',top=(dragState.baseTop+dy)+'px';
  t.style.left=left;t.style.top=top;
  t.classList.remove('__cvb_dragging','__cvb_drag_candidate');
  removeGuides();
  try{if(t.hasPointerCapture?.(e.pointerId))t.releasePointerCapture(e.pointerId)}catch{}
  const sel=makeSelector(t);
  const moved=dragState.moved;
  dragState.el=null;dragState.pointerId=null;dragState.originRect=null;
  // A real drag commits its final position. A simple click remains a normal selection.
  if(moved){
    parent.postMessage({type:'cvb-drag-end',selector:sel,left,top,dx,dy,snappedX:sr.sx!==null,snappedY:sr.sy!==null},'*');
  } else {
    t.removeAttribute('id');
    t.setAttribute('id','__cvb_selected');
    parent.postMessage({type:'cvb-select',selector:makeSelector(t),multi:e.shiftKey||e.ctrlKey||e.metaKey},'*');
  }
},{capture:true,passive:false});
document.addEventListener('pointercancel',e=>{
  const t=dragState.el;
  if(!t||e.pointerId!==dragState.pointerId)return;
  t.classList.remove('__cvb_dragging','__cvb_drag_candidate');
  try{if(t.hasPointerCapture?.(e.pointerId))t.releasePointerCapture(e.pointerId)}catch{}
  removeGuides();
  dragState.el=null;dragState.pointerId=null;dragState.originRect=null;
},{capture:true});
document.addEventListener('click',e=>{
  const t=e.target.closest('*');if(!t||t===document.body||DRAG_MODE)return;
  document.querySelectorAll('#__cvb_selected').forEach(x=>x.removeAttribute('id'));t.setAttribute('id','__cvb_selected');
  parent.postMessage({type:'cvb-select',selector:makeSelector(t),multi:e.shiftKey||e.ctrlKey||e.metaKey},'*');
});
</script></body></html>`;
}
function updatePreview(){els.previewFrame.srcdoc=previewDoc();els.previewStatus.textContent=`${state.nodes.length} elementi · ${[...state.styles.values()].reduce((n,m)=>n+Object.values(m).filter(e=>e.enabled).length,0)} proprietà attive`;}
function updateCssAndPreview(){els.cssOutput.textContent=buildCss()||'/* Attiva una proprietà CSS per iniziare. */';updatePreview();}
function updateControlVisual(key){const c=els.controls.querySelector(`[data-control="${CSS.escape(key)}"]`);if(!c)return;const d=propertyDefinitions.find(x=>x.key===key);const on=d?isEnabled(activeSelector(),d):false;const checkbox=c.querySelector('[data-action="toggle"]');if(checkbox)checkbox.checked=on;c.classList.toggle('is-off',!on);const note=c.querySelector('.off-note');if(note)note.textContent=on?'ON':'OFF';}
function renderAll(){renderDom();renderTags();renderControls();updateCssAndPreview();}
function applyHtml(){state.html=els.htmlInput.value;state.layoutSelection.clear();buildNodes();if(!state.nodes.some(n=>n.selector===state.selected)&&!state.tags.includes(state.selected))state.selected=null;state.selected=state.selected||state.nodes[0]?.selector||null;renderAll();}
function reset(){state.html=defaultHtml;state.selected=null;state.layoutSelection.clear();state.styles=new Map();state.keyframes=new Map();els.htmlInput.value=state.html;els.domSearch.value='';els.tagSearch.value='';els.propertySearch.value='';buildNodes();state.selected=state.nodes[0]?.selector||null;renderAll();}
function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),800);}
function downloadProject(){const css=buildCss();const html=`<!doctype html>\n<html lang="it">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Pagina generata</title>\n<link rel="stylesheet" href="style.css">\n</head>\n<body>\n${state.html}\n</body>\n</html>`;downloadBlob(new Blob([html],{type:'text/html'}),'pagina-generata.html');downloadBlob(new Blob([css||'/* Nessuna proprietà CSS attiva */'],{type:'text/css'}),'style.css');}

function updateKeyframeField(selector,frame,kind,value){
  const frames=defaultKeyframes(selector); if(!frames[frame]) frames[frame]={transform:'',opacity:'',color:'',backgroundColor:''};
  if(kind==='keyframe-transform')frames[frame].transform=value;
  if(kind==='keyframe-opacity')frames[frame].opacity=value;
  if(kind==='keyframe-color')frames[frame].color=value;
  if(kind==='keyframe-bg')frames[frame].backgroundColor=value;
}
function setKeyframePreset(selector,preset){
  const k=defaultKeyframes(selector);
  if(preset==='entrance'){
    Object.assign(k,{0:{transform:'translateX(-50px) scale(.94)',opacity:'0',color:'',backgroundColor:''},25:{transform:'translateX(-18px) scale(.98)',opacity:'.45',color:'',backgroundColor:''},50:{transform:'translateX(10px) scale(1.02)',opacity:'.8',color:'',backgroundColor:''},75:{transform:'translateX(-4px) scale(1)',opacity:'.95',color:'',backgroundColor:''},100:{transform:'translateX(0) scale(1)',opacity:'1',color:'',backgroundColor:''}});
  } else if(preset==='fade'){
    Object.assign(k,{0:{transform:'translateX(0) scale(1)',opacity:'0',color:'',backgroundColor:''},25:{transform:'translateX(0) scale(1)',opacity:'.25',color:'',backgroundColor:''},50:{transform:'translateX(0) scale(1)',opacity:'.55',color:'',backgroundColor:''},75:{transform:'translateX(0) scale(1)',opacity:'.8',color:'',backgroundColor:''},100:{transform:'translateX(0) scale(1)',opacity:'1',color:'',backgroundColor:''}});
  } else if(preset==='bounce'){
    Object.assign(k,{0:{transform:'translateY(-28px) scale(1)',opacity:'0',color:'',backgroundColor:''},25:{transform:'translateY(8px) scale(1)',opacity:'1',color:'',backgroundColor:''},50:{transform:'translateY(-10px) scale(1)',opacity:'1',color:'',backgroundColor:''},75:{transform:'translateY(4px) scale(1)',opacity:'1',color:'',backgroundColor:''},100:{transform:'translateY(0) scale(1)',opacity:'1',color:'',backgroundColor:''}});
  } else if(preset==='reset') state.keyframes.delete(animationKey(selector));
  renderControls(); updateCssAndPreview();
}

// Minimal public bridge used by additive visual-editor modules.
// Keeps the core logic private while allowing new phases to call the existing
// property/preview pipeline without duplicating app.js internals.
window.CVB_CORE_API=window.CVB_CORE_API||{};
window.CVB_CORE_API.setProperty=(...args)=>setProperty(...args);
window.CVB_CORE_API.updateCssAndPreview=()=>updateCssAndPreview();
window.CVB_CORE_API.renderControls=()=>renderControls();
window.CVB_CORE_API.getActiveSelector=()=>activeSelector();
window.CVB_CORE_API.getSelectedSelector=()=>state.selected;
window.CVB_CORE_API.getProperty=(selector,key)=>{const e=styleEntry(selector,key,false);return {value:e?.value??'',enabled:!!e?.enabled};};
window.CVB_CORE_API.enableProperty=(selector,d,enabled)=>enableProperty(selector,d,enabled);
window.CVB_CORE_API.setKeyframes=(selector,name,frames)=>{const k=defaultKeyframes(selector);state.keyframes.set(animationKey(selector),Object.fromEntries((frames||[]).map(f=>[Number(f.p),{transform:f.transform||'',opacity:String(f.opacity??''),color:f.color||'',backgroundColor:f.backgroundColor||''}])));return k;};
window.CVB_CORE_API.clearKeyframes=selector=>state.keyframes.delete(animationKey(selector));

function handleEditorEvent(t){
  const p=t.dataset.property;
  if(!p||!state.selected)return;
  const d=propertyDefinitions.find(x=>x.key===p);if(!d)return;
  const selector=activeSelector();
  if(t.dataset.action==='toggle'){enableProperty(selector,d,t.checked);return;}
  let v=t.value;
  switch(t.dataset.kind){
    case'range':case'number':v+=t.dataset.unit;setProperty(selector,p,v,true,false);break;
    case'color-picker':{const text=els.controls.querySelector(`[data-property="${CSS.escape(p)}"][data-kind="color-text"]`);if(text)text.value=t.value;setProperty(selector,p,t.value,true,false);break;}
    case'color-text':if(/^#[0-9a-f]{3,8}$/i.test(t.value)||/^rgba?\([^)]*\)$/i.test(t.value)||/^hsla?\([^)]*\)$/i.test(t.value))setProperty(selector,p,t.value,true,false);break;
    case'box-side':setProperty(selector,p,boxFromInputs(d),true,false);break;
    case'radius-side':setProperty(selector,p,radiusFromInputs(),true,false);break;
    case'shadow-x':case'shadow-y':case'shadow-blur':case'shadow-spread':setProperty(selector,p,shadowFromInputs(),true,false);break;
    case'shadow-color-picker':setProperty(selector,p,shadowFromInputs(),true,false);break;
    case'text-shadow-x':case'text-shadow-y':case'text-shadow-blur':case'text-shadow-color':setProperty(selector,p,textShadowFromInputs(),true,false);break;
    case'gradient-select':setProperty(selector,p,t,true,false);break;
    case'gradient-angle':case'gradient-color1':case'gradient-color2':setProperty(selector,p,gradientFromInputs(),true,false);break;
    case'gradient-text':if(/^(none|(linear|radial|conic)-gradient\()/i.test(t.value))setProperty(selector,p,t.value,true,false);break;
    case'background-type':case'background-angle':case'background-position':case'background-size':case'background-color':setProperty(selector,p,backgroundFromInputs(),true,false);break;
    case'gradient-type':case'gradient-angle-v':case'gradient-c1':case'gradient-c2':case'gradient-s1':case'gradient-s2':setProperty(selector,p,gradientVisualFromInputs(p),true,false);renderControls();break;
    case'bgv-type':case'bgv-angle':case'bgv-color':case'bgv-posx':case'bgv-posy':case'bgv-size':case'bgv-repeat':case'bgv-blend':setProperty(selector,p,backgroundVisualFromInputs(p),true,false);renderControls();break;
    case'border-width-v':case'border-style-v':case'border-color-v':setProperty(selector,p,borderVisualFromInputs(p),true,false);renderControls();break;
    case'clip-shape':case'clip-size-v':case'clip-x-v':case'clip-y-v':setProperty(selector,p,clipVisualFromInputs(p),true,false);renderControls();break;
    case'clip-css-v':setProperty(selector,p,t.value,true,false);renderControls();break;
    case'motion-path-v':setProperty(selector,'offset-path',motionPathFromPreset(t.value),true,false);renderControls();break;
    case'motion-distance-v':setProperty(selector,'offset-distance',`${Math.max(0,Math.min(100,Number(t.value)||0))}%`,true,false);renderControls();break;
    case'motion-rotate-v':setProperty(selector,'offset-rotate',t.value,true,false);renderControls();break;
    case'motion-anchor-v':setProperty(selector,'offset-anchor',t.value,true,false);renderControls();break;
    case'motion-path-text-v':setProperty(selector,'offset-path',t.value,true,false);renderControls();break;
    case'background-text':setProperty(selector,p,t.value,true,false);break;
    case'transform-tx':case'transform-ty':case'transform-tz':case'transform-sx':case'transform-sy':case'transform-rx':case'transform-ry':case'transform-rz':case'transform-skx':case'transform-sky':setProperty(selector,p,transformFromInputs(p),true,false);renderControls();break;
    case'filter-blur':case'filter-brightness':case'filter-contrast':case'filter-grayscale':case'filter-sepia':case'filter-saturate':case'filter-hue':case'filter-invert':case'filter-opacity':case'filter-drop-shadow':setProperty(selector,p,filterFromInputs(p),true,false);{const row=t.closest('.filter-row');const out=row?.querySelector('output');if(out){const k=t.dataset.kind;const val=Number(t.value);out.textContent=k==='filter-blur'?`${val}px`:k==='filter-hue'?`${val}°`:`${Math.round(val)}%`;}}break;
    case'border-width':case'border-style':case'border-color':case'border-radius':setProperty(selector,p,borderFromInputs(),true,false);break;
    case'clip-preset':case'clip-text':setProperty(selector,p,t.value,true,false);break;
    case'grid-template-preset':setProperty(selector,p,t.value,true,false);break;
    case'grid-template-count':{const n=Math.max(1,Math.min(12,Number(t.value)||1));setProperty(selector,p,`repeat(${n}, 1fr)`,true,false);break;}
    case'position-x':case'position-y':{const x=els.controls.querySelector('[data-kind="position-x"]')?.value||'center';const y=els.controls.querySelector('[data-kind="position-y"]')?.value||'center';setProperty(selector,p,`${x} ${y}`,true,false);break;}
    case'transition-property':case'transition-timing':case'transition-duration':case'transition-delay':setProperty(selector,p,transitionFromInputs(),true,false);break;
    case'animation-name':case'animation-duration':case'animation-timing':case'animation-iteration':case'animation-direction':case'animation-fill':setProperty(selector,p,animationFromInputs(),true,false);break;
    case'keyframe-transform':case'keyframe-opacity':case'keyframe-color':case'keyframe-bg':updateKeyframeField(selector,Number(t.dataset.frame),t.dataset.kind,t.value);setProperty(selector,p,animationFromInputs(),true,false);break;
    default:setProperty(selector,p,v,true,false);
  }
  updateControlVisual(p);
}

els.domTree.addEventListener('click',e=>{const b=e.target.closest('[data-selector]');if(!b)return;const sel=b.dataset.selector;if(state.layoutMulti){if(state.layoutSelection.has(sel))state.layoutSelection.delete(sel);else state.layoutSelection.add(sel);els.layoutSelectionCount.textContent=String(state.layoutSelection.size);renderDom();return;}state.selected=sel;renderDom();renderTags();renderControls();});
els.tagList.addEventListener('click',e=>{const b=e.target.closest('[data-tag]');if(!b)return;state.selected=b.dataset.tag;renderDom();renderTags();renderControls();});
els.controls.addEventListener('input',e=>{const t=e.target;if(t.dataset.action==='toggle'||t.dataset.action)return;handleEditorEvent(t);});
els.controls.addEventListener('change',e=>{const t=e.target;if(t.dataset.action==='toggle'||t.dataset.action)return;handleEditorEvent(t);});
els.controls.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b||!state.selected)return;const p=b.dataset.property;const a=b.dataset.action;if(a==='box-preset'){const n=b.dataset.preset;setProperty(activeSelector(),p,`${n}px ${n}px ${n}px ${n}px`,true,false);renderControls();}else if(a==='radius-preset'){const n=b.dataset.value;const v=n==='999'?'999px 999px 999px 999px':`${n}px ${n}px ${n}px ${n}px`;setProperty(activeSelector(),p,v,true,false);renderControls();}else if(a==='shadow-preset'||a==='text-shadow-preset'||a==='transform-preset'||a==='background-preset'||a==='grid-template-preset'||a==='border-preset'||a==='filter-preset'){setProperty(activeSelector(),p,b.dataset.value,true,false);renderControls();}else if(a==='transform-reset'){setProperty(activeSelector(),p,'none',true,false);renderControls();}else if(a==='keyframe-preset'){setKeyframePreset(activeSelector(),b.dataset.preset);}else if(a==='gradient-visual-preset'){const presets={sunset:'linear-gradient(135deg,#ff9966 0%,#ff5e62 100%)',ocean:'linear-gradient(135deg,#36d1dc 0%,#5b86e5 100%)',mono:'linear-gradient(90deg,#222222 0%,#dddddd 100%)',reset:'none'};setProperty(activeSelector(),p,presets[b.dataset.value]||'none',true,false);renderControls();}else if(a==='background-visual-preset'){const presets={solid:'#ffffff',blue:'linear-gradient(135deg,#6ea8ff,#4f7bd9) center/cover no-repeat',sunset:'linear-gradient(135deg,#ff9966,#ff5e62) center/cover no-repeat',reset:'none'};setProperty(activeSelector(),p,presets[b.dataset.value]||'none',true,false);renderControls();}else if(a==='border-visual-preset'){setProperty(activeSelector(),p,b.dataset.value,true,false);renderControls();}else if(a==='clip-visual-preset'){const vals={circle:'circle(50% at 50% 50%)',triangle:'polygon(50% 0%,100% 100%,0% 100%)',diamond:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',reset:'none'};setProperty(activeSelector(),p,vals[b.dataset.value]||'none',true,false);renderControls();} });
els.layoutMultiToggle?.addEventListener('change',()=>{state.layoutMulti=els.layoutMultiToggle.checked;if(!state.layoutMulti){state.layoutSelection.clear();els.layoutSelectionCount.textContent='0';}renderDom();});
els.layoutActions?.addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(!b)return;applyLayout(b.dataset.layout);});
els.applyHtmlButton.addEventListener('click',applyHtml);els.domSearch.addEventListener('input',renderDom);els.tagSearch.addEventListener('input',renderTags);els.propertySearch.addEventListener('input',renderControls);els.resetButton.addEventListener('click',reset);els.downloadButton.addEventListener('click',downloadProject);
els.clearStylesButton.addEventListener('click',()=>{const selector=activeSelector();if(selector){state.styles.delete(selector);renderControls();updateCssAndPreview();}});
els.fileInput.addEventListener('change',async()=>{const f=els.fileInput.files?.[0];if(!f)return;els.htmlInput.value=await f.text();applyHtml();});
els.copyCssButton.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(buildCss());const old=els.copyCssButton.textContent;els.copyCssButton.textContent='Copiato!';setTimeout(()=>els.copyCssButton.textContent=old,900);}catch{els.copyCssButton.textContent='Copia non disponibile';setTimeout(()=>els.copyCssButton.textContent='Copia CSS',1000);}});
els.desktopButton.addEventListener('click',()=>{els.previewFrameWrap.classList.remove('mobile');els.previewFrameWrap.classList.add('desktop');els.desktopButton.classList.add('active');els.mobileButton.classList.remove('active');});
els.mobileButton.addEventListener('click',()=>{els.previewFrameWrap.classList.remove('desktop');els.previewFrameWrap.classList.add('mobile');els.mobileButton.classList.add('active');els.desktopButton.classList.remove('active');});
els.dragModeToggle?.addEventListener('change',()=>{state.dragMode=els.dragModeToggle.checked;if(els.previewHelp)els.previewHelp.innerHTML=state.dragMode?'🖱️ <strong>Trascinamento attivo:</strong> trascina un elemento. Il movimento viene tradotto in <code>position</code> + <code>left/top</code>.':'💡 Clicca un elemento per selezionarlo. Attiva <strong>↔ Trascina</strong> per spostarlo nella preview; il CSS verrà generato automaticamente.';updatePreview();});
els.dragSnap?.addEventListener('input',()=>{state.dragSnap=Math.max(0,Number(els.dragSnap.value)||0);});
document.querySelectorAll('[data-pseudo]').forEach(btn=>btn.addEventListener('click',()=>{state.pseudo=btn.dataset.pseudo;document.querySelectorAll('[data-pseudo]').forEach(b=>b.classList.toggle('active',b===btn));renderControls();updateCssAndPreview();}));
window.addEventListener('message',e=>{if(e.data?.type==='cvb-drag-end'){const sel=e.data.selector;if(!sel)return;setProperty(sel,'position','relative',true,false);setProperty(sel,'left',e.data.left,true,false);setProperty(sel,'top',e.data.top,true,false);state.selected=sel;renderDom();renderTags();renderControls();if(els.previewStatus){const axis=e.data.snappedX&&!e.data.snappedY?'orizzontale':e.data.snappedY&&!e.data.snappedX?'verticale':(e.data.snappedX||e.data.snappedY)?'a un asse':'libero';els.previewStatus.textContent='Spostato · aggancio '+axis+' · prova Flex/Grid dal pannello Layout visuale';}return;}if(e.data?.type!=='cvb-select')return;const sel=e.data.selector;if(e.data.multi){if(state.layoutSelection.has(sel))state.layoutSelection.delete(sel);else state.layoutSelection.add(sel);state.layoutMulti=true;if(els.layoutMultiToggle)els.layoutMultiToggle.checked=true;if(els.layoutSelectionCount)els.layoutSelectionCount.textContent=String(state.layoutSelection.size);renderDom();return;}state.selected=sel;renderDom();renderTags();renderControls();});
els.cssPropertyCount && (els.cssPropertyCount.textContent=String(propertyDefinitions.length));
els.htmlInput.value=defaultHtml;buildNodes();state.selected=state.nodes[0]?.selector||null;renderAll();

// v2.29 — additive project state bridge for JSON save/load.
(function(){
  'use strict';
  const api = window.CVB_CORE_API = window.CVB_CORE_API || {};
  function plain(value, seen){
    if(value===null || value===undefined) return value;
    if(typeof value==='function' || typeof value==='symbol') return undefined;
    if(typeof value!=='object') return value;
    seen=seen||new WeakSet();
    if(seen.has(value)) return undefined;
    seen.add(value);
    if(value instanceof Map) return [...value.entries()].map(([k,v])=>[k,plain(v,seen)]);
    if(value instanceof Set) return [...value].map(v=>plain(v,seen)).filter(v=>v!==undefined);
    if(Array.isArray(value)) return value.map(v=>plain(v,seen)).filter(v=>v!==undefined);
    const out={};
    Object.keys(value).forEach(k=>{
      if(k.startsWith('_')) return;
      const v=plain(value[k],seen);
      if(v!==undefined) out[k]=v;
    });
    return out;
  }
  function snapshot(){
    const core={
      html:state.html,
      selected:state.selected,
      pseudo:state.pseudo,
      layoutMulti:state.layoutMulti,
      layoutSelection:[...state.layoutSelection],
      dragMode:state.dragMode,
      dragSnap:state.dragSnap,
      styles:[...state.styles.entries()],
      keyframes:[...state.keyframes.entries()],
      searches:{
        dom:els.domSearch?.value||'',tag:els.tagSearch?.value||'',property:els.propertySearch?.value||''
      },
      viewport:els.previewFrameWrap?.classList.contains('mobile')?'mobile':'desktop'
    };
    return {
      format:'CVB_PROJECT',
      version:'2.29',
      savedAt:new Date().toISOString(),
      core,
      extension:plain(window.CVB_EXTENSIONS||{}),
      visual:plain(window.CVB_VISUAL_EDITORS||{}),
      phase2:plain(window.CVB_PHASE2||{}),
      phase3:plain(window.CVB_PHASE3||{}),
      phase4:plain(window.CVB_PHASE4||{}),
      ui:{sidebarWidth:getComputedStyle(document.querySelector('.workspace')||document.body).getPropertyValue('--sidebar-width').trim() || localStorage.getItem('css-builder-sidebar-width-v24') || ''}
    };
  }
  function mapFrom(entries){return new Map(Array.isArray(entries)?entries.map(x=>[x[0],x[1]]):[]);}
  function apply(snapshotData){
    const p=snapshotData||{};
    const c=p.core||{};
    if(typeof c.html==='string') state.html=c.html;
    buildNodes();
    state.styles=mapFrom(c.styles);
    state.keyframes=mapFrom(c.keyframes);
    state.layoutSelection=new Set(Array.isArray(c.layoutSelection)?c.layoutSelection:[]);
    state.layoutMulti=!!c.layoutMulti;
    state.dragMode=!!c.dragMode;
    state.dragSnap=Number.isFinite(Number(c.dragSnap))?Number(c.dragSnap):8;
    state.pseudo=typeof c.pseudo==='string'?c.pseudo:'normal';
    const validSelected=typeof c.selected==='string' && state.nodes.some(n=>n.selector===c.selected);
    state.selected=validSelected?c.selected:(state.nodes[0]?.selector||null);
    if(els.htmlInput) els.htmlInput.value=state.html;
    if(els.domSearch) els.domSearch.value=c.searches?.dom||'';
    if(els.tagSearch) els.tagSearch.value=c.searches?.tag||'';
    if(els.propertySearch) els.propertySearch.value=c.searches?.property||'';
    if(els.layoutMultiToggle) els.layoutMultiToggle.checked=state.layoutMulti;
    if(els.layoutSelectionCount) els.layoutSelectionCount.textContent=String(state.layoutSelection.size);
    if(els.dragModeToggle) els.dragModeToggle.checked=state.dragMode;
    if(els.dragSnap) els.dragSnap.value=String(state.dragSnap);
    document.querySelectorAll('[data-pseudo]').forEach(b=>b.classList.toggle('active',b.dataset.pseudo===state.pseudo));
    if(c.viewport==='mobile') els.mobileButton?.click(); else els.desktopButton?.click();

    const restoreObject=(target,data,skip)=>{
      if(!target || !data || typeof data!=='object') return;
      Object.keys(data).forEach(k=>{
        if(k===skip || k.startsWith('_')) return;
        const incoming=data[k];
        if(Array.isArray(incoming)){
          if(Array.isArray(target[k])) target[k]=incoming;
          else if(target[k] instanceof Map) target[k]=mapFrom(incoming);
          else if(target[k] instanceof Set) target[k]=new Set(incoming);
          else target[k]=incoming;
        }else if(incoming && typeof incoming==='object'){
          if(target[k] instanceof Map) target[k]=mapFrom(incoming);
          else if(target[k] instanceof Set) target[k]=new Set(incoming);
          else if(target[k] && typeof target[k]==='object') restoreObject(target[k],incoming);
          else target[k]=incoming;
        }else target[k]=incoming;
      });
    };
    if(window.CVB_EXTENSIONS) restoreObject(window.CVB_EXTENSIONS,p.extension||{});
    if(window.CVB_VISUAL_EDITORS) restoreObject(window.CVB_VISUAL_EDITORS,p.visual||{});
    if(window.CVB_PHASE2) restoreObject(window.CVB_PHASE2,p.phase2||{});
    if(window.CVB_PHASE3) restoreObject(window.CVB_PHASE3,p.phase3||{});
    if(window.CVB_PHASE4) restoreObject(window.CVB_PHASE4,p.phase4||{});
    if(p.ui?.sidebarWidth){
      const ws=document.querySelector('.workspace');
      if(ws && /px$/.test(p.ui.sidebarWidth)) ws.style.setProperty('--sidebar-width',p.ui.sidebarWidth);
      const n=parseInt(p.ui.sidebarWidth,10); if(Number.isFinite(n)) localStorage.setItem('css-builder-sidebar-width-v24',String(n));
    }
    renderAll();
    setTimeout(()=>{
      window.CVB_PHASE2?.render?.();
      window.CVB_PHASE3?.render?.();
      window.CVB_PHASE4?.render?.();
      window.CVB_VISUAL_EDITORS?.render?.();
      window.CVB_PHASE_RUNTIME?.refresh?.();
      window.updateCssAndPreview?.();
    },0);
    return true;
  }
  api.projectSnapshot=snapshot;
  api.loadProjectSnapshot=apply;
  api.exportProjectSnapshot=snapshot;
})();
