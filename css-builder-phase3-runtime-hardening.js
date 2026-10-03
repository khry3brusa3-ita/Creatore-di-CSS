(()=>{
  'use strict';
  const P=window.CVB_PHASE3_RUNTIME=window.CVB_PHASE3_RUNTIME||{version:'2.27'};
  if(P.installed) return;
  const proto=HTMLIFrameElement.prototype;
  const desc=Object.getOwnPropertyDescriptor(proto,'srcdoc');
  if(!desc?.set){P.installed=true;return;}
  const marker='__cvb_phase3_bridge_v227__';
  const script=`<script id="${marker}">
(function(){
  if(window.__cvbPhase3BridgeInstalled)return;
  window.__cvbPhase3BridgeInstalled=true;
  var post=function(m){try{parent.postMessage(m,'*');}catch(_) {}};
  var format=function(v){
    try{
      if(v instanceof Error)return v.name+': '+v.message;
      if(typeof v==='string')return v;
      if(typeof v==='undefined')return 'undefined';
      var j=JSON.stringify(v); return j===undefined?String(v):j;
    }catch(_){return String(v);}
  };
  var send=function(kind,args,seq){post({type:'cvb-phase3-console',entry:[kind,args.map(format).join(' '),seq]});};
  var consoleProxy={
    log:function(){send('log',Array.prototype.slice.call(arguments));},
    info:function(){send('info',Array.prototype.slice.call(arguments));},
    warn:function(){send('warn',Array.prototype.slice.call(arguments));},
    error:function(){send('error',Array.prototype.slice.call(arguments));},
    debug:function(){send('debug',Array.prototype.slice.call(arguments));}
  };
  window.addEventListener('message',async function(e){
    var d=e.data;
    if(!d||d.type!=='cvb-phase3-js'||d.action!=='run')return;
    try{
      var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
      var fn=new AsyncFunction('console','$','$$','"use strict";\\n'+String(d.code||''));
      await fn(consoleProxy,function(selector){return document.querySelector(selector);},function(selector){return Array.prototype.slice.call(document.querySelectorAll(selector));});
      post({type:'cvb-phase3-console',entry:['success','✓ Esecuzione completata',d.seq]});
    }catch(err){
      post({type:'cvb-phase3-console',entry:['error',(err&&err.stack)?err.stack:(err&&err.name?err.name+': ':'')+(err&&err.message?err.message:String(err)),d.seq]});
    }
  });
  post({type:'cvb-phase3-ready'});
})();
<\/script>`;
  const previousSet=desc.set;
  Object.defineProperty(proto,'srcdoc',{
    configurable:desc.configurable,
    enumerable:desc.enumerable,
    get:desc.get,
    set(v){
      let html=String(v??'');
      if(this.id==='previewFrame'){
        const re=new RegExp('<script id="'+marker+'">[\\s\\S]*?<\\/script>','i');
        html=html.replace(re,'');
        const pos=html.lastIndexOf('</body>');
        html=pos>=0?html.slice(0,pos)+script+html.slice(pos):html+script;
      }
      return previousSet.call(this,html);
    }
  });
  P.installed=true;
})();
