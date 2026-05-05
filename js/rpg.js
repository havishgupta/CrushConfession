/* RPG GAME ENGINE v3 - Zoomed, Girl character, Vase popups, Tablet support */
let rpgState = null;
const ZOOM = 1.6;
const isTouch = ('ontouchstart' in window);

function startRPGGame() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    rpgState = {
        canvas, ctx,
        player: {x:PLAYER_SPAWN.x*TILE_SIZE+8, y:PLAYER_SPAWN.y*TILE_SIZE+8, w:14, h:14, speed:3, floor:0, dir:2, frame:0},
        camera:{x:0,y:0}, keys:{}, lives:3, vasesFound:0, foundVases:new Set(),
        openedCupboards:new Set(), brokenBoxes:new Set(), readNotes:new Set(),
        collectedItems:[], hotbar:[null,null,null], timer:40*60, totalTime:0,
        isNight:false, nightOverlay:0, monsters:[], monsterSpawnTimer:0,
        interactTarget:null, showingNote:false, gameOver:false, paused:false,
        lastTime:performance.now(), timerInterval:null, animFrame:null, tutorialShown:false
    };
    const onKD = (e) => { rpgState.keys[e.key.toLowerCase()]=true; if(e.key==='Escape') closeNote(); };
    const onKU = (e) => { rpgState.keys[e.key.toLowerCase()]=false; if(e.key.toLowerCase()==='e') handleInteract(); };
    document.addEventListener('keydown', onKD); document.addEventListener('keyup', onKU);
    rpgState._keyDown=onKD; rpgState._keyUp=onKU;
    document.getElementById('note-close').onclick = closeNote;
    if(isTouch) setupTouchControls();
    rpgState.timerInterval = setInterval(() => {
        if(rpgState.paused||rpgState.gameOver) return;
        rpgState.timer--; rpgState.totalTime++;
        updateHUD(); updateDayNight();
        if(!rpgState.tutorialShown && rpgState.totalTime>=8) { rpgState.tutorialShown=true; showTutorialPopup(); }
        if(rpgState.timer<=0) { rpgState.gameOver=true; clearInterval(rpgState.timerInterval); cancelAnimationFrame(rpgState.animFrame); showGameOverPopup(); }
    }, 1000);
    updateProgressHint();
    gameLoop();
}

function setupTouchControls() {
    const tc = document.getElementById('touch-controls'); if(tc) tc.classList.remove('hidden');
    ['touch-up','touch-down','touch-left','touch-right'].forEach(id => {
        const b = document.getElementById(id); if(!b) return;
        const k = {up:'w',down:'s',left:'a',right:'d'}[id.replace('touch-','')];
        b.addEventListener('touchstart', (e)=>{e.preventDefault();rpgState.keys[k]=true;});
        b.addEventListener('touchend', (e)=>{e.preventDefault();rpgState.keys[k]=false;});
    });
    const eb = document.getElementById('touch-action'); if(eb) {
        eb.addEventListener('touchstart', (e)=>{e.preventDefault();handleInteract();});
    }
}

function showTutorialPopup() {
    rpgState.paused=true;
    document.getElementById('tutorial-popup').classList.remove('hidden');
    document.getElementById('tutorial-close').onclick = () => { document.getElementById('tutorial-popup').classList.add('hidden'); rpgState.paused=false; };
}

function updateDayNight() {
    const cycle = rpgState.totalTime % 1200;
    if(cycle<900) {
        rpgState.isNight=false; rpgState.nightOverlay=0;
        document.getElementById('hud-daynight').innerHTML='<svg width="14" height="14" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" fill="#ffd32a"/><g stroke="#ffd32a" stroke-width="1.5"><line x1="8" y1="0" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="16"/><line x1="0" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="16" y2="8"/></g></svg> Day';
    } else {
        rpgState.isNight=true;
        const p=(cycle-900)/300;
        rpgState.nightOverlay=Math.min(0.35, p<0.2?p*1.75:p>0.8?(1-p)*1.75:0.35);
        document.getElementById('hud-daynight').innerHTML='<svg width="14" height="14" viewBox="0 0 16 16"><path d="M10 2a6 6 0 1 0 4 10A5 5 0 0 1 10 2z" fill="#c0c8e0"/></svg> Night';
        rpgState.monsterSpawnTimer++;
        if(rpgState.monsterSpawnTimer>12&&rpgState.monsters.length<3){rpgState.monsterSpawnTimer=0;spawnMonster();}
    }
    if(!rpgState.isNight){rpgState.monsters=[];rpgState.monsterSpawnTimer=0;}
}

