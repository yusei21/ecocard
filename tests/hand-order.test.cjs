const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{},console,setTimeout};vm.createContext(context);
vm.runInContext(fs.readFileSync('hand-order.js','utf8'),context);
const {move,ordered,drag}=context.window.EcoHandOrder;
const original=[{id:'azul-A'},{id:'verde-2'},{id:'marrom-K'},{id:'amarelo-Q'}];
const ids=cards=>Array.from(cards,c=>c.id).join(',');
assert.equal(ids(move(original,'azul-A','marrom-K')),'verde-2,marrom-K,azul-A,amarelo-Q');
assert.equal(ids(move(original,'marrom-K','azul-A')),'marrom-K,azul-A,verde-2,amarelo-Q');
assert.equal(ids(move(original,'azul-A','azul-A')),ids(original));
assert.equal(ids(move(original,'missing','azul-A')),ids(original));
assert.equal(ids(original),'azul-A,verde-2,marrom-K,amarelo-Q','input must not mutate');
assert.equal(ids(ordered(original,['amarelo-Q','verde-2'])),'amarelo-Q,verde-2,azul-A,marrom-K');
assert.equal(ids(ordered(original,[])),ids(original));
const index=fs.readFileSync('index.html','utf8'),solo=fs.readFileSync('solo-v2.js','utf8');
assert(index.includes('hand-order.js')&&index.includes('mobile-v5.css'));
assert(index.indexOf('hand-order.js')<index.indexOf('solo-v2.js'),'hand helper must load before solo module');
assert(!index.includes('id="multiOrderToggle"'),'removed multiplayer reorder button stays gone');
assert(solo.includes('id="handReorderToggle"'),'explicit hand organization button is available');
assert(solo.includes('function toggleReorder()'),'tap-to-reorder mode exists');
assert(solo.includes('reorderSource=id'),'first tap chooses the source card');
assert(solo.includes('moveSolo(reorderSource,id)'),'second tap moves source to target');
assert(solo.includes('keydown')&&solo.includes('ArrowLeft')&&solo.includes('ArrowRight'),'keyboard ordering also supported');
assert(!index.includes('moveMulti(from,to)')&&solo.includes('moveSolo(from,to)'));
assert(solo.includes('EcoHandOrder.drag'),'solo drag ordering must remain');

function mockCard(id){
 const listeners={},classes=new Set();
 const el={
  dataset:{card:id},disabled:false,draggable:false,
  addEventListener:(event,callback)=>{listeners[event]=callback},
  classList:{
   add:(name)=>classes.add(name),remove:(...names)=>names.forEach(name=>classes.delete(name)),
   toggle:(name,on)=>on?classes.add(name):classes.delete(name)
  },
  closest:selector=>selector==='[data-card]'?el:null,
  emit:(name,event={})=>{if(listeners[name])return listeners[name](event)},
  classes
 };
 return el;
}
const alpha=mockCard('azul-A'),beta=mockCard('verde-2'),gamma=mockCard('marrom-K');
const group=[alpha,beta,gamma];
let hit=beta;
const container={
 querySelectorAll:selector=>selector==='[data-card]'?group:[],
 ownerDocument:{elementFromPoint:()=>hit},
 contains:element=>group.includes(element)
};
const moved=[];
const handler=drag(container,(from,to)=>moved.push([from,to]),{isReorderMode:()=>false});
assert.equal(alpha.draggable,true,'desktop HTML drag is still available');
const transfer={effectAllowed:'',dropEffect:'',data:'',setData(type,x){this.data=x},getData(){return this.data}};
alpha.emit('dragstart',{dataTransfer:transfer});
gamma.emit('dragover',{preventDefault(){},dataTransfer:transfer});
gamma.emit('drop',{preventDefault(){},stopPropagation(){},dataTransfer:transfer});
assert.deepEqual(moved.pop(),['azul-A','marrom-K'],'desktop drag moves card');
assert.equal(alpha.classes.has('dragging'),false,'drag styles clear on drop');
alpha.emit('pointerdown',{pointerType:'touch',button:0,pointerId:4,clientX:12,clientY:25});
alpha.emit('pointermove',{pointerType:'touch',pointerId:4,clientX:68,clientY:29,cancelable:true,preventDefault(){}});
alpha.emit('pointerup',{pointerType:'touch',pointerId:4,clientX:68,clientY:29});
assert.deepEqual(moved.pop(),['azul-A','verde-2'],'touch pointer drop moves card');
assert.equal(handler.consumeClick(),true,'click generated from touch dragging is ignored');
assert.equal(handler.consumeClick(),false,'regular card taps still work');
const before=moved.length;
alpha.emit('pointerdown',{pointerType:'touch',button:0,pointerId:8,clientX:12,clientY:25});
alpha.emit('pointerup',{pointerType:'touch',pointerId:8,clientX:12,clientY:25});
assert.equal(moved.length,before,'normal tap does not reorder');
alpha.emit('pointerdown',{pointerType:'touch',button:0,pointerId:9,clientX:12,clientY:25});
alpha.emit('pointercancel',{pointerId:9});
assert.equal(alpha.classes.has('dragging'),false,'cancelled gestures clear');
handler.destroy();
console.log('Hand ordering: desktop drag, touch pointer drag, tap mode and keyboard controls passed');
