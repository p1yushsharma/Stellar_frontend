import React, { useEffect, useState } from 'react';
import Splash from '../screens/splash';
import Login from '../screens/Login';
import Signup from '../screens/signup';
import Home from '../screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type';
import { useauth } from '../context/Authcontext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNAV = () => {
  const { authState } = useauth();
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        {authState?.authenticated ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Splash" component={Splash} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNAV;
