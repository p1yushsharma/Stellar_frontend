import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { MyColor } from '../utilities/MyColor';
import NavBar from '../Components/NavBar';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../utilities/type';
import ProductCard from '../Components/ProductCard';
import { useProduct } from '../context/ProductContext';
import ScreenWrapper from '../Components/ScreenWrapper';
import HomeButton from '../Components/HomeButton';

const ProductDetail = () => {
  const { products } = useProduct();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.navbar}>
        <NavBar
          title="Explore"
          leftComponent={<HomeButton />}
          rightComponent={
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Image source={require('../assets/cart.png')} style={styles.cartIcon} />
            </TouchableOpacity>
          }
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList 
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </View> 
    </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContainer: {
    flex: 4,
    backgroundColor:MyColor.sixth,
    borderRadius: 8,
    padding: 10,
    marginTop: 100,
  },
  navbar: {
    position: 'absolute',
  },
  cartIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});

export default ProductDetail;

