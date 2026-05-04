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

  /* ===== 01. INTRO — Scale-up on scroll ===== */
  const introText = document.getElementById('intro-text');
  if (introText) {
    const introObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) introText.classList.add('visible');
        else introText.classList.remove('visible');
      });
    }, { threshold: 0.3 });
    introObs.observe(introText);
  }

  /* ===== 03. PORTFOLIO — Full-bleed parallax ===== */
  const fbItems = document.querySelectorAll('.fb-item');
  window.addEventListener('scroll', () => {
    fbItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const speed = parseFloat(item.dataset.speed) || 0.3;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * speed;
        const img = item.querySelector('img');
        if (img) img.style.transform = `translateY(${offset}px)`;
      }
    });
  });

  /* ===== 04. CONNECT — Magnetic button ===== */
  const magBtn = document.getElementById('magnetic-btn');
  if (magBtn) {
    magBtn.addEventListener('mousemove', e => {
      const rect = magBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      magBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    magBtn.addEventListener('mouseleave', () => {
      magBtn.style.transform = 'translate(0, 0)';
    });
  }

});
