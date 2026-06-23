import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getCourses, getInstructors } from '@/api/courses.api';
import { ApiRandomProduct, ApiRandomUser } from '@/api/types';
import { getBookmarkedCourseIds, toggleBookmark } from '@/lib/storage/bookmark-storage';

export function useCourses() {
  const [courses, setCourses] = useState<ApiRandomProduct[]>([]);
  const [instructors, setInstructors] = useState<ApiRandomUser[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchTimeoutRef = useRef<any>(null);

  // Fetch API data (initial page)
  const fetchData = useCallback(async (query = '', isARefresh = false) => {
    if (isARefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    setPage(1);

    try {
      // Fetch courses and instructors concurrently for page 1
      const [coursesRes, instructorsRes, bookmarks] = await Promise.all([
        getCourses({ query, page: 1, limit: 10 }),
        getInstructors({ page: 1, limit: 10 }),
        getBookmarkedCourseIds(),
      ]);

      setCourses(coursesRes.data || []);
      setInstructors(instructorsRes.data || []);
      setBookmarkedIds(bookmarks);

      // Determine if there are more pages
      setHasMore(coursesRes.page < coursesRes.totalPages);
    } catch (err: any) {
      console.error('Failed to fetch courses data:', err);
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchData();
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchData]);

  // Synchronize bookmarks when screen gains focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      getBookmarkedCourseIds().then((bookmarks) => {
        if (isMounted) {
          setBookmarkedIds(bookmarks);
        }
      });
      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Load more pages (infinite scroll)
  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const [coursesRes, instructorsRes] = await Promise.all([
        getCourses({ query: searchQuery, page: nextPage, limit: 10 }),
        getInstructors({ page: nextPage, limit: 10 }),
      ]);

      const newCourses = coursesRes.data || [];
      const newInstructors = instructorsRes.data || [];

      if (newCourses.length > 0) {
        setCourses((prev) => [...prev, ...newCourses]);
        setInstructors((prev) => [...prev, ...newInstructors]);
        setPage(nextPage);
      }

      setHasMore(coursesRes.page < coursesRes.totalPages);
    } catch (err) {
      console.error('Failed to load more courses:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loading, loadingMore, hasMore, searchQuery]);

  // Handle Search Input Changes with Debounce
  const handleSearchChange = (text: string) => {
    console.log({ text });

    setSearchQuery(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      console.log('feycj', { text });
      fetchData(text);
    }, 500);
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchData(searchQuery, true);
  };

  // Toggle bookmark action
  const handleBookmarkToggle = async (courseId: number) => {
    const isNowBookmarked = await toggleBookmark(courseId);
    setBookmarkedIds((prev) =>
      isNowBookmarked ? [...prev, courseId] : prev.filter((id) => id !== courseId)
    );
  };

  return {
    courses,
    instructors,
    bookmarkedIds,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    searchQuery,
    error,
    handleSearchChange,
    handleRefresh,
    handleBookmarkToggle,
    loadMore,
    retry: () => fetchData(searchQuery),
  };
}
