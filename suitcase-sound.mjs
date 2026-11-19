export function createSuitcaseSound(button){
 let ctx,enabled=false,last=0,played=false;
 const sync=()=>{button.textContent=enabled?'효과음 끄기':'효과음 켜기';button.setAttribute('aria-pressed',String(enabled));};
 function play(){
  if(!enabled||!ctx||ctx.state!=='running'||document.hidden)return;
  const t=ctx.currentTime;
  for(const delay of [0,.09]){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(340,t+delay);o.frequency.exponentialRampToValueAtTime(95,t+delay+.055);g.gain.setValueAtTime(.0001,t+delay);g.gain.linearRampToValueAtTime(.09,t+delay+.005);g.gain.exponentialRampToValueAtTime(.0001,t+delay+.07);o.connect(g).connect(ctx.destination);o.start(t+delay);o.stop(t+delay+.08);}
  const buffer=ctx.createBuffer(1,ctx.sampleRate*.6,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);
  const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();noise.buffer=buffer;filter.type='lowpass';filter.frequency.value=900;gain.gain.setValueAtTime(.0001,t+.12);gain.gain.linearRampToValueAtTime(.035,t+.25);gain.gain.exponentialRampToValueAtTime(.0001,t+.7);noise.connect(filter).connect(gain).connect(ctx.destination);noise.start(t+.12);noise.stop(t+.72);
 }
 button.addEventListener('click',async()=>{enabled=!enabled;if(enabled){try{ctx??=new (window.AudioContext||window.webkitAudioContext)();await ctx.resume();play();}catch{enabled=false;button.title='이 브라우저에서는 효과음을 재생할 수 없습니다.';}}else if(ctx)await ctx.suspend();sync();});
 sync();
 return {update(progress){if(progress<.15)played=false;if(progress>=.3&&progress<1.7&&last<.3&&!played){play();played=true;}last=progress;}};
}
