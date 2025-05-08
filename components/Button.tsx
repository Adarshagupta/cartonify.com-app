import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle,
  View,
  ColorValue
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  gradient?: boolean;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

export default function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
  gradient = false,
  gradientColors = ['#8A2BE2', '#20B2AA'] as readonly [ColorValue, ColorValue],
}: ButtonProps) {
  const getButtonStyles = () => {
    let buttonStyles: StyleProp<ViewStyle> = [
      styles.button,
      styles[`${size}Button`],
      fullWidth && styles.fullWidth,
    ];

    if (!gradient) {
      if (variant === 'primary') buttonStyles.push(styles.primaryButton);
      if (variant === 'secondary') buttonStyles.push(styles.secondaryButton);
      if (variant === 'outline') buttonStyles.push(styles.outlineButton);
      if (variant === 'ghost') buttonStyles.push(styles.ghostButton);
    }

    if (disabled) buttonStyles.push(styles.disabledButton);

    return buttonStyles;
  };

  const getTextStyles = () => {
    let textStyles: StyleProp<TextStyle> = [
      styles.text,
      styles[`${size}Text`],
    ];

    if (variant === 'primary') textStyles.push(styles.primaryText);
    if (variant === 'secondary') textStyles.push(styles.secondaryText);
    if (variant === 'outline') textStyles.push(styles.outlineText);
    if (variant === 'ghost') textStyles.push(styles.ghostText);
    
    if (disabled) textStyles.push(styles.disabledText);

    return textStyles;
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#fff' : '#8A2BE2'} 
          size={size === 'large' ? 'large' : 'small'} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
        </View>
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
      activeOpacity={0.8}
    >
      {gradient && !disabled ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        buttonContent
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  gradientContainer: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#8A2BE2',
  },
  secondaryButton: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  smallButton: {
    height: 36,
    paddingHorizontal: 12,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: 16,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#8A2BE2',
  },
  outlineText: {
    color: '#8A2BE2',
  },
  ghostText: {
    color: '#8A2BE2',
  },
  disabledText: {
    color: '#999',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});