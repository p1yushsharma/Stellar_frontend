import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../AxiosInstance";
import { API_BASE_URL, endpoints } from "../Configuration/Config";
import { deleteTokens, getTokens, saveTokens } from "../utilities/SecureStorage";
import { setupInterceptors } from "../AxiosInstance";
import axios from "axios";

interface AuthProps {
    authState?: {
      accessToken: string | null;
      refreshToken: string | null;
      authenticated: boolean | null;
    };
    onSignup?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
  }>({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
  });

  useEffect(() => {
    const checkTokens = async () => {
      const tokens = await getTokens();
      if (tokens && tokens.accessToken && tokens.refreshToken) {
        setAuthState({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            authenticated: true,
        });
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tokens.accessToken}`;
      } else {
        setAuthState({
            accessToken: null,
            refreshToken: null,
            authenticated: false,
        });
      }
    };
    checkTokens();
  }, []);
  
  useEffect(() => {
    setupInterceptors(Refresh, Logout);
  }, []);

  const Signup = async (email: string, password: string) => {
    try {
      return await axiosInstance.post(`${API_BASE_URL}${endpoints.signup}`, { email, password });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const Login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoints.login}`, { email, password });
      const { accessToken, refreshToken } = response.data;

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
      });

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      await saveTokens(accessToken, refreshToken); 

      return;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const Logout = async () => {
    if (authState.refreshToken) {
      const response = await axiosInstance.post(`${API_BASE_URL}${endpoints.logout}`, {
        token: authState.refreshToken,
      });
    }
    await deleteTokens(); 
    axiosInstance.defaults.headers.common["Authorization"] = "";
    setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
    });
  };

  const Refresh = async () => {
    try {
      const tokens = await getTokens();
      const refreshToken = tokens?.refreshToken;

      if (!refreshToken) throw new Error("No refresh token");

      const response = await axiosInstance.post(`${API_BASE_URL}${endpoints.refresh}`, {
        refreshToken,
      });

      const { accessToken } = response.data;

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
      });

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      await saveTokens(accessToken, refreshToken);  
      return { success: true };
    } catch (e) {
      await deleteTokens();  
      setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
      return { error: true, msg: "Session expired" };
    }
  };

  const value = {
    onSignup: Signup,
    onLogin: Login,
    onLogout: Logout,
    onRefresh: Refresh,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
