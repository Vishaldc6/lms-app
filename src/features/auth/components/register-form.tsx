import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { useResponsive } from '@/lib/responsive';

import { useRegister } from '../hooks/use-register';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema';

interface RegisterFormProps {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export function RegisterForm({ onSuccess, onGoToLogin }: RegisterFormProps) {
  const colors = useTheme();
  const { register, isLoading, error, clearError } = useRegister();
  const styles = useStyles();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await register(data);
    if (success) onSuccess();
  };

  return (
    <View style={styles.form}>
      {error && (
        <View style={[styles.errorBanner, { backgroundColor: colors.errorBackground }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error.message}</Text>
        </View>
      )}

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <Input
            label="Username"
            placeholder="Choose a username"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            onBlur={onBlur}
            error={fieldError?.message}
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <Input
            label="Email"
            placeholder="Enter your email"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            onBlur={onBlur}
            error={fieldError?.message}
            keyboardType="email-address"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <Input
            label="Password"
            placeholder="Create a password"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            onBlur={onBlur}
            error={fieldError?.message}
            isPassword
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            onBlur={onBlur}
            error={fieldError?.message}
            isPassword
          />
        )}
      />

      <Button
        title="Create Account"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        style={styles.submitButton}
      />

      <Text style={[styles.footerText, { color: colors.textSecondary }]}>
        Already have an account?{' '}
        <Text style={{ color: colors.link, fontWeight: '600' }} onPress={onGoToLogin}>
          Login
        </Text>
      </Text>
    </View>
  );
}

// Stylesheet generation hook at the bottom of the component file
const useStyles = () => {
  const { scale, isLandscape } = useResponsive();

  return StyleSheet.create({
    form: {
      gap: isLandscape ? 12 : 20, // Responsive vertical gaps
    },
    errorBanner: {
      padding: scale('3%'),
      borderRadius: scale('2.5%'),
    },
    errorText: {
      fontSize: scale('3.5%'),
      fontWeight: '500',
      textAlign: 'center',
    },
    submitButton: {
      marginTop: scale('1%'),
    },
    footerText: {
      textAlign: 'center',
      fontSize: scale('3.5%'),
    },
  });
};
