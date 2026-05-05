/* ============ UTILITY FUNCTIONS ============ */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => { s.classList.add('hidden'); s.classList.remove('active'); });
    const el = document.getElementById(id);
    if (el) { el.classList.remove('hidden'); el.classList.add('active'); }
}

function createFloatingHearts(container) {
    const heartSVG = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 18s-7-5-7-10a4 4 0 0 1 7-1 4 4 0 0 1 7 1c0 5-7 10-7 10z" fill="currentColor"/></svg>`;
    const colors = ['#f8a5c2', '#ff6b8a', '#87CEEB', '#ffd32a', '#ff4466', '#a0d8ff'];
    for (let i = 0; i < 18; i++) {
        const heart = document.createElement('span');
        heart.className = 'float-heart';
        heart.innerHTML = heartSVG;
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.fontSize = (14 + Math.random() * 16) + 'px';
        container.appendChild(heart);
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60), s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
