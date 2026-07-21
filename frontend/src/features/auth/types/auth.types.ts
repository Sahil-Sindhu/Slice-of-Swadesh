export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  avatar?: string;
  loyaltyPoints?: number;
  role: 'user' | 'admin' | 'staff' | 'delivery' | 'manager' | 'customer' | 'chef' | 'superadmin' | 'cashier';
  createdAt: string;
  updatedAt: string;
  addresses?: Array<{
    _id: string;
    label: 'Home' | 'Office' | 'Other';
    street: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
  }>;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export interface ApiSuccess<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
}
