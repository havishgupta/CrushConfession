/* ============ VASE BREAKING ANIMATION ============ */
function startVaseAnimation() {
    const letters = CONFIG.yourName.replace(/\s/g, '').split('');
    // Shuffle for display
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    
    const row = document.getElementById('vases-row');
    row.innerHTML = ''; // Clear existing
    
    shuffled.forEach((char) => {
        const box = document.createElement('div');
        box.className = 'vase-box';
        box.dataset.letter = char.toUpperCase();
        box.innerHTML = `<div class="vase-sprite"><svg width="36" height="44" viewBox="0 0 40 48"><path d="M20 4c-3 0-5 2-5 4v3c-4 0-9 3-9 14v8h28v-8c0-11-5-14-9-14V8c0-2-2-4-5-4z" fill="#d4763a"/><ellipse cx="20" cy="6" rx="5" ry="3" fill="#e88848"/><rect x="13" y="27" width="14" height="3" rx="1" fill="#c06030"/></svg></div>`;
        row.appendChild(box);
    });

    const boxes = row.querySelectorAll('.vase-box');
    let bi = 0;
    const sub = document.getElementById('vase-anim-sub');
    sub.textContent = "Watch closely...";

    const interval = setInterval(() => {
        if (bi >= boxes.length) {
            clearInterval(interval);
            setTimeout(() => {
                sub.textContent = "Click to unscramble!";
                showScreen('screen-wordle');
                initWordle();
            }, 2000);
            return;
        }
        const b = boxes[bi];
        b.classList.add('breaking');
        setTimeout(() => {
            b.classList.remove('breaking');
            b.classList.add('broken');
            const lE = document.createElement('div');
            lE.className = 'revealed-letter';
            lE.style.cssText = "position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:48px; font-weight:900; color:#ffd32a; animation:popIn .5s ease";
            lE.textContent = b.dataset.letter;
            b.appendChild(lE);
            bi++;
        }, 800);
    }, 1200);
}
