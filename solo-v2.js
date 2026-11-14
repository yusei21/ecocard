/* EcoCard — Salve o Mundo 2.0. Overrides the prototype solo mode only. */
(() => {
'use strict';
const stages=[
 {title:'Contaminação Cruzada',desc:'Aprenda a separar os materiais e formar combinações.',goal:850,limit:5,tier:'FÁCIL',rule:'mixed',hint:'Uma cor: ×1,35. Quatro cores: ×0,75.'},
 {title:'Descarte Irregular',desc:'A triagem incorreta causa impactos ambientais.',goal:2200,limit:4,tier:'MÉDIO',rule:'plastic',hint:'Coleta de uma mesma categoria concede +40 base.'},
 {title:'Desperdício de Recursos',desc:'Reaproveite os materiais disponíveis.',goal:4000,limit:4,tier:'MÉDIO',rule:'resource',hint:'Valores repetidos recebem ×1,5.'},
 {title:'Crise dos Aterros',desc:'A destinação final exige boas estratégias.',goal:7600,limit:4,tier:'DIFÍCIL',rule:'hands',hint:'Sequências concedem +45 base.'},
 {title:'Poluição dos Oceanos',desc:'Reduza o impacto dos resíduos nos ambientes aquáticos.',goal:12000,limit:4,tier:'DIFÍCIL',rule:'ocean',hint:'Três categorias diferentes concedem +55 base.'},
 {title:'Consumo Desenfreado',desc:'Repense o desperdício e o consumo de recursos.',goal:18500,limit:3,tier:'EXTREMO',rule:'consumption',hint:'Três ou mais cartas ativas concedem ×1,25.'},
 {title:'Mudanças Climáticas',desc:'A última crise combina estratégia e sorte.',goal:150000,limit:3,tier:'FINAL',rule:'climate',hint:'Três orgânicos: +80 base. Menos de três: ×0,7.'}
];
const BOSS_RULES=[
 ...['azul','vermelho','verde','amarelo','marrom'].map(suit=>({id:'ban_'+suit,name:'Categoria anulada',description:'As cartas dessa categoria não pontuam nem ativam coringas.',kind:'block',suit})),
 {id:'only_color',name:'Só coleta da mesma cor',description:'Apenas mãos com 3 ou mais cartas da mesma categoria pontuam.',kind:'only_color'},
 {id:'only_equal',name:'Só valores repetidos',description:'Apenas mãos com 2 ou mais cartas do mesmo valor pontuam.',kind:'only_equal'},
 {id:'no_five',name:'Cinco cartas anuladas',description:'Mãos de exatamente 5 cartas valem 0 pontos.',kind:'no_five'},
 {id:'only_three',name:'Exatamente três cartas',description:'Só mãos com exatamente 3 cartas pontuam.',kind:'only_three'},
 {id:'double_hp',name:'Crise agravada',description:'A vida do chefe é dobrada: a meta de pontos desta fase é ×2.',kind:'double_hp'}
];
function drawBossRule(stage,previous=null,rng=Math.random){
 if(stage===0)return null;
 const pool=BOSS_RULES.filter(rule=>rule.id!==previous?.id);
 return pool[Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.999999,rng()))*pool.length))];
}
function bossInvalidReason(cards,rule){
 if(!rule||rule.kind==='block')return null;
 if(rule.kind==='no_five'&&cards.length===5)return 'O chefe anulou uma mão de cinco cartas';
 if(rule.kind==='only_three'&&cards.length!==3)return 'Só são válidas mãos de três cartas';
 if(rule.kind==='only_color'&&!cards.some(c=>cards.filter(x=>x.suit===c.suit).length>=3))return 'São necessárias três cartas da mesma categoria';
 if(rule.kind==='only_equal'&&!cards.some(c=>cards.filter(x=>x.rank===c.rank).length>=2))return 'São necessários dois valores iguais';
 return null;
}
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

