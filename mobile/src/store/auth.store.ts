import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken, isTokenExpired } from '../utils/jwt.utils';
import type { AuthUser } from '../types/auth.types';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      login: (token: string) => {
        const payload = decodeToken(token);
        if (!payload) return;
        const user: AuthUser = {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
          orgId: payload.orgId,
        };
        set({ token, user, isAuthenticated: true });
      },
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'sage-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token && isTokenExpired(state.token)) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
          }
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
