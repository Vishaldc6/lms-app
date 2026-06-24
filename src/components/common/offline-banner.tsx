import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNetwork } from "@/hooks/use-network";
import { useTheme } from "@/hooks/use-theme";
import { useResponsive } from "@/lib/responsive";

export function OfflineBanner() {
  const { isOffline } = useNetwork();
  const colors = useTheme();
  const styles = useStyles();

  // Slide offset: starts hidden
  const translateY = useSharedValue(-120);

  useEffect(() => {
    if (isOffline) {
      translateY.value = withSpring(0, { damping: 15 });
    } else {
      translateY.value = withTiming(-120, { duration: 300 });
    }
  }, [isOffline]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.bannerContainer, animatedStyle]}>
      <View style={[styles.innerContainer, { backgroundColor: colors.error }]}>
        <Ionicons
          name="cloud-offline"
          size={20}
          color="#FFFFFF"
          style={styles.icon}
        />
        <Text style={styles.bannerText}>
          You're offline. Some features may be limited.
        </Text>
      </View>
    </Animated.View>
  );
}

const useStyles = () => {
  const { wp, hp, scale } = useResponsive();
  const { top } = useSafeAreaInsets();

  return StyleSheet.create({
    bannerContainer: {
      position: "absolute",
      top,
      left: 0,
      right: 0,
      zIndex: 9999,
      elevation: 9999,
    },
    innerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("4%"),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 5,
    },
    icon: {
      marginRight: wp("2.5%"),
    },
    bannerText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: scale("3.5%"),
    },
  });
};
