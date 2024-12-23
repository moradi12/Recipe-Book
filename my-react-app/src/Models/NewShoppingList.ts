// src/Models/NewShoppingList.ts

export class NewShoppingList {
    name: string;
    userId: string;
  
    constructor(name: string, userId: string) {
      this.name = name;
      this.userId = userId;
    }
  }
  