/* ============ VASE BREAKING ANIMATION ============ */
function startVaseAnimation() {
    const letters = CONFIG.crushName.replace(/\s/g, '').split('');
    // Shuffle for display
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    
    const row = document.getElementById('vases-row');
    row.innerHTML = '';
    
    // Create boxes
    letters.forEach((_, i) => {
        const box = document.createElement('div');
        box.className = 'vase-box';
        box.innerHTML = `<div class="vase-sprite"><svg width="36" height="44" viewBox="0 0 40 48"><path d="M20 4c-3 0-5 2-5 4v3c-4 0-9 3-9 14v8h28v-8c0-11-5-14-9-14V8c0-2-2-4-5-4z" fill="#d4763a"/><ellipse cx="20" cy="6" rx="5" ry="3" fill="#e88848"/><rect x="13" y="27" width="14" height="3" rx="1" fill="#c06030"/></svg></div>`;
        const letterSpan = document.createElement('span');
        letterSpan.className = 'vase-letter';
        letterSpan.textContent = shuffled[i];
        box.appendChild(letterSpan);
        row.appendChild(box);
    });
    
    const boxes = document.querySelectorAll('.vase-box');

    // Break vases one by one
    let delay = 1500;
    boxes.forEach((box, i) => {
        setTimeout(() => {
            box.classList.add('breaking');
            setTimeout(() => {
                box.classList.add('broken');
                box.style.borderColor = '#ffd32a';
                box.style.background = 'rgba(255,211,42,0.1)';
            }, 500);
        }, delay + i * 800);
    });

    // After all vases break, show wordle
    setTimeout(() => {
        document.getElementById('vase-anim-sub').textContent = 'Can you guess the name from these letters?';
        setTimeout(() => {
            showScreen('screen-wordle');
            initWordle();
        }, 2000);
    }, delay + boxes.length * 800 + 1000);
}
