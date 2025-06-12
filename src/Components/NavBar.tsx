import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { MyColor } from '../utilities/MyColor';

interface NavBarProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const NavBar: React.FC<NavBarProps> = ({
  title,
  leftComponent,
  rightComponent,
  style
}) => {
  return (
    <View style={[styles.navBar, style]}>
      <View style={styles.sideContainer}>{leftComponent}</View>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.sideContainer}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: 80,
    width: '100%',
    backgroundColor: MyColor.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    elevation: 4,
    zIndex: 1000,
  },
  sideContainer: {
     width: 60,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 25,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  },
});

export default NavBar;
