export default function getData(url) {
  const data = fetch(url)
    .catch((e) => console.log("network error: ", e))
    .then((res) => res.json())
    .then((json) => {
      // console.log("json loaded: ", json);
      return json;
    });
  return data;
}
