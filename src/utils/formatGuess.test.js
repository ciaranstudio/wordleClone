import formatGuess from "./formatGuess";

const sampleGuess = "times";
const sampleSolution = "tombs";

test("checks guess against solution ('niinj' vs 'ninja')", () => {
  expect(formatGuess(sampleGuess, sampleSolution)).toStrictEqual([
    { key: "t", color: "green" },
    { key: "i", color: "grey" },
    { key: "m", color: "green" },
    { key: "e", color: "grey" },
    { key: "s", color: "green" },
  ]);
});
