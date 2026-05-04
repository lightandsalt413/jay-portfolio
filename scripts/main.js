document.addEventListener('DOMContentLoaded', () => {

  /* ===== CUSTOM CURSOR (Premium Tech) ===== */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');

  if (cursor && cursorDot && window.innerWidth > 768) {
    let cx = 0, cy = 0, dx = 0, dy = 0;

    document.addEventListener('mousemove', e => {
      dx = e.clientX; dy = e.clientY;
      // Dot follows instantly
      cursorDot.style.left = dx + 'px';
      cursorDot.style.top = dy + 'px';
    });

    // Ring follows with inertia/lag
    function animateCursor() {
      cx += (dx - cx) * 0.12;
      cy += (dy - cy) * 0.12;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand on interactive elements
    document.querySelectorAll('a, button, .svc-item, .expertise-item, .magnetic-btn, .project-card, .work-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }

  /* ===== HERO PARALLAX FADE ===== */
  const portrait = document.getElementById('hero-portrait');
  const statement = document.getElementById('hero-statement');

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const vh = window.innerHeight;

    if (portrait && statement) {
      const progress = Math.min(1, s / (vh * 0.6));
      portrait.style.opacity = 1 - progress;
      portrait.style.transform = `scale(${1 - progress * 0.1}) translateY(${s * -0.15}px)`;
      if (progress > 0.4) statement.classList.add('visible');
      else statement.classList.remove('visible');
    }

    const nav = document.getElementById('nav');
    if (nav) nav.style.padding = s > 100 ? '1rem 4rem' : '2rem 4rem';
  });

  /* ===== SCROLL REVEAL ===== */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
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
  const svcBgs = {};
  document.querySelectorAll('.svc-bg-img').forEach(el => {
    svcBgs[el.id.replace('svc-bg-', '')] = el;
  });
  document.querySelectorAll('.svc-item[data-svc]').forEach(item => {
    item.addEventListener('mouseenter', () => {
      Object.values(svcBgs).forEach(bg => bg.classList.remove('active'));
      const bg = svcBgs[item.dataset.svc];
      if (bg) bg.classList.add('active');
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

  /* ===== 01. TEXT REVEAL — Letters appear on scroll (Cinematic) ===== */
  const introEl = document.getElementById('intro-text');
  if (introEl) {
    const fullText = introEl.dataset.reveal;
    const goldStart = fullText.indexOf('maximal');
    introEl.innerHTML = '';

    // Build letter spans
    for (let i = 0; i < fullText.length; i++) {
      const span = document.createElement('span');
      if (fullText[i] === ' ') {
        span.className = 'letter space';
        span.innerHTML = '&nbsp;';
      } else {
        span.className = 'letter' + (i >= goldStart ? ' gold' : '');
        span.textContent = fullText[i];
      }
      introEl.appendChild(span);
    }

    const letters = introEl.querySelectorAll('.letter');
    const introSection = document.getElementById('intro');

    window.addEventListener('scroll', () => {
      const rect = introSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress 0→1 as section scrolls through viewport
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / (vh * 0.6))));
      const litCount = Math.floor(progress * letters.length);

      letters.forEach((l, idx) => {
        if (idx < litCount) l.classList.add('lit');
        else l.classList.remove('lit');
      });
    });
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

  /* ===== 04. MAGNETIC BUTTON ===== */
  const magBtn = document.getElementById('magnetic-btn');
  if (magBtn) {
    magBtn.addEventListener('mousemove', e => {
      const rect = magBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      magBtn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });
    magBtn.addEventListener('mouseleave', () => {
      magBtn.style.transform = 'translate(0, 0)';
    });
  }

});
