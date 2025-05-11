import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useauth } from '../context/Authcontext';
import { NavigationProp } from '@react-navigation/core'
import { RootStackParamList } from '../type';
const LogoutButton = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const { onLogout } = useauth();

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          if (onLogout) {
            await onLogout();           
          }
          nav.navigate('Login');       
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LogoutButton;
