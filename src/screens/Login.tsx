import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { MyColor } from '../utilities/MyColor';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { NavigationProp } from '@react-navigation/core';
import { RootStackParamList } from '../utilities/type';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Login = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { onLogin, onGoogleLogin } = useAuth();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    try {
      if (!onLogin) {
        Alert.alert('Login Failed', 'Authentication function is missing.');
        return;
      }

      const result = await onLogin(email, password);

      if (result && !result.error) {
        Alert.alert('Login Successful', 'Welcome back!');
        nav.navigate('Home');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials');
      } else {
        Alert.alert('Login Failed', 'An error occurred. Please try again later.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!onGoogleLogin) {
        Alert.alert('Login Failed', 'Google login function not available.');
        return;
      }

      const result = await onGoogleLogin();

      if (result && !result.error) {
        Alert.alert('Login Successful', 'Welcome via Google!');
        nav.navigate('Home');
      } else {
        Alert.alert('Login Failed', result.msg || 'Google login failed');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Login Failed', 'Google sign-in error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <Image
            style={styles.logo}
            source={require('../assets/restaurant.png')}
          />
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Enter Your Email and Password</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                secureTextEntry={isVisible}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <Entypo
                onPress={() => setIsVisible(!isVisible)}
                name={isVisible ? 'eye' : 'eye-with-line'}
                size={24}
                color="black"
              />
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Google Login Button */}
            <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleButton}>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an Account?</Text>
              <TouchableOpacity onPress={() => nav.navigate('Signup')}>
                <Text style={styles.signupLink}>Signup Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary || '#fff',
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  logo: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  title: {
    color: MyColor.Fourth || '#333',
    fontSize: 24,
    fontWeight: '500',
  },
  subtitle: {
    color: MyColor.fifth || '#808080',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 10,
  },
  label: {
    color: MyColor.fifth || '#808080',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 40,
  },
  input: {
    borderColor: MyColor.fifth || '#808080',
    borderBottomWidth: 2,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
    padding: 10,
  },
  passwordContainer: {
    borderColor: MyColor.fifth || '#808080',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: MyColor.primary || '#007BFF',
    marginTop: 30,
    height: 70,
    width: '63%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    color: MyColor.Third || '#fff',
  },
  googleButton: {
    backgroundColor: '#db4437',
    marginTop: 15,
    height: 60,
    width: '63%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    color: MyColor.primary || '#007BFF',
    marginLeft: 5,
  },
});

export default Login;
