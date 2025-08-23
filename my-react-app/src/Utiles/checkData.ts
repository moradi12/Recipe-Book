import { jwtDecode } from "jwt-decode";
import { login } from "../Pages/Redux/slices/unifiedAuthSlice";
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

  if (!state.auth.token || state.auth.token.length < 10) {
    try {
      const storedJwt = sessionStorage.getItem("jwt");
      if (!storedJwt) {
        return;
      }

      const decoded_jwt = jwtDecode<jwtData>(storedJwt);

      const myAuth = {
        id: decoded_jwt.id,
        email: decoded_jwt.sub,
        name: decoded_jwt.userName,
        token: storedJwt,
        userType: decoded_jwt.userType,
        isLogged: true,
      };

      recipeSystem.dispatch(login(myAuth));
    } catch (error) {
      console.error("Error decoding JWT", error);
      return;
    }
  }
};
