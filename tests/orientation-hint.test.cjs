const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync('orientation-hint.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('tabletop-v1.css','utf8');
const solo=fs.readFileSync('solo-v2.js','utf8');

const flags=new Set();
const classes={add:x=>flags.add(x),remove:x=>flags.delete(x),toggle:(x,v)=>v?flags.add(x):flags.delete(x)};
let onClick=null,orientation=null;
const button={tabIndex:-1,addEventListener:(type,cb)=>{if(type==='click')onClick=cb}};
const container={classList:classes,setAttribute:(name,value)=>{container[name]=value},querySelector:selector=>selector==='#soloRotateContinue'?button:null};
const document={readyState:'complete',querySelector:selector=>selector==='#soloRotateHint'?container:null};
const store={};
const window={
 sessionStorage:{getItem:key=>store[key]||null,setItem:(key,value)=>{store[key]=value}},
 addEventListener:(name,fn)=>{if(name==='orientationchange')orientation=fn}
};
vm.runInNewContext(source,{window,document},{filename:'orientation-hint.js'});
assert.equal(typeof window.EcoOrientation.sync,'function');
assert.equal(typeof window.EcoOrientation.dismiss,'function');
assert.equal(typeof onClick,'function','user can dismiss rotation prompt');
assert.equal(typeof orientation,'function','orientation changes are supported');
window.EcoOrientation.sync(false);
assert.equal(flags.has('is-active'),false,'no prompt on tutorial, shop or victory');
window.EcoOrientation.sync(true);
assert.equal(flags.has('is-active'),true,'prompt is armed during active gameplay');
assert.equal(container['aria-hidden'],'false');
assert.equal(button.tabIndex,0);
window.EcoOrientation.sync(false);
assert.equal(flags.has('is-active'),false,'prompt deactivates after gameplay');
window.EcoOrientation.sync(true);
onClick();
assert.equal(flags.has('is-active'),false,'continuing in portrait dismisses prompt');
assert.equal(store['ecocard-landscape-hint-dismissed-v1'],'1','dismissal survives reload in same tab');
window.EcoOrientation.sync(true);
assert.equal(flags.has('is-active'),false,'do not interrupt gameplay repeatedly');

assert(html.includes('id="soloRotateHint"'),'prompt markup');
assert(html.includes('id="soloRotateContinue"'),'optional continue button');
assert(html.includes('Vire seu aparelho para a horizontal'),'clear instructions');
assert(html.includes('orientation-hint.js?v='),'load helper before solo game');
assert(html.indexOf('orientation-hint.js?v=')<html.indexOf('solo-v2.js?v='),'correct loading order');
assert(html.includes('tabletop-v1.css?v='),'reference-inspired UI styles load');
assert(solo.includes("window.EcoOrientation?.sync(solo.phase==='play'||solo.phase==='scoring')"),'prompt only while playing or scoring');
assert(solo.includes('class="table-joker-rail"'),'jokers appear above scoring table');
assert(solo.includes('balatro-table'),'tabletop view applied');
assert(solo.includes('--fan-tilt:'),'cards receive positional fan angles');
assert(css.includes('(orientation:landscape)')&&css.includes('(max-height:600px)'),'mobile landscape mode exists');
assert(css.includes('overflow-x:hidden'),'landscape hand does not need horizontal scrolling');
assert(css.includes('repeat(5,minmax(0,1fr))'),'five joker slots across');
assert(css.includes('repeat(5,minmax(0,1fr))'),'joker slots stay together');
assert(css.includes('prefers-reduced-motion'),'movement settings respected');
console.log('Landscape guidance, tabletop and full-hand rules passed');
