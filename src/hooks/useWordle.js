import { useState, useEffect } from "react";
import getData from "../utils/getData";
import getSolution from "../utils/getSolution";
import formatGuess from "../utils/formatGuess";

const useWordle = () => {
  const DATA_URL = "http://localhost:3000/solutions";

  const [jsonLoaded, setJsonLoaded] = useState(null);
  const [solution, setSolution] = useState(null);
  const [solutionsUsed, setSolutionsUsed] = useState([]);
  const [usedKeys, setUsedKeys] = useState({});

  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const [solutionToggle, setSolutionToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleNewWord = () => {
    setSolutionToggle(!solutionToggle);
  };

  // get JSON data from backend
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(DATA_URL);
      setJsonLoaded(data);
    };
    fetchData();
  }, []);

  // get solution for current game
  useEffect(() => {
    if (jsonLoaded) {
      if (solutionsUsed.length === jsonLoaded.length) {
        const newSolution = getSolution(jsonLoaded, []);
        setSolution(newSolution);
        setSolutionsUsed([newSolution]);
      } else {
        const newSolution = getSolution(jsonLoaded, solutionsUsed);
        setSolution(newSolution);
        setSolutionsUsed((oldArray) => [...oldArray, newSolution]);
      }
    }
  }, [jsonLoaded, solutionToggle]);

  // add a new guess to the guesses state
  // add one to the turn state
  // update usedKeys list
  // reset current guess value
  const addNewGuess = (formattedGuess) => {
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
  // update the isCorrect state if the guess is correct
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
        const formatted = formatGuess(currentGuess, solution);
        addNewGuess(formatted);
        if (currentGuess === solution) {
          setIsCorrect(true);
        }
        // console.log(formatted);
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
