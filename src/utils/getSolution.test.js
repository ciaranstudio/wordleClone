import getSolution from "./getSolution";

const sampleData = [
  { id: "0", word: "birds" },
  { id: "1", word: "maids" },
  { id: "2", word: "lames" },
];
const sampleUsedSolutions = ["maids", "lames"];

test("checks new solution generated excludes solutions used", () => {
  expect(getSolution(sampleData, sampleUsedSolutions)).toBe("birds");
});
