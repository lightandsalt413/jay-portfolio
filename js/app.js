document.addEventListener('DOMContentLoaded',()=>{

  /* ===== CURSOR ===== */
  const cur=document.querySelector('.cur'),dot=document.querySelector('.dot');
  if(cur&&dot&&window.innerWidth>768){
    let cx=0,cy=0,dx=0,dy=0;
    document.addEventListener('mousemove',e=>{
      cx=e.clientX;cy=e.clientY;
      dot.style.left=cx+'px';dot.style.top=cy+'px';
      if(!cur.classList.contains('on')){cur.classList.add('on');dot.classList.add('on')}
    });
    // Smooth cursor follow
    function tickCur(){
      dx+=(cx-dx)*.12;dy+=(cy-dy)*.12;
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

  /* ===== GSAP ANIMATIONS ===== */
  if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    const heroContent=document.querySelector('.hero-content');
    const heroPortrait=document.querySelector('.hero-portrait');
    if(heroContent){
      gsap.from(heroContent,{y:80,opacity:0,duration:1.5,ease:'power3.out',delay:.3});
    }
    if(heroPortrait){
      gsap.from(heroPortrait,{y:100,opacity:0,scale:.95,duration:1.8,ease:'power3.out',delay:.5});
      // Parallax on scroll
      gsap.to(heroPortrait,{
        y:-80,
        scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}
      });
    }

    // Scroll-triggered reveals with stagger
    gsap.utils.toArray('.rv,.rv-l,.rv-r,.rv-s').forEach(el=>{
      const dir=el.classList.contains('rv-l')?{x:-60}:
                el.classList.contains('rv-r')?{x:60}:
                el.classList.contains('rv-s')?{scale:.85}:{y:60};
      gsap.from(el,{
        ...dir,opacity:0,duration:1,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}
      });
    });

    // Service cards stagger
    gsap.utils.toArray('.service-card').forEach((card,i)=>{
      gsap.from(card,{
        y:50,opacity:0,duration:.8,delay:i*.15,ease:'power3.out',
        scrollTrigger:{trigger:card,start:'top 85%'}
      });
    });

    // Project cards scale-in
    gsap.utils.toArray('.project-card').forEach((card,i)=>{
      gsap.from(card,{
        scale:.9,opacity:0,duration:.8,delay:i*.1,ease:'power3.out',
        scrollTrigger:{trigger:card,start:'top 85%'}
      });
    });

    // Stats counter with GSAP
    gsap.utils.toArray('.stat').forEach((stat,i)=>{
      gsap.from(stat,{
        y:40,opacity:0,duration:.7,delay:i*.15,ease:'power3.out',
        scrollTrigger:{trigger:stat,start:'top 85%',onEnter:()=>{
          const numEl=stat.querySelector('.stat-num');
          if(numEl) animateNum(numEl);
        }}
      });
    });

    // CTA parallax
    const ctaTitle=document.querySelector('.cta-title');
    if(ctaTitle){
      gsap.from(ctaTitle,{
        y:60,opacity:0,duration:1,ease:'power3.out',
        scrollTrigger:{trigger:ctaTitle,start:'top 85%'}
      });
    }

    // Footer logo reveal
    const footerLogo=document.querySelector('.footer-logo');
    if(footerLogo){
      gsap.from(footerLogo,{
        scale:.8,opacity:0,duration:1.2,ease:'power3.out',
        scrollTrigger:{trigger:footerLogo,start:'top 90%'}
      });
    }

  } else {
    // Fallback: use IntersectionObserver if GSAP not loaded
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
    const target=parseFloat(m[1]),suffix=m[2]||'',dur=1600,start=performance.now();
    const isF=txt.includes('.');
    function ease(t){return 1-Math.pow(1-t,4)}
    function tick(now){
      const p=Math.min((now-start)/dur,1),v=ease(p)*target;
      el.textContent=(isF?v.toFixed(1):Math.floor(v))+suffix;
      if(p<1)requestAnimationFrame(tick);else el.textContent=txt;
    }
    requestAnimationFrame(tick);
  }
  // Also observe case study metrics
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

  /* ===== AURORA CANVAS (homepage hero) ===== */
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
      // Blue ambient glow
      const g=ctx.createRadialGradient(W*(.35+mx*.1),H*(.35+my*.1),0,W*.4,H*.4,H*.6);
      g.addColorStop(0,'rgba(40,50,80,.1)');g.addColorStop(1,'transparent');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      // Warm amber glow
      const wg=ctx.createRadialGradient(W*(.6+mx*.05),H*.5,0,W*.6,H*.5,H*.5);
      wg.addColorStop(0,'rgba(196,147,85,.05)');wg.addColorStop(1,'transparent');
      ctx.fillStyle=wg;ctx.fillRect(0,0,W,H);
      // Waves
      for(let i=0;i<5;i++)wave(H*.25+i*H*.06,15+i*4,.003-i*.0001,.6+i*.12,`hsla(${215+i*8},40%,40%,${.05-i*.008})`,1);
      for(let i=0;i<4;i++)wave(H*.6+i*H*.04,10+i*3,.004,1+i*.2,`rgba(196,147,85,${.04-i*.008})`,0.7);
      // Stars with twinkle
      stars.forEach(s=>{
        const f=.2+Math.sin(t*s.sp+s.tw)*.4;
        ctx.beginPath();ctx.arc(s.x%W,s.y%H,s.r,0,6.28);
        ctx.fillStyle=`rgba(200,210,230,${f*.3})`;ctx.fill();
      });
      // Vignette
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

  /* ===== SMOOTH SCROLL LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target=document.querySelector(a.getAttribute('href'));
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}
    });
  });

});
