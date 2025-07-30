# 💣 CSS-Only Minesweeper

A fully playable version of Minesweeper built using HTML, CSS, and minimal JavaScript for grid randomization and game over logic.

## 🚀 Features
- 8x8 grid with 10 randomly placed mines
- Pure HTML and CSS for cell reveal and visuals
- Minimal JS for random grid generation and game over trigger
- Game Over overlay when a mine is clicked
- Restart button to reset the game

## 📁 Structure
```
/css-minesweeper/
├── index.html
├── style.css
├── README.md
└── assets/
```

## 🧩 How It Works
- Each cell is a `<label>` containing a hidden `<input type="checkbox">`.
- CSS uses the `:checked` state to reveal bombs, numbers, or empty tiles.
- The grid and mine locations are randomized on each page load using JavaScript.
- When a mine is revealed, a hidden checkbox is checked via JS, triggering a CSS-only Game Over overlay.
- The Restart button reloads the page for a new game.

## ▶️ Usage
Open `index.html` in your browser. Click cells to reveal them. Avoid the mines!

## 🖼️ Screenshot
<!-- Add a screenshot here -->

Enjoy the CSS wizardry challenge! 🎯