import React from "react";

export default function Modal({
  isCorrect,
  solution,
  turn,
  toggleNewWord,
  resetGame,
}) {
  const startNewGame = () => {
    resetGame();
  };
  return (
    <div className="modal">
      {isCorrect && (
        <div>
          <h1>You Win!</h1>
          <button className="solution" onClick={startNewGame}>
            {solution}
          </button>
          <p>You found the word in {turn} guesses</p>
        </div>
      )}
      {!isCorrect && (
        <div>
          <h1>You Lose!</h1>
          <button className="solution" onClick={startNewGame}>
            {solution}
          </button>
          <p>Better luck next time</p>
        </div>
      )}
    </div>
  );
}
