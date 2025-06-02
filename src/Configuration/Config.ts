
export const ENV = 'development';

export const baseUrls = {
  development: {
    auth: 'http://10.0.2.2:8080/api',
    product: 'http://10.0.2.2:8082/api',
    cart: 'http://10.0.2.2:8083/api',
  },

};

export const endpoints = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  product: {
    getAll: '/menu-items/get-all',
    getById: (id: number) => `/menu-items/get/${id}`,
  },
 cart: {
  add: '/cart/add',
  remove: (productId: number) => `/cart/remove/${productId}`,
  clear: '/cart/clear', 
  get: '/cart/get',
  update: '/cart/update'
}

};
