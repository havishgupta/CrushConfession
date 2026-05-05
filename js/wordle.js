/* Wordle - updated text */
const WORDLE_ANSWER=()=>CONFIG.crushName.toUpperCase().replace(/\s/g, ''); let wordleState=null;
function initWordle(){
    const answer = WORDLE_ANSWER();
    wordleState={currentRow:0,currentCol:0,maxRows:5,maxCols:answer.length,guesses:[],currentGuess:'',gameOver:false};
    
    // Update wordle hint
    const letters = answer.split('');
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    document.getElementById('letter-jumble').textContent = shuffled.join(', ').toUpperCase();
    
    buildWordleGrid();buildWordleKeyboard();document.addEventListener('keydown',handleWordleKey);
}
function buildWordleGrid(){const g=document.getElementById('wordle-grid');g.innerHTML='';for(let r=0;r<5;r++){const row=document.createElement('div');row.className='wordle-row';for(let c=0;c<wordleState.maxCols;c++){const cell=document.createElement('div');cell.className='wordle-cell';cell.id=`wc-${r}-${c}`;row.appendChild(cell);}g.appendChild(row);}}
function buildWordleKeyboard(){const kb=document.getElementById('wordle-keyboard');kb.innerHTML='';[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','\u232B']].forEach(row=>{const d=document.createElement('div');d.className='keyboard-row';row.forEach(k=>{const b=document.createElement('button');b.className='key-btn'+(k.length>1?' wide':'');b.textContent=k;b.id=`kb-${k}`;b.onclick=()=>{if(k==='ENTER')submitWordleGuess();else if(k==='\u232B')deleteWordleLetter();else addWordleLetter(k);};d.appendChild(b);});kb.appendChild(d);});}
function handleWordleKey(e){if(wordleState.gameOver)return;const k=e.key.toUpperCase();if(k==='ENTER')submitWordleGuess();else if(k==='BACKSPACE')deleteWordleLetter();else if(/^[A-Z]$/.test(k))addWordleLetter(k);}
function addWordleLetter(l){if(wordleState.currentCol>=wordleState.maxCols||wordleState.gameOver)return;const c=document.getElementById(`wc-${wordleState.currentRow}-${wordleState.currentCol}`);c.textContent=l;c.classList.add('filled');wordleState.currentGuess+=l;wordleState.currentCol++;}
function deleteWordleLetter(){if(wordleState.currentCol<=0||wordleState.gameOver)return;wordleState.currentCol--;const c=document.getElementById(`wc-${wordleState.currentRow}-${wordleState.currentCol}`);c.textContent='';c.classList.remove('filled');wordleState.currentGuess=wordleState.currentGuess.slice(0,-1);}
function submitWordleGuess(){if(wordleState.currentGuess.length!==wordleState.maxCols||wordleState.gameOver)return;
const guess=wordleState.currentGuess,ans=WORDLE_ANSWER(),res=[],used=Array(wordleState.maxCols).fill(false);
for(let i=0;i<wordleState.maxCols;i++){if(guess[i]===ans[i]){res[i]='correct';used[i]=true;}else res[i]='absent';}
for(let i=0;i<wordleState.maxCols;i++){if(res[i]==='correct')continue;for(let j=0;j<wordleState.maxCols;j++){if(!used[j]&&guess[i]===ans[j]){res[i]='present';used[j]=true;break;}}}
for(let i=0;i<wordleState.maxCols;i++){const c=document.getElementById(`wc-${wordleState.currentRow}-${i}`);setTimeout(()=>{c.classList.add(res[i]);const kb=document.getElementById(`kb-${guess[i]}`);if(kb){if(res[i]==='correct')kb.className='key-btn correct';else if(res[i]==='present'&&!kb.classList.contains('correct'))kb.className='key-btn present';else if(!kb.classList.contains('correct')&&!kb.classList.contains('present'))kb.className='key-btn absent';}},i*200);}
wordleState.guesses.push(guess);wordleState.currentRow++;wordleState.currentCol=0;wordleState.currentGuess='';
document.getElementById('wordle-chances').textContent=5-wordleState.currentRow;
if(guess===ans){wordleState.gameOver=true;document.removeEventListener('keydown',handleWordleKey);setTimeout(()=>{showScreen('screen-congrats');startCongratsAnimation();},1500);return;}
if(wordleState.currentRow>=5){wordleState.gameOver=true;document.removeEventListener('keydown',handleWordleKey);setTimeout(()=>showGameOverPopup(),1500);}}
