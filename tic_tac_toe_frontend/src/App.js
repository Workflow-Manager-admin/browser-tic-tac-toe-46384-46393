import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Colors: Primary: #1976d2, Secondary: #2196f3, Accent: #ffb300
 * Layout: Minimal, modern, light theme. Responsive: player info on top, board centered, restart at bottom.
 */

// Board size
const SIZE = 3;

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // Detect win/draw on board changes
  useEffect(() => {
    const result = calculateWinner(board);
    setWinner(result);
    setIsDraw(!result && board.every(cell => cell));
  }, [board]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return; // No move if occupied or game over
    const nextBoard = board.slice();
    nextBoard[idx] = isX ? 'X' : 'O';
    setBoard(nextBoard);
    setIsX(!isX);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(SIZE * SIZE).fill(null));
    setIsX(true);
    setWinner(null);
    setIsDraw(false);
  }

  // UI info
  const currentPlayer = isX ? "X" : "O";
  let statusText;
  if (winner) {
    statusText = (
      <span>
        Winner:&nbsp;
        <span className={`player player-${winner}`}>{winner}</span> 🎉
      </span>
    );
  } else if (isDraw) {
    statusText = <span>It's a draw! 🤝</span>;
  } else {
    statusText = (
      <span>
        Turn:&nbsp;
        <span className={`player player-${currentPlayer}`}>{currentPlayer}</span>
      </span>
    );
  }

  return (
    <div className="tic-tac-toe-app">
      <div className="ttt-container">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-status">{statusText}</div>
        </header>
        <main>
          <Board
            board={board}
            onClick={handleClick}
            winner={winner}
          />
        </main>
        <footer className="ttt-footer">
          <button className="ttt-restart-btn" onClick={handleRestart} aria-label="Restart game">
            Restart
          </button>
        </footer>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onClick, winner }) {
  return (
    <div className="ttt-board">
      {board.map((cell, idx) => (
        <Square
          key={idx}
          value={cell}
          onClick={() => onClick(idx)}
          highlight={!!winner && winner.line && winner.line.includes(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      disabled={!!value}
      tabIndex={value ? -1 : 0}
      aria-label={value ? `Occupied by ${value}` : `Empty square`}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(b) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (let line of lines) {
    const [a, b1, c] = line;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return { player: b[a], line }; // Returns win info
    }
  }
  return null;
}

export default App;
