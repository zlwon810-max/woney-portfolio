const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function sceneState(offset,travel,count){
 const progress=travel>0?clamp(offset/travel,0,1):0;
 const scaled=progress*Math.max(1,count);
 const index=clamp(Math.floor(scaled),0,Math.max(0,count-1));
 return {progress,index,local:clamp(scaled-index,0,1)};
}
export function scenePosition(index,travel,count){
 if(count<=1||travel<=0)return 0;
 if(index<=0)return 0;
 if(index>=count-1)return travel;
 return (index+.12)/count*travel;
}
