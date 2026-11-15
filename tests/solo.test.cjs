const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('solo-v2.js','utf8');
const storage={getItem:()=>null,setItem:()=>{}};
const sandbox={window:{},localStorage:storage,console,Math,setTimeout,document:{querySelector:()=>null},shuffle:a=>a,makeDeck:()=>[],solo:null,esc:s=>String(s),cardHTML:()=>'',startSolo:null,drawSolo:null,combo:null,scoreSolo:null,selectSolo:null,playSolo:null,targetSolo:null,makeOffers:null,buyJoker:null,nextSolo:null,renderSolo:null};
vm.runInNewContext(source,sandbox,{filename:'solo-v2.js'});
const {evaluate,combination,offers,stages,jokers}=sandbox.window.EcoCardSolo;
const make=(suit,rank)=>({suit,rank,id:suit+'-'+rank});
const flush=[1,2,3,4,5].map(n=>make('azul',n));
assert.equal(combination(flush).name,'Ciclo Completo','straight flush must beat ordinary flush');
assert.equal(combination([1,2,4,5,6].map(n=>make('azul',n))).name,'Triagem Perfeita');
assert.equal(combination(['azul','verde','vermelho'].map(s=>make(s,2))).name,'Reaproveitamento');
assert.equal(combination([make('azul',1),make('verde',1)]).name,'Materiais Equivalentes');
const set=[make('marrom',1),make('marrom',3),make('verde',5)];
const zero=evaluate(set,0,[]);
const one=evaluate(set,0,[jokers.find(j=>j.id==='reduzir')]);
const double=evaluate(set,0,[jokers.find(j=>j.id==='reduzir'),jokers.find(j=>j.id==='circular')]);
assert.equal(one.mult-zero.mult,9,'Reduzir adds 3 per card once');
assert.equal(double.mult-zero.mult,18,'Aventura Circular triggers other joker twice');
assert.equal(double.events.filter(e=>e.label==='Reduzir').length,2,'Coringa must appear exactly twice');
assert.equal(evaluate(set,0,[jokers.find(j=>j.id==='circular')]).score,zero.score,'Circular alone has no effect');
const {BOSS_RULES,drawBossRule,bossInvalidReason}=sandbox.window.EcoCardSolo;
const boss=id=>BOSS_RULES.find(x=>x.id===id);
assert.equal(BOSS_RULES.length,10);
assert(BOSS_RULES.some(r=>r.id==='double_hp'&&r.kind==='double_hp'));
assert.equal(drawBossRule(0),null,'first crisis has no restriction');
assert.equal(drawBossRule(1,null,()=>0).id,'ban_azul','random index must be deterministic under stub');
assert.notEqual(drawBossRule(2,boss('ban_azul'),()=>0).id,'ban_azul','no consecutive duplicate');
for(const suit of ['azul','vermelho','verde','amarelo','marrom']){
 const blocked=evaluate([make(suit,8)],1,[],null,boss('ban_'+suit));
 assert.equal(blocked.score,0,'boss must nullify '+suit);
 assert.equal(blocked.negated,1);
 assert.equal(evaluate([make(suit,13),make('marrom',8)],1,[],null,boss('ban_'+suit)).score,
    suit==='marrom'?0:evaluate([make('marrom',8)],1,[]).score);
}
const five=[1,2,3,4,5].map(n=>make('azul',n));
assert.equal(evaluate(five,4,[],null,boss('no_five')).score,0,'all five-card hands ignored');
assert(evaluate(five.slice(0,4),4,[],null,boss('no_five')).score>0,'four card hand permitted');
assert.equal(evaluate([make('azul',1),make('verde',2),make('marrom',3)],4,[],null,boss('only_color')).score,0);
assert(evaluate([make('azul',1),make('azul',2),make('azul',3)],4,[],null,boss('only_color')).score>0);
assert.equal(evaluate([make('azul',1),make('verde',2)],4,[],null,boss('only_equal')).score,0);
assert(evaluate([make('azul',1),make('verde',1)],4,[],null,boss('only_equal')).score>0);
assert.equal(evaluate([make('azul',1),make('azul',2)],4,[],null,boss('only_three')).score,0);
assert(evaluate([make('azul',1),make('azul',2),make('azul',3)],4,[],null,boss('only_three')).score>0);
assert.equal(stages.length,7);
assert.equal(new Set(jokers.map(j=>j.id)).size,jokers.length,'unique joker IDs');

