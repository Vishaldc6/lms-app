
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

// Auth
export interface ApiUser {
  _id: string;
  username: string;
  email: string;
  avatar: {
    url: string;
    localPath: string;
    _id: string;
  };
  role: string;
  loginType: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: ApiUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Auth request payloads
export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

// Random Users (Instructors)
export interface ApiRandomUser {
  id: number;
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: { number: number; name: string };
    city: string;
    state: string;
    country: string;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

// Random Products (Courses)
export interface ApiRandomProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}


