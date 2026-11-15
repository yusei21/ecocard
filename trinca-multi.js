/* Trinca Circular multiplayer restored from EcoCard's original implementation.
 * 2–4 players, host-authoritative PeerJS room, 130 physical cards. */
// Multiplayer uses PeerJS data channels; the host is the authoritative state owner.
// PeerJS public signaling is for a stand demonstration, not guaranteed production uptime.
let peer=null,connections=new Map(),host=false,room=null,clientId=null,multiMessage='',myName='Visitante',joinedCode='';
let multiOrder=[],lastMeldCount=0,lastWinnerId=null;
const roomId=code=>'ecocard-trinca-'+code.toLowerCase();
function randomCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:6},()=>a[Math.floor(Math.random()*a.length)]).join('')}
// Trinca Circular: 9 cartas = 3 trincas independentes. Ás é baixo (A-2-3)
// ou alto (Q-K-A), nunca serve para cruzar K-A-2.
function validMeld(cards){
 if(cards.length!==3||new Set(cards.map(c=>c.id)).size!==3)return false;
 const sameRank=cards.every(c=>c.rank===cards[0].rank);
 const sameSuit=cards.every(c=>c.suit===cards[0].suit);
 const ranks=cards.map(c=>c.rank).sort((a,b)=>a-b);
 const adjacent=ranks[0]+1===ranks[1]&&ranks[1]+1===ranks[2];
 const royalAce=ranks[0]===1&&ranks[1]===12&&ranks[2]===13;
 return sameRank||(sameSuit&&(adjacent||royalAce));
}
function winningGroups(cards){
 if(cards.length!==9||new Set(cards.map(c=>c.id)).size!==9)return null;
 const indices=cards.map((_,i)=>i);
 // Partition exactly 9 physical cards into three non-overlapping melds.
 for(let a=1;a<9;a++)for(let b=a+1;b<9;b++){
  const first=[0,a,b];if(!validMeld(first.map(i=>cards[i])))continue;
  const rest=indices.filter(i=>!first.includes(i));
  for(let j=1;j<6;j++)for(let k=j+1;k<6;k++){
   const second=[rest[0],rest[j],rest[k]];
   if(!validMeld(second.map(i=>cards[i])))continue;
   const third=rest.filter(i=>!second.includes(i));
   if(validMeld(third.map(i=>cards[i])))return [first,second,third].map(g=>g.map(i=>cards[i]));
  }
 }
 return null;
}
function hasWin(cards){return winningGroups(cards)!==null}

function bestMeldGroups(cards){
 const groups=[];
 for(let a=0;a<cards.length;a++)for(let b=a+1;b<cards.length;b++)for(let c=b+1;c<cards.length;c++){
  const group=[cards[a],cards[b],cards[c]];
  if(validMeld(group))groups.push(group);
 }
 let best=[];
 function explore(start,taken,chosen){
  if(chosen.length>best.length)best=chosen.slice();
  if(best.length===3||chosen.length===3)return;
  for(let i=start;i<groups.length;i++){
   const group=groups[i];
   if(group.some(c=>taken.has(c.id)))continue;
   const next=new Set(taken);group.forEach(c=>next.add(c.id));
   explore(i+1,next,[...chosen,group]);
   if(best.length===3)return;
  }
 }
 explore(0,new Set(),[]);
 return best;
}
function meldName(group){
 return group.every(c=>c.rank===group[0].rank)?'TRINCA DE '+cardRank(group[0].rank):'SEQUÊNCIA '+group.map(c=>cardRank(c.rank)).join(' · ');
}
function trincaConfetti(){
 return '<div class="trinca-confetti" aria-hidden="true">'+Array.from({length:32},(_,i)=>'<i style="--n:'+i+';--angle:'+(i*137.5)+'deg"></i>').join('')+'</div>';
}
function trincaChime(win=false){
 try{
  if(!window.AudioContext&&!window.webkitAudioContext)return;
  const context=trincaChime.context ||= new (window.AudioContext||window.webkitAudioContext)();
  if(context.state==='suspended')context.resume();
  const notes=win?[523,659,784,1047]:[523,659,784];
  for(let i=0;i<notes.length;i++){
   const osc=context.createOscillator(),gain=context.createGain(),when=context.currentTime+i*(win?.13:.095);
   osc.type='sine';osc.frequency.value=notes[i];
   gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(.12,when+.015);gain.gain.exponentialRampToValueAtTime(.0001,when+.24);
   osc.connect(gain);gain.connect(context.destination);osc.start(when);osc.stop(when+.25);
  }
 }catch(e){}
}

