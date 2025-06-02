import React, { createContext, useContext, useState, useEffect } from "react";
import { authInstance, cartInstance, productInstance, setupInterceptors } from "../utilities/AxiosInstance";
import { endpoints } from "../Configuration/Config";
import { deleteTokens, getTokens, saveTokens } from "../utilities/SecureStorage";

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

export const useAuth = () => useContext(AuthContext);

const allInstances = [authInstance, productInstance,cartInstance];

const setAuthorizationHeaders = (accessToken: string) => {
  allInstances.forEach(instance => {
    instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  });
};

const removeAuthorizationHeaders = () => {
  allInstances.forEach(instance => {
    delete instance.defaults.headers.common["Authorization"];
  });
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
    const initTokens = async () => {
      const tokens = await getTokens();
      if (tokens?.accessToken && tokens?.refreshToken) {
        setAuthState({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          authenticated: true,
        });
        setAuthorizationHeaders(tokens.accessToken);
      } else {
        setAuthState({
          accessToken: null,
          refreshToken: null,
          authenticated: false,
        });
      }
    };
    initTokens();
  }, []);

  useEffect(() => {
    setupInterceptors(authInstance, Refresh, Logout);
    setupInterceptors(productInstance, Refresh, Logout);
    setupInterceptors(cartInstance, Refresh, Logout);
  }, []);

  const Signup = async (email: string, password: string) => {
    try {
      return await authInstance.post(endpoints.auth.signup, { email, password });
    } catch (e: any) {
      return { error: true, msg: e.response?.data?.msg || "Signup failed" };
    }
  };

  const Login = async (email: string, password: string) => {
    try {
      const response = await authInstance.post(endpoints.auth.login, { email, password });
      const { accessToken, refreshToken } = response.data;

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
      });

      setAuthorizationHeaders(accessToken);
      await saveTokens(accessToken, refreshToken);

      return { success: true };
    } catch (e: any) {
      return { error: true, msg: e.response?.data?.msg || "Login failed" };
    }
  };

  const Logout = async () => {
    try {
      if (authState.refreshToken) {
        await authInstance.post(endpoints.auth.logout, { token: authState.refreshToken });
      }
    } catch {
      // ignore logout errors
    } finally {
      await deleteTokens();
      removeAuthorizationHeaders();
      setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  };

  const Refresh = async () => {
    try {
      const tokens = await getTokens();
      const refreshToken = tokens?.refreshToken;

      if (!refreshToken) throw new Error("No refresh token");

      const response = await authInstance.post(endpoints.auth.refresh, { refreshToken });

      const { accessToken } = response.data;

      setAuthState((prev) => ({
        ...prev,
        accessToken,
        authenticated: true,
      }));

      setAuthorizationHeaders(accessToken);
      await saveTokens(accessToken, refreshToken);

      return { success: true };
    } catch {
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
    authState,
    onSignup: Signup,
    onLogin: Login,
    onLogout: Logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
