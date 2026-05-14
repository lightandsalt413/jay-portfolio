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


  /* ===== 3D HOME CAROUSEL (Swiper Coverflow) ===== */
  const homeCarousel=document.querySelector('.home-carousel');
  if(homeCarousel&&typeof Swiper!=='undefined'){
    new Swiper('.home-carousel',{
      effect:'coverflow',
      grabCursor:true,
      centeredSlides:true,
      slidesPerView:'auto',
      loop:true,
      loopedSlides:8,
      speed:800,
      threshold:5,
      resistanceRatio:0,
      followFinger:true,
      coverflowEffect:{
        rotate:0,
        stretch:60,
        depth:180,
        modifier:1,
        slideShadows:false,
      },
      pagination:{
        el:'.hc-pagination',
        clickable:true,
        dynamicBullets:true,
        dynamicMainBullets:4,
      },
      autoplay:{
        delay:4000,
        disableOnInteraction:true,
        pauseOnMouseEnter:true,
      },
      keyboard:{enabled:true},
    });
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

});
