import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/Authcontext';
import AppNAV from './src/Navigation/AppNav';
import { ProductProvider } from './src/context/ProductContext';
import Toast from 'react-native-toast-message';
import { CartProvider } from './src/context/Cartcontext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '867187817891-ga6228nh62eu8217fiec5hf5qknpi1f8.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <AppNAV />
          <Toast />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