const DIFFICULTIES={
 facil:{name:'Aprendiz',description:'Para aprender sem tanta pressão',mult:.8,extraHands:1,extraDiscards:1,coins:8,growth:0,badChance:1},
 normal:{name:'Normal',description:'O desafio original',mult:1,extraHands:0,extraDiscards:0,coins:5,growth:0,badChance:1},
 dificil:{name:'Difícil',description:'Metas mais altas e pouca margem para erro',mult:1.5,extraHands:0,extraDiscards:-1,coins:4,growth:.06,badChance:1.5},
 extremo:{name:'Extremo',description:'Poucas jogadas e economia apertada',mult:2,extraHands:-1,extraDiscards:-1,coins:3,growth:.12,badChance:2}
};
function difficultyRules(key='normal',stage=0,modifierId='normal',bossRule=null){
 const d=DIFFICULTIES[key]||DIFFICULTIES.normal;
 return {goal:Math.ceil(stages[stage].goal*d.mult*(1+d.growth*stage)*(bossRule?.kind==='double_hp'?2:1)/50)*50,
 hands:Math.max(1,stages[stage].limit+d.extraHands-(modifierId==='short'?1:0)),
 discards:Math.max(0,2+d.extraDiscards),coins:d.coins};
}
function rollDifficultyModifier(key='normal'){
 const d=DIFFICULTIES[key]||DIFFICULTIES.normal;
 let weights=MODIFIERS.map(m=>({m,weight:m.weight*(m.id==='normal'||m.id==='good'?1/d.badChance:d.badChance)}));
 let r=Math.random()*weights.reduce((sum,x)=>sum+x.weight,0);
 return (weights.find(x=>(r-=x.weight)<0)||weights.at(-1)).m;
}

const HAND_GUIDE=[
 {name:'Separação Inicial',cards:[['A','azul'],['7','vermelho']],text:'Qualquer seleção de 1 a 5 cartas pontua, mesmo sem formar um combo forte.'},
 {name:'Materiais Equivalentes',cards:[['3','azul'],['3','marrom']],text:'Duas cartas com o mesmo valor formam um par. Multiplicador ×2.'},
 {name:'Reaproveitamento',cards:[['K','azul'],['K','verde'],['K','marrom']],text:'Três cartas com o mesmo valor. Multiplicador ×3,5.'},
 {name:'Fluxo Circular',cards:[['4','azul'],['5','vermelho'],['6','amarelo']],text:'Três ou mais valores consecutivos, mesmo com cores diferentes. Multiplicador ×2,75.'},
 {name:'Coleta Seletiva',cards:[['2','verde'],['6','verde'],['9','verde']],text:'Três ou mais cartas da mesma categoria. Multiplicador ×3.'},
 {name:'Triagem Perfeita',cards:[['2','amarelo'],['4','amarelo'],['6','amarelo'],['8','amarelo'],['J','amarelo']],text:'Cinco cartas da mesma categoria. Multiplicador ×5.'},
 {name:'Ciclo Completo',cards:[['2','marrom'],['3','marrom'],['4','marrom'],['5','marrom'],['6','marrom']],text:'Cinco cartas da mesma categoria em sequência. Multiplicador ×6.'}
];
function showHandGuide(){
 clearQueue();solo=null;lastBurst=null;
 const main=document.querySelector('#soloMain'),side=document.querySelector('#soloSide');
 if(!main||!side)return;
 side.style.display='none';main.classList.add('arcade-solo');
 const card=([rank,suit])=>'<span class="guide-mini-card guide-'+suit+'"><b>'+rank+'</b><i>'+({'azul':'▤','vermelho':'⬡','verde':'◇','amarelo':'✦','marrom':'✿'}[suit])+'</i></span>';
 main.innerHTML='<section class="hand-guide"><div class="guide-kicker">GUIA RÁPIDO / ANTES DE JOGAR</div><h2>COMO FORMAR AS MÃOS?</h2><p>Não precisa saber pôquer. Selecione de 1 a 5 cartas e veja a prévia de pontos antes de jogar. Cada carta tem um <b>valor</b> e uma <b>categoria de resíduo</b> (cor).</p><div class="guide-formula"><span>PONTOS DAS CARTAS</span><strong>×</strong><span>MULTIPLICADOR DA COMBINAÇÃO</span><strong>=</strong><span>PONTUAÇÃO</span></div><div class="guide-collection">'+HAND_GUIDE.map(h=>'<article class="guide-combo"><h3>'+h.name+'</h3><div class="guide-cards">'+h.cards.map(card).join('')+'</div><p>'+h.text+'</p></article>').join('')+'</div><div class="guide-note"><b>ATENÇÃO AOS CHEFES</b><p>Algumas crises anulam cores, exigem um tipo de combinação ou rejeitam mãos de cinco cartas. Se a prévia mostrar <strong>0 pontos</strong>, essa mão não será válida para o chefe. Coringas podem aumentar os pontos e multiplicadores.</p></div><button type="button" class="btn arcade-play guide-next" id="guideContinue">ENTENDI · ESCOLHER DIFICULDADE →</button></section>';
 main.querySelector('#guideContinue')?.addEventListener('click',chooseDifficulty);
}

