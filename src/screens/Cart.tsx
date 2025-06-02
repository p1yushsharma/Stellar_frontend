import React from 'react';
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

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { products } = useProduct();

  
  const getProductById = (id: number) => products.find(p => p.id === id);


  const totalAmount = cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0);

  const renderItem = ({ item }: { item: { productId: number; quantity: number } }) => {
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
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.navbar}>
          <NavBar
            title="Cart"
            leftComponent={[<HomeButton />]}
            rightComponent={[<LogoutButton key="logout-right" />]}
          />
        </View>

        <FlatList
          data={cart}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
        />

        {cart.length > 0 && (
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearButton}>Clear Cart</Text>
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
    color: 'red',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  clearButton: {
    marginTop: 10,
    color: 'red',
    textAlign: 'right',
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
});

export default Cart;
