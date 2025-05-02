import React, { useState } from 'react';
import { SafeAreaView, StatusBar, ScrollView, Image, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MyColor } from '../utilities/MyColor';
import { API_BASE_URL, endpoints } from './Configuration/Config';

const Signup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('All fields are required.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}${endpoints.signup}`, {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Signup successful!');
        nav.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Signup failed! Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView style={styles.scrollView}>
        <Image
          style={styles.image}
          source={require('../assets/restaurant.png')}
        />
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Sign Up</Text>
          <Text style={styles.subHeading}>
            Enter Your Credentials to continue
          </Text>

          <Text style={styles.inputLabel}>UserName</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            style={styles.inputField}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.inputField}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordField}>
            <TextInput
              secureTextEntry={isVisible}
              maxLength={6}
              value={password}
              onChangeText={setPassword}
              keyboardType="ascii-capable"
              style={styles.inputField}
            />
            <Ionicons
              onPress={() => setIsVisible(!isVisible)}
              name={isVisible ? 'eye' : 'eye-off'}
              size={24}
              color="black"
            />
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to our terms of service and privacy policy.
          </Text>

          <TouchableOpacity 
            onPress={handleSignup} 
            style={styles.signupButton}
          >
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>

          <View style={styles.accountPrompt}>
            <Text style={{ fontSize: 16 }}>Already have an Account?</Text>
            <TouchableOpacity onPress={() => nav.navigate('Login')}>
              <Text style={{ fontSize: 16, color: MyColor.primary }}>Login Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MyColor.secondary,
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  image: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  heading: {
    color: MyColor.Fourth,
    fontSize: 24,
    fontWeight: '500',
  },
  subHeading: {
    color: 'grey',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 10,
  },
  inputLabel: {
    color: 'grey',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 40,
  },
  inputField: {
    borderColor: 'grey',
    borderBottomWidth: 2,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
    padding: 10,
  },
  passwordField: {
    borderColor: 'grey',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termsText: {
    color: 'black',
    fontWeight: '400',
    fontSize: 15,
    marginTop: 15,
    letterSpacing: 1,
    lineHeight: 25,
    width: '95%',
  },
  signupButton: {
    backgroundColor: MyColor.primary,
    marginTop: 30,
    height: 70,
    width: '63%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  signupButtonText: {
    fontSize: 18,
    color: MyColor.Third,
  },
  accountPrompt: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Signup;
