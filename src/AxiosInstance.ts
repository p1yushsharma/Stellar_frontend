import axios from 'axios';
import { getTokens, saveTokens, deleteTokens } from './utilities/SecureStorage';
import { API_BASE_URL, endpoints } from './Configuration/Config';
import { AuthProvider, useAuth } from './context/Authcontext';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

 export const setupInterceptors = (onRefresh: () => Promise<any>, onLogout: () => Promise<any>) => {
  axiosInstance.interceptors.response.use(
    res => res,
    async err => {
      const originalConfig = err.config;
      if (err.response?.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const result = await onRefresh();
          if (result?.success) {
            const tokens = await getTokens();
            const accessToken = tokens?.accessToken;
            if (accessToken) {
              axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
              originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;
              return axiosInstance(originalConfig);
            }
          }
        } catch {
          await onLogout();
        }
      }
      return Promise.reject(err);
    }
  );
};

export default axiosInstance;
