document.addEventListener('DOMContentLoaded', () => {

  /* ===== GATEKEEPING ENTRY ===== */
  const gate = document.getElementById('gate');
  const gateBtn = document.getElementById('gate-enter');
  const gateTyping = document.getElementById('gate-typing');

  if (gate) {
    document.body.classList.add('gated');

    // Typewriter effect
    const msg = 'Access granted. Welcome.';
    let i = 0;
    function typeChar() {
      if (i < msg.length) {
        gateTyping.textContent += msg[i];
        i++;
        setTimeout(typeChar, 60 + Math.random() * 40);
      }
    }
    setTimeout(typeChar, 800);

    // Unlock
    gateBtn.addEventListener('click', () => {
      gate.classList.add('unlocked');
      document.body.classList.remove('gated');
      setTimeout(() => gate.remove(), 1500);
    });
  }

  /* ===== CUSTOM CURSOR ===== */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (cursor && cursorDot && window.innerWidth > 768) {
    let cx = 0, cy = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => {
      dx = e.clientX; dy = e.clientY;
      cursorDot.style.left = dx + 'px';
      cursorDot.style.top = dy + 'px';
    });
    function animC() {
      cx += (dx - cx) * 0.12;
      cy += (dy - cy) * 0.12;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animC);
    }
    animC();
    document.querySelectorAll('a, button, .svc-item, .drag-img, .work-item, .glow-email').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }

  /* ===== HERO — Zoom-out on scroll ===== */
  const portrait = document.getElementById('hero-portrait');
  const heroStatement = document.getElementById('hero-statement');
  const heroSection = document.querySelector('.hero');

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const vh = window.innerHeight;

    if (portrait && heroStatement) {
      const progress = Math.min(1, s / (vh * 0.6));
      // Zoom-out: starts at scale(1.1) -> scale(1) as you scroll
      const scale = 1.1 - progress * 0.2;
      portrait.style.opacity = 1 - progress;
      portrait.style.transform = `scale(${scale}) translateY(${s * -0.1}px)`;
      if (progress > 0.4) heroStatement.classList.add('visible');
      else heroStatement.classList.remove('visible');
    }

    // Hero section zoom-out
    if (heroSection) {
      const heroP = Math.min(1, s / vh);
      heroSection.style.transform = `scale(${1 - heroP * 0.05})`;
      heroSection.style.opacity = 1 - heroP * 0.5;
    }

    // Nav shrink
    const nav = document.getElementById('nav');
    if (nav) nav.style.padding = s > 100 ? '1rem 4rem' : '2rem 4rem';
  });

  /* ===== SCROLL REVEAL (all variants) ===== */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => obs.observe(el));

  /* ===== PARALLAX BACKGROUND ===== */
  const parallaxBg = document.getElementById('parallax-bg');
  window.addEventListener('scroll', () => {
    if (parallaxBg) {
      parallaxBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  });

  /* ===== WORD-BY-WORD REVEAL ===== */
  document.querySelectorAll('.word-reveal p').forEach(p => {
    const html = p.innerHTML;
    const words = html.split(/(\s+)/);
    p.innerHTML = words.map(w => {
      if (w.trim() === '') return w;
      return `<span class="word">${w}</span>`;
    }).join('');
  });
  const wordObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const words = e.target.querySelectorAll('.word');
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('visible'), i * 100);
        });
        wordObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.word-reveal').forEach(el => wordObs.observe(el));

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
      if (svcBgs[item.dataset.svc]) svcBgs[item.dataset.svc].classList.add('active');
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

  /* ===== LETTER REVEAL ===== */
  const introEl = document.getElementById('intro-text');
  if (introEl) {
    const fullText = introEl.dataset.reveal;
    const goldStart = fullText.indexOf('maximal');
    introEl.innerHTML = '';
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
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / (vh * 0.6))));
      const litCount = Math.floor(progress * letters.length);
      letters.forEach((l, idx) => {
        if (idx < litCount) l.classList.add('lit');
        else l.classList.remove('lit');
      });
    });
  }

  /* ===== SCROLL-JACKING STATEMENTS ===== */
  const stmtSection = document.querySelector('.statements');
  const slides = document.querySelectorAll('.stmt-slide');
  const dots = document.querySelectorAll('.stmt-dot');

  if (stmtSection && slides.length) {
    window.addEventListener('scroll', () => {
      const rect = stmtSection.getBoundingClientRect();
      const totalH = stmtSection.offsetHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (totalH - window.innerHeight)));
      const idx = Math.min(slides.length - 1, Math.floor(progress * slides.length));

      slides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    });
  }

  /* ===== DRAGGABLE IMAGES ===== */
  const dragItems = document.querySelectorAll('[data-drag]');
  let activeEl = null, offsetX = 0, offsetY = 0, maxZ = 10;

  dragItems.forEach(el => {
    el.addEventListener('mousedown', e => {
      activeEl = el;
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      maxZ++;
      el.style.zIndex = maxZ;
      el.style.transition = 'none';
      e.preventDefault();
    });

    // Touch support
    el.addEventListener('touchstart', e => {
      activeEl = el;
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
      maxZ++;
      el.style.zIndex = maxZ;
      el.style.transition = 'none';
    }, { passive: false });
  });

  document.addEventListener('mousemove', e => {
    if (!activeEl) return;
    const canvas = document.getElementById('drag-canvas');
    const cr = canvas.getBoundingClientRect();
    activeEl.style.left = (e.clientX - cr.left - offsetX) + 'px';
    activeEl.style.top = (e.clientY - cr.top - offsetY) + 'px';
    activeEl.style.transform = 'rotate(0deg)';
  });

  document.addEventListener('touchmove', e => {
    if (!activeEl) return;
    const touch = e.touches[0];
    const canvas = document.getElementById('drag-canvas');
    const cr = canvas.getBoundingClientRect();
    activeEl.style.left = (touch.clientX - cr.left - offsetX) + 'px';
    activeEl.style.top = (touch.clientY - cr.top - offsetY) + 'px';
    activeEl.style.transform = 'rotate(0deg)';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('mouseup', () => { activeEl = null; });
  document.addEventListener('touchend', () => { activeEl = null; });

});
