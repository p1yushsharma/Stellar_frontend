import React, { createContext, useContext, useState, useEffect } from "react";
import { productInstance } from "../utilities/AxiosInstance";
import { endpoints } from "../Configuration/Config";
import { useAuth } from "./Authcontext";
import { Product } from "../utilities/type";
const ProductContext = createContext<ProductContextProps>({
  products: [],
  fetchProducts: async () => {},
  getProductById: async () => undefined,
});

interface ProductContextProps {
  products: Product[];
  fetchProducts: () => Promise<void>;
  getProductById: (id: number) => Promise<Product | undefined>;
}

export const useProduct = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { authState } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await productInstance.get<Product[]>(endpoints.product.getAll);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const getProductById = async (id: number): Promise<Product | undefined> => {
    const product = products.find(p => p.id === id);
    if (product) return product;

    try {
      const response = await productInstance.get<Product>(endpoints.product.getById(id));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product by ID", error);
      return undefined;
    }
  };

  useEffect(() => {
    if (authState?.authenticated) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [authState?.authenticated]);

  useEffect(() => {
    console.log("Products updated:", products);
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, fetchProducts, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};
