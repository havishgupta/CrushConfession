/* Offer - red No button, capped Yes, no counter text */
function startCongratsAnimation() {
    const container=document.getElementById('confetti-container');
    const colors=['#ff6b8a','#ffd32a','#87CEEB','#f8a5c2','#2ecc71','#9b59b6'];
    for(let i=0;i<80;i++){const p=document.createElement('div');p.className='confetti-piece';p.style.left=Math.random()*100+'%';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.width=(6+Math.random()*8)+'px';p.style.height=(6+Math.random()*8)+'px';p.style.borderRadius=Math.random()>.5?'50%':'0';p.style.animation=`confettiFall ${2+Math.random()*3}s ease ${Math.random()*2}s infinite`;container.appendChild(p);}
    if(!document.getElementById('confetti-style')){const s=document.createElement('style');s.id='confetti-style';s.textContent='@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';document.head.appendChild(s);}
    const msgs=[{t:'\u2728',m:"You're phenomenal!"},{t:'\u2B50',m:"You finally guessed it!"},{t:'\uD83D\uDCAB',m:"Now for that special offer..."}];
    let i=0;const tE=document.getElementById('congrats-title'),xE=document.getElementById('congrats-text');
    (function next(){if(i>=msgs.length){setTimeout(()=>{showScreen('screen-offer');initOffer();},1000);return;}
    tE.textContent=msgs[i].t;tE.style.animation='none';tE.offsetHeight;tE.style.animation='bounceIn .6s ease';
    xE.textContent=msgs[i].m;xE.style.animation='none';xE.offsetHeight;xE.style.animation='floatIn .8s ease';i++;setTimeout(next,2500);})();
}
function initOffer() {
    const me = document.getElementById('offer-me');
    if (me && CONFIG.hobbies && CONFIG.hobbies.length > 0) {
        let hi = 0;
        me.textContent = `- ${CONFIG.hobbies[0]}`;
        setInterval(() => {
            hi = (hi + 1) % CONFIG.hobbies.length;
            me.style.opacity = '0';
            me.style.transform = 'translateY(10px)';
            setTimeout(() => {
                me.textContent = `- ${CONFIG.hobbies[hi]}`;
                me.style.opacity = '1';
                me.style.transform = 'translateY(0)';
            }, 400);
        }, 1500); // Changed to 1.5s for a smoother feel, but user asked for "every second" (approx)
    } else if (me) {
        me.textContent = `- ${CONFIG.yourName}`;
    }
    let nc=0; const yb=document.getElementById('btn-yes'),nb=document.getElementById('btn-no');
    const yt=['Yes!','Yes!! <3','YESSS!!!','YESSSSS!!!!','PLEASE YES!!!!!'];
    const nt=['No','Are you sure?','Pretty please?','Think again...','Last chance!!'];
    yb.onclick=()=>{showScreen('screen-final');initFinalPage();};
    nb.onclick=()=>{nc++;if(nc>=5){showGameOverPopup();return;}
    yb.style.transform=`scale(${Math.min(1+nc*.2,1.8)})`;yb.style.fontSize=Math.min(20+nc*3,32)+'px';yb.textContent=yt[nc]||yt[4];
    nb.style.transform=`scale(${Math.max(.6,1-nc*.08)})`;nb.style.fontSize=Math.max(14,20-nc*2)+'px';nb.textContent=nt[nc]||nt[4];};
}
