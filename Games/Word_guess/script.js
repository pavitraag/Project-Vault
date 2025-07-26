// --- Moderate/Difficult 5-letter words for answers ---
const ANSWER_LIST = [
  "azure", "fjord", "glyph", "nymph", "quash", "vexed", "waltz", "zesty", "blitz", "jumpy",
  "plush", "squad", "tryst", "wharf", "yacht", "zonal", "crisp", "dwarf", "flint", "knack",
  "lurch", "mirth", "prong", "scowl", "thump", "vigor", "wrack", "yodel", "zebra", "quell",
  "batch", "brisk", "cider", "clamp", "daisy", "eagle", "feast", "glaze", "hinge", "ivory",
  "jelly", "karma", "lemon", "moist", "nerdy", "opera", "piano", "quilt", "raven", "spice",
  "torch", "ultra", "vocal", "wedge", "xenon", "yield", "zippy", "amuse", "beach", "charm",
  "diver", "elbow", "froze", "grape", "hoist", "inlet", "joker", "kneel", "lodge", "mango",
  "noble", "oxide", "perch", "quack", "reign", "shiny", "troop", "union", "vague", "woven",
  "xylem", "yeast", "zoned", "abide", "blown", "croak", "dough", "epoch", "flock", "gleam",
  "harsh", "irate", "jaunt", "kinky", "lapse", "mural", "ninth", "obese", "plume", "quirk"
];


// For each session, pick up to 100 unique random words from ANSWER_LIST
let sessionAnswers = [];
function pickSessionAnswers() {
  const shuffled = [...ANSWER_LIST].sort(() => Math.random() - 0.5);
  sessionAnswers = shuffled.slice(0, Math.min(100, ANSWER_LIST.length));
}

let VALID_GUESSES = [];
let validGuessesLoaded = false;

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

let secretWord = '';
let guesses = [];
let currentGuess = '';
let gameOver = false;
let keyboardState = {};
let clueCount = 3;
let coins = 0;
let score = 0;
/*const scoreAmount = document.getElementById('score-amount');*/

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const clueBtn = document.getElementById('clue-btn');
const clueCountSpan = document.getElementById('clue-count');
/*const coinAmount = document.getElementById('coin-amount');*/

// Load valid guesses from words.txt
fetch('words.txt')
  .then(res => res.text())
  .then(text => {
    VALID_GUESSES = text.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length === 5);
    validGuessesLoaded = true;
  });

function getDayIndex() {
  const epoch = new Date(Date.UTC(2022, 0, 1));
  const now = new Date();
  const diff = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
  return diff % ANSWER_LIST.length;
}

function pickSecretWord() {
  // Pick a random word from the session's answer list
  return sessionAnswers[Math.floor(Math.random() * sessionAnswers.length)];
}

function showMessage(msg, duration = 1500) {
  message.textContent = msg;
  if (duration > 0) {
    setTimeout(() => {
      if (message.textContent === msg) message.textContent = '';
    }, duration);
  }
}

function createCelebration() {
  // Remove any existing celebration
  let old = document.getElementById('celebration');
  if (old) old.remove();
  let div = document.createElement('div');
  div.id = 'celebration';
  div.textContent = 'Amazing!';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1200);
  // Confetti
  createConfetti();
}

function createConfetti() {
  let confetti = document.createElement('div');
  confetti.className = 'confetti';
  for (let i = 0; i < 40; i++) {
    let piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = `hsl(${Math.random()*360},90%,60%)`;
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    confetti.appendChild(piece);
  }
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1400);
}

/*function updateCoins(amount) {
  coins += amount;
  coinAmount.textContent = coins;
  localStorage.setItem('wordle_coins', coins);
}

function loadCoins() {
  coins = parseInt(localStorage.getItem('wordle_coins') || '0', 10);
  coinAmount.textContent = coins;
}*/

function updateClueUI() {
  clueCountSpan.textContent = clueCount;
  clueBtn.disabled = clueCount <= 0 || gameOver;
}



function useClue() {
  if (clueCount <= 0 || gameOver) return;
  const rowIdx = guesses.length;
  if (rowIdx >= MAX_GUESSES) return;
  const row = board.querySelectorAll('.row')[rowIdx];
  const tiles = row.querySelectorAll('.tile');
  let revealed = false;
  for (let i = 0; i < WORD_LENGTH; i++) {
    if ((currentGuess[i] || '') !== secretWord[i]) {
      let guessArr = currentGuess.split('');
      guessArr[i] = secretWord[i];
      currentGuess = guessArr.join('').slice(0, WORD_LENGTH);
      updateBoard();
      tiles[i].classList.add('revealed');
      setTimeout(() => tiles[i].classList.remove('revealed'), 600);
      revealed = true;
      break;
    }
  }
  if (revealed) {
    clueCount--;
    updateClueUI();
  } else {
    showMessage('No more clues available for this row!');
  }
}

