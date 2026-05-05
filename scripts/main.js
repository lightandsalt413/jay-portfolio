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

  /* ===== LOADING SCREEN ANIMATION ===== */
  const loader = document.getElementById('loader');
  if (loader) {
    const l1 = document.getElementById('loader-line1');
    const ln = document.getElementById('loader-name');
    const ld = document.getElementById('loader-divider');
    const l2 = document.getElementById('loader-line2');
    const bt = document.getElementById('loader-bar-track');
    const bb = document.getElementById('loader-bar');

    // Staggered reveal
    setTimeout(() => { if (l1) l1.classList.add('show'); }, 200);
    setTimeout(() => { if (ln) ln.classList.add('show'); }, 600);
    setTimeout(() => { if (ld) ld.classList.add('show'); }, 1200);
    setTimeout(() => { if (l2) l2.classList.add('show'); }, 1600);
    setTimeout(() => { if (bt) bt.classList.add('show'); }, 1800);
    setTimeout(() => { if (bb) bb.classList.add('fill'); }, 2000);

    // Fade out loader, reveal page
    setTimeout(() => {
      loader.classList.add('done');
      // Remove from DOM after transition
      setTimeout(() => loader.remove(), 800);
    }, 3800);
  }

  /* ===== TAGLINE WORD-BY-WORD (after loader) ===== */
  const tagline = document.getElementById('hero-tagline');
  if (tagline) {
    const delay = document.getElementById('loader') ? 4200 : 500;
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

});
