(function(){
"use strict";
var F = window.FORM;
var KEY = "tesisCardio_v1_registros", DKEY = "tesisCardio_v1_borrador", RKEY = "tesisCardio_v1_rechazos",
    NKEY = "tesisCardio_v1_noelegibles", SKEY = "tesisCardio_v1_ajustes";
var app = document.getElementById("app"), modal = document.getElementById("modal");
var DIAG = "678493997", LAB = "979871757";

/* ---------- almacenamiento seguro ---------- */
function load(k, def){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }catch(e){ return def; } }
function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ showModal("<h2>No se pudo guardar</h2><p>El almacenamiento del dispositivo no respondió. Exporte un respaldo ahora desde el inicio.</p>", [["Entendido"]]); return false; } }
function del(k){ try{ localStorage.removeItem(k); }catch(e){} }
try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){}

function records(){ var r = load(KEY, []); return Array.isArray(r) ? r : []; }
function settings(){ return load(SKEY, {recolector:"", lugar:"Hospital Domingo Luciani"}); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function fmt(d){ try{ var x=new Date(d); return x.toLocaleDateString("es-VE")+" "+x.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}); }catch(e){ return String(d); } }

/* ---------- pasos ---------- */
var STEPS = [{kind:"check"}, {kind:"intro"}, {kind:"consent"}];
F.sections.forEach(function(sec){
  if(sec.id !== "demo") STEPS.push({kind:"section", sec:sec});
  if(sec.items){ sec.items.forEach(function(it, i){ STEPS.push({kind: it.type==="number" ? "number" : it.type==="multi" ? "multi" : "choice", sec:sec, item:it, n:i+1, total:sec.items.length}); }); }
  if(sec.rows){ sec.rows.forEach(function(r, i){ STEPS.push({kind:"choice", sec:sec, item:{entry:r[0], q:r[1], options:sec.scale}, n:i+1, total:sec.rows.length}); }); }
});
function isQ(s){ return s.kind==="choice"||s.kind==="number"||s.kind==="multi"; }
var QUESTION_STEPS = STEPS.filter(isQ).length;

var draft = null;
var lockUntil = 0;           // evita que un doble toque responda la pregunta siguiente
function locked(){ return Date.now() < lockUntil; }

/* ---------- UI ---------- */
function showModal(html, buttons){
  modal.innerHTML = '<div class="modal"><div class="card">'+html+'<div class="btns"></div></div></div>';
  var box = modal.querySelector(".btns");
  buttons.forEach(function(b){
    var el = document.createElement("button"); el.className = "btn " + (b[2]||""); el.textContent = b[0];
    el.onclick = function(){ modal.innerHTML=""; if(b[1]) b[1](); }; box.appendChild(el);
  });
}
function online(){ return navigator.onLine !== false; }
window.addEventListener("online", function(){ if(!draft) home(); });
window.addEventListener("offline", function(){ if(!draft) home(); });

/* ---------- puntajes (respaldo local / alerta) ---------- */
function idx(val, opts){ return opts.indexOf(val); }
function digit(v){ if(!v) return null; var m = String(v).match(/^(\d)/); return m ? +m[1] : null; }
function computeScores(ans){
  var bdi = F.sections[3].items.map(function(it){ return digit(ans[it.entry]); });
  var pss = F.sections[2].rows.map(function(r){ return idx(ans[r[0]], F.sections[2].scale); });
  var as = F.sections[1].rows.map(function(r){ return idx(ans[r[0]], F.sections[1].scale); });
  var rev = [4,5,6,7,9,10,13];
  var pssTot = pss.reduce(function(a,v,i){ return a + (rev.indexOf(i+1)>=0 ? 4-v : v); }, 0);
  return { bdi:bdi, pss:pss, as:as, bdiTotal: bdi.reduce(function(a,b){return a+(b||0);},0), pssTotal:pssTot, item9: bdi[8] };
}
function bdiLevel(t){ return t<=9?"mínima":t<=16?"leve":t<=29?"moderada":"grave"; }

