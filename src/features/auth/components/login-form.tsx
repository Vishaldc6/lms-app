import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { useResponsive } from '@/lib/responsive';

import { useLogin } from '../hooks/use-login';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';

interface LoginFormProps {
  onSuccess: () => void;
  onGoToRegister: () => void;
}

export function LoginForm({ onSuccess, onGoToRegister }: LoginFormProps) {
  const colors = useTheme();
  const { login, isLoading, error, clearError } = useLogin();
  const styles = useStyles();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    const user = await login(data);
    if (user) onSuccess();
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
            placeholder="Enter your username"
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
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <Input
            label="Password"
            placeholder="Enter your password"
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
        title="Login"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        style={styles.submitButton}
      />

      <Text style={[styles.footerText, { color: colors.textSecondary }]}>
        Don&apos;t have an account?{' '}
        <Text style={{ color: colors.link, fontWeight: '600' }} onPress={onGoToRegister}>
          Register
        </Text>
      </Text>
    </View>
  );
}

const useStyles = () => {
  const { scale, isLandscape } = useResponsive();

  return StyleSheet.create({
    form: {
      gap: isLandscape ? 12 : 20,
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
