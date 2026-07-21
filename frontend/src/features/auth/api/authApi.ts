import apiClient from '@/lib/api/interceptors';
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  ApiUser,
  ApiSuccess,
} from '../types/auth.types';

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>(
    '/api/v1/auth/login',
    payload
  );
  return data.data;
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>(
    '/api/v1/auth/register',
    payload
  );
  return data.data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/api/v1/auth/logout');
};

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getProfile = async (): Promise<ApiUser> => {
  const { data } = await apiClient.get<ApiSuccess<{ user: ApiUser }>>(
    '/api/v1/auth/profile'
  );
  return data.data.user;
};

export interface AddAddressPayload {
  label: 'Home' | 'Office' | 'Other';
  street: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
}

export const addAddress = async (payload: AddAddressPayload): Promise<ApiUser> => {
  const { data } = await apiClient.post<ApiSuccess<{ user: ApiUser }>>(
    '/api/v1/auth/profile/address',
    payload
  );
  return data.data.user;
};
