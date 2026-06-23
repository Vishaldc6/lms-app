import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiRandomProduct } from "@/api/types";
import { CourseCard } from "@/features/courses/components/course-card";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useTheme } from "@/hooks/use-theme";
import { useResponsive } from "@/lib/responsive";

export default function HomeScreen() {
  const colors = useTheme();
  const styles = useStyles();

  const {
    courses,
    instructors,
    bookmarkedIds,
    loading,
    refreshing,
    loadingMore,
    searchQuery,
    error,
    handleSearchChange,
    handleRefresh,
    handleBookmarkToggle,
    loadMore,
    retry,
  } = useCourses();
  console.log({ courses, instructors });

  // Render Single Course Item
  const renderCourseItem = useCallback(
    ({ item, index }: { item: ApiRandomProduct; index: number }) => {
      const instructor =
        instructors.length > 0 ? instructors[index % instructors.length] : null;
      const isBookmarked = bookmarkedIds.includes(item.id);

      return (
        <CourseCard
          item={item}
          instructor={instructor}
          isBookmarked={isBookmarked}
          onBookmarkToggle={handleBookmarkToggle}
        />
      );
    },
    [instructors, bookmarkedIds, handleBookmarkToggle],
  );

  // Header content: Search Bar
  const renderHeader = useCallback(
    () => (
      <View style={styles.headerSection}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Find Your Next Skill
        </Text>
        <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
          Discover world-class courses taught by expert instructors.
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.placeholder}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search courses, categories, topics..."
            placeholderTextColor={colors.placeholder}
            style={[styles.searchInput, { color: colors.text }]}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => handleSearchChange("")}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
      </View>
    ),
    [searchQuery],
  );

  // Render content depending on loading/error states
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle={
          colors.background === "#ffffff" ? "dark-content" : "light-content"
        }
      />

      {renderHeader()}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Loading courses...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={54}
            color={colors.error}
          />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <Pressable
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={retry}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCourseItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons
                name="search-outline"
                size={54}
                color={colors.placeholder}
              />
              <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                No courses found
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: colors.placeholder }]}
              >
                Try adjusting your search query to find what you need.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const useStyles = () => {
  const colors = useTheme();
  const { wp, hp, scale } = useResponsive();

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerSection: {
      paddingHorizontal: wp("5%"),
      paddingTop: hp("2%"),
      paddingBottom: hp("2%"),
    },
    screenTitle: {
      fontSize: scale("6.5%"),
      fontWeight: "800",
      letterSpacing: -0.5,
    },
    screenSubtitle: {
      fontSize: scale("3.8%"),
      marginTop: hp("0.5%"),
      marginBottom: hp("2%"),
      lineHeight: scale("5%"),
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: scale("3.5%"),
      paddingHorizontal: wp("3.5%"),
      height: 48,
      backgroundColor: colors.inputBackground,
      borderColor: colors.inputBorder,
    },
    searchIcon: {
      marginRight: wp("2%"),
    },
    searchInput: {
      flex: 1,
      fontSize: scale("4%"),
      height: "100%",
    },
    clearButton: {
      padding: 4,
    },
    listContainer: {
      paddingHorizontal: wp("5%"),
      paddingBottom: hp("4%"),
    },
    footerContainer: {
      paddingVertical: hp("2%"),
      justifyContent: "center",
      alignItems: "center",
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: wp("8%"),
      paddingVertical: hp("5%"),
    },
    statusText: {
      fontSize: scale("3.8%"),
      marginTop: hp("1.5%"),
      fontWeight: "500",
    },
    errorText: {
      fontSize: scale("4%"),
      fontWeight: "600",
      textAlign: "center",
      marginTop: hp("2%"),
    },
    emptySubtitle: {
      fontSize: scale("3.5%"),
      textAlign: "center",
      marginTop: hp("1%"),
    },
    retryButton: {
      marginTop: hp("2%"),
      paddingHorizontal: wp("6%"),
      paddingVertical: hp("1.2%"),
      borderRadius: scale("2.5%"),
    },
    retryButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: scale("3.8%"),
    },
  });
};