function spawnMonster() {
    const map=MAPS[rpgState.player.floor]; let mx,my,a=0;
    do{mx=Math.floor(Math.random()*MAP_W);my=Math.floor(Math.random()*MAP_H);a++;}
    while(a<100&&(SOLID_TILES.has(map[my]?.[mx])||map[my]?.[mx]===T.VOID||Math.abs(mx*TILE_SIZE-rpgState.player.x)<160));
    if(a<100) rpgState.monsters.push({x:mx*TILE_SIZE+8,y:my*TILE_SIZE+8,w:16,h:16,speed:0.5+Math.random()*0.4,lastHit:0,phase:Math.random()*6.28});
}

function gameLoop() {
    if(rpgState.gameOver) return;
    const now=performance.now(), dt=Math.min((now-rpgState.lastTime)/16.67,3); rpgState.lastTime=now;
    if(!rpgState.paused&&!rpgState.showingNote){updatePlayer(dt);updateMonsters(dt);checkInteractables();checkCollectibles();}
    updateCamera(); render();
    rpgState.animFrame=requestAnimationFrame(gameLoop);
}

function updatePlayer(dt) {
    const p=rpgState.player; let dx=0,dy=0;
    if(rpgState.keys['w']||rpgState.keys['arrowup']) dy-=p.speed*dt;
    if(rpgState.keys['s']||rpgState.keys['arrowdown']) dy+=p.speed*dt;
    if(rpgState.keys['a']||rpgState.keys['arrowleft']) dx-=p.speed*dt;
    if(rpgState.keys['d']||rpgState.keys['arrowright']) dx+=p.speed*dt;
    if(dx||dy) p.frame+=.15*dt;
    if(dy<0)p.dir=0;else if(dy>0)p.dir=2; if(dx<0)p.dir=3;else if(dx>0)p.dir=1;
    let nx=p.x+dx; if(!checkCollision(nx,p.y,p.w,p.h,p.floor)) p.x=nx;
    let ny=p.y+dy; if(!checkCollision(p.x,ny,p.w,p.h,p.floor)) p.y=ny;
    p.x=Math.max(0,Math.min(p.x,MAP_W*TILE_SIZE-p.w));
    p.y=Math.max(0,Math.min(p.y,MAP_H*TILE_SIZE-p.h));
}

function checkCollision(x,y,w,h,floor) {
    const map=MAPS[floor];
    for(const[cx,cy] of [[x,y],[x+w,y],[x,y+h],[x+w,y+h]]) {
        const tx=Math.floor(cx/TILE_SIZE),ty=Math.floor(cy/TILE_SIZE);
        if(tx<0||tx>=MAP_W||ty<0||ty>=MAP_H) return true;
        const t=map[ty]?.[tx];
        if(t===T.VOID||SOLID_TILES.has(t)){
            if(t===T.CUPBOARD&&rpgState.openedCupboards.has(`${floor}-${tx}-${ty}`)) continue;
            if(t===T.BOX&&rpgState.brokenBoxes.has(`${floor}-${tx}-${ty}`)) continue;
            return true;
        }
    }
    return false;
}