const expectedRarities={common:16,uncommon:12,epic:8,legend:4};
assert.equal(jokers.length,40,'the game must contain exactly 40 jokers');
assert.equal(new Set(jokers.map(j=>j.id)).size,40,'all 40 joker IDs must be unique');
for(const [rarity,count] of Object.entries(expectedRarities)){
 assert.equal(jokers.filter(j=>j.rarity===rarity).length,count,'correct '+rarity+' distribution');
}
assert.equal(jokers.filter(j=>j.id==='circular').length,1,'Aventura Circular remains unique');
const {jokerWeight}=sandbox.window.EcoCardSolo;
assert(jokerWeight(jokers.find(j=>j.id==='circular'))<
 Math.min(...jokers.filter(j=>j.id!=='circular').map(jokerWeight)),
 'Aventura Circular is the rarest individual joker');
const hands={
 blue2:[make('azul',3),make('azul',4)],
 green2:[make('verde',3),make('verde',4)],
 yellow2:[make('amarelo',3),make('amarelo',4)],
 red2:[make('vermelho',3),make('vermelho',4)],
 brown2:[make('marrom',3),make('marrom',4)],
 blue3:[make('azul',3),make('azul',4),make('azul',5)],
 green3:[make('verde',3),make('verde',4),make('verde',5)],
 brown3:[make('marrom',3),make('marrom',4),make('marrom',5)],
 mixed3:[make('azul',3),make('verde',4),make('marrom',5)],
 mixed4:[make('azul',3),make('verde',4),make('marrom',5),make('amarelo',6)],
 pair:[make('azul',3),make('verde',3)],
 triple:[make('azul',3),make('verde',3),make('marrom',3)],
 single:[make('azul',3)],
 high:[make('azul',11)],
 flush:[make('azul',3),make('azul',4),make('azul',5),make('azul',7),make('azul',9)],
 straightflush:[make('azul',3),make('azul',4),make('azul',5),make('azul',6),make('azul',7)]
};
const triggerCases={
 papel_limpo:'blue2',vidro_retorno:'green2',metal_valor:'yellow2',
 plastico_responsavel:'red2',horta_urbana:'brown2',separacao:'blue3',
 diversidade:'mixed3',sequencia_curta:'mixed3',dupla_vida:'pair',
 coleta_rapida:'single',reparo:'high',papel_reciclado:'blue2',
 vidro_circular:'green2',metal_reuso:'yellow2',plastico_engenharia:'red2',
 biofertilizante:'brown2',coleta_integrada:'mixed3',triagem_inteligente:'triple',
 fluxo_devolucao:'mixed3',reuso_de_agua:'blue3',parque_solar:'yellow2',
 economia_azul:'blue3',carbono_positivo:'brown3',cidade_circular:'mixed4',
 laboratorio_verde:'green3',rede_regenerativa:'straightflush',
 planeta_vivo:'mixed4',renascimento:'flush',pacto_global:'triple'
};
assert.equal(Object.keys(triggerCases).length,29,'every newly added joker has a tested effect');
for(const [id,handName] of Object.entries(triggerCases)){
 const joker=jokers.find(j=>j.id===id);
 assert(joker,'joker exists: '+id);
 const cards=hands[handName];
 const baseline=evaluate(cards,0,[]);
 const powered=evaluate(cards,0,[joker]);
 assert(powered.score>baseline.score,id+' should improve a qualifying hand');
 assert(powered.events.some(e=>e.label===joker.name),id+' should disclose its scoring effect');
 const circular=evaluate(cards,0,[joker,jokers.find(j=>j.id==='circular')]);
 assert.equal(circular.events.filter(e=>e.label===joker.name).length,2,
  'Aventura Circular should activate '+id+' exactly twice');
}
const blockedRed=evaluate(hands.red2,1,[jokers.find(j=>j.id==='plastico_responsavel')],
 null,boss('ban_vermelho'));
assert.equal(blockedRed.score,0,'a negated category cannot trigger its joker');
assert.equal(blockedRed.events.some(e=>e.label==='Plástico Responsável'),false);
assert.equal(offers([]).length,3);