function getFeedback(guess, word) {
  const feedback = Array(WORD_LENGTH).fill('absent');
  const wordArr = word.split('');
  const guessArr = guess.split('');
  const used = Array(WORD_LENGTH).fill(false);
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === wordArr[i]) {
      feedback[i] = 'correct';
      used[i] = true;
      wordArr[i] = null;
    }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (feedback[i] === 'correct') continue;
    const idx = wordArr.indexOf(guessArr[i]);
    if (idx !== -1 && !used[idx]) {
      feedback[i] = 'present';
      wordArr[idx] = null;
    }
  }
  return feedback;
}

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < MAX_GUESSES; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < WORD_LENGTH; j++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function createKeyboard() {
  keyboard.innerHTML = '';
  const rows = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];
  rows.forEach((row, i) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    // Remove Enter key from keyboard
    for (const ch of row) {
      const btn = document.createElement('button');
      btn.textContent = ch.toUpperCase();
      btn.className = 'key';
      btn.onclick = () => handleKey(ch);
      if (keyboardState[ch]) btn.classList.add(keyboardState[ch]);
      rowDiv.appendChild(btn);
    }
    if (i === 2) {
        const del = document.createElement('button');
  del.textContent = 'DEL';
  del.className = 'key';
  del.onclick = () => handleKey('Backspace');
  rowDiv.appendChild(del);
      }
      
      
    keyboard.appendChild(rowDiv);
  });
}

