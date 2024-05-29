import { useState, useEffect } from "react";

const useWordle = () => {
  const [jsonLoaded, setJsonLoaded] = useState(null);
  const [solution, setSolution] = useState(null);
  const [solutionToggle, setSolutionToggle] = useState(false);
  const [solutionsUsed, setSolutionsUsed] = useState([]);

  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const [showModal, setShowModal] = useState(false);

  const toggleNewWord = () => {
    setSolutionToggle(!solutionToggle);
  };

  const getJsonData = () => {
    fetch("http://localhost:3000/solutions")
      .then((res) => res.json())
      .then((json) => {
        console.log("json loaded: ", json);
        setJsonLoaded(json);
        toggleNewWord();
      });
  };

  useEffect(() => {
    if (!jsonLoaded) getJsonData();
  }, [jsonLoaded]);

  useEffect(() => {
    if (jsonLoaded) {
      const randomSolution =
        jsonLoaded[Math.floor(Math.random() * jsonLoaded.length)];
      if (!solutionsUsed.includes(randomSolution.word)) {
        setSolution(randomSolution.word);
        setSolutionsUsed((oldArray) => [...oldArray, randomSolution.word]);
      } else {
        if (solutionsUsed.length === jsonLoaded.length) {
          setSolutionsUsed([]);
        } else toggleNewWord();
      }
    }
  }, [solutionToggle]);

  useEffect(() => {
    console.log("Solutions used list: ", solutionsUsed);
  }, [solutionsUsed]);

  // format a guess into an array of letter objects
  const formatGuess = () => {
    let solutionArray = [...solution];
    let formattedGuess = [...currentGuess].map((l) => {
      return { key: l, color: "grey" };
    });
    // find any green Letters
    formattedGuess.forEach((l, i) => {
      if (solution[i] === l.key) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null;
      }
    });
    // find any yellow Letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== "green") {
        formattedGuess[i].color = "yellow";
        solutionArray[solutionArray.indexOf(l.key)] = null;
      }
    });
    return formattedGuess;
  };

  // add a new guess to the guesses state
  // update the isCorrect state if the guess is correct
  // add one to the turn state
  const addNewGuess = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true);
    }
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess];
    });
    setTurn((prevTurn) => {
      return prevTurn + 1;
    });
    setUsedKeys((prevUsedKeys) => {
      formattedGuess.forEach((l) => {
        const currentColor = prevUsedKeys[l.key];

        if (l.color === "green") {
          prevUsedKeys[l.key] = "green";
          return;
        }
        if (l.color === "yellow" && currentColor !== "green") {
          prevUsedKeys[l.key] = "yellow";
          return;
        }
        if (l.color === "grey" && currentColor !== ("green" || "yellow")) {
          prevUsedKeys[l.key] = "grey";
          return;
        }
      });
      return prevUsedKeys;
    });
    setCurrentGuess("");
  };

  const resetGame = () => {
    setTurn(0);
    setCurrentGuess("");
    setGuesses([...Array(6)]);
    setHistory([]);
    setIsCorrect(false);
    setUsedKeys({});
    setShowModal(false);
    toggleNewWord();
  };

  // handle keyup event & track current guess
  // if user presses enter and the end modal is not showing, add the new guess
  const handleKeyup = ({ key }) => {
    if (key === "Enter") {
      if (showModal) {
        resetGame();
      } else {
        // only add guess if turn is less than 5
        if (turn > 5) {
          console.log("You have used all of your guesses!");
          return;
        }

        // do not allow duplicate words
        if (history.includes(currentGuess)) {
          console.log("You have already tried that word.");
          return;
        }
        // check that word is 5 chars
        if (currentGuess.length !== 5 && !showModal) {
          console.log("Word must be 5 chars.");
          return;
        }
        const formatted = formatGuess();
        addNewGuess(formatted);
        console.log(formatted);
      }
    }
    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  };

  return {
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedKeys,
    handleKeyup,
    resetGame,
    showModal,
    setShowModal,
    solution,
  };
};

export default useWordle;