let seed=1234567;
const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const counts={common:0,uncommon:0,epic:0,legend:0};
let allCommon=0;
for(let iteration=0;iteration<12000;iteration++){
 const store=offers([],rng);
 if(store.every(j=>j.rarity==='common'))allCommon++;
 assert.equal(new Set(store.map(j=>j.id)).size,store.length,'store must not duplicate joker');
 for(const card of store)counts[card.rarity]++;
}
assert.equal(allCommon,0,'a full store must not be exclusively common when upgrades exist');
assert(counts.uncommon>counts.common*.55,'rare offers must be noticeably more frequent');
assert(counts.epic>1000,'epic offers must occur regularly');
assert(counts.legend<counts.epic*.05,'legendary stays vastly rarer than epic');
const noUpgrades=offers(jokers.filter(j=>j.rarity!=='common'),rng);
assert(noUpgrades.every(j=>j.rarity==='common'),'common-only fallback must remain possible after upgrades are owned');

assert.throws(()=>evaluate([],0,[]));
assert.throws(()=>evaluate(Array(6).fill(make('azul',1)),0,[]));
const {payoutFor,rerollCost}=sandbox.window.EcoCardSolo;
assert.deepEqual(JSON.parse(JSON.stringify(payoutFor({stage:0,hands:2,coins:15}))),{base:3,saved:2,interest:3,total:8});
assert.deepEqual(JSON.parse(JSON.stringify(payoutFor({stage:6,hands:0,coins:60}))),{base:9,saved:0,interest:5,total:14});
sandbox.solo={rerolls:0};
assert.equal(rerollCost(),4);
sandbox.solo={rerolls:3};
assert.equal(rerollCost(),7);
const {difficultyRules,rollDifficultyModifier}=sandbox.window.EcoCardSolo;
assert.equal(stages.length,7);
assert.equal(stages.map(s=>s.tier).join(','),'FÁCIL,MÉDIO,MÉDIO,DIFÍCIL,DIFÍCIL,EXTREMO,FINAL');
assert.equal(stages.map(s=>s.goal).join(','),'850,2200,4000,7600,12000,18500,150000');
const goals=stages.map((_,stage)=>difficultyRules(stage).goal);
assert.equal(goals.join(','),'850,2200,4000,7600,12000,18500,150000');
assert(goals.every((v,i)=>i===0||v>goals[i-1]),'difficulty increases by crisis');
assert.equal(difficultyRules(0).hands,5,'first crisis is introductory');
assert.equal(difficultyRules(6).hands,3,'last crisis limits plays');
assert.equal(difficultyRules(3,'short').hands,3,'shortage subtracts one from that crisis only');
assert.equal(difficultyRules(6).goal,150000,'final boss has more than 100k');
assert.equal(difficultyRules(6,'normal',boss('double_hp')).goal,300000);
assert.equal(difficultyRules(2,'normal',boss('double_hp')).goal,8000);
assert.equal(difficultyRules(2).goal,4000);
assert.equal(rollDifficultyModifier(0).id,'normal','first crisis has no random extra penalty');
assert.equal(difficultyRules(0).discards,2);
const {CAMPAIGNS,campaignRules,selectCampaign}=sandbox.window.EcoCardSolo;
assert.equal(CAMPAIGNS.length,4,'four sequential difficulty campaigns');
assert.equal(CAMPAIGNS.map(c=>c.name).join(','),'FÁCIL,MÉDIO,DIFÍCIL,EXTREMO');
assert.equal(typeof selectCampaign,'function');
for(let phase=0;phase<4;phase++){
 const goals=stages.map((_,stage)=>campaignRules(phase,stage).goal);
 assert(goals.every((value,i)=>i===0||value>goals[i-1]),'goals increase inside campaign '+phase);
 assert(goals.length===7,'each campaign contains seven crises');
}
for(let stage=0;stage<7;stage++){
 const goals=CAMPAIGNS.map((_,c)=>campaignRules(c,stage).goal);
 assert(goals.every((value,i)=>i===0||value>goals[i-1]),'later campaigns harder at stage '+stage);
}
assert.equal(campaignRules(0,6).goal,54000,'easy has its own attainable seventh crisis');
assert.equal(campaignRules(1,6).goal,97500,'medium has its own seventh crisis');
assert.equal(campaignRules(2,6).goal,150000,'hard retains original seventh-crisis goal');
assert.equal(campaignRules(3,6).goal,240000,'extreme final crisis is hardest');
assert.equal(campaignRules(0,6,'normal',boss('double_hp')).goal,108000,'double-life boss applies after campaign scaling');
assert.equal(campaignRules(0,0).hands,6);
assert.equal(campaignRules(3,0).hands,4);
assert.equal(campaignRules(0,0).discards,3);
assert.equal(campaignRules(3,0).discards,1);
assert(source.includes('unlockedCampaign=Math.max'),'victory unlocks next campaign');
assert(source.includes('start(solo.campaign+1)'),'victory button starts next campaign');

