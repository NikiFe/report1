/* === Enhancements: auto language, sticky divider reveal, reduced-motion class === */
document.addEventListener('DOMContentLoaded', function () {
  try { autoDetectLanguage(); } catch(e) {}
  try { initSectionReveal(); } catch(e) {}
  try { ensureReduceMotionClass(); } catch(e) {}
  try { patchScrollingForMotionPref(); } catch(e) {}
});

/* Determine the correct scroll behavior based on user/OS preference */
function getScrollBehavior(){
  var reduced = false;
  try {
    if (document.documentElement.classList.contains('reduce-motion')) reduced = true;
    else if (matchMedia('(prefers-reduced-motion: reduce)').matches) reduced = true;
    else {
      var stored = localStorage.getItem('prefersMotion');
      if (stored !== null) reduced = (stored === 'false');
    }
  } catch(e) {}
  return reduced ? 'auto' : 'smooth';
}

/* Replace hardcoded smooth scrolling in Back-to-top and shortcuts */
function patchScrollingForMotionPref(){
  // Back-to-top
  var back = document.getElementById('backToTop');
  if (back) {
    back.removeEventListener && back.removeEventListener('_rm_scroll', back._rm_scroll_handler || function(){});
    back._rm_scroll_handler = function(ev){
      ev.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: getScrollBehavior() });
    };
    back.addEventListener('click', back._rm_scroll_handler);
  }
  // Number-key / shortcut navigation
  if (typeof initShortcuts === 'function' && !patchScrollingForMotionPref._wrapped) {
    var _orig = initShortcuts;
    initShortcuts = function(){
      _orig();
      document.querySelectorAll('[data-jump]').forEach(function(el){
        el._rm_scroll_handler = function(e){
          var id = this.getAttribute('href') || this.dataset.jump;
          if (!id) return;
          var t = document.querySelector(id);
          if (!t) return;
          e.preventDefault();
          t.scrollIntoView({ behavior: getScrollBehavior(), block: 'start', inline: 'nearest' });
        };
        el.addEventListener('click', el._rm_scroll_handler);
      });
    };
    patchScrollingForMotionPref._wrapped = true;
  }
}
/* Auto-detect browser language on first visit (en/cs/de) */
function autoDetectLanguage(){
  var saved = null;
  try { saved = localStorage.getItem('prefLang'); } catch(e) {}
  if (!saved) {
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    var guess = nav.startsWith('cs') ? 'cs' : (nav.startsWith('de') ? 'de' : 'en');
    if (typeof setLanguage === 'function') { setLanguage(guess); }
    else { document.documentElement.lang = guess; }
    try { localStorage.setItem('prefLang', document.documentElement.lang); } catch(e) {}
  }
}

/* Add .revealed to sections when they enter viewport -> animates the divider underline */
function initSectionReveal(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { rootMargin: "0px 0px -60% 0px", threshold: 0.1 });
  document.querySelectorAll('main section').forEach(function(sec){ io.observe(sec); });
}

/* Ensure the html gets the .reduce-motion class according to saved/OS pref */
function ensureReduceMotionClass(){
  var prefers = false, stored = null;
  try { prefers = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) {}
  try { stored = localStorage.getItem('prefersMotion'); } catch(e) {}
  var motionOn = stored !== null ? (stored === 'true') : !prefers; // true = animations allowed
  document.documentElement.classList.toggle('reduce-motion', !motionOn);
}
/* === Enhancements: auto language, sticky divider reveal, reduced-motion class === */
document.addEventListener('DOMContentLoaded', function () {
  try { autoDetectLanguage(); } catch(e) {}
  try { initSectionReveal(); } catch(e) {}
  try { ensureReduceMotionClass(); } catch(e) {}
});

