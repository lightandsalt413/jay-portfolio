document.addEventListener('DOMContentLoaded', () => {
  /* Fullscreen Menu */
  const trigger = document.getElementById('menu-trigger');
  const menu = document.getElementById('fullscreen-menu');
  const close = document.getElementById('menu-close');
  if (trigger && menu) {
    trigger.addEventListener('click', () => menu.classList.add('open'));
    close.addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('.menu-link').forEach(a => {
      a.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  /* Scroll Reveal */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* Counter Animation */
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        let cur = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur + (target === 100 ? '%' : '+');
        }, 30);
        cObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-count]').forEach(el => cObs.observe(el));

  /* Smooth Scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ===== HERO PARALLAX ===== */
  const heroName = document.querySelector('.hero-name');
  const heroPortrait = document.querySelector('.hero-portrait');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroLetters = document.querySelectorAll('.hero-letter');

  /* Scroll Parallax — layers move at different speeds */
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s > window.innerHeight) return; // stop computing past hero

    // JAY text rises faster (creates depth)
    if (heroName) heroName.style.transform = `translate(-50%, calc(-50% + ${s * -0.3}px))`;

    // Portrait moves up slightly slower
    if (heroPortrait) heroPortrait.style.transform = `translateY(${s * -0.1}px)`;

    // Tagline fades out on scroll
    if (heroTagline) {
      heroTagline.style.opacity = Math.max(0, 1 - s / 300);
      heroTagline.style.transform = `translateX(-50%) translateY(${s * 0.15}px)`;
    }
  });

  /* Mouse-move Parallax — subtle 3D depth feel */
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // JAY text shifts opposite to mouse (far layer)
      if (heroName) {
        heroName.style.transform = `translate(calc(-50% + ${x * -20}px), calc(-50% + ${y * -15}px))`;
      }

      // Portrait shifts toward mouse (close layer, subtle)
      if (heroPortrait) {
        heroPortrait.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
      }
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
      if (heroName) heroName.style.transform = 'translate(-50%, -50%)';
      if (heroPortrait) heroPortrait.style.transform = 'translate(0, 0)';
    });
  }

  /* Form */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const orig = btn.textContent;
      btn.textContent = 'Sent ✓';
      btn.style.background = '#22c55e';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 2500);
    });
  }
});