function cleanMulti(){multiOrder=[];lastMeldCount=0;lastWinnerId=null;try{connections.forEach(c=>c.close());peer?.destroy()}catch(e){}connections.clear();peer=null;host=false;room=null;clientId=null;joinedCode='';multiMessage=''}
function showMulti(){renderMulti()}
function createRoom(){if(typeof Peer==='undefined'){multiMessage='Rede indisponível: não foi possível carregar o serviço de salas.';renderMulti();return}const name=$('#playerName')?.value.trim().slice(0,22)||'Visitante';myName=name;cleanMulti();host=true;const code=randomCode();joinedCode=code;peer=new Peer(roomId(code));peer.on('open',id=>{clientId=id;room={code,players:[{id,name,hand:[],selected:[]}],deck:[],discard:[],turn:0,drawn:false,started:false,winner:null};multiMessage='Sala criada. Compartilhe o código com até três pessoas.';renderMulti()});peer.on('connection',conn=>{connections.set(conn.peer,conn);conn.on('data',data=>handleHost(conn.peer,data));conn.on('close',()=>removePlayer(conn.peer));conn.on('error',()=>removePlayer(conn.peer));conn.on('open',()=>sendState())});peer.on('error',e=>{multiMessage=e.type==='unavailable-id'?'Código em uso. Tente criar outra sala.':'Erro de conexão: '+e.type;renderMulti()});renderMulti()}
function joinRoom(){if(typeof Peer==='undefined'){multiMessage='Rede indisponível: não foi possível carregar o serviço de salas.';renderMulti();return}const code=($('#roomInput')?.value||'').trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code)){multiMessage='Informe um código de seis caracteres.';renderMulti();return}myName=$('#playerName')?.value.trim().slice(0,22)||'Visitante';cleanMulti();joinedCode=code;peer=new Peer();peer.on('open',id=>{clientId=id;const conn=peer.connect(roomId(code),{reliable:true});connections.set('host',conn);conn.on('open',()=>conn.send({type:'join',name:myName}));conn.on('data',data=>{if(data.type==='state'){room=data.state;multiMessage=data.message||'';renderMulti()}else if(data.type==='error'){multiMessage=data.message;renderMulti()}});conn.on('close',()=>{multiMessage='A pessoa que hospedava a sala desconectou. A partida terminou.';room=null;renderMulti()})});peer.on('error',e=>{multiMessage='Não foi possível entrar. Confirme o código e a conexão ('+e.type+').';renderMulti()});multiMessage='Conectando à sala '+code+'…';renderMulti()}
function removePlayer(id){if(!host||!room)return;connections.delete(id);let i=room.players.findIndex(p=>p.id===id);if(i<0)return;room.players.splice(i,1);if(room.started){room.started=false;room.winner=null;room.players.forEach(p=>p.hand=[]);multiMessage='Um participante saiu. Inicie uma nova rodada.'}room.turn=0;sendState()}
function handleHost(id,data){if(!host||!room||!data||typeof data!=='object')return;if(data.type==='join'){if(room.started||room.players.length>=4){connections.get(id)?.send({type:'error',message:'Sala cheia ou partida em andamento.'});return}if(!room.players.some(p=>p.id===id))room.players.push({id,name:String(data.name||'Visitante').slice(0,22),hand:[],selected:[]});sendState();return}actionMulti(id,data)}
function startMatch(){if(!host||!room||room.players.length<2)return;lastMeldCount=0;lastWinnerId=null;room.deck=makeDeck(2);room.discard=[];room.players.forEach(p=>{p.hand=[];for(let i=0;i<9;i++)p.hand.push(room.deck.pop())});room.discard.push(room.deck.pop());room.turn=0;room.drawn=false;room.started=true;room.winner=null;multiMessage='Partida iniciada!';sendState()}
function sendState(){if(!room)return;for(const [id,conn] of connections){if(!conn.open)continue;const state=JSON.parse(JSON.stringify(room));state.players.forEach(p=>{if(p.id!==id)p.hand=[];delete p.selected});state.deck=[];conn.send({type:'state',state,message:multiMessage})}renderMulti()}
function actionMulti(id,data){let p=room?.players.find(p=>p.id===id);if(!p||!room.started||room.winner)return;const active=room.players[room.turn];if(active.id!==id)return;
if(data.type==='draw'){if(room.drawn)return;if(data.from==='discard'){if(!room.discard.length)return;p.hand.push(room.discard.pop())}else{if(!room.deck.length){if(room.discard.length<=1)return;const top=room.discard.pop();room.deck=shuffle(room.discard);room.discard=[top]}p.hand.push(room.deck.pop())}room.drawn=true;multiMessage=p.name+' comprou uma carta.'}
else if(data.type==='discard'){if(!room.drawn||p.hand.length!==10)return;let idx=p.hand.findIndex(c=>c.id===data.cardId);if(idx<0)return;room.discard.push(p.hand.splice(idx,1)[0]);room.drawn=false;if(hasWin(p.hand)){room.winner=p.id;multiMessage=p.name+' completou três trincas e venceu!'}else{room.turn=(room.turn+1)%room.players.length;multiMessage=p.name+' descartou uma carta.'}}
else if(data.type==='win'){if(room.drawn||!hasWin(p.hand))return;room.winner=p.id;multiMessage=p.name+' completou três trincas e venceu!'}
else return;sendState()}
function sendAction(data){if(host)actionMulti(clientId,data);else connections.get('host')?.send(data)}
function moveMulti(from,to){
 const my=room?.players.find(p=>p.id===clientId);if(!my)return;
 multiOrder=window.EcoHandOrder.move(window.EcoHandOrder.ordered(my.hand,multiOrder),from,to).map(c=>c.id);
 renderMulti();
}
function cardMultiClick(id){
 if(!room)return;
 const p=room.players.find(p=>p.id===clientId);if(!p)return;
 if(!room.drawn||room.players[room.turn].id!==clientId)return;
 sendAction({type:'discard',cardId:id});
}
function renderMulti(){const main=$('#multiMain'),side=$('#multiSide');if(!main)return;let local=room?.players.find(p=>p.id===clientId),isTurn=room?.started&&room.players[room.turn]?.id===clientId&&!room.winner;
const melds=bestMeldGroups(local?.hand||[]),meldCount=melds.length,ready=meldCount===3;
if(room?.started){
 if(meldCount>lastMeldCount&&lastMeldCount>=0&&local?.hand?.length)trincaChime(false);
 lastMeldCount=meldCount;
 if(room.winner&&lastWinnerId!==room.winner){lastWinnerId=room.winner;if(room.winner===clientId)trincaChime(true)}
}else{lastMeldCount=0;lastWinnerId=null}
const meldColors=['#cbe98a','#83c7e8','#f3c992'];const groupLookup=new Map();
melds.forEach((group,i)=>group.forEach(c=>groupLookup.set(c.id,i)));
const groupsMarkup='<div class="trinca-tracker" aria-live="polite"><div class="trinca-tracker-header"><strong>'+meldCount+' / 3 COMBINAÇÕES</strong><span>'+(ready?'TRÊS TRINCAS FORMADAS':meldCount===0?'FORME SUA PRIMEIRA TRINCA':'CONTINUE COMBINANDO')+'</span></div><div class="trinca-slots">'+Array.from({length:3},(_,i)=>'<div class="trinca-slot '+(melds[i]?'filled':'')+'" style="--slot-color:'+meldColors[i]+'"><span>0'+(i+1)+'</span><b>'+(melds[i]?esc(meldName(melds[i])):'AGUARDANDO TRINCA')+'</b>'+(melds[i]?'<span aria-hidden="true">✓</span>':'')+'</div>').join('')+'</div>'+(ready?'<div class="trinca-ready">'+(local.hand.length===10?'DESCARTE A CARTA EXTRA PARA VENCER':'MÃO COMPLETA — BATA PARA VENCER')+'</div>':'')+'</div>';
side.innerHTML='<h3>Como jogar</h3><div class="rulebox"><strong>Objetivo:</strong> forme 3 trincas de 3 cartas, usando exatamente 9 cartas. Ex.: 3–3–3, 2–2–2 e K–K–K. Também vale uma sequência da mesma cor (ex.: A–2–3). O Ás é baixo em A–2–3 ou alto em Q–K–A; K–A–2 não vale. Três cartas de mesmo valor podem ter qualquer cor.</div><div class="rulebox"><strong>Turno:</strong> compre uma carta do monte ou descarte e depois descarte uma carta da sua mão. Quando fechar 3 trincas, a vitória é automática após descartar a décima carta. Se já começar o turno com 3 trincas, clique em “Bater!”.</div><p class="hint">2 a 4 pessoas, cada uma em seu dispositivo. A pessoa que cria a sala deve permanecer conectada. A rede usa sinalização pública PeerJS e exige internet; não há persistência de partidas.</p><p class="hint">Padrão de cores: Resolução CONAMA 275/2001. Os valores A, 2–10, J, Q e K são recursos de jogo, não classificações reais de reciclabilidade.</p>';
if(!room){main.innerHTML='<div class="label">Lobby · 2 a 4 pessoas</div><h2>Juntos, a mudança ganha força.</h2><p>Crie uma sala (2 baralhos, 130 cartas) ou entre usando o código de quem está no estande.</p><div class="room-form"><label class="sr-only" for="playerName">Seu nome</label><input id="playerName" placeholder="Seu nome" maxlength="22" value="'+esc(myName==='Visitante'?'':myName)+'"></div><div class="actions"><button class="btn" id="createRoom">Criar sala</button></div><div class="room-form"><label class="sr-only" for="roomInput">Código da sala</label><input id="roomInput" placeholder="CÓDIGO" maxlength="6" value="'+esc(joinedCode)+'"><button class="btn secondary" id="joinRoom">Entrar na sala ↗</button></div><div class="notice roomstatus" role="status">'+esc(multiMessage||'O código da sala será gerado automaticamente.')+'</div>';main.querySelector('#createRoom').onclick=createRoom;main.querySelector('#joinRoom').onclick=joinRoom;return}
main.innerHTML='<div class="label">Sala compartilhada</div><div class="room-code">'+esc(room.code)+'</div><div class="actions"><button class="btn secondary" id="copyRoom">Copiar código</button><button class="btn secondary" id="leaveRoom">Sair da sala</button></div><div class="players">'+room.players.map((p,i)=>'<span class="player-chip '+(room.started&&room.turn===i?'active':'')+'">'+esc(p.name)+(p.id===clientId?' · você':'')+(room.started&&room.turn===i?' · vez':'')+'</span>').join('')+'</div><div class="notice" role="status">'+esc(multiMessage||'Esperando jogadores…')+'</div>'+
(!room.started?'<p class="hint">Jogadores: '+room.players.length+'/4. Compartilhe o código e inicie quando houver ao menos duas pessoas.</p>'+(host?'<button class="btn" id="startMatch" '+(room.players.length<2?'disabled':'')+'>Iniciar partida ↗</button>':'<p>Aguardando quem criou a sala iniciar…</p>'):
'<h3 class="field-title">'+(room.winner?'Partida encerrada':isTurn?'Sua vez de jogar':'Aguardando '+esc(room.players[room.turn].name))+'</h3>'+
'<div class="label">Descarte visível</div><div class="cards">'+(room.discard.length?cardHTML(room.discard.at(-1),false,true):'Nenhuma carta')+'</div>'+
(isTurn&&!room.drawn?'<div class="actions"><button class="btn" id="drawDeck">Comprar do monte</button><button class="btn secondary" id="drawDiscard" '+(!room.discard.length?'disabled':'')+'>Comprar descarte</button></div>':'')+
groupsMarkup+'<div class="field-title">Sua mão <span class="hint">· '+(local?.hand.length||0)+' / 9 cartas</span></div><div class="cards multi-hand">'+window.EcoHandOrder.ordered(local?.hand||[],multiOrder).map(c=>{let raw=cardHTML(c,false,false);const group=groupLookup.get(c.id);return group===undefined?raw:raw.replace('class="playing-card','class="playing-card trinca-group-'+group)}).join('')+'</div>'+
(isTurn&&room.drawn?'<p class="hint">Clique em uma carta da mão para descartá-la e encerrar o turno.</p>':'')+
(isTurn&&!room.drawn&&local?.hand.length===9?'<button class="btn" id="declareWin" '+(!hasWin(local.hand)?'disabled':'')+'>Bater! · Três trincas prontas</button>':'')+
(room.winner?'<div class="trinca-victory '+(room.winner===clientId?'my-victory':'other-victory')+'" role="status">'+trincaConfetti()+'<span class="trinca-kicker">PARTIDA ENCERRADA</span><div class="trinca-trophy" aria-hidden="true">★</div><h2>'+(room.winner===clientId?'VOCÊ VENCEU!':'TRINCA FECHADA!')+'</h2><p>'+esc(room.players.find(p=>p.id===room.winner)?.name||'Jogador')+' completou 3 combinações de 3 cartas.</p><strong>9 CARTAS · 3 TRINCAS · 1 VENCEDOR</strong>'+(host?'<button class="btn trinca-replay" id="restartMatch">JOGAR NOVAMENTE ↻</button>':'<p>Aguarde o anfitrião iniciar outra rodada.</p>')+'</div>':''));
const victoryPanel=main.querySelector('.trinca-victory');if(victoryPanel)main.prepend(victoryPanel);
main.querySelector('#copyRoom').onclick=()=>{if(!navigator.clipboard?.writeText){multiMessage='Copie o código exibido acima.';renderMulti();return}navigator.clipboard.writeText(room.code).then(()=>{multiMessage='Código copiado.';renderMulti()}).catch(()=>{multiMessage='Copie o código exibido acima.';renderMulti()})};main.querySelector('#leaveRoom').onclick=()=>{cleanMulti();renderMulti()};main.querySelector('#startMatch')?.addEventListener('click',startMatch);main.querySelector('#restartMatch')?.addEventListener('click',startMatch);main.querySelector('#drawDeck')?.addEventListener('click',()=>sendAction({type:'draw',from:'deck'}));main.querySelector('#drawDiscard')?.addEventListener('click',()=>sendAction({type:'draw',from:'discard'}));main.querySelector('#declareWin')?.addEventListener('click',()=>sendAction({type:'win'}));main.querySelectorAll('.multi-hand [data-card]:not([disabled])').forEach(el=>el.addEventListener('click',()=>cardMultiClick(el.dataset.card)));
 window.EcoHandOrder.drag(main.querySelector('.multi-hand'),moveMulti)}

// Public API for automated validation of meld rules and manual order.
window.EcoTrinca={validMeld,winningGroups,hasWin,bestMeldGroups,randomCode,showMulti,cleanMulti};
