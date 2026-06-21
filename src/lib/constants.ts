// API 
export const API_BASE_URL = 'https://api.freeapi.app' as const;

/** Default timeout for every request (ms). */
export const API_TIMEOUT = 10_000;

// Secure Store Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'lms_access_token',
  REFRESH_TOKEN: 'lms_refresh_token',
} as const;

// AsyncStorage Keys 
export const ASYNC_STORAGE_KEYS = {
  BOOKMARKED_COURSES: 'lms_bookmarked_courses',
  ENROLLED_COURSES: 'lms_enrolled_courses',
  USER_PREFERENCES: 'lms_user_preferences',
  LAST_OPEN_TIMESTAMP: 'lms_last_open_timestamp',
  BOOKMARK_NOTIFIED: 'lms_bookmark_notified',
} as const;
