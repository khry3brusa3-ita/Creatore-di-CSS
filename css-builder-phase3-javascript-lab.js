(()=>{
'use strict';
const P3=window.CVB_PHASE3=window.CVB_PHASE3||{version:'2.19',code:`// Esempio\nconst box = document.querySelector('.card');\nif (box) box.style.outline = '3px solid #6ea8ff';`};
P3.version='2.19';
const $=id=>document.getElementById(id);
const runtime=()=>window.CVB_PHASE_RUNTIME;
function inject(){
  if($('cvbPhase3'))return;const c=$('controls');if(!c)return;
  const s=document.createElement('section');s.className='panel-section visual-editor-section';s.id='cvbPhase3';
  s.innerHTML=`<div class="cvb-p3-head"><div><h2>20. JavaScript Lab</h2><span>solo nella preview</span></div><button type="button" id="cvbP3Format">Formato</button></div><p class="hint">Il codice viene eseguito esclusivamente dentro l'iframe della preview. <code>document</code>, <code>window</code> e il DOM sono quelli della pagina visualizzata.</p><textarea id="cvbP3Editor" class="cvb-p3-editor" spellcheck="false"></textarea><div class="cvb-p3-actions"><button type="button" id="cvbP3Run" class="primary">▶ Esegui</button><button type="button" id="cvbP3Stop">↻ Reset preview</button><button type="button" id="cvbP3Clear">Pulisci console</button></div><div class="cvb-p3-console" id="cvbP3Console"><span>Console pronta.</span></div>`;
  c.appendChild(s);$('cvbP3Editor').value=P3.code;
  $('cvbP3Run').onclick=run;$('cvbP3Stop').onclick=()=>runtime()?.refresh();$('cvbP3Clear').onclick=()=>{$('cvbP3Console').innerHTML='<span>Console pulita.</span>';};$('cvbP3Format').onclick=()=>{const e=$('cvbP3Editor');e.value=e.value.split('\n').map(x=>x.trim()).join('\n');P3.code=e.value;};
}
function consoleLine(text,kind='log'){const c=$('cvbP3Console');if(!c)return;const d=document.createElement('div');d.className='cvb-console-'+kind;d.textContent=text;c.appendChild(d);c.scrollTop=c.scrollHeight;}
function run(){P3.code=$('cvbP3Editor')?.value||'';consoleLine('▶ Esecuzione...');window.postMessage({type:'cvb-phase3-js',code:P3.code},'*');}
const rt=runtime();
rt?.register(()=>({body:`<script>(function(){window.addEventListener('message',function(e){var d=e.data;if(!d||d.type!=='cvb-phase3-js')return;var send=function(kind,args){try{parent.postMessage({type:'cvb-phase3-console',entry:[kind,args.map(function(x){try{return typeof x==='string'?x:JSON.stringify(x);}catch(_){return String(x);}}).join(' ') ]},'*');}catch(_){}};var c={log:function(){send('log',Array.prototype.slice.call(arguments));},info:function(){send('log',Array.prototype.slice.call(arguments));},warn:function(){send('warn',Array.prototype.slice.call(arguments));},error:function(){send('error',Array.prototype.slice.call(arguments));}};try{(new Function('console','"use strict";\\n'+String(d.code||'')))(c);parent.postMessage({type:'cvb-phase3-console',entry:['log','✓ Esecuzione completata']},'*');}catch(err){parent.postMessage({type:'cvb-phase3-console',entry:['error',(err&&err.name?err.name+': ':'')+(err&&err.message?err.message:String(err))]},'*');}});})();<\/script>`}));
window.addEventListener('message',e=>{if(e.data?.type==='cvb-phase3-console'&&Array.isArray(e.data.entry))consoleLine(e.data.entry[1],e.data.entry[0]);});
document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`.cvb-p3-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.cvb-p3-head h2{margin:0;font-size:14px}.cvb-p3-head span{font-size:10px;color:var(--muted)}.cvb-p3-editor{width:100%;height:230px;margin-top:8px;padding:10px;border:1px solid var(--border);border-radius:8px;background:#0b1017;color:#dbe7ff;font:12px/1.45 ui-monospace,monospace;resize:vertical}.cvb-p3-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.cvb-p3-console{margin-top:8px;min-height:70px;max-height:180px;overflow:auto;padding:8px;border:1px solid var(--border);border-radius:8px;background:#080b10;font:10px/1.45 ui-monospace,monospace}.cvb-console-error{color:#ff9a9a}.cvb-console-warn{color:#ffd28a}.cvb-console-log{color:#cfe0ff}`}));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