/* Auto-detect browser language on first visit (en/cs/de) */
function autoDetectLanguage(){
  var saved = null;
  try { saved = localStorage.getItem('prefLang'); } catch(e) {}
  if (!saved) {
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    var guess = nav.startsWith('cs') ? 'cs' : (nav.startsWith('de') ? 'de' : 'en');
    // If your app already exposes setLanguage(lang), prefer calling it:
    if (typeof setLanguage === 'function') { setLanguage(guess); }
    else {
      // Fallback: set <html lang> only; your existing translation will still run after.
      document.documentElement.lang = guess;
    }
    try { localStorage.setItem('prefLang', document.documentElement.lang); } catch(e) {}
  }
}

/* Add .revealed to sections when they enter viewport -> animates the divider underline */
function initSectionReveal(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { rootMargin: "0px 0px -60% 0px", threshold: 0.1 });
  document.querySelectorAll('main section').forEach(function(sec){ io.observe(sec); });
}

/* Ensure the html gets the .reduce-motion class according to saved/OS pref */
function ensureReduceMotionClass(){
  var prefers = false, stored = null;
  try { prefers = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) {}
  try { stored = localStorage.getItem('prefersMotion'); } catch(e) {}
  var motionOn = stored !== null ? (stored === 'true') : !prefers; // true means animations allowed
  document.documentElement.classList.toggle('reduce-motion', !motionOn);
}
/* === Accessibility/Prefs Fixes (append to end of file) ===
   These patches ensure the “Reduce motion” and “High contrast” buttons
   visibly affect the UI even if earlier init code didn’t toggle classes. */
document.addEventListener('DOMContentLoaded', function () {
  var html = document.documentElement;
  var motionBtn = document.getElementById('motionToggle');
  var hcBtn = document.getElementById('themeToggle');

  /* ----- Initial state from user prefs or media query ----- */
  try {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var storedMotion = localStorage.getItem('prefersMotion');
    var motionOn = storedMotion !== null ? (storedMotion === 'true') : !prefersReduced;
    // If motion is OFF, enable the reduce-motion class
    html.classList.toggle('reduce-motion', !motionOn);
  } catch (e) {}

  try {
    var hcStored = localStorage.getItem('highContrast') === 'true';
    html.classList.toggle('high-contrast', hcStored);
  } catch (e) {}

  /* ----- Live toggles ----- */
  if (motionBtn) {
    motionBtn.addEventListener('click', function () {
      // Toggle the class based on current state
      var isReduced = html.classList.contains('reduce-motion');
      html.classList.toggle('reduce-motion', !isReduced);
      try {
        localStorage.setItem('prefersMotion', String(isReduced)); // inverse of class
      } catch (e) {}
      var lr = document.getElementById('live-region');
      if (lr) { lr.textContent = (isReduced ? 'Animations enabled' : 'Animations reduced'); }
    });
  }

  if (hcBtn) {
    hcBtn.addEventListener('click', function () {
      var nowOn = !html.classList.contains('high-contrast');
      html.classList.toggle('high-contrast', nowOn);
      try { localStorage.setItem('highContrast', String(nowOn)); } catch (e) {}
      var lr = document.getElementById('live-region');
      if (lr) { lr.textContent = (nowOn ? 'High contrast on' : 'High contrast off'); }
    });
  }
});

