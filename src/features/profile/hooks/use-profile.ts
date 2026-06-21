import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { authApi } from '@/api';
import { useAuth } from '@/context/auth-context';
import { parseApiError } from '@/lib/errors';

export function useProfile() {
  const { logout, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const uploadAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access the photo library is required to update your avatar.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageUri = asset.uri;

        const fileName = imageUri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(fileName);
        const mimeType = match ? `image/${match[1]}` : 'image/jpeg';

        setIsUploading(true);
        const updatedUser = await authApi.updateAvatar(imageUri, mimeType, fileName);
        updateUser(updatedUser);
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      const parsed = parseApiError(error);
      Alert.alert('Upload Failed', parsed.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      const parsed = parseApiError(error);
      Alert.alert('Logout Failed', parsed.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    uploadAvatar,
    handleLogout,
    isUploading,
    isLoggingOut,
  };
}
