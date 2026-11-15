const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('joker-feedback.js','utf8'),window={};
vm.runInNewContext(src,{window},{filename:'joker-feedback.js'});
const {preview,relatedCards,highlightedCardIds}=window.EcoJokerFeedback;
const jokers=[
 {id:'papel_limpo',name:'Papel Recuperado',rarity:'common'},
 {id:'reduzir',name:'Reduzir',rarity:'common'},
 {id:'metal_valor',name:'Valor do Metal',rarity:'common'},
 {id:'circular',name:'Aventura Circular',rarity:'legend'}
];
const cards=[
 {id:'a',suit:'azul',rank:2},
 {id:'b',suit:'verde',rank:4},
 {id:'c',suit:'amarelo',rank:12}
];
const result={score:455,events:[
 {label:'Papel Recuperado',chips:18,factor:1,mult:0},
 {label:'Papel Recuperado',chips:18,factor:1,mult:0},
 {label:'Reduzir',chips:0,factor:1,mult:9}
]};
const statuses=preview(jokers,result,true);
assert.equal(statuses.length,4);
assert.equal(statuses[0].count,2,'double activation appears as two hits');
assert.equal(statuses[0].message,'ATIVA 2X');
assert.equal(statuses[1].count,1);
assert.equal(statuses[2].active,false,'unused joker does not glow');
assert.equal(statuses[2].message,'AGUARDANDO COMBO');
assert.equal(statuses[3].message,'ATIVA 2X','Circular lights up when another joker triggers');
assert.equal(preview(jokers,null,false)[0].message,'SELECIONE CARTAS');
const blocked=preview(jokers,{score:0,invalidReason:'Mão anulada',events:[{label:'Papel Recuperado'}]},true);
assert(blocked.every(s=>!s.active),'boss-nullified hand does not activate jokers');
assert.equal(blocked[0].message,'MÃO ANULADA');
assert.equal(preview([jokers[3]],{score:100,events:[]},true)[0].active,false,'Circular alone is inert');
assert.deepEqual(Array.from(relatedCards(cards,jokers[0])),['a'],'paper boost connects paper cards');
assert.deepEqual(Array.from(relatedCards(cards,jokers[2])),['c'],'metal boost connects metal cards');
assert.deepEqual(Array.from(relatedCards(cards,{id:'retorno_embalagens'})),['a','b','c'],'even ranks are correctly associated');
assert.deepEqual(Array.from(relatedCards(cards,{id:'reparo'})),['c'],'high value bonus targets rank 10 and above');
const linked=highlightedCardIds(cards,jokers,statuses);
assert.deepEqual([...linked].sort(),['a','b','c'],'global Reduzir effect highlights all valid selected cards');
const onlyPaper=highlightedCardIds(cards,[jokers[0]],[statuses[0]]);
assert.deepEqual([...onlyPaper],['a'],'specific card bonus highlights only contributing cards');
assert.equal(highlightedCardIds(cards,[jokers[0]],[{active:false}]).size,0);
const solo=fs.readFileSync('solo-v2.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert(solo.includes("const jokerStatuses=window.EcoJokerFeedback?.preview("),'game uses exact scoring preview');
assert(solo.includes('highlightedCardIds(selected,solo.jokers,jokerStatuses)'),'selected cards receive live affinity');
assert(solo.includes("card.classList.toggle('joker-boost-card'"),'scoring visually links joker and affected cards');
assert(solo.includes("slot.classList.toggle('joker-triggering'"),'joker triggers animate per scoring event');
assert(html.includes('joker-feedback.js?v=')&&html.includes('joker-interaction-v1.css?v='));
assert(html.indexOf('joker-feedback.js?v=')<html.indexOf('solo-v2.js?v='),'load helper before scoring engine');
console.log('Joker synergy: exact activation, Circular repeats, blocked hands and animated card links passed');
