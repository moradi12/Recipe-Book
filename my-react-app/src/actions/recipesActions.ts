import axios from 'axios';

export const FETCH_PENDING_RECIPES_REQUEST = 'FETCH_PENDING_RECIPES_REQUEST';
export const FETCH_PENDING_RECIPES_SUCCESS = 'FETCH_PENDING_RECIPES_SUCCESS';
export const FETCH_PENDING_RECIPES_FAILURE = 'FETCH_PENDING_RECIPES_FAILURE';

export const APPROVE_RECIPE_REQUEST = 'APPROVE_RECIPE_REQUEST';
export const APPROVE_RECIPE_SUCCESS = 'APPROVE_RECIPE_SUCCESS';
export const APPROVE_RECIPE_FAILURE = 'APPROVE_RECIPE_FAILURE';

export const REJECT_RECIPE_REQUEST = 'REJECT_RECIPE_REQUEST';
export const REJECT_RECIPE_SUCCESS = 'REJECT_RECIPE_SUCCESS';
export const REJECT_RECIPE_FAILURE = 'REJECT_RECIPE_FAILURE';

export const ADD_RECIPE_REQUEST = 'ADD_RECIPE_REQUEST';
export const ADD_RECIPE_SUCCESS = 'ADD_RECIPE_SUCCESS';
export const ADD_RECIPE_FAILURE = 'ADD_RECIPE_FAILURE';

export const FETCH_ALL_RECIPES_REQUEST = 'FETCH_ALL_RECIPES_REQUEST';
export const FETCH_ALL_RECIPES_SUCCESS = 'FETCH_ALL_RECIPES_SUCCESS';
export const FETCH_ALL_RECIPES_FAILURE = 'FETCH_ALL_RECIPES_FAILURE';

export const UPDATE_RECIPE_REQUEST = 'UPDATE_RECIPE_REQUEST';
export const UPDATE_RECIPE_SUCCESS = 'UPDATE_RECIPE_SUCCESS';
export const UPDATE_RECIPE_FAILURE = 'UPDATE_RECIPE_FAILURE';

export const DELETE_RECIPE_REQUEST = 'DELETE_RECIPE_REQUEST';
export const DELETE_RECIPE_SUCCESS = 'DELETE_RECIPE_SUCCESS';
export const DELETE_RECIPE_FAILURE = 'DELETE_RECIPE_FAILURE';

const API_URL = 'http://localhost:8080/api/admin'; // Assuming the backend is running on port 8080

// Fetch pending recipes
export const fetchPendingRecipesRequest = () => ({
  type: FETCH_PENDING_RECIPES_REQUEST,
});

export const fetchPendingRecipesSuccess = (recipes: any[]) => ({
  type: FETCH_PENDING_RECIPES_SUCCESS,
  payload: recipes,
});

export const fetchPendingRecipesFailure = (error: string) => ({
  type: FETCH_PENDING_RECIPES_FAILURE,
  payload: error,
});

export const fetchPendingRecipes = () => {
  return async (dispatch: any) => {
    dispatch(fetchPendingRecipesRequest());
    try {
      const response = await axios.get(`${API_URL}/recipes/pending`, {
        headers: {
          Authorization: 'Bearer your_jwt_token_here', // Replace with actual JWT token
        },
      });
      dispatch(fetchPendingRecipesSuccess(response.data));
    } catch (error) {
      dispatch(fetchPendingRecipesFailure(error.message));
    }
  };
};

// Approve recipe
export const approveRecipeRequest = () => ({
  type: APPROVE_RECIPE_REQUEST,
});

export const approveRecipeSuccess = (message: string) => ({
  type: APPROVE_RECIPE_SUCCESS,
  payload: message,
});

export const approveRecipeFailure = (error: string) => ({
  type: APPROVE_RECIPE_FAILURE,
  payload: error,
});

export const approveRecipe = (id: number) => {
  return async (dispatch: any) => {
    dispatch(approveRecipeRequest());
    try {
      await axios.put(`${API_URL}/recipes/${id}/approve`, null, {
        headers: {
          Authorization: 'Bearer your_jwt_token_here', // Replace with actual JWT token
        },
      });
      dispatch(approveRecipeSuccess('Recipe approved successfully.'));
    } catch (error) {
      dispatch(approveRecipeFailure(error.message));
    }
  };
};

// Reject recipe
export const rejectRecipeRequest = () => ({
  type: REJECT_RECIPE_REQUEST,
});

