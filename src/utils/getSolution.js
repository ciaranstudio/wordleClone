export default function getSolution(jsonLoaded, solutionsUsed) {
  // console.log("solutions used: ", solutionsUsed);
  function filterUsedWords(item) {
    if (!solutionsUsed.includes(item.word)) {
      return true;
    }
    return false;
  }

  const unusedWords = jsonLoaded.filter(filterUsedWords);
  // console.log("remaining words: ", unusedWords);

  const randomSolution =
    unusedWords[Math.floor(Math.random() * unusedWords.length)];

  const solutionWord = randomSolution.word;
  // console.log(solutionWord);
  return solutionWord;
}
