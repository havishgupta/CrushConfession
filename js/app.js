/* APP CONTROLLER */
document.addEventListener('DOMContentLoaded', () => {
    // Populate dynamic texts from CONFIG
    document.querySelectorAll('.highlight-name').forEach(el => el.textContent = CONFIG.crushName);
    const len = CONFIG.crushName.length;
    
    // Update rules and hints
    const ruleText = document.querySelector('.rule-text p strong');
    if (ruleText) ruleText.textContent = `${len} hidden vases`;
    const tutorialP = document.querySelector('#tutorial-popup p strong');
    if (tutorialP) tutorialP.textContent = `${len} vases`;
    const hudVases = document.getElementById('hud-vases');
    if (hudVases) hudVases.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1c-1 0-2 1-2 2v1c-1.5 0-3.5 1-3.5 5v3h11v-3c0-4-2-5-3.5-5V3c0-1-1-2-2-2z" fill="#d4763a"/></svg> <span id="vase-count">0</span>/${len}`;
    const vfpCount = document.querySelector('.vfp-count');
    if (vfpCount) vfpCount.textContent = `1/${len}`;
    
    // Offer and Final Page
    const offerMe = document.getElementById('offer-me');
    if (offerMe) offerMe.textContent = `- ${CONFIG.yourName}`;
    const offerQuestion = document.querySelector('.offer-question');
    if (offerQuestion) offerQuestion.textContent = CONFIG.dateOfferText;
    const phoneValue = document.getElementById('phone-value');
    if (phoneValue) phoneValue.textContent = CONFIG.phoneNumber;
    const instaValue = document.getElementById('insta-value');
    if (instaValue) instaValue.textContent = CONFIG.instagramHandle;
    const finalMsg = document.querySelector('.final-message');
    if (finalMsg) finalMsg.textContent = CONFIG.finalMessage;
    
    initScroll(); initRules();
    document.getElementById('debug-toggle').onclick = () => document.getElementById('debug-panel').classList.toggle('hidden');
});
function debugSkipVases(){if(rpgState){rpgState.gameOver=true;clearInterval(rpgState.timerInterval);cancelAnimationFrame(rpgState.animFrame);}showScreen('screen-vase-anim');startVaseAnimation();}
function debugForceNight(){if(rpgState){rpgState.totalTime=900;rpgState.isNight=true;rpgState.nightOverlay=0.55;}}
function debugAddLife(){if(rpgState&&rpgState.lives<3){rpgState.lives++;updateHUD();}}
function debugGiveItems(){if(rpgState){rpgState.hotbar=[{name:'Hammer'},{name:'Lantern'},{name:'Map'}];rpgState.collectedItems=[0,1,2];updateHotbar();}}
