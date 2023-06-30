import React, { useEffect, useState } from "react";

function App() {
  const [backData, setBackData] = useState([{}]);
  useEffect(() => {
    fetch("/")
      .then((response) => response.json())
      .then((data) => {
        setBackData(data);
      });
  }, []);
  return (
    <div>
      <div>
        
      </div>
    </div>
  );
}

export default App;

// {typeof backData === "undefined" ? (
//   <p>Loading...</p>
// ) : (
//   backData.forEach((e, i) => <p key={i}>{e}</p>)
// )}