// // src/contexts/AuthContext.tsx
// import React, { createContext, ReactNode, useEffect, useState } from 'react';
// import { isAuthenticated } from './authService';

// interface AuthContextType {
//   isAuth: boolean;
//   setIsAuth: (auth: boolean) => void;
// }

// export const AuthContext = createContext<AuthContextType>({
//   isAuth: false,
//   setIsAuth: () => {},
// });

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuth(isAuthenticated());
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuth, setIsAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
