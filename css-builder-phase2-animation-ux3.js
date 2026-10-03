(()=>{
'use strict';

/* CSS Builder Phase 2 — Animation Studio UX3
   Final workflow refinement for keyframes and preview playback.
   Supersedes the visible UI of phase2-animation-ux.js / ux2.js without
   modifying those historical modules.
*/
const P=window.CVB_PHASE2;
if(!P)return;
P.version='2.25-ux3';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const core=()=>window.CVB_CORE_API||null;
const target=()=>core()?.getActiveSelector?.()||$('controlSelector')?.textContent?.trim()||null;
const num=(v,d=0)=>{const n=Number(v);return Number.isFinite(n)?n:d;};

P._activeFrameId=P._activeFrameId||null;
P._frameSeq=Number(P._frameSeq)||0;

function newFrameId(){P._frameSeq+=1;return `kf-${Date.now().toString(36)}-${P._frameSeq}`;}
function ensureFrameIds(a){
  const seen=new Set();
  a.frames=(a.frames||[]).map(f=>{
    let id=String(f.id||'');
    if(!id||seen.has(id))id=newFrameId();
    seen.add(id);
    return {...f,id};
  });
}
function model(){
  const key=target()||'body';
  if(!P.animations.has(key))P.animations.set(key,{name:'cvb-animation',duration:1000,timing:'ease',iteration:'1',direction:'normal',fill:'both',frames:[
    {p:0,transform:'translateX(-40px) scale(.94)',opacity:0,color:'',backgroundColor:''},
    {p:50,transform:'translateX(8px) scale(1.02)',opacity:.8,color:'',backgroundColor:''},
    {p:100,transform:'translateX(0) scale(1)',opacity:1,color:'',backgroundColor:''}
  ]});
  const a=P.animations.get(key);
  ensureFrameIds(a);
  a.frames=a.frames.map(f=>({
    ...f,
    p:Math.max(0,Math.min(100,num(f.p,0))),
    transform:String(f.transform||'none'),
    opacity:f.opacity===''?'':Math.max(0,Math.min(1,num(f.opacity,1))),
    color:String(f.color||''),
    backgroundColor:String(f.backgroundColor||'')
  })).sort((x,y)=>x.p-y.p);
  if(a.frames.length<2)a.frames=[
    {id:newFrameId(),p:0,transform:'none',opacity:1,color:'',backgroundColor:''},
    {id:newFrameId(),p:100,transform:'none',opacity:1,color:'',backgroundColor:''}
  ];
  if(!P._activeFrameId||!a.frames.some(f=>f.id===P._activeFrameId))P._activeFrameId=a.frames[0].id;
  return a;
}
function activeFrame(a){
  const found=a.frames.find(f=>f.id===P._activeFrameId);
  if(found)return found;
  P._activeFrameId=a.frames[0]?.id||null;
  return a.frames[0];
}
function cleanName(v){return(String(v||'cvb-animation').trim().replace(/[^a-zA-Z0-9_-]/g,'-')||'cvb-animation');}
function css(a){
  const body=a.frames.map(f=>{
    const lines=[`    transform: ${f.transform||'none'};`];
    if(f.opacity!=='')lines.push(`    opacity: ${f.opacity};`);
    if(f.color)lines.push(`    color: ${f.color};`);
    if(f.backgroundColor)lines.push(`    background-color: ${f.backgroundColor};`);
    return `  ${Math.round(f.p)}% {\n${lines.join('\n')}\n  }`;
  }).join('\n');
  return `@keyframes ${cleanName(a.name)} {\n${body}\n}`;
}
function shorthand(a){
  const it=String(a.iteration||'1').trim()||'1';
  return `${cleanName(a.name)} ${Math.max(1,num(a.duration,1000))}ms ${a.timing||'ease'} ${it} ${a.direction||'normal'} ${a.fill||'both'}`;
}
function fullCss(a){return `${css(a)}\n\n${target()||'body'} {\n  animation: ${shorthand(a)};\n}`;}
function parseTransform(v){
  const s=String(v||'');
  const tx=Number((s.match(/translate3d\(\s*(-?[\d.]+)px\s*,/i)||s.match(/translateX\(\s*(-?[\d.]+)px/i)||[])[1]||0);
  const ty=Number((s.match(/translate3d\([^,]+,\s*(-?[\d.]+)px/i)||s.match(/translateY\(\s*(-?[\d.]+)px/i)||[])[1]||0);
  const sc=s.match(/scale\(\s*([\d.]+)(?:\s*,\s*([\d.]+))?/i);
  const rz=Number((s.match(/rotate(?:Z)?\(\s*(-?[\d.]+)deg/i)||[])[1]||0);
  return {tx:Number.isFinite(tx)?tx:0,ty:Number.isFinite(ty)?ty:0,sx:Number(sc?.[1]||1),sy:Number(sc?.[2]||sc?.[1]||1),rz:Number.isFinite(rz)?rz:0};
}
function transformFrom(t){
  const sx=num(t.sx,1).toFixed(2).replace(/\.00$/,'');
  const sy=num(t.sy,1).toFixed(2).replace(/\.00$/,'');
  return `translate3d(${Math.round(num(t.tx))}px, ${Math.round(num(t.ty))}px, 0px) rotateZ(${Math.round(num(t.rz))}deg) scale(${sx}, ${sy})`;
}
function colorHex(v){return /^#[0-9a-f]{6}$/i.test(String(v||''))?String(v):'#222222';}
function iterationOptions(value){
  const preset=['1','2','3','4','5','infinite'];
  const custom=!preset.includes(String(value));
  return `<option value="1">1 volta</option><option value="2">2 volte</option><option value="3">3 volte</option><option value="4">4 volte</option><option value="5">5 volte</option><option value="infinite">Infinite</option><option value="custom" ${custom?'selected':''}>Personalizzato</option>`;
}
function summary(f){
  const bits=[];
  if(f.transform&&f.transform!=='none')bits.push(f.transform);
  if(f.opacity!=='')bits.push(`opacità ${f.opacity}`);
  if(f.color)bits.push(`testo ${f.color}`);
  if(f.backgroundColor)bits.push(`sfondo ${f.backgroundColor}`);
  return bits.length?bits.join(' · '):'Nessuna modifica visiva';
}
function findFreePercent(a,desired,exceptId){
  const occupied=new Set(a.frames.filter(f=>f.id!==exceptId).map(f=>Math.round(f.p)));
  let p=Math.max(0,Math.min(100,Math.round(desired)));
  if(!occupied.has(p))return p;
  for(let d=1;d<=100;d++){
    const left=p-d,right=p+d;
    if(left>=0&&!occupied.has(left))return left;
    if(right<=100&&!occupied.has(right))return right;
  }
  return p;
}
function runtime(){return window.CVB_PHASE_RUNTIME||null;}
function ensurePreviewRuntime(){
  const rt=runtime();
  if(!rt||rt.__cvbP2Ux3Runtime)return;
  rt.__cvbP2Ux3Runtime=true;
  rt.register(()=>({body:`<script>(function(){var current=null;function clear(){if(current){current.style.removeProperty('animation');current.removeAttribute('data-cvb-phase2-anim');current=null;}var old=document.getElementById('__cvb_phase2_animation_ux3');if(old)old.remove();}window.addEventListener('message',function(e){var d=e.data;if(!d||d.type!=='cvb-phase2-animation')return;try{if(d.action==='stop'){clear();return;}if(d.action==='pause'){if(current)current.style.animationPlayState='paused';return;}if(d.action==='play'){clear();var st=document.createElement('style');st.id='__cvb_phase2_animation_ux3';st.textContent=d.css||'';document.head.appendChild(st);var el=document.querySelector(d.selector||'body');if(!el)return;current=el;el.setAttribute('data-cvb-phase2-anim','1');el.style.animation='none';el.style.animationPlayState='running';requestAnimationFrame(function(){el.style.animation=d.animation||'';el.style.animationPlayState='running';});}}catch(err){try{parent.postMessage({type:'cvb-phase2-error',message:err.message||String(err)},'*');}catch(_){}}});})();<\/script>`}));
}
function sendPreview(action,a){
  ensurePreviewRuntime();
  const frame=$('previewFrame');
  if(!frame)return;
  const payload={type:'cvb-phase2-animation',action,selector:target()||'body',css:css(a),animation:shorthand(a)};
  const send=()=>{try{frame.contentWindow?.postMessage(payload,'*');}catch(_){}};
  send();
  frame.addEventListener('load',send,{once:true});
}
function status(text){const st=$('previewStatus');if(st)st.textContent=text;}
function applyBuilder(a){
  const sel=target();if(!sel)return;
  const api=core();
  api?.setProperty?.(sel,'animation',shorthand(a),true,false);
  api?.setKeyframes?.(sel,a.name,a.frames);
  api?.updateCssAndPreview?.();
  status(`Animation applicata · ${sel} · ${cleanName(a.name)}`);
}
function preset(v){
  const a=model();
  const base=x=>({...x,id:newFrameId()});
  if(v==='fade')a.frames=[base({p:0,transform:'none',opacity:0,color:'',backgroundColor:''}),base({p:100,transform:'none',opacity:1,color:'',backgroundColor:''})];
  if(v==='slide')a.frames=[base({p:0,transform:'translate3d(-70px,0,0) scale(1)',opacity:0,color:'',backgroundColor:''}),base({p:100,transform:'translate3d(0,0,0) scale(1)',opacity:1,color:'',backgroundColor:''})];
  if(v==='pop')a.frames=[base({p:0,transform:'scale(.72)',opacity:0,color:'',backgroundColor:''}),base({p:65,transform:'scale(1.06)',opacity:1,color:'',backgroundColor:''}),base({p:100,transform:'scale(1)',opacity:1,color:'',backgroundColor:''})];
  if(v==='bounce')a.frames=[base({p:0,transform:'translateY(-38px)',opacity:0,color:'',backgroundColor:''}),base({p:35,transform:'translateY(10px)',opacity:1,color:'',backgroundColor:''}),base({p:60,transform:'translateY(-8px)',opacity:1,color:'',backgroundColor:''}),base({p:100,transform:'translateY(0)',opacity:1,color:'',backgroundColor:''})];
  if(v){P._activeFrameId=a.frames[0]?.id||null;render();}
}
function insertKeyframe(){
  const a=model(),cur=activeFrame(a);if(!cur)return;
  const sorted=a.frames.slice().sort((x,y)=>x.p-y.p);
  const idx=sorted.findIndex(x=>x.id===cur.id);
  let left,right;
  if(idx<sorted.length-1){left=cur;right=sorted[idx+1];}
  else if(idx>0){left=sorted[idx-1];right=cur;}
  else return;
  const p=findFreePercent(a,Math.round((left.p+right.p)/2),null);
  if(p===left.p||p===right.p)return;
  const f={id:newFrameId(),p,transform:cur.transform,opacity:cur.opacity,color:cur.color||'',backgroundColor:cur.backgroundColor||''};
  a.frames.push(f);a.frames.sort((x,y)=>x.p-y.p);P._activeFrameId=f.id;render();
}
function render(){
  const host=$('cvbPhase2');if(!host)return;
  const a=model(),f=activeFrame(a);if(!f)return;
  const t=parseTransform(f.transform);
  const custom=!['1','2','3','4','5','infinite'].includes(String(a.iteration));
  host.innerHTML=`
    <div class="cvb-p2ux3-head">
      <div><h2>22. Animation Studio</h2><span>${esc(target()||'body')} · timeline e fotogrammi</span></div>
      <select id="cvbP2ux3Preset" aria-label="Preset animazione"><option value="">Preset…</option><option value="fade">Dissolvenza</option><option value="slide">Scivola</option><option value="pop">Pop</option><option value="bounce">Rimbalzo</option></select>
    </div>
    <div class="cvb-p2ux3-help"><b>Come usarlo:</b> la timeline mostra l'animazione; la <b>lista dei fotogrammi</b> è il modo più semplice per spostarti tra 0%, 50%, 75%, 100% ecc. Clicca un fotogramma e modifica sotto cosa deve fare in quel momento.</div>

    <div class="cvb-p2ux3-timeline">
      <div class="cvb-p2ux3-track">
        ${a.frames.map(x=>`<button type="button" class="cvb-p2ux3-mark ${x.id===f.id?'active':''}" style="left:${x.p}%" data-frame-id="${esc(x.id)}" title="Fotogramma ${x.p}%"><span>${x.p}%</span></button>`).join('')}
      </div>
      <div class="cvb-p2ux3-ruler"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
    </div>

    <div class="cvb-p2ux3-list-wrap">
      <div class="cvb-p2ux3-list-head"><b>Fotogrammi</b><span>${a.frames.length} · selezionato ${f.p}%</span></div>
      <div class="cvb-p2ux3-list">
        ${a.frames.map((x,i)=>`<button type="button" class="cvb-p2ux3-frame ${x.id===f.id?'active':''}" data-frame-id="${esc(x.id)}">
          <span class="cvb-p2ux3-dot">${i+1}</span><strong>${Math.round(x.p)}%</strong><span class="cvb-p2ux3-summary">${esc(summary(x))}</span><span class="cvb-p2ux3-arrow">›</span>
        </button>`).join('')}
      </div>
    </div>

    <div class="cvb-p2ux3-framebar">
      <div><b>Fotogramma selezionato: ${Math.round(f.p)}%</b><span>Cambia la posizione senza cancellare gli altri fotogrammi.</span></div>
      <input id="cvbP2ux3Percent" type="number" min="0" max="100" step="1" value="${Math.round(f.p)}" aria-label="Posizione del fotogramma">
      <button type="button" id="cvbP2ux3Delete" ${a.frames.length<=2?'disabled':''}>Elimina</button>
    </div>

    <div class="cvb-p2ux3-between"><button type="button" id="cvbP2ux3Add">＋ Inserisci fotogramma tra questo e il successivo</button><span>Per inserire un passaggio a metà, seleziona il fotogramma da cui partire e premi questo pulsante.</span></div>

    <div class="cvb-p2ux3-grid">
      <div class="cvb-p2ux3-card"><h3>Movimento del fotogramma</h3><p class="cvb-p2ux3-tip">Questi valori descrivono dove si trova l'elemento in questo preciso punto dell'animazione.</p><div class="cvb-p2ux3-fields"><label>X (px)<input id="cvbP2ux3X" type="number" value="${t.tx}"></label><label>Y (px)<input id="cvbP2ux3Y" type="number" value="${t.ty}"></label><label>Scala<input id="cvbP2ux3Scale" type="number" min="0" max="4" step=".05" value="${t.sx}"></label><label>Rotazione<input id="cvbP2ux3Rotate" type="number" min="-360" max="360" value="${t.rz}"></label></div><button type="button" class="secondary-button" id="cvbP2ux3ResetMotion">Reset movimento</button></div>
      <div class="cvb-p2ux3-card"><h3>Aspetto</h3><p class="cvb-p2ux3-tip">Queste proprietà vengono interpolate tra un fotogramma e quello successivo.</p><label class="cvb-p2ux3-row">Opacità<input id="cvbP2ux3Opacity" type="number" min="0" max="1" step=".05" value="${f.opacity===''?'':f.opacity}"></label><div class="cvb-p2ux3-color"><label>Colore testo</label><div><input id="cvbP2ux3ColorPick" type="color" value="${colorHex(f.color)}"><input id="cvbP2ux3Color" type="text" value="${esc(f.color)}" placeholder="#222222 / var(...)" ></div></div><div class="cvb-p2ux3-color"><label>Sfondo</label><div><input id="cvbP2ux3BgPick" type="color" value="${colorHex(f.backgroundColor)}"><input id="cvbP2ux3Bg" type="text" value="${esc(f.backgroundColor)}" placeholder="#ffffff / transparent"></div></div></div>
    </div>

    <div class="cvb-p2ux3-settings"><label>Nome<input id="cvbP2ux3Name" value="${esc(a.name)}"></label><label>Durata (ms)<input id="cvbP2ux3Duration" type="number" min="50" max="60000" step="50" value="${a.duration}"></label><label>Easing<select id="cvbP2ux3Timing"><option>ease</option><option>linear</option><option>ease-in</option><option>ease-out</option><option>ease-in-out</option><option>cubic-bezier(.2,.8,.2,1)</option><option>cubic-bezier(.34,1.56,.64,1)</option></select></label><label>Ripetizioni<select id="cvbP2ux3Iteration">${iterationOptions(a.iteration)}</select></label><label>Direzione<select id="cvbP2ux3Direction"><option>normal</option><option>reverse</option><option>alternate</option><option>alternate-reverse</option></select></label><label>Riempimento<select id="cvbP2ux3Fill"><option value="none">none</option><option value="forwards">forwards</option><option value="backwards">backwards</option><option value="both">both</option></select></label>${custom?`<label>Valore personalizzato<input id="cvbP2ux3CustomIteration" type="number" min="1" step="1" value="${esc(a.iteration)}"></label>`:''}</div>
    <div class="cvb-p2ux3-fill-help"><b>Riempimento:</b> <code>none</code> torna allo stile normale, <code>forwards</code> mantiene il risultato del 100%, <code>backwards</code> applica il primo fotogramma durante un eventuale ritardo, <code>both</code> fa entrambe le cose.</div>

    <div class="cvb-p2ux3-actions"><button type="button" id="cvbP2ux3Play" class="primary">▶ Prova</button><button type="button" id="cvbP2ux3Pause">⏸ Pausa</button><button type="button" id="cvbP2ux3Stop">■ Stop</button><button type="button" id="cvbP2ux3Apply">✓ Applica al CSS</button><button type="button" id="cvbP2ux3Copy">Copia CSS</button></div>
    <details class="cvb-p2ux3-code"><summary>Mostra CSS generato</summary><pre id="cvbP2ux3Code"></pre></details>`;

  $('cvbP2ux3Timing').value=a.timing;$('cvbP2ux3Direction').value=a.direction;$('cvbP2ux3Fill').value=a.fill;$('cvbP2ux3Code').textContent=fullCss(a);

  const saveFrame=()=>{
    const a=model(),frame=activeFrame(a);if(!frame)return;
    frame.transform=transformFrom({tx:num($('cvbP2ux3X')?.value),ty:num($('cvbP2ux3Y')?.value),sx:num($('cvbP2ux3Scale')?.value,1),sy:num($('cvbP2ux3Scale')?.value,1),rz:num($('cvbP2ux3Rotate')?.value)});
    const op=$('cvbP2ux3Opacity')?.value;frame.opacity=op===''?'':Math.max(0,Math.min(1,num(op,1)));
    frame.color=$('cvbP2ux3Color')?.value||'';frame.backgroundColor=$('cvbP2ux3Bg')?.value||'';
    a.name=$('cvbP2ux3Name')?.value||a.name;a.duration=Math.max(50,num($('cvbP2ux3Duration')?.value,1000));
    const it=$('cvbP2ux3Iteration')?.value||'1';a.iteration=it==='custom'?String(Math.max(1,Math.round(num($('cvbP2ux3CustomIteration')?.value,1)))):it;
    a.timing=$('cvbP2ux3Timing')?.value||'ease';a.direction=$('cvbP2ux3Direction')?.value||'normal';a.fill=$('cvbP2ux3Fill')?.value||'both';
    $('cvbP2ux3Code').textContent=fullCss(a);
  };

  host.oninput=e=>{
    const ids=['cvbP2ux3X','cvbP2ux3Y','cvbP2ux3Scale','cvbP2ux3Rotate','cvbP2ux3Opacity','cvbP2ux3Color','cvbP2ux3Bg','cvbP2ux3Name','cvbP2ux3Duration','cvbP2ux3CustomIteration'];
    if(ids.includes(e.target.id)){saveFrame();return;}
    if(e.target.id==='cvbP2ux3Percent'){
      const a=model(),frame=activeFrame(a);if(!frame)return;
      const requested=Math.max(0,Math.min(100,num(e.target.value,frame.p)));
      const next=findFreePercent(a,requested,frame.id);
      frame.p=next;
      a.frames.sort((x,y)=>x.p-y.p);
      P._activeFrameId=frame.id;
      const out=$('cvbP2ux3Code');if(out)out.textContent=fullCss(a);
      render();
    }
  };
  host.onchange=e=>{
    if(['cvbP2ux3Timing','cvbP2ux3Direction','cvbP2ux3Fill','cvbP2ux3Iteration'].includes(e.target.id)){
      const a=model();
      if(e.target.id==='cvbP2ux3Iteration'&&e.target.value==='custom'){a.iteration=String(Math.max(1,Math.round(num($('cvbP2ux3CustomIteration')?.value,1))));}
      else if(e.target.id==='cvbP2ux3Timing')a.timing=e.target.value;
      else if(e.target.id==='cvbP2ux3Direction')a.direction=e.target.value;
      else if(e.target.id==='cvbP2ux3Fill')a.fill=e.target.value;
      $('cvbP2ux3Code').textContent=fullCss(a); 
      if(e.target.id==='cvbP2ux3Iteration')render();
    }
  };
  host.onclick=e=>{
    const k=e.target.closest('[data-frame-id]');
    if(k){P._activeFrameId=k.dataset.frameId;render();return;}
    if(e.target.id==='cvbP2ux3Add'){insertKeyframe();return;}
    if(e.target.id==='cvbP2ux3Delete'){
      const a=model();if(a.frames.length>2){const current=activeFrame(a);const idx=a.frames.indexOf(current);a.frames.splice(idx,1);P._activeFrameId=a.frames[Math.max(0,Math.min(idx,a.frames.length-1))].id;render();}return;
    }
    if(e.target.id==='cvbP2ux3ResetMotion'){$('cvbP2ux3X').value=0;$('cvbP2ux3Y').value=0;$('cvbP2ux3Scale').value=1;$('cvbP2ux3Rotate').value=0;saveFrame();return;}
    if(e.target.id==='cvbP2ux3Preset')preset(e.target.value);
    if(e.target.id==='cvbP2ux3Play'){const a=model();sendPreview('play',a);status(`Animazione in prova · ${cleanName(a.name)}`);}
    if(e.target.id==='cvbP2ux3Pause'){sendPreview('pause',model());status('Animazione in pausa');}
    if(e.target.id==='cvbP2ux3Stop'){sendPreview('stop',model());status('Animazione fermata');}
    if(e.target.id==='cvbP2ux3Apply'){const a=model();applyBuilder(a);sendPreview('play',a);}
    if(e.target.id==='cvbP2ux3Copy')navigator.clipboard?.writeText(fullCss(model()));
  };
  $('cvbP2ux3ColorPick')?.addEventListener('input',e=>{$('cvbP2ux3Color').value=e.target.value;saveFrame();});
  $('cvbP2ux3BgPick')?.addEventListener('input',e=>{$('cvbP2ux3Bg').value=e.target.value;saveFrame();});
}
function watchSelection(){
  const el=$('controlSelector');if(!el||el.__cvbP2Ux3Watch)return;el.__cvbP2Ux3Watch=true;
  let old=el.textContent;
  const tick=()=>{const cur=el.textContent;if(cur!==old){old=cur;P._activeFrameId=null;render();}};
  const mo=new MutationObserver(tick);mo.observe(el,{subtree:true,childList:true,characterData:true});
}
function inject(){const host=$('cvbPhase2');if(!host)return;ensurePreviewRuntime();watchSelection();render();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
