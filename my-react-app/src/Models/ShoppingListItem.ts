// src/Models/ShoppingListItem.ts

export class ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  isPurchased: boolean;

  constructor(
    id: string,
    name: string,
    quantity: string,
    isPurchased: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.isPurchased = isPurchased;
  }

  togglePurchased(): void {
    this.isPurchased = !this.isPurchased;
  }
}