sandbox.solo={rerolls:0};
assert.equal(rerollCost(),4);
const climateCards=[make('azul',10),make('verde',11),make('amarelo',12)];
const climatePenalty=evaluate(climateCards,6,[]);
const climateBase=evaluate(climateCards,5,[]);
assert(climatePenalty.mult<climateBase.mult,'climate boss penalizes hands without organics');
const compostCards=[make('marrom',10),make('marrom',11),make('marrom',12)];
assert(evaluate(compostCards,6,[]).base>evaluate(compostCards,5,[]).base,'composting counters final crisis');
const {HAND_GUIDE}=sandbox.window.EcoCardSolo;
assert.equal(HAND_GUIDE.length,7,'tutorial covers seven playable hand examples');
assert(HAND_GUIDE.some(h=>h.name==='Ciclo Completo'));
assert(HAND_GUIDE.some(h=>h.name==='Materiais Equivalentes'));
assert(HAND_GUIDE.some(h=>h.name==='Fluxo Circular'));
assert.equal(bossInvalidReason([make('azul',1)],boss('double_hp')),null,'double HP never annuls a hand');
const {scoringFrames}=sandbox.window.EcoCardSolo;
const cardsToCount=[make('azul',3),make('verde',4),make('marrom',5)];
const validResult=evaluate(cardsToCount,0,[]);
const soundFrames=scoringFrames(cardsToCount,validResult);
assert.equal(soundFrames.filter(x=>x.kind==='card').length,3,'each counted card gets its own scoring frame');
assert.equal(soundFrames.filter(x=>x.kind==='card').map(x=>x.cardIndex).join(','),'0,1,2');
const blockedResult=evaluate(cardsToCount,2,[],null,boss('ban_verde'));
assert.equal(scoringFrames(cardsToCount,blockedResult).filter(x=>x.kind==='card').length,2,'boss-negated cards have no scoring sound');
const nulledResult=evaluate(cardsToCount,2,[],null,boss('only_equal'));
assert.equal(nulledResult.score,0);
assert.equal(scoringFrames(cardsToCount,nulledResult).filter(x=>x.kind==='card').length,0,'invalid hand has no counted cards');
const {RARITY_INFO,jokerArt}=sandbox.window.EcoCardSolo;
assert.equal(RARITY_INFO.common.label,'COMUM');
assert.equal(RARITY_INFO.uncommon.label,'RARO');
assert.equal(RARITY_INFO.epic.label,'ÉPICO');
assert.equal(RARITY_INFO.legend.label,'LENDÁRIO');
assert(jokers.some(j=>j.rarity==='epic'),'epic cards must exist in game');
assert(jokers.some(j=>j.id==='biomas'&&j.rarity==='epic'));
assert(jokers.some(j=>j.id==='usina'&&j.rarity==='epic'));
assert(!source.includes("RARITY_INFO[j.rarity].tier"),'numeric rarity suffix must be removed');
const trio=[make('azul',3),make('verde',4),make('marrom',5)];
const epicResult=evaluate(trio,0,[jokers.find(j=>j.id==='biomas')]);
assert(epicResult.events.some(e=>e.label==='Aliança dos Biomas'),'epic multiplier activates');
const triple=[make('azul',3),make('verde',3),make('marrom',3)];
assert(evaluate(triple,0,[jokers.find(j=>j.id==='usina')]).events.some(e=>e.label==='Usina Circular'),'epic chip bonus activates');
const circularEpic=evaluate(trio,0,[jokers.find(j=>j.id==='biomas'),jokers.find(j=>j.id==='circular')]);
assert.equal(circularEpic.events.filter(e=>e.label==='Aliança dos Biomas').length,2,'legendary retriggers epic');

