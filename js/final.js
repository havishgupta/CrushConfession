/* Final page with celebration image — removed insecure client-side email */
function initFinalPage() {
    initScratchCards();
    // Note: Email notification removed — it exposed API keys client-side.
    // To get notified, use a backend service or serverless function instead.
}

function initScratchCards() {
    document.querySelectorAll('.scratch-card').forEach(card => {
        const canvas = card.querySelector('.scratch-canvas');
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#87CEEB'); gradient.addColorStop(0.5, '#f8a5c2'); gradient.addColorStop(1, '#87CEEB');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Outfit'; ctx.textAlign = 'center';
        ctx.fillText('Scratch Here', canvas.width / 2, canvas.height / 2 + 5);
        let isDrawing = false, scratched = 0;
        const total = canvas.width * canvas.height;
        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
            const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
            scratched += 1260;
            if (scratched > total * 0.4) { canvas.style.opacity = '0'; canvas.style.pointerEvents = 'none'; }
        }
        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; e.preventDefault(); });
        canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); });
        canvas.addEventListener('touchend', () => isDrawing = false);
    });
}
