const quotes = [
    [ // Easy
        "The quick brown fox jumps over the lazy dog.",
        "Hello world, this is a simple typing test.",
        "Programming is fun when you practice daily.",
        "Keep calm and code on with confidence.",
        "Practice makes perfect in everything you do."
    ],
    [ // Medium
        "Technology is best when it brings people together. Innovation distinguishes between a leader and follower.",
        "Programming is not about typing, it's about thinking. Code is poetry written in logic and creativity.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts in life.",
        "The only way to do great work is to love what you do. Stay hungry, stay foolish, and keep learning.",
        "Artificial intelligence will not replace humans, but humans with AI will replace humans without AI."
    ],
    [ // Hard
        "The complexity of modern software development requires not only technical expertise but also collaborative skills, creative problem-solving abilities, and continuous learning mindset.",
        "Quantum computing represents a paradigm shift in computational capabilities, potentially revolutionizing fields like cryptography, optimization, and machine learning through quantum entanglement and superposition.",
        "Blockchain technology fundamentally transforms how we conceptualize trust, decentralization, and digital ownership by creating immutable, distributed ledgers that eliminate intermediaries.",
        "Machine learning algorithms continuously evolve through iterative training processes, analyzing vast datasets to identify patterns, make predictions, and optimize decision-making frameworks.",
        "Cybersecurity professionals must constantly adapt to emerging threats, implementing multi-layered defense strategies while balancing user accessibility with robust protection mechanisms."
    ]
];

const levelNames = ["Easy", "Medium", "Hard"];
let currentLevel = 0,
    currentQuote = '',
    charIndex = 0,
    mistakes = 0,
    timer = 60,
    isTyping = false,
    timerInterval,
    startTime;

const quoteEl = document.getElementById('quote');
const inputEl = document.getElementById('input');
const wpmEl = document.getElementById('wpm');
const cpmEl = document.getElementById('cpm');
const mistakesEl = document.getElementById('mistakes');
const timeEl = document.getElementById('time');
const restartBtn = document.getElementById('restart');
const timeSelect = document.getElementById('timeSelect');

// Level display and buttons setup (same as your version)
const levelEl = document.createElement('div');
levelEl.className = 'level-display';
levelEl.innerHTML = `<span class="level-label">Level:</span> <span class="level-value" id="level">${levelNames[currentLevel]}</span>`;
document.querySelector('.header').appendChild(levelEl);

const levelButtonsEl = document.createElement('div');
levelButtonsEl.className = 'level-buttons';
levelButtonsEl.innerHTML = levelNames.map((name, index) =>
    `<button class="btn level-btn ${index === currentLevel ? 'active' : ''}" data-level="${index}">${name}</button>`
).join('');
document.querySelector('.content-area').insertBefore(levelButtonsEl, document.querySelector('.stats-panel'));

function initGame() {
    const levelQuotes = quotes[currentLevel];
    currentQuote = levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
    charIndex = 0;
    mistakes = 0;
    timer = parseInt(timeSelect.value) || 0;
    isTyping = false;
    startTime = null;

    clearInterval(timerInterval);

    inputEl.value = '';
    updateStats();
    displayQuote();
    updateLevelDisplay();

    // Only enable input if time is selected
    if (!timer) {
        inputEl.disabled = true;
        inputEl.placeholder = "Please select the timer above";
    } else {
        inputEl.disabled = false;
        inputEl.placeholder = "";
    }
}

function displayQuote() {
    quoteEl.innerHTML = currentQuote.split('').map((char, index) => {
        let className = '';
        if (index < charIndex) {
            className = inputEl.value[index] === char ? 'correct' : 'incorrect';
        } else if (index === charIndex) {
            className = 'active';
        }
        return `<span class="${className}">${char}</span>`;
    }).join('');
}

function updateStats() {
    const currentTime = Date.now();
    const timeElapsed = startTime ? (currentTime - startTime) / 1000 : 0;
    const correctChars = Math.max(0, charIndex - mistakes);
    const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / (timeElapsed / 60)) : 0;
    const cpm = timeElapsed > 0 ? Math.round((correctChars) / (timeElapsed / 60)) : 0;

    wpmEl.textContent = wpm > 0 ? wpm : 0;
    cpmEl.textContent = cpm > 0 ? cpm : 0;
    mistakesEl.textContent = mistakes;
    timeEl.textContent = timer;
}

function updateLevelDisplay() {
    document.getElementById('level').textContent = levelNames[currentLevel];
    document.querySelectorAll('.level-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === currentLevel);
    });
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timer--;
        updateStats();
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    inputEl.blur();
    inputEl.disabled = true;

    const timeElapsed = (Date.now() - startTime) / 1000;
    const correctChars = Math.max(0, charIndex - mistakes);
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    const accuracy = Math.round((correctChars / charIndex) * 100) || 0;

    setTimeout(() => {
        alert(`Game Over!\nLevel: ${levelNames[currentLevel]}\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nTime: ${Math.round(timeElapsed)}s`);
        initGame();
    }, 100);
}

inputEl.addEventListener('input', (e) => {
    if (inputEl.disabled) return; // Only allow typing when input enabled

    if (!isTyping) {
        isTyping = true;
        startTimer();
    }

    const inputText = e.target.value;

    if (inputText.length < charIndex) {
        charIndex--;
        if (currentQuote[charIndex] !== inputText[charIndex]) {
            mistakes = Math.max(0, mistakes - 1);
        }
    } else {
        const typedChar = inputText[charIndex];
        const currentChar = currentQuote[charIndex];

        if (typedChar !== currentChar) {
            mistakes++;
        }
        charIndex++;
    }

    if (charIndex >= currentQuote.length || timer <= 0) {
        endGame();
        return;
    }

    displayQuote();
    updateStats();
});

// Level buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('level-btn')) {
        currentLevel = parseInt(e.target.dataset.level);
        initGame();
    }
});

// Timer select
timeSelect.addEventListener('change', () => {
    initGame();
    // Focus is only allowed if input is enabled
    if (!inputEl.disabled) inputEl.focus();
});

quoteEl.addEventListener('click', () => !inputEl.disabled && inputEl.focus());
document.addEventListener('keydown', () => !inputEl.disabled && inputEl.focus());

restartBtn.addEventListener('click', initGame);

initGame();
