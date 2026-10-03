(()=>{
  'use strict';
  const VBVE=window.CVB_VISUAL_EDITORS;
  const $=VBVE.$, esc=VBVE.esc, num=VBVE.num, emit=VBVE.emit, copyOutput=VBVE.copyOutput;
  function filterCssFromState(list){
  return (list||[]).filter(f=>f.fn && String(f.value)!=='').map(f=>`${f.fn}(${f.value||'0'}${f.unit||''})`).join(' ') || 'none';
}
const FILTER_DEFS={
  blur:['px','0'],
  brightness:['','1'],
  contrast:['','1'],
  saturate:['','1'],
  grayscale:['','0'],
  sepia:['','0'],
  opacity:['','1'],
  invert:['','0'],
  'hue-rotate':['deg','0'],
  'drop-shadow':['','0 4px 12px rgba(0,0,0,.25)']
};

function renderFilterEditor(kind){
  const cfg=VBVE.state[kind], host=$(kind==='filter'?'veFilterRows':'veBackdropRows');
  if(!host)return;
  host.innerHTML=(cfg||[]).map((f,i)=>`
    <div class="ve-filter-row">
      <select data-vf-kind="${kind}" data-vf-index="${i}" data-vf-key="fn">
        ${Object.keys(FILTER_DEFS).map(k=>`<option value="${esc(k)}" ${f.fn===k?'selected':''}>${esc(k)}</option>`).join('')}
      </select>
      <input value="${esc(f.value||'')}" placeholder="${esc(FILTER_DEFS[f.fn]?.[1]||'0')}" data-vf-kind="${kind}" data-vf-index="${i}" data-vf-key="value">
      <span class="unit-label">${esc(f.unit||'')}</span>
      <button type="button" data-vf-remove="${kind}" data-vf-index="${i}" title="Rimuovi">×</button>
    </div>`).join('');
}

function renderFilterEditors(){
  const f=filterCssFromState(VBVE.state.filter), b=filterCssFromState(VBVE.state.backdropFilter);
  const obj=$('veFilterObject');if(obj)obj.style.filter=f;
  const backdrop=$('veBackdropObject');if(backdrop)backdrop.style.backdropFilter=b;
  const fo=$('veFilterOutput');if(fo)fo.textContent=f;
  const bo=$('veBackdropOutput');if(bo)bo.textContent=b;
  renderFilterEditor('filter');renderFilterEditor('backdropFilter');
}

function injectFilterEditors(){
  if($('veFilter'))return;
  const c=$('controls');if(!c)return;
  VBVE.state.filter=VBVE.state.filter||[
    {fn:'blur',value:'0',unit:'px'},
    {fn:'brightness',value:'1',unit:''},
    {fn:'contrast',value:'1',unit:''}
  ];
  VBVE.state.backdropFilter=VBVE.state.backdropFilter||[
    {fn:'blur',value:'8',unit:'px'}
  ];

  const s=document.createElement('section');
  s.className='panel-section visual-editor-section';s.id='veFilter';
  s.innerHTML=`
    <div class="section-title-row"><h2>16. Editor grafico — Filter</h2><span class="counter">catena filtri</span></div>
    <p class="hint">I filtri vengono applicati nell'ordine in cui compaiono. Modifica un valore e guarda subito l'effetto.</p>
    <div class="ve-filter-preview" id="veFilterStage">
      <div class="ve-filter-object" id="veFilterObject">FILTER</div>
    </div>
    <div id="veFilterRows"></div>
    <button type="button" data-vf-add="filter">+ Aggiungi filtro</button>
    <div class="complex-output"><code id="veFilterOutput"></code><button type="button" data-ve-copy="veFilterOutput">Copia</button></div>

    <h3 class="ve-subtitle">Backdrop Filter</h3>
    <p class="hint">Agisce sul contenuto visibile dietro l'elemento semitrasparente.</p>
    <div class="ve-backdrop-scene" id="veBackdropScene">
      <div class="ve-backdrop-decoration"></div>
      <div class="ve-backdrop-object" id="veBackdropObject">BACKDROP</div>
    </div>
    <div id="veBackdropRows"></div>
    <button type="button" data-vf-add="backdropFilter">+ Aggiungi filtro</button>
    <div class="complex-output"><code id="veBackdropOutput"></code><button type="button" data-ve-copy="veBackdropOutput">Copia</button></div>`;
  c.appendChild(s);

  s.addEventListener('input',e=>{
    const t=e.target;
    if(t.matches('[data-vf-kind]')){
      const kind=t.dataset.vfKind, row=VBVE.state[kind]?.[Number(t.dataset.vfIndex)];
      if(!row)return;
      row[t.dataset.vfKey]=t.value;
      if(t.dataset.vfKey==='fn')row.unit=FILTER_DEFS[t.value]?.[0]||'';
      renderFilterEditors();
      emit(kind==='filter'?'filter':'backdrop-filter',filterCssFromState(VBVE.state[kind]));
    }
  });
  s.addEventListener('click',e=>{
    const add=e.target.closest('[data-vf-add]');
    if(add){VBVE.state[add.dataset.vfAdd].push({fn:'blur',value:'4',unit:'px'});renderFilterEditors();return;}
    const rem=e.target.closest('[data-vf-remove]');
    if(rem){VBVE.state[rem.dataset.vfRemove].splice(Number(rem.dataset.vfIndex),1);renderFilterEditors();return;}
    const b=e.target.closest('[data-ve-copy]');
    if(b){const el=$(b.dataset.veCopy);navigator.clipboard?.writeText(el?.textContent||'');b.textContent='Copiato';setTimeout(()=>b.textContent='Copia',800);}
  });
  renderFilterEditors();
}
  VBVE.ready(()=>{ injectFilterEditors(); });
})();
