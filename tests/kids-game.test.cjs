const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('kids-game.js','utf8');
const window={};
vm.runInNewContext(source,{window,document:{querySelector:()=>null},console,Math},{filename:'kids-game.js'});
const kids=window.EcoKids;
assert(kids,'children mode should expose a playable API');
assert.equal(kids.CATEGORIES.length,5);
assert.equal(kids.ITEMS.length,40);
assert.equal(kids.LEVELS.length,5,'five progression levels');
assert.equal(kids.isFinalLevel(19),false,'level four still shows material names');
assert.equal(kids.isFinalLevel(20),true,'level five is color only');
assert.equal(kids.isFinalLevel(24),true,'last object remains color only');
const earlierBins=kids.binsHTML(19);
const finalBins=kids.binsHTML(20);
for(const c of kids.CATEGORIES){
 assert(earlierBins.includes('<strong>'+c.name+'</strong>'),'earlier levels show '+c.name);
 assert(!finalBins.includes('<strong>'+c.name+'</strong>'),'final level hides '+c.name);
 assert(finalBins.includes('data-bin="'+c.id+'"'),'color-only option retains correct category');
 assert(finalBins.includes('--bin:'+c.color),'color-only option retains '+c.id+' color');
}
assert(!finalBins.includes('Lixeira de '),'final level accessible names do not reveal materials');
assert(finalBins.includes('aria-label="Lixeira azul"'));
assert(finalBins.includes('aria-label="Lixeira vermelha"'));
assert(finalBins.includes('aria-label="Lixeira marrom"'));

assert.equal(kids.JOKES_CORRECT.length,5);
assert.equal(kids.JOKES_RETRY.length,5);
assert.equal(new Set(kids.ITEMS.map(x=>x.id)).size,40,'unique educational objects');
for(const cat of kids.CATEGORIES){
 assert.equal(kids.ITEMS.filter(item=>item.category===cat.id).length,8,'eight different items per category');
 assert(cat.color.startsWith('#'));
}
const round=kids.createRound(()=>.27);
assert.equal(round.length,25,'five levels of five objects');
assert.equal(new Set(round.map(item=>item.id)).size,25,'no repeated objects in the campaign');
for(let l=0;l<5;l++){
 const level=round.slice(l*5,l*5+5);
 assert.equal(new Set(level.map(item=>item.category)).size,5,'each level teaches the five categories');
}
assert.equal(Object.keys(kids.SHAPES).length,23,'expanded illustration collection');
for(const item of kids.ITEMS){
 assert(kids.SHAPES[item.shape],'illustration exists for '+item.name);
 assert(kids.illustration(item.shape).includes('<svg'));
 assert(kids.scoreAnswer(item,item.category).correct,'matching bin');
 assert.equal(kids.scoreAnswer(item,item.category).points,100);
 assert.equal(kids.scoreAnswer(item,kids.CATEGORIES.find(c=>c.id!==item.category).id).points,0,'wrong bin earns no points');
 assert(item.tip.length>=25,'positive explanation: '+item.id);
}
kids.newGame();
let state=kids.getState();
assert.equal(state.phase,'intro');
kids.begin();
state=kids.getState();
assert.equal(state.phase,'playing');
const wrong=kids.CATEGORIES.find(c=>c.id!==state.rounds[0].category).id;
assert.equal(kids.chooseBin(wrong),false,'wrong answer triggers retry');
assert.equal(state.phase,'feedback');
assert.equal(state.points,0);
assert.equal(state.index,0);
kids.continueGame();
assert.equal(state.phase,'playing');
assert.equal(state.index,0,'retry does not skip object');
for(let n=0;n<25;n++){
 const item=state.rounds[n];
 assert.equal(kids.chooseBin(item.category),true,'right bin accepts item '+n);
 assert.equal(state.phase,'feedback');
 kids.continueGame();
 if((n+1)%5===0&&n!==24){
  assert.equal(state.phase,'levelup','a level change is shown after five objects');
  assert.equal(state.levelsCompleted,(n+1)/5);
  kids.startNextLevel();
  assert.equal(state.phase,'playing');
 }
}
assert.equal(kids.binsHTML(24).includes('<strong>PLÁSTICO</strong>'),false,'final puzzle has no text labels');
assert.equal(state.phase,'complete','children can finish all levels');
assert.equal(state.correct,25);
assert.equal(state.levelsCompleted,5);
assert.equal(state.points,2500);
assert.equal(state.index,25);
assert.equal(kids.chooseBin('azul'),false,'no new submissions after finish');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('id="kidsMain"')&&html.includes('id="kidsSide"'));
assert(html.includes('data-view="kids"'),'children mode appears in menu');
assert(html.includes("if(id==='kids')window.EcoKids?.show()"),'navigation renders children mode');
assert(html.includes('kids-game.js?v=')&&html.includes('kids-game.css?v='));
assert(html.includes('data-view="solo"'),'main solo game remains playable');
assert(!html.includes('data-view="multi"'),'unwanted Trinca mode remains removed');
assert(source.includes('JOKES_CORRECT[')&&source.includes('JOKES_RETRY['),'different jokes appear after answers');
assert(source.includes('kids-levelup'),'inter-level celebration is displayed');
console.log('Missão Coleta: 40 possible objects, 25 per run, five progressive levels and retries passed');