/* Motion-safe programmatic scrolling: honor Reduce Motion for all calls */
(function installMotionSafeScrolling(){
  function prefersReducedMotionActive(){
    try{
      if (document.documentElement.classList.contains('reduce-motion')) return true;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      var stored = localStorage.getItem('prefersMotion');
      if (stored !== null) return (stored === 'false');
    }catch(e){}
    return false;
  }

  var _origScrollTo = window.scrollTo.bind(window);
  window.scrollTo = function(a, b){
    if (typeof a === 'object' && a){
      var opts = Object.assign({}, a);
      if (prefersReducedMotionActive()) opts.behavior = 'auto';
      return _origScrollTo(opts);
    }
    if (typeof a === 'number' || typeof b === 'number'){
      if (prefersReducedMotionActive()){
        return _origScrollTo({
          top: (typeof a === 'number' ? a : 0),
          left: (typeof b === 'number' ? b : 0),
          behavior: 'auto'
        });
      }
    }
    return _origScrollTo(a, b);
  };

  var _origScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(arg){
    if (arg && typeof arg === 'object'){
      var opts = Object.assign({}, arg);
      if (prefersReducedMotionActive()) opts.behavior = 'auto';
      return _origScrollIntoView.call(this, opts);
    }
    if (arg === undefined || typeof arg === 'boolean'){
      if (prefersReducedMotionActive()){
        return _origScrollIntoView.call(this, { behavior: 'auto', block: 'start', inline: 'nearest' });
      }
    }
    return _origScrollIntoView.call(this, arg);
  };
})();
(function(){
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const live = $('#live-region');

  const state = {
    lang: document.documentElement.lang || 'en',
    motion: true,
    highContrast: false,
    font: 'sans',
    chartScales: { 'demographics-chart':'percent', 'satisfaction-chart':'value' }
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    safe(initPrefs);
    safe(initLang);
    safe(initCharts);
    safe(initActions);
    safe(initBackToTop);
    safe(initShortcuts);
    safe(updateGeneratedOn);
  });

  function safe(fn){ try{ fn(); } catch(e){ console.error(e); } }
  function announce(msg){ if(!live||!msg) return; live.textContent=''; setTimeout(()=>{ live.textContent=msg; }, 30); }
  function setPressed(el, on){ if(el) el.setAttribute('aria-pressed', on?'true':'false'); }

  /* ===== Prefs ===== */
  function initPrefs(){
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const savedMotion = localStorage.getItem('prefersMotion');
    state.motion = savedMotion !== null ? (savedMotion==='true') : !prefersReduced;

    const motionBtn = $('#motionToggle');
    setPressed(motionBtn, state.motion);
    updateMotionLabel(motionBtn);
    document.documentElement.classList.toggle('reduce-motion', !state.motion);
    if(motionBtn) motionBtn.addEventListener('click', ()=>{
      state.motion=!state.motion;
      localStorage.setItem('prefersMotion', String(state.motion));
      setPressed(motionBtn, state.motion);
      updateMotionLabel(motionBtn);
      document.documentElement.classList.toggle('reduce-motion', !state.motion);
      announce(tr('Animations updated'));
    });

    const hcBtn = $('#themeToggle');
    const savedHC = localStorage.getItem('highContrast');
    state.highContrast = savedHC === 'true';
    setPressed(hcBtn, state.highContrast);
    updateHCLabel(hcBtn);
    document.documentElement.classList.toggle('high-contrast', state.highContrast);
    if(hcBtn) hcBtn.addEventListener('click', ()=>{
      state.highContrast=!state.highContrast;
      localStorage.setItem('highContrast', String(state.highContrast));
      setPressed(hcBtn, state.highContrast);
      updateHCLabel(hcBtn);
      document.documentElement.classList.toggle('high-contrast', state.highContrast);
      announce(tr('Contrast updated'));
    });

    const fontSel = $('#fontSelect');
    const savedFont = localStorage.getItem('prefFont') || 'sans';
    state.font = savedFont;
    if(fontSel) fontSel.value = state.font;
    applyFont();
    if(fontSel) fontSel.addEventListener('change', e=>{
      state.font = e.target.value;
      localStorage.setItem('prefFont', state.font);
      applyFont();
      announce(tr('Typeface set'));
    });
  }
  function applyFont(){
    document.documentElement.classList.remove('font-serif','font-mono');
    if(state.font==='serif') document.documentElement.classList.add('font-serif');
    if(state.font==='mono') document.documentElement.classList.add('font-mono');
  }
  function updateMotionLabel(btn){
    if(!btn) return;
    const t={en: state.motion?'Reduce motion: Off':'Reduce motion: On',
             cs: state.motion?'Omezit pohyb: Vyp':'Omezit pohyb: Zap',
             de: state.motion?'Bewegung reduzieren: Aus':'Bewegung reduzieren: Ein'};
    btn.textContent=t[state.lang];
  }
  function updateHCLabel(btn){
    if(!btn) return;
    const t={en: state.highContrast?'High contrast: On':'High contrast: Off',
             cs: state.highContrast?'Vysoký kontrast: Zap':'Vysoký kontrast: Vyp',
             de: state.highContrast?'Hoher Kontrast: Ein':'Hoher Kontrast: Aus'};
    btn.textContent=t[state.lang];
  }

  /* ===== Language ===== */
  function initLang(){
    $$('.lang-btn').forEach(b=>{ setPressed(b, b.dataset.lang===state.lang); b.addEventListener('click', ()=>setLanguage(b.dataset.lang)); });
    translateDOM();
    localizeDates();
  }
  function setLanguage(lang){
    state.lang = lang; document.documentElement.lang = lang;
    $$('.lang-btn').forEach(b=>setPressed(b, b.dataset.lang===lang));
    translateDOM(); localizeDates(); initCharts();
    updateMotionLabel($('#motionToggle')); updateHCLabel($('#themeToggle'));
    announce(tr('Language switched'));
  }
  function translateDOM(){
    $$('[data-en]').forEach(el=>{
      const key = 'data-' + (state.lang==='cs'?'cs':state.lang==='de'?'de':'en');
      const v = el.getAttribute(key); if(v) el.textContent = v;
    });
    $$('option[data-en]').forEach(opt=>{
      const key = 'data-' + (state.lang==='cs'?'cs':state.lang==='de'?'de':'en');
      const v = opt.getAttribute(key); if(v) opt.textContent=v;
    });
  }
  function localizeDates(){
    const d = new Date('2025-03-12T00:00:00');
    const fmt = new Intl.DateTimeFormat(locale(), {year:'numeric',month:'long',day:'numeric'});
    const el = $('#report-date'); if(el) el.textContent = fmt.format(d);
    const gen = new Date();
    const genFmt = new Intl.DateTimeFormat(locale(), {dateStyle:'full', timeStyle:'short'});
    const go = $('#generated-on'); if(go) go.textContent = genFmt.format(gen);
  }
  function locale(){ return state.lang==='cs'?'cs-CZ':state.lang==='de'?'de-DE':'en-US'; }

  /* ===== Charts ===== */
  function initCharts(){
    const demoT = $('#demographics-table');
    if(demoT) {
      const rows = Array.from(demoT.tBodies[0].rows).map(r=>({label:r.cells[0].textContent.trim(), count:parseFloat(r.cells[1].textContent), percent:parseFloat(r.cells[2].textContent) }));
      renderBars('#demographics-chart', rows.map(r=>({label:r.label, a: state.chartScales['demographics-chart']==='percent'? r.percent : r.count })), state.chartScales['demographics-chart']);
    }
    const satT = $('#satisfaction-table');
    if(satT){
      const items = Array.from(satT.tBodies[0].rows).map(r=>({label:r.cells[0].textContent.trim(), members:parseFloat(r.cells[1].textContent), others:parseFloat(r.cells[2].textContent)}));
      renderGrouped('#satisfaction-chart', items, state.chartScales['satisfaction-chart']);
    }
  }

  function renderBars(sel, rows, scale){
    const root=$(sel); if(!root) return; root.innerHTML='';
    const svg = createSVG(); root.appendChild(svg);
    const pad={t:12,r:24,b:32,l:160};
    const width=Math.max(root.clientWidth,640);
    const barH=28, gap=12, height=pad.t+pad.b+rows.length*(barH+gap);
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const max= scale==='percent'?100:Math.max(1,...rows.map(r=>r.a));
    rows.forEach((r,i)=>{
      const y=pad.t+i*(barH+gap);
      svg.appendChild(text(pad.l-8,y+barH*.7,r.label,'end'));
      const w=(width-pad.l-pad.r)*(r.a/max);
      const g=group('bar');
      g.appendChild(rect(pad.l,y,Math.max(4,w),barH));
      const value= scale==='percent'? `${Math.round(r.a)}%` : String(r.a);
      const label=text(pad.l+Math.max(4,w)+6,y+barH*.7,value,'start'); g.appendChild(label);
      const focus=rect(pad.l,y,Math.max(4,w),barH); focus.setAttribute('fill','transparent'); focus.setAttribute('tabindex','0');
      focus.setAttribute('aria-label',`${r.label}: ${value}`);
      bindTooltip(focus,value); g.appendChild(focus);
      svg.appendChild(g);
    });
  }

  function renderGrouped(sel, items, scale){
    const root=$(sel); if(!root) return; root.innerHTML='';
    const svg = createSVG(); root.appendChild(svg);
    const pad={t:12,r:24,b:36,l:160};
    const width=Math.max(root.clientWidth,640);
    const rowH=30, gap=12, height=pad.t+pad.b+items.length*(rowH+gap);
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const max= scale==='percent'?100:5;
    items.forEach((it,i)=>{
      const y=pad.t+i*(rowH+gap);
      svg.appendChild(text(pad.l-8,y+rowH*.7,it.label,'end'));
      const m= scale==='percent'? Math.round((it.members/5)*100) : it.members;
      const o= scale==='percent'? Math.round((it.others/5)*100) : it.others;
      const mW=(width-pad.l-pad.r)*(m/max);
      const oW=(width-pad.l-pad.r)*(o/max);
      const g=group('bar');
      const r1=rect(pad.l,y,Math.max(4,mW),rowH); r1.classList.add('series-1');
      const r2=rect(pad.l,y,Math.max(4,oW),rowH); r2.classList.add('series-2');
      g.append(r1,r2);
      const v= scale==='percent'? `${m}% / ${o}%` : `${it.members.toFixed(2)} / ${it.others.toFixed(2)}`;
      const label=text(pad.l+Math.max(mW,oW)+6,y+rowH*.7,v,'start'); g.appendChild(label);
      const focus=rect(pad.l,y,Math.max(mW,oW,4),rowH); focus.setAttribute('fill','transparent'); focus.setAttribute('tabindex','0'); focus.setAttribute('aria-label',`${it.label}: ${v}`);
      bindTooltip(focus,v); g.appendChild(focus);
      svg.appendChild(g);
    });
  }

  // SVG helpers
  function createSVG(){ const s=document.createElementNS('http://www.w3.org/2000/svg','svg'); s.setAttribute('role','img'); return s; }
  function group(c){ const n=document.createElementNS('http://www.w3.org/2000/svg','g'); if(c) n.setAttribute('class',c); return n; }
  function rect(x,y,w,h){ const n=document.createElementNS('http://www.w3.org/2000/svg','rect'); n.setAttribute('x',x); n.setAttribute('y',y); n.setAttribute('width',w); n.setAttribute('height',h); return n; }
  function text(x,y,str,anchor='start'){ const n=document.createElementNS('http://www.w3.org/2000/svg','text'); n.setAttribute('x',x); n.setAttribute('y',y); n.setAttribute('text-anchor',anchor); n.textContent=str; return n; }

  // Tooltip
  const tip = $('#tooltip');
  function bindTooltip(target, txt){
    if(!tip) return;
    const show = (e)=>{ tip.textContent=txt; tip.style.display='block'; const r=target.getBoundingClientRect(); tip.style.left=(r.left+r.width)+'px'; tip.style.top=(r.top)+'px';};
    const hide = ()=>{ tip.style.display='none'; };
    target.addEventListener('mousemove', show);
    target.addEventListener('mouseleave', hide);
    target.addEventListener('focus', show);
    target.addEventListener('blur', hide);
  }

  /* ===== Actions ===== */
  function initActions(){
    $$('.action-btn').forEach(btn=>btn.addEventListener('click', ()=>{
      const act=btn.dataset.action, target=btn.dataset.target;
      if(act==='toggle-scale'){
        const cur=state.chartScales[target];
        state.chartScales[target]=(target==='demographics-chart')?(cur==='percent'?'count':'percent'):(cur==='value'?'percent':'value');
        initCharts(); announce(tr('Chart scale toggled'));
      }
      if(act==='download-csv'){
        const fig = document.getElementById(target);
        let table = fig ? fig.querySelector('table') : null;
        if (!table) { if(target.includes('demographics')) table=$('#demographics-table'); if(target.includes('satisfaction')) table=$('#satisfaction-table'); }
        if (table) downloadCSV(table, target+'.csv');
      }
      if(act==='download-svg'){
        const svg = document.getElementById(target)?.querySelector('svg'); if(svg) downloadSVG(svg, target+'.svg');
      }
    }));
  }
  function downloadCSV(table, name){
    const rows = Array.from(table.querySelectorAll('tr')).map(tr=>Array.from(tr.children).map(td=>('"'+(td.textContent||'').replace(/"/g,'""').trim()+'"')).join(','));
    const blob=new Blob([rows.join('\n')],{type:'text/csv'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},0);
  }
  function downloadSVG(svg, name){
    const src = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([src], {type:'image/svg+xml'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},0);
  }

  /* ===== Back to top ===== */
  function initBackToTop(){
    const btn=$('#backToTop'); if(!btn) return;
    const onScroll=()=>{ if(scrollY>400) btn.classList.add('show'); else btn.classList.remove('show'); };
    addEventListener('scroll', onScroll, {passive:true}); onScroll();
    btn.addEventListener('click', ()=>scrollTo({top:0,behavior:'smooth'}));
  }

  /* ===== Shortcuts (international) ===== */
  function initShortcuts(){
    const ids=['overview','demographics','satisfaction','policy','feedback','concerns','debate','conclusion'];
    addEventListener('keydown', (e)=>{
      const tag=(e.target.tagName||'').toLowerCase(); if(tag==='input'||tag==='textarea'||tag==='select') return;
      const c=e.code;
      const n = (/^Digit[1-8]$/.test(c)) ? Number(c.slice(-1)) : (/^Numpad[1-8]$/.test(c)) ? Number(c.slice(-1)) : null;
      if (n){ const el=document.getElementById(ids[n-1]); if(el){ el.scrollIntoView({behavior:'smooth',block:'start'}); announce(tr('Jumped to section') + ': ' + (el.querySelector('h2')?.textContent||'')); } }
      if (e.key.toLowerCase()==='g'){ const order=['en','cs','de']; setLanguage(order[(order.indexOf(state.lang)+1)%order.length]); }
      if (e.key.toLowerCase()==='m'){ $('#motionToggle')?.click(); }
      if (e.key.toLowerCase()==='h'){ $('#themeToggle')?.click(); }
      if (e.key.toLowerCase()==='b'){ scrollTo({top:0,behavior:'smooth'}); }
    });
  }

  function updateGeneratedOn(){
    const el=$('#generated-on'); if(!el) return;
    el.textContent=new Intl.DateTimeFormat(locale(), {dateStyle:'full',timeStyle:'short'}).format(new Date());
  }

  function tr(s){
    const m={
      'Animations updated':{cs:'Animace aktualizovány',de:'Animationen aktualisiert'},
      'Contrast updated':{cs:'Kontrast aktualizován',de:'Kontrast aktualisiert'},
      'Typeface set':{cs:'Písmo nastaveno',de:'Schriftart gesetzt'},
      'Language switched':{cs:'Jazyk přepnut',de:'Sprache gewechselt'},
      'Chart scale toggled':{cs:'Měřítko grafu přepnuto',de:'Diagrammskala umgeschaltet'},
      'Jumped to section':{cs:'Přeskočeno do sekce',de:'Zur Sektion gesprungen'}
    };
    const e=m[s]; if(!e) return s; return state.lang==='cs'?e.cs:state.lang==='de'?e.de:s;
  }
})();