import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/core';
import { RootStackParamList } from '../utilities/type';

const HomeButton = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  const goToHome = () => {
    nav.navigate('Home');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={goToHome}>
      <Image
        source={require('../assets/home.png')} 
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
 
  },
  icon: {
    width: 40,
    height: 40,
    
  },
});

export default HomeButton;
