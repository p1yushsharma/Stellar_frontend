import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const nav = useNavigation();

  return (
    <TouchableOpacity onPress={() => nav.goBack()}>
      <Icon name="arrow-back" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

export default BackButton;
