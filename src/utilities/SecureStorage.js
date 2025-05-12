import * as Keychain from 'react-native-keychain';

export const saveTokens = async (accessToken, refreshToken) => {
  try {
    const tokens = JSON.stringify({accessToken, refreshToken});
    await Keychain.setGenericPassword('tokens', tokens);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

export const getTokens = async () => {
  try {
    const credentials = await Keychain.getGenericPassword('tokens');
    if (credentials) {
      const {accessToken, refreshToken} = JSON.parse(credentials.password);
      return {accessToken, refreshToken};
    } else {
      console.log('No tokens stored');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return null;
  }
};

export const deleteTokens = async () => {
  try {
    await Keychain.resetGenericPassword('tokens');
  } catch (error) {
    console.error('Error deleting tokens:', error);
  }
};
