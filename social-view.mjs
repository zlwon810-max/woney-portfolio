import {toolView,channelTools} from './tool-view.mjs?v=passport4';
import {socialChannels} from './social-content.mjs?v=passport4';
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;};
const link=(text,url)=>{const a=el('a','social-link',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
export function socialView(){
 const root=el('div','social-case');root.append(toolView(channelTools));
 const intro=el('p','social-intro','채널의 주제와 시청자를 이해하고, 콘텐츠 기획부터 촬영·편집과 게시·운영까지 연결했습니다. 인스타그램 릴스와 유튜브 리뷰·Shorts를 함께 제작한 경험을 소개합니다.');root.append(intro);
 const scope=el('div','contribution-grid');
 for(const [title,text] of [['담당 범위','소재 기획 · 촬영·편집 · 게시용 디자인 · 계정 운영'],['플랫폼 경험','Instagram 릴스·카드뉴스 / YouTube 리뷰·Shorts'],['참여 형태','UPing·먹어두댕 실무 / 대구루루 팀 프로젝트']]){const card=el('section');card.append(el('h3','',title),el('p','',text));scope.append(card);}root.append(scope);
 const flow=el('ol','operation-flow');for(const [title,desc] of [['기획','시청자·주제에 맞는 소재 선정'],['제작','촬영 · 편집 · 게시용 디자인'],['게시·운영','플랫폼에 맞춰 콘텐츠 전달'],['개선','반응과 피드백을 다음 제작에 반영']]){const li=el('li');li.append(el('b','',title),el('span','',desc));flow.append(li);}root.append(flow);
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
  const contribution=el('div','channel-contribution');contribution.append(el('b','','MY CONTRIBUTION / 담당 범위'),el('p','',c.roles.map(r=>r[0]).join(' · ')));section.append(contribution);
  const previews={uping:[['assets/work/cover-00.jpg','채널 운영 사례'],['assets/work/cover-04.jpg','현장 촬영 콘텐츠'],['assets/work/cover-05.jpg','아티스트 인터뷰']],daegu:[['assets/work/cover-01.jpg','로컬 채널 기획'],['assets/work/cover-06.jpg','카드뉴스·릴스 제작']],food:[['assets/work/cover-02.jpg','맛집 채널 운영'],['assets/work/cover-07.jpg','맛집 촬영·편집']]};
  const gallery=el('div','channel-preview-grid');for(const [src,label] of previews[c.id]){const figure=el('figure');const a=link('',src);const image=el('img');image.src=src;image.alt=c.name+' '+label;image.loading='lazy';a.append(image);figure.append(a,el('figcaption','',label+' ↗'));gallery.append(figure);}section.append(gallery);
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
