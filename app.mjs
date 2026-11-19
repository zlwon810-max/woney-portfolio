import {socialChannels} from './social-content.mjs?v=kirby2';
import {createSuitcaseSound} from './suitcase-sound.mjs?v=kirby2';
import {caseSummary,caseView} from './case-view.mjs?v=kirby2';
import {socialView} from './social-view.mjs?v=kirby2';
import {projects} from './projects.mjs?v=kirby2';
import {createWorkWheel} from './work-wheel.mjs';
import {site} from './site-config.mjs?v=kirby2';
import {createMedia,mediaKind} from './media.mjs';
import {sceneState,scenePosition} from './journey-state.mjs';
history.scrollRestoration='manual';
const $=s=>document.querySelector(s);
const journey=$('#journey');
const scenes=[...document.querySelectorAll('.scene')];
const ids=scenes.map(s=>s.id);
const labels=['ARRIVAL','ABOUT','INTERVIEW','WORK','CONTACT'];
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let listMode=preference.matches,current=-1,frame=0,loaded=new Set();
const track=$('#tray-track'),dialog=$('#project-dialog');
let selection=0,filtered=projects,manualTray=false,lastTrigger;
let previewUrl;

const suitcaseSound=createSuitcaseSound($('#sound-toggle'));
const objectPath='assets/objects/';
const film=$('#suitcase-film'),filmLayer=$('.intro-film');
let filmTarget=0, desiredFrame=0;
const filmFrames=new Map();
function frameUrl(n){return 'assets/intro/frames/'+String(n).padStart(3,'0')+'.jpg';}
function loadFilmFrame(n){
 if(n<0||n>120||filmFrames.has(n))return;
 const image=new Image();filmFrames.set(n,image);
 image.onload=()=>{if(n===desiredFrame)film.src=image.src;};
 image.onerror=()=>filmFrames.delete(n);
 image.src=frameUrl(n);
}
function seekFilm(){
 desiredFrame=Math.max(0,Math.min(120,Math.round(filmTarget*15)));
 loadFilmFrame(desiredFrame);
 const image=filmFrames.get(desiredFrame);
 if(image?.complete&&image.naturalWidth)film.src=image.src;
 for(let d=1;d<=4;d++){loadFilmFrame(desiredFrame+d);loadFilmFrame(desiredFrame-d);}
}
// Decode in small batches, without relying on video autoplay or byte-range seeking.
let preloadFrame=0;
const preloadTimer=setInterval(()=>{
 if(document.hidden)return;
 for(let n=0;n<5&&preloadFrame<=120;n++)loadFilmFrame(preloadFrame++);
 if(preloadFrame>120)clearInterval(preloadTimer);
},100);
function paintFilm(index,local){
 const visible=index<2&&!listMode;
 const transfer=index===1?Math.max(0,Math.min(1,(local-.62)/.38)):index>1?1:0;
 const eased=transfer*transfer*(3-2*transfer);
 filmLayer.style.setProperty('--film-zoom',String(1+eased*.7));
 filmLayer.style.setProperty('--film-alpha',String(1-eased));
 const book=scenes[2];
 book.classList.toggle('book-arriving',index===1&&transfer>0&&!listMode);
 book.style.setProperty('--arrival',String(eased));
 if(index===1&&transfer>0)loadScene(2);
 filmLayer.classList.toggle('visible',visible);
 filmTarget=index===0?local*4:4+Math.min(1,local/.72)*3.95;
 if(visible)seekFilm();
 suitcaseSound.update(visible?index+local:3);
 scenes[0].style.setProperty('--title-opacity',String(Math.max(0,1-local*2.8)));
 scenes[1].style.setProperty('--passport-ready',String(local>.4&&local<.7?1:0));
}

