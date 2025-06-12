import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MyColor } from '../utilities/MyColor';
import LogoutButton from '../Components/LogoutButton';
import ScreenWrapper from '../Components/ScreenWrapper';
import NavBar from '../Components/NavBar';
import { useCart } from '../context/Cartcontext';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/Authcontext';
import { orderInstance } from '../utilities/AxiosInstance';
import HomeButton from '../Components/HomeButton';
import { endpoints } from '../Configuration/Config';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { products } = useProduct();
  const { authState } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');

  const safeCart = Array.isArray(cart) ? cart : [];

  const getProductById = (id: number) => products.find(p => p.id === id);

  const subtotal = safeCart.reduce((total, item) => {
    const product = getProductById(item.productId);
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0);

  const tax = +(subtotal * 0.1).toFixed(2);
  const delivery = subtotal > 0 ? 40 : 0;
  const totalAmount = subtotal + tax + delivery;

  const handlePlaceOrder = async () => {
    try {
      const orderItems = safeCart.map(item => {
        const product = getProductById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product?.price || 0,
        };
      });

      const orderPayload = {
        userId: authState?.userInfo?.id,
        totalAmount,
        items: orderItems,
      };

      const response = await orderInstance.post(endpoints.order.place, orderPayload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Order placed successfully!');
        clearCart();
        setShowDetails(false);
      } else {
        Alert.alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      Alert.alert('Failed to place order. Please try again.');
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.navbar}>
          <NavBar
            title="Order Summary"
            leftComponent={<HomeButton />}
            rightComponent={<LogoutButton />}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.colName}>Product</Text>
              <Text style={styles.colQty}>Qty</Text>
              <Text style={styles.colPrice}>Price</Text>
            </View>

            {safeCart.map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <View key={item.productId} style={styles.tableRow}>
                  <Text style={styles.colName}>{product.name}</Text>
                  <Text style={styles.colQty}>{item.quantity}</Text>
                  <Text style={styles.colPrice}>
                    ₹{product.price * item.quantity}
                  </Text>
                </View>
              );
            })}

            {safeCart.length === 0 && (
              <Text style={styles.emptyText}>Your cart is empty.</Text>
            )}
          </View>

          {cart.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.totalLine}>Subtotal: ₹{subtotal}</Text>
              <Text style={styles.totalLine}>Tax (10%): ₹{tax}</Text>
              <Text style={styles.totalLine}>Delivery: ₹{delivery}</Text>
              <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>

              {!showDetails && (
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={() => setShowDetails(true)}
                >
                  <Text style={styles.proceedText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              )}

              {showDetails && (
                <>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shipping Details</Text>
                    <TextInput
                      placeholder="Address"
                      value={address}
                      onChangeText={setAddress}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="City"
                      value={city}
                      onChangeText={setCity}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Postal Code"
                      value={postalCode}
                      onChangeText={setPostalCode}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <TouchableOpacity
                      onPress={() => setPaymentMethod('cash')}
                      style={styles.radioRow}
                    >
                      <Text style={styles.radioCircle}>
                        {paymentMethod === 'cash' ? '◉' : '○'}
                      </Text>
                      <Text style={styles.radioLabel}>Cash on Delivery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setPaymentMethod('upi')}
                      style={styles.radioRow}
                    >
                      <Text style={styles.radioCircle}>
                        {paymentMethod === 'upi' ? '◉' : '○'}
                      </Text>
                      <Text style={styles.radioLabel}>UPI</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Notes</Text>
                    <TextInput
                      placeholder="Add any note for the seller"
                      value={orderNotes}
                      onChangeText={setOrderNotes}
                      style={[styles.input, { height: 60 }]}
                      multiline
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handlePlaceOrder}
                    style={styles.placeOrderButton}
                  >
                    <Text style={styles.placeOrderText}>Place Order</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </ScrollView>
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
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tableContainer: {
    marginHorizontal: 15,
    marginTop: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  colName: {
    flex: 2,
    fontSize: 16,
  },
  colQty: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  colPrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  totalLine: {
    fontSize: 16,
    marginVertical: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  proceedButton: {
    backgroundColor: MyColor.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  proceedText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    fontSize: 18,
    marginRight: 10,
  },
  radioLabel: {
    fontSize: 16,
  },
  placeOrderButton: {
    backgroundColor: MyColor.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  placeOrderText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Checkout;
