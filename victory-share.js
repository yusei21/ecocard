/* EcoCard victory certificate; local, no external services. */
(() => {
'use strict';
const url='https://yusei21.github.io/ecocard/';
const campaigns=['FÁCIL','MÉDIO','DIFÍCIL','EXTREMO'];
const colors=[['#24452f','#cced92'],['#24475a','#9cdeec'],['#4b332b','#ffd1ad'],['#3f2a52','#dab4ff']];
const fmt=n=>Math.floor(n).toLocaleString('pt-BR');
function text(state){
 if(!isFinalVictory(state))return '';
 const name=campaigns[state.campaign||0]||campaigns[0];
 return 'SALVE O MUNDO — ECOCARD\nJOGO ZERADO NO EXTREMO!\n28 de 28 crises superadas nas quatro campanhas\n'+fmt(state.runScore)+' pontos em '+state.played+' jogadas.\nVocê consegue superar minha conquista?\n'+url;
}
function isFinalVictory(state){return !!state&&state.phase==='won'&&state.campaign===3&&state.wonStages===7}
function card(state){
 if(!isFinalVictory(state))return '';
 const tier=campaigns[state.campaign||0]||campaigns[0];
 return '<section class="victory-certificate victory-tier-'+(state.campaign||0)+'" aria-label="Certificado de vitória">'+
 '<span class="victory-brand">ECOCARD / SALVE O MUNDO</span>'+
 '<svg class="victory-globe" viewBox="0 0 120 120" fill="none" aria-hidden="true"><circle cx="60" cy="60" r="48" stroke="currentColor" stroke-width="3"/><ellipse cx="60" cy="60" rx="25" ry="46" stroke="currentColor" stroke-width="2"/><path d="M13 60h94M60 13v94M25 39h70M25 81h70" stroke="currentColor" stroke-width="2"/><path d="m40 60 14 14 29-29" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
 '<span class="victory-certificate-label">CONQUISTA DESBLOQUEADA</span>'+
 '<h3>JOGO ZERADO</h3><p>CAMPANHA '+tier+' CONCLUÍDA</p>'+
 '<div class="victory-certificate-stats"><div><strong>28 / 28</strong><small>CRISES DA JORNADA</small></div><div><strong>'+fmt(state.runScore)+'</strong><small>PONTOS NO EXTREMO</small></div></div>'+
 '<span class="victory-certificate-url">yusei21.github.io/ecocard</span></section>'+
 '<div class="victory-share-actions"><button type="button" class="btn arcade-play" id="shareVictory">COMPARTILHAR VITÓRIA</button><button type="button" class="btn secondary" id="saveVictory">SALVAR IMAGEM</button><button type="button" class="btn secondary" id="copyVictory">COPIAR RESULTADO</button></div>'+
 '<p id="victoryShareStatus" role="status" aria-live="polite" class="victory-share-status"></p>'+
 '<textarea id="victoryShareFallback" class="victory-share-fallback" readonly hidden></textarea>';
}
function canvas(state){
 if(!isFinalVictory(state))throw Error('Certificado liberado apenas ao zerar o Extremo');
 const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;
 const ctx=cv.getContext('2d');if(!ctx)throw Error('Canvas indisponível');
 const [base,accent]=colors[state.campaign||0]||colors[0];
 const gradient=ctx.createLinearGradient(0,0,1080,1350);gradient.addColorStop(0,base);gradient.addColorStop(1,'#0e1b20');
 ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,1350);
 ctx.strokeStyle=accent;ctx.lineWidth=8;ctx.strokeRect(42,42,996,1266);
 ctx.textAlign='center';ctx.fillStyle=accent;ctx.font='bold 36px Arial';ctx.fillText('ECOCARD / SALVE O MUNDO',540,158);
 ctx.lineWidth=8;ctx.beginPath();ctx.arc(540,420,148,0,Math.PI*2);ctx.stroke();
 ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(540,420,65,145,0,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.moveTo(394,420);ctx.lineTo(686,420);ctx.moveTo(540,274);ctx.lineTo(540,566);ctx.stroke();
 ctx.beginPath();ctx.moveTo(480,428);ctx.lineTo(524,472);ctx.lineTo(617,367);ctx.lineWidth=16;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
 ctx.font='bold 30px Arial';ctx.fillText('CONQUISTA DESBLOQUEADA',540,678);
 ctx.fillStyle='#ffffff';ctx.font='bold 84px Arial';ctx.fillText('JOGO ZERADO',540,790);
 ctx.font='bold 48px Arial';ctx.fillText('CAMPANHA '+campaigns[state.campaign||0],540,870);
 ctx.fillStyle=accent;ctx.font='bold 116px Arial';ctx.fillText('28 / 28',540,1020);
 ctx.fillStyle='#ffffff';ctx.font='bold 29px Arial';ctx.fillText('CRISES DA JORNADA',540,1068);
 ctx.font='bold 53px Arial';ctx.fillText(fmt(state.runScore)+' PONTOS NO EXTREMO',540,1160);
 ctx.fillStyle=accent;ctx.font='28px Arial';ctx.fillText('yusei21.github.io/ecocard',540,1240);
 return cv;
}
function status(message){const el=document.querySelector('#victoryShareStatus');if(el)el.textContent=message}
async function copy(state){
 try{
  if(!navigator.clipboard?.writeText)throw Error('Clipboard indisponível');
  await navigator.clipboard.writeText(text(state));
  status('Resultado copiado. Cole na sua rede social ou mensagem.');
 }catch{
  const fallback=document.querySelector('#victoryShareFallback');
  if(fallback){fallback.value=text(state);fallback.hidden=false;fallback.focus();fallback.select()}
  status('Selecione e copie o resultado no campo abaixo.');
 }
}
async function share(state){
 if(navigator.share){
  try{await navigator.share({title:'Salve o Mundo · EcoCard',text:text(state)});return}
  catch(error){if(error?.name==='AbortError')return}
 }
 await copy(state);
}
function save(state){
 try{
  const png=canvas(state).toDataURL('image/png');
  const link=document.createElement('a');link.href=png;link.download='ecocard-vitoria-'+(state.campaign||0)+'.png';
  document.body.appendChild(link);link.click();link.remove();
  status('Imagem de vitória preparada para salvar.');
 }catch{status('Não foi possível gerar a imagem neste navegador. Use Copiar Resultado.')}
}
function attach(root,state){
 if(!isFinalVictory(state))return;
 root.querySelector('#shareVictory')?.addEventListener('click',()=>share(state));
 root.querySelector('#saveVictory')?.addEventListener('click',()=>save(state));
 root.querySelector('#copyVictory')?.addEventListener('click',()=>copy(state));
}
window.EcoVictory={text,card,attach,isFinalVictory};
})();