function updateMonsters(dt) {
    const p=rpgState.player, now=performance.now();
    rpgState.monsters.forEach(m => {
        const dx=p.x-m.x,dy=p.y-m.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist>10){m.x+=(dx/dist)*m.speed*dt;m.y+=(dy/dist)*m.speed*dt;} m.phase+=.05*dt;
        if(dist<20&&now-m.lastHit>2000){m.lastHit=now;rpgState.lives--;updateHUD();
            if(rpgState.lives<=0){rpgState.gameOver=true;clearInterval(rpgState.timerInterval);cancelAnimationFrame(rpgState.animFrame);showGameOverPopup();}}
    });
}

function checkInteractables() {
    const p=rpgState.player, map=MAPS[p.floor], pcx=p.x+p.w/2, pcy=p.y+p.h/2; let found=null;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
        const tx=Math.floor(pcx/TILE_SIZE)+dx, ty=Math.floor(pcy/TILE_SIZE)+dy;
        if(tx<0||tx>=MAP_W||ty<0||ty>=MAP_H) continue;
        if(INTERACTIVE_TILES.has(map[ty][tx])&&Math.sqrt((pcx-(tx*TILE_SIZE+16))**2+(pcy-(ty*TILE_SIZE+16))**2)<48){found={tx,ty,tile:map[ty][tx]};break;}
        if(found) break;
    }
    rpgState.interactTarget=found;
    document.getElementById('interact-prompt').classList.toggle('hidden',!found||rpgState.showingNote);
}

function checkCollectibles() {
    const p=rpgState.player, pcx=p.x+p.w/2, pcy=p.y+p.h/2;
    COLLECTIBLE_ITEMS.forEach((item,i) => {
        if(item.floor!==p.floor||rpgState.collectedItems.includes(i)) return;
        if(Math.sqrt((pcx-(item.x*TILE_SIZE+16))**2+(pcy-(item.y*TILE_SIZE+16))**2)<32){
            rpgState.collectedItems.push(i);
            for(let s=0;s<3;s++) if(!rpgState.hotbar[s]){rpgState.hotbar[s]=item;updateHotbar();break;}
        }
    });
}

function handleInteract() {
    if(rpgState.gameOver||!rpgState.interactTarget||rpgState.showingNote) return;
    const{tx,ty,tile}=rpgState.interactTarget, p=rpgState.player, key=`${p.floor}-${tx}-${ty}`;
    if(tile===T.VASE_VISIBLE&&!rpgState.foundVases.has(key)){
        rpgState.foundVases.add(key); rpgState.vasesFound++;
        MAPS[p.floor][ty][tx]=p.floor===0?T.WOOD:T.CARPET;
        showVasePopup(); updateHUD(); updateProgressHint(); checkAllVases();
    } else if(tile===T.CUPBOARD&&!rpgState.openedCupboards.has(key)){
        rpgState.openedCupboards.add(key);
        const v=VASE_LOCATIONS.find(v=>v.floor===p.floor&&v.x===tx&&v.y===ty&&v.type==='cupboard');
        if(v&&!rpgState.foundVases.has(v.id)){rpgState.foundVases.add(v.id);rpgState.vasesFound++;showVasePopup();updateHUD();updateProgressHint();checkAllVases();}
    } else if(tile===T.BOX&&!rpgState.brokenBoxes.has(key)){
        rpgState.brokenBoxes.add(key);
        const v=VASE_LOCATIONS.find(v=>v.floor===p.floor&&v.x===tx&&v.y===ty&&v.type==='box');
        if(v&&!rpgState.foundVases.has(v.id)){rpgState.foundVases.add(v.id);rpgState.vasesFound++;showVasePopup();updateHUD();updateProgressHint();checkAllVases();}
    } else if(tile===T.POOL_VASE){
        const v=VASE_LOCATIONS.find(v=>v.floor===p.floor&&v.x===tx&&v.y===ty&&v.type==='pool');
        if(v&&!rpgState.foundVases.has(v.id)){rpgState.foundVases.add(v.id);rpgState.vasesFound++;
        MAPS[p.floor][ty][tx]=T.POOL; // turn back to regular pool
        showVasePopup();updateHUD();updateProgressHint();checkAllVases();}
    } else if(tile===T.NOTE){
        const ni=NOTE_LOCATIONS.findIndex(n=>n.floor===p.floor&&n.x===tx&&n.y===ty);
        showNote(NOTE_CONTENTS[ni>=0&&ni<NOTE_CONTENTS.length?ni:0]);
    } else if(tile===T.STAIRS_UP||tile===T.STAIRS_DOWN){
        const s=STAIRS.find(s=>s.floor===p.floor&&s.x===tx&&s.y===ty);
        if(s){p.floor=s.target.floor;p.x=s.target.x*TILE_SIZE+8;p.y=s.target.y*TILE_SIZE+8;rpgState.monsters=[];
        document.getElementById('hud-floor').textContent=p.floor===0?'Ground Floor':'Upper Floor';}
    }
}

