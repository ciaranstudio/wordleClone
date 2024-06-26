import React, { useEffect } from "react";
import useWordle from "../hooks/useWordle";
import Grid from "./Grid";
import Keypad from "./Keypad";
import keys from "../constants/keys";
import Modal from "./Modal";

export default function Wordle() {
  const {
    currentGuess,
    guesses,
    turn,
    isCorrect,
    usedKeys,
    handleKeyup,
    resetGame,
    showModal,
    setShowModal,
    solution,
  } = useWordle();

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup]);

  useEffect(() => {
    if (isCorrect || turn > 5) {
      setShowModal(true);
    }
  }, [isCorrect, turn]);

  return (
    <>
      {solution && (
        <div>
          <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
          <Keypad keys={keys} usedKeys={usedKeys} />
          {showModal && (
            <Modal
              isCorrect={isCorrect}
              turn={turn}
              solution={solution}
              resetGame={resetGame}
            />
          )}
        </div>
      )}
    </>
  );
}
