import { Route, Routes } from "react-router-dom";
import Contact from "../../Contact Page/Contact";
import CreateRecipe from "../../CreateRecipe/CreateRecipe ";
import Dashboard from "../../Dashboard/Dashboard";
import Features from "../../Features/Features";
import FoodHomePage from "../../FoodHomePage/FoodHomePage";
import HomePage from "../../HomePage/OldHomePage";
import Login from "../../Login/Login";
import { Page404 } from "../../Page404/Page404";
import RecipeComponent from "../../RecipeComponent/RecipeComponent";
import RecipeDetails from "../../RecipeDetails/RecipeDetails";
import RecipeManagement from "../../RecipeManagement/RecipeManagement";
import RecipesPage from "../../RecipesPage/RecipesPage";
import Register from "../../Register/Register";
import AddShoppingListForm from "../../ShoppingListPage/AddShoppingListForm";
import AddShoppingListItemForm from "../../ShoppingListPage/AddShoppingListItemForm";

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

      {/* Recipe-related routes */}
      <Route path="/recipes/create" element={<CreateRecipe />} />
      <Route path="/recipes/manage" element={<RecipeManagement />} />
      <Route path="/recipes/:id" element={<RecipeDetails />} />
      <Route path="/recipe/:id" element={<RecipeComponent  />} /> {/* New route for RecipeComponent */}

      {/* Shopping List */}
      <Route path="/shopping-list/add" element={<AddShoppingListForm onAdd={() => {}} />} />
      <Route path="/shopping-list/item/add" element={<AddShoppingListItemForm onAdd={() => {}} />} />

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
