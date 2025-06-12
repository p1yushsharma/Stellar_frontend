import { AxiosInstance } from "axios";
import axios from 'axios';
import { getTokens } from './SecureStorage';
import { baseUrls, ENV } from "../Configuration/Config";

export const authInstance = axios.create({
  baseURL: baseUrls[ENV].auth,
});

export const productInstance = axios.create({
  baseURL: baseUrls[ENV].product,
});
export const cartInstance = axios.create({
  baseURL: baseUrls[ENV].cart,
});
export const orderInstance = axios.create({
  baseURL: baseUrls[ENV].order,
});


export const setupInterceptors = (
  axiosInstance: AxiosInstance,
  onRefresh: () => Promise<any>,
  onLogout: () => Promise<void>
) => {
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalConfig = error.config;
      if (error.response?.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refreshResult = await onRefresh();
          if (refreshResult?.success) {
            const tokens = await getTokens();
            if (tokens?.accessToken) {
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
              originalConfig.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
              return axiosInstance(originalConfig);
            }
          }
        } catch (refreshError) {
          await onLogout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

