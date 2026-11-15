const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('kids-game.js','utf8');
const window={};
vm.runInNewContext(source,{window,document:{querySelector:()=>null},console,Math},{filename:'kids-game.js'});
const kids=window.EcoKids;
assert(kids,'children mode should expose a playable API');
assert.equal(kids.CATEGORIES.length,5);
assert.equal(kids.ITEMS.length,25);
assert.equal(new Set(kids.ITEMS.map(x=>x.id)).size,25,'unique educational objects');
for(const cat of kids.CATEGORIES){
 assert.equal(kids.ITEMS.filter(item=>item.category===cat.id).length,5,'five items per category');
 assert(cat.color.startsWith('#'));
}
const round=kids.createRound(()=>.27);
assert.equal(round.length,15,'three levels of five objects');
assert.equal(new Set(round.map(item=>item.id)).size,15,'no repeated objects in the campaign');
for(let l=0;l<3;l++){
 const level=round.slice(l*5,l*5+5);
 assert.equal(new Set(level.map(item=>item.category)).size,5,'each level teaches the five categories');
}
assert.deepEqual(Object.keys(kids.SHAPES).sort(),['bag','bottle','box','can','cap','cup','glass','jar','leaf','pan','paper'].sort());
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
for(let n=0;n<15;n++){
 const item=state.rounds[n];
 assert.equal(kids.chooseBin(item.category),true,'right bin accepts item '+n);
 assert.equal(state.phase,'feedback');
 kids.continueGame();
}
assert.equal(state.phase,'complete','children can finish all levels');
assert.equal(state.correct,15);
assert.equal(state.points,1500);
assert.equal(state.index,15);
assert.equal(kids.chooseBin('azul'),false,'no new submissions after finish');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('id="kidsMain"')&&html.includes('id="kidsSide"'));
assert(html.includes('data-view="kids"'),'children mode appears in menu');
assert(html.includes("if(id==='kids')window.EcoKids?.show()"),'navigation renders children mode');
assert(html.includes('kids-game.js?v=')&&html.includes('kids-game.css?v='));
assert(html.includes('data-view="solo"'),'main solo game remains playable');
assert(!html.includes('data-view="multi"'),'unwanted Trinca mode remains removed');
console.log('✓ Missão Coleta: five bins, fifteen unique objects, retry and completion passed');