/* ---------- inicio ---------- */
function home(){
  draft = load(DKEY, null);
  if(draft && (typeof draft.step!=="number" || !draft.answers)) { del(DKEY); draft=null; }
  var recs = records(), pend = recs.filter(function(r){return r.estado==="pendiente";}).length, sent = recs.length - pend;
  var st = settings(), rech = load(RKEY, 0), noel = load(NKEY, 0);
  app.innerHTML =
  '<div class="wrap">'+
   '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">'+
     '<div class="small muted" style="font-weight:600">Tesis · Rojas y Kasabji</div>'+
     (online() ? '<span class="pill on"><i></i>Con conexión</span>' : '<span class="pill off"><i></i>Sin señal · todo se guarda en este iPad</span>')+
   '</div>'+
   '<h1>Depresión en pacientes cardíacos</h1>'+
   '<div class="stats">'+
     '<div class="stat"><b>'+recs.length+'</b><span>completadas</span></div>'+
     '<div class="stat"><b style="color:var(--warn)">'+pend+'</b><span>por enviar</span></div>'+
     '<div class="stat"><b style="color:var(--ok)">'+sent+'</b><span>enviadas al Form</span></div>'+
   '</div>'+
   (draft ? '<div class="alert warn"><b>Hay una encuesta a medias</b> (iniciada '+fmt(draft.start)+').<button class="btn" id="resume">Continuar esa encuesta</button><button class="btn ghost" id="discard">Descartarla</button></div>' : '')+
   '<button class="btn" id="start" style="font-size:1.2rem;padding:22px">Nueva encuesta</button>'+
   '<button class="btn secondary" id="sync" '+(pend ? '' : 'disabled')+'>'+(pend ? 'Enviar '+pend+' pendiente'+(pend>1?'s':'')+' al Google Form' : 'No hay respuestas pendientes')+'</button>'+
   (pend ? '<p class="small muted center">Solo funciona con internet. Si no hay, no pasa nada: siguen guardadas aquí.</p>' : '')+
   '<div class="card">'+
     '<label class="f">Quién aplica</label><input type="text" id="rec" placeholder="Ej. Victor" value="'+esc(st.recolector)+'" autocomplete="off">'+
     '<label class="f">Lugar</label><input type="text" id="lug" value="'+esc(st.lugar)+'" autocomplete="off">'+
     '<p class="small muted">Solo queda en el respaldo de este iPad; no se envía al Form.<br>No aceptaron: '+rech+' · No cumplieron criterios: '+noel+'.</p>'+
   '</div>'+
   '<div class="row"><button class="btn secondary" id="csv">Respaldo Excel (CSV)</button><button class="btn secondary" id="json">Respaldo completo (JSON)</button></div>'+
   '<button class="btn ghost" id="list">Ver registros de este iPad</button>'+
   '<button class="btn ghost" id="imp">Importar respaldo JSON</button><input type="file" id="impf" accept="application/json,.json" class="hidden">'+
   '<p class="small muted center">Versión '+esc(window.APP_VERSION||"")+'</p>'+
  '</div>';
  var g = function(id){ return document.getElementById(id); };
  g("rec").onchange = g("lug").onchange = function(){ save(SKEY, {recolector:g("rec").value.trim(), lugar:g("lug").value.trim()}); };
  g("start").onclick = function(){
    if(draft){ showModal("<h2>Hay una encuesta a medias</h2><p>Si empiezas una nueva, la que estaba a medias se descarta.</p>", [["Empezar nueva", newSurvey], ["Cancelar", null, "secondary"]]); return; }
    newSurvey();
  };
  if(g("resume")) g("resume").onclick = function(){ render(); };
  if(g("discard")) g("discard").onclick = function(){ showModal("<h2>¿Descartar la encuesta a medias?</h2>", [["Sí, descartar", function(){ del(DKEY); draft=null; home(); }, "danger"], ["No", null, "secondary"]]); };
  g("sync").onclick = syncAll;
  g("csv").onclick = exportCSV; g("json").onclick = exportJSON; g("list").onclick = listView;
  g("imp").onclick = function(){ g("impf").click(); };
  g("impf").onchange = importJSON;
  window.scrollTo(0,0);
}

function newSurvey(){
  var st = settings();
  draft = { id: uid(), start: new Date().toISOString(), step: 0, answers: {}, multi: {}, other: {}, recolector: st.recolector, lugar: st.lugar };
  save(DKEY, draft); render();
}

