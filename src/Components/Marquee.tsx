import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TextStyle,
  ViewStyle,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface MarqueeProps {
  text: string;
  duration?: number;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  duration = 8000,
  containerStyle,
  textStyle,
}) => {
  const translateX = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(screenWidth);
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => animate());
    };
    animate();
  }, [duration, translateX]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text
        style={[styles.text, textStyle, { transform: [{ translateX }] }]}
        numberOfLines={1}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // fill parent width
    height: 40,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default Marquee;
