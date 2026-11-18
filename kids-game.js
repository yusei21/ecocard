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
 {id:'casca_laranja',name:'Casca de laranja',category:'marrom',shape:'leaf',tip:'Cascas de frutas são resíduos orgânicos.'},

 {id:'mapa_papel',name:'Mapa de papel',category:'azul',shape:'map',tip:'Mapas feitos de papel limpo podem ser separados para reciclagem.'},
 {id:'tubo_papelao',name:'Tubo de papelão',category:'azul',shape:'tube',tip:'O rolinho de papelão pode ir para a coleta de papel quando está limpo.'},
 {id:'cartaz_papel',name:'Cartaz de papel',category:'azul',shape:'poster',tip:'Um cartaz de papel sem plastificação pode ir para a reciclagem de papel.'},
 {id:'frasco_shampoo',name:'Frasco de xampu vazio',category:'vermelho',shape:'shampoo',tip:'Se o frasco é plástico e está vazio, separe-o com o plástico.'},
 {id:'balde_plastico',name:'Balde plástico quebrado',category:'vermelho',shape:'bucket',tip:'Objetos plásticos rígidos podem ser recebidos em ecopontos específicos.'},
 {id:'copo_plastico',name:'Copo plástico limpo',category:'vermelho',shape:'cup',tip:'Copos plásticos limpos podem ser aceitos na coleta de plástico local.'},
 {id:'pote_geleia',name:'Pote de geleia de vidro',category:'verde',shape:'jar',tip:'O pote vazio é de vidro e pode ser reciclado.'},
 {id:'garrafa_suco',name:'Garrafa de suco de vidro',category:'verde',shape:'glass',tip:'Olhe o material: essa garrafa é de vidro, não de plástico.'},
 {id:'frasco_molho',name:'Frasco de molho de vidro',category:'verde',shape:'flask',tip:'Frascos de vidro vazios podem ser separados para a reciclagem.'},
 {id:'colher_metal',name:'Colher de metal velha',category:'amarelo',shape:'spoon',tip:'Uma colher feita de metal pode ser destinada a pontos de coleta de metais.'},
 {id:'pote_biscoito',name:'Lata de biscoitos',category:'amarelo',shape:'tin',tip:'Mesmo sendo uma embalagem de biscoitos, o material é metal.'},
 {id:'forma_aluminio',name:'Forma de alumínio limpa',category:'amarelo',shape:'tray',tip:'O alumínio da forma é metal e pode ser reciclado quando está limpo.'},
 {id:'casca_batata',name:'Casca de batata',category:'marrom',shape:'potato',tip:'Cascas de batata são resíduos vegetais que podem ir para a compostagem.'},
 {id:'resto_alface',name:'Folha de alface murcha',category:'marrom',shape:'lettuce',tip:'Folhas de verduras podem ser aproveitadas como material orgânico.'},
 {id:'talo_couve',name:'Talo de couve',category:'marrom',shape:'stem',tip:'Talos de verduras também podem ser usados na compostagem.'}
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
,
 map:'<path d="M8 23l26-10 23 10 25-10v58L57 81 34 71 8 81zM34 13v58M57 23v58M15 37h12M62 42h13"/>',
 tube:'<ellipse cx="45" cy="19" rx="22" ry="11"/><path d="M23 19v58q0 11 22 11t22-11V19M23 77q22 20 44 0M35 19q10 5 20 0"/>',
 poster:'<path d="M17 11h56v73H17zM25 20h40v31H25zM25 61h40M25 70h30M34 43l10-14 12 14"/>',
 shampoo:'<path d="M30 23h32v9l6 10v33q0 10-10 10H30q-10 0-10-10V42l10-10zM36 14h20v9H36zM30 49h28M34 60h20"/>',
 bucket:'<path d="M18 31h54L64 83H26zM25 30q0-23 20-23t20 23M27 49h36M30 66h30"/>',
 flask:'<path d="M33 10h25v17q0 8 7 16v33q0 9-9 9H34q-9 0-9-9V43q8-8 8-16zM33 27h25M25 50h40M36 63h18"/>',
 spoon:'<ellipse cx="45" cy="23" rx="15" ry="18"/><path d="M45 41v43M35 84h20"/>',
 tin:'<ellipse cx="45" cy="20" rx="29" ry="10"/><path d="M16 20v55q0 10 29 10t29-10V20M16 75q29 17 58 0M26 43h38M26 58h38"/>',
 tray:'<path d="M12 39h66l-9 37H21zM8 35h74M22 48h45M27 59h35"/>',
 potato:'<path d="M25 21q-20 10-14 38t33 23q30 4 35-22 4-18-13-26-11-26-41-13zM28 47h2M56 56h2M41 30h2"/>',
 lettuce:'<path d="M43 77q-24-12-29-32 4-12 18-14 1-20 19-23 13 6 14 24 17 4 15 20-13 26-37 25zM43 76V25M43 53L29 42M43 42l13-13"/>',
 stem:'<path d="M44 83V20M44 49Q23 49 18 23q20-1 26 26M44 64Q66 59 73 32q-23-1-29 32M35 82h18"/>'
};
function illustration(shape){
 return '<svg viewBox="0 0 90 96" width="96" height="105" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(SHAPES[shape]||SHAPES.box)+'</svg>';
}
const shuffle=(array,rng=Math.random)=>{
 const out=[...array];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
 return out;
};
const LEVELS=[
 {name:'Desafio das Cores',description:'Observe o objeto e escolha somente pela cor.',hint:false},
 {name:'Mestre da Separação',description:'Mais cinco objetos difíceis. Sem nomes nas lixeiras.',hint:false}
];
const JOKES_CORRECT=[
 'Missão cumprida! Até a lixeira ficou orgulhosa.',
 'Boa! O planeta acaba de ganhar mais um especialista.',
 'Acertou! Essa investigação foi digna de um detetive.',
 'Muito bem! A lixeira certa agradece a visita.',
 'Mandou bem! Separar resíduos é uma super-habilidade.'
];
const JOKES_RETRY=[
 'Quase! A lixeira não vai fugir, tente outra.',
 'Ops! O objeto entrou na fila errada. Vamos descobrir a certa?',
 'Ainda não! Olhe o material, não só o formato.',
 'A lixeira ficou confusa. Que tal tentar mais uma vez?',
 'Opa! Nem toda garrafa é de plástico. Observe bem.'
];
function createRound(rng=Math.random){
 // Select ten challenging items, two per category, from the three advanced
 // illustrations added to each category (indices 5, 6 and 7).
 const choices=CATEGORIES.map(cat=>shuffle(ITEMS.filter(item=>item.category===cat.id).slice(5),rng).slice(0,2));
 const result=[];
 for(let level=0;level<LEVELS.length;level++){
  result.push(...shuffle(choices.map(items=>items[level]),rng));
 }
 return result;
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
 game={phase:'intro',rounds:createRound(),index:0,points:0,correct:0,misses:0,retry:false,feedback:null,selected:null,levelsCompleted:0};
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
  game.feedback={correct:true,message:JOKES_CORRECT[game.index%JOKES_CORRECT.length]+' '+answer.tip};
  game.phase='feedback';
  playNote(660);
 }else{
  game.misses++;
  game.feedback={correct:false,message:JOKES_RETRY[(game.index+game.misses-1)%JOKES_RETRY.length]};
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
 if(game.index>=game.rounds.length){game.phase='complete';game.levelsCompleted=LEVELS.length;playNote(880)}
 else if(game.index%5===0){game.phase='levelup';game.levelsCompleted=game.index/5;playNote(770)}
 else game.phase='playing';
 render();
}
function startNextLevel(){if(game?.phase!=='levelup')return;game.phase='playing';render()}
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
function isFinalLevel(index){return index>=0}
function binsHTML(){
 return CATEGORIES.map(c=>{
  const colorName={azul:'azul',vermelho:'vermelha',verde:'verde',amarelo:'amarela',marrom:'marrom'}[c.id];
  return '<button type="button" class="kids-bin kids-bin-color-only" style="--bin:'+c.color+'" data-bin="'+c.id+'" aria-label="Lixeira '+colorName+'"><span class="kids-bin-lid"></span><span class="kids-bin-body"></span></button>';
 }).join('');
}
function render(){
 const main=getMain(),side=getSide();if(!main||!side)return;
 if(!game)newGame();
 const data=game;
 side.innerHTML='<div class="kids-help kids-final-guide"><h3>DESAFIO DAS CORES</h3><p>Observe o objeto e escolha uma lixeira apenas pela cor. Os nomes dos materiais não aparecem durante o desafio.</p><p>Errou? Pode tentar novamente, sem perder pontos.</p><p>As orientações reais de coleta variam conforme a cidade.</p></div>';
 if(data.phase==='intro'){
  main.innerHTML='<div class="kids-intro"><span class="kids-kicker">ECOCARD / MODO INFANTIL</span><h2>MISSÃO COLETA</h2><p>Você consegue colocar cada objeto na lixeira correta?</p><div class="kids-intro-art" aria-hidden="true">'+CATEGORIES.map(c=>'<span style="--bin:'+c.color+'"></span>').join('')+'</div><p><strong>10 perguntas · 2 etapas · Apenas as cores</strong></p><p>Observe, escolha a lixeira e descubra o motivo da resposta. Errou? Pode tentar de novo.</p><button class="btn kids-primary" id="kidsBegin">COMEÇAR MISSÃO</button></div>';
  main.querySelector('#kidsBegin')?.addEventListener('click',begin);return;
 }
 if(data.phase==='complete'){
  main.innerHTML='<section class="kids-finish"><span class="kids-kicker">MISSÃO CONCLUÍDA</span><div class="kids-finish-symbol" aria-hidden="true">10/10</div><h2>PARABÉNS, GUARDIÃO!</h2><p>Você separou os 10 objetos desafiadores e concluiu a missão.</p><div class="kids-final-score"><strong>'+data.points.toLocaleString('pt-BR')+'</strong><span>PONTOS</span><strong>'+data.correct+'/10</strong><span>ACERTOS</span></div><p>O próximo passo é aprender onde os resíduos são coletados na sua cidade.</p><button class="btn kids-primary" id="kidsAgain">JOGAR OUTRA VEZ</button></section>';
  main.querySelector('#kidsAgain')?.addEventListener('click',newGame);return;
 }
 if(data.phase==='levelup'){
  const level=data.index/5;
  main.innerHTML='<section class="kids-levelup"><span class="kids-kicker">ETAPA '+(level+1)+' / '+LEVELS.length+'</span><div class="kids-levelup-number">'+(level+1)+'</div><h2>'+LEVELS[level].name.toUpperCase()+'</h2><p>'+LEVELS[level].description+'</p><div class="kids-levelup-progress">'+level+' de '+LEVELS.length+' etapas concluídas</div><button type="button" class="btn kids-primary" id="kidsContinueLevel">CONTINUAR MISSÃO</button></section>';
  main.querySelector('#kidsContinueLevel')?.addEventListener('click',startNextLevel);return;
 }
 const item=data.rounds[data.index],at=data.index+1,level=Math.ceil(at/5);
 main.innerHTML='<div class="kids-arena"><div class="kids-topline"><span>ETAPA '+level+' / '+LEVELS.length+'</span><span>OBJETO '+at+' / '+data.rounds.length+'</span><span>'+data.points.toLocaleString('pt-BR')+' PTS</span></div>'+
 '<div class="kids-progress"><span style="width:'+((data.index+1)/data.rounds.length*100)+'%"></span></div>'+
 '<div class="kids-item" role="group" aria-label="Objeto para separar"><span class="kids-label">ONDE DEVO COLOCAR?</span><div class="kids-illustration">'+illustration(item.shape)+'</div><h2>'+item.name+'</h2><p class="kids-item-tip kids-item-tip-hard">ESCOLHA APENAS PELA COR</p></div>'+
 (data.phase==='feedback'?'<section class="kids-answer '+(data.feedback.correct?'correct':'retry')+'" role="status"><h3>'+(data.feedback.correct?'ACERTOU!':'TENTE MAIS UMA VEZ')+'</h3><p>'+data.feedback.message+'</p><button class="btn kids-primary" id="kidsNext">'+(data.retry?'ESCOLHER OUTRA LIXEIRA':'PRÓXIMO OBJETO')+'</button></section>':
 '<h3 class="kids-question">ESCOLHA UMA LIXEIRA</h3><div class="kids-bins">'+binsHTML()+'</div><p class="kids-hint">Toque na lixeira correta. Não existe limite de tempo.</p>')+
 '</div>';
 main.querySelector('#kidsNext')?.addEventListener('click',continueGame);
 main.querySelectorAll('[data-bin]').forEach(el=>el.addEventListener('click',()=>chooseBin(el.dataset.bin)));
}
function show(){if(!game)newGame();else render()}
root.EcoKids={CATEGORIES,ITEMS,SHAPES,LEVELS,JOKES_CORRECT,JOKES_RETRY,isFinalLevel,binsHTML,illustration,createRound,scoreAnswer,newGame,begin,chooseBin,continueGame,startNextLevel,show,getState:()=>game};
})(window);
