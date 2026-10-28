const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-asset]').forEach(el=>{const fail=()=>{el.hidden=true;const note=el.parentElement.querySelector('.asset-note');if(note)note.hidden=false;const control=el.parentElement.querySelector('.reel-control');if(control)control.hidden=true;};el.addEventListener('error',fail);if(el.tagName==='IMG'&&el.complete&&!el.naturalWidth)fail();});

const videos=document.querySelectorAll('[data-interactive-video]');
function playVisible(video){if(!document.hidden&&!reduced&&video.dataset.visible==='true'&&!video.dataset.userPaused)video.play().catch(()=>{});}
const videoObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{target.dataset.visible=String(isIntersecting);if(isIntersecting){if(target.preload==='none')target.preload='metadata';playVisible(target);}else target.pause();}),{threshold:.6});
videos.forEach(video=>{
 const label=()=>video.setAttribute('aria-label',video.paused?'Play film':'Pause film');
 const toggle=()=>{if(video.paused){delete video.dataset.userPaused;video.play().catch(()=>{});}else{video.dataset.userPaused='true';video.pause();}};
 videoObserver.observe(video);
 video.addEventListener('click',toggle);
 video.addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();toggle();}});
 video.addEventListener('play',label);video.addEventListener('pause',label);
 video.addEventListener('error',()=>{const note=video.parentElement.querySelector('.video-error');if(note)note.hidden=false;});label();
});
document.addEventListener('visibilitychange',()=>videos.forEach(video=>{if(document.hidden)video.pause();else playVisible(video);}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;observer.unobserve(el);const target=Number(el.dataset.target);if(reduced)return;const start=performance.now();function tick(now){const progress=Math.min((now-start)/1200,1);el.textContent=Math.round(target*progress);if(progress<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}),{threshold:.5});document.querySelectorAll('.counter').forEach(el=>observer.observe(el));