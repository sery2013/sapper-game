const BOARD_SIZE = 10;
let board = [];
let revealed = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
let flags = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
let gameOver = false;
let score = 0;

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    // Создаем пустое поле
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    revealed = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
    flags = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));

    // Расставляем мины
    let minesPlaced = 0;
    while (minesPlaced < 15) {
        const x = Math.floor(Math.random() * BOARD_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE);
        if (board[x][y] !== -1) {
            board[x][y] = -1; // -1 = мина
            minesPlaced++;
        }
    }

    // Подсчет чисел
    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            if (board[x][y] === -1) continue;

            let count = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[nx][ny] === -1) {
                        count++;
                    }
                }
            }
            board[x][y] = count;
        }
    }

    // Создаем ячейки
    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;

            cell.addEventListener('click', () => handleCellClick(x, y));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(x, y);
            });

            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(x, y) {
    if (gameOver || revealed[x][y] || flags[x][y]) return;

    if (board[x][y] === -1) {
        revealAllMines();
        gameOver = true;
        document.getElementById('game-over').classList.remove('hidden');
        return;
    }

    revealCell(x, y);

    // Обновляем счёт
    score += 10;
    document.getElementById('score').textContent = score;
}

function revealCell(x, y) {
    if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || revealed[x][y] || flags[x][y]) return;

    revealed[x][y] = true;
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    cell.classList.add('revealed');

    if (board[x][y] > 0) {
        cell.textContent = board[x][y];
        cell.style.color = ['blue', 'green', 'red', 'darkblue', 'brown', 'turquoise', 'black', 'gray'][board[x][y] - 1];
    } else {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                revealCell(x + dx, y + dy);
            }
        }
    }
}

function toggleFlag(x, y) {
    if (gameOver || revealed[x][y]) return;

    flags[x][y] = !flags[x][y];
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    cell.classList.toggle('flag', flags[x][y]);
}

function revealAllMines() {
    for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            if (board[x][y] === -1) {
                const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
                cell.textContent = '💣';
                cell.classList.add('revealed');
            }
        }
    }
}

function restartGame() {
    gameOver = false;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('game-over').classList.add('hidden');
    createBoard();
}

function togglePause() {
    const pauseScreen = document.getElementById('pause-screen');
    pauseScreen.classList.toggle('hidden');
    gameOver = !pauseScreen.classList.contains('hidden');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        togglePause();
    }
});

document.getElementById('restart-btn').addEventListener('click', restartGame);

createBoard();