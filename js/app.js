document.addEventListener('DOMContentLoaded',()=>{


  /* ===== PRELOADER (Countdown 0→100) ===== */
  const preloader=document.getElementById('preloader');
  const counterEl=document.getElementById('preloader-counter');
  const barFill=document.getElementById('preloader-bar-fill');
  if(preloader&&counterEl&&barFill){
    let current=0;
    const duration=2200; // total countdown duration in ms
    const start=performance.now();
    function easeOutQuart(t){return 1-Math.pow(1-t,4)}
    function countUp(now){
      const elapsed=now-start;
      const progress=Math.min(elapsed/duration,1);
      const eased=easeOutQuart(progress);
      current=Math.floor(eased*100);
      counterEl.textContent=current;
      barFill.style.width=current+'%';
      if(progress<1){
        requestAnimationFrame(countUp);
      }else{
        // Hold at 100 briefly, then fade out
        setTimeout(()=>{
          preloader.classList.add('done');
          document.body.classList.add('loaded');
          setTimeout(()=>preloader.remove(),900);
        },400);
      }
    }
    requestAnimationFrame(countUp);
  }


  /* ===== SPLIT SCREEN FEATURED PROJECTS ===== */
  const fpShowcase=document.querySelector('.fp-showcase');
  if(fpShowcase){
    const videos=[...fpShowcase.querySelectorAll('.fp-video')];
    const slides=[...fpShowcase.querySelectorAll('.fp-slide')];
    const dots=[...fpShowcase.querySelectorAll('.fp-dot')];
    const progressFill=fpShowcase.querySelector('.fp-progress-fill');
    const total=slides.length;
    let current=0;
    const duration=5000;
    let startTime=Date.now();
    let autoTimer;

    function goTo(idx){
      videos[current].classList.remove('active');
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current=idx%total;
      videos[current].classList.add('active');
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      startTime=Date.now();
    }

    function tick(){
      const elapsed=Date.now()-startTime;
      const pct=Math.min((elapsed/duration)*100,100);
      if(progressFill) progressFill.style.width=pct+'%';
      if(elapsed>=duration) goTo(current+1);
      autoTimer=requestAnimationFrame(tick);
    }
    tick();

    dots.forEach(d=>d.addEventListener('click',()=>{
      goTo(parseInt(d.dataset.index));
    }));
  }


  /* ===== LENIS SMOOTH SCROLL ===== */
  let lenis;
  if(typeof Lenis!=='undefined'){
    lenis=new Lenis({
      duration:1.2,
      easing:(t)=>Math.min(1,1.001-Math.pow(2,-10*t)),
      orientation:'vertical',
      smoothWheel:true,
    });
    function raf(time){lenis.raf(time);requestAnimationFrame(raf)}
    requestAnimationFrame(raf);
    // Connect Lenis to GSAP ScrollTrigger
    if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
      lenis.on('scroll',ScrollTrigger.update);
      gsap.ticker.add((time)=>lenis.raf(time*1000));
      gsap.ticker.lagSmoothing(0);
    }
  }


  /* ===== NAV SCROLL (Glassmorphism) ===== */
  const nav=document.querySelector('.nav');
  const scrollBar=document.querySelector('.scroll-bar');
  window.addEventListener('scroll',()=>{
    if(nav) nav.classList.toggle('scrolled',window.scrollY>50);
    if(scrollBar){
      const h=document.documentElement.scrollHeight-window.innerHeight;
      scrollBar.style.width=h>0?(window.scrollY/h*100)+'%':'0';
    }
  });

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


  /* ===== GSAP SCROLL ANIMATIONS (homepage only) ===== */
  if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Text Reveal ---
    const heroTitle=document.querySelector('.hero-title');
    const heroLabel=document.querySelector('.hero-label');
    const heroDesc=document.querySelector('.hero-desc');
    const heroBtns=document.querySelector('.hero-btns');

    if(heroTitle){
      // Split hero title into words
      const words=heroTitle.innerHTML.split(/(<br>|<em>|<\/em>)/g);
      let html='';
      words.forEach(part=>{
        if(part==='<br>'||part==='<em>'||part==='</em>'){
          html+=part;
        }else{
          part.split(' ').filter(w=>w).forEach(w=>{
            html+=`<span class="word-reveal"><span class="word">${w}</span></span> `;
          });
        }
      });
      heroTitle.innerHTML=html;

      // Animate after preloader countdown
      const introTL=gsap.timeline({delay:preloader?2.8:.3});

      if(heroLabel){
        introTL.fromTo(heroLabel,
          {opacity:0,y:20,filter:'blur(8px)'},
          {opacity:1,y:0,filter:'blur(0px)',duration:.8,ease:'power3.out'}
        );
      }

      introTL.to('.hero-title .word',{
        y:0,opacity:1,
        duration:.7,
        stagger:.06,
        ease:'power3.out'
      },'-=.3');

      if(heroDesc){
        introTL.fromTo(heroDesc,
          {opacity:0,y:30,filter:'blur(6px)'},
          {opacity:1,y:0,filter:'blur(0px)',duration:.8,ease:'power3.out'},
          '-=.3'
        );
      }

      if(heroBtns){
        introTL.fromTo(heroBtns,
          {opacity:0,y:20},
          {opacity:1,y:0,duration:.6,ease:'power3.out'},
          '-=.4'
        );
      }
    }

    // --- Hero Parallax on scroll ---
    const heroContent=document.querySelector('.hero-content');
    const heroPortrait=document.querySelector('.hero-portrait');
    if(heroContent){
      gsap.to(heroContent,{
        y:120,opacity:.3,
        ease:'none',
        scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}
      });
    }
    if(heroPortrait){
      gsap.to(heroPortrait,{
        y:80,scale:.95,
        ease:'none',
        scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}
      });
    }

    // --- Floating Screens Stagger ---
    const screens=gsap.utils.toArray('.float-screen');
    screens.forEach((screen,i)=>{
      gsap.fromTo(screen,
        {y:80,opacity:0,rotateY:i%2===0?-5:5},
        {y:0,opacity:1,rotateY:0,duration:1,ease:'power3.out',
          scrollTrigger:{trigger:screen,start:'top 85%',toggleActions:'play none none none'}
        }
      );
    });

    // --- Section Headers ---
    gsap.utils.toArray('.section-header').forEach(header=>{
      const label=header.querySelector('.section-label');
      const title=header.querySelector('.section-title');
      const line=header.querySelector('.section-line');
      const tl=gsap.timeline({scrollTrigger:{trigger:header,start:'top 80%'}});
      if(label) tl.fromTo(label,{opacity:0,y:15},{opacity:1,y:0,duration:.5,ease:'power2.out'});
      if(title) tl.fromTo(title,{opacity:0,y:25},{opacity:1,y:0,duration:.6,ease:'power2.out'},'-=.2');
      if(line) tl.fromTo(line,{scaleX:0},{scaleX:1,duration:.8,ease:'power2.inOut'},'-=.3');
    });

    // --- Social Media Cards ---
    gsap.utils.toArray('.sm-card').forEach((card,i)=>{
      gsap.fromTo(card,
        {y:60,opacity:0,scale:.95},
        {y:0,opacity:1,scale:1,duration:.7,ease:'power3.out',delay:i*.1,
          scrollTrigger:{trigger:card,start:'top 85%'}
        }
      );
    });

    // --- Process Steps ---
    gsap.utils.toArray('.process-step').forEach((step,i)=>{
      gsap.fromTo(step,
        {x:i%2===0?-40:40,opacity:0},
        {x:0,opacity:1,duration:.6,ease:'power3.out',
          scrollTrigger:{trigger:step,start:'top 85%'}
        }
      );
    });

    // --- Stats Animation ---
    gsap.utils.toArray('.stat').forEach((stat,i)=>{
      gsap.fromTo(stat,
        {y:30,opacity:0},
        {y:0,opacity:1,duration:.5,ease:'power2.out',delay:i*.08,
          scrollTrigger:{trigger:stat,start:'top 90%'}
        }
      );
    });
  }


  /* ===== MAGNETIC BUTTONS ===== */
  document.querySelectorAll('.btn-primary,.btn-outline,.nav-cta').forEach(btn=>{
    btn.classList.add('btn-magnetic');
    btn.addEventListener('mousemove',e=>{
      const rect=btn.getBoundingClientRect();
      const x=(e.clientX-rect.left-rect.width/2)*.25;
      const y=(e.clientY-rect.top-rect.height/2)*.25;
      btn.style.transform=`translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave',()=>{
      btn.style.transform='translate(0,0)';
    });
  });


  /* ===== SCROLL REVEAL (fallback for non-GSAP elements) ===== */
  const rObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');rObs.unobserve(e.target)}});
  },{threshold:.12});
  document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el=>rObs.observe(el));

  /* ===== COUNTER ANIMATION ===== */
  function animateNum(el){
    const txt=el.textContent.trim();
    const m=txt.match(/^([\d.]+)(.*)$/);
    if(!m)return;
    const target=parseFloat(m[1]),suffix=m[2]||'',dur=1500,start=performance.now();
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
  document.querySelectorAll('.stat-num,.cs-metric-num').forEach(el=>cObs.observe(el));


  /* ===== LAZY IMAGES ===== */
  document.querySelectorAll('img').forEach((img,i)=>{
    if(i>=2&&!img.hasAttribute('loading'))img.setAttribute('loading','lazy');
  });



  /* ===== AURORA CANVAS (homepage hero) ===== */
  const canvas=document.getElementById('hero-canvas');
  if(canvas){
    const ctx=canvas.getContext('2d');let W,H,t=0,mx=.5,my=.5;
    function resize(){const p=canvas.parentElement;W=canvas.width=p.clientWidth;H=canvas.height=p.clientHeight}
    resize();window.addEventListener('resize',resize);
    document.addEventListener('mousemove',e=>{mx=e.clientX/W;my=e.clientY/H});

    const stars=[];for(let i=0;i<25;i++)stars.push({x:Math.random()*2e3,y:Math.random()*1e3,r:.3+Math.random()*.6,tw:Math.random()*6.28,sp:.5+Math.random()});
    let lastFrame=0;

    function wave(yB,amp,freq,spd,col,lw){
      ctx.beginPath();ctx.strokeStyle=col;ctx.lineWidth=lw;
      for(let x=0;x<=W;x+=4){
        const y=yB+Math.sin(x*freq+t*spd)*amp+Math.sin(x*freq*.5+t*spd*1.3)*amp*.5+(my-.5)*15;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }ctx.stroke();
    }

    function draw(now){
      if(now-lastFrame<33){requestAnimationFrame(draw);return}lastFrame=now;
      t+=.008;ctx.fillStyle='#171719';ctx.fillRect(0,0,W,H);
      const g=ctx.createRadialGradient(W*.4,H*.4,0,W*.4,H*.4,H*.6);
      g.addColorStop(0,'rgba(40,50,80,.08)');g.addColorStop(1,'transparent');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      const wg=ctx.createRadialGradient(W*.6,H*.5,0,W*.6,H*.5,H*.5);
      wg.addColorStop(0,'rgba(196,147,85,.04)');wg.addColorStop(1,'transparent');
      ctx.fillStyle=wg;ctx.fillRect(0,0,W,H);
      for(let i=0;i<3;i++)wave(H*.3+i*H*.08,15+i*4,.003,.7+i*.15,`hsla(${215+i*8},40%,40%,${.04-i*.01})`,1);
      for(let i=0;i<2;i++)wave(H*.65+i*H*.05,10+i*3,.004,1+i*.2,`rgba(196,147,85,${.04-i*.012})`,0.7);
      stars.forEach(s=>{
        const f=.3+Math.sin(t*s.sp+s.tw)*.3;
        ctx.beginPath();ctx.arc(s.x%W,s.y%H,s.r,0,6.28);
        ctx.fillStyle=`rgba(200,210,230,${f*.25})`;ctx.fill();
      });
      const v=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.9);
      v.addColorStop(0,'transparent');v.addColorStop(1,'rgba(23,23,25,.45)');
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


  /* ===== FLOATING CONTACT BUTTONS ===== */
  // WhatsApp
  const waBtn=document.createElement('a');
  waBtn.href='https://api.whatsapp.com/send?phone=639661380614&text=Hi%20Jay!%20I%20found%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20project.';
  waBtn.target='_blank';
  waBtn.rel='noopener noreferrer';
  waBtn.id='wa-float';
  waBtn.setAttribute('aria-label','Chat on WhatsApp');
  waBtn.innerHTML=`<svg viewBox="0 0 32 32" width="28" height="28" fill="#fff"><path d="M16.004 3.2C8.92 3.2 3.2 8.92 3.2 16c0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.62-1.74A12.72 12.72 0 0016.004 28.8C23.08 28.8 28.8 23.08 28.8 16S23.08 3.2 16.004 3.2zm0 23.2a10.34 10.34 0 01-5.28-1.44l-.38-.22-3.93 1.03 1.05-3.84-.25-.39A10.34 10.34 0 015.6 16c0-5.74 4.66-10.4 10.4-10.4S26.4 10.26 26.4 16s-4.66 10.4-10.396 10.4zm5.7-7.78c-.31-.16-1.85-.91-2.14-1.02-.28-.1-.49-.16-.7.16-.2.31-.8 1.02-.98 1.23-.18.2-.36.23-.67.08-.31-.16-1.32-.49-2.52-1.56-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.55.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.55-.08-.16-.7-1.68-.95-2.3-.25-.6-.51-.52-.7-.53h-.6c-.2 0-.53.08-.81.39-.28.31-1.07 1.05-1.07 2.55s1.1 2.96 1.25 3.16c.16.2 2.16 3.3 5.23 4.63.73.32 1.3.5 1.75.65.74.24 1.4.2 1.93.12.59-.09 1.85-.76 2.1-1.49.26-.73.26-1.36.18-1.49-.08-.14-.28-.22-.6-.38z"/></svg>`;

  // Discord
  const dcBtn=document.createElement('a');
  dcBtn.href='https://discord.com/';
  dcBtn.target='_blank';
  dcBtn.rel='noopener noreferrer';
  dcBtn.id='dc-float';
  dcBtn.setAttribute('aria-label','Chat on Discord');
  dcBtn.innerHTML=`<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;

  // Inject styles
  const floatStyle=document.createElement('style');
  floatStyle.textContent=`
    .float-btn{position:fixed;right:28px;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:9999;transition:all .3s ease;text-decoration:none}
    .float-btn:hover{transform:scale(1.12)}
    #wa-float{bottom:28px;background:#25D366;box-shadow:0 4px 20px rgba(37,211,102,.4);animation:waPulse 2s ease-in-out infinite}
    #wa-float:hover{box-shadow:0 6px 30px rgba(37,211,102,.6)}
    #dc-float{bottom:96px;background:#5865F2;box-shadow:0 4px 20px rgba(88,101,242,.4);animation:dcPulse 2s ease-in-out infinite}
    #dc-float:hover{box-shadow:0 6px 30px rgba(88,101,242,.6)}
    @keyframes waPulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.4)}50%{box-shadow:0 4px 20px rgba(37,211,102,.4),0 0 0 12px rgba(37,211,102,.1)}}
    @keyframes dcPulse{0%,100%{box-shadow:0 4px 20px rgba(88,101,242,.4)}50%{box-shadow:0 4px 20px rgba(88,101,242,.4),0 0 0 12px rgba(88,101,242,.1)}}
    @media(max-width:768px){.float-btn{width:48px;height:48px;right:18px}#wa-float{bottom:18px}#dc-float{bottom:78px}}
  `;
  document.head.appendChild(floatStyle);
  waBtn.classList.add('float-btn');
  dcBtn.classList.add('float-btn');
  document.body.appendChild(waBtn);
  document.body.appendChild(dcBtn);

});