export const rejectRecipeSuccess = (message: string) => ({
  type: REJECT_RECIPE_SUCCESS,
  payload: message,
});

export const rejectRecipeFailure = (error: string) => ({
  type: REJECT_RECIPE_FAILURE,
  payload: error,
});

export const rejectRecipe = (id: number) => {
  return async (dispatch: any) => {
    dispatch(rejectRecipeRequest());
    try {
      await axios.put(`${API_URL}/recipes/${id}/reject`, null, {
        headers: {
          Authorization: 'Bearer your_jwt_token_here', // Replace with actual JWT token
        },
      });
      dispatch(rejectRecipeSuccess('Recipe rejected successfully.'));
    } catch (error) {
      dispatch(rejectRecipeFailure(error.message));
    }
  };
};

// Add recipe
export const addRecipeRequest = () => ({
  type: ADD_RECIPE_REQUEST,
});

export const addRecipeSuccess = (message: string, recipeId: number) => ({
  type: ADD_RECIPE_SUCCESS,
  payload: { message, recipeId },
});

export const addRecipeFailure = (error: string) => ({
  type: ADD_RECIPE_FAILURE,
  payload: error,
});

export const addRecipe = (recipeData: any) => {
  return async (dispatch: any) => {
    dispatch(addRecipeRequest());
    try {
      const response = await axios.post(`${API_URL}/recipes`, recipeData, {
        headers: {
          Authorization: 'Bearer your_jwt_token_here', // Replace with actual JWT token
        },
      });
      dispatch(addRecipeSuccess('Recipe added successfully.', response.data.recipeId));
    } catch (error) {
      dispatch(addRecipeFailure(error.message));
    }
  };
};

// Fetch all recipes
export const fetchAllRecipesRequest = () => ({
  type: FETCH_ALL_RECIPES_REQUEST,
});

export const fetchAllRecipesSuccess = (recipes: any[]) => ({
  type: FETCH_ALL_RECIPES_SUCCESS,
  payload: recipes,
});

export const fetchAllRecipesFailure = (error: string) => ({
  type: FETCH_ALL_RECIPES_FAILURE,
  payload: error,
});

export const fetchAllRecipes = () => {
  return async (dispatch: any) => {
    dispatch(fetchAllRecipesRequest());
    try {
      const response = await axios.get(`${API_URL}/recipes`, {
        headers: {
          Authorization: 'Bearer your_jwt_token_here', // Replace with actual JWT token
        },
      });
      dispatch(fetchAllRecipesSuccess(response.data));
    } catch (error) {
      dispatch(fetchAllRecipesFailure(error.message));
    }
  };
};

// Update recipe
export const updateRecipeRequest = () => ({
  type: UPDATE_RECIPE_REQUEST,
});

export const updateRecipeSuccess = (message: string, recipeId: number) => ({
  type: UPDATE_RECIPE_SUCCESS,
  payload: { message, recipeId },
});

export const updateRecipeFailure = (error: string) => ({
  type: UPDATE_RECIPE_FAILURE,
  payload: error,
});

export const updateRecipe = (id: number, recipeData: any) => {
  return async (dispatch: any) => {
    dispatch(updateRecipeRequest());
    try {
      const response = await axios.put(`${API_URL}/recipes/${id}`, recipeData, {
        headers: {
          Authorization: 'Bearer your_jwt_token_here', // Replace with actual JWT token
        },
      });
      dispatch(updateRecipeSuccess('Recipe updated successfully.', response.data.recipeId));
    } catch (error) {
      dispatch(updateRecipeFailure(error.message));
    }
  };
};

// Delete recipe
export const deleteRecipeRequest = () => ({
  type: DELETE_RECIPE_REQUEST,
});

export const deleteRecipeSuccess = (message: string) => ({
  type: DELETE_RECIPE_SUCCESS,
  payload: message,
});

export const deleteRecipeFailure = (error: string) => ({
  type: DELETE_RECIPE_FAILURE,
  payload: error,
});

export const deleteRecipe = (id: number) => {
  return async (dispatch: any) => {
    dispatch(deleteRecipeRequest());
    try {
      await axios.delete(`${API_URL}/recipes/${id}`, {
        headers: {
          Authorization: 'Bearer your_jwt_token_here', // Replace with actual JWT token
        },
      });
      dispatch(deleteRecipeSuccess('Recipe deleted successfully.'));
    } catch (error) {
      dispatch(deleteRecipeFailure(error.message));
    }
  };
};