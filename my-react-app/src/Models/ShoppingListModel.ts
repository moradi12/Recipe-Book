// src/Models/ShoppingListModel.ts

import { ShoppingListItem } from './ShoppingListItem';

export interface ShoppingListModel {
  id: string;
  name: string;
  userId: string;
  items: ShoppingListItem[];
  createdAt: string; // Added
  updatedAt: string; // Added
}
