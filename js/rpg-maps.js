/* RPG MAP DATA */
const T = {
    VOID:0,GRASS:1,WOOD:2,TILE:3,WALL:4,POOL:5,POOL_EDGE:6,FENCE:7,PATIO:8,CARPET:9,
    DOOR:10,STAIRS_UP:11,STAIRS_DOWN:12,SOFA:20,TABLE:21,CHAIR:22,TV:23,BED:24,DESK:25,
    COUNTER:26,BOOKSHELF:27,TOILET:28,BATHTUB:29,PLANT:30,FRIDGE:31,SINK:32,STOVE:33,
    DRESSER:34,NIGHTSTAND:35,RUG:36,LAMP:37,CUPBOARD:40,BOX:41,VASE_VISIBLE:42,NOTE:43,
    COLLECTIBLE:44,WALL_TOP:45,ROOF:46,PATH:47,FLOWER:48,TREE:49,WINDOW:50,POOL_VASE:51
};
const SOLID_TILES = new Set([T.WALL,T.FENCE,T.SOFA,T.TABLE,T.TV,T.BED,T.DESK,T.COUNTER,T.BOOKSHELF,T.TOILET,T.BATHTUB,T.PLANT,T.FRIDGE,T.SINK,T.STOVE,T.DRESSER,T.NIGHTSTAND,T.LAMP,T.CUPBOARD,T.BOX,T.WALL_TOP,T.TREE,T.WINDOW]);
// POOL_VASE is NOT solid - player walks into pool to collect it
// DOOR removed from interactive - doors are just walkable now
const INTERACTIVE_TILES = new Set([T.CUPBOARD,T.BOX,T.VASE_VISIBLE,T.NOTE,T.STAIRS_UP,T.STAIRS_DOWN,T.POOL_VASE]);

const PV=T.POOL_VASE;
const _=T.VOID,G=T.GRASS,W=T.WOOD,TI=T.TILE,WA=T.WALL,P=T.POOL,PE=T.POOL_EDGE,
F=T.FENCE,PA=T.PATIO,CA=T.CARPET,D=T.DOOR,SU=T.STAIRS_UP,SD=T.STAIRS_DOWN,
SO=T.SOFA,TB=T.TABLE,CH=T.CHAIR,TV=T.TV,BD=T.BED,DK=T.DESK,CT=T.COUNTER,
BK=T.BOOKSHELF,TO=T.TOILET,BT=T.BATHTUB,PL=T.PLANT,FR=T.FRIDGE,SK=T.SINK,
ST=T.STOVE,DR=T.DRESSER,NS=T.NIGHTSTAND,RG=T.RUG,LM=T.LAMP,CB=T.CUPBOARD,
BX=T.BOX,VV=T.VASE_VISIBLE,NO=T.NOTE,CO=T.COLLECTIBLE,WT=T.WALL_TOP,
RO=T.ROOF,PT=T.PATH,FL=T.FLOWER,TR=T.TREE,WN=T.WINDOW;

const GROUND_FLOOR = [
[TR,TR,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,TR,TR],
[TR,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,TR],
[F,G,FL,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,PE,PE,PE,PE,PE,PE,PE,G,G,FL,G,G,F],
[F,G,G,G,G,PT,PT,PT,PT,G,G,G,G,G,G,G,G,G,G,G,G,G,PE,P,P,P,P,P,PE,G,G,G,G,G,F],
[F,G,G,PL,G,PT,G,G,PT,G,G,G,G,G,G,G,G,G,G,G,G,G,PE,P,P,PV,P,P,PE,G,G,G,G,G,F],
[F,G,G,G,G,PT,G,G,PT,G,G,G,G,G,G,G,G,G,G,G,G,G,PE,P,P,P,P,P,PE,G,G,CO,G,G,F],
[F,G,G,G,G,PT,PT,PT,PT,G,G,G,G,G,G,G,G,G,G,G,G,G,PE,PE,PE,PE,PE,PE,PE,G,G,G,G,G,F],
[F,G,NO,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,W,W,W,W,W,W,W,W,WN,WA,TI,TI,SK,CT,CT,ST,WN,WA,WA,WA,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,W,SO,SO,SO,W,W,W,W,W,WA,TI,TI,TI,TI,TI,FR,W,WA,G,G,G,G,G,PL,G,G,G,G,F],
[F,G,G,G,WA,W,W,W,W,W,TB,TB,W,W,D,TI,CH,TB,CH,TI,TI,W,WA,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WN,W,W,CH,W,W,W,W,W,VV,WA,TI,TI,TI,TI,CB,TI,W,WA,G,G,G,G,G,G,G,G,NO,G,F],
[F,G,G,G,WA,W,W,W,TV,W,W,W,W,W,WA,WA,WA,WA,WA,D,WA,WA,WA,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,W,W,W,W,W,W,W,W,W,W,W,W,W,W,PA,PA,PA,PA,PA,PA,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,W,W,W,W,W,W,W,W,W,WA,WA,D,WA,WA,WA,WA,WA,WA,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,W,SU,W,W,W,W,W,W,W,WA,TI,TI,TI,TI,TI,BK,WN,WA,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,W,W,W,BX,W,W,NO,W,W,WA,TI,TI,DK,CH,TI,BK,W,WA,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,W,W,W,W,W,W,W,W,W,WA,TI,TI,TI,TI,NO,TI,W,WA,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,WA,WA,WA,WA,WA,D,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,G,G,G,G,PA,PA,PA,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,G,G,G,G,G,PT,G,G,G,G,G,G,G,G,G,CO,G,G,G,G,G,G,G,G,G,G,G,G,G,G,F],
[F,G,BX,G,G,G,G,G,G,PT,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,F],
[F,G,G,G,G,G,NO,G,G,PT,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,CO,G,G,G,G,G,G,G,F],
[F,G,G,G,G,G,G,G,G,PT,G,G,G,FL,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,FL,G,F],
[F,G,G,PL,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,PL,G,G,F],
[TR,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,TR],
[TR,TR,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,TR,TR],
];

