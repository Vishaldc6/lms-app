// Course-related API endpoints.

import { apiClient } from './client';
import type {
  ApiRandomProduct,
  ApiRandomUser,
  ApiResponse,
  PaginatedData,
} from './types';

// Pagination defaults
interface PaginationParams {
  page?: number;
  limit?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Instructors (Random Users)

export async function getInstructors(
  params: PaginationParams = {},
): Promise<PaginatedData<ApiRandomUser>> {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;

  const { data } = await apiClient.get<
    ApiResponse<PaginatedData<ApiRandomUser>>
  >('/api/v1/public/randomusers', { params: { page, limit } });

  return data.data;
}

export async function getInstructorById(
  id: number,
): Promise<ApiRandomUser> {
  const { data } = await apiClient.get<ApiResponse<ApiRandomUser>>(
    `/api/v1/public/randomusers/${id}`,
  );

  return data.data;
}

// Courses (Random Products)

interface CourseQueryParams extends PaginationParams {
  query?: string;
}

export async function getCourses(
  params: CourseQueryParams = {},
): Promise<PaginatedData<ApiRandomProduct>> {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, query } = params;

  const { data } = await apiClient.get<
    ApiResponse<PaginatedData<ApiRandomProduct>>
  >('/api/v1/public/randomproducts', {
    params: { page, limit, ...(query ? { query } : {}) },
  });

  return data.data;
}

export async function getCourseById(
  id: number,
): Promise<ApiRandomProduct> {
  const { data } = await apiClient.get<ApiResponse<ApiRandomProduct>>(
    `/api/v1/public/randomproducts/${id}`,
  );

  return data.data;
}
