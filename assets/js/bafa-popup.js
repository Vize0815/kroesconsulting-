/*
  Kroes Consulting . BAFA Popup (self-contained)
  Einbinden: <script src="assets/js/bafa-popup.js" defer></script> vor </body>

  Oeffentliche API im Browser:
    KC.open()        Popup sofort zeigen
    KC.close()       Popup schliessen
    KC.reset()       Sperre loeschen (zum Testen)
    KC.isSuppressed  true, wenn aktuell unterdrueckt
*/
(function () {
  "use strict";

  // ============ KONFIGURATION ============
  var CONFIG = {
    delayMs: 8000,                 // Auto-Anzeige nach X ms (8 Sekunden)
    exitIntent: true,              // zusaetzlich bei Maus zur Browserkante oben
    suppressDays: 7,               // nach Schliessen X Tage nicht erneut zeigen
    bookingUrl: "https://www.kroes-consulting.com/kontakt.html",
    storageKey: "kc_bafa_popup_seen"
  };
  // =======================================

  var BAFA_SRC = "assets/img/bafa-siegel.png?v=3";

  var HTML = '' +
    '<div id="kc-bafa-popup" aria-hidden="true">' +
    '  <div class="kc-overlay" data-kc-close></div>' +
    '  <div class="kc-card" role="dialog" aria-modal="true" aria-labelledby="kc-title">' +
    '    <button class="kc-x" type="button" data-kc-close aria-label="Schlie&szlig;en">&times;</button>' +
    '    <div class="kc-trust">Registrierter BAFA Berater</div>' +
    '    <div class="kc-body">' +
    '      <div class="kc-banner">' +
    '        <img id="kc-bafa" alt="BAFA . Registriertes Beratungsunternehmen . Staatlich subventionierte Unternehmensberatung" />' +
    '      </div>' +
    '      <div class="kc-content">' +
    '        <h2 id="kc-title">Sparen Sie bis zu <span>2.800&nbsp;&euro;<sup>*</sup></span></h2>' +
    '        <p class="kc-lead">Kroes Consulting ist ein registriertes Beratungsunternehmen beim Bundesamt f&uuml;r Wirtschaft und Ausfuhrkontrolle (BAFA). Ihre Investition in Konfliktl&ouml;sungssysteme kann somit bei Firmensitz in Deutschland bis zu <strong>50&nbsp;%</strong> gef&ouml;rdert werden.</p>' +
    '        <ul class="kc-points">' +
    '          <li>Staatlich subventionierte Beratung f&uuml;r KMU in Deutschland</li>' +
    '          <li>Fester Ansprechpartner, kein Callcenter</li>' +
    '          <li>Berater&#8209;ID 228480, gelistet beim BAFA</li>' +
    '        </ul>' +
    '        <div class="kc-cta">' +
    '          <a class="kc-btn kc-btn-primary" id="kc-book" href="#" target="_blank" rel="noopener">Ja, ich interessiere mich f&uuml;r die F&ouml;rderung</a>' +
    '        </div>' +
    '        <p class="kc-fine">* Maximaler BAFA-F&ouml;rderbetrag bei voller Bezuschussung. Tats&auml;chliche F&ouml;rderh&ouml;he abh&auml;ngig von Programm und Unternehmensstatus.<br>Kroes Consulting &middot; Alexander Kroes e.U. &middot; FN 639208 m &middot; Berater-ID 228480</p>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  var CSS = [
    '#kc-bafa-popup{',
    '  --navy:#1F3A5F; --navy-deep:#152a45; --paper:#ffffff;',
    '  --ink:#2a2f37; --muted:#6b7280; --line:#e6e9ee;',
    '  position:fixed; inset:0; z-index:2147483000;',
    '  display:none; align-items:center; justify-content:center;',
    '  font-family:Calibri, Arial, "Segoe UI", sans-serif; padding:16px;',
    '}',
    '#kc-bafa-popup.kc-open{ display:flex; }',
    '.kc-overlay{ position:absolute; inset:0; background:rgba(15,23,42,.55);',
    '  backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px);',
    '  opacity:0; transition:opacity .25s ease; }',
    '#kc-bafa-popup.kc-open .kc-overlay{ opacity:1; }',
    '.kc-card{ position:relative; width:100%; max-width:520px;',
    '  max-height:calc(100vh - 32px); max-height:calc(100dvh - 32px);',
    '  display:flex; flex-direction:column; background:var(--paper);',
    '  border-radius:16px; overflow:hidden; box-shadow:0 24px 70px rgba(15,23,42,.35);',
    '  transform:translateY(14px) scale(.98); opacity:0;',
    '  transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease; }',
    '#kc-bafa-popup.kc-open .kc-card{ transform:none; opacity:1; }',
    '.kc-x{ position:absolute; top:8px; right:10px; z-index:3;',
    '  width:40px; height:40px; border:0; border-radius:50%;',
    '  background:rgba(255,255,255,.9); color:var(--navy);',
    '  font-size:26px; line-height:1; cursor:pointer;',
    '  display:flex; align-items:center; justify-content:center;',
    '  transition:background .15s ease; }',
    '.kc-x:hover{ background:#fff; }',
    '.kc-trust{ flex:0 0 auto; background:var(--navy); color:#fff;',
    '  font-size:12px; letter-spacing:.14em; text-transform:uppercase;',
    '  text-align:center; padding:10px 44px; font-weight:700; }',
    '.kc-body{ flex:1 1 auto; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:24px 26px 22px; }',
    '.kc-banner{ text-align:center; padding:14px 16px; margin:0 0 18px;',
    '  background:#ffffff; border:1px solid var(--line); border-radius:12px; }',
    '.kc-banner img{ width:100%; max-width:300px; height:auto; display:inline-block; }',
    '.kc-content{ width:100%; }',
    '#kc-title{ margin:0 0 12px; color:var(--navy);',
    '  font-family:Georgia, "Times New Roman", serif;',
    '  font-size:30px; line-height:1.08; font-weight:700; }',
    '#kc-title span{ color:var(--navy); white-space:nowrap; }',
    '.kc-lead{ margin:0 0 14px; color:var(--ink); font-size:15px; line-height:1.5; }',
    '.kc-points{ list-style:none; margin:0 0 18px; padding:0; }',
    '.kc-points li{ position:relative; padding:5px 0 5px 26px;',
    '  color:var(--ink); font-size:14px; line-height:1.4;',
    '  border-bottom:1px solid var(--line); }',
    '.kc-points li:last-child{ border-bottom:0; }',
    '.kc-points li::before{ content:""; position:absolute; left:2px; top:9px;',
    '  width:13px; height:13px; border-radius:50%; background:var(--navy); }',
    '.kc-points li::after{ content:""; position:absolute; left:6px; top:13px;',
    '  width:3px; height:6px; border:solid #fff; border-width:0 2px 2px 0;',
    '  transform:rotate(40deg); }',
    '.kc-cta{ display:flex; flex-direction:column; gap:10px; }',
    '.kc-btn{ display:flex; align-items:center; justify-content:center;',
    '  min-height:48px; text-align:center; text-decoration:none;',
    '  padding:12px 16px; border-radius:10px; font-size:16px; font-weight:700;',
    '  transition:transform .12s ease, background .15s ease, box-shadow .15s ease; }',
    '.kc-btn-primary{ background:var(--navy); color:#fff; box-shadow:0 6px 16px rgba(31,58,95,.35); }',
    '.kc-btn-primary:hover{ background:var(--navy-deep); transform:translateY(-1px); }',
    '.kc-fine{ margin:14px 0 0; color:var(--muted); font-size:11px; line-height:1.4; }',
    '@media (max-width:520px){',
    '  #kc-bafa-popup{ padding:12px; align-items:flex-end; }',
    '  .kc-card{ max-height:calc(100dvh - 24px); border-radius:18px; }',
    '  .kc-body{ padding:20px 18px 18px; }',
    '  .kc-trust{ font-size:11px; letter-spacing:.1em; padding:10px 44px; }',
    '  .kc-banner{ padding:12px; margin:0 0 16px; }',
    '  .kc-banner img{ max-width:220px; }',
    '  #kc-title{ font-size:25px; }',
    '  .kc-lead{ font-size:14.5px; }',
    '}',
    '@media (max-width:360px){',
    '  #kc-title{ font-size:22px; }',
    '  .kc-banner img{ max-width:190px; }',
    '  .kc-body{ padding:18px 16px 16px; }',
    '}',
    '@media (max-height:620px){',
    '  .kc-banner{ padding:8px; margin:0 0 12px; }',
    '  .kc-banner img{ max-width:170px; }',
    '  #kc-title{ font-size:22px; margin-bottom:8px; }',
    '  .kc-lead{ margin-bottom:10px; }',
    '  .kc-points{ margin-bottom:12px; }',
    '}',
    '@media (prefers-reduced-motion: reduce){',
    '  .kc-card, .kc-overlay, .kc-btn{ transition:none !important; }',
    '}'
  ].join('\n');

  function injectAssets() {
    if (document.getElementById('kc-bafa-popup')) return;
    var style = document.createElement('style');
    style.id = 'kc-bafa-popup-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.innerHTML = HTML;
    document.body.appendChild(wrap.firstChild);

    document.getElementById('kc-bafa').src = BAFA_SRC;
    document.getElementById('kc-book').href = CONFIG.bookingUrl;
  }

  function ready(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  ready(function () {
    injectAssets();

    var root = document.getElementById('kc-bafa-popup');
    if (!root) return;

    var shownThisSession = false;

    function store(set) {
      try {
        if (set) localStorage.setItem(CONFIG.storageKey, String(Date.now()));
        else localStorage.removeItem(CONFIG.storageKey);
        return true;
      } catch (e) { return false; }
    }
    function suppressed() {
      try {
        var t = localStorage.getItem(CONFIG.storageKey);
        if (!t) return false;
        var days = (Date.now() - Number(t)) / 86400000;
        return days < CONFIG.suppressDays;
      } catch (e) { return false; }
    }

    function open() {
      if (root.classList.contains('kc-open')) return;
      root.classList.add('kc-open');
      root.setAttribute('aria-hidden', 'false');
      shownThisSession = true;
      document.documentElement.style.overflow = 'hidden';
    }
    function close() {
      root.classList.remove('kc-open');
      root.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      store(true);
    }
    function maybeAutoOpen() {
      if (shownThisSession || suppressed()) return;
      open();
    }

    root.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-kc-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('kc-open')) close();
    });
    document.getElementById('kc-book').addEventListener('click', function () { store(true); });

    if (CONFIG.delayMs >= 0) {
      setTimeout(maybeAutoOpen, CONFIG.delayMs);
    }
    if (CONFIG.exitIntent) {
      document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && e.clientY <= 0) maybeAutoOpen();
      });
    }

    window.KC = {
      open: open,
      close: function () {
        root.classList.remove('kc-open');
        root.setAttribute('aria-hidden', 'true');
        document.documentElement.style.overflow = '';
      },
      reset: function () { store(false); shownThisSession = false; },
      get isSuppressed() { return suppressed(); }
    };
  });
})();