function showVasePopup() {
    const el=document.getElementById('vase-found-popup'); el.classList.remove('hidden');
    el.querySelector('.vfp-count').textContent=`${rpgState.vasesFound}/6`;
    el.querySelector('.vfp-msg').textContent=rpgState.vasesFound>=6?'All found!':PROGRESS_HINTS[rpgState.vasesFound]||'Keep looking!';
    setTimeout(()=>el.classList.add('hidden'), 2200);
}

function updateProgressHint() {
    document.getElementById('hud-hint').textContent=PROGRESS_HINTS[rpgState.vasesFound]||'Find all 6 vases!';
}

function showNote(text){rpgState.showingNote=true;rpgState.paused=true;document.getElementById('note-text').textContent=text;document.getElementById('note-display').classList.remove('hidden');}
function closeNote(){if(!rpgState.showingNote)return;rpgState.showingNote=false;rpgState.paused=false;document.getElementById('note-display').classList.add('hidden');}

function checkAllVases() {
    if(rpgState.vasesFound>=6){rpgState.gameOver=true;clearInterval(rpgState.timerInterval);cancelAnimationFrame(rpgState.animFrame);
    document.removeEventListener('keydown',rpgState._keyDown);document.removeEventListener('keyup',rpgState._keyUp);
    setTimeout(()=>{showScreen('screen-vase-anim');startVaseAnimation();},1500);}
}

function updateHUD() {
    document.getElementById('hud-timer').textContent=formatTime(rpgState.timer);
    document.getElementById('vase-count').textContent=rpgState.vasesFound;
    const h=document.getElementById('hud-lives').children;
    for(let i=0;i<3;i++) h[i].classList.toggle('lost',i>=rpgState.lives);
}

function updateHotbar() {
    for(let i=0;i<3;i++){const s=document.getElementById(`hotbar-${i+1}`).querySelector('.hotbar-item');
    if(rpgState.hotbar[i]){s.innerHTML=getItemSVG(rpgState.hotbar[i].name);s.classList.remove('empty');}}
}

function getItemSVG(n) {
    return {
        'Hammer':'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="10" y="8" width="4" height="14" rx="1" fill="#8B5E3C"/><rect x="4" y="2" width="16" height="8" rx="2" fill="#888"/><rect x="6" y="3" width="12" height="6" rx="1" fill="#aaa"/></svg>',
        'Lantern':'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="8" y="4" width="8" height="2" rx="1" fill="#888"/><rect x="7" y="6" width="10" height="12" rx="3" fill="#ffd32a" opacity=".8"/><circle cx="12" cy="12" r="3" fill="#fff" opacity=".5"/><rect x="10" y="18" width="4" height="3" rx="1" fill="#888"/></svg>',
        'Map':'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1" fill="#f5e6c8"/><line x1="6" y1="10" x2="18" y2="10" stroke="#a08060"/><line x1="6" y1="13" x2="16" y2="13" stroke="#a08060"/><circle cx="16" cy="15" r="2" fill="#e74c6f"/></svg>'
    }[n]||'';
}

