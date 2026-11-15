/* EcoCard card art: object silhouettes rendered as inline SVG.
 * Decorative artwork, no emoji, external images, fonts, or network required.
 */
(function(root){
'use strict';
const PATHS={
 newspaper:'<path d="M14 18h51v55H20q-7 0-7-7V18zM23 17v49M30 28h27M30 37h27M30 46h11M47 46h10M30 56h27M30 64h27"/>',
 notebook:'<rect x="21" y="10" width="44" height="70" rx="3"/><path d="M32 11v68M24 25h-9M24 39h-9M24 53h-9M24 67h-9M39 28h18M39 38h18M39 48h13"/>',
 cardboard:'<path d="M13 30l30-17 30 17v35L43 82 13 65zM13 30l30 17 30-17M43 47v35M28 22l30 17"/>',
 envelope:'<rect x="12" y="23" width="62" height="45" rx="4"/><path d="M14 27l29 24 29-24M14 65l23-22M72 65L49 43"/>',
 paper:'<path d="M22 11h34l13 13v56H22zM56 12v14h13M30 37h31M30 47h31M30 57h23M30 67h27"/>',
 magazine:'<path d="M14 16h60v62H14zM21 26h25v27H21zM52 26h15M52 36h15M52 46h15M21 61h46M21 69h46"/>',
 poster:'<path d="M17 12h55v65H17zM25 20h39v33H25zM25 62h39M25 69h21M43 25l-14 21M50 32l-8 14M57 29l-7 17"/>',
 roll:'<path d="M15 34a17 17 0 0 1 34 0v27a17 17 0 0 1-34 0zM49 34h23v27H49M15 35h34M15 61h34M25 40h14"/>',
 pet:'<path d="M34 10h19v12l5 8 8 9v31q0 12-12 12H33q-11 0-11-12V39l8-9 4-8zM34 23h19M23 51h43M23 67h43"/>',
 jug:'<path d="M27 10h26v13l9 11v43q0 7-8 7H27q-7 0-7-7V34l7-11zM27 22h26M31 43h22M31 54h22M61 39q15-4 15 10v13q-1 9-14 4"/>',
 cap:'<path d="M17 43q0-16 26-16t26 16v22q0 14-26 14T17 65zM17 44q26 17 52 0M27 54v17M39 59v19M52 59v18M62 54v17"/>',
 cup:'<path d="M20 24h49l-7 53H28zM16 24h57M27 41h35M34 62h21"/>',
 bucket:'<path d="M21 33h48l-6 45H27zM26 33q0-19 19-19t19 19M30 49h30M35 62h20"/>',
 tub:'<path d="M15 35h58v12q0 22-9 30H24q-9-8-9-30zM12 30h64v8H12M27 49h34M27 59h34"/>',
 basket:'<path d="M16 36h58l-9 42H25zM28 36l17-23 17 23M31 48v19M44 48v19M57 48v19"/>',
 bottleGlass:'<path d="M33 11h22v17q0 7 8 17v30q0 9-9 9H34q-9 0-9-9V45q8-10 8-17zM33 27h22M25 52h38M25 68h38"/>',
 jar:'<rect x="24" y="13" width="41" height="14" rx="3"/><rect x="20" y="28" width="49" height="56" rx="9"/><rect x="27" y="46" width="35" height="21" rx="2"/>',
 glass:'<path d="M24 14h42l-6 42q-2 12-15 12T30 56zM21 14h48M45 68v15M30 83h30M27 32h35"/>',
 perfume:'<rect x="24" y="31" width="44" height="50" rx="9"/><path d="M32 31V20h27v11M37 13h16M31 50h30M42 39h8"/>',
 metalCan:'<ellipse cx="45" cy="20" rx="25" ry="9"/><path d="M20 20v52q0 11 25 11t25-11V20M20 71q25 19 50 0M32 40h26M32 52h26"/>',
 tin:'<path d="M17 31h56v42q0 11-28 11T17 73zM14 31q31-13 62 0M17 44h56M24 58h42"/>',
 metalLid:'<ellipse cx="45" cy="45" rx="31" ry="18"/><path d="M14 45v12q0 16 31 16t31-16V45M38 31q7-11 14 0M32 54h26"/>',
 pan:'<path d="M17 44h52v17q0 18-26 18T17 61zM11 44h64M69 48h16M34 39q0-11 10-11t10 11"/>',
 metalTab:'<path d="M39 16q23 0 23 22v28q0 17-17 17T28 66V38q0-22 11-22zM40 29q12 0 12 11v20q0 11-10 11T32 60V40q0-11 8-11z"/>',
 screw:'<path d="M23 22h44v15H23zM29 37v38M61 37v38M37 48h16M37 58h16M37 68h16"/>',
 fruit:'<path d="M23 64q-13-25 2-37 10-8 21 1 12-10 22-1 15 13 1 37-9 20-23 12-14 8-23-12zM46 27v-16M47 23q11-15 24-10-5 12-24 10"/>',
 peel:'<path d="M21 20q8 40 45 46M20 20q-8 26 12 41M20 20q12 0 22 15t24 31M25 64q18 21 41 2M35 72q-5 9 1 12"/>',
 banana:'<path d="M19 18q16 41 50 39-7 20-27 22T13 36zM19 18l-6-7M68 57l9 1"/>',
 leaves:'<path d="M46 80V37M46 49Q20 52 16 22q28-1 30 27zM46 61q0-31 31-41 4 31-31 41zM45 80L27 64"/>',
 coffee:'<path d="M21 33h42v27q0 19-21 19T21 60zM63 39h9q11 0 11 11t-13 11h-6M18 82h52M29 22q-7-9 1-15M46 22q-7-9 1-15"/>',
 orange:'<circle cx="45" cy="52" r="27"/><path d="M45 25V13M45 17q16-12 24-2-8 11-24 9M45 52l22-15M45 52v27M45 52L22 39M45 52l-22 13"/>',
 pumpkin:'<path d="M45 30v-13M45 20q11-14 20-4M45 33Q20 14 15 48q-5 36 30 36 35 0 30-36Q68 14 45 33zM45 33q-20 25 0 50M45 33q20 25 0 50"/>'
};
// Each one of the 65 environmental cards has a specific illustration mapping.
const ART_BY_SUIT={
 azul:['newspaper','cardboard','notebook','envelope','cardboard','paper','magazine','poster','paper','paper','notebook','paper','cardboard'],
 vermelho:['pet','tub','cap','jug','jug','bucket','cup','pet','tub','cup','basket','tub','cap'],
 verde:['bottleGlass','jar','glass','bottleGlass','jar','bottleGlass','bottleGlass','jar','perfume','bottleGlass','bottleGlass','jar','bottleGlass'],
 amarelo:['metalCan','tin','metalLid','pan','metalTab','tin','metalCan','tin','metalLid','screw','screw','tin','tin'],
 marrom:['fruit','banana','coffee','leaves','pumpkin','leaves','fruit','fruit','fruit','orange','leaves','fruit','peel']
};
function drawing(card){
 const key=ART_BY_SUIT[card?.suit]?.[Number(card?.rank)-1]||'paper';
 return '<span class="card-illustration" aria-hidden="true"><svg viewBox="0 0 90 96" fill="none" stroke="currentColor" stroke-width="4.3" stroke-linecap="round" stroke-linejoin="round" focusable="false">'+PATHS[key]+'</svg></span>';
}
root.EcoCardArt={PATHS,ART_BY_SUIT,drawing};
})(window);
