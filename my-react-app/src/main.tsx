// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // Import Provider from react-redux
import App from "./App.tsx";
import "./index.css";
import { recipeSystem } from "./Pages/Redux/store"; // Import your Redux store

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={recipeSystem}> {/* Wrap App with Provider */}
      <App />
    </Provider>
  </StrictMode>
);
