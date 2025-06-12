import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import { MyColor } from '../utilities/MyColor';
import NavBar from '../Components/NavBar';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../utilities/type';
import ScreenWrapper from '../Components/ScreenWrapper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../Components/BackButton';
import { useAuth } from '../context/Authcontext';

const UserProfile = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const { onLogout, authState } = useAuth();

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
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.navbar}>
          <NavBar title="Profile" leftComponent={<BackButton />} rightComponent={null} />
        </View>

        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://via.placeholder.com/90' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{authState?.userInfo?.name }</Text>
          <Text style={styles.email}>{authState?.userInfo?.email }</Text>
        </View>

        <View style={styles.menu}>
          <MenuItem
            icon="receipt"
            label="My Orders"
            onPress={() => nav.navigate('OrderHistory')}
          />
          <MenuItem icon="location-on" label="Saved Addresses" isDummy />
          <MenuItem icon="payment" label="Payment Methods" isDummy />
          <MenuItem icon="local-offer" label="Offers" isDummy />
          <MenuItem icon="support-agent" label="Help & Support" isDummy />
          <MenuItem icon="logout" label="Logout" onPress={handleLogout} />
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const MenuItem = ({
  icon,
  label,
  onPress,
  isDummy = false,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
  isDummy?: boolean;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={isDummy ? () => Alert.alert(`${label} coming soon`) : onPress}
  >
    <Icon name={icon} size={24} color={MyColor.Fourth} />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.seventh,
  },
  navbar: {
    height: 60,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 80,
    paddingBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  menu: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#222',
  },
});

export default UserProfile;
