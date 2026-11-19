import {socialChannels} from './social-content.mjs?v=kirby2';
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;};
const link=(text,url)=>{const a=el('a','social-link',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
export function socialView(){
 const root=el('div','social-case');
 const intro=el('p','social-intro','연예·문화, 로컬 정보, 맛집. 서로 다른 이용자와 주제에 맞춰 기획하고 제작·운영한 세 계정입니다.');root.append(intro);
 const nav=el('div','social-accounts');
 for(const c of socialChannels){
  const button=el('button','account-summary');const img=el('img');img.src=c.image;img.alt='';
  const body=el('span');body.append(el('small','',c.type),el('b','',c.name),el('span','',c.handle),el('em','','대표 영상 · 담당 업무 ↓'));button.append(img,body);
  button.addEventListener('click',()=>root.querySelector('#social-'+c.id).scrollIntoView({behavior:'smooth',block:'start'}));nav.append(button);
 }
 root.append(nav);
 for(const [index,c] of socialChannels.entries()){
  const section=el('section','social-channel');section.id='social-'+c.id;
  const head=el('div','social-channel-heading');head.append(el('span','channel-number','0'+(index+1)),el('h3','',c.name),el('span','channel-type',c.type));section.append(head,el('p','channel-summary',c.summary));
  const links=el('div','channel-links');links.append(link(c.id==='daegu'?'운영 사례 원문 ↗':'계정 방문 ↗',c.url));if(c.id!=='daegu')links.append(link('운영 사례 원문 ↗',c.source));section.append(links);
  section.append(el('h4','reel-heading',c.id==='food'?'대표 Shorts · 리뷰 영상':'대표 릴스'));
  const reels=el('div','social-reels');
  for(const r of c.reels){
   const card=el('article','reel-card'),media=el('div','reel-media'),play=el('button','reel-play');play.setAttribute('aria-label',r.title+' 재생');
   const image=el('img');image.src=r.cover;image.alt=r.title;image.loading='lazy';play.append(image,el('span','reel-play-label','▶ '+(r.instagram?'릴스 보기':'영상 재생')));media.append(play);
   const url=r.instagram?'https://www.instagram.com/reel/'+r.instagram+'/':'https://www.youtube.com/watch?v='+r.youtube;
   play.addEventListener('click',()=>{const iframe=el('iframe');iframe.title=r.title;iframe.src=r.instagram?url+'embed/':'https://www.youtube-nocookie.com/embed/'+r.youtube+'?autoplay=1';iframe.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';media.replaceChildren(iframe);});
   card.append(media,el('h5','',r.title),el('p','reel-role',r.role),link('원본에서 보기 ↗',url));reels.append(card);
  }
  section.append(reels);if(c.id!=='food')section.append(el('p','embed-note','Instagram 재생이 제한되면 ‘원본에서 보기’로 확인할 수 있습니다.'));
  const roles=el('dl','channel-roles');for(const [title,detail] of c.roles){const row=el('div');row.append(el('dt','',title),el('dd','',detail));roles.append(row);}section.append(roles);
  if(c.evidence)section.append(el('p','channel-evidence',c.evidence));root.append(section);
 }
 root.append(link('노션에서 전체 SNS 작업 보기 ↗','https://app.notion.com/p/Social-growth-SNS-419c06911be08081b9abc9bde3a59cc0'));
 return root;
}
