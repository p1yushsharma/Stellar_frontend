import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  authInstance,
  cartInstance,
  orderInstance,
  productInstance,
  setupInterceptors,
} from "../utilities/AxiosInstance";
import { endpoints } from "../Configuration/Config";
import { deleteTokens, getTokens, saveTokens } from "../utilities/SecureStorage";

interface AuthProps {
  authState?: {
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
    userInfo: {
      id: string;
      email: string;
      name: string;
    } | null;
  };
  onSignup?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onGoogleLogin?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

const allInstances = [authInstance, productInstance, cartInstance, orderInstance];

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
    userInfo: {
      id: string;
      email: string;
      name: string;
    } | null;
  }>({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
    userInfo: null,
  });

  useEffect(() => {
    const initTokens = async () => {
      const tokens = await getTokens();
      if (tokens?.accessToken && tokens?.refreshToken) {
        setAuthorizationHeaders(tokens.accessToken);
        const userInfo = await fetchUserInfo();
        setAuthState({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          authenticated: true,
          userInfo,
        });
      } else {
        setAuthState({
          accessToken: null,
          refreshToken: null,
          authenticated: false,
          userInfo: null,
        });
      }
    };
    initTokens();
  }, []);

  useEffect(() => {
    setupInterceptors(authInstance, Refresh, Logout);
    setupInterceptors(productInstance, Refresh, Logout);
    setupInterceptors(cartInstance, Refresh, Logout);
    setupInterceptors(orderInstance, Refresh, Logout);
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await authInstance.get(endpoints.auth.userInfo);
      return response.data;
    } catch (e) {
      return null;
    }
  };

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

      setAuthorizationHeaders(accessToken);
      await saveTokens(accessToken, refreshToken);

      const userInfo = await fetchUserInfo();

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
        userInfo,
      });

      return { success: true };
    } catch (e: any) {
      return { error: true, msg: e.response?.data?.msg || "Login failed" };
    }
  };

  const GoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn(); 
    const { idToken } = await GoogleSignin.getTokens();

    if (!idToken) throw new Error("No ID token returned");


    const response = await authInstance.post(endpoints.auth.oauthLogin, {
      provider: "google",
      token: idToken,
    });

    const { accessToken, refreshToken } = response.data;

    setAuthorizationHeaders(accessToken);
    await saveTokens(accessToken, refreshToken);

    const userInfo = await fetchUserInfo();

    setAuthState({
      accessToken,
      refreshToken,
      authenticated: true,
      userInfo,
    });

    return { success: true };
  } catch (e: any) {
    return { error: true, msg: e.message || "Google login failed" };
  }
};


  const Logout = async () => {
    try {
      if (authState.refreshToken) {
        await authInstance.post(endpoints.auth.logout, { token: authState.refreshToken });
      }
    } catch {
    } finally {
      await deleteTokens();
      removeAuthorizationHeaders();
      setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
        userInfo: null,
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

      setAuthorizationHeaders(accessToken);
      await saveTokens(accessToken, refreshToken);

      const userInfo = await fetchUserInfo();

      setAuthState((prev) => ({
        ...prev,
        accessToken,
        authenticated: true,
        userInfo,
      }));

      return { success: true };
    } catch {
      await deleteTokens();
      setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
        userInfo: null,
      });
      return { error: true, msg: "Session expired" };
    }
  };

  const value = {
    authState,
    onSignup: Signup,
    onLogin: Login,
    onLogout: Logout,
    onGoogleLogin: GoogleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
