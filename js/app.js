document.addEventListener('DOMContentLoaded',()=>{

  /* ===== LENIS SMOOTH SCROLL ===== */
  let lenis;
  if(typeof Lenis!=='undefined'){
    lenis=new Lenis({
      duration:1.4,
      easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),
      orientation:'vertical',
      smoothWheel:true,
      wheelMultiplier:1
    });
    if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
      // Let GSAP drive Lenis — no separate raf loop
      lenis.on('scroll',ScrollTrigger.update);
      gsap.ticker.add(time=>{lenis.raf(time*1000)});
      gsap.ticker.lagSmoothing(0);
    } else {
      // Standalone Lenis without GSAP
      function raf(time){lenis.raf(time);requestAnimationFrame(raf)}
      requestAnimationFrame(raf);
    }
  }

  /* ===== CURSOR ===== */
  const cur=document.querySelector('.cur'),dot=document.querySelector('.dot');
  if(cur&&dot&&window.innerWidth>768){
    let cx=0,cy=0,dx=0,dy=0;
    document.addEventListener('mousemove',e=>{
      cx=e.clientX;cy=e.clientY;
      dot.style.left=cx+'px';dot.style.top=cy+'px';
      if(!cur.classList.contains('on')){cur.classList.add('on');dot.classList.add('on')}
    });
    function tickCur(){
      dx+=(cx-dx)*.1;dy+=(cy-dy)*.1;
      cur.style.left=dx+'px';cur.style.top=dy+'px';
      requestAnimationFrame(tickCur);
    }
    tickCur();
    document.querySelectorAll('a,button,.btn-primary,.btn-outline,.form-btn,.nav-link,.service-card,.project-card,.footer-social').forEach(el=>{
      el.addEventListener('mouseenter',()=>cur.classList.add('big'));
      el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
    });
  }

  /* ===== NAV SCROLL ===== */
  const nav=document.querySelector('.nav');
  const scrollBar=document.querySelector('.scroll-bar');
  const onScroll=()=>{
    const sy=window.scrollY||window.pageYOffset;
    if(nav) nav.classList.toggle('scrolled',sy>50);
    if(scrollBar){
      const h=document.documentElement.scrollHeight-window.innerHeight;
      scrollBar.style.width=h>0?(sy/h*100)+'%':'0';
    }
  };
  window.addEventListener('scroll',onScroll,{passive:true});

  /* ===== HAMBURGER ===== */
  const ham=document.querySelector('.hamburger'),mob=document.querySelector('.mob-menu');
  if(ham&&mob){
    ham.addEventListener('click',()=>{
      ham.classList.toggle('open');mob.classList.toggle('open');
      document.body.style.overflow=mob.classList.contains('open')?'hidden':'';
    });
    mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      ham.classList.remove('open');mob.classList.remove('open');
      document.body.style.overflow='';
    }));
  }

  /* ===== VANILLA TILT on cards ===== */
  if(typeof VanillaTilt!=='undefined'){
    VanillaTilt.init(document.querySelectorAll('.service-card'),{
      max:8,speed:400,glare:true,'max-glare':.08,scale:1.02
    });
    VanillaTilt.init(document.querySelectorAll('.project-card'),{
      max:5,speed:300,glare:true,'max-glare':.06,perspective:1000
    });
    VanillaTilt.init(document.querySelectorAll('.skill'),{
      max:15,speed:300,scale:1.05
    });
  }

  /* ===== GSAP ANIMATIONS ===== */
  if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
    gsap.registerPlugin(ScrollTrigger);

    // === SPLIT TEXT hero title ===
    const heroTitle=document.querySelector('.hero-title');
    if(heroTitle&&typeof SplitType!=='undefined'){
      const split=new SplitType(heroTitle,{types:'chars,words'});
      gsap.from(split.chars,{
        y:80,opacity:0,rotateX:-40,duration:.8,ease:'power3.out',
        stagger:.03,delay:.5
      });
    } else if(heroTitle){
      gsap.from(heroTitle,{y:80,opacity:0,duration:1.5,ease:'power3.out',delay:.3});
    }

    // Hero elements stagger — only if they exist
    const heroLabel=document.querySelector('.hero-label');
    const heroDesc=document.querySelector('.hero-desc');
    const heroBtns=document.querySelector('.hero-btns');
    const heroScroll=document.querySelector('.hero-scroll');
    if(heroLabel) gsap.from(heroLabel,{y:30,opacity:0,duration:1,ease:'power3.out',delay:.2});
    if(heroDesc) gsap.from(heroDesc,{y:40,opacity:0,duration:1,ease:'power3.out',delay:.8});
    if(heroBtns) gsap.from(heroBtns,{y:30,opacity:0,duration:1,ease:'power3.out',delay:1});

    // Hero portrait
    const heroPortrait=document.querySelector('.hero-portrait');
    if(heroPortrait){
      gsap.from(heroPortrait,{x:100,opacity:0,scale:.9,duration:1.5,ease:'power3.out',delay:.4});
      gsap.to(heroPortrait,{
        y:-80,
        scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.5}
      });
    }

    // Hero scroll indicator
    if(heroScroll) gsap.from(heroScroll,{opacity:0,y:20,duration:1,delay:1.5,ease:'power3.out'});

    // Section headers — slide up with gold line expand
    gsap.utils.toArray('.section-header').forEach(header=>{
      const label=header.querySelector('.section-label');
      const title=header.querySelector('.section-title');
      const line=header.querySelector('.section-line');
      const tl=gsap.timeline({scrollTrigger:{trigger:header,start:'top 85%'}});
      if(label) tl.from(label,{y:20,opacity:0,duration:.6,ease:'power3.out'});
      if(title) tl.from(title,{y:30,opacity:0,duration:.8,ease:'power3.out'},'-=.3');
      if(line) tl.from(line,{scaleX:0,duration:.6,ease:'power3.inOut'},'-=.4');
    });

    // Service cards stagger with rotation
    gsap.utils.toArray('.service-card').forEach((card,i)=>{
      gsap.from(card,{
        y:60,opacity:0,rotateY:5,duration:.9,delay:i*.12,ease:'power3.out',
        scrollTrigger:{trigger:card,start:'top 88%'}
      });
    });

    // Project cards scale-in with stagger
    gsap.utils.toArray('.project-card').forEach((card,i)=>{
      gsap.from(card,{
        scale:.85,opacity:0,y:40,duration:.9,delay:i*.1,ease:'power3.out',
        scrollTrigger:{trigger:card,start:'top 88%'}
      });
    });

    // Marquee speed boost on scroll
    const marqueeTrack=document.querySelector('.marquee-track');
    if(marqueeTrack){
      gsap.to(marqueeTrack,{
        x:'-=100',
        ease:'none',
        scrollTrigger:{trigger:'.marquee-wrap',start:'top bottom',end:'bottom top',scrub:2}
      });
    }

    // Stats — counter + scale in
    gsap.utils.toArray('.stat').forEach((stat,i)=>{
      gsap.from(stat,{
        y:40,opacity:0,scale:.9,duration:.7,delay:i*.12,ease:'power3.out',
        scrollTrigger:{trigger:stat,start:'top 88%',onEnter:()=>{
          const numEl=stat.querySelector('.stat-num');
          if(numEl&&!numEl.dataset.done){numEl.dataset.done='1';animateNum(numEl)}
        }}
      });
    });

    // CTA section
    const ctaSection=document.querySelector('.cta');
    if(ctaSection){
      const ctaTitle=ctaSection.querySelector('.cta-title');
      const ctaDesc=ctaSection.querySelector('.cta-desc');
      const ctaBtn=ctaSection.querySelector('.btn-primary');
      const ctaTl=gsap.timeline({scrollTrigger:{trigger:ctaSection,start:'top 80%'}});
      if(ctaTitle) ctaTl.from(ctaTitle,{y:60,opacity:0,duration:1,ease:'power3.out'});
      if(ctaDesc) ctaTl.from(ctaDesc,{y:30,opacity:0,duration:.8,ease:'power3.out'},'-=.5');
      if(ctaBtn) ctaTl.from(ctaBtn,{y:20,opacity:0,scale:.9,duration:.7,ease:'power3.out'},'-=.4');
    }

    // Footer logo
    const footerLogo=document.querySelector('.footer-logo');
    if(footerLogo){
      gsap.from(footerLogo,{
        scale:.7,opacity:0,duration:1.2,ease:'power3.out',
        scrollTrigger:{trigger:footerLogo,start:'top 92%'}
      });
    }

    // Footer socials stagger
    gsap.utils.toArray('.footer-social').forEach((s,i)=>{
      gsap.from(s,{
        y:20,opacity:0,duration:.5,delay:i*.1,ease:'power3.out',
        scrollTrigger:{trigger:s,start:'top 95%'}
      });
    });

    // Generic scroll reveals — SKIP hero elements (they have dedicated animations)
    gsap.utils.toArray('.rv,.rv-l,.rv-r,.rv-s').forEach(el=>{
      if(el.closest('.hero'))return;
      if(el.closest('.section-header'))return;
      if(el.classList.contains('service-card'))return;
      if(el.closest('.cta'))return;
      const dir=el.classList.contains('rv-l')?{x:-60}:
                el.classList.contains('rv-r')?{x:60}:
                el.classList.contains('rv-s')?{scale:.85}:{y:50};
      gsap.from(el,{
        ...dir,opacity:0,duration:.9,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}
      });
    });

    // About page — text paragraphs stagger
    gsap.utils.toArray('.about-text').forEach((p,i)=>{
      gsap.from(p,{
        y:30,opacity:0,duration:.8,delay:i*.15,ease:'power3.out',
        scrollTrigger:{trigger:p,start:'top 85%'}
      });
    });

    // Experience items
    gsap.utils.toArray('.exp-item').forEach((item,i)=>{
      gsap.from(item,{
        x:-40,opacity:0,duration:.7,delay:i*.1,ease:'power3.out',
        scrollTrigger:{trigger:item,start:'top 85%'}
      });
    });

    // Force refresh after everything is set up
    setTimeout(()=>ScrollTrigger.refresh(),500);
    window.addEventListener('load',()=>ScrollTrigger.refresh());

  } else {
    // Fallback
    const rObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');rObs.unobserve(e.target)}});
    },{threshold:.15});
    document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el=>rObs.observe(el));
  }

  /* ===== COUNTER ANIMATION ===== */
  function animateNum(el){
    const txt=el.textContent.trim();
    const m=txt.match(/^([\d.]+)(.*)$/);
    if(!m)return;
    const target=parseFloat(m[1]),suffix=m[2]||'',dur=1800,start=performance.now();
    const isF=txt.includes('.');
    function ease(t){return 1-Math.pow(1-t,4)}
    function tick(now){
      const p=Math.min((now-start)/dur,1),v=ease(p)*target;
      el.textContent=(isF?v.toFixed(1):Math.floor(v))+suffix;
      if(p<1)requestAnimationFrame(tick);else el.textContent=txt;
    }
    requestAnimationFrame(tick);
  }
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animateNum(e.target);cObs.unobserve(e.target)}});
  },{threshold:.5});
  document.querySelectorAll('.cs-metric-num').forEach(el=>cObs.observe(el));

  /* ===== PAGE TRANSITION ===== */
  const trans=document.querySelector('.pg-trans');
  if(trans){
    document.querySelectorAll('a').forEach(a=>{
      const href=a.getAttribute('href');
      if(href&&href.endsWith('.html')&&!a.hasAttribute('target')&&!a.hasAttribute('download')){
        a.addEventListener('click',e=>{
          e.preventDefault();trans.classList.add('go');
          setTimeout(()=>{window.location.href=href},700);
        });
      }
    });
  }

  /* ===== LAZY IMAGES ===== */
  document.querySelectorAll('img').forEach((img,i)=>{
    if(i>=2&&!img.hasAttribute('loading'))img.setAttribute('loading','lazy');
  });

  /* ===== AURORA CANVAS ===== */
  const canvas=document.getElementById('hero-canvas');
  if(canvas){
    const ctx=canvas.getContext('2d');let W,H,t=0,mx=.5,my=.5;
    function resize(){const p=canvas.parentElement;W=canvas.width=p.clientWidth;H=canvas.height=p.clientHeight}
    resize();window.addEventListener('resize',resize);
    document.addEventListener('mousemove',e=>{mx=e.clientX/W;my=e.clientY/H});

    const stars=[];for(let i=0;i<120;i++)stars.push({x:Math.random()*2e3,y:Math.random()*1e3,r:.2+Math.random()*.8,tw:Math.random()*6.28,sp:.3+Math.random()*1.5});

    function wave(yB,amp,freq,spd,col,lw){
      ctx.beginPath();ctx.strokeStyle=col;ctx.lineWidth=lw;
      for(let x=0;x<=W;x+=3){
        const y=yB+Math.sin(x*freq+t*spd)*amp+Math.sin(x*freq*.5+t*spd*1.3)*amp*.5+(my-.5)*20;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }ctx.stroke();
    }

    function draw(){
      t+=.008;ctx.fillStyle='#171719';ctx.fillRect(0,0,W,H);
      const g=ctx.createRadialGradient(W*(.35+mx*.1),H*(.35+my*.1),0,W*.4,H*.4,H*.6);
      g.addColorStop(0,'rgba(40,50,80,.1)');g.addColorStop(1,'transparent');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      const wg=ctx.createRadialGradient(W*(.6+mx*.05),H*.5,0,W*.6,H*.5,H*.5);
      wg.addColorStop(0,'rgba(196,147,85,.05)');wg.addColorStop(1,'transparent');
      ctx.fillStyle=wg;ctx.fillRect(0,0,W,H);
      for(let i=0;i<5;i++)wave(H*.25+i*H*.06,15+i*4,.003-i*.0001,.6+i*.12,`hsla(${215+i*8},40%,40%,${.05-i*.008})`,1);
      for(let i=0;i<4;i++)wave(H*.6+i*H*.04,10+i*3,.004,1+i*.2,`rgba(196,147,85,${.04-i*.008})`,0.7);
      stars.forEach(s=>{
        const f=.2+Math.sin(t*s.sp+s.tw)*.4;
        ctx.beginPath();ctx.arc(s.x%W,s.y%H,s.r,0,6.28);
        ctx.fillStyle=`rgba(200,210,230,${f*.3})`;ctx.fill();
      });
      const v=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.9);
      v.addColorStop(0,'transparent');v.addColorStop(1,'rgba(23,23,25,.5)');
      ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ===== FORM HANDLER ===== */
  const form=document.getElementById('contact-form'),ok=document.getElementById('form-ok');
  if(form){
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      try{
        const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
        if(r.ok){form.style.display='none';if(ok)ok.classList.add('show')}
      }catch(err){form.submit()}
    });
  }

});
