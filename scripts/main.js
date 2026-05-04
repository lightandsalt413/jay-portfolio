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

  /* ===== 3D TILT EFFECT ===== */
  const hero = document.querySelector('.hero');
  const wrapper = document.getElementById('hero-3d');

  if (hero && wrapper) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Rotate the entire 3D wrapper — subtle but noticeable
      const rotateY = x * 12;   // tilt left/right (max 6deg)
      const rotateX = y * -8;  // tilt up/down (max 4deg)

      wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Smooth reset on mouse leave
    hero.addEventListener('mouseleave', () => {
      wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
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
