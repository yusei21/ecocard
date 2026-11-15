/* One-time portrait orientation guidance for the solo playing table.
 * Does not force screen rotation or prevent users continuing in portrait. */
(function(root){
 'use strict';
 const KEY='ecocard-landscape-hint-dismissed-v1';
 let dismissed=false;
 try{dismissed=root.sessionStorage?.getItem(KEY)==='1'}catch{}
 function panel(){return document.querySelector('#soloRotateHint')}
 function sync(isPlaying){
  const node=panel();
  if(!node)return;
  const shouldShow=!!isPlaying&&!dismissed;
  node.classList.toggle('is-active',shouldShow);
  node.setAttribute('aria-hidden',shouldShow?'false':'true');
  const btn=node.querySelector('#soloRotateContinue');
  if(btn)btn.tabIndex=shouldShow?0:-1;
 }
 function dismiss(){
  dismissed=true;
  try{root.sessionStorage?.setItem(KEY,'1')}catch{}
  sync(false);
 }
 function init(){
  panel()?.querySelector('#soloRotateContinue')?.addEventListener('click',dismiss);
  root.addEventListener('orientationchange',()=>sync(!!document.querySelector('#solo .arcade-tabletop')));
 }
 root.EcoOrientation={sync,dismiss,init};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})(window);
