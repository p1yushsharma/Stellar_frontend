
export const googleAuthConfig = {
  issuer: 'https://accounts.google.com',
  clientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  redirectUrl: 'com.frontend:/oauth2redirect/google', 
  scopes: ['openid', 'profile', 'email'],
};
