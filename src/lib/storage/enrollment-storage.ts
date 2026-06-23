import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS } from '@/lib/constants';

export async function getEnrolledCourseIds(): Promise<number[]> {
  try {
    const data = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ENROLLED_COURSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading enrollments', error);
    return [];
  }
}

export async function saveEnrolledCourseIds(ids: number[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving enrollments', error);
  }
}

export async function enrollInCourse(courseId: number): Promise<boolean> {
  try {
    const current = await getEnrolledCourseIds();
    if (current.includes(courseId)) {
      return true; // Already enrolled
    }
    const updated = [...current, courseId];
    await saveEnrolledCourseIds(updated);
    return true;
  } catch (error) {
    console.error('Error enrolling in course', error);
    return false;
  }
}

export async function isEnrolled(courseId: number): Promise<boolean> {
  try {
    const current = await getEnrolledCourseIds();
    return current.includes(courseId);
  } catch (error) {
    console.error('Error checking enrollment status', error);
    return false;
  }
}

export async function clearEnrollments(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.ENROLLED_COURSES);
  } catch (error) {
    console.error('Error clearing enrollments', error);
  }
}
