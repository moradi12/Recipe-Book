// Models/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  // Add other relevant fields
}

// Models/ShoppingListItem.ts
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  isPurchased: boolean;
  // Add other relevant fields
}

/**
 * Interface representing a shopping list.
 */
export interface ShoppingList {
  id: string;
  name: string;
  user: User; // Association to User
  items: ShoppingListItem[];
  createdAt: string; // ISO string for serialization
  updatedAt: string; // ISO string for serialization
}
