document.addEventListener('DOMContentLoaded', () => {

  /* ===== CUSTOM CURSOR ===== */
  const cursor = document.getElementById('cursor');
  if (cursor && window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .project-card, .svc, .tk-tag').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ===== PARTICLES ===== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + .5;
        this.speedX = (Math.random() - .5) * .3;
        this.speedY = (Math.random() - .5) * .3;
        this.opacity = Math.random() * .4 + .1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,169,110,${.06 * (1 - dist / 120)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ===== FULLSCREEN MENU ===== */
  const trigger = document.getElementById('menu-trigger');
  const menu = document.getElementById('fs-menu');
  const close = document.getElementById('menu-close');
  if (trigger && menu) {
    trigger.addEventListener('click', () => menu.classList.add('open'));
    close.addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('.menu-link').forEach(a => {
      a.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  /* ===== SCROLL REVEAL ===== */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* ===== COUNTER ANIMATION ===== */
  const cObs = new IntersectionObserver(entries => {
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

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ===== HERO PARALLAX ===== */
  const heroName = document.querySelector('.hero-name');
  const heroPortrait = document.querySelector('.hero-portrait');
  const heroTagline = document.querySelector('.hero-tagline');
  const hero = document.querySelector('.hero');

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s > window.innerHeight) return;
    if (heroName) heroName.style.transform = `translate(-50%, calc(-50% + ${s * -0.25}px))`;
    if (heroPortrait) heroPortrait.style.transform = `translateY(${s * -0.08}px)`;
    if (heroTagline) {
      heroTagline.style.opacity = Math.max(0, 1 - s / 350);
      heroTagline.style.transform = `translateX(-50%) translateY(${s * 0.12}px)`;
    }
  });

  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      if (heroName) heroName.style.transform = `translate(calc(-50% + ${x * -18}px), calc(-50% + ${y * -12}px))`;
      if (heroPortrait) heroPortrait.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      if (heroName) heroName.style.transform = 'translate(-50%, -50%)';
      if (heroPortrait) heroPortrait.style.transform = 'translate(0, 0)';
    });
  }

  /* ===== FORM ===== */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const orig = btn.textContent;
      btn.textContent = 'Sent ✓';
      btn.style.background = '#22c55e';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 2500);
    });
  }

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s > 100) {
      navbar.style.padding = '1rem 3rem';
    } else {
      navbar.style.padding = '1.5rem 3rem';
    }
    lastScroll = s;
  });
});
