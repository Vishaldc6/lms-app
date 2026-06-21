import { router } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RegisterForm } from "@/features/auth/components/register-form";
import { useTheme } from "@/hooks/use-theme";
import { useResponsive } from "@/lib/responsive";

export default function RegisterScreen() {
  const handleSuccess = () => {
    Alert.alert(
      "Account Created!",
      "Your account has been created successfully. Please login to continue.",
      [{ text: "Go to Login", onPress: () => router.replace("/(auth)/login") }],
    );
  };

  const styles = useStyles();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us and start learning today
              </Text>
            </View>

            <RegisterForm
              onSuccess={handleSuccess}
              onGoToLogin={() => router.back()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = () => {
  const colors = useTheme();
  const { wp, hp, scale, isLandscape } = useResponsive();

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: wp("6%"),
      paddingVertical: isLandscape ? hp("4%") : hp("5%"),
    },
    formContainer: {
      width: "100%",
      maxWidth: 420,
    },
    header: {
      marginBottom: isLandscape ? hp("3%") : hp("4.5%"),
      alignItems: "center",
    },
    title: {
      fontSize: scale("7%"),
      fontWeight: "700",
      marginBottom: hp("1%"),
      color: colors.text,
    },
    subtitle: {
      fontSize: scale("4%"),
      textAlign: "center",
      color: colors.textSecondary,
    },
  });
};
