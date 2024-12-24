import { UserType } from "./UserType";

export class Permissions {
    private userType: UserType;
    private userId: number; // User's unique identifier
    private recipeOwnerId: number; // Owner's unique identifier of the recipe

    constructor(userType: UserType, userId: number, recipeOwnerId: number) {
        this.userType = userType;
        this.userId = userId;
        this.recipeOwnerId = recipeOwnerId;
    }

    canEditRecipe(): boolean {
        // Admin can edit any recipe
        if (this.userType === UserType.ADMIN) {
            return true;
        }
        // Customers can edit only recipes they created
        return this.userType === UserType.CUSTOMER && this.userId === this.recipeOwnerId;
    }

    canDeleteRecipe(): boolean {
        return this.userType === UserType.ADMIN;
    }

}