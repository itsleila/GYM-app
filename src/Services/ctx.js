import React, { useContext, createContext } from 'react';
import { useStorageState } from './useStorage.js';
import { deslogar, login, registrar } from './userSettings.js';
import firebaseApp from './firebase.js';

const AuthContext = createContext({
  signIn: (email, password) => {},
  signOut: () => {},
  signUp: (email, password) => {},
  session: null,
  firebaseApp: null,
  isLoading: false,
  changeTheme: () => {},
  theme: null,
  isLoadingTheme: false,
});

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export function SessionProvider({ children }) {
  const [session, setSession] = useStorageState('session');
  const [theme, setTheme] = useStorageState('theme');

  const signIn = async (email, password) => {
    try {
      await login(email, password, setSession);
    } catch (error) {
      console.error('Erro ao tentar logar', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await deslogar();
      setSession(null);
    } catch (error) {
      console.error('Erro ao tentar deslogar conta:', error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      await registrar(email, password, setSession);
    } catch (error) {
      console.error('Erro ao tentar criar conta', error);
      throw error;
    }
  };

  const changeTheme = async (newTheme) => {
    await setTheme(newTheme);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        session,
        firebaseApp: null,
        isLoading: false,
        changeTheme,
        theme,
        isLoadingTheme: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
