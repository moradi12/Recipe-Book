import { UserType } from "./UserType";

// Models/User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  userType: UserType;
}
