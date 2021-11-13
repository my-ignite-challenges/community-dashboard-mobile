import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import * as AuthSessions from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../services/api";

const CLIENT_ID = "you_client_id";
const SCOPE = "read:user";
const USER_FROM_STORAGE = "@dowhile:user";
const TOKEN_FROM_STORAGE = "dowhile:token";

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
};

type AuthContext = {
  user: User | null;
  isLoggingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProvider = {
  children: ReactNode;
};

type AuthResponse = {
  token: string;
  user: User;
};

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  };
  type?: string;
};

const AuthContext = createContext({} as AuthContext);

function AuthProvider({ children }: AuthProvider) {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const signIn = async () => {
    try {
      setIsLoggingIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
      const authSessionReponse = (await AuthSessions.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (
        authSessionReponse.type === "success" &&
        authSessionReponse.params.error !== "access_denied"
      ) {
        const authResponse = await api.post("/authenticate", {
          code: authSessionReponse.params.code,
        });

        const { user, token } = authResponse.data as AuthResponse;

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await AsyncStorage.setItem(USER_FROM_STORAGE, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_FROM_STORAGE, token);

        setUser(user);
      }
    } catch (error) {
      Alert.alert(`${error}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_FROM_STORAGE);
    await AsyncStorage.removeItem(TOKEN_FROM_STORAGE);
  };

  useEffect(() => {
    async function loadUserFromStorage() {
      const userFromStorage = await AsyncStorage.getItem(USER_FROM_STORAGE);
      const tokenFromStorage = await AsyncStorage.getItem(TOKEN_FROM_STORAGE);

      if (userFromStorage && tokenFromStorage) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenFromStorage}`;
        setUser(JSON.parse(userFromStorage));
      }

      setIsLoggingIn(false);
    }

    loadUserFromStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isLoggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
