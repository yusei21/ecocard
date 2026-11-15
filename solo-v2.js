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
 {id:'biomas',name:'Aliança dos Biomas',desc:'×1,8 multiplicador com cartas de pelo menos 3 categorias.',rarity:'epic',price:11},
 {id:'usina',name:'Usina Circular',desc:'+150 pontos base em trincas ou sequências.',rarity:'epic',price:12},
 {id:'circular',name:'Aventura Circular',desc:'Ativa cada outro coringa equipado 2 vezes, na ordem. Nunca ativa a si própria.',rarity:'legend',price:15},
 {id:'papel_limpo',name:'Papel Recuperado',desc:'+18 pontos base por carta de papel.',rarity:'common',price:4},
 {id:'vidro_retorno',name:'Retorno do Vidro',desc:'+20 pontos base por carta de vidro.',rarity:'common',price:4},
 {id:'metal_valor',name:'Valor do Metal',desc:'+22 pontos base por carta de metal.',rarity:'common',price:5},
 {id:'plastico_responsavel',name:'Plástico Responsável',desc:'+18 pontos base por carta de plástico.',rarity:'common',price:4},
 {id:'horta_urbana',name:'Horta Urbana',desc:'+65 pontos base com pelo menos 2 orgânicos.',rarity:'common',price:5},
 {id:'separacao',name:'Triagem Especializada',desc:'+45 pontos base com cartas de uma só categoria.',rarity:'common',price:4},
 {id:'diversidade',name:'Mosaico Ambiental',desc:'+15 pontos base por categoria diferente.',rarity:'common',price:5},
 {id:'sequencia_curta',name:'Caminho da Reciclagem',desc:'+40 pontos base em sequência.',rarity:'common',price:5},
 {id:'dupla_vida',name:'Segunda Utilidade',desc:'+55 pontos base com valores repetidos.',rarity:'common',price:5},
 {id:'coleta_rapida',name:'Coleta Expressa',desc:'+30 pontos base com 1 ou 2 cartas.',rarity:'common',price:4},
 {id:'reparo',name:'Oficina de Reparos',desc:'+2 de multiplicador por carta de valor 10 ou maior.',rarity:'common',price:6},
 {id:'papel_reciclado',name:'Ciclo do Papel',desc:'×1,35 com pelo menos 2 cartas de papel.',rarity:'uncommon',price:7},
 {id:'vidro_circular',name:'Vidro Infinito',desc:'×1,4 com pelo menos 2 cartas de vidro.',rarity:'uncommon',price:8},
 {id:'metal_reuso',name:'Metal Reintegrado',desc:'×1,45 com pelo menos 2 cartas de metal.',rarity:'uncommon',price:8},
 {id:'plastico_engenharia',name:'Design sem Descarte',desc:'×1,35 com pelo menos 2 cartas de plástico.',rarity:'uncommon',price:7},
 {id:'biofertilizante',name:'Biofertilizante',desc:'×1,5 com pelo menos 2 cartas orgânicas.',rarity:'uncommon',price:9},
 {id:'coleta_integrada',name:'Coleta Integrada',desc:'×1,45 com pelo menos 3 categorias diferentes.',rarity:'uncommon',price:8},
 {id:'triagem_inteligente',name:'Triagem Inteligente',desc:'+120 pontos base com 3 valores iguais.',rarity:'uncommon',price:8},
 {id:'fluxo_devolucao',name:'Fluxo de Devolução',desc:'+95 pontos base em sequência.',rarity:'uncommon',price:8},
 {id:'reuso_de_agua',name:'Água em Ciclo',desc:'+80 pontos base com cartas de uma só categoria.',rarity:'uncommon',price:7},
 {id:'parque_solar',name:'Parque Solar',desc:'×2 com pelo menos 2 cartas de metal.',rarity:'epic',price:12},
 {id:'economia_azul',name:'Economia Azul',desc:'×2 com pelo menos 3 cartas de papel.',rarity:'epic',price:12},
 {id:'carbono_positivo',name:'Solo Regenerado',desc:'×1,9 com pelo menos 3 cartas orgânicas.',rarity:'epic',price:12},
 {id:'cidade_circular',name:'Cidade Circular',desc:'×1,75 com 4 ou mais categorias diferentes.',rarity:'epic',price:12},
 {id:'laboratorio_verde',name:'Laboratório Verde',desc:'+240 pontos base com 3 cartas da mesma categoria.',rarity:'epic',price:11},
 {id:'rede_regenerativa',name:'Rede Regenerativa',desc:'×2,1 no Ciclo Completo.',rarity:'epic',price:13},
 {id:'planeta_vivo',name:'Planeta Vivo',desc:'×3 com 4 ou mais categorias diferentes.',rarity:'legend',price:17},
 {id:'renascimento',name:'Renascimento Verde',desc:'×3 na Coleta Seletiva, Triagem Perfeita ou Ciclo Completo.',rarity:'legend',price:18},
 {id:'pacto_global',name:'Pacto Global',desc:'×2,5 com 3 valores iguais e 2 categorias diferentes.',rarity:'legend',price:17}
];
const ranks={common:1,uncommon:1.1,epic:.55,legend:.012};
function jokerWeight(j){return j.id==='circular'?.0005:ranks[j.rarity]}
const RARITY_INFO={
 common:{label:'COMUM'},
 uncommon:{label:'RARO'},
 epic:{label:'ÉPICO'},
 legend:{label:'LENDÁRIO'}
};
// Minimal geometric illustrations, drawn as vectors without emoji or external files.
const JOKER_ART={
 reduzir:'<path d="M16 17h24M16 17l8-8M16 17l8 8M40 39H16M40 39l-8-8M40 39l-8 8"/>',
 reutilizar:'<path d="M17 19a16 16 0 0 1 27 5M44 24v-11M44 24H33M39 37a16 16 0 0 1-27-5M12 32v11M12 32h11"/>',
 reciclar:'<path d="m28 7 8 14H20L28 7ZM9 40l8-15 8 15H9Zm22 0 8-15 8 15H31Z"/>',
 compostagem:'<path d="M28 47V28M28 30C15 28 12 17 14 11c12-1 19 7 14 19ZM28 35c13-1 18-11 16-18-12 0-20 7-16 18Z"/>',
 cooperativa:'<circle cx="17" cy="20" r="5"/><circle cx="39" cy="20" r="5"/><circle cx="28" cy="14" r="6"/><path d="M6 42c0-10 6-14 13-14M50 42c0-10-6-14-13-14M15 44c0-12 6-19 13-19s13 7 13 19"/>',
 educacao:'<path d="M28 13c-8-6-17-5-21-3v30c7-2 14-1 21 4 7-5 14-6 21-4V10c-5-2-14-3-21 3ZM28 13v31M13 18h8M35 18h8"/>',
 catadores:'<path d="M9 38h38M13 38V22l15-10 15 10v16M20 38V27h16v11M18 44h20"/><circle cx="28" cy="20" r="3"/>',
 logistica:'<rect x="7" y="17" width="27" height="23" rx="2"/><path d="M34 24h9l7 9v7H34M11 12h25M41 12l-5-5M41 12l-5 5"/><circle cx="17" cy="42" r="4"/><circle cx="42" cy="42" r="4"/>',
 biomas:'<circle cx="28" cy="28" r="18"/><path d="M28 10v36M10 28h36M17 15l22 26M39 15 17 41"/><circle cx="28" cy="28" r="6"/>',
 usina:'<path d="M7 44h42V24L36 32V20L22 29V12H11v32M15 19h4M16 35h4M30 38h4M41 38h4"/>',
 circular:'<circle cx="28" cy="28" r="18"/><circle cx="28" cy="28" r="9"/><path d="m28 3 6 9-10 2M53 28l-9 6-2-10M28 53l-6-9 10-2M3 28l9-6 2 10"/>',
 papel_limpo:'<path d="M10 18h36v23H10zM16 12h24M18 24h20M18 31h15"/>',
 vidro_retorno:'<path d="M28 6v43M19 14h18M15 21h26M19 44h18"/>',
 metal_valor:'<path d="M9 15h38M14 15v26h28V15M18 25h20M20 33h16"/>',
 plastico_responsavel:'<path d="M12 12h32v31H12zM20 18h16M20 27h16M20 36h16"/>',
 horta_urbana:'<path d="M28 47V16M28 29c-13-2-16-12-14-18 12 0 19 6 14 18M28 37c12-3 17-11 15-18-13 1-18 9-15 18"/>',
 separacao:'<path d="M8 28h40M28 8v40M13 13l30 30M43 13 13 43"/>',
 diversidade:'<path d="M12 18l16-11 16 11v22H12zM20 27h16M22 34h12"/>',
 sequencia_curta:'<path d="M7 42l14-18 10 8 18-23M35 9h14v14"/>',
 dupla_vida:'<path d="M8 17h40v22H8zM17 17v22M30 17v22M11 12h34"/>',
 coleta_rapida:'<path d="M8 30l12-13 11 13 15-15M13 44h32"/>',
 reparo:'<path d="M12 14h32v28H12zM19 23h18M19 31h18M29 14v28"/>',
 papel_reciclado:'<path d="M11 13h34v30H11zM18 20h20M18 28h20M18 36h13"/>',
 vidro_circular:'<path d="M14 9h28v38H14zM20 16h16M20 26h16M20 36h12"/>',
 metal_reuso:'<path d="M8 16h40M13 16v25h30V16M18 36h20M22 25h12"/>',
 plastico_engenharia:'<path d="M12 12l32 32M44 12 12 44M16 27h24"/>',
 biofertilizante:'<path d="M28 8l18 12v18L28 48 10 38V20zM19 28h18"/>',
 coleta_integrada:'<path d="M10 22h36M14 22l14-13 14 13M15 33h26M21 41h14"/>',
 triagem_inteligente:'<path d="M9 42l15-30 9 16 14-12M11 44h36"/>',
 fluxo_devolucao:'<path d="M28 9a19 19 0 1 0 0 38a19 19 0 1 0 0-38M28 18v20M18 28h20"/>',
 reuso_de_agua:'<path d="M10 12h36v32H10zM18 18h20M18 26h20M18 34h20"/>',
 parque_solar:'<path d="M8 45 28 9 48 45M15 36h26M21 27h14"/>',
 economia_azul:'<path d="M10 12h36v30H10zM18 17v20M28 17v20M38 17v20"/>',
 carbono_positivo:'<path d="M28 7v42M15 19l13-11 13 11M16 35l12 13 12-13"/>',
 cidade_circular:'<path d="M28 6l20 16-7 25H15L8 22zM17 29h22"/>',
 laboratorio_verde:'<path d="M12 12h32v32H12zM21 21h14v14H21zM12 28h9M35 28h9"/>',
 rede_regenerativa:'<path d="M28 7l19 14v17L28 49 9 38V21zM19 22h18M19 32h18"/>',
 planeta_vivo:'<path d="M28 7l9 16 17 5-17 7-9 15-9-15-17-7 17-5z"/>',
 renascimento:'<path d="M11 28a17 17 0 0 1 34 0M11 28a17 17 0 0 0 34 0M28 11v34"/>',
 pacto_global:'<path d="M28 5l19 13v20L28 51 9 38V18zM20 19h16v18H20z"/>'
};
function jokerArt(j){
 const drawing=JOKER_ART[j.id]||JOKER_ART.reutilizar;
 return '<div class="joker-art" aria-hidden="true"><svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'+drawing+'</svg></div>';
}
function rarityLabel(j){return RARITY_INFO[j.rarity]?.label||RARITY_INFO.common.label}

