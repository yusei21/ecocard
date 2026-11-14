const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
scripts.forEach((code,i)=>new vm.Script(code,{filename:'index-inline-'+i+'.js'}));
const start=html.indexOf('const SUITS='),end=html.indexOf('function cardHTML(');
assert(start>=0&&end>start);
const ctx=vm.createContext({Math,console});
vm.runInContext(html.slice(start,end),ctx);
const cards=vm.runInContext('makeDeck()',ctx);
assert.equal(cards.length,65);
assert.equal(new Set(cards.map(c=>c.id)).size,65);
for(const suit of ['azul','vermelho','verde','amarelo','marrom']){
 const group=cards.filter(c=>c.suit===suit);
 assert.equal(group.length,13);
 assert.equal(group.map(c=>c.rank).sort((a,b)=>a-b).join(','),Array.from({length:13},(_,i)=>i+1).join(','));
}
assert.equal(vm.runInContext('cardRank(1)',ctx),'A');
assert.equal(vm.runInContext('cardRank(11)',ctx),'J');
assert.equal(vm.runInContext('cardRank(12)',ctx),'Q');
assert.equal(vm.runInContext('cardRank(13)',ctx),'K');
assert(html.includes('ifma-logo'));
assert(!html.includes('data-view="multi"'));
assert(!html.includes('peerjs.min.js'));
assert(!html.includes('function renderMulti()'));
console.log('✓ Single-player EcoCard: 65 unique cards, all A–K suits, no multiplayer mode');
