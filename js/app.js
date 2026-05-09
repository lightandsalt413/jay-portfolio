document.addEventListener('DOMContentLoaded',()=>{

  /* ===== CURSOR ===== */
  const cur=document.querySelector('.cur'),dot=document.querySelector('.dot');
  if(cur&&dot&&window.innerWidth>768){
    document.addEventListener('mousemove',e=>{
      cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';
      dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';
      if(!cur.classList.contains('on')){cur.classList.add('on');dot.classList.add('on')}
    });
    document.querySelectorAll('a,button,.btn-primary,.btn-outline,.form-btn,.nav-link').forEach(el=>{
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

  /* ===== SCROLL REVEAL ===== */
  const rObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');rObs.unobserve(e.target)}});
  },{threshold:.15});
  document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el=>rObs.observe(el));

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
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animateNum(e.target);cObs.unobserve(e.target)}});
  },{threshold:.5});
  document.querySelectorAll('.stat-num,.cs-metric-num').forEach(el=>cObs.observe(el));

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

    const stars=[];for(let i=0;i<80;i++)stars.push({x:Math.random()*2e3,y:Math.random()*1e3,r:.3+Math.random()*1,tw:Math.random()*6.28,sp:.5+Math.random()*2});

    function wave(yB,amp,freq,spd,col,lw){
      ctx.beginPath();ctx.strokeStyle=col;ctx.lineWidth=lw;
      for(let x=0;x<=W;x+=3){
        const y=yB+Math.sin(x*freq+t*spd)*amp+Math.sin(x*freq*.5+t*spd*1.3)*amp*.5+(my-.5)*20;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }ctx.stroke();
    }

    function draw(){
      t+=.01;ctx.fillStyle='#171719';ctx.fillRect(0,0,W,H);
      const g=ctx.createRadialGradient(W*.4,H*.4,0,W*.4,H*.4,H*.6);
      g.addColorStop(0,'rgba(40,50,80,.08)');g.addColorStop(1,'transparent');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      const wg=ctx.createRadialGradient(W*.6,H*.5,0,W*.6,H*.5,H*.5);
      wg.addColorStop(0,'rgba(196,147,85,.04)');wg.addColorStop(1,'transparent');
      ctx.fillStyle=wg;ctx.fillRect(0,0,W,H);
      for(let i=0;i<4;i++)wave(H*.3+i*H*.07,18+i*5,.003-i*.0002,.7+i*.15,`hsla(${215+i*8},40%,40%,${.06-i*.012})`,1);
      for(let i=0;i<3;i++)wave(H*.65+i*H*.04,10+i*3,.004,1+i*.2,`rgba(196,147,85,${.05-i*.012})`,0.7);
      stars.forEach(s=>{
        const f=.3+Math.sin(t*s.sp+s.tw)*.35;
        ctx.beginPath();ctx.arc(s.x%W,s.y%H,s.r,0,6.28);
        ctx.fillStyle=`rgba(200,210,230,${f*.35})`;ctx.fill();
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
