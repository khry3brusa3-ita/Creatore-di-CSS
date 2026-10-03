(()=>{
  'use strict';

  const P4=window.CVB_PHASE4=window.CVB_PHASE4||{};
  if(P4.__v2Loaded) return;
  P4.__v2Loaded=true;
  P4.version='2.28';
  P4.resources=Array.isArray(P4.resources)?P4.resources:[];

  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const runtime=()=>window.CVB_PHASE_RUNTIME||null;
  const validUrl=u=>/^https:\/\//i.test(String(u||'').trim());
  const isCdnjs=u=>/^https:\/\/cdnjs\.cloudflare\.com\//i.test(String(u||''));

  function host(){
    const preferredId=window.CVB_PHASE1_STABILITY?.hostId;
    if(preferredId && $(preferredId)) return $(preferredId);
    const controls=$('controls');
    if(!controls?.parentElement) return null;
    let h=$('cvbExternalResourcesHost');
    if(!h){h=document.createElement('div');h.id='cvbExternalResourcesHost';h.className='cvb-external-resources-host';controls.parentElement.appendChild(h);}
    return h;
  }

  function enabledResources(){return P4.resources.filter(r=>r.enabled!==false&&validUrl(r.url));}

  function runtimePayload(){
    const css=enabledResources().filter(r=>r.type==='css').map(r=>`<link rel="stylesheet" href="${esc(r.url)}">`).join('');
    const js=enabledResources().filter(r=>r.type==='js').map(r=>r.module
      ? `<script type="module" src="${esc(r.url)}"></script>`
      : `<script src="${esc(r.url)}"></script>`).join('');
    return {head:css,body:js};
  }

  function refreshPreview(){
    const rt=runtime();
    if(rt?.refresh){rt.refresh();return true;}
    window.CVB_CORE_API?.updateCssAndPreview?.();
    return true;
  }

  function add(type){
    P4.resources.push({id:`r${Date.now()}_${Math.random().toString(36).slice(2,7)}`,type,url:'',enabled:true,module:false});
    render();
    focusLast();
  }

  function remove(i){P4.resources.splice(i,1);render();refreshPreview();}
  function toggle(i,v){if(P4.resources[i])P4.resources[i].enabled=!!v;refreshPreview();}
  function update(i,key,v){if(P4.resources[i])P4.resources[i][key]=v;}

  function focusLast(){
    const inputs=$$('#cvbP4List input[data-p4-url]');
    const last=inputs[inputs.length-1];
    last?.focus();
  }
  function $$(sel){return [...document.querySelectorAll(sel)];}

  function render(){
    const list=$('cvbP4List');
    const count=$('cvbP4Count');
    const valid=enabledResources();
    if(count) count.textContent=String(valid.length);
    if(!list) return;
    list.innerHTML=P4.resources.length?P4.resources.map((r,i)=>`
      <div class="cvb-p4-v2-row ${r.enabled===false?'is-disabled':''}" data-p4-row="${i}">
        <div class="cvb-p4-v2-row-head">
          <label class="cvb-p4-type"><span>${r.type==='css'?'CSS':'JavaScript'}</span><input type="checkbox" ${r.enabled!==false?'checked':''} data-p4-enable="${i}"><small>attiva</small></label>
          <span class="cvb-p4-domain">${isCdnjs(r.url)?'cdnjs.cloudflare.com':'risorsa HTTPS'}</span>
        </div>
        <div class="cvb-p4-v2-main">
          <input type="url" value="${esc(r.url)}" placeholder="https://cdnjs.cloudflare.com/ajax/libs/..." data-p4-url="${i}">
          <button type="button" data-p4-remove="${i}" title="Rimuovi risorsa">×</button>
        </div>
        ${r.type==='js'?`<label class="cvb-p4-module"><input type="checkbox" ${r.module?'checked':''} data-p4-module="${i}"> Carica come ES module <code>type="module"</code></label>`:''}
      </div>`).join(''):`<div class="cvb-p4-empty">Nessuna risorsa esterna. La preview resta completamente locale finché non ne aggiungi una.</div>`;
    const cssCount=P4.resources.filter(r=>r.type==='css'&&r.enabled!==false&&validUrl(r.url)).length;
    const jsCount=P4.resources.filter(r=>r.type==='js'&&r.enabled!==false&&validUrl(r.url)).length;
    const cc=$('cvbP4CssCount'),jc=$('cvbP4JsCount');
    if(cc)cc.textContent=String(cssCount);
    if(jc)jc.textContent=String(jsCount);
  }

  function inject(){
    if($('cvbPhase4'))return;
    const h=host();
    if(!h)return;
    const s=document.createElement('section');
    s.className='panel-section visual-editor-section cvb-phase4-section';
    s.id='cvbPhase4';
    s.innerHTML=`
      <div class="section-title-row">
        <div><h2>24. Risorse esterne — CDN</h2><span>CSS · JavaScript · preview</span></div>
        <span class="counter"><span id="cvbP4Count">0</span> attive</span>
      </div>
      <p class="hint">Aggiungi risorse <strong>HTTPS</strong> alla sola preview. Per esempio puoi usare file ospitati su <code>cdnjs.cloudflare.com</code>. La pagina dell'app non viene modificata.</p>
      <div class="cvb-p4-v2-toolbar">
        <button type="button" id="cvbP4AddCss">+ CSS / CDN</button>
        <button type="button" id="cvbP4AddJs">+ JavaScript / CDN</button>
        <button type="button" id="cvbP4PresetGsap">Esempio CDN</button>
        <button type="button" id="cvbP4Refresh" class="primary">↻ Applica alla preview</button>
      </div>
      <div class="cvb-p4-v2-summary">
        <span>CSS <b id="cvbP4CssCount">0</b></span>
        <span>JavaScript <b id="cvbP4JsCount">0</b></span>
        <span>Solo HTTPS</span>
      </div>
      <div id="cvbP4List" class="cvb-p4-v2-list"></div>
      <div class="cvb-p4-v2-guide">
        <strong>Come usarlo</strong>
        <span>1. Aggiungi una risorsa.</span>
        <span>2. Incolla l'URL HTTPS del file.</span>
        <span>3. Premi <b>Applica alla preview</b>.</span>
        <span>4. Usa la libreria dal JavaScript Lab.</span>
      </div>
      <div class="cvb-p4-v2-warning">⚠ Le risorse esterne richiedono Internet. Usa solo URL di cui ti fidi.</div>`;
    h.appendChild(s);

    $('cvbP4AddCss').onclick=()=>add('css');
    $('cvbP4AddJs').onclick=()=>add('js');
    $('cvbP4Refresh').onclick=()=>refreshPreview();
    $('cvbP4PresetGsap').onclick=()=>{
      P4.resources.push({id:`r${Date.now()}`,type:'js',url:'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',enabled:true,module:false});
      render();
    };
    s.addEventListener('input',e=>{
      if(e.target.matches('[data-p4-url]')) update(Number(e.target.dataset.p4Url),'url',e.target.value.trim());
      if(e.target.matches('[data-p4-module]')) update(Number(e.target.dataset.p4Module),'module',e.target.checked);
    });
    s.addEventListener('change',e=>{
      if(e.target.matches('[data-p4-enable]')) toggle(Number(e.target.dataset.p4Enable),e.target.checked);
      if(e.target.matches('[data-p4-module]')) toggleModule(Number(e.target.dataset.p4Module),e.target.checked);
    });
    s.addEventListener('click',e=>{
      const r=e.target.closest('[data-p4-remove]');
      if(r) remove(Number(r.dataset.p4Remove));
    });
    render();
  }

  function toggleModule(i,v){if(P4.resources[i])P4.resources[i].module=!!v;refreshPreview();}

  function registerRuntime(){
    const rt=runtime();
    if(!rt?.register || P4.__runtimeRegistered)return;
    P4.__runtimeRegistered=true;
    rt.register(runtimePayload);
  }

  document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`
    #cvbPhase4 .cvb-p4-v2-toolbar{display:flex;flex-wrap:wrap;gap:7px;margin:9px 0}
    #cvbPhase4 .cvb-p4-v2-summary{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;color:var(--muted);font-size:10px}
    #cvbPhase4 .cvb-p4-v2-summary span{padding:5px 7px;border:1px solid var(--border);border-radius:7px;background:#10151e}
    #cvbPhase4 .cvb-p4-v2-summary b{color:var(--text)}
    #cvbPhase4 .cvb-p4-v2-list{display:grid;gap:8px}
    #cvbPhase4 .cvb-p4-v2-row{border:1px solid var(--border);border-radius:10px;padding:9px;background:#121720}
    #cvbPhase4 .cvb-p4-v2-row.is-disabled{opacity:.58}
    #cvbPhase4 .cvb-p4-v2-row-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}
    #cvbPhase4 .cvb-p4-type{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700}
    #cvbPhase4 .cvb-p4-type input{accent-color:var(--accent)}
    #cvbPhase4 .cvb-p4-type small{font-weight:400;color:var(--muted)}
    #cvbPhase4 .cvb-p4-domain{font-size:9px;color:var(--muted)}
    #cvbPhase4 .cvb-p4-v2-main{display:grid;grid-template-columns:minmax(0,1fr) 32px;gap:6px}
    #cvbPhase4 .cvb-p4-v2-main input{min-width:0;padding:8px;border:1px solid var(--border);border-radius:7px;background:var(--input);color:var(--text)}
    #cvbPhase4 .cvb-p4-v2-main button{padding:5px}
    #cvbPhase4 .cvb-p4-module{display:flex;align-items:center;gap:6px;margin-top:7px;color:var(--muted);font-size:9px}
    #cvbPhase4 .cvb-p4-module input{accent-color:var(--accent)}
    #cvbPhase4 .cvb-p4-empty{padding:10px;border:1px dashed var(--border);border-radius:9px;color:var(--muted);font-size:10px}
    #cvbPhase4 .cvb-p4-v2-guide{display:grid;gap:4px;margin-top:9px;padding:9px;border:1px dashed var(--border);border-radius:9px;background:#10151e;color:var(--muted);font-size:10px}
    #cvbPhase4 .cvb-p4-v2-guide strong{color:var(--text)}
    #cvbPhase4 .cvb-p4-v2-warning{margin-top:9px;padding:8px;border:1px dashed #70582f;border-radius:7px;color:#e9c992;background:rgba(112,88,47,.12);font-size:9px}
    @media(max-width:700px){#cvbPhase4 .cvb-p4-v2-main{grid-template-columns:1fr 32px}}
  `}));

  function boot(){inject();registerRuntime();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
