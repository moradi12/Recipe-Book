// src/App.tsx
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { MainLayout } from "./Layout/MainLayout/MainLayout";
import { checkData } from "./Utiles/checkData";
import ErrorBoundary from "./components/ErrorBoundary";
import { validateConfig } from "./config/environment";
import "./styles/globals.css";

function App() {
  useEffect(() => {
    // Initialize configuration validation
    try {
      validateConfig();
    } catch (error) {
      console.error('Configuration validation failed:', error);
    }
    
    checkData();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <MainLayout />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
