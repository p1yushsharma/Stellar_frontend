import React, { useEffect, useState } from 'react';
import Splash from '../screens/splash';
import Login from '../screens/Login';
import Signup from '../screens/signup';
import Home from '../screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type';
import { useAuth } from '../context/Authcontext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNAV = () => {
  const { authState } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
  
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);


  if (showSplash || authState?.authenticated === null) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authState?.authenticated ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNAV;
