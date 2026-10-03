(()=>{
'use strict';

/* CSS Builder Phase 2 — Animation Studio UX
   Additive refinement: keeps css-builder-phase2-animation-studio.js intact and
   replaces only its visible editor with a more practical timeline workflow.
*/
const P=window.CVB_PHASE2;
if(!P)return;
P.version='2.23-ux';
const VB=window.CVB_VISUAL_EDITORS||{};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const core=()=>window.CVB_CORE_API||null;
const target=()=>core()?.getActiveSelector?.()||$('controlSelector')?.textContent?.trim()||null;

function model(){
  const key=target()||'body';
  if(!P.animations.has(key))P.animations.set(key,{name:'cvb-animation',duration:1000,timing:'ease',iteration:'1',direction:'normal',fill:'both',frames:[
    {p:0,transform:'translateX(-40px) scale(.94)',opacity:0,color:'',backgroundColor:''},
    {p:50,transform:'translateX(8px) scale(1.02)',opacity:.8,color:'',backgroundColor:''},
    {p:100,transform:'translateX(0) scale(1)',opacity:1,color:'',backgroundColor:''}
  ]});
  const a=P.animations.get(key);
  a.frames=(a.frames||[]).map(f=>({p:Math.max(0,Math.min(100,Number(f.p)||0)),transform:String(f.transform||'none'),opacity:f.opacity===''?'':Math.max(0,Math.min(1,Number(f.opacity??1))),color:String(f.color||''),backgroundColor:String(f.backgroundColor||'')})).sort((x,y)=>x.p-y.p);
  if(a.frames.length<2)a.frames=[{p:0,transform:'none',opacity:1,color:'',backgroundColor:''},{p:100,transform:'none',opacity:1,color:'',backgroundColor:''}];
  return a;
}
function cleanName(v){return (String(v||'cvb-animation').trim().replace(/[^a-zA-Z0-9_-]/g,'-')||'cvb-animation');}
function css(a){
  const body=a.frames.map(f=>{
    const lines=[`    transform: ${f.transform||'none'};`];
    if(f.opacity!=='')lines.push(`    opacity: ${f.opacity};`);
    if(f.color)lines.push(`    color: ${f.color};`);
    if(f.backgroundColor)lines.push(`    background-color: ${f.backgroundColor};`);
    return `  ${f.p}% {\n${lines.join('\n')}\n  }`;
  }).join('\n');
  return `@keyframes ${cleanName(a.name)} {\n${body}\n}`;
}
function shorthand(a){
  const it=String(a.iteration||'1').trim()||'1';
  return `${cleanName(a.name)} ${Math.max(1,Number(a.duration)||1000)}ms ${a.timing||'ease'} ${it} ${a.direction||'normal'} ${a.fill||'both'}`;
}
function fullCss(a){return `${css(a)}\n\n${target()||'body'} {\n  animation: ${shorthand(a)};\n}`;}
function parseTransform(v){
  const s=String(v||'');
  const tx=Number((s.match(/translate(?:3d|x|)\(\s*(-?[\d.]+)px/i)||[])[1]||0);
  const tyMatch=s.match(/translate3d\([^,]+,\s*(-?[\d.]+)px/i);
  const tyY=s.match(/translateY\(\s*(-?[\d.]+)px/i);
  const ty=Number(tyMatch?.[1]||tyY?.[1]||0);
  const sc=s.match(/scale\(\s*([\d.]+)(?:\s*,\s*([\d.]+))?/i);
  const rz=Number((s.match(/rotate(?:Z)?\(\s*(-?[\d.]+)deg/i)||[])[1]||0);
  return {tx:Number.isFinite(tx)?tx:0,ty:Number.isFinite(ty)?ty:0,sx:Number(sc?.[1]||1),sy:Number(sc?.[2]||sc?.[1]||1),rz:Number.isFinite(rz)?rz:0};
}
function transformFrom(t){
  return `translate3d(${Math.round(t.tx)}px, ${Math.round(t.ty)}px, 0px) rotateZ(${Math.round(t.rz)}deg) scale(${Number(t.sx).toFixed(2).replace(/\.00$/,'')}, ${Number(t.sy).toFixed(2).replace(/\.00$/,'')})`;
}
function applyBuilder(a){
  const sel=target();if(!sel)return;
  const api=core();
  api?.setProperty?.(sel,'animation',shorthand(a),true,false);
  api?.setKeyframes?.(sel,a.name,a.frames);
  api?.updateCssAndPreview?.();
  const st=$('previewStatus');if(st)st.textContent=`Animation · ${sel} · ${cleanName(a.name)}`;
}
function post(action,a){
  window.postMessage({type:'cvb-phase2-animation',action,selector:target()||'body',css:css(a),animation:shorthand(a)},'*');
}
function ensureRuntime(){return window.CVB_PHASE_RUNTIME||null;}
function render(){
  const host=$('cvbPhase2');if(!host)return;
  const a=model();
  const active=Math.max(0,Math.min(a.frames.length-1,P._activeFrame??0));
  P._activeFrame=active;
  const f=a.frames[active]||a.frames[0];
  const t=parseTransform(f.transform);
  host.innerHTML=`
  <div class="cvb-p2ux-head">
    <div><h2>22. Animation Studio</h2><span>${esc(target()||'body')} · costruisci, prova, applica</span></div>
    <div class="cvb-p2ux-head-actions">
      <select id="cvbP2uxPreset"><option value="">Preset…</option><option value="fade">Dissolvenza</option><option value="slide">Scivola</option><option value="pop">Pop</option><option value="bounce">Rimbalzo</option></select>
    </div>
  </div>
  <div class="cvb-p2ux-help"><b>Come si usa:</b> clicca la timeline per scegliere un fotogramma, trascinalo per spostarlo e modifica sotto cosa deve fare in quel momento.</div>
  <div class="cvb-p2ux-timeline" id="cvbP2uxTimeline">
    <div class="cvb-p2ux-track"><div class="cvb-p2ux-progress" style="width:${f.p}%"></div>${a.frames.map((x,i)=>`<button type="button" class="cvb-p2ux-key ${i===active?'active':''}" style="left:${x.p}%" data-frame="${i}" title="${x.p}%"></button>`).join('')}</div>
    <div class="cvb-p2ux-ruler"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
  </div>
  <div class="cvb-p2ux-framebar"><strong>Fotogramma ${f.p}%</strong><span>Trascina il punto sopra oppure usa la posizione.</span><input id="cvbP2uxPercent" type="number" min="0" max="100" value="${f.p}"><button type="button" id="cvbP2uxDelete" ${a.frames.length<=2?'disabled':''}>Elimina</button></div>
  <div class="cvb-p2ux-grid">
    <div class="cvb-p2ux-card"><h3>Movimento</h3><div class="cvb-p2ux-fields"><label>X (px)<input id="cvbP2uxX" type="number" value="${t.tx}"></label><label>Y (px)<input id="cvbP2uxY" type="number" value="${t.ty}"></label><label>Scala<input id="cvbP2uxScale" type="number" min="0" max="4" step=".05" value="${t.sx}"></label><label>Rotazione<input id="cvbP2uxRotate" type="number" min="-360" max="360" value="${t.rz}"></label></div><button type="button" class="secondary-button" id="cvbP2uxResetMotion">Reset movimento</button></div>
    <div class="cvb-p2ux-card"><h3>Aspetto</h3><div class="cvb-p2ux-fields"><label>Opacità<input id="cvbP2uxOpacity" type="number" min="0" max="1" step=".05" value="${f.opacity===''?1:f.opacity}"></label><label>Colore testo<input id="cvbP2uxColor" type="text" value="${esc(f.color)}" placeholder="#222222"></label><label>Sfondo<input id="cvbP2uxBg" type="text" value="${esc(f.backgroundColor)}" placeholder="#ffffff"></label></div><p class="hint">Lascia colore/sfondo vuoti per non animarli.</p></div>
  </div>
  <div class="cvb-p2ux-settings"><label>Nome<input id="cvbP2uxName" value="${esc(a.name)}"></label><label>Durata (ms)<input id="cvbP2uxDuration" type="number" min="50" max="60000" step="50" value="${a.duration}"></label><label>Easing<select id="cvbP2uxTiming"><option>ease</option><option>linear</option><option>ease-in</option><option>ease-out</option><option>ease-in-out</option><option>cubic-bezier(.2,.8,.2,1)</option><option>cubic-bezier(.34,1.56,.64,1)</option></select></label><label>Ripetizioni<input id="cvbP2uxIteration" value="${esc(a.iteration)}" placeholder="1 / 2 / infinite"></label><label>Direzione<select id="cvbP2uxDirection"><option>normal</option><option>reverse</option><option>alternate</option><option>alternate-reverse</option></select></label><label>Riempimento<select id="cvbP2uxFill"><option>none</option><option>forwards</option><option>backwards</option><option>both</option></select></label></div>
  <div class="cvb-p2ux-actions"><button type="button" id="cvbP2uxAdd">+ Aggiungi keyframe</button><button type="button" id="cvbP2uxPlay" class="primary">▶ Prova</button><button type="button" id="cvbP2uxPause">⏸ Pausa</button><button type="button" id="cvbP2uxStop">■ Stop</button><button type="button" id="cvbP2uxApply">✓ Applica al CSS</button><button type="button" id="cvbP2uxCopy">Copia CSS</button></div>
  <details class="cvb-p2ux-code"><summary>Mostra CSS generato</summary><pre id="cvbP2uxCode"></pre></details>`;
  $('cvbP2uxTiming').value=a.timing;$('cvbP2uxDirection').value=a.direction;$('cvbP2uxFill').value=a.fill;
  $('cvbP2uxCode').textContent=fullCss(a);

  const saveFrame=()=>{
    const a=model(),i=P._activeFrame,frame=a.frames[i];if(!frame)return;
    frame.transform=transformFrom({tx:num($('cvbP2uxX')?.value),ty:num($('cvbP2uxY')?.value),sx:num($('cvbP2uxScale')?.value,1),sy:num($('cvbP2uxScale')?.value,1),rz:num($('cvbP2uxRotate')?.value)});
    frame.opacity=Number($('cvbP2uxOpacity')?.value??1);
    frame.color=$('cvbP2uxColor')?.value||'';frame.backgroundColor=$('cvbP2uxBg')?.value||'';
    a.name=$('cvbP2uxName')?.value||a.name;a.duration=Math.max(50,Number($('cvbP2uxDuration')?.value)||1000);a.iteration=$('cvbP2uxIteration')?.value||'1';a.timing=$('cvbP2uxTiming')?.value||'ease';a.direction=$('cvbP2uxDirection')?.value||'normal';a.fill=$('cvbP2uxFill')?.value||'both';
    a.frames[i].p=Math.max(0,Math.min(100,Number($('cvbP2uxPercent')?.value)||0));a.frames.sort((x,y)=>x.p-y.p);
    P._activeFrame=Math.max(0,a.frames.findIndex(x=>x===frame));
    $('cvbP2uxCode').textContent=fullCss(a);
  };
  host.oninput=e=>{if(['cvbP2uxX','cvbP2uxY','cvbP2uxScale','cvbP2uxRotate','cvbP2uxOpacity','cvbP2uxColor','cvbP2uxBg','cvbP2uxName','cvbP2uxDuration','cvbP2uxIteration','cvbP2uxPercent'].includes(e.target.id)){saveFrame();}};
  host.onchange=e=>{if(['cvbP2uxTiming','cvbP2uxDirection','cvbP2uxFill'].includes(e.target.id)){const a=model();a[e.target.id.replace('cvbP2ux','').replace(/^./,x=>x.toLowerCase())]=e.target.value;render();}};
  host.onclick=e=>{
    const k=e.target.closest('[data-frame]');
    if(k){P._activeFrame=Number(k.dataset.frame);render();return;}
    if(e.target.id==='cvbP2uxAdd'){
      const a=model(),before=a.frames[P._activeFrame]||a.frames[a.frames.length-1],p=Math.min(100,Number(before.p)+Math.max(5,Math.round((100-Number(before.p))/2)));
      a.frames.push({p,transform:before.transform,opacity:before.opacity,color:before.color||'',backgroundColor:before.backgroundColor||''});a.frames.sort((x,y)=>x.p-y.p);P._activeFrame=a.frames.findIndex(x=>x.p===p);render();return;
    }
    if(e.target.id==='cvbP2uxDelete'){const a=model();if(a.frames.length>2){a.frames.splice(P._activeFrame,1);P._activeFrame=Math.max(0,Math.min(P._activeFrame,a.frames.length-1));render();}return;}
    if(e.target.id==='cvbP2uxResetMotion'){$('cvbP2uxX').value=0;$('cvbP2uxY').value=0;$('cvbP2uxScale').value=1;$('cvbP2uxRotate').value=0;saveFrame();return;}
    if(e.target.id==='cvbP2uxPreset'){preset(e.target.value);return;}
    if(e.target.id==='cvbP2uxPlay')post('play',model());
    if(e.target.id==='cvbP2uxPause')post('pause',model());
    if(e.target.id==='cvbP2uxStop')post('stop',model());
    if(e.target.id==='cvbP2uxApply'){const a=model();applyBuilder(a);post('play',a);}
    if(e.target.id==='cvbP2uxCopy')navigator.clipboard?.writeText(fullCss(model()));
  };
  enableTimelineDrag(host);
}
function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d;}
function preset(v){const a=model();if(v==='fade')a.frames=[{p:0,transform:'none',opacity:0,color:'',backgroundColor:''},{p:100,transform:'none',opacity:1,color:'',backgroundColor:''}];if(v==='slide')a.frames=[{p:0,transform:'translate3d(-70px,0,0) scale(1)',opacity:0,color:'',backgroundColor:''},{p:100,transform:'translate3d(0,0,0) scale(1)',opacity:1,color:'',backgroundColor:''}];if(v==='pop')a.frames=[{p:0,transform:'scale(.72)',opacity:0,color:'',backgroundColor:''},{p:65,transform:'scale(1.06)',opacity:1,color:'',backgroundColor:''},{p:100,transform:'scale(1)',opacity:1,color:'',backgroundColor:''}];if(v==='bounce')a.frames=[{p:0,transform:'translateY(-38px)',opacity:0,color:'',backgroundColor:''},{p:35,transform:'translateY(10px)',opacity:1,color:'',backgroundColor:''},{p:60,transform:'translateY(-8px)',opacity:1,color:'',backgroundColor:''},{p:100,transform:'translateY(0)',opacity:1,color:'',backgroundColor:''}];if(v){P._activeFrame=0;render();}}
function enableTimelineDrag(host){
  const track=$('cvbP2uxTimeline')?.querySelector('.cvb-p2ux-track');if(!track)return;
  let idx=null;
  const move=e=>{if(idx===null)return;const a=model(),rect=track.getBoundingClientRect();const p=Math.max(0,Math.min(100,Math.round((e.clientX-rect.left)/rect.width*100)));a.frames[idx].p=p;a.frames.sort((x,y)=>x.p-y.p);P._activeFrame=a.frames.findIndex(f=>f.p===p);render();};
  track.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-frame]');if(!b)return;idx=Number(b.dataset.frame);track.setPointerCapture?.(e.pointerId);e.preventDefault();});
  track.addEventListener('pointermove',move);track.addEventListener('pointerup',()=>{idx=null});track.addEventListener('pointercancel',()=>{idx=null});
}
function watchSelection(){
  const el=$('controlSelector');if(!el||el.__cvbP2Watch)return;el.__cvbP2Watch=true;
  let old=el.textContent;setInterval(()=>{const cur=el.textContent;if(cur!==old){old=cur;P._activeFrame=0;render();}},180);
}
function patchRuntimePause(){
  const rt=ensureRuntime();if(!rt||rt.__cvbP2UxPause)return;
  rt.__cvbP2UxPause=true;
  rt.register(()=>({body:`<script>(function(){window.addEventListener('message',function(e){var d=e.data;if(!d||d.type!=='cvb-phase2-animation'||!d.action)return;try{var nodes=document.querySelectorAll('[data-cvb-phase2-anim]');if(d.action==='pause')nodes.forEach(function(el){el.style.animationPlayState='paused';});if(d.action==='play')nodes.forEach(function(el){el.style.animationPlayState='running';});}catch(_){} });})();<\/script>`}));
}
function inject(){
  const host=$('cvbPhase2');if(!host)return;
  patchRuntimePause();watchSelection();render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
