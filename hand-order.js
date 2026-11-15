/* Hand reordering: desktop drag, touch pointer drag, keyboard access.
   Touch dragging starts only after movement (not on ordinary tap). */
(function(global){
'use strict';
function move(cards,fromId,toId){
 const result=cards.slice(),from=result.findIndex(c=>c.id===fromId),to=result.findIndex(c=>c.id===toId);
 if(from<0||to<0||from===to)return result;
 const [card]=result.splice(from,1);result.splice(to,0,card);return result;
}
function ordered(cards,preferredIds){
 if(!preferredIds?.length)return cards.slice();
 const order=new Map(preferredIds.map((id,i)=>[id,i]));
 return cards.slice().sort((a,b)=>(order.has(a.id)?order.get(a.id):1e6)-(order.has(b.id)?order.get(b.id):1e6));
}
function drag(container,onMove,opts={}){
 if(!container)return ()=>{};
 let source=null,gesture=null,suppressClick=false;
 const cards=Array.from(container.querySelectorAll('[data-card]'));
 function clear(){
  cards.forEach(el=>el.classList.remove('dragging','drag-over'));
  gesture=null;source=null;
 }
 function targetAt(x,y){
  const el=container.ownerDocument?.elementFromPoint?.(x,y);
  const card=el?.closest?.('[data-card]');
  return card&&container.contains(card)?card:null;
 }
 cards.forEach(card=>{
  if(card.disabled)return;
  card.draggable=true;
  card.addEventListener('dragstart',ev=>{
   source=card.dataset.card;
   if(ev.dataTransfer){ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',source)}
   card.classList.add('dragging');
  });
  card.addEventListener('dragover',ev=>{
   ev.preventDefault();if(ev.dataTransfer)ev.dataTransfer.dropEffect='move';
   card.classList.add('drag-over');
  });
  card.addEventListener('dragleave',()=>card.classList.remove('drag-over'));
  card.addEventListener('drop',ev=>{
   ev.preventDefault();ev.stopPropagation();
   const from=source||ev.dataTransfer?.getData('text/plain');
   const to=card.dataset.card;clear();if(from&&from!==to)onMove(from,to);
  });
  card.addEventListener('dragend',clear);
  // Pointer Events handle touch screens, where native HTML drag does not fire.
  card.addEventListener('pointerdown',ev=>{
   if(ev.pointerType==='mouse'||ev.button!==0||opts.isReorderMode?.())return;
   gesture={id:card.dataset.card,x:ev.clientX,y:ev.clientY,moved:false,target:null,element:card,pointerId:ev.pointerId};
  });
  card.addEventListener('pointermove',ev=>{
   if(!gesture||gesture.pointerId!==ev.pointerId)return;
   const delta=Math.hypot(ev.clientX-gesture.x,ev.clientY-gesture.y);
   if(delta>12){
    gesture.moved=true;card.classList.add('dragging');
    if(ev.cancelable)ev.preventDefault();
    const target=targetAt(ev.clientX,ev.clientY);
    cards.forEach(el=>el.classList.toggle('drag-over',el===target&&el!==card));
    gesture.target=target;
   }
  });
  card.addEventListener('pointerup',ev=>{
   if(!gesture||gesture.pointerId!==ev.pointerId)return;
   const {id,moved,target}=gesture;
   if(moved){
    suppressClick=true;
    // Suppress the synthetic click sent after a completed pointer gesture.
    setTimeout(()=>{suppressClick=false},0);
   }
   clear();
   if(moved&&target&&id!==target.dataset.card)onMove(id,target.dataset.card);
  });
  card.addEventListener('pointercancel',clear);
 });
 return {
  consumeClick(){if(!suppressClick)return false;suppressClick=false;return true},
  destroy(){clear()}
 };
}
global.EcoHandOrder={move,ordered,drag};
})(typeof window==='undefined'?globalThis:window);
