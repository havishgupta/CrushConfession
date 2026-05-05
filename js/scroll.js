/* ============ SCROLL LETTER SCREEN ============ */
function initScroll() {
    createFloatingHearts(document.querySelector('.floating-hearts'));
    document.getElementById('btn-continue-scroll').addEventListener('click', () => {
        showScreen('screen-rules');
    });
}
