

export const ENV = 'development';

export const baseUrls = {
  development: {
    auth: 'https://stellar-463207.uc.r.appspot.com/api',
    product: 'https://product-service-dot-stellar-463207.uc.r.appspot.com/api',
    cart: 'http://cart-service-dot-stellar-463207.uc.r.appspot.com/api',
    order: 'http://order-service-dot-stellar-463207.uc.r.appspot.com/api',
  },

};

export const endpoints = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    userInfo: '/auth/userinfo',
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
},
order:{
place: '/orders/placeOrder',
getAll: '/orders/getUserOrders',
}

};
