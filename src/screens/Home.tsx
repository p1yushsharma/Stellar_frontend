import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  Pressable,
  Animated,
  ImageBackground,
} from 'react-native';
import { MyColor } from '../utilities/MyColor';
import LogoutButton from '../Components/LogoutButton';
import NavBar from '../Components/NavBar';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../utilities/type';
import { useProduct } from '../context/ProductContext';
import { useScaleAnimation } from '../utilities/Animation';
import ScreenWrapper from '../Components/ScreenWrapper';
import Marquee from '../Components/Marquee';

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string;
}

const Home = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const { products } = useProduct();
  const { scale, onPressIn, onPressOut } = useScaleAnimation();

  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => nav.navigate('ProductDetail')}
        style={{ margin: 10 }}
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
      <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.navbar}>
          <NavBar
            title="Home"
            leftComponent={<LogoutButton style={{ marginRight: 10 }} />}
            rightComponent={
              <TouchableOpacity onPress={() => nav.navigate('Cart')}>
                <Image
                  source={require('../assets/cart.png')}
                  style={{ width: 50, height: 50, marginRight: 10 }}
                />
              </TouchableOpacity>
            }
          />
         <Marquee
         text="welcome to foodies , devour the tatsties meals you would love !"
         duration={5000}
         containerStyle={{ backgroundColor: '#ddd', borderRadius: 5 }}
         textStyle={{ fontSize: 18, color: '#333' }}
         />
          <View style={styles.carosuel}>
            <FlatList
              data={products.filter((product) => product !== null && product !== undefined)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={true}
              renderItem={renderProduct}
            />
            <View>
               <TouchableOpacity onPress={() => nav.navigate('ProductDetail')}>
              <Text style={styles.text1}> see more</Text>
              </TouchableOpacity>
            </View>
          </View>
           <View style={styles.carosuel_special}>
            <FlatList
              data={products.filter((product) => product !== null && product !== undefined)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={true}
              renderItem={renderProduct}
            />
            <View>
               <TouchableOpacity onPress={() => nav.navigate('ProductDetail')}>
              <Text style={styles.text1}> see more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScreenWrapper>

  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 100,
  },
  carosuel: {
    width: '100%',
    height: 210,
    backgroundColor: MyColor.seventh,
    marginTop: 100,
  },
   carosuel_special: {
    width: '100%',
    height: 210,
    backgroundColor: MyColor.seventh,
    marginTop: 150,
  },
  card: {
    width: 120,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  text1:{
   fontSize:16 ,
    color: 'cream',
    marginTop: 4,
    marginBottom:4,
    marginLeft:180,
  }
});

export default Home;