for(const j of jokers){
 const art=jokerArt(j);
 assert(art.includes('<svg')&&art.includes('</svg>'),'vector art for '+j.id);
 assert(!/\p{Extended_Pictographic}/u.test(art),'no emoji icon for '+j.id);
}
assert(source.includes('rarity-card rarity-'),'store uses visible rarity cards');
assert(source.includes('joker-rarity-'),'equipped joker retains rarity frame');
const victorySource=fs.readFileSync('victory-share.js','utf8');
const victorySandbox={window:{},console};
vm.runInNewContext(victorySource,victorySandbox,{filename:'victory-share.js'});
const victory=victorySandbox.window.EcoVictory;
const victoryState={phase:'won',campaign:1,runScore:234567,played:19,wonStages:7};
assert.equal(victory.text(victoryState),'','share text is unavailable before Extreme');
assert.equal(victory.card(victoryState),'','certificate is unavailable for Medium');
const ultimate={...victoryState,campaign:3,wonStages:7};
const shared=victory.text(ultimate);
assert(shared.includes('EXTREMO'),'share shows final difficulty');
assert(shared.includes('234.567'),'share shows formatted points');
assert(shared.includes('28 de 28'),'share requires all four campaigns');
assert(shared.includes('https://yusei21.github.io/ecocard/'),'share includes game URL');
assert(victory.card(ultimate).includes('id="shareVictory"'),'victory contains share button');
assert(victory.card(ultimate).includes('id="saveVictory"'),'victory contains PNG action');
assert(victory.card(ultimate).includes('id="copyVictory"'),'victory contains copy action');
assert(source.includes('window.EcoVictory.card(solo)'),'win screen renders victory certificate');
assert(source.includes('window.EcoVictory?.attach(main,solo)'),'win screen connects share actions');
const {EVOLUTION_RULES,evolutionCount,advanceEvolutions,growthSummary}=sandbox.window.EcoCardSolo;
assert.equal(Object.keys(EVOLUTION_RULES).length,7,'seven evolutive jokers');
const evolvingBase=jokers.find(j=>j.id==='papel_limpo');
const evolving={...evolvingBase,growth:0};
const evolutionaryCards=[make('azul',4),make('azul',5)];
const first=evaluate(evolutionaryCards,0,[evolving]);
assert.equal(evolutionCount(evolving),0,'preview cannot change evolution');
assert.equal(advanceEvolutions([evolving],first).length,1,'one evolution per scored hand');
assert.equal(evolutionCount(evolving),1);
assert(evaluate(evolutionaryCards,0,[evolving]).score>first.score,'growth increases actual points');
const repeatEvolving={...evolvingBase,growth:0};
const circularJoker=jokers.find(j=>j.id==='circular');
const repeated=evaluate(evolutionaryCards,0,[repeatEvolving,circularJoker]);
assert.equal(repeated.events.filter(e=>e.label===evolvingBase.name).length,2,'Circular repeats growing joker');
advanceEvolutions([repeatEvolving,circularJoker],repeated);
assert.equal(repeatEvolving.growth,1,'double trigger still grows once per hand');
for(let i=0;i<20;i++)advanceEvolutions([repeatEvolving],first);
assert.equal(repeatEvolving.growth,8,'growth is capped');
assert.equal(advanceEvolutions([repeatEvolving],first).length,0,'capped growth stops');
const zeroEvolution={...evolvingBase,growth:0};
advanceEvolutions([zeroEvolution],evaluate([make('verde',5)],0,[zeroEvolution]));
assert.equal(zeroEvolution.growth,0,'no growth when condition does not trigger');
advanceEvolutions([zeroEvolution],{score:0,events:[{label:evolvingBase.name}]});
assert.equal(zeroEvolution.growth,0,'no growth from canceled hand');
assert(growthSummary(evolving).includes('EVOLUTIVO · 1/8'),'growth should be visible on equipped cards');
for(const id of Object.keys(EVOLUTION_RULES)){
 assert(jokers.some(j=>j.id===id),'growth rule must refer to existing joker '+id);
}
assert(source.includes("solo.campaign===CAMPAIGNS.length-1&&window.EcoVictory"),'certificate only on Extreme victory');
assert(source.includes("solo.campaign===CAMPAIGNS.length-1)window.EcoVictory"),'share actions only on Extreme victory');
const indexHtml=require('node:fs').readFileSync('index.html','utf8');
assert(indexHtml.includes('victory-share.js?v='),'victory share feature must load');

assert(indexHtml.includes('id="helpEcoCard"'),'Como jogar button must be visible');
assert(indexHtml.includes('window.EcoCardSolo.showHandGuide()'),'solo route must launch guide explicitly');
assert(/solo-v2\.js\?v=/.test(indexHtml),'script must have cache-busting version');
assert.equal(typeof sandbox.window.EcoCardSolo.showHandGuide,'function','tutorial must be publicly accessible');
console.log('✓ Seven stages, 150k finale, double boss HP and tutorial routing tests passed');
