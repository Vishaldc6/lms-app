import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCourseDetail } from "@/features/courses/hooks/use-course-detail";
import { useTheme } from "@/hooks/use-theme";
import { useResponsive } from "@/lib/responsive";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useTheme();
  const styles = useStyles();

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const courseId = Number(id);
  const {
    course,
    instructor,
    loading,
    error,
    isBookmarked,
    isEnrolled,
    isEnrolling,
    toggleBookmark,
    enroll,
    retry,
  } = useCourseDetail(courseId);

  const words = course ? course.title.split(" ").filter(Boolean) : [];
  const placeholderText =
    words.length >= 2 ? `${words[0]} ${words[1]}` : words[0] || "";

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.statusText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={54}
            color={colors.error}
          />
          <Text style={styles.errorText}>{error || "Course not found"}</Text>
          <Pressable style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Sticky Header Action Overlays */}
      <SafeAreaView style={styles.headerOverlay} edges={["top"]}>
        <View style={styles.headerRow}>
          <Pressable style={styles.circleButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.circleButton} onPress={toggleBookmark}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? "#F59E0B" : "#FFFFFF"}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
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
              source={{ uri: course.thumbnail }}
              style={styles.heroImage}
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

          {/* Category Badge overlay on bottom left of hero */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {course.category.toUpperCase().replace("-", " ")}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>{course.title}</Text>

          {/* Rating and Price row */}
          <View style={styles.ratingPriceRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{course.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.price}>${course.price}</Text>
          </View>

          <View style={styles.divider} />

          {/* Metadata Grid */}
          <Text style={styles.sectionTitle}>Metadata</Text>
          <View style={styles.metadataGrid}>
            <View style={styles.metadataCard}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.metaLabel}>Brand</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {course.brand || "N/A"}
              </Text>
            </View>
            <View style={styles.metadataCard}>
              <Ionicons name="cube-outline" size={20} color={colors.primary} />
              <Text style={styles.metaLabel}>Stock</Text>
              <Text style={styles.metaValue}>{course.stock} units</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>About the Course</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.divider} />

          {/* View Content Button */}
          <Pressable
            style={[styles.contentButton, { borderColor: colors.primary }]}
            onPress={() =>
              router.push({
                pathname: "/course/content",
                params: {
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  instructorName: instructor
                    ? `${instructor.name.first} ${instructor.name.last}`
                    : "Expert Instructor",
                },
              })
            }
          >
            <Ionicons name="play-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.contentButtonText, { color: colors.primary }]}>
              View Course Syllabus & Modules
            </Text>
          </Pressable>

          <View style={styles.divider} />

          {/* Instructor Details */}
          {instructor && (
            <View style={styles.instructorSection}>
              <Text style={styles.sectionTitle}>Instructor</Text>
              <View style={styles.instructorCard}>
                <Image
                  source={{ uri: instructor.picture.large }}
                  style={styles.instructorAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>
                    {`${instructor.name.title} ${instructor.name.first} ${instructor.name.last}`}
                  </Text>
                  <Text style={styles.instructorEmail}>{instructor.email}</Text>
                  <Text style={styles.instructorMeta}>
                    📍 {instructor.location.city}, {instructor.location.country}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.backgroundSelected,
          },
        ]}
      >
        <Pressable
          style={[
            styles.enrollButton,
            isEnrolled
              ? styles.enrolledButton
              : { backgroundColor: colors.primary },
            isEnrolling && { opacity: 0.8 },
          ]}
          onPress={enroll}
          disabled={isEnrolled || isEnrolling}
        >
          {isEnrolling ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : isEnrolled ? (
            <View style={styles.enrolledButtonContent}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.enrollButtonText}>Enrolled</Text>
            </View>
          ) : (
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = () => {
  const colors = useTheme();
  const { wp, hp, scale } = useResponsive();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: hp("12%"),
    },
    heroSection: {
      height: hp("35%"),
      width: "100%",
      position: "relative",
      backgroundColor: "#000",
    },
    heroImage: {
      width: "100%",
      height: "100%",
      opacity: 0.85,
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
    headerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingHorizontal: wp("5%"),
      zIndex: 10,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: hp("1.5%"),
    },
    circleButton: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      width: scale("11%"),
      height: scale("11%"),
      borderRadius: scale("5.5%"),
      justifyContent: "center",
      alignItems: "center",
    },
    categoryBadge: {
      position: "absolute",
      bottom: hp("4%"),
      left: wp("5%"),
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("1%"),
      borderRadius: scale("1.5%"),
      backgroundColor: colors.primary,
    },
    categoryText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: scale("3%"),
      letterSpacing: 0.5,
    },
    contentSection: {
      borderTopLeftRadius: scale("6%"),
      borderTopRightRadius: scale("6%"),
      marginTop: -scale("5%"),
      paddingHorizontal: wp("5%"),
      paddingTop: hp("3%"),
      backgroundColor: colors.background,
    },
    title: {
      fontSize: scale("5.8%"),
      fontWeight: "800",
      lineHeight: scale("7.2%"),
      color: colors.text,
    },
    ratingPriceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: hp("1.5%"),
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp("1.5%"),
    },
    ratingText: {
      fontSize: scale("3.8%"),
      fontWeight: "700",
      color: colors.text,
    },
    price: {
      fontSize: scale("5.5%"),
      fontWeight: "800",
      color: colors.primary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.backgroundSelected,
      marginVertical: hp("2.5%"),
    },
    sectionTitle: {
      fontSize: scale("4.2%"),
      fontWeight: "700",
      marginBottom: hp("1.5%"),
      color: colors.text,
    },
    metadataGrid: {
      flexDirection: "row",
      gap: wp("4%"),
    },
    metadataCard: {
      flex: 1,
      padding: wp("3.5%"),
      borderRadius: scale("3%"),
      gap: hp("0.5%"),
      backgroundColor: colors.backgroundElement,
    },
    metaLabel: {
      fontSize: scale("2.8%"),
      fontWeight: "500",
      color: colors.textSecondary,
    },
    metaValue: {
      fontSize: scale("3.5%"),
      fontWeight: "700",
      color: colors.text,
    },
    description: {
      fontSize: scale("3.8%"),
      lineHeight: scale("5.5%"),
      color: colors.textSecondary,
    },
    contentButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderRadius: scale("3.5%"),
      height: 48,
      gap: wp("2%"),
      marginVertical: hp("1%"),
    },
    contentButtonText: {
      fontWeight: "700",
      fontSize: scale("3.8%"),
    },
    instructorSection: {
      marginBottom: hp("2%"),
    },
    instructorCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("4%"),
      borderRadius: scale("4%"),
      borderWidth: 1,
      borderColor: colors.backgroundSelected,
      backgroundColor: colors.card,
    },
    instructorAvatar: {
      width: scale("14%"),
      height: scale("14%"),
      borderRadius: scale("7%"),
    },
    instructorInfo: {
      marginLeft: wp("4%"),
      flex: 1,
    },
    instructorName: {
      fontSize: scale("4%"),
      fontWeight: "700",
      marginBottom: 2,
      color: colors.text,
    },
    instructorEmail: {
      fontSize: scale("3.2%"),
      marginBottom: 2,
      color: colors.textSecondary,
    },
    instructorMeta: {
      fontSize: scale("3%"),
      color: colors.textSecondary,
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: wp("5%"),
      paddingTop: hp("1.5%"),
      paddingBottom: hp("3%"),
      borderTopWidth: 1,
    },
    enrollButton: {
      height: 52,
      borderRadius: scale("3.5%"),
      justifyContent: "center",
      alignItems: "center",
    },
    enrolledButton: {
      backgroundColor: "#10B981", // Green for Success
    },
    enrolledButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp("2%"),
    },
    enrollButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: scale("4.2%"),
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: wp("8%"),
    },
    statusText: {
      fontSize: scale("3.8%"),
      marginTop: hp("1.5%"),
      fontWeight: "500",
      color: colors.textSecondary,
    },
    errorText: {
      fontSize: scale("4%"),
      fontWeight: "600",
      textAlign: "center",
      marginVertical: hp("2%"),
      color: colors.error,
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
