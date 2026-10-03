(()=>{
  'use strict';
  const P5=window.CVB_PHASE5=window.CVB_PHASE5||{version:'2.29'};
  const $=id=>document.getElementById(id);
  const api=()=>window.CVB_CORE_API||{};
  const stateApi=()=>api().projectSnapshot?api():null;
  const download=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1200);};
  function save(){
    const source=stateApi()?.projectSnapshot;
    if(!source) return status('Salvataggio non disponibile');
    const data=source();
    download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'creatore-css-progetto-v2.29.json');
    status('Progetto JSON salvato');
  }
  async function loadFile(file){
    if(!file)return;
    try{
      const text=await file.text();
      const data=JSON.parse(text);
      if(data?.format!=='CVB_PROJECT') throw new Error('Il file non è un progetto CSS Builder valido.');
      api().loadProjectSnapshot(data);
      status(`Progetto caricato · ${data.version||'versione sconosciuta'}`);
    }catch(err){status('Errore JSON · '+(err?.message||String(err)));}
  }
  function status(msg){const e=$('cvbP5Status');if(e)e.textContent=msg;}
  function inject(){
    if($('cvbPhase5'))return;
    const host=document.querySelector('.controls-section')?.parentElement||$('controls')?.parentElement;
    if(!host)return;
    const s=document.createElement('section');
    s.className='panel-section visual-editor-section';
    s.id='cvbPhase5';
    s.innerHTML=`
      <div class="section-title-row"><div><h2>25. Progetto — Salva / Carica</h2><span>JSON · riprendi il lavoro</span></div><span class="counter" id="cvbP5Status">Pronto</span></div>
      <p class="hint">Salva HTML, CSS, selezione, impostazioni visuali, keyframe, JavaScript, risorse esterne e stato degli editor in un unico file JSON. Puoi ricaricarlo più avanti per continuare da dove avevi lasciato.</p>
      <div class="cvb-p5-actions">
        <button type="button" id="cvbP5Save" class="primary">⬇ Salva progetto JSON</button>
        <label class="cvb-p5-file">⬆ Carica progetto JSON<input id="cvbP5Load" type="file" accept="application/json,.json" hidden></label>
        <button type="button" id="cvbP5Copy">Copia JSON</button>
      </div>
      <details class="cvb-p5-details"><summary>Cosa viene conservato?</summary><p>HTML, regole CSS, pseudo-stati, selezione, layout, keyframe, editor visuali, Animation Studio, JavaScript Lab, risorse CDN e alcune impostazioni dell'interfaccia.</p></details>`;
    host.appendChild(s);
    $('cvbP5Save').onclick=save;
    $('cvbP5Load').addEventListener('change',e=>loadFile(e.target.files?.[0]));
    $('cvbP5Copy').onclick=async()=>{try{const d=api().projectSnapshot?.();await navigator.clipboard.writeText(JSON.stringify(d,null,2));status('JSON copiato');}catch(err){status('Copia non disponibile');}};
    const style=document.createElement('style');
    style.textContent=`#cvbPhase5 .cvb-p5-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}#cvbPhase5 .cvb-p5-file{display:inline-flex;align-items:center;border:1px solid var(--border);background:var(--panel-2);color:var(--text);border-radius:8px;padding:8px 11px;cursor:pointer}#cvbPhase5 .cvb-p5-details{margin-top:8px;border:1px dashed var(--border);border-radius:8px;padding:7px 9px;background:#10151e;color:var(--muted);font-size:10px}#cvbPhase5 .cvb-p5-details summary{cursor:pointer;color:var(--text);font-weight:600}#cvbPhase5 .cvb-p5-details p{margin:7px 0 2px;line-height:1.45}`;
    document.head.appendChild(style);
  }
  function boot(){inject();}
  window.CVB_PROJECT_JSON={save,loadFile,snapshot:()=>api().projectSnapshot?.()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
