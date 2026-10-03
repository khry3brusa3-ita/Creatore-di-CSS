(()=>{
'use strict';
const VB2=window.CVB_PHASE2=window.CVB_PHASE2||{version:'2.19',animations:new Map(),active:null};
VB2.version='2.19';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const core=()=>window.CVB_CORE_API||null;

const target=()=>core().getActiveSelector?.()||$('controlSelector')?.textContent?.trim()||null;
function ensureRuntime(){
  if(window.CVB_PHASE_RUNTIME)return window.CVB_PHASE_RUNTIME;
  const proto=HTMLIFrameElement.prototype;
  const original=Object.getOwnPropertyDescriptor(proto,'srcdoc');
  const rt={extras:[],register(fn){if(typeof fn==='function'&&!this.extras.includes(fn))this.extras.push(fn);},refresh(){core().updateCssAndPreview?.();}};
  if(original?.set){
    Object.defineProperty(proto,'srcdoc',{configurable:original.configurable,enumerable:original.enumerable,get:original.get,set(v){
      let html=String(v??'');
      if(this.id==='previewFrame'){
        let head='',body='';
        rt.extras.forEach(fn=>{try{const out=fn()||{};head+=out.head||'';body+=out.body||'';}catch(err){console.error('CVB runtime extension',err);}});
        if(head)html=html.replace('</head>',head+'</head>');
        if(body)html=html.replace('</body>',body+'</body>');
      }
      return original.set.call(this,html);
    }});
  }
  window.CVB_PHASE_RUNTIME=rt;return rt;
}
const runtime=ensureRuntime();
function selectedAnimation(){
  const k=target()||'body';
  if(!VB2.animations.has(k))VB2.animations.set(k,{name:'cvb-animation',duration:1000,timing:'ease',iteration:'1',direction:'normal',fill:'both',frames:[
    {p:0,transform:'translateX(-40px) scale(.94)',opacity:0},
    {p:50,transform:'translateX(8px) scale(1.02)',opacity:.8},
    {p:100,transform:'translateX(0) scale(1)',opacity:1}
  ]});
  return VB2.animations.get(k);
}
function normalize(a){
  a.frames=(a.frames||[]).map(f=>({p:Math.max(0,Math.min(100,Number(f.p)||0)),transform:String(f.transform||'none'),opacity:f.opacity===''?'1':Math.max(0,Math.min(1,Number(f.opacity??1)))})).sort((x,y)=>x.p-y.p);
  if(!a.frames.length)a.frames=[{p:0,transform:'none',opacity:1},{p:100,transform:'none',opacity:1}];
}
function css(a){
  normalize(a);
  const name=(String(a.name||'cvb-animation').replace(/[^a-zA-Z0-9_-]/g,'-')||'cvb-animation');
  const frames=a.frames.map(f=>`  ${f.p}% {\n    transform: ${f.transform||'none'};\n    opacity: ${f.opacity===''?'1':f.opacity};\n  }`).join('\n');
  return `@keyframes ${name} {\n${frames}\n}\n`;
}
function animationShorthand(a){
  const name=(String(a.name||'cvb-animation').replace(/[^a-zA-Z0-9_-]/g,'-')||'cvb-animation');
  return `${name} ${Math.max(1,Number(a.duration)||1000)}ms ${a.timing||'ease'} ${Math.max(1,Number(a.iteration)||1)} ${a.direction||'normal'} ${a.fill||'both'}`;
}
function fullCss(a){
  return `${css(a)}${target()||'body'} {\n  animation: ${animationShorthand(a)};\n}`;
}
function frameRows(a){
  return a.frames.map((f,i)=>`<div class="cvb-a-row"><span>${f.p}%</span><input type="text" value="${esc(f.transform)}" data-ai="${i}" data-ak="transform"><input type="number" min="0" max="1" step=".05" value="${f.opacity}" data-ai="${i}" data-ak="opacity"><button type="button" data-arm="${i}">×</button></div>`).join('');
}
function render(){
  const host=$('cvbPhase2');if(!host)return;
  const a=selectedAnimation();normalize(a);
  host.innerHTML=`<div class="cvb-p2-head"><div><h2>19. Animation Studio</h2><span>Timeline · keyframe · preview</span></div><select id="cvbP2Preset"><option value="">Preset…</option><option value="fade">Fade</option><option value="slide">Slide</option><option value="pop">Pop</option><option value="bounce">Bounce</option></select></div>
  <p class="hint">Costruisci l'animazione passo passo. Il pulsante Prova la esegue nella preview; il CSS generato resta visibile per imparare la sintassi.</p>
  <div class="cvb-p2-timeline"><div class="cvb-p2-line">${a.frames.map(f=>`<button type="button" style="left:${f.p}%" title="${f.p}%"></button>`).join('')}</div></div>
  <div class="cvb-p2-fields"><label>Nome<input id="cvbP2Name" value="${esc(a.name)}"></label><label>Durata (ms)<input id="cvbP2Duration" type="number" min="1" value="${a.duration}"></label><label>Easing<select id="cvbP2Timing"><option>ease</option><option>linear</option><option>ease-in</option><option>ease-out</option><option>ease-in-out</option></select></label><label>Ripetizioni<input id="cvbP2Iteration" value="${esc(a.iteration)}"></label><label>Direzione<select id="cvbP2Direction"><option>normal</option><option>reverse</option><option>alternate</option><option>alternate-reverse</option></select></label><label>Fill<select id="cvbP2Fill"><option>none</option><option>forwards</option><option>backwards</option><option>both</option></select></label></div>
  <div class="cvb-p2-frames"><div class="cvb-p2-frame-head"><b>Frame</b><b>Transform</b><b>Opacità</b><b></b></div>${frameRows(a)}</div>
  <div class="cvb-p2-actions"><button type="button" id="cvbP2Add">+ Keyframe</button><button type="button" id="cvbP2Play" class="primary">▶ Riproduci</button><button type="button" id="cvbP2Stop">■ Ferma</button><button type="button" id="cvbP2Apply">✓ Applica animation</button><button type="button" id="cvbP2Copy">Copia CSS</button></div>
  <pre id="cvbP2Code" class="cvb-p2-code"></pre>`;
  $('cvbP2Timing').value=a.timing;$('cvbP2Direction').value=a.direction;$('cvbP2Fill').value=a.fill;drawCode();
  host.oninput=e=>{const a=selectedAnimation();if(e.target.id==='cvbP2Name')a.name=e.target.value;if(e.target.id==='cvbP2Duration')a.duration=Math.max(1,Number(e.target.value)||1);if(e.target.id==='cvbP2Iteration')a.iteration=e.target.value;const i=e.target.dataset.ai;if(i!==undefined){const frame=a.frames[Number(i)];if(frame)frame[e.target.dataset.ak]=e.target.dataset.ak==='opacity'?e.target.value:e.target.value;}drawCode();};
  host.onchange=e=>{const a=selectedAnimation();if(e.target.id==='cvbP2Timing')a.timing=e.target.value;if(e.target.id==='cvbP2Direction')a.direction=e.target.value;if(e.target.id==='cvbP2Fill')a.fill=e.target.value;drawCode();};
  host.onclick=e=>{
    const r=e.target.closest('[data-arm]');if(r){const a=selectedAnimation();if(a.frames.length>2)a.frames.splice(Number(r.dataset.arm),1);render();return;}
    if(e.target.id==='cvbP2Add'){const a=selectedAnimation(),last=a.frames[a.frames.length-1],p=Math.min(100,(last?.p??75)+25);a.frames.push({p,transform:last?.transform||'none',opacity:last?.opacity??1});normalize(a);render();return;}
    if(e.target.id==='cvbP2Preset'){applyPreset(e.target.value);return;}
    if(e.target.id==='cvbP2Play')play();
    if(e.target.id==='cvbP2Stop')stop();
    if(e.target.id==='cvbP2Apply')applyToBuilder();
    if(e.target.id==='cvbP2Copy')navigator.clipboard?.writeText(fullCss(selectedAnimation()));
  };
}
function drawCode(){const el=$('cvbP2Code');if(el)el.textContent=fullCss(selectedAnimation());}
function applyPreset(p){const a=selectedAnimation();if(p==='fade')a.frames=[{p:0,transform:'none',opacity:0},{p:100,transform:'none',opacity:1}];if(p==='slide')a.frames=[{p:0,transform:'translateX(-60px)',opacity:0},{p:100,transform:'translateX(0)',opacity:1}];if(p==='pop')a.frames=[{p:0,transform:'scale(.7)',opacity:0},{p:70,transform:'scale(1.06)',opacity:1},{p:100,transform:'scale(1)',opacity:1}];if(p==='bounce')a.frames=[{p:0,transform:'translateY(-35px)',opacity:0},{p:35,transform:'translateY(8px)',opacity:1},{p:60,transform:'translateY(-8px)',opacity:1},{p:100,transform:'translateY(0)',opacity:1}];if(p)render();}
function play(){const a=selectedAnimation();window.postMessage({type:'cvb-phase2-animation',action:'play',selector:target()||'body',css:css(a),animation:animationShorthand(a)},'*');}
function stop(){window.postMessage({type:'cvb-phase2-animation',action:'stop'},'*');}
function applyToBuilder(){
  const sel=target();if(!sel)return;
  const a=selectedAnimation();
  const api=core();
  api?.setProperty?.(sel,'animation',animationShorthand(a),true,false);
  api?.setKeyframes?.(sel,a.name,a.frames);
  api?.renderControls?.();api?.updateCssAndPreview?.();
  const st=$('previewStatus');if(st)st.textContent=`Animation · ${sel} · ${a.name}`;
  play();
}
function inject(){if($('cvbPhase2'))return;const c=$('controls');if(!c)return;const s=document.createElement('section');s.className='panel-section visual-editor-section';s.id='cvbPhase2';c.appendChild(s);render();}
runtime.register(()=>({body:`<script>(function(){window.addEventListener('message',function(e){var d=e.data;if(!d||d.type!=='cvb-phase2-animation')return;try{var old=document.getElementById('__cvb_phase2_style');if(old)old.remove();if(d.action==='stop'){document.querySelectorAll('[data-cvb-phase2-anim]').forEach(function(el){el.style.removeProperty('animation');el.removeAttribute('data-cvb-phase2-anim');});return;}var st=document.createElement('style');st.id='__cvb_phase2_style';st.textContent=d.css;document.head.appendChild(st);var el=document.querySelector(d.selector||'body');if(el){el.setAttribute('data-cvb-phase2-anim','1');el.style.animation='';requestAnimationFrame(function(){el.style.animation=d.animation||'';});}}catch(err){parent.postMessage({type:'cvb-phase2-error',message:err.message||String(err)},'*');}});})();<\/script>`}));
window.addEventListener('message',e=>{if(e.data?.type==='cvb-phase2-error'){const st=$('previewStatus');if(st)st.textContent='Animation error · '+e.data.message;}});
document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`.cvb-p2-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.cvb-p2-head h2{margin:0;font-size:14px}.cvb-p2-head span{font-size:10px;color:var(--muted)}.cvb-p2-timeline{margin:10px 0}.cvb-p2-line{height:18px;position:relative;border-radius:8px;background:linear-gradient(90deg,#222c3b,#303a4d);border:1px solid var(--border)}.cvb-p2-line button{position:absolute;top:50%;width:12px;height:12px;padding:0;border-radius:50%;transform:translate(-50%,-50%);background:var(--accent);border:2px solid #fff}.cvb-p2-fields{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.cvb-p2-fields label{display:grid;gap:4px;font-size:9px;color:var(--muted)}.cvb-p2-fields input,.cvb-p2-fields select{width:100%;padding:7px;border:1px solid var(--border);border-radius:7px;background:var(--input);color:var(--text)}.cvb-p2-frames{margin-top:9px;border:1px solid var(--border);border-radius:8px;overflow:auto}.cvb-p2-frame-head,.cvb-a-row{display:grid;grid-template-columns:45px minmax(150px,1fr) 85px 34px;gap:6px;align-items:center;padding:6px;border-bottom:1px solid var(--border);font-size:9px;color:var(--muted);min-width:330px}.cvb-a-row input{width:100%;padding:7px;border:1px solid var(--border);border-radius:7px;background:var(--input);color:var(--text)}.cvb-p2-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.cvb-p2-code{margin:8px 0 0;max-height:220px;overflow:auto;padding:8px;background:#10151e;border:1px dashed var(--border);border-radius:8px;color:#cfe0ff;font-size:10px}@media(max-width:700px){.cvb-p2-fields{grid-template-columns:1fr}}`}));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
