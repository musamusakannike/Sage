import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, UserProfile } from '@/lib/types';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  profile: UserProfile | null;
  setToken: (token: string, user: AuthUser) => void;
  setProfile: (profile: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      profile: null,

      setToken: (token, user) => set({ token, user }),

      setProfile: (profile) => set({ profile }),

      logout: () => {
        set({ token: null, user: null, profile: null });
      },
    }),
    {
      name: 'sage-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
