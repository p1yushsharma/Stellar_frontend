export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    Cart: undefined;
    ProductDetail: undefined;
};
   
export type Product = {
  id: number;
  name: string;
  
  description?: string | null;
  price: number;
  imageUrl?: string 
  isVegetarian?: boolean;
  available?: boolean | null;
  category?: {
    id: number;
    name: string;
    description?: string | null;
  };
}