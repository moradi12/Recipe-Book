// src/Pages/Redux/AuthReducer.ts

// 1) Define the shape of our AuthState:
export class authState {
  email: string = "";
  name: string = "guest";
  id: number = 0;
  token: string = "";
  userType: string = "";
  isLogged: boolean = false;
}

// 2) Enumerate all action types:
export enum AuthActionType {
  login = "login",
  logout = "logout",
  updateToken = "updateToken",
}

// 3) Define possible payload types:
export type AuthPayload = authState | string | undefined;

// 4) Our action interface:
export interface AuthAction {
  type: AuthActionType;
  payload?: AuthPayload;
}

// 5) Action creators:
export function loginAction(user: authState): AuthAction {
  return { type: AuthActionType.login, payload: user };
}

export function logoutAction(): AuthAction {
  return { type: AuthActionType.logout };
}

export function updateTokenAction(token: string): AuthAction {
  return { type: AuthActionType.updateToken, payload: token };
}

// 6) The reducer itself:
export function AuthReducer(
  currentState: authState = new authState(),
  action: AuthAction
): authState {
  const newState = { ...currentState };

  switch (action.type) {
    case AuthActionType.login:
      return action.payload as authState;

    case AuthActionType.logout:
      return new authState();

    case AuthActionType.updateToken:
      newState.token = action.payload as string;
      return newState;

    default:
      return newState;
  }
}