/* ---------- render ---------- */
function render(){
  if(draft.step >= STEPS.length) draft.step = STEPS.length-1;
  var s = STEPS[draft.step]; save(DKEY, draft);
  lockUntil = Date.now() + 350;
  var answered = STEPS.slice(0, draft.step).filter(isQ).length;
  var pct = Math.round(100*answered/QUESTION_STEPS);
  var top = '<div class="top"><div class="in">'+
      (draft.step>0 ? '<button class="iconbtn" id="back">‹ Atrás</button>' : '')+
      '<div class="bar"><div style="width:'+pct+'%"></div></div>'+
      '<button class="iconbtn" id="exit">Salir</button></div></div>';
  var body = "";
  if(s.kind==="check"){
    body = '<div class="sec">Solo para el encuestador</div><h1>Antes de entregar el iPad</h1>'+
      '<p class="muted">Confirme en persona (criterios de la tesis):</p>'+
      ['Es mayor de 18 años','Puede leer y responder por sí mismo','No presenta deterioro cognitivo severo aparente','No está en una emergencia médica aguda'].map(function(t,i){ return '<button class="opt chk" data-c="'+i+'"><span class="dot box"></span><span>'+t+'</span></button>'; }).join('')+
      '<button class="btn" id="next" disabled>Todo correcto: entregar al paciente</button>'+
      '<button class="btn ghost" id="noel">No cumple: no aplicar</button>';
  } else if(s.kind==="intro"){
    body = '<div class="sec">Encuesta</div><h1>'+esc(F.title)+'</h1><div class="card"><pre>'+esc(F.intro)+'</pre></div><button class="btn" id="next">Comenzar</button>';
  } else if(s.kind==="consent"){
    body = '<div class="sec">Consentimiento informado</div><div class="q" style="font-size:1.15rem;font-weight:500">'+esc(F.consent.text)+'</div>'+
      opt(F.consent.yes, draft.answers[F.consent.entry]===F.consent.yes, "y")+opt(F.consent.no, false, "n");
  } else if(s.kind==="section"){
    body = '<div class="sec">Nueva sección</div><h1>'+esc(s.sec.title)+'</h1>'+(s.sec.instructions?'<div class="instr">'+esc(s.sec.instructions)+'</div>':'')+
      (s.sec.scale ? '<p class="muted">Opciones de respuesta: '+s.sec.scale.map(esc).join(' · ')+'</p>' : '')+'<button class="btn" id="next">Continuar</button>';
  } else if(s.kind==="number"){
    var v = draft.answers[s.item.entry] || "";
    body = '<div class="sec">'+esc(s.sec.title)+'</div><div class="q">'+esc(s.item.q)+'</div>'+
      '<input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" id="num" value="'+esc(v)+'" placeholder="Años cumplidos" autocomplete="off" style="font-size:1.6rem;text-align:center">'+
      '<p id="err" class="small" style="color:var(--danger);min-height:1.4em"></p><button class="btn" id="next">Continuar</button>';
  } else if(s.kind==="multi"){
    var sel = draft.multi[s.item.entry] || [];
    body = '<div class="sec">'+esc(s.sec.title)+'</div><div class="q">'+esc(s.item.q)+'</div>';
    s.item.options.forEach(function(o, i){ body += opt(o, sel.indexOf(o)>=0, i, true); });
    if(s.item.other){ var isO = sel.indexOf("__other_option__")>=0;
      body += opt("Otra (¿cuál?)", isO, "other", true) + '<div id="otherbox" class="'+(isO?'':'hidden')+'"><input type="text" id="othertxt" placeholder="Escriba cuál" autocomplete="off" value="'+esc(draft.other[s.item.entry]||"")+'"></div>'; }
    body += '<p id="err" class="small" style="color:var(--danger);min-height:1.4em"></p><button class="btn" id="next">Continuar</button>';
  } else {
    var cur = draft.answers[s.item.entry];
    body = '<div class="sec">'+esc(s.sec.title)+'</div><div class="qnum">'+s.n+' de '+s.total+'</div><div class="q">'+esc(s.item.q.replace(/^\d+\.\s*/,""))+'</div>';
    s.item.options.forEach(function(o, i){ body += opt(o, cur===o, i); });
    if(s.item.other){
      var isO2 = cur==="__other_option__";
      body += opt("Otro", isO2, "other");
      body += '<div id="otherbox" class="'+(isO2?'':'hidden')+'"><input type="text" id="othertxt" placeholder="Escriba cuál" autocomplete="off" value="'+esc(draft.other[s.item.entry]||"")+'"><button class="btn" id="othernext">Continuar</button></div>';
    }
  }
  app.innerHTML = top + '<div class="wrap">' + body + '</div>';
  bind(s); window.scrollTo(0,0);
}
function opt(text, sel, key, box){ return '<button class="opt'+(sel?' sel':'')+'" data-k="'+key+'"><span class="dot'+(box?' box':'')+'"></span><span>'+esc(text)+'</span></button>'; }

