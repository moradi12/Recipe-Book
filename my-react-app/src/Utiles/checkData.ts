// src/Utiles/checkData.ts

import { jwtDecode } from "jwt-decode";
import { loginAction } from "../Pages/Redux/AuthReducer";
import { recipeSystem } from "../Pages/Redux/store";

type jwtData = {
  userType: string;
  userName: string;
  id: number;
  sub: string;
  iat: number;
  exp: number;
};

export const checkData = () => {
  const state = recipeSystem.getState();

  // 1) If there's no valid token in Redux or token length is too short, proceed:
  if (!state.auth.token || state.auth.token.length < 10) {
    try {
      // 2) Attempt to retrieve the JWT from sessionStorage
      const storedJwt = sessionStorage.getItem("jwt");
      if (!storedJwt) {
        return;
      }

      // 3) Decode the stored JWT
      const decoded_jwt = jwtDecode<jwtData>(storedJwt);
      console.log(decoded_jwt);

      // 4) Build a new auth object
      const myAuth = {
        id: decoded_jwt.id,
        email: decoded_jwt.sub,
        name: decoded_jwt.userName,
        token: storedJwt,
        userType: decoded_jwt.userType,
        isLogged: true,
      };

      // 5) Dispatch to Redux, logging the user in
      recipeSystem.dispatch(loginAction(myAuth));
    } catch (error) {
      console.error("Error decoding JWT", error);
      return;
    }
  }
};
