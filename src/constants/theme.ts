/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    primary: '#4F46E5',
    primaryPressed: '#4338CA',
    error: '#DC2626',
    errorBackground: '#FEF2F2',
    inputBackground: '#F9FAFB',
    inputBorder: '#D1D5DB',
    inputBorderFocused: '#4F46E5',
    placeholder: '#9CA3AF',
    disabled: '#9CA3AF',
    card: '#FFFFFF',
    link: '#4F46E5',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    primary: '#818CF8',
    primaryPressed: '#6366F1',
    error: '#EF4444',
    errorBackground: '#1F1215',
    inputBackground: '#1A1B1E',
    inputBorder: '#3A3D42',
    inputBorderFocused: '#818CF8',
    placeholder: '#6B7280',
    disabled: '#6B7280',
    card: '#18191B',
    link: '#818CF8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;