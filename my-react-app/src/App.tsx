// src/App.tsx
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { MainLayout } from "./Layout/MainLayout/MainLayout";
import { checkData } from "./Utiles/checkData";
import "./styles/globals.css";

function App() {
  useEffect(() => {
    checkData();
  }, []);

  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
