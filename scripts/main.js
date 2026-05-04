document.addEventListener('DOMContentLoaded', () => {

  /* ===== PHASE 1: HERO PARALLAX FADE ===== */
  const portrait = document.getElementById('hero-portrait');
  const statement = document.getElementById('hero-statement');

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const vh = window.innerHeight;

    // Portrait fades out, statement fades in
    if (portrait && statement) {
      const progress = Math.min(1, s / (vh * 0.6));
      portrait.style.opacity = 1 - progress;
      portrait.style.transform = `scale(${1 - progress * 0.1}) translateY(${s * -0.15}px)`;

      if (progress > 0.4) {
        statement.classList.add('visible');
      } else {
        statement.classList.remove('visible');
      }
    }

    // Nav shrink
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.padding = s > 100 ? '1rem 4rem' : '2rem 4rem';
    }
  });

  /* ===== SCROLL REVEAL ===== */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* ===== COUNTER ANIMATION ===== */
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        let cur = 0;
        const step = Math.max(1, Math.floor(target / 50));
        const suffix = target >= 500 ? 'k+' : '+';
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur + suffix;
        }, 25);
        cObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.metric-num[data-count]').forEach(el => cObs.observe(el));

  /* ===== SERVICES HOVER IMAGE ===== */
  const svcItems = document.querySelectorAll('.svc-item[data-svc]');
  const svcBgs = {};
  document.querySelectorAll('.svc-bg-img').forEach(el => {
    svcBgs[el.id.replace('svc-bg-', '')] = el;
  });

  svcItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const id = item.dataset.svc;
      // Hide all
      Object.values(svcBgs).forEach(bg => bg.classList.remove('active'));
      // Show this one
      if (svcBgs[id]) svcBgs[id].classList.add('active');
    });
    item.addEventListener('mouseleave', () => {
      Object.values(svcBgs).forEach(bg => bg.classList.remove('active'));
    });
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});