function loadScene(index){
 if(index<0||index>=scenes.length||loaded.has(index))return;
 scenes[index].querySelectorAll('img[data-src]').forEach(img=>{img.src=img.dataset.src;img.removeAttribute('data-src');});
 loaded.add(index);
}
function setCurrent(index,local=0){
 if(current!==index){
  const previous=current;current=index;
  scenes.forEach((scene,i)=>{
   const active=i===index;scene.classList.toggle('active',active);
   scene.inert=!listMode&&!active;scene.setAttribute('aria-hidden',String(!listMode&&!active));
   if(!active)scene.querySelectorAll('video').forEach(v=>v.pause());
  });
  // Keep the selected tray when returning to Work or resizing a mobile browser.
  document.querySelectorAll('.nav-pills a').forEach(a=>{if(a.hash==='#'+ids[index])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelectorAll('.journey-rail a').forEach(a=>{if(a.hash==='#'+ids[index])a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
  $('#scene-number').textContent=String(index+1).padStart(2,'0');
  $('#scene-label').textContent=labels[index];
  $('#next-scene').firstChild.textContent=['캐리어 열기 ','인터뷰 보기 ','작품 보기 ','연락처 ','처음으로 '][index];
  $('#next-scene span').textContent=index===4?'↑':'↓';
  loadScene(index);loadScene(index+1);
  if(ids[index]==='interview')playInterview();
  const activeElement=document.activeElement;
  if(!listMode && activeElement && scenes.some((s,i)=>i!==index&&s.contains(activeElement))){
   // Do not leave keyboard focus inside an inert scene after the user scrolls.
   $('.nav-pills a[aria-current="page"]')?.focus({preventScroll:true});
  }
 }
 scenes[index].style.setProperty('--local',String(local));
 // Work also accepts wheel navigation; detail dialogs keep native scrolling.
}
function paintScroll(index,local){
 paintFilm(index,local);
 scenes.forEach(s=>{s.classList.remove('pixel-incoming');s.style.clipPath='';});
 if(listMode||preference.matches)return;
 const about=scenes[1];
 const opening=Math.min(1,local/0.3), unpack=Math.max(0,Math.min(1,(local-.22)/.3));
 if(index===1){about.style.setProperty('--opening',opening);about.style.setProperty('--unpack',unpack);}
 scenes[2].style.setProperty('--book-open',1);
 if((index===2||index===3)&&local>.52){
   const progress=(local-.52)/.48,next=scenes[index+1];
   loadScene(index+1);
   next.classList.add('pixel-incoming');
   const cols=innerWidth<760?9:22, rows=Math.ceil(innerHeight/(innerWidth/cols));
   const pts=['0% 100%'];
   for(let c=0;c<cols;c++){
     const offset=((c*7+3)%11)/11;
     const height=Math.max(0,Math.min(rows,Math.floor(progress*(rows+5)-offset*5)));
     const y=100-height/rows*100;
     pts.push((c/cols*100)+'% '+y+'%',((c+1)/cols*100)+'% '+y+'%');
   }
   pts.push('100% 100%');
   next.style.clipPath='polygon('+pts.join(',')+')';
 }
}
function update(){
 frame=0;
 const travel=Math.max(0,journey.offsetHeight-innerHeight);
 if(listMode){
  let index=0;
  scenes.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.5)index=i;});
  setCurrent(index);paintScroll(index,0);$('#progress-line').style.transform=`scaleX(${Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;
 }else{
  const state=sceneState(scrollY-journey.offsetTop,travel,scenes.length);
  setCurrent(state.index,state.local);paintScroll(state.index,state.local);$('#progress-line').style.transform=`scaleX(${state.progress})`;
 }
}
function schedule(){if(!frame)frame=requestAnimationFrame(update);}
function goTo(index,{focus=false,smooth=true}={}){
 index=Math.max(0,Math.min(scenes.length-1,index));loadScene(index);
 history.replaceState(null,'','#'+ids[index]);
 const y=listMode?scenes[index].offsetTop:journey.offsetTop+scenePosition(index,Math.max(0,journey.offsetHeight-innerHeight),scenes.length);
 window.scrollTo({top:y,behavior:smooth&&!listMode&&current===0&&index===1?'smooth':'instant'});
 update();
 if(focus){
  const heading=scenes[index].querySelector('h1,h2');
  heading.tabIndex=-1;heading.focus({preventScroll:true});
 }
}
function applyView(keepIndex=current<0?0:current){
 document.body.classList.toggle('list-mode',listMode);
 $('#view-toggle').setAttribute('aria-pressed',String(listMode));
 $('#view-toggle').textContent=listMode?'장면으로 보기 ◇':'목록으로 보기 ☷';
 scenes.forEach(scene=>{scene.inert=false;scene.removeAttribute('aria-hidden');});
 if(listMode)scenes.forEach((_,i)=>loadScene(i));
 current=-1;goTo(keepIndex,{smooth:false});update();
}
$('#view-toggle').addEventListener('click',()=>{listMode=!listMode;applyView();});
preference.addEventListener('change',e=>{listMode=e.matches;applyView();});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const index=ids.indexOf(a.hash.slice(1));if(index<0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 e.preventDefault();goTo(index,{focus:e.detail===0});
}));
$('#next-scene').addEventListener('click',()=>goTo(current===4?0:current+1,{focus:true}));
window.addEventListener('scroll',schedule,{passive:true});
let workWheel=createWorkWheel();
window.addEventListener('wheel',e=>{
 if(current!==3||dialog.open||listMode||e.ctrlKey)return;
 const delta=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(!delta)return;e.preventDefault();
 const action=workWheel(delta,performance.now(),selection,filtered.length);
 if(action==='next'){goTo(4);workWheel=createWorkWheel();}
 else if(action==='previous'){goTo(2);workWheel=createWorkWheel();}
 else if(action)selectTray(selection+action);
},{passive:false});

window.addEventListener('resize',()=>{const index=current;requestAnimationFrame(()=>{positionTrack();if(index>=0&&!dialog.open)goTo(index,{smooth:false});else schedule();});},{passive:true});
window.addEventListener('hashchange',()=>{const index=ids.indexOf(location.hash.slice(1));if(index>=0)goTo(index,{smooth:false});});
function poster(project){
 const el=document.createElement('div');el.className='tray-poster '+project.visual;
 if(project.cover){const image=createMedia(project.cover,{alt:project.title});if(image){image.classList.add('poster-image');el.append(image);return el;}}
 const type=document.createElement('span');type.className='poster-type';
 type.textContent={kinetic:'TYPE IN\nMOTION.',obsession:'Ob\nsession.',ai:'AI\nFILM.',event:'Little\nmoments.'}[project.visual]||project.title;
 el.append(type);return el;
}
function renderTrays(){
 track.replaceChildren();
 filtered.forEach((project,index)=>{
  const article=document.createElement('article');article.className='tray-card';article.dataset.kind=project.category;
  const button=document.createElement('button');button.className='tray-button';button.setAttribute('aria-label',project.title+' 작품 상세 보기');
  const base=document.createElement('img');base.src=objectPath+'tray-overhead.png';base.alt='';base.className='tray-base';base.draggable=false;
  const belongings=document.createElement('img');belongings.src=project.belongings;belongings.alt='';belongings.className='tray-belongings';belongings.draggable=false;
  button.style.setProperty('--ticket-color',project.ticketColor);
  const ticket=document.createElement('span');ticket.className='boarding-pass';
  const band=document.createElement('span');band.className='boarding-band';band.textContent='BOARDING PASS';
  const plane=document.createElement('span');plane.textContent='✈';band.append(plane);
  const main=document.createElement('span');main.className='boarding-main';
  const title=document.createElement('b');title.textContent=project.title;
  const category=document.createElement('small');category.textContent=project.label;
  const footer=document.createElement('span');footer.className='boarding-footer';footer.textContent='GATE '+project.number+'   /   JIWON PORTFOLIO';main.append(title,category,footer);
  const stub=document.createElement('span');stub.className='boarding-stub';stub.setAttribute('aria-hidden','true');stub.textContent=project.number;
  const barcode=document.createElement('i');stub.append(barcode);ticket.append(band,main,stub);
  const print=poster(project);button.append(base,belongings,print,ticket);
  if(project.id==='social'){article.classList.add('channel-tray');const cards=document.createElement('span');cards.className='channel-business-cards';for(const c of socialChannels){const card=document.createElement('span');card.className='channel-business-card '+c.id;const logo=document.createElement('img');logo.src=c.image;logo.alt='';const name=document.createElement('b');name.textContent=c.name;const type=document.createElement('small');type.textContent=c.type;card.append(logo,name,type);cards.append(card);}button.append(cards);}
  button.addEventListener('click',()=>{selectTray(index);openProject(project,button);});
  article.append(button);track.append(article);
 });
 selection=0;requestAnimationFrame(()=>selectTray(0,false));
}
function positionTrack(){
 const card=track.children[selection];if(!card)return;
 const width=$('#tray-window').clientWidth;
 const step=card.offsetWidth+parseFloat(getComputedStyle(track).columnGap||0);
 track.style.transform=`translate3d(${(width-card.offsetWidth)/2-selection*step}px,0,0)`;
}
function selectTray(index,manual=true){
 selection=Math.max(0,Math.min(filtered.length-1,index));if(manual)manualTray=true;
 [...track.children].forEach((card,i)=>{card.classList.toggle('current',i===selection);card.querySelector('button').tabIndex=i===selection?0:-1;});
 $('#tray-count').textContent=`${String(selection+1).padStart(2,'0')} / ${String(filtered.length).padStart(2,'0')}`;
 $('#previous-tray').disabled=selection===0;$('#next-tray').disabled=selection===filtered.length-1;
 positionTrack();
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
 const category=b.dataset.filter;filtered=projects.filter(p=>category==='all'||p.category===category);manualTray=true;
 document.querySelectorAll('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
 renderTrays();
}));
$('#previous-tray').addEventListener('click',()=>selectTray(selection-1));
$('#next-tray').addEventListener('click',()=>selectTray(selection+1));
$('#tray-window').addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selectTray(selection+(e.key==='ArrowLeft'?-1:1));}
});
let touchStart;
$('#tray-window').addEventListener('touchstart',e=>{const p=e.touches[0];touchStart={x:p.clientX,y:p.clientY};},{passive:true});
$('#tray-window').addEventListener('touchend',e=>{
 if(!touchStart)return;const p=e.changedTouches[0];const dx=p.clientX-touchStart.x,dy=p.clientY-touchStart.y;
 if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)selectTray(selection+(dx<0?1:-1));touchStart=null;
},{passive:true});
function openProject(project,trigger){
 lastTrigger=trigger;
 const body=document.createElement('div');body.className='detail-body';
 if(project.id==='social'){
  body.classList.add('social-detail');const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='SNS / CONTENT & CHANNEL OPERATIONS';
  const heading=document.createElement('h2');heading.id='detail-title';heading.textContent='SNS 숏폼 · 채널 운영';body.append(eyebrow,heading,socialView());
  $('#detail-content').replaceChildren(body);dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');$('#interview-player video')?.pause();return;
 }

 const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='WORK / '+project.label;
 const title=document.createElement('h2');title.id='detail-title';title.textContent=project.title;
 const subtitle=document.createElement('p');subtitle.className='detail-sub';subtitle.textContent=project.subtitle;
 const media=document.createElement('div');media.className='detail-media';
 if(project.youtube){
  const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/'+project.youtube;iframe.title=project.title;iframe.allow='fullscreen; picture-in-picture; encrypted-media';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';media.append(iframe);
 }else if(project.media){const node=createMedia(project.media,{alt:project.title,poster:project.cover});media.append(node||poster(project));}
 else media.append(poster(project));
 const note=document.createElement('p');note.className='detail-note';note.textContent=project.mediaNote||'';
 const description=document.createElement('p');description.className='detail-description';description.textContent=project.description;
 const columns=document.createElement('div');columns.className='detail-columns';
 for(const [label,value] of [['CONCEPT / 기획 의도',project.concept],['TOOLS / 사용 도구·역할',project.process]]){
  if(!value)continue;
  const col=document.createElement('div'),heading=document.createElement('h3'),text=document.createElement('p');heading.textContent=label;text.textContent=value;col.append(heading,text);columns.append(col);
 }
 body.append(eyebrow,title,subtitle);const summary=caseSummary(project.id);if(summary)body.append(summary);if(project.id!=='hospital')body.append(media);if(project.mediaNote)body.append(note);body.append(description);const caseContent=caseView(project.id);if(caseContent)body.append(caseContent);else body.append(columns);const tools=document.createElement('p');tools.className='case-tools';tools.textContent=project.process||'';body.append(tools);
 if(project.items){
  const gallery=document.createElement('div');gallery.className='sns-gallery';
  for(const item of project.items){
   const entry=document.createElement('article');const image=document.createElement('img');image.src=item.cover;image.alt=item.title;image.loading='lazy';
   const heading=document.createElement('h3');heading.textContent=item.title;entry.append(image,heading);
   if(item.youtube){const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/'+item.youtube;iframe.title=item.title;iframe.loading='lazy';iframe.allowFullscreen=true;iframe.allow='fullscreen; picture-in-picture; encrypted-media';iframe.referrerPolicy='strict-origin-when-cross-origin';entry.append(iframe);}
   if(item.link){const link=document.createElement('a');link.href=item.link;link.target='_blank';link.rel='noopener noreferrer';link.textContent='작업 보기 ↗';entry.append(link);}
   gallery.append(entry);
  }
  body.append(gallery);
 }
 if(project.fullLink){const a=document.createElement('a');a.href=project.fullLink;a.target='_blank';a.rel='noopener noreferrer';a.className='detail-link';a.textContent='전체 영상 보기 ↗';body.append(a);}
 if(project.link){
  try{const url=new URL(project.link);if(['https:','http:'].includes(url.protocol)){const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.className='detail-link';a.textContent='작업 과정·원문 보기 ↗';body.append(a);}}catch{}
 }
 const contact=document.createElement('a');contact.href='mailto:'+site.email;contact.textContent='이 작업에 대해 이야기하기 ↗';contact.className='detail-link';body.append(contact);
 $('#detail-content').replaceChildren(body);dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');
 $('#interview-player video')?.pause();
}
$('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{dialog.querySelectorAll('video').forEach(v=>v.pause());dialog.querySelectorAll('iframe').forEach(f=>f.remove());document.body.classList.remove('modal-open');lastTrigger?.focus({preventScroll:true});});
function playInterview(){
 const video=$('#interview-player video');
 if(!video||preference.matches||dialog.open)return;
 video.play().catch(()=>{if(current===ids.indexOf('interview')&&video.paused&&!video.error)$('#interview-status').textContent='재생 버튼을 눌러 주세요.';});
}
function mountInterview(source,isLocal=false){
 const video=document.createElement('video');video.controls=true;video.muted=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label','WONEY 인터뷰 영상');video.src=source;
 if(site.interview.poster)video.poster=site.interview.poster;
 if(site.interview.captions){const t=document.createElement('track');t.kind='captions';t.src=site.interview.captions;t.srclang='ko';t.label='한국어';t.default=true;video.append(t);}
 video.addEventListener('error',()=>$('#interview-status').textContent='이 영상은 브라우저에서 재생할 수 없습니다. MP4(H.264) 또는 WebM 파일로 바꿔 주세요.');
 const player=$('#interview-player');player.querySelector('video')?.pause();
 const fileInput=$('#interview-file');if(fileInput&&player.contains(fileInput))$('.interview-aside').append(fileInput);
 player.replaceChildren(video);
 const sound=document.createElement('button');sound.className='interview-sound';sound.textContent='인터뷰 소리 켜기';sound.addEventListener('click',()=>{video.muted=!video.muted;video.play().catch(()=>{});});video.addEventListener('volumechange',()=>sound.textContent=video.muted?'인터뷰 소리 켜기':'인터뷰 소리 끄기');$('.interview-aside .interview-sound')?.remove();$('.interview-aside').append(sound);
 if(current===ids.indexOf('interview'))playInterview();
 if(isLocal&&!$('.change-video')){const label=document.createElement('label');label.htmlFor='interview-file';label.textContent='다른 영상 선택 ↗';label.className='change-video text-link';$('.interview-aside').append(label);}
}
$('#interview-file').addEventListener('change',e=>{
 const file=e.target.files[0];if(!file)return;
 if(mediaKind(file.name)!=='video'){$('#interview-status').textContent='MP4, WebM 또는 MOV 영상을 선택해 주세요.';return;}
 if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(file);mountInterview(previewUrl,true);
 $('#interview-status').textContent='기기 내 미리보기: '+file.name+' · 업로드·저장되지 않습니다.';
});
if(site.interview.src){mountInterview(site.interview.src);}
if(site.portfolioPdf){const a=document.createElement('a');a.href=site.portfolioPdf;a.textContent='포트폴리오 PDF ↓';a.download='';$('.contact-actions').append(a);}
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(site.email);$('#copy-status').textContent='이메일 주소를 복사했습니다.';}catch{$('#copy-status').textContent='이 주소를 복사해 주세요: '+site.email;}});
window.addEventListener('pagehide',()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);cancelAnimationFrame(frame);});
renderTrays();
const initialIndex=Math.max(0,ids.indexOf(location.hash.slice(1)));
loadScene(initialIndex);loadScene(initialIndex+1);
applyView(initialIndex);
