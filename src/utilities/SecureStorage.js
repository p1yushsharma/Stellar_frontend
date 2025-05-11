import * as Keychain from 'react-native-keychain';

// Save token
export const saveToken = async token => {
  try {
    await Keychain.setGenericPassword('authToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Get token
export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    } else {
      console.log('No token stored');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};
