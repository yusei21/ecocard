const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('kids-game.js','utf8');
const window={};
vm.runInNewContext(source,{window,document:{querySelector:()=>null},console,Math},{filename:'kids-game.js'});
const kids=window.EcoKids;
assert(kids,'children mode exposes playable logic');
assert.equal(kids.CATEGORIES.length,5);
assert.equal(kids.ITEMS.length,40,'keep complete object catalog');
assert.equal(kids.LEVELS.length,2,'two short five-question stages');
assert.equal(new Set(kids.ITEMS.map(x=>x.id)).size,40);
assert.equal(kids.JOKES_CORRECT.length,5);
assert.equal(kids.JOKES_RETRY.length,5);
assert.equal(kids.isFinalLevel(0),true,'only colors from first question');
assert.equal(kids.isFinalLevel(9),true,'only colors through the last question');
const bins=kids.binsHTML();
for(const cat of kids.CATEGORIES){
 assert.equal(kids.ITEMS.filter(x=>x.category===cat.id).length,8,'eight objects per category');
 assert(bins.includes('data-bin="'+cat.id+'"'),'bin for '+cat.id);
 assert(bins.includes('--bin:'+cat.color),'preserve color '+cat.id);
 assert(!bins.includes('<strong>'+cat.name+'</strong>'),'hide material names on every bin');
}
assert(!bins.includes('Lixeira de '),'accessibility labels announce colors, not materials');
assert(bins.includes('aria-label="Lixeira azul"'));
assert(bins.includes('aria-label="Lixeira vermelha"'));
assert(bins.includes('aria-label="Lixeira marrom"'));
assert(!bins.includes('kids-bin-mark'),'no text/symbol inside color-only bins');
assert.equal(Object.keys(kids.SHAPES).length,23,'retain object illustrations');
const advanced=new Set(kids.CATEGORIES.flatMap(cat=>kids.ITEMS.filter(x=>x.category===cat.id).slice(5).map(x=>x.id)));
for(const rng of [()=>.03,()=>.27,()=>.88]){
 const round=kids.createRound(rng);
 assert.equal(round.length,10,'ten questions per run');
 assert.equal(new Set(round.map(x=>x.id)).size,10,'objects never repeat');
 assert(round.every(item=>advanced.has(item.id)),'choose only advanced objects');
 for(let i=0;i<2;i++){
  assert.equal(new Set(round.slice(i*5,i*5+5).map(x=>x.category)).size,5,'each stage covers all five categories');
 }
 for(const cat of kids.CATEGORIES)assert.equal(round.filter(item=>item.category===cat.id).length,2,'two hard questions per category');
}
for(const item of kids.ITEMS){
 assert(kids.SHAPES[item.shape],'illustration exists: '+item.name);
 assert(kids.illustration(item.shape).includes('<svg'));
 assert.equal(kids.scoreAnswer(item,item.category).points,100);
 assert.equal(kids.scoreAnswer(item,kids.CATEGORIES.find(c=>c.id!==item.category).id).points,0);
 assert(item.tip.length>=25,'explanatory feedback exists: '+item.id);
}
kids.newGame();
const game=kids.getState();
assert.equal(game.phase,'intro');
kids.begin();
assert.equal(game.phase,'playing');
const wrong=kids.CATEGORIES.find(c=>c.id!==game.rounds[0].category).id;
assert.equal(kids.chooseBin(wrong),false);
assert.equal(game.points,0);
assert.equal(game.index,0);
assert.equal(game.phase,'feedback');
kids.continueGame();
assert.equal(game.phase,'playing');
assert.equal(game.index,0,'wrong answer allows retry without skipping');
for(let i=0;i<10;i++){
 assert.equal(kids.chooseBin(game.rounds[i].category),true,'correct answer '+i);
 assert.equal(game.phase,'feedback');
 kids.continueGame();
 if(i===4){
  assert.equal(game.phase,'levelup','stage transition after five questions');
  assert.equal(game.levelsCompleted,1);
  kids.startNextLevel();
  assert.equal(game.phase,'playing');
 }
}
assert.equal(game.phase,'complete');
assert.equal(game.correct,10);
assert.equal(game.points,1000);
assert.equal(game.index,10);
assert.equal(game.levelsCompleted,2);
assert.equal(kids.chooseBin('azul'),false,'cannot score after completion');
assert(source.includes('10 perguntas')&&source.includes('10/10'),'intro and finish counts updated');
assert(!source.includes('kids-legend'),'game never displays the answer key');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('id="kidsMain"')&&html.includes('id="kidsSide"'));
assert(html.includes('data-view="kids"')&&html.includes('data-view="solo"'));
assert(html.includes('kids-game.js?v=')&&html.includes('kids-game.css?v='));
assert(!html.includes('data-view="multi"'));
console.log('Missão Coleta: 10 hard questions, two stages, color-only bins and retries passed');
