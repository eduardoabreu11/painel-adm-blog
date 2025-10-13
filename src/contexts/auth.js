import { createContext, useState } from "react";
import api from "../constants/api";

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storage = localStorage.getItem("usuario-blog");
    if (storage) {
      const userData = JSON.parse(storage);
      // configura o token no axios logo de cara
      if (userData.token) {
        api.defaults.headers.common["Authorization"] = "Bearer " + userData.token;
      }
      return userData;
    }
    return null;
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };