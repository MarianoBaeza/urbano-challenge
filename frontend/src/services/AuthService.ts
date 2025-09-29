import AuthResponse from '../models/auth/AuthResponse';
import LoginRequest from '../models/auth/LoginRequest';
import apiService from './ApiService';

const BASE_URL = import.meta.env.VITE_API_URL || '';

class AuthService {
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const authResponse = (
      await apiService.post<AuthResponse>(
        `${BASE_URL}/auth/login`,
        loginRequest,
        { withCredentials: true },
      )
    ).data;

    apiService.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }

  async logout(): Promise<void> {
    await apiService.post(
      `${BASE_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );
    apiService.defaults.headers.Authorization = null;
  }

  async refresh(): Promise<AuthResponse> {
    const authResponse = (
      await apiService.post<AuthResponse>(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      )
    ).data;

    apiService.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }
}

export default new AuthService();
