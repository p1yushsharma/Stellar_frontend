import React, { useEffect } from 'react';
import { View, Text, StatusBar, Image, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type';
import { MyColor } from '../utilities/MyColor';

type SplashNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const Splash = () => {
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Signup');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/restaurant.png')}
          style={styles.logo}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Foodies</Text>
          <Text style={styles.subtitle}>serving delicacy</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: MyColor.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    tintColor: MyColor.secondary,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 75,
    color: MyColor.Third,
  },
  subtitle: {
    fontSize: 17,
    color: MyColor.Third,
    textAlign: 'center',
    letterSpacing: 5,
    marginTop: -15,
  },
});

export default Splash;