function go(n){ draft.step = Math.max(0, Math.min(n, STEPS.length-1)); render(); }
function next(){ if(draft.step+1 < STEPS.length) go(draft.step+1); else finish(); }

function bind(s){
  var b = document.getElementById("back"); if(b) b.onclick = function(){ if(!locked()) go(draft.step-1); };
  document.getElementById("exit").onclick = function(){
    showModal("<h2>¿Salir de la encuesta?</h2><p>Puede guardarla a medias y continuarla después, o descartarla (por ejemplo, si el paciente decidió retirarse).</p>",
      [["Guardar a medias y salir", function(){ save(DKEY, draft); draft=null; home(); }],
       ["Descartar (el paciente se retiró)", function(){ del(DKEY); draft=null; home(); }, "danger"],
       ["Seguir con la encuesta", null, "secondary"]]);
  };
  var nx = document.getElementById("next");
  if(s.kind==="check"){
    var checks = [false,false,false,false];
    Array.prototype.forEach.call(document.querySelectorAll(".chk"), function(el){
      el.onclick = function(){ var i=+el.getAttribute("data-c"); checks[i]=!checks[i]; el.classList.toggle("sel", checks[i]); nx.disabled = checks.indexOf(false)>=0; };
    });
    nx.onclick = function(){ if(!nx.disabled) next(); };
    document.getElementById("noel").onclick = function(){ ineligible("No cumple criterios verificados en persona"); };
    return;
  }
  if(s.kind==="intro"||s.kind==="section"){ nx.onclick = function(){ if(!locked()) next(); }; return; }
  if(s.kind==="number"){
    var inp = document.getElementById("num");
    var go2 = function(){
      var v = inp.value.replace(/\D/g,""), n = +v;
      if(!v || n < s.item.min || n > s.item.max){ document.getElementById("err").textContent = "Escriba la edad en años (entre "+s.item.min+" y "+s.item.max+")."; return; }
      draft.answers[s.item.entry] = String(n); inp.blur(); next();
    };
    nx.onclick = go2; inp.onkeydown = function(e){ if(e.key==="Enter"){ e.preventDefault(); go2(); } };
    return;
  }
  if(s.kind==="multi"){
    var e = s.item.entry, sel = (draft.multi[e] || []).slice();
    var paint = function(){ Array.prototype.forEach.call(document.querySelectorAll(".opt"), function(o){ var k=o.getAttribute("data-k"); var val = k==="other" ? "__other_option__" : s.item.options[+k]; o.classList.toggle("sel", sel.indexOf(val)>=0); });
      document.getElementById("otherbox") && document.getElementById("otherbox").classList.toggle("hidden", sel.indexOf("__other_option__")<0); };
    Array.prototype.forEach.call(document.querySelectorAll(".opt"), function(el){
      el.onclick = function(){
        var k = el.getAttribute("data-k"); var val = k==="other" ? "__other_option__" : s.item.options[+k];
        var i = sel.indexOf(val);
        if(i>=0) sel.splice(i,1);
        else if(val === s.item.exclusive) sel = [val];
        else { sel = sel.filter(function(x){ return x!==s.item.exclusive; }); sel.push(val); }
        draft.multi[e] = sel; save(DKEY, draft); paint();
        if(val==="__other_option__" && sel.indexOf(val)>=0){ var t=document.getElementById("othertxt"); if(t) t.focus(); }
      };
    });
    nx.onclick = function(){
      var err = document.getElementById("err");
      if(!sel.length){ err.textContent = "Marque al menos una opción."; return; }
      var t = document.getElementById("othertxt");
      if(sel.indexOf("__other_option__")>=0){ if(!t || !t.value.trim()){ err.textContent = "Escriba cuál es la otra enfermedad."; if(t) t.focus(); return; } draft.other[e] = t.value.trim(); }
      else delete draft.other[e];
      draft.multi[e] = sel;
      if(s.item.exclusive && sel.indexOf(s.item.exclusive)>=0){ ineligible("Sin diagnóstico médico confirmado"); return; }
      next();
    };
    return;
  }
  Array.prototype.forEach.call(document.querySelectorAll(".opt"), function(el){
    el.onclick = function(){
      if(locked()) return;
      lockUntil = Date.now() + 600;
      Array.prototype.forEach.call(document.querySelectorAll(".opt"), function(o){ o.classList.remove("sel"); }); el.classList.add("sel");
      var k = el.getAttribute("data-k");
      if(s.kind==="consent"){
        if(k==="n"){ lockUntil = 0; showModal("<h2>¿Confirmar que no acepta participar?</h2><p>La encuesta termina aquí y no se guarda ninguna respuesta.</p>", [["Sí, no acepta", refuse, "danger"], ["Volver", function(){ render(); }, "secondary"]]); return; }
        draft.answers[F.consent.entry] = F.consent.yes; setTimeout(next, 220); return;
      }
      if(k==="other"){ lockUntil = 0; draft.answers[s.item.entry] = "__other_option__"; save(DKEY, draft);
        document.getElementById("otherbox").classList.remove("hidden"); var t=document.getElementById("othertxt"); t.focus();
        bindOther(s); return; }
      var val = s.item.options[+k];
      draft.answers[s.item.entry] = val;
      if(s.item.other) delete draft.other[s.item.entry];
      if(s.item.exclude && s.item.exclude.indexOf(val)>=0){ setTimeout(function(){ ineligible(s.item.key==="tiempo" ? "Diagnóstico de menos de un mes" : "No reside en el Área Metropolitana de Caracas"); }, 220); return; }
      setTimeout(next, 220);
    };
  });
  bindOther(s);
}
function bindOther(s){
  var ot = document.getElementById("othernext");
  if(ot) ot.onclick = function(){ var t=document.getElementById("othertxt"); if(!t.value.trim()){ t.focus(); return; } draft.other[s.item.entry]=t.value.trim(); draft.answers[s.item.entry]="__other_option__"; t.blur(); next(); };
}

