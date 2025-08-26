/* Accessibility-first, dependency-free script
 * - Language switching with <html lang> update and localized dates
 * - Reduced motion & high-contrast toggles (saved to localStorage)
 * - Accessible bar charts rendered with simple DOM/SVG-like divs
 * - Keyboard and UX helpers (back to top)
 */

(function () {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const state = {
    lang: 'en',
    motion: true,
    highContrast: false,
    charts: {}
  };

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initPrefs();
    initLang();
    renderCharts();
    updateGeneratedOn();
    initBackToTop();
  });

  /* ========= Preferences (motion, contrast) ========= */
  function initPrefs() {
    // Motion: system preference + saved override
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const savedMotion = localStorage.getItem('prefersMotion');
    state.motion = savedMotion !== null ? savedMotion === 'true' : !prefersReduced;

    const motionBtn = $('#motionToggle');
    setPressed(motionBtn, !prefersReduced && state.motion);
    updateMotionLabel(motionBtn);

    motionBtn.addEventListener('click', () => {
      state.motion = !state.motion;
      localStorage.setItem('prefersMotion', String(state.motion));
      setPressed(motionBtn, state.motion);
      updateMotionLabel(motionBtn);
      $('#motion-status').textContent = state.motion ? 'Animations enabled' : 'Animations reduced';
      // (Optional) animate numbers on enable; kept minimal for accessibility
      if (state.motion) animateCardValues(); else resetCardValues();
    });

    // High contrast
    const hcBtn = $('#themeToggle');
    const savedHC = localStorage.getItem('highContrast');
    state.highContrast = savedHC === 'true';
    setPressed(hcBtn, state.highContrast);
    updateHCLabel(hcBtn);
    if (state.highContrast) document.documentElement.classList.add('high-contrast');

    hcBtn.addEventListener('click', () => {
      state.highContrast = !state.highContrast;
      localStorage.setItem('highContrast', String(state.highContrast));
      setPressed(hcBtn, state.highContrast);
      updateHCLabel(hcBtn);
      document.documentElement.classList.toggle('high-contrast', state.highContrast);
    });
  }

  function setPressed(el, pressed) { el.setAttribute('aria-pressed', pressed ? 'true' : 'false'); }
  function updateMotionLabel(btn) {
    const en = state.motion ? 'Reduce motion: Off' : 'Reduce motion: On';
    const cs = state.motion ? 'Omezit pohyb: Vyp' : 'Omezit pohyb: Zap';
    btn.textContent = state.lang === 'cs' ? cs : en;
  }
  function updateHCLabel(btn) {
    const en = state.highContrast ? 'High contrast: On' : 'High contrast: Off';
    const cs = state.highContrast ? 'Vysoký kontrast: Zap' : 'Vysoký kontrast: Vyp';
    btn.textContent = state.lang === 'cs' ? cs : en;
  }

  /* ========= Language ========= */
  function initLang() {
    // Default from <html lang>, else en
    state.lang = document.documentElement.lang || 'en';
    // Buttons
    const btns = $$('.lang-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        document.documentElement.lang = state.lang;
        // update aria-pressed
        btns.forEach(b => setPressed(b, b === btn));
        // translate all [data-en][data-cs]
        translateDOM();
        // localize dates
        localizeDates();
        // Update preference labels
        updateMotionLabel($('#motionToggle'));
        updateHCLabel($('#themeToggle'));
        // Update structured data language (for crawlers)
        const ld = $('#structured-data');
        try {
          const json = JSON.parse(ld.textContent);
          json.inLanguage = state.lang;
          ld.textContent = JSON.stringify(json);
        } catch {}
        // Re-render charts (labels)
        renderCharts(true);
      });
    });
    translateDOM();
    localizeDates();
    // Animate numbers once if motion allowed
    if (state.motion) animateCardValues();
  }

  function translateDOM() {
    $$('[data-en][data-cs]').forEach(el => {
      const key = 'data-' + state.lang;
      el.textContent = el.getAttribute(key);
    });
  }

  function localizeDates() {
    const d = new Date('2025-03-12T00:00:00');
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat(state.lang === 'cs' ? 'cs-CZ' : 'en-US', opts);
    $('#report-date').textContent = formatter.format(d);

    const gen = new Date();
    const genOpts = { dateStyle: 'full', timeStyle: 'short' };
    const genFmt = new Intl.DateTimeFormat(state.lang === 'cs' ? 'cs-CZ' : 'en-US', genOpts);
    $('#generated-on').textContent = genFmt.format(gen);
  }

  /* ========= Charts ========= */
  function renderCharts(updateOnly=false) {
    // Demographics: 3 vs 1 => 75% vs 25%
    const demoData = [
      { label: state.lang === 'cs' ? 'Členové FOR METRO' : 'FOR METRO Members', value: 75 },
      { label: state.lang === 'cs' ? 'Ostatní hráči' : 'Other Players', value: 25 }
    ];
    renderBars('#demographics-chart', demoData, { grouped: false, suffix: '%' });

    // Satisfaction grouped (members vs others) scaled to 100% of 5
    const labels = {
      economy: state.lang === 'cs' ? 'Ekonomika' : 'Economy',
      transport: state.lang === 'cs' ? 'Doprava' : 'Transportation',
      campaign: state.lang === 'cs' ? 'Kampaň' : 'Campaign',
      proposals: state.lang === 'cs' ? 'Návrhy' : 'Proposals'
    };
    const sat = [
      { label: labels.economy, series: [{v: 4.33, p: pct(4.33)}, {v: 2.0, p: pct(2.0)}] },
      { label: labels.transport, series: [{v: 4.67, p: pct(4.67)}, {v: 1.0, p: pct(1.0)}] },
      { label: labels.campaign, series: [{v: 4.0, p: pct(4.0)}, {v: 1.0, p: pct(1.0)}] },
      { label: labels.proposals, series: [{v: 4.0, p: pct(4.0)}, {v: 1.0, p: pct(1.0)}] },
    ];
    renderGroupedBars('#satisfaction-chart', sat);
  }

  function pct(v) { return Math.round((v/5) * 100); }

  function renderBars(selector, rows, { suffix = '%'} = {}) {
    const root = $(selector);
    root.innerHTML = '';
    rows.forEach(r => {
      const row = document.createElement('div');
      row.className = 'bar-row';
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = r.label;
      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('span');
      if (state.motion) requestAnimationFrame(() => requestAnimationFrame(() => fill.style.width = (r.value) + '%'));
      else fill.style.width = (r.value) + '%';
      const value = document.createElement('div');
      value.className = 'value';
      value.textContent = r.value + suffix;

      bar.appendChild(fill);
      row.append(label, bar, value);
      root.appendChild(row);
    });
  }

  function renderGroupedBars(selector, items) {
    const root = $(selector);
    root.innerHTML = '';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'bar-row';
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = item.label;

      const bar = document.createElement('div');
      bar.className = 'bar';

      const s1 = document.createElement('span');
      s1.className = 'series-1';
      const s2 = document.createElement('span');
      s2.className = 'series-2';

      if (state.motion) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          s1.style.width = item.series[0].p + '%';
          s2.style.width = item.series[1].p + '%';
        }));
      } else {
        s1.style.width = item.series[0].p + '%';
        s2.style.width = item.series[1].p + '%';
      }

      bar.append(s1, s2);

      const value = document.createElement('div');
      value.className = 'value';
      value.textContent = `${item.series[0].v.toFixed(2)} / ${item.series[1].v.toFixed(2)}`;

      row.append(label, bar, value);
      root.appendChild(row);
    });
  }

  /* ========= Numbers animation ========= */
  function animateCardValues() {
    $$('.card-value').forEach(el => {
      const target = parseFloat(el.dataset.value);
      let cur = 0;
      const stepMs = 20;
      const steps = Math.max(1, Math.round(800/stepMs));
      const delta = target / steps;
      const timer = setInterval(() => {
        cur += delta;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = Number.isInteger(target) ? Math.round(cur) : cur.toFixed(1);
      }, stepMs);
    });
  }
  function resetCardValues() {
    $$('.card-value').forEach(el => {
      const target = parseFloat(el.dataset.value);
      el.textContent = Number.isInteger(target) ? String(target) : target.toFixed(1);
    });
  }

  /* ========= Back to top ========= */
  function initBackToTop() {
    const btn = $('#backToTop');
    const onScroll = () => {
      if (window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  }

  /* ========= Utility ========= */
  function updateGeneratedOn() {
    const gen = new Date();
    const lang = document.documentElement.lang || 'en';
    const fmt = new Intl.DateTimeFormat(lang === 'cs' ? 'cs-CZ' : 'en-US',
      { dateStyle: 'full', timeStyle: 'short' });
    $('#generated-on').textContent = fmt.format(gen);
  }
})();