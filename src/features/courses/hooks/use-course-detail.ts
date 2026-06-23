import { useState, useEffect, useCallback } from 'react';
import { getCourseById, getInstructorById } from '@/api/courses.api';
import { ApiRandomProduct, ApiRandomUser } from '@/api/types';
import { getBookmarkedCourseIds, toggleBookmark } from '@/lib/storage/bookmark-storage';
import { isEnrolled, enrollInCourse } from '@/lib/storage/enrollment-storage';

export function useCourseDetail(courseId: number) {
  const [course, setCourse] = useState<ApiRandomProduct | null>(null);
  const [instructor, setInstructor] = useState<ApiRandomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookmarked, setBookmarked] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch course details
      const courseData = await getCourseById(courseId);
      setCourse(courseData);

      // Map instructor deterministically based on course ID (modulo 10 users as mock API limit)
      const instructorId = (courseId % 10) + 1;
      try {
        const instructorData = await getInstructorById(instructorId);
        setInstructor(instructorData);
      } catch (e) {
        console.warn('Failed to fetch instructor by ID, trying general index', e);
      }

      // Load bookmark & enrollment status
      const bookmarks = await getBookmarkedCourseIds();
      setBookmarked(bookmarks.includes(courseId));

      const enrolledStatus = await isEnrolled(courseId);
      setEnrolled(enrolledStatus);
    } catch (err) {
      console.error('Failed to fetch course details:', err);
      setError('Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId, fetchData]);

  const toggleBookmarkState = async () => {
    const nextState = await toggleBookmark(courseId);
    setBookmarked(nextState);
  };

  const enroll = async () => {
    if (enrolled || enrolling) return;
    setEnrolling(true);
    
    // Simulate minor network/processing delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const success = await enrollInCourse(courseId);
    if (success) {
      setEnrolled(true);
    }
    setEnrolling(false);
  };

  return {
    course,
    instructor,
    loading,
    error,
    isBookmarked: bookmarked,
    isEnrolled: enrolled,
    isEnrolling: enrolling,
    toggleBookmark: toggleBookmarkState,
    enroll,
    retry: fetchData,
  };
}