const UPPER_FLOOR = [
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,CA,CA,CA,CA,CA,CA,CA,CA,WN,WA,TI,TI,TI,TI,TI,TI,WN,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,CA,BD,BD,CA,CA,NS,CA,CA,W,WA,TI,BT,BT,TI,TI,TO,W,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,CA,CA,CA,CA,CA,CA,LM,CA,W,D,TI,TI,TI,TI,SK,TI,W,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,CA,CA,DR,CA,CA,CA,CA,CA,W,WA,TI,TI,TI,TI,CB,TI,W,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,WA,WA,WA,WA,D,WA,WA,WA,WA,WA,WA,WA,WA,WA,D,WA,WA,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,WA,WA,D,WA,WA,WA,WA,WA,WA,WA,WA,D,WA,WA,WA,WA,WA,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,CA,CA,CA,CA,CA,CA,CA,SD,W,WA,CA,CA,CA,CA,CA,BK,WN,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,CA,BD,BD,CA,CA,VV,NO,CA,W,WA,CA,DK,CH,CA,CA,BK,W,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,CA,CA,CA,CA,CA,CA,CA,CA,W,WA,CA,CA,CA,CA,BX,CA,W,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,WA,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// Generate VASE_LOCATIONS dynamically based on config length
let VASE_LOCATIONS = [];
const baseLocations = [
    { floor:0, x:7, y:12, type:'visible', id:'v1' },
    { floor:0, x:17, y:10, type:'visible', id:'v2' },
    { floor:0, x:12, y:12, type:'visible', id:'v3' },
    { floor:0, x:10, y:20, type:'visible', id:'v4' },
    { floor:1, x:10, y:18, type:'visible', id:'v5' },
    { floor:1, x:8, y:13, type:'visible', id:'v6' },
];
const needed = CONFIG.yourName.replace(/\s/g, '').length;
for (let i = 0; i < needed; i++) {
    const base = baseLocations[i % baseLocations.length];
    VASE_LOCATIONS.push({ ...base, id: 'v' + (i + 1) });
}

const NOTE_CONTENTS = [
    "Something tells me you're close...",
    "Have you tried the cupboards?",
    "Night is dark. Stay alert!",
    "Almost there... keep looking!",
    "Some boxes hide secrets...",
];
const NOTE_LOCATIONS = [
    {floor:0,x:2,y:7},{floor:0,x:11,y:17},{floor:0,x:19,y:18},{floor:0,x:31,y:12},{floor:0,x:6,y:23},{floor:1,x:11,y:17},
];
const COLLECTIBLE_ITEMS = [
    {floor:0,x:31,y:5,name:'Hammer',desc:'Breaks boxes instantly'},
    {floor:0,x:19,y:21,name:'Lantern',desc:'Lights your way at night'},
    {floor:0,x:26,y:23,name:'Map',desc:'Reveals vase hints on minimap'},
];
const PLAYER_SPAWN = {floor:0,x:9,y:21};
const STAIRS = [
    {floor:0,x:6,y:16,target:{floor:1,x:12,y:16}},
    {floor:1,x:12,y:16,target:{floor:0,x:6,y:16}},
];
const MAPS = [GROUND_FLOOR, UPPER_FLOOR];
const MAP_W = 35; const MAP_H = 28; const TILE_SIZE = 32;

const PROGRESS_HINTS = [
    "Explore the house! Look for vases nearby.",
    "Nice! Check inside the rooms...",
    "Try the upper floor too!",
    "Look near the pool area!",
    "Break some boxes open!",
    "One more to go! Search everywhere!",
];
