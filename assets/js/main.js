/* =========================================================
   apecek.makeup — skrypty strony
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- rok w stopce ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- nawigacja: tło po scrollu ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- menu mobilne ---------- */
  const burger = $('#burger');
  const links  = $('#navLinks');

  const closeMenu = () => {
    links.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- podświetlanie aktywnej sekcji ---------- */
  const sections = $$('main section[id]');
  const navMap = new Map();
  $$('#navLinks a[href^="#"]').forEach(a => navMap.set(a.getAttribute('href').slice(1), a));

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = navMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navMap.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => spy.observe(s));

  /* ---------- animacje wejścia ---------- */
  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const delay = Math.min(i, 5) * 80;
      setTimeout(() => entry.target.classList.add('is-in'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach(el => revealer.observe(el));

  /* ---------- filtry portfolio ---------- */
  const filters = $$('.filter');
  const shots   = $$('.shot');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;

      filters.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      shots.forEach(shot => {
        shot.classList.toggle('is-hidden', cat !== 'all' && shot.dataset.cat !== cat);
      });
    });
  });

  /* ---------- lightbox ---------- */
  const lb     = $('#lightbox');
  const lbImg  = $('#lbImg');
  const lbCap  = $('#lbCap');
  let index    = 0;
  let lastFocus = null;

  const visibleShots = () => shots.filter(s => !s.classList.contains('is-hidden'));

  function show(i) {
    const list = visibleShots();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    const shot = list[index];
    const img  = $('img', shot);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = shot.dataset.caption || '';
  }

  function openLb(shot) {
    lastFocus = document.activeElement;
    show(visibleShots().indexOf(shot));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }

  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  shots.forEach(shot => {
    shot.setAttribute('tabindex', '0');
    shot.setAttribute('role', 'button');
    shot.addEventListener('click', () => openLb(shot));
    shot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(shot); }
    });
  });

  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => show(index - 1));
  $('#lbNext').addEventListener('click', () => show(index + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  /* przesuwanie palcem na mobile */
  let touchX = null;
  lb.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(dx > 0 ? index - 1 : index + 1);
    touchX = null;
  }, { passive: true });

  /* ---------- formularz ---------- */
  /*
     Domyślnie formularz składa wiadomość i otwiera klienta poczty (mailto:).
     Aby wysyłać zapytania automatycznie:
       1. załóż konto np. w Formspree,
       2. ustaw ENDPOINT poniżej na swój adres formularza,
       3. gotowe — skrypt wyśle dane przez fetch().
  */
  const ENDPOINT = '';                       // np. 'https://formspree.io/f/xxxxxxx'
  const MAIL_TO  = 'kontakt@example.com';    // TODO: podmień na własny adres e-mail

  const form = $('#bookForm');
  const hint = $('#formHint');

  function handleSubmit(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.imie.trim() || !data.kontakt.trim()) {
      hint.textContent = 'Uzupełnij imię oraz e-mail lub telefon.';
      return;
    }

    if (ENDPOINT) {
      hint.textContent = 'Wysyłam…';
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(res => {
          if (!res.ok) throw new Error('błąd wysyłki');
          form.reset();
          hint.textContent = 'Dziękuję! Odezwę się najszybciej jak mogę.';
        })
        .catch(() => {
          hint.textContent = 'Nie udało się wysłać. Napisz proszę na Instagramie @apecek.makeup.';
        });
      return;
    }

    const subject = `Zapytanie o termin — ${data.usluga}`;
    const body =
      `Imię: ${data.imie}\n` +
      `Kontakt: ${data.kontakt}\n` +
      `Usługa: ${data.usluga}\n` +
      `Data wydarzenia: ${data.data || 'do ustalenia'}\n\n` +
      `${data.wiadomosc || ''}`;

    window.location.href =
      `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    hint.textContent = 'Otwieram program pocztowy… Możesz też napisać DM na Instagramie.';
  }

  form.addEventListener('submit', handleSubmit);
})();