function chooseDifficulty(){
 clearQueue();solo=null;lastBurst=null;
 const main=document.querySelector('#soloMain'),side=document.querySelector('#soloSide');
 if(!main||!side)return;
 main.classList.add('arcade-solo');side.style.display='none';
 main.innerHTML='<div class="difficulty-screen"><div class="eyebrow">SALVE O MUNDO / NOVA JORNADA</div><h2>ESCOLHA A DIFICULDADE</h2><p>Metas mais altas, menos descartes e condições mais severas. A dificuldade permanece durante as sete crises.</p><div class="difficulty-options">'+Object.entries(DIFFICULTIES).map(([key,d])=>{const r=difficultyRules(key,0);return '<button type="button" class="difficulty-option '+key+'" data-difficulty="'+key+'"><span class="difficulty-option-top"><b>'+d.name.toUpperCase()+'</b><span>↗</span></span><small>'+d.description+'</small><span class="difficulty-details"><span>META <b>'+r.goal.toLocaleString('pt-BR')+'</b></span><span>JOGADAS <b>'+r.hands+'</b></span><span>DESCARTES <b>'+r.discards+'</b></span><span>FICHAS <b>'+r.coins+'</b></span></span></button>'}).join('')+'</div><p class="difficulty-footnote">Escolha Normal para uma partida equilibrada ou Difícil se já domina os combos.</p></div>';
 side.innerHTML='<div class="arcade-level"><span class="label">PROGRESSÃO: FÁCIL → MÉDIO → MÉDIO → DIFÍCIL → DIFÍCIL → EXTREMO → FINAL</span><b>7 CRISES AMBIENTAIS</b><p>Jogue até cinco cartas por mão, forme combinações e gerencie coringas e ecofichas entre as etapas.</p></div><div class="rulebox"><strong>Observação:</strong> em Difícil e Extremo, os eventos negativos também têm maior chance de aparecer. A sorte faz parte da estratégia.</div>';
 main.querySelectorAll('[data-difficulty]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.difficulty)));
}
let busy=false,queue=[];function clearQueue(){queue.forEach(clearTimeout);queue=[];busy=false}
let lastBurst=null, audioCtx=null, muted=localStorage.getItem('ecocard-muted')==='1';
function beep(freq=480,duration=.1,shape='sine',gain=.085){if(muted)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();let osc=audioCtx.createOscillator(),vol=audioCtx.createGain();osc.type=shape;osc.frequency.setValueAtTime(freq,audioCtx.currentTime);vol.gain.setValueAtTime(Math.min(.16,Math.max(.003,gain*2.8)),audioCtx.currentTime);vol.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);osc.connect(vol);vol.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration)}catch{}}
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
function evaluate(cards,stage,jokers,modifier=null,bossRule=null){
 if(!cards.length||cards.length>5)throw Error('Selecione entre uma e cinco cartas');
 const phase=stages[stage]||stages.at(-1),blockedSuit=bossRule?.kind==='block'?bossRule.suit:null;
 const activeCards=blockedSuit?cards.filter(card=>card.suit!==blockedSuit):cards;
 const negated=cards.length-activeCards.length;
 const invalid=bossInvalidReason(activeCards,bossRule);
 if(!activeCards.length||invalid)return {score:0,type:'MÃO ANULADA',base:0,mult:0,events:[{label:invalid||'Cartas anuladas',chips:0,factor:1,mult:0}],combination:null,negated,blockedSuit,invalidReason:invalid||'Todas as cartas foram anuladas'};
 cards=activeCards;
 const c=combination(cards),events=[];
 let chips=20+cards.reduce((n,k)=>n+k.rank*12*(modifier?.id==='fog'&&k.rank<=2?.5:1),0),mult=c.factor;
 const add=(label,fn)=>{let before=[chips,mult];fn();events.push({label,chips:Math.round(chips-before[0]),factor:before[1]===0?1:mult/before[1],mult:mult-before[1]})};
 if(phase.rule==='mixed'){if(c.distinct===1)add('Triagem correta',()=>mult*=1.35);else if(c.distinct>=4)add('Mistura inadequada',()=>mult*=.75)}
 if(phase.rule==='plastic'){let n=cards.filter(x=>x.suit==='vermelho').length;if(n)add('Contaminação de embalagens',()=>chips=Math.max(1,chips-n*10));if(['flush','straightflush'].includes(c.kind))add('Separação cuidadosa',()=>chips+=40)}
 if(phase.rule==='resource'&&c.maxRank>=2)add('Reaproveitamento de valor',()=>mult*=1.5);
 if(phase.rule==='hands'&&c.straight)add('Eficiência na triagem',()=>chips+=45);
 if(phase.rule==='ocean'&&c.distinct>=3)add('Proteção dos oceanos',()=>chips+=55);
 if(phase.rule==='consumption'&&cards.length>=3)add('Consumo consciente',()=>mult*=1.25);
 if(phase.rule==='climate'){if(cards.filter(x=>x.suit==='marrom').length>=3)add('Compostagem estratégica',()=>chips+=80);else add('Pressão climática',()=>mult*=.7);}if(modifier?.id==='audit'&&cards.length>=4)add('Auditoria',()=>mult*=.8);if(modifier?.id==='good'&&c.distinct>=3)add('Mutirão',()=>chips+=35);
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
 return {score,type:c.name,base:chips,mult,events,combination:c,negated,blockedSuit,invalidReason:null};
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
function fill(n){if(!solo)return;for(let k=0;k<n;k++){if(!solo.deck.length)break;solo.hand.push(solo.deck.pop())}/* Keep manual ordering; new cards append at the end. */}
function start(difficulty='normal'){clearQueue();const modifier=rollDifficultyModifier(difficulty),rules=difficultyRules(difficulty,0,modifier.id);solo={stage:0,difficulty,score:0,coins:rules.coins,hand:[],deck:makeDeck(),selected:[],jokers:[],hands:rules.hands,discards:rules.discards,phase:'play',message:'Escolha de 1 a 5 cartas. Descubra combinações, supere crises e evolua sua estratégia.',runScore:0,comboChain:0,played:0,modifier,rerolls:0,wonStages:0,payout:null,playedCards:[],pendingPhase:null,bossRule:drawBossRule(0)};lastBurst=null;fill(8);render();beep(420,.09)}
function target(){return difficultyRules(solo.difficulty,solo.stage,solo.modifier.id,solo.bossRule).goal}
function moveSolo(from,to){
 if(!solo||solo.phase!=='play'||busy)return;
 solo.hand=window.EcoHandOrder.move(solo.hand,from,to);render();
}
function choose(id){if(!solo||solo.phase!=='play'||busy)return;
 let i=solo.selected.indexOf(id);if(i>=0)solo.selected.splice(i,1);else if(solo.selected.length<5)solo.selected.push(id);beep(i>=0?310:540,.045,'triangle');render()}
function payoutFor(state){
 const base=3+state.stage;
 const saved=state.hands;
 const interest=Math.min(5,Math.floor(state.coins/5));
 return {base,saved,interest,total:base+saved+interest};
}
function play(discard=false){
 if(solo.phase!=='play'||!solo.selected.length||busy)return;
 const cards=solo.hand.filter(c=>solo.selected.includes(c.id));
 if(discard){
  if(solo.discards<=0)return;
  solo.discards--;solo.comboChain=0;solo.message='Cartas trocadas. Planeje sua próxima combinação.';lastBurst=null;beep(240,.09,'triangle');
  solo.hand=solo.hand.filter(c=>!solo.selected.includes(c.id));solo.selected=[];fill(cards.length);
  render();return;
 }
 const result=evaluate(cards,solo.stage,solo.jokers,solo.modifier,solo.bossRule);
 solo.score+=result.score;solo.runScore+=result.score;solo.hands--;solo.played++;solo.comboChain++;
 solo.playedCards=cards;lastBurst=result;
 solo.message=result.type+' · '+fmt(result.score)+' pontos nesta jogada';
 solo.hand=solo.hand.filter(c=>!solo.selected.includes(c.id));solo.selected=[];fill(cards.length);
 const victory=solo.score>=target();
 solo.pendingPhase=victory?'clear':solo.hands<=0||!solo.hand.length?'lost':'play';
 if(victory){solo.payout=payoutFor(solo);solo.wonStages++}
 solo.phase='scoring';
 render();
 animateScore(result,()=>{
   if(!solo||solo.phase!=='scoring')return;
   solo.phase=solo.pendingPhase;solo.pendingPhase=null;
   if(solo.phase==='clear'){
     solo.message='CRISE SUPERADA! Resgate sua recompensa para abrir a loja.';
     beep(980,.26,'triangle');
   }else if(solo.phase==='lost'){
     solo.message='FIM DE RUN — meta não atingida.';
     beep(190,.25);
   }
   render();
 });
}
function collectPayout(){
 if(!solo||solo.phase!=='clear'||!solo.payout)return;
 solo.coins+=solo.payout.total;
 solo.phase='shop';solo.rerolls=0;
 solo.offer=offers(solo.jokers);
 solo.message='Recompensa resgatada! Gaste para crescer ou guarde para render juros.';
 beep(870,.13,'triangle');render();
}
function sellJoker(id){
 if(!solo||solo.phase!=='shop')return;
 const ix=solo.jokers.findIndex(j=>j.id===id);
 if(ix<0)return;
 const sold=solo.jokers.splice(ix,1)[0];
 const value=Math.max(1,Math.floor(sold.price/2));
 solo.coins+=value;
 solo.message=sold.name+' vendido por '+value+' ecofichas.';
 render();
}
function rerollCost(){return 4+(solo?.rerolls||0)+(solo?.difficulty==='extremo'?2:0)}

function animateScore(result,onDone){
 const zone=document.querySelector('#scorePerformance');
 const board=document.querySelector('.arcade-tabletop');
 if(!zone||!board){onDone?.();return}
 clearQueue();busy=true;board.classList.add('scoring');
 const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const duration=reduce?0:240;
 const startPoints=solo.score-result.score,goal=target();
 const events=result.events.map(e=>({name:e.label,detail:e.chips!==0?(e.chips>0?'+':'')+fmt(e.chips)+' pontos base':e.factor!==1?'×'+e.factor.toFixed(2):e.mult!==0?(e.mult>0?'+':'')+e.mult.toFixed(2)+' MULT':'EFEITO'}));
 const frames=[{name:result.type,detail:'COMBINAÇÃO'},...events,{name:'+'+fmt(result.score),detail:'PONTOS NA RODADA'}];
 frames.forEach((frame,i)=>{
  queue.push(setTimeout(()=>{
   zone.textContent=frame.name+' · '+frame.detail;
   zone.classList.remove('score-step');void zone.offsetWidth;zone.classList.add('score-step');
   const animated=startPoints+Math.floor(result.score*(i+1)/frames.length);
   const scoreboard=board.querySelector('.table-score strong');if(scoreboard)scoreboard.textContent=fmt(animated);
   const missing=board.querySelector('.table-score-left strong');if(missing)missing.textContent=fmt(Math.max(0,goal-animated));
   const sideScore=document.querySelector('#soloSide .arcade-sticky-score strong');if(sideScore)sideScore.innerHTML=fmt(animated)+' <span>/ '+fmt(goal)+'</span>';
   const sideMissing=document.querySelector('#soloSide .arcade-sticky-score p');if(sideMissing)sideMissing.innerHTML=animated>=goal?'<b>META ATINGIDA ✓</b>':'FALTAM <b>'+fmt(goal-animated)+'</b> PONTOS';
   const progress=document.querySelector('#soloSide .arcade-sticky-score .progress div');if(progress)progress.style.width=Math.min(100,100*animated/goal)+'%';
   const b=board.querySelector('.score-chip.total b');
   if(b)b.textContent=fmt(Math.floor(result.score*(i+1)/frames.length));
   if(!reduce)beep(370+i*65,.075,'triangle',.018);
   if(i===frames.length-1){
    zone.classList.add('score-finish');board.classList.add('score-victory');
    if(!reduce){const fx=document.createElement('div');fx.className='score-particles';
     for(let k=0;k<28;k++){const particle=document.createElement('i');particle.style.setProperty('--angle',(k*360/28)+'deg');particle.style.setProperty('--distance',(50+Math.random()*115)+'px');fx.append(particle)}
     zone.append(fx)}
   }
  },i*duration));
 });
 queue.push(setTimeout(()=>{
  busy=false;board.classList.remove('scoring','score-victory');
  onDone?.();
 },frames.length*duration+(reduce?0:620)));
}

function buy(id){if(solo.phase!=='shop')return;const j=solo.offer.find(x=>x.id===id);if(!j||solo.jokers.length>=5||solo.coins<j.price)return;solo.coins-=j.price;solo.jokers.push(j);solo.offer=solo.offer.filter(x=>x.id!==id);solo.message=j.rarity==='legend'?'✦ LENDÁRIO DESBLOQUEADO: AVENTURA CIRCULAR!':j.name+' adicionado à sua estratégia.';beep(j.rarity==='legend'?1047:730,.27,'triangle');render()}
function reroll(){const cost=rerollCost();if(!solo||solo.phase!=='shop'||solo.coins<cost)return;solo.coins-=cost;solo.rerolls++;solo.offer=offers(solo.jokers);solo.message='Ofertas renovadas por '+cost+' ecofichas. Próxima troca: '+rerollCost()+'.';render()}
function next(){if(solo.phase!=='shop')return;if(solo.stage===stages.length-1){solo.phase='won';solo.message='JORNADA CONCLUÍDA! Você venceu as sete crises ambientais.'}else{solo.stage++;solo.score=0;solo.modifier=rollDifficultyModifier(solo.difficulty);solo.bossRule=drawBossRule(solo.stage,solo.bossRule);const rules=difficultyRules(solo.difficulty,solo.stage,solo.modifier.id);solo.hands=rules.hands;solo.discards=rules.discards;solo.hand=[];solo.deck=makeDeck();solo.selected=[];solo.phase='play';solo.comboChain=0;solo.payout=null;solo.playedCards=[];lastBurst=null;fill(8);solo.message='NOVO DESAFIO: '+stages[solo.stage].title+'!'}beep(570,.18);render()}
function fmt(v){return Math.floor(v).toLocaleString('pt-BR')}
function render(){
 if(!solo)return;
 const main=document.querySelector('#soloMain'),side=document.querySelector('#soloSide');
 if(!main||!side)return;
 side.style.display='';
 const stage=stages[solo.stage],goal=target(),shownScore=solo.phase==='scoring'?solo.score-(lastBurst?.score||0):solo.score,remaining=Math.max(0,goal-shownScore);
 const selected=solo.hand.filter(c=>solo.selected.includes(c.id));
 const scoring=solo.phase==='scoring';
 const preview=selected.length?evaluate(selected,solo.stage,solo.jokers,solo.modifier,solo.bossRule):null;
 const progress=Math.min(100,Math.round(100*shownScore/goal));
 const headline=solo.phase==='won'?'JORNADA VENCIDA':solo.phase==='clear'?'CRISE SUPERADA':solo.phase==='lost'?'FIM DA JORNADA':'MISSÃO '+(solo.stage+1)+' DE '+stages.length;
 const blockedSuit=solo.bossRule?.kind==='block'?SUITS.find(item=>item.id===solo.bossRule.suit):null;
 const blockMsg=solo.bossRule?'<div class="boss-block" role="note"><b>REGRA SORTEADA · '+esc(solo.bossRule.name.toUpperCase())+(blockedSuit?' ('+esc(blockedSuit.label.toUpperCase())+')':'')+'</b><span>'+esc(solo.bossRule.description)+(solo.bossRule.kind==='double_hp'?' Prepare combinações fortes para superar a meta ampliada.':' Mãos que não cumprem a regra valem 0 pontos.')+'</span></div>':'';
 const ruleBrief='<section class="crisis-rules" aria-label="Regras e modificadores da crise">'+blockMsg+'<div class="crisis-rules-heading"><span>CRISE '+(solo.stage+1)+' / '+stages.length+' · '+esc(stage.tier)+'</span><strong>'+esc(stage.title)+'</strong></div><div class="crisis-rules-grid"><div><small>REGRA DO CHEFE</small><p>'+esc(stage.hint)+'</p></div><div><small>EVENTO DA RODADA · '+esc(solo.modifier.name.toUpperCase())+'</small><p>'+esc(solo.modifier.desc)+'</p></div></div></section>';
 side.classList.add('arcade-side');
 side.innerHTML='<div class="difficulty-label">DIFICULDADE <b>'+DIFFICULTIES[solo.difficulty||'normal'].name.toUpperCase()+'</b></div><div class="arcade-sticky-score"><small>PLACAR DA RODADA</small><strong>'+fmt(shownScore)+' <span>/ '+fmt(goal)+'</span></strong><p>'+(remaining?'FALTAM <b>'+fmt(remaining)+'</b> PONTOS':'<b>META ATINGIDA ✓</b>')+'</p><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="'+goal+'" aria-valuenow="'+Math.min(goal,shownScore)+'"><div style="width:'+progress+'%"></div></div></div>'+
 '<div class="arcade-level"><span class="label">'+headline+' · '+stage.tier+'</span><b>'+esc(stage.title)+'</b><p>'+esc(stage.desc)+'</p><small>'+esc(stage.hint)+'</small></div>'+
 '<div class="arcade-modifier"><span class="label">CONDIÇÃO DO DESAFIO</span><b>'+esc(solo.modifier.name)+'</b><small>'+esc(solo.modifier.desc)+'</small></div>'+
 '<div class="arcade-counters"><span>Fichas <b>'+fmt(solo.coins)+' ✦</b></span><span>Juros previstos <b>+'+Math.min(5,Math.floor(solo.coins/5))+' ✦</b></span><span>Jogadas restantes <b>'+solo.hands+'</b></span><span>Descartes <b>'+solo.discards+'</b></span><span>Monte <b>'+solo.deck.length+' cartas</b></span></div>'+
 '<h3>Coringas <span>'+solo.jokers.length+'/5</span></h3><div class="jokers">'+(solo.jokers.length?solo.jokers.map(j=>'<div class="joker '+(j.rarity==='legend'?'legend':'')+'"><span class="label">'+(j.rarity==='legend'?'LENDÁRIO':j.rarity==='uncommon'?'INCOMUM':'COMUM')+'</span><b>'+esc(j.name)+'</b><small>'+esc(j.desc)+'</small>'+(solo.phase==='shop'?'<button class="sell-joker" data-sell="'+j.id+'">Vender +'+Math.max(1,Math.floor(j.price/2))+' ✦</button>':'')+'</div>').join(''):'<p class="hint">Aproveite a loja após superar uma crise.</p>')+'</div>'+
 '<label class="sound-control"><input type="checkbox" id="muteAudio" '+(!muted?'checked':'')+'> Efeitos sonoros</label>';
 let area='';
 if(solo.phase==='play'||scoring){
  const total=scoring?lastBurst?.score:preview?.score;
  const base=scoring?lastBurst?.base:preview?.base;
  const mult=scoring?lastBurst?.mult:preview?.mult;
  area='<div class="arcade-tabletop">'+ruleBrief+'<div class="arena-header"><span class="eyebrow">SALVE O MUNDO / MESA DE TRIAGEM</span><span class="arena-round">CRISE '+(solo.stage+1)+' / '+stages.length+'</span></div>'+
  '<div class="table-score"><div><small>SEUS PONTOS</small><strong>'+fmt(shownScore)+'</strong></div><div><small>'+(solo.bossRule?.kind==='double_hp'?'META ×2':'META')+'</small><strong>'+fmt(goal)+'</strong></div><div class="table-score-left"><small>FALTAM</small><strong>'+fmt(remaining)+'</strong></div></div>'+
  '<div class="arena-scores"><div class="score-chip"><small>BASE</small><b>'+fmt(base||0)+'</b></div><div class="score-times">×</div><div class="score-chip magenta"><small>MULT</small><b>'+((mult||1).toFixed(2))+'</b></div><div class="score-equals">=</div><div class="score-chip total"><small>'+(scoring?'PONTUANDO':'PRÉVIA')+'</small><b>'+fmt(scoring?0:total||0)+'</b></div></div>'+
  '<div class="combo-readout">'+esc(scoring?lastBurst.type:preview?.type||'SELECIONE SUAS CARTAS')+'</div>'+
  '<div class="score-performance" id="scorePerformance" aria-live="polite">'+(scoring?'CALCULANDO COMBO…':'')+'</div>'+
  (scoring?'<div class="played-label">COMBINAÇÃO JOGADA</div><div class="cards played-cards">'+solo.playedCards.map(c=>cardHTML(c,false,true)).join('')+'</div>':'')+
  '<div class="arena-hand-title"><strong>SUAS CARTAS</strong><span>SELECIONE ATÉ 5 · '+solo.selected.length+'/5</span></div><div class="cards arcade-hand">'+solo.hand.map(c=>{const html=cardHTML(c,solo.selected.includes(c.id),scoring);return blockedSuit&&c.suit===blockedSuit.id?html.replace('class="playing-card','class="playing-card boss-negated'):html}).join('')+'</div>'+ 
  '<div class="actions arena-actions"><button class="btn arcade-play" id="playCards" '+(!solo.selected.length||scoring?'disabled':'')+'>JOGAR MÃO</button><button class="btn secondary" id="discardCards" '+(!solo.selected.length||!solo.discards||scoring?'disabled':'')+'>DESCARTAR</button></div></div>';
 } else if(solo.phase==='clear'){
  const p=solo.payout;
  area=ruleBrief+'<div class="run-result won-result"><div class="result-kicker">DESAFIO '+(solo.stage+1)+' / '+stages.length+' CONCLUÍDO</div><div class="result-symbol" aria-hidden="true">✓</div><h2>CRISE SUPERADA!</h2><p>Você ultrapassou a meta de <b>'+fmt(goal)+'</b> pontos.</p><div class="result-score"><small>PONTUAÇÃO DA RODADA</small><strong>'+fmt(solo.score)+'</strong></div><div class="payout-ledger"><div><span>Recompensa da crise</span><b>+'+p.base+' ✦</b></div><div><span>Jogadas não utilizadas</span><b>+'+p.saved+' ✦</b></div><div><span>Juros (1 para cada 5 fichas, máximo 5)</span><b>+'+p.interest+' ✦</b></div><div class="total"><span>RECEBER AGORA</span><b>+'+p.total+' ✦</b></div></div><button class="btn arcade-play" id="collectPayout">RESGATAR '+p.total+' FICHAS →</button></div>';
 } else if(solo.phase==='shop'){
  area=ruleBrief+'<div class="arcade-shop"><span class="eyebrow">ENTRE CRISES / MERCADO CIRCULAR</span><h2>MONTE SUA ESTRATÉGIA.</h2><div class="shop-wallet"><strong>'+fmt(solo.coins)+' ✦</strong><span>EM CAIXA</span><span>Juros futuros: +'+Math.min(5,Math.floor(solo.coins/5))+' por crise<br>Guardar ou gastar? Você decide.</span></div><p class="hint">Até 5 coringas em jogo. Você pode vender um coringa por metade do preço.</p><div class="market">'+solo.offer.map(j=>'<div class="market-item '+(j.rarity==='legend'?'shop-legend':'')+'"><span class="label">'+(j.rarity==='legend'?'RARIDADE LENDÁRIA':j.rarity==='uncommon'?'INCOMUM':'COMUM')+'</span><b>'+esc(j.name)+'</b><p>'+esc(j.desc)+'</p><button class="btn" data-buy="'+j.id+'" '+(solo.coins<j.price||solo.jokers.length>=5?'disabled':'')+'>COMPRAR · '+j.price+' ✦</button></div>').join('')+'</div><div class="actions shop-actions"><button class="btn secondary" id="rerollShop" '+(solo.coins<rerollCost()?'disabled':'')+'>NOVAS OFERTAS · '+rerollCost()+' ✦</button><button class="btn arcade-play" id="nextStage">'+(solo.stage===stages.length-1?'CONCLUIR JORNADA →':'PRÓXIMA CRISE →')+'</button></div></div>';
 } else {
  area=ruleBrief+'<div class="run-result '+(solo.phase==='won'?'won-result':'lost-result')+'"><div class="result-kicker">'+(solo.phase==='won'?'7 DE 7 DESAFIOS CONCLUÍDOS':'TENTATIVA ENCERRADA')+'</div><div class="result-symbol">'+(solo.phase==='won'?'✓':'×')+'</div><h2>'+(solo.phase==='won'?'VOCÊ SALVOU O MUNDO!':'FIM DE JOGO')+'</h2><p>'+(solo.phase==='won'?'A jornada foi concluída. Agora leve essas decisões para o mundo real.':'A meta não foi alcançada. Experimente construir combinações mais fortes e reservar fichas para os juros.')+'</p><div class="result-score"><small>PONTUAÇÃO TOTAL DA JORNADA</small><strong>'+fmt(solo.runScore)+'</strong></div><div class="result-stats"><span>Crises superadas <b>'+solo.wonStages+'/'+stages.length+'</b></span><span>Jogadas realizadas <b>'+solo.played+'</b></span><span>Fichas finais <b>'+solo.coins+'</b></span></div><button class="btn arcade-play" id="restartSolo">JOGAR NOVAMENTE</button></div>';
 }
 main.classList.add('arcade-solo');main.innerHTML=area;
 main.querySelectorAll('.arcade-hand [data-card]').forEach(el=>el.addEventListener('click',()=>choose(el.dataset.card)));
 if(solo.phase==='play')window.EcoHandOrder.drag(main.querySelector('.arcade-hand'),moveSolo);
 main.querySelector('#playCards')?.addEventListener('click',()=>play(false));
 main.querySelector('#discardCards')?.addEventListener('click',()=>play(true));
 main.querySelector('#collectPayout')?.addEventListener('click',collectPayout);
 main.querySelector('#nextStage')?.addEventListener('click',next);
 main.querySelector('#rerollShop')?.addEventListener('click',reroll);
 main.querySelector('#restartSolo')?.addEventListener('click',showHandGuide);
 main.querySelectorAll('[data-buy]').forEach(el=>el.addEventListener('click',()=>buy(el.dataset.buy)));
 side.querySelectorAll('[data-sell]').forEach(el=>el.addEventListener('click',()=>sellJoker(el.dataset.sell)));
 side.querySelector('#muteAudio')?.addEventListener('change',e=>{muted=!e.target.checked;localStorage.setItem('ecocard-muted',muted?'1':'0')});
}

// Override prototype functions used by the existing page's view routing.
startSolo=showHandGuide;drawSolo=fill;combo=combination;scoreSolo=cards=>evaluate(cards,solo.stage,solo.jokers,solo.modifier,solo.bossRule);
selectSolo=choose;playSolo=play;targetSolo=target;makeOffers=()=>offers(solo.jokers);
buyJoker=buy;nextSolo=next;renderSolo=render;
window.EcoCardSolo={combination,evaluate,offers,stages,jokers:upgradedJokers,MODIFIERS,rollModifier,payoutFor,rerollCost,DIFFICULTIES,difficultyRules,rollDifficultyModifier,BOSS_RULES,drawBossRule,bossInvalidReason,HAND_GUIDE,showHandGuide};
})();