

const config = {
    development: {
      API_BASE_URL: 'http://10.0.2.2:8080/api',  
      endpoints: {
        login: '/auth/login',
        signup: '/auth/signup',
       
      },
      screens: {
        splash: 'Splash',  
        login: 'Login',
        signup: 'Signup',
        home: 'Home',
      
      },
    },
    production: {
      API_BASE_URL: 'https://your-production-api-url.com/api',  
      endpoints: {
        login: '/auth/login',
        signup: '/auth/signup',
        
      },
      screens: {
        splash: 'Splash',
        login: 'Login',
        signup: 'Signup',
        home: 'Home',
      
      },
    },
    staging: {
      API_BASE_URL: 'https://staging-api-url.com/api',  
      endpoints: {
        login: '/auth/login',
        signup: '/auth/signup',
       
      },
      screens: {
        splash: 'Splash',
        login: 'Login',
        signup: 'Signup',
        home: 'Home',
      
      },
    },
  };
  

  const currentEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'staging';
  
  export const API_BASE_URL = config[currentEnv].API_BASE_URL;
  export const endpoints = config[currentEnv].endpoints;
  export const screens = config[currentEnv].screens;
  