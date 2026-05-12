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
    function tickCur(){
      dx+=(cx-dx)*.12;dy+=(cy-dy)*.12;
      cur.style.left=dx+'px';cur.style.top=dy+'px';
      requestAnimationFrame(tickCur);
    }
    tickCur();
    document.querySelectorAll('a,button,.service-card,.project-card,.footer-social').forEach(el=>{
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

  /* ===== SCROLL REVEAL (IntersectionObserver — reliable) ===== */
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

  /* ===== 3D CAROUSEL (infinite clone-based loop) ===== */
  const track=document.getElementById('carouselTrack');
  if(track){
    const origCards=[...track.querySelectorAll('.carousel-card')];
    const total=origCards.length;
    let startX=0,dragX=0,dragging=false,isTransitioning=false;

    // Clone cards for seamless infinite loop
    origCards.forEach(c=>{const cl=c.cloneNode(true);cl.setAttribute('data-clone','true');track.appendChild(cl)});
    origCards.forEach(c=>{const cl=c.cloneNode(true);cl.setAttribute('data-clone','true');track.insertBefore(cl,track.firstChild)});

    const allCards=[...track.querySelectorAll('.carousel-card')];
    let current=total; // start at first real card (after prepended clones)

    function getCardWidth(){
      return allCards[0].offsetWidth * 1.03; // card + gap
    }

    function setPosition(animate){
      const cardW=getCardWidth();
      const viewW=track.parentElement.offsetWidth;
      const offset=(viewW/2)-(cardW/2)-(current*cardW);
      if(animate){
        track.style.transition='transform .5s cubic-bezier(.25,.8,.25,1)';
      } else {
        track.style.transition='none';
      }
      track.style.transform=`translateX(${offset}px)`;
      allCards.forEach((c,i)=>{
        c.classList.toggle('active',i===current);
      });
    }

    function goTo(idx){
      if(isTransitioning) return;
      current=idx;
      isTransitioning=true;
      setPosition(true);
    }

    // After smooth transition, silently jump if on a clone
    track.addEventListener('transitionend',()=>{
      isTransitioning=false;
      if(current<total){
        current=current+total;
        setPosition(false);
      } else if(current>=total*2){
        current=current-total;
        setPosition(false);
      }
    });

    // Click card to navigate or go to link
    allCards.forEach((c,i)=>c.addEventListener('click',(e)=>{
      if(i===current){
        const href=c.dataset.href;
        if(href){
          if(c.dataset.external){window.open(href,'_blank')}
          else{window.location.href=href}
        }
      } else {
        e.preventDefault();
        goTo(i);
      }
    }));

    // Touch/swipe
    track.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;dragX=0;dragging=true},{passive:true});
    track.addEventListener('touchmove',e=>{if(dragging)dragX=e.touches[0].clientX-startX},{passive:true});
    track.addEventListener('touchend',()=>{
      if(Math.abs(dragX)>40){dragX<0?goTo(current+1):goTo(current-1)}
      dragX=0;dragging=false;
    });

    // Mouse drag
    track.addEventListener('mousedown',e=>{startX=e.clientX;dragX=0;dragging=true;e.preventDefault()});
    window.addEventListener('mousemove',e=>{if(dragging)dragX=e.clientX-startX});
    window.addEventListener('mouseup',()=>{
      if(dragging&&Math.abs(dragX)>40){dragX<0?goTo(current+1):goTo(current-1)}
      dragX=0;dragging=false;
    });

    // Keyboard
    document.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft')goTo(current-1);
      if(e.key==='ArrowRight')goTo(current+1);
    });

    // Init
    setPosition(false);
    window.addEventListener('resize',()=>setPosition(false));
  }

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
