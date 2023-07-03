import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Gestion from "./components/gestion";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route exact path="/gestion" element={<Gestion />}></Route>
      </Routes>
    </Router>
  );
}
export default App;
