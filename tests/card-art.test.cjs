const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const art=fs.readFileSync('card-art.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const window={};
vm.runInNewContext(art,{window},{filename:'card-art.js'});
const images=window.EcoCardArt;
assert(images,'card illustration library exists');
assert.equal(Object.keys(images.ART_BY_SUIT).length,5);
const shapes=new Set();
let total=0;
for(const [suit,items] of Object.entries(images.ART_BY_SUIT)){
 assert.equal(items.length,13,suit+' provides art for all thirteen ranks');
 for(let rank=1;rank<=13;rank++){
  const shape=items[rank-1];
  assert(images.PATHS[shape],suit+' rank '+rank+' refers to a supported drawing');
  const markup=images.drawing({suit,rank});
  assert(markup.includes('<svg')&&markup.includes('</svg>'),'real SVG drawing for '+suit+' '+rank);
  assert(markup.includes('<path'),'object illustration contains geometry');
  assert(markup.includes('aria-hidden="true"'),'decorative art leaves accessibility label intact');
  shapes.add(shape);
  total++;
 }
}
assert.equal(total,65);
assert(shapes.size>=20,'the cards should use a diverse library of distinct objects');
assert(html.includes('card-art.js?v='),'art loads before gameplay');
assert(html.indexOf('card-art.js?v=')<html.indexOf('function cardHTML('));
const start=html.indexOf('function cardHTML(');
const end=html.indexOf('const jHTML=',start);
assert(start>=0&&end>start,'playing card component present');
const fn=html.slice(start,end);
const context={window,cardRank:(n)=>String(n),suit:()=>({color:'#77aacc',label:'Papel'}),esc:(x)=>String(x)};
const card=vm.runInNewContext(fn+'cardHTML({id:"azul-1-1",suit:"azul",rank:1,name:"Jornal"},false,false)',context);
assert(card.includes('card-illustration'),'playing card embeds the object image');
assert(card.includes('Jornal'),'name preserved for reading and assistive technology');
assert(card.includes('valor 1'),'value preserved in accessible label');
assert(card.includes('Papel'),'category label is still visible');
assert(!card.includes('class="symbol">▤'),'category symbol no longer replaces the image');
function scan(folder){
 for(const item of fs.readdirSync(folder,{withFileTypes:true})){
  if(item.name==='.git'||item.name==='node_modules')continue;
  const file=path.join(folder,item.name);
  if(item.isDirectory())scan(file);
  else if(/\.(js|cjs|css|html|md|yml|yaml|json)$/i.test(item.name)){
   const contents=fs.readFileSync(file,'utf8');
   const emojis=contents.match(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F]/gu);
   assert.equal(emojis,null,'no emoji allowed in '+file);
  }
 }
}
scan('.');
console.log('✓ 65 card illustrations, more than 20 silhouettes, accessible labels and emoji-free source files');
