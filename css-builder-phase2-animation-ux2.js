(()=>{
'use strict';

/* CSS Builder Phase 2 — Animation Studio UX2
   Additive refinement of the Animation Studio.
   Focus: keyframe navigation/selection, color picking, iteration UX and
   contextual explanations for real-world CSS usage.
*/
const P=window.CVB_PHASE2;
if(!P)return;
P.version='2.24-ux2';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const core=()=>window.CVB_CORE_API||null;
const target=()=>core()?.getActiveSelector?.()||$('controlSelector')?.textContent?.trim()||null;
const num=(v,d=0)=>{const n=Number(v);return Number.isFinite(n)?n:d;};

function model(){
  const key=target()||'body';
  if(!P.animations.has(key))P.animations.set(key,{name:'cvb-animation',duration:1000,timing:'ease',iteration:'1',direction:'normal',fill:'both',frames:[
    {p:0,transform:'translateX(-40px) scale(.94)',opacity:0,color:'',backgroundColor:''},
    {p:50,transform:'translateX(8px) scale(1.02)',opacity:.8,color:'',backgroundColor:''},
    {p:100,transform:'translateX(0) scale(1)',opacity:1,color:'',backgroundColor:''}
  ]});
  const a=P.animations.get(key);
  a.frames=(a.frames||[]).map(f=>({
    p:Math.max(0,Math.min(100,num(f.p,0))),
    transform:String(f.transform||'none'),
    opacity:f.opacity===''?'':Math.max(0,Math.min(1,num(f.opacity,1))),
    color:String(f.color||''),
    backgroundColor:String(f.backgroundColor||'')
  })).sort((x,y)=>x.p-y.p);
  if(a.frames.length<2)a.frames=[{p:0,transform:'none',opacity:1,color:'',backgroundColor:''},{p:100,transform:'none',opacity:1,color:'',backgroundColor:''}];
  return a;
}
function cleanName(v){return(String(v||'cvb-animation').trim().replace(/[^a-zA-Z0-9_-]/g,'-')||'cvb-animation');}
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
  return `${cleanName(a.name)} ${Math.max(1,num(a.duration,1000))}ms ${a.timing||'ease'} ${it} ${a.direction||'normal'} ${a.fill||'both'}`;
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
  return `translate3d(${Math.round(num(t.tx))}px, ${Math.round(num(t.ty))}px, 0px) rotateZ(${Math.round(num(t.rz))}deg) scale(${num(t.sx,1).toFixed(2).replace(/\.00$/,'')}, ${num(t.sy,1).toFixed(2).replace(/\.00$/,'')})`;
}
function applyBuilder(a){
  const sel=target();if(!sel)return;
  const api=core();
  api?.setProperty?.(sel,'animation',shorthand(a),true,false);
  api?.setKeyframes?.(sel,a.name,a.frames);
  api?.updateCssAndPreview?.();
  const st=$('previewStatus');if(st)st.textContent=`Animation · ${sel} · ${cleanName(a.name)}`;
}
function post(action,a){window.postMessage({type:'cvb-phase2-animation',action,selector:target()||'body',css:css(a),animation:shorthand(a)},'*');}
function colorHex(v){return /^#[0-9a-f]{6}$/i.test(String(v||''))?String(v):'#222222';}
function iterationOptions(value){
  const preset=['1','2','3','4','5','infinite'];
  const custom=!preset.includes(String(value));
  return `<option value="1">1 volta</option><option value="2">2 volte</option><option value="3">3 volte</option><option value="4">4 volte</option><option value="5">5 volte</option><option value="infinite">Infinite</option><option value="custom" ${custom?'selected':''}>Personalizzato</option>`;
}
function samePointExists(a,p,except){return a.frames.some((f,i)=>i!==except&&Math.round(f.p)===Math.round(p));}
function nearestOtherFrame(a,index,dir){
  const sorted=a.frames.slice().sort((x,y)=>x.p-y.p);
  const current=a.frames[index];
  const pos=sorted.indexOf(current);
  return dir<0?sorted[Math.max(0,pos-1)]:sorted[Math.min(sorted.length-1,pos+1)];
}
function render(){
  const host=$('cvbPhase2');if(!host)return;
  const a=model();
  const active=Math.max(0,Math.min(a.frames.length-1,P._activeFrame??0));
  P._activeFrame=active;
  const f=a.frames[active]||a.frames[0];
  const t=parseTransform(f.transform);
  const customIteration=!['1','2','3','4','5','infinite'].includes(String(a.iteration));
  host.innerHTML=`
  <div class="cvb-p2ux2-head">
    <div><h2>22. Animation Studio</h2><span>${esc(target()||'body')} · keyframe editor</span></div>
    <select id="cvbP2ux2Preset" aria-label="Preset animazione"><option value="">Preset…</option><option value="fade">Dissolvenza</option><option value="slide">Scivola</option><option value="pop">Pop</option><option value="bounce">Rimbalzo</option></select>
  </div>

  <div class="cvb-p2ux2-guide"><b>Come funziona:</b> ogni punto è un fotogramma. Clicca un punto per selezionarlo; usa ◀/▶ per passare al precedente/successivo. Poi modifica X, Y, scala, rotazione, opacità o colori del fotogramma selezionato.</div>

  <div class="cvb-p2ux2-timeline" id="cvbP2ux2Timeline">
    <div class="cvb-p2ux2-track">
      <div class="cvb-p2ux2-progress" style="width:${f.p}%"></div>
      ${a.frames.map((x,i)=>`<button type="button" class="cvb-p2ux2-key ${i===active?'active':''}" style="left:${x.p}%" data-frame="${i}" aria-label="Seleziona fotogramma ${x.p}%" title="Fotogramma ${x.p}%"></button>`).join('')}
    </div>
    <div class="cvb-p2ux2-ruler"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
    <div class="cvb-p2ux2-nav">
      <button type="button" id="cvbP2ux2Prev">◀ Precedente</button>
      <strong>Fotogramma ${f.p}%</strong>
      <button type="button" id="cvbP2ux2Next">Successivo ▶</button>
    </div>
  </div>

  <div class="cvb-p2ux2-framebar">
    <div><b>Posizione del fotogramma</b><span>Il punto indica quando avviene questo passaggio dell'animazione.</span></div>
    <input id="cvbP2ux2Percent" type="number" min="0" max="100" step="1" value="${f.p}" aria-label="Percentuale fotogramma">
    <button type="button" id="cvbP2ux2Delete" ${a.frames.length<=2?'disabled':''}>Elimina</button>
  </div>

  <div class="cvb-p2ux2-grid">
    <div class="cvb-p2ux2-card">
      <h3>Movimento</h3>
      <p class="cvb-p2ux2-tip">Qui definisci <b>come cambia l'elemento</b> in questo preciso momento.</p>
      <div class="cvb-p2ux2-fields">
        <label>X (px)<input id="cvbP2ux2X" type="number" value="${t.tx}"></label>
        <label>Y (px)<input id="cvbP2ux2Y" type="number" value="${t.ty}"></label>
        <label>Scala<input id="cvbP2ux2Scale" type="number" min="0" max="4" step=".05" value="${t.sx}"></label>
        <label>Rotazione<input id="cvbP2ux2Rotate" type="number" min="-360" max="360" value="${t.rz}"></label>
      </div>
      <button type="button" class="secondary-button" id="cvbP2ux2ResetMotion">Reset movimento</button>
    </div>

    <div class="cvb-p2ux2-card">
      <h3>Aspetto</h3>
      <p class="cvb-p2ux2-tip">Queste proprietà vengono animate <b>tra un keyframe e l'altro</b>.</p>
      <label class="cvb-p2ux2-color-row">Opacità<input id="cvbP2ux2Opacity" type="number" min="0" max="1" step=".05" value="${f.opacity===''?1:f.opacity}"></label>
      <div class="cvb-p2ux2-color-picker"><label>Colore testo</label><div><input id="cvbP2ux2ColorPick" type="color" value="${colorHex(f.color)}" aria-label="Scegli colore testo"><input id="cvbP2ux2Color" type="text" value="${esc(f.color)}" placeholder="#222222 / var(...)"></div></div>
      <div class="cvb-p2ux2-color-picker"><label>Sfondo</label><div><input id="cvbP2ux2BgPick" type="color" value="${colorHex(f.backgroundColor)}" aria-label="Scegli colore sfondo"><input id="cvbP2ux2Bg" type="text" value="${esc(f.backgroundColor)}" placeholder="#ffffff / transparent"></div></div>
      <p class="hint">Il quadratino apre la tavolozza. Il campo testuale resta disponibile per colori CSS avanzati.</p>
    </div>
  </div>

  <div class="cvb-p2ux2-settings">
    <label>Nome<input id="cvbP2ux2Name" value="${esc(a.name)}"></label>
    <label>Durata (ms)<input id="cvbP2ux2Duration" type="number" min="50" max="60000" step="50" value="${a.duration}"></label>
    <label>Easing<select id="cvbP2ux2Timing"><option>ease</option><option>linear</option><option>ease-in</option><option>ease-out</option><option>ease-in-out</option><option>cubic-bezier(.2,.8,.2,1)</option><option>cubic-bezier(.34,1.56,.64,1)</option></select></label>
    <label>Ripetizioni<select id="cvbP2ux2Iteration">${iterationOptions(a.iteration)}</select></label>
    <label>Direzione<select id="cvbP2ux2Direction"><option>normal</option><option>reverse</option><option>alternate</option><option>alternate-reverse</option></select></label>
    <label>Riempimento<select id="cvbP2ux2Fill"><option value="none">none</option><option value="forwards">forwards</option><option value="backwards">backwards</option><option value="both">both</option></select></label>
    ${customIteration?'<label id="cvbP2ux2CustomWrap">Valore personalizzato<input id="cvbP2ux2CustomIteration" type="number" min="1" step="1" value="'+esc(a.iteration)+'"></label>':'<label id="cvbP2ux2CustomWrap" class="is-hidden">Valore personalizzato<input id="cvbP2ux2CustomIteration" type="number" min="1" step="1" value="1"></label>'}
  </div>

  <div class="cvb-p2ux2-fill-help"><b>Riempimento:</b> <code>none</code> = torna allo stile normale; <code>forwards</code> = mantiene il 100% dopo la fine; <code>backwards</code> = applica lo 0% durante un eventuale ritardo; <code>both</code> = entrambe le cose.</div>

  <div class="cvb-p2ux2-actions">
    <button type="button" id="cvbP2ux2Add">+ Aggiungi keyframe</button>
    <button type="button" id="cvbP2ux2Play" class="primary">▶ Prova</button>
    <button type="button" id="cvbP2ux2Pause">⏸ Pausa</button>
    <button type="button" id="cvbP2ux2Stop">■ Stop</button>
    <button type="button" id="cvbP2ux2Apply">✓ Applica al CSS</button>
    <button type="button" id="cvbP2ux2Copy">Copia CSS</button>
  </div>
  <details class="cvb-p2ux2-code"><summary>Mostra CSS generato</summary><pre id="cvbP2ux2Code"></pre></details>`;

  $('cvbP2ux2Timing').value=a.timing;
  $('cvbP2ux2Direction').value=a.direction;
  $('cvbP2ux2Fill').value=a.fill;
  $('cvbP2ux2Code').textContent=fullCss(a);

  const saveFrame=()=>{
    const a=model(),i=P._activeFrame,frame=a.frames[i];if(!frame)return;
    frame.transform=transformFrom({tx:num($('cvbP2ux2X')?.value),ty:num($('cvbP2ux2Y')?.value),sx:num($('cvbP2ux2Scale')?.value,1),sy:num($('cvbP2ux2Scale')?.value,1),rz:num($('cvbP2ux2Rotate')?.value)});
    frame.opacity=String($('cvbP2ux2Opacity')?.value??'')===''?'':Math.max(0,Math.min(1,num($('cvbP2ux2Opacity')?.value,1)));
    frame.color=$('cvbP2ux2Color')?.value||'';
    frame.backgroundColor=$('cvbP2ux2Bg')?.value||'';
    const rawP=Math.max(0,Math.min(100,num($('cvbP2ux2Percent')?.value,frame.p)));
    if(!samePointExists(a,rawP,i))frame.p=rawP;
    a.name=$('cvbP2ux2Name')?.value||a.name;
    a.duration=Math.max(50,num($('cvbP2ux2Duration')?.value,1000));
    a.timing=$('cvbP2ux2Timing')?.value||'ease';
    a.direction=$('cvbP2ux2Direction')?.value||'normal';
    a.fill=$('cvbP2ux2Fill')?.value||'both';
    const it=$('cvbP2ux2Iteration')?.value||'1';
    a.iteration=it==='custom'?String(Math.max(1,Math.round(num($('cvbP2ux2CustomIteration')?.value,1)))):it;
    a.frames.sort((x,y)=>x.p-y.p);
    P._activeFrame=Math.max(0,a.frames.findIndex(x=>x===frame));
    const out=$('cvbP2ux2Code');if(out)out.textContent=fullCss(a);
  };

  const toggleCustom=()=>{$('cvbP2ux2CustomWrap')?.classList.toggle('is-hidden',$('cvbP2ux2Iteration')?.value!=='custom');};

  host.oninput=e=>{
    if(['cvbP2ux2X','cvbP2ux2Y','cvbP2ux2Scale','cvbP2ux2Rotate','cvbP2ux2Opacity','cvbP2ux2Color','cvbP2ux2Bg','cvbP2ux2Name','cvbP2ux2Duration','cvbP2ux2Percent','cvbP2ux2CustomIteration'].includes(e.target.id)){
      saveFrame();
    }
  };
  host.onchange=e=>{
    if(['cvbP2ux2Timing','cvbP2ux2Direction','cvbP2ux2Fill','cvbP2ux2Iteration'].includes(e.target.id)){
      const a=model();
      if(e.target.id==='cvbP2ux2Iteration'){a.iteration=e.target.value==='custom'?String(Math.max(1,Math.round(num($('cvbP2ux2CustomIteration')?.value,1)))):e.target.value;toggleCustom();}
      if(e.target.id==='cvbP2ux2Timing')a.timing=e.target.value;
      if(e.target.id==='cvbP2ux2Direction')a.direction=e.target.value;
      if(e.target.id==='cvbP2ux2Fill')a.fill=e.target.value;
      $('cvbP2ux2Code').textContent=fullCss(a);
    }
  };
  host.onclick=e=>{
    const k=e.target.closest('[data-frame]');
    if(k){P._activeFrame=Math.max(0,Math.min(a.frames.length-1,Number(k.dataset.frame)));render();return;}
    if(e.target.id==='cvbP2ux2Prev'){const n=nearestOtherFrame(model(),P._activeFrame,-1);if(n){P._activeFrame=model().frames.indexOf(n);}render();return;}
    if(e.target.id==='cvbP2ux2Next'){const n=nearestOtherFrame(model(),P._activeFrame,1);if(n){P._activeFrame=model().frames.indexOf(n);}render();return;}
    if(e.target.id==='cvbP2ux2Add'){
      const a=model(),cur=a.frames[P._activeFrame]||a.frames[0];
      const sorted=a.frames.slice().sort((x,y)=>x.p-y.p),pos=sorted.indexOf(cur);
      const next=sorted[Math.min(sorted.length-1,pos+1)];
      let p=next?Math.round((cur.p+next.p)/2):Math.min(100,cur.p+10);
      if(samePointExists(a,p,-1))p=Math.min(100,cur.p+1);
      if(samePointExists(a,p,-1))return;
      a.frames.push({p,transform:cur.transform,opacity:cur.opacity,color:cur.color||'',backgroundColor:cur.backgroundColor||''});
      a.frames.sort((x,y)=>x.p-y.p);P._activeFrame=a.frames.findIndex(x=>x.p===p);render();return;
    }
    if(e.target.id==='cvbP2ux2Delete'){
      const a=model();
      if(a.frames.length>2){a.frames.splice(P._activeFrame,1);P._activeFrame=Math.max(0,Math.min(P._activeFrame,a.frames.length-1));render();}
      return;
    }
    if(e.target.id==='cvbP2ux2ResetMotion'){$('cvbP2ux2X').value=0;$('cvbP2ux2Y').value=0;$('cvbP2ux2Scale').value=1;$('cvbP2ux2Rotate').value=0;saveFrame();return;}
    if(e.target.id==='cvbP2ux2Preset'){preset(e.target.value);return;}
    if(e.target.id==='cvbP2ux2Play')post('play',model());
    if(e.target.id==='cvbP2ux2Pause')post('pause',model());
    if(e.target.id==='cvbP2ux2Stop')post('stop',model());
    if(e.target.id==='cvbP2ux2Apply'){const x=model();applyBuilder(x);post('play',x);}
    if(e.target.id==='cvbP2ux2Copy')navigator.clipboard?.writeText(fullCss(model()));
    if(e.target.id==='cvbP2ux2ColorPick'){$('cvbP2ux2Color').value=e.target.value;saveFrame();}
    if(e.target.id==='cvbP2ux2BgPick'){$('cvbP2ux2Bg').value=e.target.value;saveFrame();}
  };

  $('cvbP2ux2ColorPick')?.addEventListener('input',e=>{$('cvbP2ux2Color').value=e.target.value;saveFrame();});
  $('cvbP2ux2BgPick')?.addEventListener('input',e=>{$('cvbP2ux2Bg').value=e.target.value;saveFrame();});
  toggleCustom();
}
function preset(v){
  const a=model();
  if(v==='fade')a.frames=[{p:0,transform:'none',opacity:0,color:'',backgroundColor:''},{p:100,transform:'none',opacity:1,color:'',backgroundColor:''}];
  if(v==='slide')a.frames=[{p:0,transform:'translate3d(-70px,0,0) scale(1)',opacity:0,color:'',backgroundColor:''},{p:100,transform:'translate3d(0,0,0) scale(1)',opacity:1,color:'',backgroundColor:''}];
  if(v==='pop')a.frames=[{p:0,transform:'scale(.72)',opacity:0,color:'',backgroundColor:''},{p:65,transform:'scale(1.06)',opacity:1,color:'',backgroundColor:''},{p:100,transform:'scale(1)',opacity:1,color:'',backgroundColor:''}];
  if(v==='bounce')a.frames=[{p:0,transform:'translateY(-38px)',opacity:0,color:'',backgroundColor:''},{p:35,transform:'translateY(10px)',opacity:1,color:'',backgroundColor:''},{p:60,transform:'translateY(-8px)',opacity:1,color:'',backgroundColor:''},{p:100,transform:'translateY(0)',opacity:1,color:'',backgroundColor:''}];
  if(v){P._activeFrame=0;render();}
}
function watchSelection(){
  const el=$('controlSelector');if(!el||el.__cvbP2Ux2Watch)return;el.__cvbP2Ux2Watch=true;
  let old=el.textContent;
  const tick=()=>{const cur=el.textContent;if(cur!==old){old=cur;P._activeFrame=0;render();}};
  const mo=new MutationObserver(tick);mo.observe(el,{subtree:true,childList:true,characterData:true});
  setInterval(tick,250);
}
function inject(){const host=$('cvbPhase2');if(!host)return;watchSelection();render();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
