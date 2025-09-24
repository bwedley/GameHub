import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const platforms = [
    "Steam",
    "EpicGames",
    "Xbox",
    "PlayStation",
    "Switch",
    "Mobile",
    "PC",
  ];

  useEffect(() => {
    const usuarioLogado = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setLoading(false);
    });
    return () => usuarioLogado();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, handleLogout, platforms }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
