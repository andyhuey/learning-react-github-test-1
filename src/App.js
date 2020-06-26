import React, { useState, useEffect } from "react";
import "./styles.css";

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function GitHubUser({ login }) {
  const [data, setData] = useState(loadJSON(`user:${login}`));

  useEffect(() => {
    if (!data) return;
    console.log(`login=${login}`);
    console.log(`data.login=${data.login}`);
    if (data.login !== login) return;
    const { name, avatar_url, location } = data;
    console.log(`Saving data for ${login}, ${name}.`);
    saveJSON(`user:${login}`, {
      name,
      login,
      avatar_url,
      location
    });
  }, [data, login]);

  useEffect(() => {
    if (!login) return;
    if (data && data.login === login) return;
    console.log(`Fetching data for ${login}.`);
    fetch(`https://api.github.com/users/${login}`)
      .then(response => response.json())
      .then(setData)
      .catch(console.error);
  }, [login, data]);

  if (data) return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return null;
}

export default function App() {
  // note that this needs to be capitalized the same as it is in github.
  return <GitHubUser login="MoonHighway" />;
  //return <GitHubUser login="andyhuey" />;
}
