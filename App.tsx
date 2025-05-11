import React from 'react';
import { AuthProvider } from './src/context/Authcontext';
import AppNAV from './src/Navigation/AppNav';


const App = () => {
  return (
    <AuthProvider>
      <AppNAV />
    </AuthProvider> 
  );
};

export default App;