// Enable/disable submit button based on current guess
const submitBtn = document.getElementById('submit-btn');
function updateSubmitBtn() {
  if (currentGuess.length === WORD_LENGTH && !gameOver) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// On submit, trigger the same as Enter
submitBtn.onclick = () => {
  if (!submitBtn.disabled) handleKey('Enter');
};

// Update submit button whenever board changes
function updateBoard() {
  const rows = board.querySelectorAll('.row');
  for (let i = 0; i < MAX_GUESSES; i++) {
    const tiles = rows[i].querySelectorAll('.tile');
    let guess = guesses[i] || '';
    for (let j = 0; j < WORD_LENGTH; j++) {
      let letter = '';
      let className = 'tile';
      if (i === guesses.length && j < currentGuess.length) {
        letter = currentGuess[j].toUpperCase();
      } else if (guess[j]) {
        letter = guess[j].toUpperCase();
      }
      tiles[j].textContent = letter;
      tiles[j].className = className;
      // Only animate and color submitted guesses
      if (guess && secretWord && i < guesses.length) {
        const feedback = getFeedback(guess, secretWord);
        tiles[j].classList.add(feedback[j]);
        // Animate only for submitted rows
        if (i === guesses.length - 1) {
          tiles[j].classList.add('revealed');
          setTimeout(() => tiles[j].classList.remove('revealed'), 600);
        }
      }
    }
  }
  if (currentGuess.length === WORD_LENGTH && validGuessesLoaded) {
    if (!VALID_GUESSES.includes(currentGuess)) {
      submitBtn.textContent = 'Not a word';
      submitBtn.style.background = '#b00020';
      submitBtn.style.color = '#fff';
      submitBtn.disabled = false;
  
      submitBtn.onclick = () => {
        currentGuess = '';
        updateBoard();
        updateSubmitBtn();
        submitBtn.textContent = 'Submit';
        submitBtn.style.background = '#6aaa64';
        submitBtn.onclick = () => {
          if (!submitBtn.disabled) handleKey('Enter');
        };
      };
      return; // Stop here to avoid re-enabling normal behavior
    } else {
      submitBtn.textContent = 'Submit';
      submitBtn.style.background = '#6aaa64';
      submitBtn.style.color = '#fff';
      submitBtn.disabled = false;
      submitBtn.onclick = () => {
        if (!submitBtn.disabled) handleKey('Enter');
      };
    }
  }
  
  updateSubmitBtn();
}

function updateKeyboard() {
  keyboardState = {};
  for (const guess of guesses) {
    const feedback = getFeedback(guess, secretWord);
    for (let i = 0; i < WORD_LENGTH; i++) {
      const ch = guess[i];
      if (!ch) continue;
      if (feedback[i] === 'correct') keyboardState[ch] = 'correct';
      else if (feedback[i] === 'present' && keyboardState[ch] !== 'correct') keyboardState[ch] = 'present';
      else if (!keyboardState[ch]) keyboardState[ch] = 'absent';
    }
  }
  createKeyboard();
}

function handleKey(key) {
  if (gameOver) return;
  if (key === 'Enter') {
    if (currentGuess.length !== WORD_LENGTH) {
      showMessage('Not enough letters');
      return;
    }
    if (!validGuessesLoaded) {
      showMessage('Loading dictionary...');
      return;
    }
    if (!VALID_GUESSES.includes(currentGuess)) {
        submitBtn.textContent = 'Not a word';
        submitBtn.style.background = '#b00020'; // red background
        submitBtn.style.color = '#fff';
        submitBtn.disabled = false;
      
        submitBtn.onclick = () => {
          currentGuess = '';
          updateBoard();
          updateSubmitBtn();
          submitBtn.textContent = 'Submit';
          submitBtn.style.background = '#6aaa64'; // reset to default green
          submitBtn.onclick = () => {
            if (!submitBtn.disabled) handleKey('Enter');
          };
        };
        return;
      }
    guesses.push(currentGuess);
    if (currentGuess === secretWord) {
  showMessage('You Win! 🎉', 0);
  gameOver = true;
  createCelebration();

  const rows = board.querySelectorAll('.row');
  const totalRows = MAX_GUESSES;

  let points = 0;

  // Strike through empty rows and mark +10
  for (let i = guesses.length; i < totalRows; i++) {
    const row = rows[i];
    row.classList.add('strikethrough', 'row-points');
    row.setAttribute('data-points', '+10');
    points += 10;
  }

  // Strike through correct row and mark +10
  const correctRow = rows[guesses.length - 1];
  correctRow.classList.add('strikethrough', 'row-points');
  correctRow.setAttribute('data-points', '+10');
  points += 10;

  // Show total score after short delay
  setTimeout(() => {
  // Clean up if needed
  const oldPopup = document.getElementById('final-score-popup');
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement('div');
  popup.id = 'final-score-popup';

  // Build HTML content
  const scoreText = document.createElement('div');
  scoreText.textContent = `Score = ${points}`;

  const restartBtn = document.createElement('button');
  restartBtn.id = 'restart-score-btn';
  restartBtn.title = 'Restart';
  restartBtn.textContent = '⟳';

  restartBtn.onclick = () => {
    popup.remove();
    restartGame();
  };

  // Append content
  popup.appendChild(scoreText);
  popup.appendChild(restartBtn);
  document.body.appendChild(popup);

  // Update score value
  updateScore(points);
}, 1000);



}

       else if (guesses.length === MAX_GUESSES) {
  gameOver = true;
  updateScore(0);

  const popup = document.createElement('div');
  popup.id = 'game-over-popup';
  popup.innerHTML = `
  <div>Game Over!<br>The word was: <strong>${secretWord.toUpperCase()}</strong></div>
  <button id="restart-popup-btn" title="Restart">⟳</button>
`;
  document.body.appendChild(popup);

  document.getElementById('restart-popup-btn').onclick = () => {
    popup.remove();
    restartGame();
  };
}
    currentGuess = '';
    updateBoard();
    updateKeyboard();
    updateClueUI();
    return;
  }
  if (key === 'Backspace' || key === 'Del') {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
    return;
  }
  if (/^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
    currentGuess += key.toLowerCase();
    updateBoard();
  }
  updateSubmitBtn();
}

function handlePhysicalKeyboard(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  let key = e.key;
  if (key === 'Backspace' || key === 'Enter' || /^[a-zA-Z]$/.test(key)) {
    handleKey(key);
    e.preventDefault();
  }
}

function restartGame() {
  // On first game, or if sessionAnswers is empty, pick session answers
  if (sessionAnswers.length === 0) pickSessionAnswers();
  secretWord = pickSecretWord();
  guesses = [];
  currentGuess = '';
  gameOver = false;
  keyboardState = {};
  clueCount = 3;
  createBoard();
  updateBoard();
  createKeyboard();
  message.textContent = '';
  updateClueUI();
  updateSubmitBtn();
  updateScore(0);
}

clueBtn.onclick = useClue;
restartBtn.onclick = restartGame;
document.addEventListener('keydown', handlePhysicalKeyboard);

// Initial setup
//loadCoins();
restartGame();