function endScreen(icon, title, sub){
  app.innerHTML = '<div class="wrap center" style="padding-top:16vh"><div class="big">'+icon+'</div><h1>'+title+'</h1><p class="muted">'+sub+'</p><button class="btn" id="h">Volver al inicio</button></div>';
  document.getElementById("h").onclick = home;
}
function refuse(){ save(RKEY, load(RKEY,0)+1); del(DKEY); draft=null; endScreen("🙏","Gracias por su tiempo","No se guardó ninguna respuesta."); }
function ineligible(reason){
  save(NKEY, load(NKEY,0)+1); del(DKEY); draft=null;
  endScreen("🙏","Muchas gracias por su tiempo","Por los criterios del estudio, no es necesario que continúe. No se guardaron respuestas.<br><span class='small'>("+esc(reason)+")</span>");
}

/* ---------- finalizar ---------- */
function finish(){
  for(var i=0;i<STEPS.length;i++){ var s=STEPS[i];
    var missing = (s.kind==="multi") ? !(draft.multi[s.item.entry]||[]).length : (isQ(s) && !draft.answers[s.item.entry]);
    if(missing){ draft.step=i; render(); showModal("<h2>Falta una respuesta</h2><p>Esta pregunta quedó sin responder.</p>", [["Responder"]]); return; } }
  var sc = computeScores(draft.answers);
  var rec = { id: draft.id, inicio: draft.start, fin: new Date().toISOString(), recolector: draft.recolector, lugar: draft.lugar,
              answers: draft.answers, multi: draft.multi, other: draft.other, estado: "pendiente", enviado: null, intentos: 0,
              bdiTotal: sc.bdiTotal, pssTotal: sc.pssTotal, item9: sc.item9, v: 2 };
  var recs = records(); if(!recs.some(function(r){ return r.id===rec.id; })) recs.push(rec);
  if(!save(KEY, recs)) return;
  del(DKEY); draft = null;
  app.innerHTML = '<div class="wrap center" style="padding-top:16vh"><div class="big">💙</div><h1>¡Muchas gracias por participar!</h1><p class="muted">'+esc(F.thanks)+'</p><p class="muted">Por favor, devuelva el iPad a la persona encuestadora.</p><button class="btn secondary" id="inv" style="margin-top:40px">Encuestador: continuar ›</button></div>';
  document.getElementById("inv").onclick = function(){ researcher(rec, recs.length); };
}
function researcher(rec, n){
  var risk = rec.item9>=1;
  app.innerHTML = '<div class="wrap"><div class="sec">Solo para el encuestador</div><h1>Encuesta n.º '+n+' guardada en este iPad</h1>'+
    (risk ? '<div class="alert danger"><b>Atención: ítem 9 del BDI-II = '+rec.item9+'</b> ('+esc(F.sections[3].items[8].options[rec.item9])+').<br>Antes de que el paciente se retire, aplique el protocolo de riesgo acordado con su tutora y el servicio (avisar al equipo tratante / psicología del hospital).</div>' : '')+
    '<div class="card"><b>BDI-II total:</b> '+rec.bdiTotal+' ('+bdiLevel(rec.bdiTotal)+')<br><span class="small muted">Dato orientativo para el encuestador. No es un diagnóstico.</span></div>'+
    '<div class="alert ok">Quedó guardada. Se envía al Form cuando toques “Enviar” con internet.</div>'+
    '<button class="btn" id="h">Ir al inicio</button></div>';
  document.getElementById("h").onclick = home;
}

