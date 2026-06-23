import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBarStyle } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { buildCourseHtml } from "../templates/course-html";

export function useCourseContent() {
  const router = useRouter();
  const colors = useTheme();
  const params = useLocalSearchParams();

  const [webViewLoading, setWebViewLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);

  const { title, description, instructorName } = params;

  const handleLoadStart = () => setWebViewLoading(true);
  const handleLoadEnd = () => setWebViewLoading(false);
  const handleError = () => {
    setWebViewLoading(false);
    setWebViewError(true);
  };
  const resetError = () => {
    setWebViewError(false);
    setWebViewLoading(true);
  };

  const htmlContent = buildCourseHtml(
    String(title || ""),
    String(instructorName || ""),
    String(description || ""),
    colors
  );

  const barStyle: StatusBarStyle = colors.background === "#ffffff" ? "dark-content" : "light-content";

  return {
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
  };
}
