import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useResponsive } from '@/lib/responsive';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'error';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useTheme();
  const isDisabled = disabled || loading;
  const styles = useStyles();

  const buttonStyles = getButtonStyles(variant, colors, isDisabled);
  const textColor = getTextColor(variant, colors, isDisabled);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        buttonStyles,
        pressed && !isDisabled && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

function getButtonStyles(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>,
  disabled: boolean,
): ViewStyle {
  if (disabled) {
    return {
      backgroundColor: variant === 'primary' || variant === 'error' ? colors.disabled : 'transparent',
      borderColor: variant === 'outline' ? colors.disabled : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
    };
  }

  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary };
    case 'error':
      return { backgroundColor: colors.error };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: colors.primary,
        borderWidth: 1,
      };
    case 'ghost':
      return { backgroundColor: 'transparent' };
  }
}

function getTextColor(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>,
  disabled: boolean,
): string {
  if (disabled && variant !== 'primary' && variant !== 'error') return colors.disabled;
  if (variant === 'primary' || variant === 'error') return '#FFFFFF';
  return colors.primary;
}

const useStyles = () => {
  const { scale, isLandscape } = useResponsive();

  return StyleSheet.create({
    button: {
      height: isLandscape ? 40 : 48, 
      borderRadius: scale('3%'), 
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: scale('4%'), 
      fontWeight: '600',
    },
  });
};
