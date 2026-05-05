/* ============ CUSTOM POPUP ============ */
function showGameOverPopup(callback) {
    const popup = document.getElementById('custom-popup');
    popup.classList.remove('hidden');
    setTimeout(() => {
        if (callback) callback();
        // Close the page
        window.open('', '_self');
        window.close();
        // Fallback: blank the page
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a1a;color:#f8a5c2;font-family:Outfit,sans-serif;font-size:32px;text-align:center;">👋🏻 Tough luck, goodbye!</div>';
    }, 2500);
}
