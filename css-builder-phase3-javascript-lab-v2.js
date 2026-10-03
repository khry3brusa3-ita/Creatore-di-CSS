(()=>{
  'use strict';

  const P3=window.CVB_PHASE3=window.CVB_PHASE3||{};
  P3.version='2.26';
  P3.code=P3.code||`// Prova a modificare un elemento e guarda subito la preview.\nconst titolo = document.querySelector('h1');\nif (titolo) {\n  titolo.textContent = 'Ciao dal JavaScript!';\n  titolo.style.color = '#4f8cff';\n}`;

  const $=id=>document.getElementById(id);
  const getRuntime=()=>window.CVB_PHASE_RUNTIME||null;
  let iframeReady=false;
  let pendingRun=null;
  let runSeq=0;

  const EXAMPLES={
    text:`// Cambia il testo del titolo\nconst titolo = document.querySelector('h1');\nif (titolo) titolo.textContent = 'Modificato con JavaScript';`,
    click:`// Aggiungi un comportamento al link\nconst link = document.querySelector('a');\nif (link) {\n  link.addEventListener('click', event => {\n    event.preventDefault();\n    console.log('Hai cliccato il collegamento!');\n  });\n}`,
    style:`// Cambia più proprietà insieme\nconst card = document.querySelector('.card');\nif (card) {\n  card.style.backgroundColor = '#eef5ff';\n  card.style.padding = '24px';\n  card.style.borderRadius = '16px';\n}`,
    timer:`// Esegui qualcosa dopo 1 secondo\nsetTimeout(() => {\n  const footer = document.querySelector('footer');\n  if (footer) footer.textContent = 'Aggiornato da JavaScript';\n  console.log('Timer completato');\n}, 1000);`
  };

  function inject(){
    let host=$('cvbPhase3');
    if(!host){
      const c=$('controls');
      if(!c) return;
      host=document.createElement('section');
      host.className='panel-section visual-editor-section';
      host.id='cvbPhase3';
      c.appendChild(host);
    }
    render(host);
    bind(host);
  }

  function render(host){
    host.innerHTML=`
      <div class="cvb-p3-head">
        <div>
          <h2>23. JavaScript Lab</h2>
          <span>scrivi → esegui → guarda la preview</span>
        </div>
        <select id="cvbP3Example" title="Carica un esempio">
          <option value="">Esempio…</option>
          <option value="text">Cambia testo</option>
          <option value="click">Evento click</option>
          <option value="style">Stile visuale</option>
          <option value="timer">Timer</option>
        </select>
      </div>

      <p class="hint">
        Il codice viene eseguito <strong>solo dentro la preview</strong>. Puoi usare il DOM normalmente: 
        <code>document</code>, <code>window</code>, <code>querySelector</code>, eventi, timer e API JavaScript del browser.
      </p>

      <div class="cvb-p3-howto">
        <div><b>1</b><span>Scrivi il codice</span></div>
        <div><b>2</b><span>Premi Esegui</span></div>
        <div><b>3</b><span>Guarda la preview a destra</span></div>
        <div><b>4</b><span>Ripristina per ripartire da zero</span></div>
      </div>

      <textarea id="cvbP3Editor" class="cvb-p3-editor" spellcheck="false" aria-label="Editor JavaScript"></textarea>

      <div class="cvb-p3-actions">
        <button type="button" id="cvbP3Run" class="primary">▶ Esegui</button>
        <button type="button" id="cvbP3Reset">↻ Ripristina preview</button>
        <button type="button" id="cvbP3Clear">Pulisci console</button>
        <button type="button" id="cvbP3Format">Formato base</button>
      </div>

      <details class="cvb-p3-help">
        <summary>Cosa puoi usare?</summary>
        <div class="cvb-p3-help-grid">
          <code>document.querySelector('h1')</code>
          <code>document.querySelectorAll('.card')</code>
          <code>console.log('ciao')</code>
          <code>element.style.color = 'red'</code>
          <code>element.addEventListener('click', fn)</code>
          <code>setTimeout(fn, 1000)</code>
          <code>setInterval(fn, 1000)</code>
        </div>
        <p class="hint">Puoi anche usare le scorciatoie <code>$('selettore')</code> e <code>$$('selettore')</code> nel codice per trovare rapidamente uno o più elementi.</p>
      </details>

      <div class="cvb-p3-console-head"><b>Console</b><span id="cvbP3Status">Pronta</span></div>
      <div class="cvb-p3-console" id="cvbP3Console"><div class="cvb-console-log">Console pronta.</div></div>`;
    $('cvbP3Editor').value=P3.code;
  }

  function bind(host){
    const editor=$('cvbP3Editor');
    $('cvbP3Run').onclick=run;
    $('cvbP3Reset').onclick=resetPreview;
    $('cvbP3Clear').onclick=()=>{$('cvbP3Console').innerHTML='<div class="cvb-console-log">Console pulita.</div>';};
    $('cvbP3Format').onclick=()=>{
      editor.value=editor.value.split('\n').map(line=>line.trimEnd()).join('\n').replace(/\n{3,}/g,'\n\n');
      P3.code=editor.value;
    };
    $('cvbP3Example').onchange=e=>{
      const value=EXAMPLES[e.target.value];
      if(value!==undefined){editor.value=value;P3.code=value;}
      e.target.value='';
    };
    host.addEventListener('keydown',e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){
        e.preventDefault();
        run();
      }
    });
  }

  function consoleLine(text,kind='log'){
    const c=$('cvbP3Console');
    if(!c) return;
    const d=document.createElement('div');
    d.className=`cvb-console-${kind}`;
    d.textContent=String(text);
    c.appendChild(d);
    c.scrollTop=c.scrollHeight;
  }

  function status(text){
    const el=$('cvbP3Status');
    if(el) el.textContent=text;
  }

  function formatArg(value){
    if(value instanceof Error) return `${value.name}: ${value.message}`;
    if(typeof value==='string') return value;
    if(typeof value==='undefined') return 'undefined';
    try{
      const json=JSON.stringify(value);
      return json===undefined?String(value):json;
    }catch(_){return String(value);}
  }

  function postToPreview(payload){
    const frame=$('previewFrame');
    if(!frame?.contentWindow) return false;
    frame.contentWindow.postMessage(payload,'*');
    return true;
  }

  function run(){
    const editor=$('cvbP3Editor');
    if(!editor) return;
    P3.code=editor.value||'';
    const seq=++runSeq;
    pendingRun={seq,code:P3.code};
    consoleLine('▶ Esecuzione richiesta…');
    status('In esecuzione…');
    if(iframeReady && postToPreview({type:'cvb-phase3-js',action:'run',seq,code:P3.code})) return;
    // Se la preview non è ancora pronta, una ricarica la riporta in uno stato noto.
    getRuntime()?.refresh?.();
  }

  function resetPreview(){
    pendingRun=null;
    iframeReady=false;
    runSeq++;
    status('Ripristino…');
    getRuntime()?.refresh?.();
  }

  function injectRuntime(){
    const rt=getRuntime();
    if(!rt?.register) return;
    if(P3.__runtimeRegistered) return;
    P3.__runtimeRegistered=true;
    rt.register(()=>({body:`<script>(function(){
      var ready=function(){try{parent.postMessage({type:'cvb-phase3-ready'},'*');}catch(_){}};
      var format=function(v){
        try{
          if(v instanceof Error) return v.name+': '+v.message;
          if(typeof v==='string') return v;
          if(typeof v==='undefined') return 'undefined';
          var j=JSON.stringify(v); return j===undefined?String(v):j;
        }catch(_){return String(v);}
      };
      var send=function(kind,args,seq){try{parent.postMessage({type:'cvb-phase3-console',entry:[kind,args.map(format).join(' '),seq]},'*');}catch(_){}};
      window.addEventListener('load',ready,{once:true});
      ready();
      window.addEventListener('message',async function(e){
        var d=e.data;if(!d||d.type!=='cvb-phase3-js'||d.action!=='run')return;
        var c={
          log:function(){send('log',Array.prototype.slice.call(arguments),d.seq);},
          info:function(){send('info',Array.prototype.slice.call(arguments),d.seq);},
          warn:function(){send('warn',Array.prototype.slice.call(arguments),d.seq);},
          error:function(){send('error',Array.prototype.slice.call(arguments),d.seq);},
          debug:function(){send('debug',Array.prototype.slice.call(arguments),d.seq);}
        };
        var $=function(selector){return document.querySelector(selector);};
        var $$=function(selector){return Array.prototype.slice.call(document.querySelectorAll(selector));};
        try{
          var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
          var fn=new AsyncFunction('console','$','$$','"use strict";\\n'+String(d.code||''));
          await fn(c,$,$$);
          parent.postMessage({type:'cvb-phase3-console',entry:['success','✓ Esecuzione completata',d.seq]},'*');
        }catch(err){
          parent.postMessage({type:'cvb-phase3-console',entry:['error',(err&&err.stack)?err.stack:(err&&err.name?err.name+': ':'')+(err&&err.message?err.message:String(err)),d.seq]},'*');
        }
      });
    })();<\/script>`}));
  }

  window.addEventListener('message',e=>{
    const d=e.data;
    if(!d) return;
    if(d.type==='cvb-phase3-ready'){
      iframeReady=true;
      status('Preview pronta');
      if(pendingRun){
        const p=pendingRun;
        pendingRun=null;
        postToPreview({type:'cvb-phase3-js',action:'run',seq:p.seq,code:p.code});
      }
      return;
    }
    if(d.type==='cvb-phase3-console'&&Array.isArray(d.entry)){
      const [kind,text,seq]=d.entry;
      if(seq!==undefined && seq<runSeq) return;
      const mapped=kind==='error'?'error':kind==='warn'?'warn':kind==='success'?'success':'log';
      consoleLine(text,mapped);
      status(mapped==='error'?'Errore nel codice':mapped==='success'?'Completato':'Eseguito');
    }
  });

  injectRuntime();
  document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`
    .cvb-p3-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.cvb-p3-head h2{margin:0;font-size:14px}.cvb-p3-head span{display:block;margin-top:2px;color:var(--muted);font-size:10px}.cvb-p3-head select{max-width:150px;padding:7px 8px;border:1px solid var(--border);border-radius:7px;background:var(--input);color:var(--text)}
    .cvb-p3-howto{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:9px 0}.cvb-p3-howto div{display:flex;align-items:center;gap:6px;padding:7px;border:1px solid var(--border);border-radius:8px;background:#10151e;font-size:9px;color:var(--muted)}.cvb-p3-howto b{display:grid;place-items:center;width:18px;height:18px;border-radius:50%;background:var(--accent);color:white;font-size:9px;flex:0 0 auto}.cvb-p3-editor{width:100%;height:280px;margin-top:8px;padding:11px;border:1px solid var(--border);border-radius:8px;background:#080c12;color:#dbe7ff;font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;resize:vertical;tab-size:2}.cvb-p3-editor:focus{outline:none;border-color:var(--accent)}
    .cvb-p3-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.cvb-p3-actions button{padding:7px 10px}
    .cvb-p3-help{margin-top:9px;padding:7px 9px;border:1px solid var(--border);border-radius:8px;background:#111722}.cvb-p3-help summary{cursor:pointer;font-size:10px;color:#dbe7ff}.cvb-p3-help-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.cvb-p3-help-grid code{display:block;padding:6px;border-radius:6px;background:#0b1017;color:#cfe0ff;font:10px ui-monospace,monospace;overflow:auto}.cvb-p3-console-head{display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-size:10px}.cvb-p3-console-head span{color:var(--muted)}.cvb-p3-console{margin-top:6px;min-height:82px;max-height:210px;overflow:auto;padding:8px;border:1px solid var(--border);border-radius:8px;background:#070a0e;font:10px/1.45 ui-monospace,monospace}.cvb-p3-console>div{padding:2px 0;white-space:pre-wrap;word-break:break-word}.cvb-console-error{color:#ff9c9c}.cvb-console-warn{color:#ffd48d}.cvb-console-info{color:#a9cbff}.cvb-console-debug{color:#9fb0c6}.cvb-console-success{color:#7be0a6}.cvb-console-log{color:#dbe7ff}
    @media(max-width:760px){.cvb-p3-howto{grid-template-columns:1fr 1fr}.cvb-p3-help-grid{grid-template-columns:1fr}}
  `}));

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{injectRuntime();inject();},{once:true}); else {injectRuntime();inject();}
})();
