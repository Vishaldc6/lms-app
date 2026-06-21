import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useResponsive } from '@/lib/responsive';

export default function HomeScreen() {
  const { logout } = useAuth();
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>LMS App</Text>
        <Button
          title="Logout"
          onPress={logout}
          variant="outline"
          style={styles.logoutBtn}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome to the LMS Portal
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Stylesheet generation hook at the bottom of the component file
const useStyles = () => {
  const colors = useTheme();
  const { wp, hp, scale, isLandscape } = useResponsive();

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: isLandscape ? 48 : 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: wp('4%'),
      borderBottomWidth: 1,
      borderBottomColor: colors.backgroundSelected,
    },
    title: {
      fontSize: scale('5%'), // Stable scale size
      fontWeight: '700',
      color: colors.text,
    },
    logoutBtn: {
      paddingVertical: isLandscape ? 4 : hp('1%'),
      paddingHorizontal: wp('3%'),
      marginVertical: 0,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: scale('4%'), // Stable scale size
      fontWeight: '500',
      color: colors.textSecondary,
    },
  });
};
