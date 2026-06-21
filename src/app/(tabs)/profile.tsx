import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useResponsive } from '@/lib/responsive';
import { useProfile } from '@/features/profile/hooks/use-profile';

export default function ProfileScreen() {
  const { user } = useAuth();
  const colors = useTheme();
  const styles = useStyles();
  const { uploadAvatar, handleLogout, isUploading, isLoggingOut } = useProfile();

  // Dummy statistics
  const stats = {
    enrolledCourses: 5,
    completedCourses: 2,
    overallProgress: 65,
  };

  const avatarUrl = user?.avatar?.url || 'https://via.placeholder.com/150';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Pressable onPress={uploadAvatar} style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <View style={styles.avatarEditBadge}>
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </View>
          </Pressable>

          <Text style={styles.username}>{user?.username || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'No email provided'}</Text>
        </View>

        {/* User Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.enrolledCourses}</Text>
              <Text style={styles.statLabel}>Enrolled</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.completedCourses}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Overall Completion</Text>
              <Text style={styles.progressValue}>{stats.overallProgress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${stats.overallProgress}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="error"
            loading={isLoggingOut}
          />
        </View>
      </ScrollView>
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
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: wp('5%'),
      paddingBottom: hp('5%'),
    },
    header: {
      paddingVertical: hp('2%'),
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: scale('6%'),
      fontWeight: '700',
      color: colors.text,
    },
    profileCard: {
      backgroundColor: colors.backgroundElement,
      borderRadius: scale('4%'),
      padding: scale('5%'),
      alignItems: 'center',
      marginBottom: hp('3%'),
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: hp('2%'),
    },
    avatar: {
      width: scale('24%'),
      height: scale('24%'),
      borderRadius: scale('12%'),
      backgroundColor: colors.backgroundSelected,
    },
    avatarEditBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: scale('8%'),
      height: scale('8%'),
      borderRadius: scale('4%'),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.backgroundElement,
    },
    username: {
      fontSize: scale('5%'),
      fontWeight: '700',
      color: colors.text,
      marginBottom: hp('0.5%'),
    },
    email: {
      fontSize: scale('3.8%'),
      color: colors.textSecondary,
      marginBottom: hp('1.5%'),
    },
    section: {
      marginBottom: hp('3%'),
    },
    sectionTitle: {
      fontSize: scale('4.5%'),
      fontWeight: '600',
      color: colors.text,
      marginBottom: hp('1.5%'),
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: wp('4%'),
      marginBottom: hp('2%'),
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.backgroundElement,
      padding: scale('4%'),
      borderRadius: scale('3%'),
      alignItems: 'center',
    },
    statValue: {
      fontSize: scale('6%'),
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: scale('3.2%'),
      color: colors.textSecondary,
    },
    progressContainer: {
      backgroundColor: colors.backgroundElement,
      padding: scale('4%'),
      borderRadius: scale('3%'),
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp('1%'),
    },
    progressLabel: {
      fontSize: scale('3.5%'),
      color: colors.text,
      fontWeight: '500',
    },
    progressValue: {
      fontSize: scale('3.5%'),
      fontWeight: '600',
      color: colors.primary,
    },
    progressBarBg: {
      height: 8,
      backgroundColor: colors.backgroundSelected,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    actionsContainer: {
      marginTop: hp('2%'),
    },
  });
};
