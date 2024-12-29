// src/Components/Redux/Customer/CustomerReducer.ts

import { Recipe } from "../../Models/Recipe";

// Define the state for customers
export class CustomerState {
  recipes: Recipe[] = [];
}

// Define the action types
export enum CustomerActionType {
  CLEAR_CUSTOMER_STATE = "CLEAR_CUSTOMER_STATE",
  ADD_CUSTOMER = "ADD_CUSTOMER",
}

// Define the action interface
export interface CustomerAction {
  type: CustomerActionType;
  payload?: Recipe[];
}

// Action Creators
export function clearCustomerStateAction(): CustomerAction {
  return { type: CustomerActionType.CLEAR_CUSTOMER_STATE };
}

export function addCustomerAction(recipes: Recipe[]): CustomerAction {
  return { type: CustomerActionType.ADD_CUSTOMER, payload: recipes };
}

// Reducer
export function CustomerReducer(
  currentState: CustomerState = new CustomerState(),
  action: CustomerAction
): CustomerState {
  const newState = { ...currentState };

  switch (action.type) {
    case CustomerActionType.CLEAR_CUSTOMER_STATE:
      newState.recipes = [];
      break;
    case CustomerActionType.ADD_CUSTOMER:
      if (action.payload) {
        newState.recipes = action.payload;
      }
      break;
  }

  return newState;
}
