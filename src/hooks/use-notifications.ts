import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";
import {
  setupNotificationHandler,
  scheduleInactivityReminder,
  cancelInactivityReminder,
  requestNotificationPermissions,
} from "@/lib/notifications";

export function useNotifications() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // 1. Configure how notifications show when foregrounded
    setupNotificationHandler();

    // 2. Request permissions on first relevant mount
    requestNotificationPermissions();

    // 3. Initial check: If app starts in foreground, cancel any pending reminder
    if (AppState.currentState === "active") {
      cancelInactivityReminder();
    } else {
      scheduleInactivityReminder();
    }

    // 4. Handle AppState changes (Foreground vs Background)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to the foreground -> cancel scheduled reminder
        cancelInactivityReminder();
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        // App has gone to the background -> schedule the inactivity reminder
        scheduleInactivityReminder();
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // 5. Set up listeners for foreground notifications
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received in foreground:", notification);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response received:", response);
      }
    );

    return () => {
      subscription.remove();
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return {
    requestPermissions: requestNotificationPermissions,
    refreshInactivityReminder: scheduleInactivityReminder,
  };
}