/* ---------- envío al Google Form ---------- */
function payload(r){
  var p = new URLSearchParams();
  Object.keys(r.answers).forEach(function(e){ p.append("entry."+e, r.answers[e]); });
  var m = r.multi || {};
  Object.keys(m).forEach(function(e){ (m[e]||[]).forEach(function(v){ p.append("entry."+e, v); }); });
  var o = r.other || {};
  Object.keys(o).forEach(function(e){ p.append("entry."+e+".other_option_response", o[e]); });
  p.append("pageHistory", F.pageHistory); p.append("fvv","1");
  return p;
}
function realInternet(){
  // Comprueba internet de verdad (y no un Wi-Fi con portal cautivo) pidiendo un archivo propio sin caché.
  var ctrl = ("AbortController" in window) ? new AbortController() : null;
  var t = setTimeout(function(){ if(ctrl) ctrl.abort(); }, 8000);
  return fetch("ping.txt?t="+Date.now(), {cache:"no-store", signal: ctrl ? ctrl.signal : undefined})
    .then(function(r){ return r.ok ? r.text() : ""; })
    .then(function(t){ return t.trim()==="ok-tesis"; })
    .catch(function(){ return false; })
    .then(function(v){ clearTimeout(t); return v; });
}
var syncing = false;
function syncAll(){
  if(syncing) return;
  var pend = records().filter(function(r){ return r.estado==="pendiente"; });
  if(!pend.length) return;
  syncing = true;
  modal.innerHTML = '<div class="modal"><div class="card center"><h2>Comprobando internet…</h2></div></div>';
  realInternet().then(function(ok){
    if(!ok){ syncing=false; modal.innerHTML=""; showModal("<h2>Todavía no hay internet</h2><p>Las encuestas siguen guardadas en este iPad. Intente de nuevo cuando tenga señal o Wi-Fi.</p>", [["OK", home]]); return; }
    var i = 0, ok2 = 0, fail = 0;
    modal.innerHTML = '<div class="modal"><div class="card center"><h2>Enviando…</h2><p id="prog">0 de '+pend.length+'</p><p class="small muted">No cierre la app.</p></div></div>';
    (function step(){
      if(i>=pend.length){ syncing=false; modal.innerHTML=""; showModal("<h2>Listo</h2><p>Enviadas: "+ok2+(fail?"<br>No se pudieron enviar: "+fail+" (siguen pendientes; reintente luego)":"")+"</p><p class='small muted'>Revise en Google Forms → Respuestas que el número subió.</p>", [["OK", home]]); return; }
      var r = pend[i];
      fetch(F.action, { method:"POST", mode:"no-cors", body: payload(r) })
        .then(function(){ mark(r.id, true); ok2++; }, function(){ mark(r.id, false); fail++; })
        .then(function(){ i++; var pr=document.getElementById("prog"); if(pr) pr.textContent = i+" de "+pend.length; setTimeout(step, 700); });
    })();
  });
}
function mark(id, success){
  var recs = records();
  recs.forEach(function(r){ if(r.id===id){ r.intentos=(r.intentos||0)+1; if(success){ r.estado="enviada"; r.enviado=new Date().toISOString(); } } });
  save(KEY, recs);
}

