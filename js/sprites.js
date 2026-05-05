/* PIXEL ART SPRITES */
const spriteCache = {};
function getSpriteCanvas(type, size) {
    const key = `${type}-${size}`;
    if (spriteCache[key]) return spriteCache[key];
    const c = document.createElement('canvas'); c.width = size; c.height = size;
    drawTileSprite(c.getContext('2d'), type, size);
    spriteCache[key] = c; return c;
}
function drawTileSprite(x, type, s) {
    switch(type) {
    case T.GRASS:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='#4e8c42'; for(let i=0;i<6;i++){x.fillRect((i*7+3)%s,(i*11+5)%s,2,4);}
        x.fillStyle='#6bb55c'; for(let i=0;i<4;i++){x.fillRect((i*9+1)%s,(i*13+2)%s,1,3);} break;
    case T.WOOD:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#b89458'; x.fillRect(0,0,s,2); x.fillRect(0,s/2-1,s,2);
        x.fillStyle='#d4b87a'; x.fillRect(2,3,s-4,s/2-5);
        x.strokeStyle='#a07848'; x.lineWidth=.5; x.beginPath(); x.moveTo(8,4); x.lineTo(8,s/2-3); x.stroke();
        x.beginPath(); x.moveTo(22,4); x.lineTo(22,s/2-3); x.stroke(); break;
    case T.TILE:
        x.fillStyle='#d4dce6'; x.fillRect(0,0,s,s);
        x.fillStyle='#c0cad6'; x.fillRect(0,0,s/2-1,s/2-1); x.fillRect(s/2,s/2,s/2,s/2);
        x.strokeStyle='#b0b8c4'; x.lineWidth=1; x.strokeRect(0,0,s/2,s/2); x.strokeRect(s/2,s/2,s/2,s/2); break;
    case T.WALL:
        x.fillStyle='#6b5b4f'; x.fillRect(0,0,s,s);
        x.fillStyle='#7d6b5d'; for(let r=0;r<4;r++){const y=r*8,o=r%2?s/2:0; x.fillRect(o+1,y+1,s/2-2,6); x.fillRect(o+s/2+1,y+1,s/2-2,6);}
        x.fillStyle='#5a4a3e'; for(let r=0;r<4;r++) x.fillRect(0,r*8,s,1); break;
    case T.WALL_TOP:
        x.fillStyle='#8b7355'; x.fillRect(0,0,s,s);
        x.fillStyle='#9e845f'; x.fillRect(0,0,s,s-6);
        x.fillStyle='#a89070'; x.fillRect(2,2,s-4,4);
        x.fillStyle='#6b5b4f'; x.fillRect(0,s-6,s,6); break;
    case T.POOL:
        x.fillStyle='#3da8d6'; x.fillRect(0,0,s,s);
        x.fillStyle='rgba(255,255,255,0.15)';
        x.beginPath(); x.moveTo(0,s/3); x.quadraticCurveTo(s/2,s/3-6,s,s/3); x.lineTo(s,s/3+3); x.quadraticCurveTo(s/2,s/3-3,0,s/3+3); x.fill();
        x.beginPath(); x.moveTo(0,s*2/3); x.quadraticCurveTo(s/2,s*2/3+6,s,s*2/3); x.lineTo(s,s*2/3+3); x.quadraticCurveTo(s/2,s*2/3+9,0,s*2/3+3); x.fill(); break;
    case T.POOL_EDGE:
        x.fillStyle='#c8b896'; x.fillRect(0,0,s,s); x.fillStyle='#b8a886'; x.fillRect(2,2,s-4,s-4);
        x.fillStyle='#d8c8a6'; x.fillRect(4,4,s-8,s-8); break;
    case T.FENCE:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='#8B6914'; x.fillRect(s/2-2,0,4,s); x.fillRect(0,s/3,s,4); x.fillRect(0,s*2/3,s,4);
        x.fillStyle='#a07a1a'; x.fillRect(s/2-1,0,2,s); break;
    case T.PATIO:
        x.fillStyle='#b8a898'; x.fillRect(0,0,s,s); x.strokeStyle='#a09080'; x.lineWidth=1; x.strokeRect(1,1,s-2,s-2);
        x.fillStyle='#c8b8a8'; x.fillRect(2,2,s-4,s-4); break;
    case T.CARPET:
        x.fillStyle='#9e5080'; x.fillRect(0,0,s,s); x.fillStyle='#a85888'; x.fillRect(2,2,s-4,s-4);
        x.fillStyle='#b86898'; x.fillRect(s/2-2,4,4,s-8); x.fillRect(4,s/2-2,s-8,4); break;
    case T.DOOR:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#8B5E3C'; x.fillRect(4,0,s-8,s);
        x.fillStyle='#a0703c'; x.fillRect(6,2,s-12,s-4);
        x.fillStyle='#7a4e2c'; x.fillRect(s/2-1,0,2,s);
        x.fillStyle='#ffd32a'; x.beginPath(); x.arc(s-10,s/2,2,0,Math.PI*2); x.fill(); break;
    case T.STAIRS_UP:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        for(let i=0;i<5;i++){const y=s-(i+1)*(s/5); x.fillStyle=`rgb(${150+i*18},${130+i*16},${100+i*14})`; x.fillRect(3,y,s-6,s/5-1);
        x.fillStyle=`rgb(${170+i*15},${150+i*13},${120+i*11})`; x.fillRect(3,y,s-6,3);}
        x.fillStyle='#4CAF50'; x.beginPath(); x.moveTo(s/2,3); x.lineTo(s/2+7,12); x.lineTo(s/2-7,12); x.closePath(); x.fill();
        x.fillStyle='#fff'; x.font='bold 7px sans-serif'; x.fillText('UP',s/2-7,s-3); break;
    case T.STAIRS_DOWN:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        for(let i=0;i<5;i++){const y=i*(s/5); x.fillStyle=`rgb(${230-i*18},${210-i*16},${180-i*14})`; x.fillRect(3,y,s-6,s/5-1);
        x.fillStyle=`rgb(${240-i*15},${220-i*13},${190-i*11})`; x.fillRect(3,y,s-6,3);}
        x.fillStyle='#ff8c00'; x.beginPath(); x.moveTo(s/2,s-3); x.lineTo(s/2+7,s-12); x.lineTo(s/2-7,s-12); x.closePath(); x.fill();
        x.fillStyle='#fff'; x.font='bold 7px sans-serif'; x.fillText('DN',s/2-7,10); break;
    case T.VASE_VISIBLE:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        // Glow
        x.fillStyle='rgba(255,160,80,0.2)'; x.beginPath(); x.arc(s/2,s/2,s/2-2,0,Math.PI*2); x.fill();
        // Vase body - proper amphora
        x.fillStyle='#c85a28';
        x.beginPath(); x.moveTo(s/2-3,5); x.lineTo(s/2+3,5);
        x.quadraticCurveTo(s/2+4,8,s/2+5,10);
        x.quadraticCurveTo(s/2+10,s/2+2,s/2+8,s-6);
        x.lineTo(s/2-8,s-6);
        x.quadraticCurveTo(s/2-10,s/2+2,s/2-5,10);
        x.quadraticCurveTo(s/2-4,8,s/2-3,5);
        x.closePath(); x.fill();
        // Highlight
        x.fillStyle='#e07040';
        x.beginPath(); x.moveTo(s/2-1,7); x.quadraticCurveTo(s/2+5,s/2,s/2+4,s-8);
        x.lineTo(s/2-2,s-8); x.quadraticCurveTo(s/2-3,s/2,s/2-1,7); x.closePath(); x.fill();
        // Rim
        x.fillStyle='#a04020'; x.beginPath(); x.ellipse(s/2,5,4,2.5,0,0,Math.PI*2); x.fill();
        x.fillStyle='#d06838'; x.beginPath(); x.ellipse(s/2,5,3,1.5,0,0,Math.PI*2); x.fill();
        // Band
        x.fillStyle='#e8a040'; x.fillRect(s/2-6,s/2,12,2);
        x.fillStyle='#a04020'; x.fillRect(s/2-7,s/2-1,14,1); x.fillRect(s/2-7,s/2+2,14,1);
        // Base
        x.fillStyle='#8a3818'; x.fillRect(s/2-7,s-6,14,2);
        // Outline
        x.strokeStyle='#5a2010'; x.lineWidth=1.5;
        x.beginPath(); x.moveTo(s/2-3,5); x.quadraticCurveTo(s/2-4,8,s/2-5,10);
        x.quadraticCurveTo(s/2-10,s/2+2,s/2-8,s-6); x.lineTo(s/2+8,s-6);
        x.quadraticCurveTo(s/2+10,s/2+2,s/2+5,10); x.quadraticCurveTo(s/2+4,8,s/2+3,5); x.stroke();
        // Sparkle
        x.fillStyle='#fff'; x.globalAlpha=.7; x.fillRect(s/2+3,9,2,2); x.fillRect(s/2+5,12,1,1); x.globalAlpha=1;
        // Flower
        x.fillStyle='#2d7a2d'; x.fillRect(s/2-1,2,2,4);
        x.fillStyle='#ff6b8a'; x.beginPath(); x.arc(s/2,1,2.5,0,Math.PI*2); x.fill();
        break;
    case T.SOFA:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#4a6fa5'; x.fillRect(2,4,s-4,s-6);
        x.fillStyle='#5580b8'; x.fillRect(4,6,s-8,s-10);
        x.fillStyle='#3a5f95'; x.fillRect(2,4,4,s-6); x.fillRect(s-6,4,4,s-6); break;
    case T.TABLE:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#8B5E3C'; x.fillRect(3,3,s-6,s-6);
        x.fillStyle='#a0703c'; x.fillRect(5,5,s-10,s-10);
        x.fillStyle='#6b4a2c'; x.fillRect(4,4,3,3); x.fillRect(s-7,4,3,3); x.fillRect(4,s-7,3,3); x.fillRect(s-7,s-7,3,3); break;
    case T.TV:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#2c2c2c'; x.fillRect(4,4,s-8,s-10);
        x.fillStyle='#1a3a5c'; x.fillRect(6,6,s-12,s-14);
        x.fillStyle='#3c3c3c'; x.fillRect(s/2-3,s-6,6,4); break;
    case T.BED:
        x.fillStyle='#9e5080'; x.fillRect(0,0,s,s);
        x.fillStyle='#e88ca8'; x.fillRect(2,2,s-4,s-4);
        x.fillStyle='#f0a0b8'; x.fillRect(4,4,s-8,s-12);
        x.fillStyle='#fff'; x.fillRect(4,s-10,s-8,6);
        x.fillStyle='#8B5E3C'; x.fillRect(2,2,s-4,3); break;
    case T.DESK:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#6b4a2c'; x.fillRect(2,6,s-4,s-8);
        x.fillStyle='#8B5E3C'; x.fillRect(2,6,s-4,4);
        x.fillStyle='#555'; x.fillRect(8,8,8,2); break;
    case T.COUNTER:
        x.fillStyle='#d4dce6'; x.fillRect(0,0,s,s);
        x.fillStyle='#7a8a9a'; x.fillRect(0,4,s,s-4);
        x.fillStyle='#8a9aaa'; x.fillRect(0,4,s,4);
        x.fillStyle='#6a7a8a'; x.fillRect(2,12,s-4,s-16); break;
    case T.BOOKSHELF:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#5a3a1c'; x.fillRect(2,0,s-4,s);
        const bc=['#c0392b','#2980b9','#27ae60','#f39c12','#8e44ad'];
        for(let r=0;r<4;r++) for(let b=0;b<3;b++){x.fillStyle=bc[(r*3+b)%5]; x.fillRect(4+b*8,1+r*8,7,6);} break;
    case T.PLANT:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='#8B5E3C'; x.fillRect(s/2-4,s-10,8,10);
        x.fillStyle='#2d7a2d'; x.beginPath(); x.arc(s/2,s/2-2,10,0,Math.PI*2); x.fill();
        x.fillStyle='#3d9a3d'; x.beginPath(); x.arc(s/2+3,s/2-4,7,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s/2-4,s/2,6,0,Math.PI*2); x.fill(); break;
    case T.FRIDGE:
        x.fillStyle='#d4dce6'; x.fillRect(0,0,s,s);
        x.fillStyle='#e8e8e8'; x.fillRect(4,2,s-8,s-4);
        x.fillStyle='#ccc'; x.fillRect(4,s/2-1,s-8,2);
        x.fillStyle='#888'; x.fillRect(s-10,8,2,6); x.fillRect(s-10,s/2+4,2,6); break;
    case T.CUPBOARD:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#7a5a3a'; x.fillRect(2,2,s-4,s-4);
        x.fillStyle='#8B6E50'; x.fillRect(4,4,s/2-5,s-8); x.fillRect(s/2+1,4,s/2-5,s-8);
        x.fillStyle='#c8a040'; x.beginPath(); x.arc(s/2-4,s/2,2,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s/2+4,s/2,2,0,Math.PI*2); x.fill();
        // "?" indicator
        x.fillStyle='#ffd32a'; x.font='bold 10px sans-serif'; x.fillText('?',s/2-3,s-4); break;
    case T.BOX:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='#a08060'; x.fillRect(4,6,s-8,s-8);
        x.fillStyle='#b89070'; x.fillRect(4,6,s-8,4);
        x.strokeStyle='#706040'; x.lineWidth=1.5; x.strokeRect(4,6,s-8,s-8);
        x.fillStyle='#706040'; x.fillRect(s/2-1,6,2,s-8);
        x.fillStyle='#c8a040'; x.fillRect(s/2-3,s/2+1,6,3); break;
    case T.NOTE:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='#f5e6c8'; x.fillRect(6,4,s-12,s-8);
        x.fillStyle='#e8d4b0'; x.fillRect(6,4,s-12,3);
        x.fillStyle='#a08060'; for(let i=0;i<3;i++) x.fillRect(9,10+i*5,s-18,1); break;
    case T.COLLECTIBLE:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='rgba(255,215,0,0.25)'; x.beginPath(); x.arc(s/2,s/2,12,0,Math.PI*2); x.fill();
        x.fillStyle='#ffd32a'; x.beginPath(); x.arc(s/2,s/2,6,0,Math.PI*2); x.fill();
        x.fillStyle='#fff'; x.beginPath(); x.arc(s/2-1,s/2-1,2,0,Math.PI*2); x.fill(); break;
    case T.TREE:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='#6b4a2c'; x.fillRect(s/2-3,s/2,6,s/2);
        x.fillStyle='#1a6b1a'; x.beginPath(); x.arc(s/2,s/3,13,0,Math.PI*2); x.fill();
        x.fillStyle='#228b22'; x.beginPath(); x.arc(s/2-4,s/3+2,8,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s/2+5,s/3-1,7,0,Math.PI*2); x.fill(); break;
    case T.FLOWER:
        x.fillStyle='#5a9e4b'; x.fillRect(0,0,s,s);
        x.fillStyle='#4e8c42'; for(let i=0;i<4;i++) x.fillRect((i*9+2)%s,(i*7+3)%s,2,4);
        x.fillStyle='#ff8ca0'; x.beginPath(); x.arc(s/2,s/2,4,0,Math.PI*2); x.fill();
        x.fillStyle='#ffe066'; x.beginPath(); x.arc(s/2,s/2,2,0,Math.PI*2); x.fill();
        x.fillStyle='#a0d8ff'; x.beginPath(); x.arc(s/2+8,s/2+6,3,0,Math.PI*2); x.fill(); break;
    case T.PATH:
        x.fillStyle='#c8b896'; x.fillRect(0,0,s,s); x.fillStyle='#b8a886'; x.fillRect(1,1,s-2,s-2);
        x.fillStyle='#d8c8a6'; x.fillRect(4,4,6,6); x.fillRect(16,14,8,8); break;
    case T.WINDOW:
        x.fillStyle='#6b5b4f'; x.fillRect(0,0,s,s);
        x.fillStyle='#87CEEB'; x.fillRect(4,4,s-8,s-8);
        x.fillStyle='#a0d8ff'; x.fillRect(6,6,s/2-7,s/2-7);
        x.strokeStyle='#8B6914'; x.lineWidth=2; x.strokeRect(4,4,s-8,s-8);
        x.beginPath(); x.moveTo(s/2,4); x.lineTo(s/2,s-4); x.stroke();
        x.beginPath(); x.moveTo(4,s/2); x.lineTo(s-4,s/2); x.stroke(); break;
    case T.TOILET:
        x.fillStyle='#d4dce6'; x.fillRect(0,0,s,s);
        x.fillStyle='#f0f0f0'; x.beginPath(); x.ellipse(s/2,s/2+4,8,10,0,0,Math.PI*2); x.fill();
        x.fillStyle='#e0e0e0'; x.fillRect(s/2-6,2,12,10); break;
    case T.BATHTUB:
        x.fillStyle='#d4dce6'; x.fillRect(0,0,s,s);
        x.fillStyle='#f0f0f0'; x.fillRect(2,4,s-4,s-8);
        x.fillStyle='#d0e8f8'; x.fillRect(4,8,s-8,s-14); break;
    case T.SINK:
        x.fillStyle='#d4dce6'; x.fillRect(0,0,s,s);
        x.fillStyle='#e0e0e0'; x.fillRect(6,8,s-12,s-12);
        x.fillStyle='#a8c8e0'; x.fillRect(8,10,s-16,s-16);
        x.fillStyle='#bbb'; x.fillRect(s/2-1,4,2,6); break;
    case T.STOVE:
        x.fillStyle='#d4dce6'; x.fillRect(0,0,s,s);
        x.fillStyle='#444'; x.fillRect(2,2,s-4,s-4);
        x.fillStyle='#333'; x.beginPath(); x.arc(s/3,s/3,4,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s*2/3,s/3,4,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s/3,s*2/3,4,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s*2/3,s*2/3,4,0,Math.PI*2); x.fill(); break;
    case T.CHAIR:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#7a5a3a'; x.fillRect(6,4,s-12,s-6);
        x.fillStyle='#8B6E50'; x.fillRect(8,6,s-16,s-10);
        x.fillStyle='#6a4a2a'; x.fillRect(6,4,s-12,4); break;
    case T.DRESSER:
        x.fillStyle='#9e5080'; x.fillRect(0,0,s,s);
        x.fillStyle='#6b4a2c'; x.fillRect(2,4,s-4,s-6);
        x.fillStyle='#8B5E3C'; x.fillRect(4,6,s-8,(s-12)/2); x.fillRect(4,6+(s-12)/2+2,s-8,(s-12)/2);
        x.fillStyle='#c8a040'; x.fillRect(s/2-2,10,4,2); x.fillRect(s/2-2,s/2+4,4,2); break;
    case T.NIGHTSTAND:
        x.fillStyle='#9e5080'; x.fillRect(0,0,s,s);
        x.fillStyle='#6b4a2c'; x.fillRect(6,6,s-12,s-8);
        x.fillStyle='#8B5E3C'; x.fillRect(8,8,s-16,s-12); break;
    case T.LAMP:
        x.fillStyle='#c8a96e'; x.fillRect(0,0,s,s);
        x.fillStyle='#444'; x.fillRect(s/2-2,s/2,4,s/2);
        x.fillStyle='#ffe066';
        x.beginPath(); x.moveTo(s/2-8,s/2); x.lineTo(s/2+8,s/2); x.lineTo(s/2+4,s/4); x.lineTo(s/2-4,s/4); x.closePath(); x.fill();
        x.fillStyle='rgba(255,240,100,0.2)'; x.beginPath(); x.arc(s/2,s/2,14,0,Math.PI*2); x.fill(); break;
    case T.POOL_VASE:
        // Pool water background
        x.fillStyle='#3da8d6'; x.fillRect(0,0,s,s);
        x.fillStyle='rgba(255,255,255,0.12)';
        x.beginPath(); x.moveTo(0,s/3); x.quadraticCurveTo(s/2,s/3-5,s,s/3); x.lineTo(s,s/3+3); x.quadraticCurveTo(s/2,s/3-2,0,s/3+3); x.fill();
        // Underwater glow
        x.fillStyle='rgba(255,200,100,0.25)'; x.beginPath(); x.arc(s/2,s/2+2,13,0,Math.PI*2); x.fill();
        x.fillStyle='rgba(255,180,80,0.15)'; x.beginPath(); x.arc(s/2,s/2+2,16,0,Math.PI*2); x.fill();
        // Vase underwater - slightly transparent
        x.globalAlpha=0.75;
        x.fillStyle='#c85a28';
        x.beginPath(); x.moveTo(s/2-2,7); x.lineTo(s/2+2,7);
        x.quadraticCurveTo(s/2+8,s/2+2,s/2+6,s-5);
        x.lineTo(s/2-6,s-5);
        x.quadraticCurveTo(s/2-8,s/2+2,s/2-2,7);
        x.closePath(); x.fill();
        x.fillStyle='#e07040';
        x.beginPath(); x.moveTo(s/2,8); x.quadraticCurveTo(s/2+4,s/2,s/2+3,s-7);
        x.lineTo(s/2-1,s-7); x.quadraticCurveTo(s/2-2,s/2,s/2,8); x.closePath(); x.fill();
        x.fillStyle='#a04020'; x.beginPath(); x.ellipse(s/2,7,3,2,0,0,Math.PI*2); x.fill();
        x.globalAlpha=1;
        // Bubbles
        x.fillStyle='rgba(255,255,255,0.5)';
        x.beginPath(); x.arc(s/2+5,6,2,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s/2-3,9,1.5,0,Math.PI*2); x.fill();
        x.beginPath(); x.arc(s/2+2,3,1,0,Math.PI*2); x.fill();
        break;
    default: x.fillStyle='#111'; x.fillRect(0,0,s,s);
    }
}