const MODIFIERS=[{id:'normal',name:'Padrão',desc:'Sem efeito extra.',weight:3},{id:'fog',name:'Triagem Nebulosa',desc:'Valores 1 e 2 pontuam pela metade.',weight:2},{id:'short',name:'Escassez',desc:'Uma jogada a menos.',weight:2},{id:'audit',name:'Auditoria',desc:'Jogadas de 4 ou 5 cartas valem ×0,8.',weight:2},{id:'good',name:'Mutirão',desc:'3 cores diferentes concedem +35 pontos base.',weight:1}];
function rollModifier(){let r=Math.random()*MODIFIERS.reduce((a,m)=>a+m.weight,0);return MODIFIERS.find(m=>(r-=m.weight)<0)||MODIFIERS[0]}

// Difficulty belongs to each crisis, never to the entire run.
function difficultyRules(stage=0,modifierId='normal',bossRule=null){
 const config=stages[stage];
 return {goal:Math.ceil(config.goal*(bossRule?.kind==='double_hp'?2:1)/50)*50,
  hands:Math.max(1,config.limit-(modifierId==='short'?1:0)),discards:2,coins:5};
}
function rollDifficultyModifier(stage=0){
 // The first crisis introduces mechanics without extra random punishment.
 return stage===0?MODIFIERS.find(m=>m.id==='normal'):rollModifier();
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
 main.innerHTML='<section class="hand-guide"><div class="guide-kicker">GUIA RÁPIDO / ANTES DE JOGAR</div><h2>COMO FORMAR AS MÃOS?</h2><p>Não precisa saber pôquer. Selecione de 1 a 5 cartas e veja a prévia de pontos antes de jogar. Cada carta tem um <b>valor</b> e uma <b>categoria de resíduo</b> (cor).</p><div class="guide-formula"><span>PONTOS DAS CARTAS</span><strong>×</strong><span>MULTIPLICADOR DA COMBINAÇÃO</span><strong>=</strong><span>PONTUAÇÃO</span></div><div class="guide-collection">'+HAND_GUIDE.map(h=>'<article class="guide-combo"><h3>'+h.name+'</h3><div class="guide-cards">'+h.cards.map(card).join('')+'</div><p>'+h.text+'</p></article>').join('')+'</div><div class="guide-note"><b>ATENÇÃO AOS CHEFES</b><p>Algumas crises anulam cores, exigem um tipo de combinação ou rejeitam mãos de cinco cartas. Se a prévia mostrar <strong>0 pontos</strong>, essa mão não será válida para o chefe. Coringas podem aumentar os pontos e multiplicadores.</p></div><button type="button" class="btn arcade-play guide-next" id="guideContinue">ENTENDI · COMEÇAR JORNADA →</button></section>';
 main.querySelector('#guideContinue')?.addEventListener('click',()=>start());
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
 if(joker.id==='biomas'&&c.distinct>=3)add('Aliança dos Biomas',()=>mult*=1.8);
 if(joker.id==='usina'&&(c.straight||c.maxRank>=3))add('Usina Circular',()=>chips+=150);
 if(joker.id==='papel_limpo'&&(cards.filter(x=>x.suit==='azul').length>0))add('Papel Recuperado',()=>chips+=cards.filter(x=>x.suit==='azul').length*18);
 if(joker.id==='vidro_retorno'&&(cards.some(x=>x.suit==='verde')))add('Retorno do Vidro',()=>chips+=cards.filter(x=>x.suit==='verde').length*20);
 if(joker.id==='metal_valor'&&(cards.some(x=>x.suit==='amarelo')))add('Valor do Metal',()=>chips+=cards.filter(x=>x.suit==='amarelo').length*22);
 if(joker.id==='plastico_responsavel'&&(cards.some(x=>x.suit==='vermelho')))add('Plástico Responsável',()=>chips+=cards.filter(x=>x.suit==='vermelho').length*18);
 if(joker.id==='horta_urbana'&&(n>=2))add('Horta Urbana',()=>chips+=65);
 if(joker.id==='separacao'&&(c.distinct===1))add('Triagem Especializada',()=>chips+=45);
 if(joker.id==='diversidade'&&(true))add('Mosaico Ambiental',()=>chips+=c.distinct*15);
 if(joker.id==='sequencia_curta'&&(c.straight))add('Caminho da Reciclagem',()=>chips+=40);
 if(joker.id==='dupla_vida'&&(c.maxRank>=2))add('Segunda Utilidade',()=>chips+=55);
 if(joker.id==='coleta_rapida'&&(cards.length<=2))add('Coleta Expressa',()=>chips+=30);
 if(joker.id==='reparo'&&(cards.some(x=>x.rank>=10)))add('Oficina de Reparos',()=>mult+=cards.filter(x=>x.rank>=10).length*2);
 if(joker.id==='papel_reciclado'&&(cards.filter(x=>x.suit==='azul').length>=2))add('Ciclo do Papel',()=>mult*=1.35);
 if(joker.id==='vidro_circular'&&(cards.filter(x=>x.suit==='verde').length>=2))add('Vidro Infinito',()=>mult*=1.4);
 if(joker.id==='metal_reuso'&&(cards.filter(x=>x.suit==='amarelo').length>=2))add('Metal Reintegrado',()=>mult*=1.45);
 if(joker.id==='plastico_engenharia'&&(cards.filter(x=>x.suit==='vermelho').length>=2))add('Design sem Descarte',()=>mult*=1.35);
 if(joker.id==='biofertilizante'&&(n>=2))add('Biofertilizante',()=>mult*=1.5);
 if(joker.id==='coleta_integrada'&&(c.distinct>=3))add('Coleta Integrada',()=>mult*=1.45);
 if(joker.id==='triagem_inteligente'&&(c.maxRank>=3))add('Triagem Inteligente',()=>chips+=120);
 if(joker.id==='fluxo_devolucao'&&(c.straight))add('Fluxo de Devolução',()=>chips+=95);
 if(joker.id==='reuso_de_agua'&&(c.distinct===1))add('Água em Ciclo',()=>chips+=80);
 if(joker.id==='parque_solar'&&(cards.filter(x=>x.suit==='amarelo').length>=2))add('Parque Solar',()=>mult*=2);
 if(joker.id==='economia_azul'&&(cards.filter(x=>x.suit==='azul').length>=3))add('Economia Azul',()=>mult*=2);
 if(joker.id==='carbono_positivo'&&(n>=3))add('Solo Regenerado',()=>mult*=1.9);
 if(joker.id==='cidade_circular'&&(c.distinct>=4))add('Cidade Circular',()=>mult*=1.75);
 if(joker.id==='laboratorio_verde'&&(c.maxColor>=3))add('Laboratório Verde',()=>chips+=240);
 if(joker.id==='rede_regenerativa'&&(c.kind==='straightflush'))add('Rede Regenerativa',()=>mult*=2.1);
 if(joker.id==='planeta_vivo'&&(c.distinct>=4))add('Planeta Vivo',()=>mult*=3);
 if(joker.id==='renascimento'&&(c.kind==='flush'||c.kind==='straightflush'))add('Renascimento Verde',()=>mult*=3);
 if(joker.id==='pacto_global'&&(c.maxRank>=3&&c.distinct>=2))add('Pacto Global',()=>mult*=2.5);
 }
 }
 const score=Math.max(0,Math.floor(chips*mult));
 return {score,type:c.name,base:chips,mult,events,combination:c,negated,blockedSuit,invalidReason:null};
}
function offers(exclude,rng=Math.random){
 const pool=upgradedJokers.filter(j=>!exclude.some(x=>x.id===j.id)),chosen=[];
 function pickWeighted(options){
  let total=options.reduce((sum,j)=>sum+jokerWeight(j),0),roll=rng()*total,ix=0;
  for(;ix<options.length-1;ix++){roll-=jokerWeight(options[ix]);if(roll<0)break}
  return options[ix];
 }
 while(chosen.length<3&&pool.length){
  const picked=pickWeighted(pool);
  chosen.push(picked);pool.splice(pool.indexOf(picked),1);
 }
 // Prevent stores with three common cards when rare/epic choices still exist.
 // The legendary is never forced: it remains the rarest random discovery.
 if(chosen.length===3&&chosen.every(j=>j.rarity==='common')){
  const upgrades=pool.filter(j=>j.rarity==='uncommon'||j.rarity==='epic');
  if(upgrades.length)chosen[2]=pickWeighted(upgrades);
 }
 return chosen;
}
function fill(n){if(!solo)return;for(let k=0;k<n;k++){if(!solo.deck.length)break;solo.hand.push(solo.deck.pop())}/* Keep manual ordering; new cards append at the end. */}
function start(){clearQueue();const modifier=rollDifficultyModifier(0),rules=difficultyRules(0,modifier.id);solo={stage:0,score:0,coins:rules.coins,hand:[],deck:makeDeck(),selected:[],jokers:[],hands:rules.hands,discards:rules.discards,phase:'play',message:'Escolha de 1 a 5 cartas. Descubra combinações, supere crises e evolua sua estratégia.',runScore:0,comboChain:0,played:0,modifier,rerolls:0,wonStages:0,payout:null,playedCards:[],pendingPhase:null,bossRule:drawBossRule(0)};lastBurst=null;fill(8);render();beep(420,.09)}
function target(){return difficultyRules(solo.stage,solo.modifier.id,solo.bossRule).goal}
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
function rerollCost(){return 4+(solo?.rerolls||0)}

