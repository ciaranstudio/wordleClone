import { useState, useEffect } from "react";

const useData = () => {
  const [jsonLoaded, setJsonLoaded] = useState(null);
  const [solution, setSolution] = useState(null);
  const [solutionToggle, setSolutionToggle] = useState(false);
  const [solutionsUsed, setSolutionsUsed] = useState([]);

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

  return { solutionToggle, setSolutionToggle, solution, toggleNewWord };
};

export default useData;
