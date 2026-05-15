import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from '../auth.api';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockPost = vi.mocked(apiClient.post);

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('posts credentials to /auth/login', async () => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSJ9.sig';
      mockPost.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: { access_token: token } } });

      const res = await authApi.login({ email: 'admin@gov.ng', password: 'secret123' });

      expect(mockPost).toHaveBeenCalledWith('/auth/login', { email: 'admin@gov.ng', password: 'secret123' });
      expect(res.data.data.access_token).toBe(token);
    });

    it('propagates errors from the server', async () => {
      mockPost.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' }, status: 401 } });

      await expect(authApi.login({ email: 'x@x.com', password: 'wrong' })).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  describe('register', () => {
    it('posts all required fields to /auth/seed-admin', async () => {
      mockPost.mockResolvedValueOnce({ data: { success: true, statusCode: 201, data: { message: 'Account created' } } });

      await authApi.register({ name: 'Amara', email: 'amara@gov.ng', password: 'pass1234', orgName: 'Ministry', role: 'hr_admin' });

      expect(mockPost).toHaveBeenCalledWith('/auth/seed-admin', {
        name: 'Amara', email: 'amara@gov.ng', password: 'pass1234', orgName: 'Ministry', role: 'hr_admin',
      });
    });
  });
});
