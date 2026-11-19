import {caseStudies} from './case-studies.mjs?v=sns2026';
import {createMedia} from './media.mjs';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
export function caseSummary(id){
 const c=caseStudies[id];if(!c)return null;
 const n=el('section','case-summary');n.append(el('h3','','담당 작업'),el('p','',c.role));
 const list=el('ul','case-skills');for(const s of c.skills)list.append(el('li','',s));n.append(list);return n;
}
export function caseView(id){
 const c=caseStudies[id];if(!c)return null;
 const root=el('section','case-study');root.append(el('h3','case-heading','기획과 제작 과정'));
 for(const [title,text] of c.sections){const s=el('section','case-section');s.append(el('h4','',title),el('p','',text));root.append(s);}
 if(c.timeline){const list=el('ol','case-timeline');for(const [title,time,text] of c.timeline){const li=el('li');li.append(el('span','case-time',time),el('h4','',title),el('p','',text));list.append(li);}root.append(list);}
 for(const item of c.evidence||[]){const fig=el('figure','case-evidence');fig.append(el('h4','',item.title),el('p','',item.text));
  if(item.video)fig.append(createMedia(item.video,{alt:item.title,poster:item.poster||''}));
  if(item.image){const a=el('a','case-image-link');a.href=item.image;a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',item.title+' 크게 보기');a.append(createMedia(item.image,{alt:item.title}));fig.append(a);fig.append(el('figcaption','','이미지를 누르면 크게 볼 수 있습니다.'));}
  if(item.download){const a=el('a','detail-link',item.downloadLabel);a.href=item.download;a.download='';fig.append(a);}root.append(fig);
 }
 if(c.videos){root.append(el('h3','case-heading','직접 제작한 영상 3편'));const videos=el('div','case-videos');
  for(const v of c.videos){const article=el('article','case-film');article.append(el('p','case-film-type',v.type),el('h4','',v.title),el('p','',v.text));
   const frame=el('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+v.id;frame.title=v.title;frame.loading='lazy';frame.allowFullscreen=true;frame.allow='fullscreen; picture-in-picture; encrypted-media';frame.referrerPolicy='strict-origin-when-cross-origin';const play=el('button','film-preview');play.type='button';play.setAttribute('aria-label',v.title+' 재생');const thumbnail=el('img');thumbnail.src='assets/work/reels/'+v.id+'.jpg';thumbnail.alt=v.title+' 영상 미리보기';thumbnail.loading='lazy';play.append(thumbnail,el('span','','▶ 영상 재생'));play.addEventListener('click',()=>{frame.src+='?autoplay=1';frame.allow+='; autoplay';play.replaceWith(frame);});article.append(play);
   const a=el('a','detail-link','YouTube에서 보기');a.href='https://www.youtube.com/watch?v='+v.id;a.target='_blank';a.rel='noopener noreferrer';article.append(a);videos.append(article);
  }if(id==='hospital'){const h=el('h3','case-heading','직접 기획·촬영·편집한 유튜브 영상');root.prepend(h,videos);const hs=[...root.querySelectorAll('h3')];for(const h of hs)if(h.textContent==='직접 제작한 영상 3편')h.remove();}else root.append(videos);
 }
 return root;
}