// The sound is tied to each actual counted card, not to the whole hand.
// Blocked suits and invalid hands never receive a positive counting chime.
function scoringFrames(playedCards,result,events=[]){
 const cards=result.invalidReason?[]:playedCards.filter(c=>c.suit!==result.blockedSuit);
 const cardFrames=cards.map((card,index)=>({kind:'card',cardIndex:playedCards.indexOf(card),
  name:'CARTA '+(index+1)+' / '+cards.length,
  detail:'VALOR '+card.rank+' · '+card.suit.toUpperCase()}));
 return [{kind:'combo',name:result.type,detail:'COMBINAÇÃO'},...cardFrames,...events,
  {kind:'total',name:'+'+fmt(result.score),detail:'PONTOS NA RODADA'}];
}
function animateScore(result,onDone){
 const zone=document.querySelector('#scorePerformance');
 const board=document.querySelector('.arcade-tabletop');
 if(!zone||!board){onDone?.();return}
 clearQueue();busy=true;board.classList.add('scoring');
 const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const duration=reduce?105:210;
 const startPoints=solo.score-result.score,goal=target();
 const events=result.events.map(e=>({kind:'effect',name:e.label,detail:e.chips!==0?(e.chips>0?'+':'')+fmt(e.chips)+' pontos base':e.factor!==1?'×'+e.factor.toFixed(2):e.mult!==0?(e.mult>0?'+':'')+e.mult.toFixed(2)+' MULT':'EFEITO'}));
 const frames=scoringFrames(solo.playedCards,result,events);
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
   board.querySelectorAll('.played-cards .playing-card').forEach((card,j)=>{
    card.classList.toggle('counting-card',frame.kind==='card'&&frame.cardIndex===j);
    card.classList.toggle('counted-card',frame.kind!=='combo'&&frames.slice(0,i+1).some(f=>f.kind==='card'&&f.cardIndex===j));
   });
   if(frame.kind==='card'){
    const count=frames.slice(0,i+1).filter(f=>f.kind==='card').length;
    beep(480+(count-1)*95,.11,'sine',.034);
   }else if(frame.kind==='effect')beep(690,.085,'triangle',.018);
   else if(frame.kind==='total')beep(930,.15,'triangle',.032);
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

function buy(id){if(solo.phase!=='shop')return;const j=solo.offer.find(x=>x.id===id);if(!j||solo.jokers.length>=5||solo.coins<j.price)return;solo.coins-=j.price;solo.jokers.push(j);solo.offer=solo.offer.filter(x=>x.id!==id);solo.message=(j.rarity==='legend'?'LENDÁRIO ADQUIRIDO: ':'CORINGA ADQUIRIDO: ')+j.name+'!';beep(j.rarity==='legend'?1047:730,.27,'triangle');render()}
function reroll(){const cost=rerollCost();if(!solo||solo.phase!=='shop'||solo.coins<cost)return;solo.coins-=cost;solo.rerolls++;solo.offer=offers(solo.jokers);solo.message='Ofertas renovadas por '+cost+' ecofichas. Próxima troca: '+rerollCost()+'.';render()}
function next(){if(solo.phase!=='shop')return;if(solo.stage===stages.length-1){solo.phase='won';solo.message='JORNADA CONCLUÍDA! Você venceu as sete crises ambientais.'}else{solo.stage++;solo.score=0;solo.modifier=rollDifficultyModifier(solo.stage);solo.bossRule=drawBossRule(solo.stage,solo.bossRule);const rules=difficultyRules(solo.stage,solo.modifier.id,solo.bossRule);solo.hands=rules.hands;solo.discards=rules.discards;solo.hand=[];solo.deck=makeDeck();solo.selected=[];solo.phase='play';solo.comboChain=0;solo.payout=null;solo.playedCards=[];lastBurst=null;fill(8);solo.message='NOVO DESAFIO: '+stages[solo.stage].title+'!'}beep(570,.18);render()}
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
 side.innerHTML='<div class="difficulty-label">NÍVEL DA CRISE <b>'+stage.tier+'</b></div><div class="arcade-sticky-score"><small>PLACAR DA RODADA</small><strong>'+fmt(shownScore)+' <span>/ '+fmt(goal)+'</span></strong><p>'+(remaining?'FALTAM <b>'+fmt(remaining)+'</b> PONTOS':'<b>META ATINGIDA ✓</b>')+'</p><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="'+goal+'" aria-valuenow="'+Math.min(goal,shownScore)+'"><div style="width:'+progress+'%"></div></div></div>'+
 '<div class="arcade-level"><span class="label">'+headline+' · '+stage.tier+'</span><b>'+esc(stage.title)+'</b><p>'+esc(stage.desc)+'</p><small>'+esc(stage.hint)+'</small></div>'+
 '<div class="arcade-modifier"><span class="label">CONDIÇÃO DO DESAFIO</span><b>'+esc(solo.modifier.name)+'</b><small>'+esc(solo.modifier.desc)+'</small></div>'+
 '<div class="arcade-counters"><span>Fichas <b>'+fmt(solo.coins)+' ✦</b></span><span>Juros previstos <b>+'+Math.min(5,Math.floor(solo.coins/5))+' ✦</b></span><span>Jogadas restantes <b>'+solo.hands+'</b></span><span>Descartes <b>'+solo.discards+'</b></span><span>Monte <b>'+solo.deck.length+' cartas</b></span></div>'+
 '<h3>Coringas <span>'+solo.jokers.length+'/5</span></h3><div class="jokers">'+(solo.jokers.length?solo.jokers.map(j=>'<div class="joker joker-rarity-'+j.rarity+'"><span class="rarity-ribbon">'+rarityLabel(j)+'</span>'+jokerArt(j)+'<b>'+esc(j.name)+'</b><small>'+esc(j.desc)+'</small>'+(solo.phase==='shop'?'<button class="sell-joker" data-sell="'+j.id+'">Vender +'+Math.max(1,Math.floor(j.price/2))+' ✦</button>':'')+'</div>').join(''):'<p class="hint">Aproveite a loja após superar uma crise.</p>')+'</div>'+
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
  area=ruleBrief+'<div class="arcade-shop"><span class="eyebrow">ENTRE CRISES / MERCADO CIRCULAR</span><h2>MONTE SUA ESTRATÉGIA.</h2><div class="shop-wallet"><strong>'+fmt(solo.coins)+' ✦</strong><span>EM CAIXA</span><span>Juros futuros: +'+Math.min(5,Math.floor(solo.coins/5))+' por crise<br>Guardar ou gastar? Você decide.</span></div><p class="hint">Até 5 coringas em jogo. Você pode vender um coringa por metade do preço.</p><div class="market">'+solo.offer.map(j=>'<div class="market-item rarity-card rarity-'+j.rarity+'"><div class="rarity-card-top"><span class="rarity-ribbon">'+rarityLabel(j)+'</span></div>'+jokerArt(j)+'<b>'+esc(j.name)+'</b><p>'+esc(j.desc)+'</p><button class="btn" data-buy="'+j.id+'" '+(solo.coins<j.price||solo.jokers.length>=5?'disabled':'')+'>COMPRAR · '+j.price+' ✦</button></div>').join('')+'</div><div class="actions shop-actions"><button class="btn secondary" id="rerollShop" '+(solo.coins<rerollCost()?'disabled':'')+'>NOVAS OFERTAS · '+rerollCost()+' ✦</button><button class="btn arcade-play" id="nextStage">'+(solo.stage===stages.length-1?'CONCLUIR JORNADA →':'PRÓXIMA CRISE →')+'</button></div></div>';
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
window.EcoCardSolo={combination,evaluate,offers,stages,jokers:upgradedJokers,MODIFIERS,rollModifier,payoutFor,rerollCost,difficultyRules,rollDifficultyModifier,BOSS_RULES,drawBossRule,bossInvalidReason,HAND_GUIDE,showHandGuide,scoringFrames,RARITY_INFO,jokerArt,jokerWeight};
})();