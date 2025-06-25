import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { orderInstance } from '../utilities/AxiosInstance';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/Authcontext';
import ScreenWrapper from '../Components/ScreenWrapper';
import NavBar from '../Components/NavBar';
import { endpoints } from '../Configuration/Config';
import { MyColor } from '../utilities/MyColor';
import BackButton from '../Components/BackButton';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { authState } = useAuth();
  const { products } = useProduct();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderInstance.get(endpoints.order.getAll );
        setOrders(response.data || []);
      } catch (e) {
        console.error('Failed to fetch orders', e);
      }
    };
    fetchOrders();
  }, [authState]);

  const getProductName = (id: number) => {
    const product = products.find(p => p.id === id);
    return product?.name || 'Unknown';
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.navbar}>
          <NavBar
            title="My Orders"
            leftComponent={<BackButton/>}
            rightComponent={null}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>You have no orders yet.</Text>
          ) : (
            orders.map(order => (
              <View key={order.orderId} style={styles.orderCard}>
                <Text style={styles.orderTitle}>
                  Order #{order.orderId} - {new Date(order.orderDate).toLocaleDateString()}
                </Text>
                <View style={styles.tableHeader}>
                  <Text style={styles.colName}>Product</Text>
                  <Text style={styles.colQty}>Qty</Text>
                  <Text style={styles.colPrice}>Price</Text>
                </View>

                {order.items.map((item: any) => (
                  <View key={item.productId} style={styles.tableRow}>
                    <Text style={styles.colName}>{getProductName(item.productId)}</Text>
                    <Text style={styles.colQty}>{item.quantity}</Text>
                    <Text style={styles.colPrice}>
                      ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <Text style={styles.totalText}>
                  Total: ₹{order.totalAmount.toFixed(2)}
                </Text>
              </View>
            ))
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
  orderCard: {
    marginHorizontal: 15,
    marginTop: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
  totalText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 150,
    fontSize: 16,
    color: '#888',
  },
});

export default OrderHistory;
