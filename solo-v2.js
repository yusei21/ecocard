/* EcoCard — Salve o Mundo 2.0. Overrides the prototype solo mode only. */
(() => {
'use strict';
const stages=[
 {title:'Contaminação Cruzada',desc:'A separação incorreta dificulta a reciclagem. Misturar categorias perde eficiência nesta etapa.',goal:1100,limit:4,rule:'mixed',hint:'Mãos de uma cor ganham ×1,35. Misturar quatro ou mais cores reduz ×0,75.'},
 {title:'Descarte Irregular',desc:'Descartes fora de lugar podem atingir solo e água. A atenção ao plástico será decisiva.',goal:2300,limit:4,rule:'plastic',hint:'Cartas de plástico sofrem penalidade de 10 pontos base cada. Coleta limpa recebe +40.'},
 {title:'Desperdício de Recursos',desc:'Antes de reciclar, é preciso reduzir o consumo. Aproveite materiais equivalentes.',goal:3600,limit:4,rule:'resource',hint:'Trinca ou par de valores iguais recebe ×1,5.'},
 {title:'Crise dos Aterros',desc:'A produção crescente de rejeitos pressiona a destinação final.',goal:6700,limit:3,rule:'hands',hint:'Apenas 3 jogadas. Sequências recebem +45 pontos base.'},
 {title:'Mudanças Climáticas',desc:'Produção e descarte têm impactos no clima. Escolha cuidadosamente seus recursos.',goal:11000,limit:4,rule:'climate',hint:'Mãos com 3 ou mais orgânicos ganham +60 pontos base.'}
];
const upgradedJokers=[
 {id:'reduzir',name:'Reduzir',desc:'+3 de multiplicador por carta selecionada.',rarity:'common',price:4},
 {id:'reutilizar',name:'Reutilizar',desc:'+40 pontos base quando houver ao menos 2 cores.',rarity:'common',price:4},
 {id:'reciclar',name:'Reciclar',desc:'×1,5 multiplicador se houver 3 ou mais cartas de uma cor.',rarity:'common',price:6},
 {id:'compostagem',name:'Compostagem Viva',desc:'+22 pontos base por carta orgânica.',rarity:'common',price:5},
 {id:'cooperativa',name:'Força Coletiva',desc:'+3 de multiplicador por cor diferente.',rarity:'common',price:5},
 {id:'educacao',name:'Educação Ambiental',desc:'+60 pontos base em uma sequência.',rarity:'uncommon',price:7},
 {id:'catadores',name:'Rede de Catadores',desc:'+70 pontos base em Coleta Seletiva ou Triagem Perfeita.',rarity:'uncommon',price:7},
 {id:'logistica',name:'Logística Reversa',desc:'×1,35 se houver pelo menos 2 cartas de metal ou vidro.',rarity:'uncommon',price:8},
 {id:'circular',name:'Aventura Circular',desc:'Ativa cada outro coringa equipado 2 vezes, na ordem. Nunca ativa a si própria.',rarity:'legend',price:15}
];
const ranks={common:1,uncommon:.25,legend:.002};
const MODIFIERS=[{id:'normal',name:'Padrão',desc:'Sem efeito extra.',weight:3},{id:'fog',name:'Triagem Nebulosa',desc:'Valores 1 e 2 pontuam pela metade.',weight:2},{id:'short',name:'Escassez',desc:'Uma jogada a menos.',weight:2},{id:'audit',name:'Auditoria',desc:'Jogadas de 4 ou 5 cartas valem ×0,8.',weight:2},{id:'good',name:'Mutirão',desc:'3 cores diferentes concedem +35 pontos base.',weight:1}];
function rollModifier(){let r=Math.random()*MODIFIERS.reduce((a,m)=>a+m.weight,0);return MODIFIERS.find(m=>(r-=m.weight)<0)||MODIFIERS[0]}
let busy=false,queue=[];function clearQueue(){queue.forEach(clearTimeout);queue=[];busy=false}
let lastBurst=null, audioCtx=null, muted=localStorage.getItem('ecocard-muted')==='1';
function beep(freq=480,duration=.07,shape='sine',gain=.025){if(muted)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();let osc=audioCtx.createOscillator(),vol=audioCtx.createGain();osc.type=shape;osc.frequency.setValueAtTime(freq,audioCtx.currentTime);vol.gain.setValueAtTime(gain,audioCtx.currentTime);vol.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);osc.connect(vol);vol.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration)}catch{}}
function combination(cards){
 const counts=new Map(),values=new Map();
 cards.forEach(c=>{counts.set(c.suit,(counts.get(c.suit)||0)+1);values.set(c.rank,(values.get(c.rank)||0)+1)});
 const maxColor=Math.max(...counts.values()),maxRank=Math.max(...values.values()),distinct=counts.size;
 const sorted=cards.map(c=>c.rank).sort((a,b)=>a-b);
 const straight=cards.length>=3&&new Set(sorted).size===sorted.length&&sorted.every((n,i)=>i===0||n===sorted[i-1]+1);
 // The highest-ranked applicable formation takes precedence.
 let name='Separação Inicial',factor=1,kind='basic';
 if(cards.length===5&&straight&&maxColor===5){name='Ciclo Completo';factor=6;kind='straightflush'}
 else if(cards.length===5&&maxColor===5){name='Triagem Perfeita';factor=5;kind='flush'}
 else if(cards.length>=4&&maxRank>=4){name='Mutirão Quádruplo';factor=4.5;kind='rank'}
 else if(cards.length>=3&&maxRank>=3){name='Reaproveitamento';factor=3.5;kind='rank'}
 else if(cards.length>=3&&maxColor>=3){name='Coleta Seletiva';factor=3;kind='flush'}
 else if(straight){name='Fluxo Circular';factor=2.75;kind='straight'}
 else if(maxRank>=2){name='Materiais Equivalentes';factor=2;kind='pair'}
 else if(distinct>=3){name='Diversidade Ambiental';factor=1.5;kind='mixed'}
 return {name,factor,kind,counts,maxColor,maxRank,distinct,straight};
}
function evaluate(cards,stage,jokers,modifier=null){
 if(!cards.length||cards.length>5)throw Error('Selecione entre uma e cinco cartas');
 const c=combination(cards),phase=stages[stage]||stages.at(-1),events=[];
 let chips=20+cards.reduce((n,k)=>n+k.rank*12*(modifier?.id==='fog'&&k.rank<=2?.5:1),0),mult=c.factor;
 const add=(label,fn)=>{let before=[chips,mult];fn();events.push({label,chips:Math.round(chips-before[0]),factor:before[1]===0?1:mult/before[1],mult:mult-before[1]})};
 if(phase.rule==='mixed'){if(c.distinct===1)add('Triagem correta',()=>mult*=1.35);else if(c.distinct>=4)add('Mistura inadequada',()=>mult*=.75)}
 if(phase.rule==='plastic'){let n=cards.filter(x=>x.suit==='vermelho').length;if(n)add('Contaminação de embalagens',()=>chips=Math.max(1,chips-n*10));if(['flush','straightflush'].includes(c.kind))add('Separação cuidadosa',()=>chips+=40)}
 if(phase.rule==='resource'&&c.maxRank>=2)add('Reaproveitamento de valor',()=>mult*=1.5);
 if(phase.rule==='hands'&&c.straight)add('Eficiência na triagem',()=>chips+=45);
 if(phase.rule==='climate'&&cards.filter(x=>x.suit==='marrom').length>=3)add('Compostagem',()=>chips+=60);if(modifier?.id==='audit'&&cards.length>=4)add('Auditoria',()=>mult*=.8);if(modifier?.id==='good'&&c.distinct>=3)add('Mutirão',()=>chips+=35);
 // Full deterministic order; Circular repeats each other joker's effect twice, not the entire combined result.
 const repeat=jokers.some(j=>j.id==='circular')?2:1;
 for(const joker of jokers){
 if(joker.id==='circular')continue;
 for(let r=0;r<repeat;r++){
 const n=cards.filter(x=>x.suit==='marrom').length;
 if(joker.id==='reduzir')add('Reduzir',()=>mult+=cards.length*3);
 if(joker.id==='reutilizar'&&c.distinct>=2)add('Reutilizar',()=>chips+=40);
 if(joker.id==='reciclar'&&c.maxColor>=3)add('Reciclar',()=>mult*=1.5);
 if(joker.id==='compostagem'&&n)add('Compostagem Viva',()=>chips+=n*22);
 if(joker.id==='cooperativa')add('Força Coletiva',()=>mult+=c.distinct*3);
 if(joker.id==='educacao'&&c.straight)add('Educação Ambiental',()=>chips+=60);
 if(joker.id==='catadores'&&(['flush','straightflush'].includes(c.kind)))add('Rede de Catadores',()=>chips+=70);
 if(joker.id==='logistica'&&cards.filter(x=>['verde','amarelo'].includes(x.suit)).length>=2)add('Logística Reversa',()=>mult*=1.35);
 }
 }
 const score=Math.max(0,Math.floor(chips*mult));
 return {score,type:c.name,base:chips,mult,events,combination:c};
}
function offers(exclude){
 const pool=upgradedJokers.filter(j=>!exclude.some(x=>x.id===j.id)),chosen=[];
 while(chosen.length<3&&pool.length){
 let total=pool.reduce((a,j)=>a+ranks[j.rarity],0),roll=Math.random()*total,ix=0;
 for(;ix<pool.length-1;ix++){roll-=ranks[pool[ix].rarity];if(roll<0)break}
 chosen.push(pool.splice(ix,1)[0]);
 }
 return chosen;
}
function fill(n){if(!solo)return;for(let k=0;k<n;k++){if(!solo.deck.length)break;solo.hand.push(solo.deck.pop())}solo.hand.sort((a,b)=>a.rank-b.rank||a.suit.localeCompare(b.suit))}
function start(){clearQueue();const modifier=rollModifier();solo={stage:0,score:0,coins:5,hand:[],deck:makeDeck(),selected:[],jokers:[],hands:stages[0].limit-(modifier.id==='short'?1:0),discards:2,phase:'play',message:'Escolha de 1 a 5 cartas. Descubra combinações, supere crises e evolua sua estratégia.',runScore:0,comboChain:0,played:0,modifier};lastBurst=null;fill(8);render();beep(420,.09)}
function target(){return stages[solo.stage].goal}
function choose(id){if(!solo||solo.phase!=='play'||busy)return;let i=solo.selected.indexOf(id);if(i>=0)solo.selected.splice(i,1);else if(solo.selected.length<5)solo.selected.push(id);beep(i>=0?310:540,.045,'triangle');render()}
function play(discard=false){
 if(solo.phase!=='play'||!solo.selected.length||busy)return;
 const cards=solo.hand.filter(c=>solo.selected.includes(c.id));
 if(discard){if(solo.discards<=0)return;solo.discards--;solo.comboChain=0;solo.message='Cartas substituídas. Monte uma nova combinação.';lastBurst=null;beep(220,.12,'triangle')}
 else{const result=evaluate(cards,solo.stage,solo.jokers,solo.modifier);solo.score+=result.score;solo.runScore+=result.score;solo.hands--;solo.played++;solo.comboChain++;lastBurst=result;solo.message=result.type+' · +'+result.score.toLocaleString('pt-BR')+' pontos!';beep(660,.15,'triangle');}
 const n=cards.length;solo.hand=solo.hand.filter(c=>!solo.selected.includes(c.id));solo.selected=[];fill(n);
 if(!discard){
 if(solo.score>=target()){solo.phase='shop';solo.coins+=4+solo.hands;solo.offer=offers(solo.jokers);solo.message='CRISE SUPERADA! +'+(4+solo.hands)+' ecofichas · Escolha sua evolução.';beep(880,.25,'sine')}
 else if(solo.hands===0||!solo.hand.length){solo.phase='lost';solo.message='A meta não foi atingida. Uma boa estratégia merece outra tentativa.';beep(190,.3)}
 }
 render();
 if(lastBurst&&!discard)animateScore(lastBurst)
}
function animateScore(result){
 const zone=document.querySelector('#scorePerformance'),board=document.querySelector('.arcade-tabletop');if(!zone||!board)return;
 clearQueue();busy=true;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const steps=[{name:result.type,detail:'COMBINAÇÃO'},...result.events.map(e=>({name:e.label,detail:e.chips>0?'+'+e.chips+' BASE':e.chips<0?e.chips+' BASE':e.factor!==1?'×'+e.factor.toFixed(2):e.mult>0?'+'+e.mult.toFixed(2)+' MULT':'EFEITO'})),{name:'+'+Math.floor(result.score).toLocaleString('pt-BR')+' PONTOS!',detail:'TOTAL DA JOGADA'}];
 board.classList.add('scoring');
 steps.forEach((t,i)=>queue.push(setTimeout(()=>{zone.textContent=t.name+' · '+t.detail;zone.classList.remove('score-step');void zone.offsetWidth;zone.classList.add('score-step');if(!reduced)beep(430+i*45,.07,'triangle',.012);if(i===steps.length-1){zone.classList.add('score-finish');if(!reduced){const fx=document.createElement('div');fx.className='score-particles';for(let k=0;k<22;k++){const particle=document.createElement('i');particle.style.setProperty('--angle',(k*360/22)+'deg');particle.style.setProperty('--distance',(40+Math.random()*85)+'px');fx.append(particle)}zone.append(fx);queue.push(setTimeout(()=>fx.remove(),900))}}},i*(reduced?0:240))));
 queue.push(setTimeout(()=>{busy=false;board.classList.remove('scoring');zone.classList.remove('score-finish')},steps.length*(reduced?0:240)+150));
}
function buy(id){if(solo.phase!=='shop')return;const j=solo.offer.find(x=>x.id===id);if(!j||solo.jokers.length>=5||solo.coins<j.price)return;solo.coins-=j.price;solo.jokers.push(j);solo.offer=solo.offer.filter(x=>x.id!==id);solo.message=j.rarity==='legend'?'✦ LENDÁRIO DESBLOQUEADO: AVENTURA CIRCULAR!':j.name+' adicionado à sua estratégia.';beep(j.rarity==='legend'?1047:730,.27,'triangle');render()}
function reroll(){if(!solo||solo.phase!=='shop'||solo.coins<3)return;solo.coins-=3;solo.offer=offers(solo.jokers);solo.message='Ofertas renovadas por 3 ecofichas!';render()}
function next(){if(solo.phase!=='shop')return;if(solo.stage===stages.length-1){solo.phase='won';solo.message='VOCÊ SALVOU O MUNDO! Agora leve esses conhecimentos para fora do jogo.'}else{solo.stage++;solo.score=0;solo.modifier=rollModifier();solo.hands=stages[solo.stage].limit-(solo.modifier.id==='short'?1:0);solo.discards=2;solo.hand=[];solo.deck=makeDeck();solo.selected=[];solo.phase='play';solo.comboChain=0;lastBurst=null;fill(8);solo.message='NOVO DESAFIO: '+stages[solo.stage].title+'!'}beep(570,.18);render()}
function fmt(v){return Math.floor(v).toLocaleString('pt-BR')}
function render(){
 if(!solo)return;
 const main=document.querySelector('#soloMain'),side=document.querySelector('#soloSide');if(!main||!side)return;
 const stage=stages[solo.stage],goal=stage.goal,selected=solo.hand.filter(c=>solo.selected.includes(c.id));
 const preview=selected.length?evaluate(selected,solo.stage,solo.jokers,solo.modifier):null;
 side.classList.add('arcade-side');
 side.innerHTML='<div class="arcade-sticky-score"><small>PONTOS / META</small><strong>'+fmt(solo.score)+' <span>/ '+fmt(goal)+'</span></strong><p>FALTAM <b>'+fmt(Math.max(0,goal-solo.score))+'</b> PONTOS</p><div class="progress"><div style="width:'+Math.min(100,solo.score/goal*100)+'%"></div></div></div><div class="arcade-level"><span class="label">MISSÃO '+(solo.stage+1)+' / '+stages.length+'</span><b>'+stage.title+'</b><p>'+stage.desc+'</p><small>'+stage.hint+'</small></div>'+
 '<div class="arcade-numbers"><div><small>PONTUAÇÃO</small><strong>'+fmt(solo.score)+'</strong></div><div><small>META</small><strong>'+fmt(goal)+'</strong></div></div><div class="progress"><div style="width:'+Math.min(100,solo.score/goal*100)+'%"></div></div>'+
 '<div class="arcade-modifier"><span class="label">EVENTO DA RODADA</span><b>'+esc(solo.modifier.name)+'</b><small>'+esc(solo.modifier.desc)+'</small></div><div class="arcade-counters"><span>▤ <b>'+solo.deck.length+'</b> cartas no monte</span><span>✋ <b>'+solo.hands+'</b> jogadas</span><span>↶ <b>'+solo.discards+'</b> descartes</span><span>✦ <b>'+solo.coins+'</b> ecofichas</span></div>'+
 '<h3>Seu motor de combos <span style="color:var(--lime)">'+solo.jokers.length+'/5</span></h3><div class="jokers">'+(solo.jokers.length?solo.jokers.map(j=>'<div class="joker '+(j.rarity==='legend'?'legend':'')+'" title="'+esc(j.desc)+'"><span class="label">'+(j.rarity==='legend'?'LENDÁRIO':j.rarity==='uncommon'?'INCOMUM':'COMUM')+'</span><b>'+esc(j.name)+'</b><small>'+esc(j.desc)+'</small></div>').join(''):'<p class="hint">Vença uma crise para desbloquear coringas e construir combos.</p>')+'</div>'+
 '<label class="sound-control"><input type="checkbox" id="muteAudio" '+(muted?'checked':'')+'> Silenciar efeitos sonoros</label>'+
 '<p class="hint">Coringa lendário: peso relativo de 0,002 contra 1 dos comuns. Aventura Circular reativa cada outro coringa duas vezes.</p>';
 const notice='<div class="arcade-banner" role="status">'+esc(solo.message)+'</div>';
 let area='';
 if(solo.phase==='play'){
 area='<div class="arcade-tabletop"><div class="arena-header"><span class="eyebrow">S A L V E &nbsp; O &nbsp; M U N D O</span><span class="arena-round">RODADA '+(solo.stage+1)+' · '+solo.played+' JOGADAS</span></div>'+
 '<div class="arena-orbit">♻ <span>TRANSFORME RESÍDUOS EM IMPACTO</span></div>'+
 '<div class="arena-goal-line">PONTUAÇÃO <b>'+fmt(solo.score)+'</b> / '+fmt(goal)+' · FALTAM '+fmt(Math.max(0,goal-solo.score))+'</div><div class="arena-scores"><div class="score-chip"><small>PONTOS BASE</small><b>'+fmt(preview?.base||0)+'</b></div><div class="score-times">×</div><div class="score-chip magenta"><small>MULTIPLICADOR</small><b>'+((preview?.mult||1).toFixed(2))+'×</b></div><div class="score-equals">=</div><div class="score-chip total"><small>PRÉVIA</small><b>'+fmt(preview?.score||0)+'</b></div></div>'+
 '<div class="combo-readout">'+(preview?esc(preview.type.toUpperCase()):'MONTE SEU COMBO')+'</div>'+
 (lastBurst?'<div class="burst"><strong>+'+fmt(lastBurst.score)+'</strong><span>'+esc(lastBurst.type)+' · '+lastBurst.events.length+' efeitos ativados</span></div>':'')+
 '<div class="score-performance" id="scorePerformance" aria-live="polite"></div><div class="arena-hand-title"><strong>SUA MÃO</strong><span>SELECIONE ATÉ 5 CARTAS · '+solo.selected.length+'/5</span></div><div class="cards arcade-hand">'+solo.hand.map(c=>cardHTML(c,solo.selected.includes(c.id))).join('')+'</div>'+
 '<div class="actions arena-actions"><button class="btn arcade-play" id="playCards" '+(!solo.selected.length?'disabled':'')+'>✦ JOGAR COMBINAÇÃO</button><button class="btn secondary" id="discardCards" '+(!solo.selected.length||!solo.discards?'disabled':'')+'>↶ DESCARTAR</button></div></div>';
 }else if(solo.phase==='shop'){
 area='<div class="arcade-shop"><span class="eyebrow">✦ RECOMPENSA DESBLOQUEADA</span><h2>EVOLUA SEU DECK.</h2><p>Você tem <b>'+solo.coins+' ecofichas</b> e '+(5-solo.jokers.length)+' espaços de coringa.</p><div class="market">'+solo.offer.map(j=>'<div class="market-item '+(j.rarity==='legend'?'shop-legend':'')+'"><span class="label">'+(j.rarity==='legend'?'✦ LENDÁRIO':j.rarity==='uncommon'?'INCOMUM':'COMUM')+'</span><b>'+esc(j.name)+'</b><p>'+esc(j.desc)+'</p><button class="btn" data-buy="'+j.id+'" '+(solo.coins<j.price||solo.jokers.length>=5?'disabled':'')+'>COMPRAR · '+j.price+' ✦</button></div>').join('')+'</div><div class="actions"><button class="btn secondary" id="rerollShop" '+(solo.coins<3?'disabled':'')+'>↻ NOVAS OFERTAS · 3 ✦</button><button class="btn arcade-play" id="nextStage">'+(solo.stage===stages.length-1?'FINALIZAR JORNADA':'PRÓXIMA CRISE →')+'</button></div></div>';
 }else{
 area='<div class="arcade-ending"><div class="ending-glyph">'+(solo.phase==='won'?'✺':'↻')+'</div><span class="eyebrow">'+(solo.phase==='won'?'MISSÃO CONCLUÍDA':'FIM DE RUN')+'</span><h2>'+(solo.phase==='won'?'VOCÊ FEZ A DIFERENÇA.':'TENTE OUTRA ESTRATÉGIA.')+'</h2><p>Impacto acumulado: <strong>'+fmt(solo.runScore)+'</strong> pontos · '+solo.played+' jogadas realizadas.</p><button class="btn arcade-play" id="restartSolo">↻ NOVA JORNADA</button></div>';
 }
 main.classList.add('arcade-solo');
 main.innerHTML=notice+area;
 main.querySelectorAll('[data-card]').forEach(el=>el.addEventListener('click',()=>choose(el.dataset.card)));
 main.querySelector('#playCards')?.addEventListener('click',()=>play(false));
 main.querySelector('#discardCards')?.addEventListener('click',()=>play(true));
 main.querySelector('#nextStage')?.addEventListener('click',next);main.querySelector('#rerollShop')?.addEventListener('click',reroll);
 main.querySelector('#restartSolo')?.addEventListener('click',start);
 main.querySelectorAll('[data-buy]').forEach(el=>el.addEventListener('click',()=>buy(el.dataset.buy)));
 side.querySelector('#muteAudio')?.addEventListener('change',e=>{muted=e.target.checked;localStorage.setItem('ecocard-muted',muted?'1':'0')});
}
// Override prototype functions used by the existing page's view routing.
startSolo=start;drawSolo=fill;combo=combination;scoreSolo=cards=>evaluate(cards,solo.stage,solo.jokers);
selectSolo=choose;playSolo=play;targetSolo=target;makeOffers=()=>offers(solo.jokers);
buyJoker=buy;nextSolo=next;renderSolo=render;
window.EcoCardSolo={combination,evaluate,offers,stages,jokers:upgradedJokers,MODIFIERS,rollModifier};
})();