import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useResponsive } from "@/lib/responsive";
import { useCourseContent } from "@/features/courses/hooks/use-course-content";

export default function EmbeddedContentViewer() {
  const {
    router,
    colors,
    webViewLoading,
    webViewError,
    handleLoadStart,
    handleLoadEnd,
    handleError,
    resetError,
    htmlContent,
    barStyle,
  } = useCourseContent();

  const styles = useStyles(colors);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
      <StatusBar barStyle={barStyle} />

      {/* Header controls */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Course Content
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Embedded Webview */}
      <View style={styles.webViewContainer}>
        {!webViewError ? (
          <WebView
            source={{
              html: htmlContent,
            }}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            style={styles.webView}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={54} color={colors.error} />
            <Text style={styles.errorText}>
              Failed to load course viewer.
            </Text>
            <Pressable
              style={styles.retryButton}
              onPress={resetError}
            >
              <Text style={styles.retryButtonText}>Reload</Text>
            </Pressable>
          </View>
        )}

        {/* Floating loading overlay */}
        {webViewLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const useStyles = (colors: {
  background: string;
  text: string;
  backgroundSelected: string;
  error: string;
  primary: string;
}) => {
  const { wp, hp, scale } = useResponsive();

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp("4%"),
      borderBottomWidth: 1,
      borderBottomColor: colors.backgroundSelected,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: scale("4.2%"),
      fontWeight: "700",
      textAlign: "center",
      color: colors.text,
      flex: 1,
    },
    headerPlaceholder: {
      width: 40,
    },
    webViewContainer: {
      flex: 1,
      position: "relative",
    },
    webView: {
      flex: 1,
      backgroundColor: "transparent",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: wp("8%"),
    },
    errorText: {
      fontSize: scale("4%"),
      fontWeight: "600",
      textAlign: "center",
      color: colors.error,
      marginVertical: hp("2%"),
    },
    retryButton: {
      paddingHorizontal: wp("6%"),
      paddingVertical: hp("1.2%"),
      borderRadius: scale("2.5%"),
      backgroundColor: colors.primary,
    },
    retryButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: scale("3.8%"),
    },
  });
};
