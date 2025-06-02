import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Product } from '../utilities/type';
import { useCart } from '../context/Cartcontext';
import { MyColor } from '../utilities/MyColor';

interface Props {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    await addToCart(product.id, 1);
    ToastAndroid.show(`${product.name} added to cart!`, ToastAndroid.SHORT);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {product.imageUrl && <Image source={{ uri: product.imageUrl }} style={styles.image} />}
      <Text style={styles.name}>{product.name}</Text>
      {product.description && <Text style={styles.description}>{product.description}</Text>}
      <Text style={styles.price}>₹{product.price}</Text>
      <Text>{product.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</Text>
      <Text>{product.category?.name}</Text>
      <Text>{product.category?.description}</Text>

      <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    elevation: 3,
  },
  image: {
    height: 150,
    width: '100%',
    borderRadius: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    color: 'green',
    marginTop: 4,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: MyColor.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductCard;
