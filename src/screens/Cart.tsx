import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { MyColor } from '../utilities/MyColor';
import LogoutButton from '../Components/LogoutButton';
import ScreenWrapper from '../Components/ScreenWrapper';
import NavBar from '../Components/NavBar';
import { useCart } from '../context/Cartcontext';
import { useProduct } from '../context/ProductContext'; 
import HomeButton from '../Components/HomeButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../utilities/type';
import { Alert } from 'react-native';
const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { products } = useProduct();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  
  const getProductById = (id: number) => products.find(p => p.id === id);
 const handleCheckout = () => {
  if (cart.length === 0) {
    Alert.alert("Cart is empty", "Please add some items before proceeding to checkout.");
    return;
  }

  Alert.alert(
    "Proceed to Checkout",
    "Do you want to review your order and proceed to payment?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: () => nav.navigate('Checkout')
      }
    ]
  );
};

const  safeCart = Array.isArray(cart) ? cart : [];
const totalAmount = safeCart.reduce((total, item) => {
  const product = getProductById(item.productId);
  if (!product) return total;
  return total + product.price * item.quantity;
}, 0);


const renderItem = useCallback(({ item }: { item: { productId: number; quantity: number } }) => {
  const product = getProductById(item.productId);
  if (!product) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{product.name}</Text>
      <Text>Price: ₹{product.price}</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity
          onPress={() => {
            if (item.quantity > 1) {
              updateQuantity(item.productId, item.quantity - 1);
            }
          }}
        >
          <Text style={styles.button}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.productId, item.quantity + 1)}>
          <Text style={styles.button}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeFromCart(item.productId)}>
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}, [products, updateQuantity, removeFromCart]);

  

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.navbar}>
          <NavBar
            title="Cart"
            leftComponent={<HomeButton />}
            rightComponent={<LogoutButton />}
          />
        </View>

        <FlatList
          data={safeCart}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.productId}`}
          extraData={cart}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
        />
        {cart.length > 0 && (
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearButton}>Clear Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Checkout</Text>
             </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary,
    paddingTop: 50,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    fontSize: 20,
    marginHorizontal: 10,
    color: MyColor.primary,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  remove: {
    marginLeft: 20,
    color: MyColor.primary,
  },
  totalText: {
    flex: 2,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 15,
  borderTopWidth: 1,
  borderColor: '#ccc',
  backgroundColor: '#f8f8f8',
  height: 100,
},

    header: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
   clearButton: {
    flex: 1,
    marginTop: 20,
    color: MyColor.primary,
    textAlign: 'right',
    marginRight: 50,
  },
  listContent: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#888',
  },
  checkoutText: {
    flex: 1,
    marginTop: 20,
    color: MyColor.primary,
    textAlign: 'left',
},

});
export default Cart;
