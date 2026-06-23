import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ApiRandomProduct, ApiRandomUser } from "@/api/types";
import { useTheme } from "@/hooks/use-theme";
import { useResponsive } from "@/lib/responsive";

interface CourseCardProps {
  item: ApiRandomProduct;
  instructor: ApiRandomUser | null;
  isBookmarked: boolean;
  onBookmarkToggle: (id: number) => void;
}

export const CourseCard = memo(
  ({ item, instructor, isBookmarked, onBookmarkToggle }: CourseCardProps) => {
    const router = useRouter();
    const colors = useTheme();
    const styles = useStyles();
    const { scale } = useResponsive();
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const words = item.title.split(" ").filter(Boolean);
    const placeholderText =
      words.length >= 2 ? `${words[0]} ${words[1]}` : words[0];

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/course/${item.id}`)}
      >
        <View style={styles.thumbnailContainer}>
          {/* Placeholder container */}
          {(imageLoading || imageError) && (
            <View style={styles.placeholderContainer}>
              {imageLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={styles.loader}
                />
              ) : (
                <Text style={styles.placeholderText}>{placeholderText}</Text>
              )}
            </View>
          )}

          {!imageError && (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
              contentFit="cover"
              cachePolicy={"memory"}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
          )}

          {/* Transparent Blur Bookmark Button overlay */}
          <Pressable
            style={styles.bookmarkOverlay}
            onPress={() => onBookmarkToggle(item.id)}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={scale("5.5%")}
              color={isBookmarked ? "#F59E0B" : "#FFFFFF"}
            />
          </Pressable>
          {/* Price Tag Badge */}
          <View
            style={[styles.priceBadge, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.priceText}>${item.price}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {item.category.toUpperCase().replace("-", " ")}
          </Text>

          <Text
            style={[styles.courseTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text
            style={[styles.courseDescription, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          {/* Instructor details */}
          {instructor && (
            <View style={styles.instructorContainer}>
              <Image
                source={{ uri: instructor.picture.thumbnail }}
                style={styles.instructorAvatar}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.instructorInfo}>
                <Text
                  style={[
                    styles.instructorLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Instructor
                </Text>
                <Text
                  style={[styles.instructorName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {`${instructor.name.first} ${instructor.name.last}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Pressable>
    );
  },
);

const useStyles = () => {
  const colors = useTheme();
  const { wp, hp, scale } = useResponsive();

  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: scale("4%"),
      marginBottom: hp("2.5%"),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.backgroundSelected,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    thumbnailContainer: {
      height: hp("22%"),
      width: "100%",
    },
    thumbnail: {
      width: "100%",
      height: "100%",
    },
    placeholderContainer: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundSelected,
    },
    placeholderText: {
      fontSize: scale("4.2%"),
      fontWeight: "600",
      color: colors.textSecondary,
    },
    loader: {
      marginBottom: hp("1%"),
    },
    bookmarkOverlay: {
      position: "absolute",
      top: scale("2.5%"),
      right: scale("2.5%"),
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      width: scale("10%"),
      height: scale("10%"),
      borderRadius: scale("5%"),
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(8px)",
    },
    priceBadge: {
      position: "absolute",
      bottom: scale("2.5%"),
      left: scale("2.5%"),
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("0.5%"),
      borderRadius: scale("2%"),
    },
    priceText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: scale("3.5%"),
    },
    cardContent: {
      padding: wp("4.5%"),
    },
    categoryText: {
      fontSize: scale("3%"),
      fontWeight: "700",
      letterSpacing: 1,
      marginBottom: hp("0.5%"),
    },
    courseTitle: {
      fontSize: scale("4.5%"),
      fontWeight: "700",
      lineHeight: scale("5.8%"),
      marginBottom: hp("1%"),
    },
    courseDescription: {
      fontSize: scale("3.5%"),
      lineHeight: scale("4.8%"),
      marginBottom: hp("2%"),
    },
    instructorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp("1%"),
      paddingTop: hp("1.5%"),
      borderTopWidth: 1,
      borderTopColor: colors.backgroundSelected,
    },
    instructorAvatar: {
      width: scale("9%"),
      height: scale("9%"),
      borderRadius: scale("4.5%"),
    },
    instructorInfo: {
      marginLeft: wp("3%"),
      flex: 1,
    },
    instructorLabel: {
      fontSize: scale("2.8%"),
      fontWeight: "500",
    },
    instructorName: {
      fontSize: scale("3.5%"),
      fontWeight: "600",
      marginTop: 1,
    },
  });
};
