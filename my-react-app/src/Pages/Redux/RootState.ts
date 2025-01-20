import { combineReducers } from '@reduxjs/toolkit';
import recipeReducer from '../../../src/Pages/Redux/slices/recipeReducer'; // Import the recipe reducer
import { AuthReducer } from './AuthReducer';
import AdminReducer from './slices/AdminReducer';

const rootReducer = combineReducers({
    auth: AuthReducer,
    recipes: recipeReducer, 
    admin: AdminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
