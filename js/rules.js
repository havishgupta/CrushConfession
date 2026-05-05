/* ============ RULES SCREEN ============ */
function initRules() {
    document.getElementById('btn-start-game').addEventListener('click', () => {
        showScreen('screen-game');
        startRPGGame();
    });
}
