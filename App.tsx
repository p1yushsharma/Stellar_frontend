import React from 'react';
import { AuthProvider } from './src/context/Authcontext';
import AppNAV from './src/Navigation/AppNav';
import { ProductProvider } from './src/context/ProductContext';
import Toast from 'react-native-toast-message';
import { CartProvider } from './src/context/Cartcontext';

const App = () => {
  return (
    <AuthProvider>
     <ProductProvider>
      <CartProvider>
        <AppNAV />
      </CartProvider>
      </ProductProvider>
    </AuthProvider> 
  );
};

export default App;
