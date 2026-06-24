import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS } from '@/lib/constants';
import { checkAndTriggerBookmarkMilestone } from '../notifications';

export async function getBookmarkedCourseIds(): Promise<number[]> {
  try {
    const data = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.BOOKMARKED_COURSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading bookmarks', error);
    return [];
  }
}

export async function saveBookmarkedCourseIds(ids: number[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.BOOKMARKED_COURSES, JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving bookmarks', error);
  }
}

export async function toggleBookmark(courseId: number): Promise<boolean> {
  try {
    const current = await getBookmarkedCourseIds();
    const isBookmarked = current.includes(courseId);
    let updated: number[];
    if (isBookmarked) {
      updated = current.filter((id) => id !== courseId);
    } else {
      updated = [...current, courseId];
    }
    await saveBookmarkedCourseIds(updated);

    if (updated.length >= 5) {
      await checkAndTriggerBookmarkMilestone(updated.length);
    }

    return !isBookmarked; // returns the new state (true if bookmarked, false if unbookmarked)
  } catch (error) {
    console.error('Error toggling bookmark', error);
    return false;
  }
}

export async function clearBookmarks(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.BOOKMARKED_COURSES);
  } catch (error) {
    console.error('Error clearing bookmarks', error);
  }
}

