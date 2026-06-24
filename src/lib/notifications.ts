import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { ASYNC_STORAGE_KEYS } from "./constants";

// Configure how notifications are displayed when app is foregrounded
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Request permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

// Check permission status
export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

// Schedule Bookmark Milestone Notification (only trigger once)
export async function checkAndTriggerBookmarkMilestone(bookmarkCount: number) {
  if (bookmarkCount < 5) return;

  try {
    const alreadyNotified = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.BOOKMARK_NOTIFIED);
    if (alreadyNotified === "true") return;

    const hasPermission = await hasNotificationPermission();
    if (!hasPermission) {
      const granted = await requestNotificationPermissions();
      if (!granted) return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📚 Bookmark Milestone",
        body: "You've bookmarked 5 courses! Ready to start learning?",
        sound: true,
      },
      trigger: null,
    });

    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.BOOKMARK_NOTIFIED, "true");
  } catch (error) {
    console.error("Failed to trigger bookmark milestone notification:", error);
  }
}

// Inactivity reminder scheduling key
const INACTIVITY_REMINDER_ID = "inactivity-reminder";

// Schedule or reschedule 2-minute inactivity reminder
export async function scheduleInactivityReminder() {
  try {
    const hasPermission = await hasNotificationPermission();
    if (!hasPermission) {
      return;
    }

    // Cancel existing inactivity reminder if any
    await cancelInactivityReminder();

    // Store the last open timestamp
    await AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.LAST_OPEN_TIMESTAMP,
      Date.now().toString()
    );

    // Schedule notification to trigger
    await Notifications.scheduleNotificationAsync({
      identifier: INACTIVITY_REMINDER_ID,
      content: {
        title: "🎓 Continue Learning",
        body: "Your courses are waiting! Continue your learning journey.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 24, // use 120 (2 minutes for tesing instead of 24 hours)
        repeats: false,
      },
    });
  } catch (error) {
    console.error("Failed to schedule inactivity reminder:", error);
  }
}

// Cancel inactivity reminder
export async function cancelInactivityReminder() {
  try {
    await Notifications.cancelScheduledNotificationAsync(INACTIVITY_REMINDER_ID);
  } catch (error) {
    // Suppress error if it was not scheduled
    console.error("Failed to cancel inactivity reminder:", error);
  }
}
