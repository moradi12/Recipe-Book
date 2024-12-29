import { combineReducers } from '@reduxjs/toolkit';
import recipeReducer from '../../../src/Pages/Redux/slices/RecipeReducer'; // Import the recipe reducer
import { AuthReducer } from './AuthReducer';

const rootReducer = combineReducers({
    auth: AuthReducer,
    recipes: recipeReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
