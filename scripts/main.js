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

  /* ===== CV-STYLE PORTFOLIO ENTRANCE ===== */
  const curtain = document.getElementById('curtain');
  const filmGrain = document.getElementById('film-grain');
  const greeting = document.getElementById('cv-greeting');
  const nameChars = document.querySelectorAll('#cv-name .char');
  const cvStats = document.getElementById('cv-stats');

  if (curtain) {
    // Step 1: "Hello, I'm" fades in
    setTimeout(() => { if (greeting) greeting.classList.add('visible'); }, 200);

    // Step 2: J, A, Y appear one by one
    nameChars.forEach((ch, i) => {
      setTimeout(() => ch.classList.add('visible'), 600 + i * 250);
    });

    // Step 3: Gold line expands + role title appears
    setTimeout(() => curtain.classList.add('expand-line'), 1400);

    // Step 4: Stats fade in
    setTimeout(() => { if (cvStats) cvStats.classList.add('visible'); }, 1900);

    // Step 5: Doors split open to reveal hero
    setTimeout(() => curtain.classList.add('open'), 2800);

    // Step 6: Film grain fades out
    setTimeout(() => { if (filmGrain) filmGrain.classList.add('fade-out'); }, 3400);

    // Step 7: Cleanup
    setTimeout(() => {
      curtain.remove();
      if (filmGrain) filmGrain.remove();
    }, 4200);
  }

  /* ===== TAGLINE WORD-BY-WORD (after doors open) ===== */
  const tagline = document.getElementById('hero-tagline');
  if (tagline) {
    const words = tagline.querySelectorAll('.tagline-word');
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), 3200 + i * 400);
    });
    setTimeout(() => tagline.classList.add('lines-visible'), 3200 + words.length * 400 + 300);
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

});
