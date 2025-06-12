import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, ViewStyle, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/Authcontext';
import { NavigationProp } from '@react-navigation/core'
import { RootStackParamList } from '../utilities/type';
import { MyColor } from '../utilities/MyColor';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface LogoutButtonProps {
  style?: ViewStyle;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ style }) => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const { onLogout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          if (onLogout) {
            await onLogout(); 
            nav.navigate('Login');            
          }
             
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
    <Icon name="logout"
          size={30} 
          color={MyColor.Fourth} 
    />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#e8e8e8',
    padding: 4,
  
    alignItems: 'center',
    justifyContent: 'center',
  },
   icon: {
    width: 40,
    height: 40,
    
  },

});

export default LogoutButton;
