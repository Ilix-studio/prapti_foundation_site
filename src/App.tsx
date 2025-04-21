import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />

      <Route path='*' element={<div> Not Found </div>} />
    </Routes>
  );
}

export default App;
