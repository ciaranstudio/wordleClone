export default function formatGuess(currentGuess, solution) {
  // format a guess into an array of letter objects
  let solutionArray = [...solution];
  let formattedGuess = [...currentGuess].map((l) => {
    return { key: l, color: "grey" };
  });
  console.log("formatted guess: ", formattedGuess);
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
}
