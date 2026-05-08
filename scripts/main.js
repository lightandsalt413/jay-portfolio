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

  /* ===== Step 3: PARALLAX BACKGROUND — Depth on scroll ===== */
  const parallaxBg = document.getElementById('hero-parallax-bg');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (parallaxBg) {
      parallaxBg.style.transform = `translateY(${s * 0.4}px)`;
    }
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

  /* ===== CINEMATIC INTRO — New Sequence ===== */
  const loader = document.getElementById('loader');
  if (loader) {
    const introLine = document.getElementById('intro-line');
    const introChars = document.querySelectorAll('.intro-char');
    const introRole = document.getElementById('intro-role');
    const corners = document.querySelectorAll('.intro-corner');
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

    // Step 1: Line expands from center (300ms delay)
    setTimeout(() => {
      if (introLine) introLine.classList.add('expand');
    }, 300);

    // Step 2: JAY letters rise up one by one
    introChars.forEach((ch, i) => {
      setTimeout(() => ch.classList.add('rise'), 900 + i * 200);
    });

    // Step 3: Corner marks appear
    setTimeout(() => {
      corners.forEach(c => c.classList.add('show'));
    }, 1600);

    // Step 4: Role text fades in
    setTimeout(() => {
      if (introRole) introRole.classList.add('show');
    }, 1900);

    // Step 5: Cinematic exit — blur + scale out
    setTimeout(() => {
      loader.classList.add('cinematic-exit');
      setTimeout(() => loader.remove(), 1000);
    }, 3800);
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

  /* ===== CUSTOM CURSOR — Smooth follow ===== */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (cursor && cursorDot && window.innerWidth > 768) {
    let cx = 0, cy = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
    (function moveCursor() {
      dx += (cx - dx) * 0.15;
      dy += (cy - dy) * 0.15;
      cursor.style.left = dx + 'px';
      cursor.style.top = dy + 'px';
      cursorDot.style.left = cx + 'px';
      cursorDot.style.top = cy + 'px';
      requestAnimationFrame(moveCursor);
    })();
    // Hover state on interactive elements
    document.querySelectorAll('a, button, .magnetic-btn, .form-submit, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ===== SCROLL PROGRESS BAR ===== */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });

  /* ===== NAV AUTO-HIDE on scroll ===== */
  const navEl = document.getElementById('nav');
  if (navEl) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const curr = window.scrollY;
      if (curr > 100 && curr > lastScroll) {
        navEl.classList.add('nav-hidden');
      } else {
        navEl.classList.remove('nav-hidden');
      }
      lastScroll = curr;
    });
  }

});
