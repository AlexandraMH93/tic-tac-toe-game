// Variables iniciales
let currentPlayer = 'X'; // El jugador siempre juega con "X"
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

// Referencias a elementos en el DOM
const cells = document.querySelectorAll('.cell');
const currentPlayerElement = document.getElementById('current-player');
const winnerMessage = document.getElementById('winner-message');
const resetButton = document.getElementById('reset');
const fireworksContainer = document.getElementById('fireworks-container');

// Puntuaciones para el algoritmo Minimax
const scores = {
    X: -1,   // El jugador humano
    O: 1,    // La IA
    tie: 0   // Empate
};

// Lógica de cambio de turno
function changeTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerElement.textContent = currentPlayer;
}

// Mostrar fuegos artificiales mejorados
function showFireworks() {
    fireworksContainer.classList.remove('hidden');

    for (let i = 0; i < 5; i++) {
        createFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }

    setTimeout(() => {
        fireworksContainer.innerHTML = ''; // Limpiar los fuegos después de unos segundos
    }, 3000);
}

function createFirework(x, y) {
    const fireworkColors = ['firework-1', 'firework-2', 'firework-3', 'firework-4', 'firework-5'];

    for (let i = 0; i < 15; i++) { // Crear más círculos pequeños
        const firework = document.createElement('div');
        const randomColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        firework.classList.add('firework', randomColor);

        firework.style.left = `${x + (Math.random() - 0.5) * 100}px`; // Posiciones aleatorias cercanas al punto de origen
        firework.style.top = `${y + (Math.random() - 0.5) * 100}px`;
        firework.style.width = `${Math.random() * 8 + 5}px`; // Tamaños aleatorios
        firework.style.height = firework.style.width; // Mantener el círculo

        fireworksContainer.appendChild(firework);
    }
}

// Verificar si hay un ganador o empate
function checkWinner() {
    const winner = checkWinnerAI(board);
    if (winner !== null) {
        if (winner === "tie") {
            winnerMessage.textContent = "¡Es un empate!";
        } else {
            winnerMessage.textContent = `Jugador ${winner} ha ganado!`;
            if (winner === 'O') {
                showFireworks(); // Mostrar fuegos si gana la IA
            }
        }
        winnerMessage.classList.remove('hidden');
        gameOver = true;
        return true;
    }
    return false;
}

// Función auxiliar para verificar el ganador (para la IA)
function checkWinnerAI(boardState) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a]; // Devuelve el ganador ("X" o "O")
        }
    }

    if (!boardState.includes('')) {
        return "tie"; // Devuelve "tie" si es empate
    }

    return null; // Si no hay ganador
}

// Algoritmo Minimax
function minimax(newBoard, depth, isMaximizing) {
    let result = checkWinnerAI(newBoard);
    if (result !== null) {
        return scores[result]; // Retorna el valor de la partida (ganador, empate o derrota)
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O'; // La IA hace su movimiento
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = ''; // Deshacer el movimiento
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X'; // El jugador humano hace su movimiento
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = ''; // Deshacer el movimiento
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Movimiento de la IA
function aiMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // La IA hace su movimiento
            let score = minimax(board, 0, false);
            board[i] = ''; // Deshacer el movimiento
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    // Realizar el mejor movimiento de la IA
    board[move] = 'O';
    cells[move].textContent = 'O';

    if (!checkWinner()) {
        changeTurn(); // Cambiar de turno al jugador
    }
}

// Manejar el clic en una celda (movimiento del jugador)
function handleClick(event) {
    const cellIndex = event.target.getAttribute('data-index');

    if (board[cellIndex] !== '' || gameOver || currentPlayer === 'O') return;

    // Actualizar el tablero para el jugador
    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (!checkWinner()) {
        changeTurn();
        aiMove(); // La IA juega después del turno del jugador
    }
}

// Reiniciar el juego
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    currentPlayer = 'X';
    currentPlayerElement.textContent = currentPlayer;
    winnerMessage.classList.add('hidden');
    fireworksContainer.classList.add('hidden');
    fireworksContainer.innerHTML = ''; // Limpiar fuegos artificiales

    // Limpiar las celdas
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

// Asignar eventos a cada celda
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

// Asignar el evento al botón de reiniciar
resetButton.addEventListener('click', resetGame);
