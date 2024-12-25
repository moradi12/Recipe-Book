// src/Routes/MainRoute.tsx
import { Route, Routes } from "react-router-dom";
import AddRecipe from "../../AddRecipe/AddRecipe";
import CreateRecipe from "../../AddRecipe/CreateRecipe";
import CategoryDropdown from "../../CategoryDropdown/CategoryDropdown";
import Contact from "../../Contact Page/Contact";
import Dashboard from "../../Dashboard/Dashboard";
import Features from "../../Features/Features";
import FoodHomePage from "../../FoodHomePage/FoodHomePage";
import HomePage from "../../HomePage/OldHomePage";
import Login from "../../Login/Login";
import { Page404 } from "../../Page404/Page404";
import RecipesPage from "../../RecipesPage/RecipesPage";
import Register from "../../Register/Register";

export function MainRoute(): JSX.Element {
  return (
    <Routes>
      {/* Top-level routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/food" element={<FoodHomePage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categories" element={<CategoryDropdown />} />
      <Route path="/add" element={<AddRecipe />} />
      <Route path="/create" element={<CreateRecipe  />} />


      {/* Catch-all for undefined routes */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
export default MainRoute;