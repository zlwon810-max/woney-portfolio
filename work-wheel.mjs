// Wheel deltas are normalized to pixels by the caller.
export function createWorkWheel(){
 let sum=0,last=0,lockedUntil=0;
 return (delta,now,index,count)=>{
  if(!Number.isFinite(delta)||delta===0||count<1)return 0;
  if(now<lockedUntil){last=now;return 0;}
  if(now-last>220||Math.sign(sum)!==Math.sign(delta))sum=0;
  last=now;sum+=delta;if(Math.abs(sum)<60)return 0;
  const direction=Math.sign(sum);sum=0;lockedUntil=now+650;
  if(direction<0&&index===0)return 'previous';
  if(direction>0&&index===count-1)return 'next';
  return direction;
 };
}