function updateCamera() {
    const p=rpgState.player, vw=rpgState.canvas.width/ZOOM, vh=rpgState.canvas.height/ZOOM;
    rpgState.camera.x=Math.max(0,Math.min(p.x+p.w/2-vw/2, MAP_W*TILE_SIZE-vw));
    rpgState.camera.y=Math.max(0,Math.min(p.y+p.h/2-vh/2, MAP_H*TILE_SIZE-vh));
}

function render() {
    const{ctx,canvas,camera,player}=rpgState, map=MAPS[player.floor];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save(); ctx.scale(ZOOM,ZOOM);
    const vw=canvas.width/ZOOM, vh=canvas.height/ZOOM;
    const sc=Math.floor(camera.x/TILE_SIZE), ec=Math.ceil((camera.x+vw)/TILE_SIZE);
    const sr=Math.floor(camera.y/TILE_SIZE), er=Math.ceil((camera.y+vh)/TILE_SIZE);

    for(let row=sr;row<=er&&row<MAP_H;row++) for(let col=sc;col<=ec&&col<MAP_W;col++){
        if(row<0||col<0) continue;
        let tile=map[row]?.[col]; if(tile===undefined) tile=T.VOID;
        if(tile===T.CUPBOARD&&rpgState.openedCupboards.has(`${player.floor}-${col}-${row}`)) tile=player.floor===0?T.TILE:T.CARPET;
        if(tile===T.BOX&&rpgState.brokenBoxes.has(`${player.floor}-${col}-${row}`)) tile=player.floor===0?T.GRASS:T.CARPET;
        const dx=col*TILE_SIZE-camera.x, dy=row*TILE_SIZE-camera.y;
        ctx.drawImage(getSpriteCanvas(tile,TILE_SIZE), dx, dy);
        // Animated glow for pool vase
        if(tile===T.POOL_VASE) {
            const glowR=8+Math.sin(performance.now()/500)*4;
            ctx.fillStyle=`rgba(255,200,80,${0.15+Math.sin(performance.now()/400)*0.1})`;
            ctx.beginPath(); ctx.arc(dx+TILE_SIZE/2,dy+TILE_SIZE/2,glowR,0,Math.PI*2); ctx.fill();
        }
    }

    // Collectibles
    COLLECTIBLE_ITEMS.forEach((item,i)=>{
        if(item.floor!==player.floor||rpgState.collectedItems.includes(i)) return;
        const sx=item.x*TILE_SIZE-camera.x, sy=item.y*TILE_SIZE-camera.y, bob=Math.sin(performance.now()/400+i)*3;
        ctx.fillStyle='rgba(255,215,0,0.2)'; ctx.beginPath(); ctx.arc(sx+16,sy+16+bob,14,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#ffd32a'; ctx.beginPath(); ctx.arc(sx+16,sy+16+bob,6,0,Math.PI*2); ctx.fill();
    });

    // Monsters
    rpgState.monsters.forEach(m=>{
        const sx=m.x-camera.x,sy=m.y-camera.y,pulse=Math.sin(m.phase)*2;
        ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(sx+8,sy+18,8,3,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#8a2040'; ctx.beginPath(); ctx.arc(sx+8,sy+8,10+pulse,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#a83050'; ctx.beginPath(); ctx.arc(sx+8,sy+7,8+pulse,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#fff'; ctx.fillRect(sx+3,sy+4,5,5); ctx.fillRect(sx+10,sy+4,5,5);
        ctx.fillStyle='#f00'; ctx.fillRect(sx+5,sy+5,2,3); ctx.fillRect(sx+12,sy+5,2,3);
        ctx.fillStyle='#5a1020';
        ctx.beginPath(); ctx.moveTo(sx+2,sy+2); ctx.lineTo(sx-2,sy-4); ctx.lineTo(sx+6,sy+2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(sx+14,sy+2); ctx.lineTo(sx+18,sy-4); ctx.lineTo(sx+10,sy+2); ctx.fill();
    });

    // CHARACTER RENDERING
    const px=player.x-camera.x, py=player.y-camera.y;
    ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(px+7,py+17,6,2.5,0,0,Math.PI*2); ctx.fill();

    if (CONFIG.gender === 'male') {
        // BOY CHARACTER
        // Hair back
        ctx.fillStyle='#2a1a0a'; ctx.beginPath(); ctx.arc(px+7,py+3,5,0,Math.PI*2); ctx.fill();
        // Body (Shirt)
        ctx.fillStyle='#87CEEB'; ctx.fillRect(px+2,py+6,10,8);
        // Head
        ctx.fillStyle='#ffe0c0'; ctx.beginPath(); ctx.arc(px+7,py+4,5,0,Math.PI*2); ctx.fill();
        // Hair front (spiky look)
        ctx.fillStyle='#2a1a0a'; 
        ctx.beginPath(); ctx.moveTo(px+2,py+2); ctx.lineTo(px+7,py+0); ctx.lineTo(px+12,py+2); ctx.lineTo(px+12,py+4); ctx.lineTo(px+2,py+4); ctx.closePath(); ctx.fill();
        // Eyes
        ctx.fillStyle='#333';
        if(player.dir===0){ctx.fillRect(px+4,py+3,2,2);ctx.fillRect(px+8,py+3,2,2);}
        else if(player.dir===2){ctx.fillRect(px+5,py+5,2,2);ctx.fillRect(px+9,py+5,2,2);}
        else if(player.dir===3){ctx.fillRect(px+3,py+4,2,2);ctx.fillRect(px+6,py+4,2,2);}
        else{ctx.fillRect(px+7,py+4,2,2);ctx.fillRect(px+10,py+4,2,2);}
        // Legs
        ctx.fillStyle='#2f3542'; const lo=Math.sin(player.frame*2)*2;
        ctx.fillRect(px+3,py+14,3,3+lo); ctx.fillRect(px+8,py+14,3,3-lo);
        // Shoes
        ctx.fillStyle='#333'; ctx.fillRect(px+2,py+17+(lo>0?lo:0),4,2); ctx.fillRect(px+7,py+17-(lo>0?0:lo),4,2);
    } else {
        // GIRL CHARACTER
        // Hair back
        ctx.fillStyle='#4a2a10'; ctx.beginPath(); ctx.arc(px+7,py+3,6,0,Math.PI*2); ctx.fill();
        ctx.fillRect(px+1,py+3,3,10); ctx.fillRect(px+10,py+3,3,10); // long hair sides
        // Body/dress
        ctx.fillStyle='#f8a5c2'; ctx.fillRect(px+2,py+6,10,7);
        // Dress flare
        ctx.fillStyle='#f090b0'; ctx.beginPath(); ctx.moveTo(px+1,py+13); ctx.lineTo(px+13,py+13);
        ctx.lineTo(px+14,py+16); ctx.lineTo(px,py+16); ctx.closePath(); ctx.fill();
        // Head
        ctx.fillStyle='#ffe0c0'; ctx.beginPath(); ctx.arc(px+7,py+4,5,0,Math.PI*2); ctx.fill();
        // Hair front
        ctx.fillStyle='#5a3018'; ctx.beginPath(); ctx.arc(px+7,py+2,5,Math.PI,Math.PI*2); ctx.fill();
        ctx.fillRect(px+2,py+1,10,2);
        // Hair bow
        ctx.fillStyle='#ff6b8a'; ctx.beginPath(); ctx.arc(px+11,py+2,2.5,0,Math.PI*2); ctx.fill();
        // Eyes
        ctx.fillStyle='#333';
        if(player.dir===0){ctx.fillRect(px+4,py+3,2,2);ctx.fillRect(px+8,py+3,2,2);ctx.fillStyle='#fff';ctx.fillRect(px+4,py+3,1,1);ctx.fillRect(px+8,py+3,1,1);}
        else if(player.dir===2){ctx.fillRect(px+5,py+5,2,2);ctx.fillRect(px+9,py+5,2,2);}
        else if(player.dir===3){ctx.fillRect(px+3,py+4,2,2);ctx.fillRect(px+6,py+4,2,2);}
        else{ctx.fillRect(px+7,py+4,2,2);ctx.fillRect(px+10,py+4,2,2);}
        // Blush
        ctx.fillStyle='rgba(255,150,150,0.4)'; ctx.beginPath(); ctx.arc(px+3,py+5,1.5,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(px+11,py+5,1.5,0,Math.PI*2); ctx.fill();
        // Legs
        ctx.fillStyle='#ffe0c0'; const lo=Math.sin(player.frame*2)*2;
        ctx.fillRect(px+3,py+16,3,2+lo); ctx.fillRect(px+8,py+16,3,2-lo);
        // Shoes
        ctx.fillStyle='#ff6b8a'; ctx.fillRect(px+2,py+17+(lo>0?lo:0),4,2); ctx.fillRect(px+7,py+17-(lo>0?0:lo),4,2);
    }

    // Interact highlight
    if(rpgState.interactTarget){
        const{tx,ty}=rpgState.interactTarget;
        ctx.strokeStyle='#ffd32a'; ctx.lineWidth=2; ctx.setLineDash([4,4]);
        ctx.strokeRect(tx*TILE_SIZE-camera.x,ty*TILE_SIZE-camera.y,TILE_SIZE,TILE_SIZE);
        ctx.setLineDash([]); ctx.lineWidth=1;
    }

    // Night overlay
    if(rpgState.nightOverlay>0){
        ctx.fillStyle=`rgba(15,15,50,${rpgState.nightOverlay})`; ctx.fillRect(0,0,vw,vh);
        if(rpgState.hotbar.some(h=>h&&h.name==='Lantern')){
            ctx.save(); ctx.globalCompositeOperation='destination-out';
            const g=ctx.createRadialGradient(px+7,py+8,20,px+7,py+8,100);
            g.addColorStop(0,'rgba(0,0,0,0.7)'); g.addColorStop(1,'rgba(0,0,0,0)');
            ctx.fillStyle=g; ctx.beginPath(); ctx.arc(px+7,py+8,100,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
    }
    ctx.restore();

    // Minimap (drawn outside zoom)
    const mmW=100,mmH=80,mx=canvas.width-mmW-8,my=canvas.height-mmH-8;
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(mx-2,my-2,mmW+4,mmH+4);
    ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.strokeRect(mx-2,my-2,mmW+4,mmH+4);
    const sX=mmW/MAP_W, sY=mmH/MAP_H;
    const mc={[T.GRASS]:'#5a9e4b',[T.WOOD]:'#c8a96e',[T.TILE]:'#d4dce6',[T.WALL]:'#6b5b4f',[T.POOL]:'#3da8d6',[T.POOL_EDGE]:'#c8b896',[T.FENCE]:'#8B6914',[T.PATIO]:'#b8a898',[T.CARPET]:'#9e5080',[T.WALL_TOP]:'#8b7355',[T.TREE]:'#1a6b1a',[T.PATH]:'#c8b896',[T.WINDOW]:'#87CEEB'};
    for(let r=0;r<MAP_H;r++) for(let c=0;c<MAP_W;c++){const t=map[r][c];if(t===T.VOID)continue;ctx.globalAlpha=.5;ctx.fillStyle=mc[t]||'#555';ctx.fillRect(mx+c*sX,my+r*sY,Math.ceil(sX),Math.ceil(sY));}
    ctx.globalAlpha=1;
    if(rpgState.hotbar.some(h=>h&&h.name==='Map')) VASE_LOCATIONS.forEach(v=>{if(v.floor!==player.floor||rpgState.foundVases.has(v.id))return;ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(mx+v.x*sX+sX/2,my+v.y*sY+sY/2,3,0,Math.PI*2);ctx.fill();});
    ctx.fillStyle='#0f0'; ctx.fillRect(mx+(player.x/TILE_SIZE)*sX-1,my+(player.y/TILE_SIZE)*sY-1,3,3);
}
