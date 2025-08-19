// src/Routes/MainRoute.tsx
import { Route, Routes } from "react-router-dom";
import CreateRecipe from "../../AddRecipe/CreateRecipe";
import RecipeAdminDashboard from "../../Admin/AdminDashboard";
import CategoryDropdown from "../../CategoryDropdown/CategoryDropdown";
import Contact from "../../Contact Page/Contact";
import Dashboard from "../../Dashboard/Dashboard";
import EditRecipe from "../../EditRecipe/EditRecipe";
import EditRecipeAdmin from "../../EditRecipe/EditRecipeAdmin";
import FoodHomePage from "../../FoodHomePage/FoodHomePage";
import GetAllRecipes from "../../GetAllRecipes/GetAllRecipes";
import GetSingleRecipe from "../../GetSingleRecipe/GetSingleRecipe";
import HomePage from "../../HomePage/HomePage";
import LoginForm from "../../Login/LoginForm";
import { Page404 } from "../../Page404/Page404";
import RegisterForm from "../../Register/RegisterForm";
import SearchRecipes from "../../SearchRecipes/SearchRecipes";
import UpdateRecipe from "../../UpdateRecipe/UpdateRecipe";
import UserPanel from "../../UserPanel/UserPanel";
import Favorites from "../../Favorites/Favorites";
import UserProfile from "../../UserProfile/UserProfile";
import RecipeCollections from "../../RecipeCollections/RecipeCollections";
import NotificationCenter from "../../Notifications/NotificationCenter";
import EnhancedAdminDashboard from "../../Admin/EnhancedAdminDashboard";

export function MainRoute(): JSX.Element {
  return (
    <Routes>
      {/* Top-level routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/food" element={<FoodHomePage />} />
      <Route path="/recipes" element={<GetAllRecipes />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categories" element={<CategoryDropdown />} />
      <Route path="/create" element={<CreateRecipe />} />
      <Route path="/recipes/:recipeId" element={<GetSingleRecipe />} />
      <Route path="/edit-recipe/:id" element={<EditRecipe />} />

      {/* Existing "All Recipes" route */}
      <Route path="/all/recipes" element={<GetAllRecipes />} />

      <Route path="/admin" element={<RecipeAdminDashboard />} />
      <Route path="/admin/enhanced" element={<EnhancedAdminDashboard />} />
      <Route path="/admin/edit-recipe/:id" element={<EditRecipeAdmin />} />

      <Route path="/userpanel" element={<UserPanel />} />
      <Route path="/user-panel" element={<UserPanel />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/my-favorites" element={<Favorites />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/collections" element={<RecipeCollections />} />
      <Route path="/collections/:collectionId" element={<div>Collection Detail - Coming Soon</div>} />
      <Route path="/collections/:collectionId/edit" element={<div>Edit Collection - Coming Soon</div>} />
      <Route path="/meal-plans" element={<RecipeCollections />} />
      <Route path="/meal-plans/:planId" element={<div>Meal Plan Detail - Coming Soon</div>} />
      <Route path="/meal-plans/:planId/edit" element={<div>Edit Meal Plan - Coming Soon</div>} />
      <Route path="/shopping-lists" element={<RecipeCollections />} />
      <Route path="/shopping-lists/:listId" element={<div>Shopping List Detail - Coming Soon</div>} />
      <Route path="/shopping-lists/:listId/edit" element={<div>Edit Shopping List - Coming Soon</div>} />
      <Route path="/notifications" element={<NotificationCenter />} />

      {/*
        Additional routes for the other controller methods:
        getRecipeById, updateRecipe, deleteRecipe, and searchRecipes.
      */}
      <Route path="/recipes/update" element={<UpdateRecipe />} />
      <Route path="/recipes/search" element={<SearchRecipes />} />

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
export default MainRoute;
