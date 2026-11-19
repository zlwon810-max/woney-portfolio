const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
const link=(text,url)=>{const n=el('a','social-link',text);n.href=url;n.target='_blank';n.rel='noopener noreferrer';return n;};
export function hospitalOverview(){
 const root=el('section','hospital-overview');
 const metrics=el('div','contribution-grid');
 for(const [label,text] of [['담당 콘텐츠 기여도','100% · 기획부터 제작·게시까지'],['관리 채널','YouTube + Instagram'],['제작 형식','카드뉴스 · 릴스·Shorts · 롱폼']]){const card=el('section');card.append(el('h3','',label),el('p','',text));metrics.append(card);}root.append(metrics);
 root.append(el('p','scope-note','기여도는 담당 기간에 직접 제작·게시한 콘텐츠 기준입니다. 유튜브 롱폼은 아래 대표작 3편, 숏폼은 ‘마루킁킁’ 영상부터 담당했습니다. 업무 인수 전 타 업체 제작 영상은 제외합니다.'));
 const flow=el('ol','operation-flow');for(const [title,text] of [['브랜드 방향','병원 분위기에 맞는 콘텐츠 톤 정리'],['콘텐츠 기획','시설 소개 · 건강정보 · 진료 안내'],['직접 제작','카드뉴스 디자인 · 촬영 · 영상 편집'],['채널 운영','유튜브·인스타그램 게시 및 관리']]){const li=el('li');li.append(el('b','',title),el('span','',text));flow.append(li);}root.append(flow);
 const links=el('div','channel-links');links.append(link('Instagram @art_hospital_kr ↗','https://www.instagram.com/art_hospital_kr/'),link('YouTube 채널 ↗','https://www.youtube.com/@아트한방병원/videos'));root.append(links,el('p','scope-note','Instagram 담당 게시물: 2025.04.30–2025.09.22 · 카드뉴스·릴스 기획, 제작 및 게시'));
 return root;
}
export function hospitalInstagramView(){
 const root=el('section','hospital-instagram');root.append(el('h3','case-heading','Instagram / 브랜딩을 이어가는 콘텐츠'));
 root.append(el('p','channel-summary','같은 로고와 핑크 계열의 시각적 톤을 유지하며 진료 안내 카드뉴스와 건강정보 릴스를 제작했습니다. 아래는 직접 담당한 기간의 실제 게시물입니다.'));
 const gallery=el('div','hospital-post-grid');
 for(const [file,title,type,date,url] of [
 ['hospital-card-0918.jpg','체외충격파 치료 소개','카드뉴스','2025.09.18','https://www.instagram.com/art_hospital_kr/p/DOw-MnlEmlq/'],
 ['hospital-card-0908.jpg','추나요법 정보 안내','카드뉴스','2025.09.08','https://www.instagram.com/art_hospital_kr/p/DOXNwAlkvFH/'],
 ['hospital-reel-0921.jpg','항암 중 식습관을 주제로 한 콘텐츠','건강정보 릴스','2025.09.21','https://www.instagram.com/art_hospital_kr/reel/DO4v0IoiXL4/'],
 ['hospital-reel-0914.jpg','디스크·도수치료를 주제로 한 콘텐츠','건강정보 릴스','2025.09.14','https://www.instagram.com/art_hospital_kr/reel/DOmtaTeDp6n/']]){
 const fig=el('figure');const a=link('',url);a.setAttribute('aria-label',title+' Instagram 원본 보기');const image=el('img');image.src='assets/work/reels/'+file;image.alt=title+' 게시물 표지';image.loading='lazy';a.append(image);const cap=el('figcaption');cap.append(el('small','',type+' / '+date),el('b','',title),el('span','','기획 · 제작 · 게시 100%'),link('게시물 보기 ↗',url));fig.append(a,cap);gallery.append(fig);
 }root.append(gallery);
 const row=el('div','hospital-feature');const media=el('div','reel-media');const button=el('button','reel-play');button.type='button';button.setAttribute('aria-label','아트한방병원 시설 소개 릴스 재생');const img=el('img');img.src='assets/work/reels/hospital-facilities.jpg';img.alt='아트한방병원 시설 소개 릴스 미리보기';button.append(img,el('span','reel-play-label','▶ 시설 소개 릴스 보기'));media.append(button);button.addEventListener('click',()=>{const f=el('iframe');f.src='https://www.instagram.com/reel/DJ0leJOPFM7/embed/';f.title='아트한방병원 시설 소개';f.allow='fullscreen; autoplay; encrypted-media';f.allowFullscreen=true;media.replaceChildren(f);});
 const copy=el('div','hospital-feature-copy');copy.append(el('p','eyebrow','INSTAGRAM / REELS'),el('h4','','병원의 공간과 분위기를 영상으로'),el('p','','시설 비포·애프터와 공간 소개 콘텐츠를 기획·제작했습니다. 병원의 분위기가 실제 공간 화면에서도 이어지도록 구성하고, 인스타그램 릴스로 게시했습니다.'),link('Instagram에서 원본 보기 ↗','https://www.instagram.com/reel/DJ0leJOPFM7/'));row.append(media,copy);root.append(row);
 const roles=el('dl','channel-roles');for(const [title,text] of [['카드뉴스 기획·디자인','병원의 분위기에 맞춰 정보형 카드뉴스를 기획·제작하고 게시했습니다. 영상과 이미지 게시물이 한 계정의 콘텐츠로 읽히도록 시각적 톤을 맞췄습니다.'],['건강정보 숏폼 제작','바이럴 마케팅을 목적으로 건강정보 숏폼을 다수 기획·제작했습니다. 병원 시설 소개 외에도 정보형 콘텐츠로 전달 주제를 넓혔습니다.'],['유튜브·인스타그램 운영','카드뉴스, 숏폼, 롱폼의 기획부터 게시까지 직접 담당했습니다. 개별 영상 납품에 그치지 않고 두 채널의 콘텐츠 제작과 관리를 함께 수행했습니다.']]){const r=el('div');r.append(el('dt','',title),el('dd','',text));roles.append(r);}root.append(roles,el('p','embed-note','Instagram 내 재생이 제한되면 원본 링크에서 확인할 수 있습니다.'));return root;
}
