import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
};

export const fetchRecipes = async () => {
  const response = await axios.get(`${API_BASE_URL}/recipes`);
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRecipe = async (recipeData: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE_URL}/recipes`, recipeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
