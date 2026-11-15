/* Joker activation preview: never calculates score separately from the game engine.
 * The scoring events are the authoritative source for active bonuses. */
(function(root){
'use strict';
const SUIT_IDS={
 azul:['papel_limpo','papel_reciclado','economia_azul'],
 vermelho:['plastico_responsavel','plastico_engenharia'],
 verde:['vidro_retorno','vidro_circular'],
 amarelo:['metal_valor','metal_reuso','parque_solar'],
 marrom:['compostagem','horta_urbana','biofertilizante','carbono_positivo','compostagem_coletiva']
};
const SINGLE_RULES={
 reparo:c=>c.rank>=10,
 retorno_embalagens:c=>c.rank%2===0,
 pequenos_reparos:c=>c.rank<=5,
 logistica:c=>['verde','amarelo'].includes(c.suit),
 compostagem_coletiva:c=>['marrom','azul'].includes(c.suit)
};
function preview(jokers,result,hasSelection=false){
 const valid=!!result&&result.score>0&&!result.invalidReason;
 const counts=new Map();
 if(valid)for(const event of result.events||[])counts.set(event.label,(counts.get(event.label)||0)+1);
 const activeOthers=jokers.some(j=>j.id!=='circular'&&counts.has(j.name));
 return jokers.map(j=>{
  const count=j.id==='circular'?(valid&&activeOthers?1:0):(counts.get(j.name)||0);
  return {id:j.id,name:j.name,rarity:j.rarity,count,active:count>0,
   message:!hasSelection?'SELECIONE CARTAS':!valid?'MÃO ANULADA':count?'ATIVA '+(j.id==='circular'?'2X':count+'X'):'AGUARDANDO COMBO'};
 });
}
function relatedCards(cards,joker){
 if(!cards?.length||!joker)return [];
 const single=SINGLE_RULES[joker.id];
 if(single)return cards.filter(single).map(c=>c.id);
 for(const [suit,ids] of Object.entries(SUIT_IDS))
  if(ids.includes(joker.id))return cards.filter(c=>c.suit===suit).map(c=>c.id);
 return cards.map(c=>c.id);
}
function highlightedCardIds(cards,jokers,statuses){
 const ids=new Set();
 for(let i=0;i<jokers.length;i++){
  if(!statuses[i]?.active||jokers[i].id==='circular')continue;
  for(const id of relatedCards(cards,jokers[i]))ids.add(id);
 }
 return ids;
}
root.EcoJokerFeedback={preview,relatedCards,highlightedCardIds};
})(window);
