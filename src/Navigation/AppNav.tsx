import React, { useEffect, useState } from 'react';
import Splash from '../screens/splash';
import Login from '../screens/Login';
import Signup from '../screens/signup';
import Home from '../screens/Home';
import Cart from '../screens/Cart';
import Checkout from '../screens/Checkout';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utilities/type';
import { useAuth } from '../context/Authcontext';
import ProductDetail from '../screens/ProductDetail';
import UserProfile from '../screens/UserProfile';
import OrderHistory from '../screens/OrderHistory';

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
          <><Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="UserProfile" component={UserProfile}/>
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
          </>
          
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
