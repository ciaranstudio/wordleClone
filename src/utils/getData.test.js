import getData from "./getData";

const DATA_URL = "http://localhost:3000/solutions";

test("the second item in data array has a word property value of 'spade'", () => {
  return getData(DATA_URL).then((data) => {
    expect(data[1].word).toBe("spade");
  });
});

test("the third item in data array has a word property value of 'pools'", async () => {
  const data = await getData(DATA_URL);
  expect(data[2].word).toBe("pools");
});