/* ---------- respaldos ---------- */
function stamp(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+"_"+String(d.getHours()).padStart(2,"0")+String(d.getMinutes()).padStart(2,"0"); }
function deliver(name, text, type){
  var blob = new Blob([text], {type:type});
  try{
    var file = new File([blob], name, {type:type});
    if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file], title:name}).catch(function(){}); return; }
  }catch(e){}
  var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function csvCell(v){ v = v==null ? "" : String(v); return /[",;\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; }
function exportCSV(){
  var recs = records(); if(!recs.length){ showModal("<h2>Aún no hay registros</h2>", [["OK"]]); return; }
  var head = ["id","inicio","fin","recolector","lugar","estado","enviado","sexo","edad","diagnostico","tiempo_diagnostico","situacion_laboral","reside_AMC"];
  var i; for(i=1;i<=28;i++) head.push("AS"+i); for(i=1;i<=14;i++) head.push("PSS"+i); for(i=1;i<=21;i++) head.push("BDI"+i);
  head.push("PSS_total","BDI_total");
  var rows = [head.join(",")];
  recs.forEach(function(r){
    var a=r.answers||{}, m=r.multi||{}, o=r.other||{}, sc=computeScores(a);
    var lab = a[LAB]==="__other_option__" ? "Otro: "+(o[LAB]||r.other||"") : a[LAB];
    var dg = (m[DIAG]||[]).map(function(v){ return v==="__other_option__" ? "Otra: "+(o[DIAG]||"") : v; }).join(" | ");
    var row = [r.id,r.inicio,r.fin,r.recolector,r.lugar,r.estado,r.enviado||"",a["1583913644"],a["2032496543"],dg,a["1018884691"],lab,a["675845344"]].concat(sc.as, sc.pss, sc.bdi, [sc.pssTotal, sc.bdiTotal]);
    rows.push(row.map(csvCell).join(","));
  });
  deliver("respaldo_encuestas_"+stamp()+".csv", "﻿"+rows.join("\n"), "text/csv");
}
function exportJSON(){ deliver("respaldo_encuestas_"+stamp()+".json", JSON.stringify({app:"tesisCardio", version:window.APP_VERSION, exportado:new Date().toISOString(), registros:records(), rechazos:load(RKEY,0), noElegibles:load(NKEY,0)}, null, 1), "application/json"); }
function importJSON(ev){
  var f = ev.target.files[0]; if(!f) return;
  var rd = new FileReader();
  rd.onload = function(){
    try{
      var data = JSON.parse(rd.result), inc = data.registros||[], recs = records(), ids = {}, add = 0;
      recs.forEach(function(r){ ids[r.id]=1; });
      inc.forEach(function(r){ if(r && r.id && r.answers && !ids[r.id]){ recs.push(r); add++; } });
      save(KEY, recs); showModal("<h2>Importado</h2><p>"+add+" registro(s) nuevos (los repetidos se ignoran).</p>", [["OK", home]]);
    }catch(e){ showModal("<h2>Archivo no válido</h2>", [["OK"]]); }
  };
  rd.readAsText(f);
}
function listView(){
  var recs = records().slice().reverse();
  app.innerHTML = '<div class="wrap"><button class="iconbtn" id="h">‹ Inicio</button><h1>Registros en este iPad</h1>'+
    (recs.length ? '<div class="card list">'+recs.map(function(r, k){ return '<div class="it"><span>#'+(recs.length-k)+' · '+fmt(r.fin)+' · '+esc(r.recolector||"—")+(r.item9>=1?' · <b style="color:var(--danger)">ítem 9 = '+r.item9+'</b>':'')+'</span><span class="tag '+(r.estado==="enviada"?'s':'p')+'">'+(r.estado==="enviada"?'enviada':'pendiente')+'</span></div>'; }).join("")+'</div>' : '<p class="muted">Todavía no hay encuestas.</p>')+
    '<p class="small muted">Las encuestas enviadas se conservan aquí como respaldo. Nunca se borran solas.</p></div>';
  document.getElementById("h").onclick = home;
}

/* ---------- arranque ---------- */
window.addEventListener("error", function(){ try{ if(draft) save(DKEY, draft); }catch(e){} });
if("serviceWorker" in navigator){ window.addEventListener("load", function(){ navigator.serviceWorker.register("sw.js").catch(function(){}); }); }
home();
})();
