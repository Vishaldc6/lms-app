import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useResponsive } from '@/lib/responsive';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function Input({ label, error, isPassword, style, ...rest }: InputProps) {
  const colors = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error
              ? colors.error
              : isFocused
                ? colors.inputBorderFocused
                : colors.inputBorder,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {isPassword && (
          <Pressable
            onPress={() => setIsSecure((prev) => !prev)}
            hitSlop={8}
            style={styles.toggle}
          >
            <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
              {isSecure ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        )}
      </View>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const useStyles = () => {
  const { scale, isLandscape } = useResponsive();

  return StyleSheet.create({
    container: {
      gap: scale('1.5%'),
    },
    label: {
      fontSize: scale('3.5%'),
      fontWeight: '600',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: scale('3%'),
      paddingHorizontal: scale('4%'),
      height: isLandscape ? 40 : 48,
    },
    input: {
      flex: 1,
      fontSize: scale('4%'),
      height: '100%',
    },
    toggle: {
      paddingLeft: scale('3%'),
    },
    toggleText: {
      fontSize: scale('3.5%'),
      fontWeight: '500',
    },
    error: {
      fontSize: scale('3%'),
      fontWeight: '500',
    },
  });
};
