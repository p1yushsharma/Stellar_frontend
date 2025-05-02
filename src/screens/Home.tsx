import React from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';
import { MyColor } from '../utilities/MyColor';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredView}>
        <Image
          style={styles.logo}
          source={require('../assets/restaurant.png')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default Home;
