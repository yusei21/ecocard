/* Missão Coleta — jogo infantil de separação ambiental.
 * Independente do Salve o Mundo, sem contas, sem cronômetro e com toque/teclado.
 */
(function(root){
'use strict';
const CATEGORIES=[
 {id:'azul',name:'PAPEL',color:'#74b8fa',accent:'#e0efff',desc:'Papel limpo e seco'},
 {id:'vermelho',name:'PLÁSTICO',color:'#f47f7e',accent:'#ffe2e0',desc:'Embalagens plásticas limpas'},
 {id:'verde',name:'VIDRO',color:'#73cea0',accent:'#e1fbea',desc:'Frascos e garrafas de vidro'},
 {id:'amarelo',name:'METAL',color:'#eec35c',accent:'#fff4c8',desc:'Latas e peças metálicas limpas'},
 {id:'marrom',name:'ORGÂNICOS',color:'#c9a17c',accent:'#fff0df',desc:'Restos de alimentos vegetais'}
];
const ITEMS=[
 {id:'jornal',name:'Jornal',category:'azul',shape:'paper',tip:'O jornal limpo e seco pode ser reciclado com papel.'},
 {id:'caderno',name:'Folhas de caderno',category:'azul',shape:'paper',tip:'Folhas de papel limpas vão no recipiente de papel.'},
 {id:'caixa',name:'Caixa de papelão',category:'azul',shape:'box',tip:'Achate a caixa limpa para ocupar menos espaço.'},
 {id:'revista',name:'Revista',category:'azul',shape:'paper',tip:'Revistas e folhas de papel têm lugar na coleta de papel.'},
 {id:'papel_kraft',name:'Saco de papel limpo',category:'azul',shape:'paper',tip:'Sacos de papel limpos e secos podem ser separados para reciclagem.'},
 {id:'pet',name:'Garrafa PET',category:'vermelho',shape:'bottle',tip:'Garrafa PET é plástico: retire os restos de bebida.'},
 {id:'tampa',name:'Tampa plástica',category:'vermelho',shape:'cap',tip:'Tampas plásticas limpas podem ir com os plásticos, conforme a coleta local.'},
 {id:'pote',name:'Pote de iogurte limpo',category:'vermelho',shape:'cup',tip:'Potes de plástico limpos podem ir para a reciclagem.'},
 {id:'frasco',name:'Frasco de detergente vazio',category:'vermelho',shape:'bottle',tip:'Frascos plásticos vazios são separados como plástico.'},
 {id:'sacola',name:'Sacola plástica limpa',category:'vermelho',shape:'bag',tip:'Sacolas limpas podem ser aceitas em pontos de coleta apropriados.'},
 {id:'garrafa_vidro',name:'Garrafa de vidro',category:'verde',shape:'glass',tip:'Vidro vai no recipiente verde. Tome cuidado com material quebrado.'},
 {id:'pote_vidro',name:'Pote de vidro',category:'verde',shape:'jar',tip:'Potes de vidro vazios vão com o vidro.'},
 {id:'frasco_perfume',name:'Frasco de perfume de vidro',category:'verde',shape:'glass',tip:'O frasco de vidro vazio pode ser separado para coleta de vidro.'},
 {id:'vidro_conserva',name:'Vidro de conserva',category:'verde',shape:'jar',tip:'Recipientes de vidro vazios vão com o vidro.'},
 {id:'garrafa_azeite',name:'Garrafa de azeite de vidro',category:'verde',shape:'glass',tip:'O material da garrafa é vidro, não plástico.'},
 {id:'lata',name:'Lata de refrigerante',category:'amarelo',shape:'can',tip:'Latas de alumínio são materiais metálicos.'},
 {id:'lata_conserva',name:'Lata de conserva vazia',category:'amarelo',shape:'can',tip:'Uma lata limpa e vazia é um resíduo de metal.'},
 {id:'tampa_metal',name:'Tampa metálica',category:'amarelo',shape:'cap',tip:'Tampas de metal são separadas com outros metais.'},
 {id:'panela',name:'Panela de metal',category:'amarelo',shape:'pan',tip:'Panelas de metal podem ser entregues a pontos apropriados de coleta.'},
 {id:'lacre',name:'Lacre de alumínio',category:'amarelo',shape:'cap',tip:'Alumínio é um metal valioso para reciclagem.'},
 {id:'casca_banana',name:'Casca de banana',category:'marrom',shape:'leaf',tip:'Cascas de frutas podem virar composto orgânico.'},
 {id:'casca_melancia',name:'Casca de melancia',category:'marrom',shape:'leaf',tip:'Restos vegetais podem ser aproveitados na compostagem.'},
 {id:'borra_cafe',name:'Borra de café',category:'marrom',shape:'leaf',tip:'Borra de café pode ser utilizada na compostagem.'},
 {id:'folhas',name:'Folhas secas',category:'marrom',shape:'leaf',tip:'Folhas secas são materiais orgânicos para compostagem.'},
 {id:'casca_laranja',name:'Casca de laranja',category:'marrom',shape:'leaf',tip:'Cascas de frutas são resíduos orgânicos.'}
];
const SHAPES={
 paper:'<path d="M20 8h38l12 13v60H20zM58 8v14h12M29 36h32M29 46h32M29 56h23"/>',
 box:'<path d="M14 28l31-15 31 15v43L45 85 14 71zM14 28l31 15 31-15M45 43v42M31 20l31 16"/>',
 bottle:'<path d="M36 9h18v13l5 9 6 7v36q0 9-9 9H34q-9 0-9-9V38l6-7 5-9zM33 22h24M25 50h40M25 67h40"/>',
 cap:'<path d="M16 46q0-19 29-19t29 19v19q0 13-29 13T16 65zM16 46q29 17 58 0M23 62v9M35 65v12M48 65v12M61 62v9"/>',
 cup:'<path d="M22 20h47l-7 58H29zM17 20h57M26 37h39M32 61h29"/>',
 bag:'<path d="M20 31h50l-5 50H25zM32 33v-8q0-13 13-13t13 13v8M31 48h28"/>',
 glass:'<path d="M33 9h24v15q0 8 9 18v32q0 9-9 9H33q-9 0-9-9V42q9-10 9-18zM32 23h26M24 50h42M24 64h42"/>',
 jar:'<path d="M25 18h40v14H25zM30 32h30q11 0 11 10v28q0 12-12 12H31q-12 0-12-12V42q0-10 11-10zM30 47h30"/>',
 can:'<ellipse cx="45" cy="20" rx="26" ry="10"/><path d="M19 20v50q0 11 26 11t26-11V20M19 70q26 20 52 0M31 40h28M31 50h28"/>',
 pan:'<path d="M20 44h50v16q0 16-25 16T20 60zM13 44h66M70 48h16M31 37h28"/>',
 leaf:'<path d="M20 69q-8-45 52-56 10 56-35 64-11 0-17-8zM22 72q22-31 49-47M32 53l-14-13M47 39l-2-16M48 48l22 5"/>'
};
function illustration(shape){
 return '<svg viewBox="0 0 90 96" width="96" height="105" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(SHAPES[shape]||SHAPES.box)+'</svg>';
}
const shuffle=(array,rng=Math.random)=>{
 const out=[...array];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
 return out;
};
function createRound(rng=Math.random){
 // Three levels, each with one object from each category; no repeats.
 const selections=CATEGORIES.map(category=>shuffle(ITEMS.filter(item=>item.category===category.id),rng).slice(0,3));
 const rounds=[];
 for(let level=0;level<3;level++){
  const choices=selections.map(items=>items[level]);
  rounds.push(...shuffle(choices,rng));
 }
 return rounds;
}
function scoreAnswer(item,chosen){
 const ok=item?.category===chosen;
 return {correct:ok,category:item?.category,tip:item?.tip||'',points:ok?100:0};
}
let game=null,renderedId=null;
function getMain(){return document.querySelector('#kidsMain')}
function getSide(){return document.querySelector('#kidsSide')}
function category(id){return CATEGORIES.find(c=>c.id===id)}
function newGame(){
 game={phase:'intro',rounds:createRound(),index:0,points:0,correct:0,misses:0,retry:false,feedback:null,selected:null};
 render();return game;
}
function begin(){
 if(!game)newGame();
 game.phase='playing';render();
}
function chooseBin(id){
 if(!game||game.phase!=='playing'||!category(id))return false;
 const item=game.rounds[game.index],answer=scoreAnswer(item,id);
 if(answer.correct){
  game.points+=answer.points;game.correct++;game.retry=false;
  game.feedback={correct:true,message:'Boa escolha! '+answer.tip};
  game.phase='feedback';
  playNote(660);
 }else{
  game.misses++;
  game.feedback={correct:false,message:'Vamos tentar de novo! Observe o material do objeto e escolha outra lixeira.'};
  game.phase='feedback';
  game.retry=true;
  playNote(280);
 }
 render();return answer.correct;
}
function continueGame(){
 if(!game||game.phase!=='feedback')return;
 if(game.retry){game.phase='playing';game.feedback=null;render();return}
 game.index++;
 game.feedback=null;
 game.phase=game.index>=game.rounds.length?'complete':'playing';
 if(game.phase==='complete')playNote(880);
 render();
}
function playNote(freq){
 try{
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx)return;
  const context=playNote.context||=new Ctx(),osc=context.createOscillator(),gain=context.createGain();
  osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.065,context.currentTime+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,context.currentTime+.17);
  osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+.2);
 }catch{}
}
function lesson(c){return c.name+' — '+c.desc}
function render(){
 const main=getMain(),side=getSide();if(!main||!side)return;
 if(!game)newGame();
 const data=game;
 side.innerHTML='<div class="kids-help"><h3>GUIA DA COLETA</h3><p>Observe do que cada objeto é feito. Toque na lixeira da categoria correta. Você pode tentar novamente sem perder pontos.</p><div class="kids-legend">'+CATEGORIES.map(c=>'<div><span style="--bin:'+c.color+'"></span><strong>'+c.name+'</strong><small>'+c.desc+'</small></div>').join('')+'</div><p>As regras de coleta variam conforme a cidade. Resíduos devem estar limpos e secos quando necessário. A compostagem também depende das condições locais.</p></div>';
 if(data.phase==='intro'){
  main.innerHTML='<div class="kids-intro"><span class="kids-kicker">ECOCARD / MODO INFANTIL</span><h2>MISSÃO COLETA</h2><p>Você consegue colocar cada objeto na lixeira correta?</p><div class="kids-intro-art" aria-hidden="true">'+CATEGORIES.map(c=>'<span style="--bin:'+c.color+'"></span>').join('')+'</div><p><strong>15 objetos · 3 etapas · Sem cronômetro</strong></p><p>Observe, escolha a lixeira e descubra o motivo da resposta. Errou? Pode tentar de novo.</p><button class="btn kids-primary" id="kidsBegin">COMEÇAR MISSÃO</button></div>';
  main.querySelector('#kidsBegin')?.addEventListener('click',begin);return;
 }
 if(data.phase==='complete'){
  main.innerHTML='<section class="kids-finish"><span class="kids-kicker">MISSÃO CONCLUÍDA</span><div class="kids-finish-symbol" aria-hidden="true">15/15</div><h2>PARABÉNS, GUARDIÃO!</h2><p>Você separou os 15 objetos e ajudou a cuidar do planeta.</p><div class="kids-final-score"><strong>'+data.points.toLocaleString('pt-BR')+'</strong><span>PONTOS</span><strong>'+data.correct+'/15</strong><span>ACERTOS</span></div><p>O próximo passo é aprender onde os resíduos são coletados na sua cidade.</p><button class="btn kids-primary" id="kidsAgain">JOGAR OUTRA VEZ</button></section>';
  main.querySelector('#kidsAgain')?.addEventListener('click',newGame);return;
 }
 const item=data.rounds[data.index],cat=category(item.category),at=data.index+1,level=Math.ceil(at/5);
 main.innerHTML='<div class="kids-arena"><div class="kids-topline"><span>ETAPA '+level+' / 3</span><span>OBJETO '+at+' / 15</span><span>'+data.points.toLocaleString('pt-BR')+' PTS</span></div>'+
 '<div class="kids-progress"><span style="width:'+((data.index+1)/15*100)+'%"></span></div>'+
 '<div class="kids-item" role="group" aria-label="Objeto para separar"><span class="kids-label">ONDE DEVO COLOCAR?</span><div class="kids-illustration">'+illustration(item.shape)+'</div><h2>'+item.name+'</h2></div>'+
 (data.phase==='feedback'?'<section class="kids-answer '+(data.feedback.correct?'correct':'retry')+'" role="status"><h3>'+(data.feedback.correct?'ACERTOU!':'TENTE MAIS UMA VEZ')+'</h3><p>'+data.feedback.message+'</p><button class="btn kids-primary" id="kidsNext">'+(data.retry?'ESCOLHER OUTRA LIXEIRA':'PRÓXIMO OBJETO')+'</button></section>':
 '<h3 class="kids-question">ESCOLHA UMA LIXEIRA</h3><div class="kids-bins">'+CATEGORIES.map(c=>'<button type="button" class="kids-bin" style="--bin:'+c.color+'" data-bin="'+c.id+'" aria-label="Lixeira de '+c.name+'"><span class="kids-bin-lid"></span><span class="kids-bin-body"><span class="kids-bin-mark" aria-hidden="true">ECO</span><strong>'+c.name+'</strong></span></button>').join('')+'</div><p class="kids-hint">Toque na lixeira correta. Não existe limite de tempo.</p>')+
 '</div>';
 main.querySelector('#kidsNext')?.addEventListener('click',continueGame);
 main.querySelectorAll('[data-bin]').forEach(el=>el.addEventListener('click',()=>chooseBin(el.dataset.bin)));
}
function show(){if(!game)newGame();else render()}
root.EcoKids={CATEGORIES,ITEMS,SHAPES,illustration,createRound,scoreAnswer,newGame,begin,chooseBin,continueGame,show,getState:()=>game};
})(window);
