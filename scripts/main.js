document.addEventListener('DOMContentLoaded', () => {

  /* ===== Step 1: HERO — Mouse Parallax on J, Y, and Portrait ===== */
  const hero = document.querySelector('.hero');
  const portrait = document.getElementById('hero-portrait');
  const letterJ = document.querySelector('.hero-letter-j');
  const letterY = document.querySelector('.hero-letter-y');

  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      if (letterJ) letterJ.style.transform = `translate(${x * -20}px, ${y * -15}px)`;
      if (letterY) letterY.style.transform = `translate(${x * 20}px, ${y * -15}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      if (letterJ) letterJ.style.transform = '';
      if (letterY) letterY.style.transform = '';
    });
  }

  /* ===== UNIVERSAL PARALLAX — data-parallax attribute ===== */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  let ticking = false;
  function updateParallax() {
    const s = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translateY(${s * speed}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  });

  /* ===== Step 3b: FLOATING PARTICLES — Ambient depth ===== */
  const particleContainer = document.getElementById('parallax-particles');
  if (particleContainer) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.width = (1 + Math.random() * 2) + 'px';
      p.style.height = p.style.width;
      p.style.opacity = 0.05 + Math.random() * 0.15;
      particleContainer.appendChild(p);
    }
  }

  /* ===== MULTI-LAYERED STAGGERED SWEEP ===== */
  const loader = document.getElementById('loader');
  if (loader) {
    const introName = document.getElementById('intro-name');
    const introTagline = document.getElementById('intro-tagline');
    const sweeps = [
      document.getElementById('sweep-1'),
      document.getElementById('sweep-2'),
      document.getElementById('sweep-3'),
      document.getElementById('sweep-4')
    ];
    const loaderParticles = document.getElementById('loader-particles');

    // Spawn floating particles
    if (loaderParticles) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'loader-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = 40 + Math.random() * 40 + '%';
        p.style.animationDuration = 2 + Math.random() * 3 + 's';
        p.style.animationDelay = Math.random() * 2 + 's';
        loaderParticles.appendChild(p);
      }
    }

    // Step 1: Sweep panels out one by one (staggered)
    sweeps.forEach((panel, i) => {
      if (panel) {
        setTimeout(() => panel.classList.add('sweep-out'), 400 + i * 220);
      }
    });

    // Step 2: JAY name reveals after panels clear
    setTimeout(() => {
      introName.classList.add('reveal');
    }, 1500);

    // Step 3: Type tagline letter by letter
    const tagText = 'CREATIVE DEVELOPER';
    let ti = 0;
    setTimeout(() => {
      const typeTimer = setInterval(() => {
        if (ti < tagText.length) {
          introTagline.textContent += tagText[ti];
          ti++;
        } else {
          clearInterval(typeTimer);
          introTagline.classList.add('done');
        }
      }, 50);
    }, 2000);

    // Step 4: Fade out the loader
    setTimeout(() => {
      loader.classList.add('fade-exit');
      setTimeout(() => loader.remove(), 800);
    }, 4200);
  }

  /* ===== TAGLINE WORD-BY-WORD (after loader) ===== */
  const tagline = document.getElementById('hero-tagline');
  if (tagline) {
    const delay = document.getElementById('loader') ? 4500 : 500;
    const words = tagline.querySelectorAll('.tagline-word');
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), delay + i * 400);
    });
    setTimeout(() => tagline.classList.add('lines-visible'), delay + words.length * 400 + 300);
  }

  /* ===== Step 2: SCROLL REVEAL (IntersectionObserver) ===== */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => obs.observe(el));

  /* ===== Step 5b: WORD-BY-WORD REVEAL (reusable for any section) ===== */
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
  document.querySelectorAll('.word-reveal:not(#hero-tagline)').forEach(el => wordObs.observe(el));

  /* ===== SMOOTH SCROLL for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ===== CUSTOM CURSOR — Smooth follow + Magnetic hover ===== */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (cursor && cursorDot && window.innerWidth > 768) {
    let mx = -100, my = -100, cx = -100, cy = -100;

    // Track mouse position
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      // Show cursor on first move
      if (!cursor.classList.contains('visible')) {
        cursor.classList.add('visible');
        cursorDot.classList.add('visible');
      }
    });

    // Smooth follow loop (ring lags behind, dot is precise)
    (function tick() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
      requestAnimationFrame(tick);
    })();

    // Hover expand on interactive elements
    document.querySelectorAll('a, button, .magnetic-btn, .form-submit, .nav-link-left, .nav-link-right, .nav-center-text').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Magnetic pull on magnetic elements
    document.querySelectorAll('.magnetic-btn, .nav-link-left, .nav-link-right, .nav-center-text, .hover-glow-text').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;
        const pullX = (e.clientX - elX) * 0.3;
        const pullY = (e.clientY - elY) * 0.3;
        el.style.transform = `translate(${pullX}px, ${pullY}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)';
        setTimeout(() => el.style.transition = '', 400);
      });
    });
  }

});
