/* Shared, dependency-free ordering controls for both EcoCard games. */
(function(global){
'use strict';
function move(cards,fromId,toId){
 const result=cards.slice(),from=result.findIndex(c=>c.id===fromId),to=result.findIndex(c=>c.id===toId);
 if(from<0||to<0||from===to)return result;
 const [card]=result.splice(from,1);
 result.splice(to,0,card);
 return result;
}
function ordered(cards,preferredIds){
 if(!preferredIds?.length)return cards.slice();
 const order=new Map(preferredIds.map((id,i)=>[id,i]));
 return cards.slice().sort((a,b)=>(order.has(a.id)?order.get(a.id):1e6)-(order.has(b.id)?order.get(b.id):1e6));
}
function drag(container,onMove){
 if(!container)return;
 let source=null;
 container.querySelectorAll('[data-card]').forEach(card=>{
   if(card.disabled)return;
   card.draggable=true;
   card.addEventListener('dragstart',ev=>{source=card.dataset.card;ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',source);card.classList.add('dragging')});
   card.addEventListener('dragover',ev=>{ev.preventDefault();ev.dataTransfer.dropEffect='move';card.classList.add('drag-over')});
   card.addEventListener('dragleave',()=>card.classList.remove('drag-over'));
   card.addEventListener('drop',ev=>{ev.preventDefault();ev.stopPropagation();card.classList.remove('drag-over');let from=source||ev.dataTransfer.getData('text/plain');if(from&&from!==card.dataset.card)onMove(from,card.dataset.card);source=null});
   card.addEventListener('dragend',()=>{source=null;container.querySelectorAll('.dragging,.drag-over').forEach(el=>el.classList.remove('dragging','drag-over'))});
 });
}
global.EcoHandOrder={move,ordered,drag};
})(typeof window==='undefined'?globalThis:window);
