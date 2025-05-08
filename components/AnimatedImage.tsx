import React, { useState, useEffect } from 'react';
import { 
  Image, 
  ImageProps, 
  StyleSheet, 
  View, 
  ActivityIndicator,
  Animated,
  Platform
} from 'react-native';

interface AnimatedImageProps extends ImageProps {
  placeholderColor?: string;
}

export default function AnimatedImage(props: AnimatedImageProps) {
  const { style, placeholderColor = '#f0f0f0', ...otherProps } = props;
  const [loading, setLoading] = useState(true);
  const opacity = useState(new Animated.Value(0))[0];

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    setLoading(false);
  };

  useEffect(() => {
    // Reset loading state when source changes
    if (props.source) {
      setLoading(true);
      opacity.setValue(0);
    }
  }, [props.source]);

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={[styles.placeholder, { backgroundColor: placeholderColor }]}>
          <ActivityIndicator size="large" color="#8A2BE2" />
        </View>
      )}
      <Animated.Image
        {...otherProps}
        style={[
          styles.image,
          style,
          { opacity }
        ]}
        onLoad={onLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});