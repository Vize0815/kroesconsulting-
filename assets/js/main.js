/**
 * Kroes Consulting — Main JS
 * Handles: navigation, mobile menu, scroll animations, form
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Navigation — scroll state
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ----------------------------------------------------------
     Mobile menu
  ---------------------------------------------------------- */
  const toggle  = document.getElementById('navToggle');
  const overlay = document.getElementById('mobileMenu');

  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      overlay.classList.toggle('open', isOpen);
      overlay.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    });

    // Close on any link click inside overlay
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  function closeMenu() {
    if (!toggle || !overlay) return;
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
  }

  /* ----------------------------------------------------------
     Scroll reveal animations (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-fade');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target); // animate once
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show all immediately if no observer support
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     Hero Portrait — Fallback auf Platzhalter
  ---------------------------------------------------------- */
  const heroPortrait = document.getElementById('heroPortrait');
  const heroPlaceholder = document.getElementById('heroPlaceholder');

  if (heroPortrait && heroPlaceholder) {
    heroPortrait.addEventListener('error', () => {
      heroPortrait.style.display = 'none';
      heroPlaceholder.style.display = 'flex';
    });
  }

  /* ----------------------------------------------------------
     Contact form — client-side validation + UX feedback
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const form   = e.currentTarget;
    const btn    = form.querySelector('[type="submit"]');
    const msgEl  = document.getElementById('formMessage');

    // Reset field borders
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(f => {
      f.style.borderColor = '';
    });

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (field.type === 'checkbox' && !field.checked) {
        field.style.outline = '2px solid #c0392b';
        valid = false;
      } else if (field.type !== 'checkbox' && !field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      }
    });

    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      emailField.style.borderColor = '#c0392b';
      valid = false;
    }

    if (!valid) {
      if (msgEl) {
        msgEl.textContent = 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
        msgEl.className = 'form-message error';
      }
      return;
    }

    // Simulate sending (replace with real endpoint — Netlify, Formspree, etc.)
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
      if (msgEl) {
        msgEl.textContent = 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns in Kürze bei Ihnen.';
        msgEl.className = 'form-message success';
        form.reset();
        msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ----------------------------------------------------------
     Smooth scroll for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      if (id === '#callback') return; // handled by callback modal
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     Callback Modal — "Rückruf anfordern"
  ---------------------------------------------------------- */
  (function initCallbackModal() {
    const triggers = document.querySelectorAll('[data-callback-trigger], a[href="#callback"]');
    if (!triggers.length) return;

    const modalHTML = `
      <div class="callback-modal" id="callbackModal" role="dialog" aria-modal="true" aria-labelledby="callbackModalTitle" aria-hidden="true">
        <div class="callback-modal-dialog" role="document">
          <div class="callback-modal-header">
            <p class="callback-modal-eyebrow">Kostenlos &amp; unverbindlich</p>
            <h2 class="callback-modal-title" id="callbackModalTitle">Rückruf anfordern</h2>
            <p class="callback-modal-subtitle">Hinterlassen Sie Ihre Daten — wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
            <button type="button" class="callback-modal-close" aria-label="Schließen" data-callback-close>
              <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
            </button>
          </div>
          <div class="callback-modal-body">
            <form class="callback-modal-form" id="callbackForm" novalidate>
              <div class="callback-modal-field">
                <label for="cb-name">Ihr Name *</label>
                <input type="text" id="cb-name" name="name" placeholder="z. B. Maria Müller" autocomplete="name" required>
              </div>
              <div class="callback-modal-field">
                <label for="cb-company">Unternehmen *</label>
                <input type="text" id="cb-company" name="company" placeholder="z. B. Müller GmbH" autocomplete="organization" required>
              </div>
              <div class="callback-modal-field">
                <label for="cb-phone">Telefonnummer *</label>
                <input type="tel" id="cb-phone" name="phone" placeholder="z. B. +43 512 123456" autocomplete="tel" required>
              </div>
              <button type="submit" class="callback-modal-submit">
                Rückruf anfordern <span aria-hidden="true">→</span>
              </button>
              <p class="callback-modal-note">Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.</p>
            </form>
            <div class="callback-modal-success" hidden>
              <div class="callback-modal-success-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3>Danke für Ihre Anfrage!</h3>
              <p>Wir melden uns innerhalb von 24 Stunden telefonisch bei Ihnen.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML.trim();
    const modal = wrapper.firstElementChild;
    document.body.appendChild(modal);

    const dialog       = modal.querySelector('.callback-modal-dialog');
    const form         = modal.querySelector('#callbackForm');
    const successPanel = modal.querySelector('.callback-modal-success');
    let lastFocused = null;

    function openModal(e) {
      if (e) e.preventDefault();
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('callback-modal-open');
      const firstInput = modal.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 50);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('callback-modal-open');
      // reset to form state for next open
      setTimeout(() => {
        if (form && successPanel && successPanel.hasAttribute('hidden') === false) {
          form.hidden = false;
          successPanel.hidden = true;
          form.reset();
        }
      }, 300);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    triggers.forEach(t => t.addEventListener('click', openModal));

    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
      if (e.target.closest('[data-callback-close]')) closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const data = new FormData(form);
        const name    = (data.get('name')    || '').toString().trim();
        const company = (data.get('company') || '').toString().trim();
        const phone   = (data.get('phone')   || '').toString().trim();

        const subject = encodeURIComponent('Rückruf-Anfrage über Website');
        const body    = encodeURIComponent(
          `Name: ${name}\nUnternehmen: ${company}\nTelefon: ${phone}\n\n— Über das Rückruf-Formular auf kroes-consulting.com`
        );
        // Open user's mail client as fallback delivery
        window.location.href = `mailto:info@kroes-consulting.com?subject=${subject}&body=${body}`;

        // Show success state
        form.hidden = true;
        if (successPanel) successPanel.hidden = false;
      });
    }
  })();

  /* ----------------------------------------------------------
     Back-to-top button — auto-injected on every page
  ---------------------------------------------------------- */
  (function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Zurück nach oben');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 14 12 8 18 14"/></svg>';
    document.body.appendChild(btn);

    const threshold = 400;
    const onScroll = () => {
      btn.classList.toggle('is-visible', window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  })();

  /* ----------------------------------------------------------
     Manifest-Strip — Auto-Rotation + Klick-Steuerung
  ---------------------------------------------------------- */
  (function(){
    const section = document.querySelector('.v1-manifest');
    if (!section) return;
    const slides = section.querySelectorAll('.v1-manifest-slide');
    const dots = section.querySelectorAll('.v1-manifest-dot');
    const interval = 8000;
    let idx = 0, timer = null;

    function show(i){
      idx = (i + slides.length) % slides.length;
      slides.forEach((s,k) => s.classList.toggle('is-active', k === idx));
      dots.forEach((d,k) => {
        const active = k === idx;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }
    function start(){ stop(); timer = setInterval(() => show(idx + 1), interval); }
    function stop(){ if (timer) { clearInterval(timer); timer = null; } }

    dots.forEach((d,k) => d.addEventListener('click', () => { show(k); start(); }));
    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting ? start() : stop());
    }, { threshold: 0.25 });
    io.observe(section);
  })();

  /* ----------------------------------------------------------
     FAQ Accordion — smooth open/close animation
     Animates the answer block via height transition
     ---------------------------------------------------------- */
  (function () {
    const items = document.querySelectorAll('.faq-v2-item');
    if (!items.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = 320;

    items.forEach((item) => {
      const summary = item.querySelector('summary');
      const answer = item.querySelector('.faq-v2-answer');
      if (!summary || !answer) return;

      if (item.hasAttribute('open')) {
        answer.style.height = 'auto';
        answer.style.opacity = '1';
      } else {
        answer.style.height = '0px';
        answer.style.opacity = '0';
      }
      answer.style.overflow = 'hidden';
      answer.style.transition = reduce
        ? 'none'
        : `height ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${DURATION}ms ease`;

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.hasAttribute('open');
        if (isOpen) {
          const startHeight = answer.scrollHeight;
          answer.style.height = startHeight + 'px';
          requestAnimationFrame(() => {
            answer.style.height = '0px';
            answer.style.opacity = '0';
          });
          const onEnd = () => {
            item.removeAttribute('open');
            answer.removeEventListener('transitionend', onEnd);
          };
          if (reduce) {
            item.removeAttribute('open');
          } else {
            answer.addEventListener('transitionend', onEnd, { once: true });
          }
        } else {
          item.setAttribute('open', '');
          const targetHeight = answer.scrollHeight;
          answer.style.height = '0px';
          answer.style.opacity = '0';
          requestAnimationFrame(() => {
            answer.style.height = targetHeight + 'px';
            answer.style.opacity = '1';
          });
          const onEnd = () => {
            answer.style.height = 'auto';
            answer.removeEventListener('transitionend', onEnd);
          };
          if (reduce) {
            answer.style.height = 'auto';
            answer.style.opacity = '1';
          } else {
            answer.addEventListener('transitionend', onEnd, { once: true });
          }
        }
      });
    });
  })();

  /* ----------------------------------------------------------
     Booking Modal — centered popup with mailto trigger
     Trigger: any link/button with [data-booking-modal]
     Reads data-subject for the prefilled email subject
     ---------------------------------------------------------- */
  (function () {
    const triggers = document.querySelectorAll('[data-booking-modal]');
    if (!triggers.length) return;

    const EMAIL = 'info@kroes-consulting.com';
    let lastFocus = null;

    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'booking-modal-title');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="booking-modal-backdrop" data-close></div>
      <div class="booking-modal-card" role="document">
        <button type="button" class="booking-modal-close" aria-label="Schließen" data-close>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <h2 id="booking-modal-title" class="booking-modal-title">Buchung anfragen</h2>
        <p class="booking-modal-text">Senden Sie uns Ihre Anfrage per E-Mail. Der Betreff ist bereits vorausgefüllt — schreiben Sie uns einfach kurz Ihr Anliegen, und wir melden uns zeitnah bei Ihnen.</p>
        <div class="booking-modal-meta">
          <span class="booking-modal-meta-label">Betreff</span>
          <span class="booking-modal-meta-value" data-subject-display></span>
        </div>
        <div class="booking-modal-actions">
          <a href="#" class="btn btn-peri booking-modal-cta" data-mailto>
            E-Mail öffnen
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button type="button" class="booking-modal-cancel" data-close>Abbrechen</button>
        </div>
        <p class="booking-modal-fallback">Oder direkt schreiben an <a href="mailto:${EMAIL}">${EMAIL}</a></p>
      </div>
    `;
    document.body.appendChild(modal);

    const subjectDisplay = modal.querySelector('[data-subject-display]');
    const mailtoLink = modal.querySelector('[data-mailto]');
    const card = modal.querySelector('.booking-modal-card');

    function open(subject) {
      lastFocus = document.activeElement;
      subjectDisplay.textContent = subject;
      mailtoLink.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => mailtoLink.focus());
    }
    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    triggers.forEach((t) => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        const subject = t.getAttribute('data-subject') || 'Kroes Consulting – Anfrage';
        open(subject);
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  })();

  /* ---------------------------------------------------------------
     COOKIE-BANNER (DSGVO / TKG 2021)
     - 2-Stufen-Banner (Initial + Settings-Modal)
     - Speicherung in localStorage: cookieConsent_v1
     - Kategorien: necessary (immer an), statistics, marketing
     - Re-open-Button bleibt sichtbar zur Widerrufsmöglichkeit
  --------------------------------------------------------------- */
  (function cookieBanner() {
    var STORAGE_KEY = 'cookieConsent_v1';
    var consent = null;
    try { consent = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) { consent = null; }

    function save(value) {
      value.timestamp = new Date().toISOString();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch (_) {}
      consent = value;
      // Custom Event, damit Tracking-Skripte später darauf reagieren können
      window.dispatchEvent(new CustomEvent('cookieconsent:updated', { detail: value }));
    }

    var bannerHTML =
      '<div class="cookie-banner" id="cookieBanner" role="dialog" aria-live="polite" aria-label="Cookie-Hinweis" hidden>' +
        '<p class="cookie-banner-title" role="heading" aria-level="2">Datenschutz &amp; Cookies</p>' +
        '<p class="cookie-banner-text">' +
          'Wir verwenden ausschließlich technisch notwendige Cookies, um den Betrieb dieser Website zu gewährleisten. ' +
          'Weitere Cookies (z. B. für Statistik oder Marketing) setzen wir nur mit Ihrer ausdrücklichen Einwilligung. ' +
          'Details finden Sie in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.' +
        '</p>' +
        '<div class="cookie-banner-actions">' +
          '<button type="button" class="cookie-btn cookie-btn--primary" data-cookie-action="accept-all">Alle akzeptieren</button>' +
          '<button type="button" class="cookie-btn cookie-btn--secondary" data-cookie-action="reject-all">Nur notwendige</button>' +
          '<button type="button" class="cookie-btn cookie-btn--ghost" data-cookie-action="open-settings">Einstellungen</button>' +
        '</div>' +
      '</div>';

    var modalHTML =
      '<div class="cookie-modal" id="cookieModal" role="dialog" aria-modal="true" aria-labelledby="cookieModalTitle">' +
        '<div class="cookie-modal-card">' +
          '<p class="cookie-modal-title" id="cookieModalTitle" role="heading" aria-level="2">Cookie-Einstellungen</p>' +
          '<p class="cookie-modal-intro">Wählen Sie, welche Kategorien Sie zulassen möchten. Sie können Ihre Auswahl jederzeit über den Button „Cookie-Einstellungen" links unten widerrufen oder anpassen.</p>' +
          '<div class="cookie-cat">' +
            '<div class="cookie-cat-info">' +
              '<p class="cookie-cat-name" role="heading" aria-level="3">Notwendig</p>' +
              '<p class="cookie-cat-desc">Für den Betrieb der Website unverzichtbar (z. B. Sitzungsführung, Sicherheits-Tokens, Speicherung Ihrer Cookie-Auswahl). Diese Cookies können nicht deaktiviert werden.</p>' +
            '</div>' +
            '<label class="cookie-switch" aria-label="Notwendige Cookies (immer aktiv)">' +
              '<input type="checkbox" checked disabled>' +
              '<span class="cookie-switch-slider"></span>' +
            '</label>' +
          '</div>' +
          '<div class="cookie-cat">' +
            '<div class="cookie-cat-info">' +
              '<p class="cookie-cat-name" role="heading" aria-level="3">Statistik</p>' +
              '<p class="cookie-cat-desc">Anonyme Reichweitenmessung, um die Website zu verbessern. Aktuell nicht im Einsatz — Schalter wird vorgehalten für künftige Erweiterungen.</p>' +
            '</div>' +
            '<label class="cookie-switch" aria-label="Statistik-Cookies">' +
              '<input type="checkbox" id="cookieStat">' +
              '<span class="cookie-switch-slider"></span>' +
            '</label>' +
          '</div>' +
          '<div class="cookie-cat">' +
            '<div class="cookie-cat-info">' +
              '<p class="cookie-cat-name" role="heading" aria-level="3">Marketing</p>' +
              '<p class="cookie-cat-desc">Cookies für personalisierte Werbung oder Conversion-Tracking. Aktuell nicht im Einsatz.</p>' +
            '</div>' +
            '<label class="cookie-switch" aria-label="Marketing-Cookies">' +
              '<input type="checkbox" id="cookieMkt">' +
              '<span class="cookie-switch-slider"></span>' +
            '</label>' +
          '</div>' +
          '<div class="cookie-modal-footer">' +
            '<button type="button" class="cookie-btn cookie-btn--secondary" data-cookie-action="reject-all">Nur notwendige</button>' +
            '<button type="button" class="cookie-btn cookie-btn--secondary" data-cookie-action="save-selection">Auswahl speichern</button>' +
            '<button type="button" class="cookie-btn cookie-btn--primary" data-cookie-action="accept-all">Alle akzeptieren</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var reopenHTML =
      '<button type="button" class="cookie-reopen" id="cookieReopen" aria-label="Cookie-Einstellungen öffnen">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><circle cx="10" cy="15" r="1" fill="currentColor"/></svg>' +
        '<span>Cookie-Einstellungen</span>' +
      '</button>';

    // DOM einfügen
    var container = document.createElement('div');
    container.innerHTML = bannerHTML + modalHTML + reopenHTML;
    while (container.firstChild) document.body.appendChild(container.firstChild);

    var banner = document.getElementById('cookieBanner');
    var modal = document.getElementById('cookieModal');
    var reopen = document.getElementById('cookieReopen');
    var statInput = document.getElementById('cookieStat');
    var mktInput = document.getElementById('cookieMkt');

    function showBanner() {
      banner.hidden = false;
      requestAnimationFrame(function () { banner.classList.add('is-visible'); });
      reopen.classList.remove('is-visible');
    }
    function hideBanner() {
      banner.classList.remove('is-visible');
      setTimeout(function () { banner.hidden = true; }, 350);
      reopen.classList.add('is-visible');
    }
    function openModal() {
      // aktuelle Werte einsetzen
      statInput.checked = !!(consent && consent.statistics);
      mktInput.checked = !!(consent && consent.marketing);
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Initialer Zustand
    if (!consent) {
      showBanner();
    } else {
      reopen.classList.add('is-visible');
    }

    // Klick-Handler
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie-action]');
      var trigger = e.target.closest('[data-cookie-open]');
      if (trigger) { e.preventDefault(); openModal(); return; }
      if (!btn) {
        // Klick außerhalb der Modal-Card schließt
        if (e.target === modal) closeModal();
        return;
      }
      var action = btn.getAttribute('data-cookie-action');
      if (action === 'accept-all') {
        save({ necessary: true, statistics: true, marketing: true });
        closeModal(); hideBanner();
      } else if (action === 'reject-all') {
        save({ necessary: true, statistics: false, marketing: false });
        closeModal(); hideBanner();
      } else if (action === 'save-selection') {
        save({ necessary: true, statistics: !!statInput.checked, marketing: !!mktInput.checked });
        closeModal(); hideBanner();
      } else if (action === 'open-settings') {
        openModal();
      }
    });

    reopen.addEventListener('click', function () {
      banner.hidden = true; banner.classList.remove('is-visible');
      openModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  })();

})();
