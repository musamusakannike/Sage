'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api/users.api';
import { useAuthStore } from '@/lib/store/auth.store';
import type { UserProfile } from '@/lib/types';

export function useProfile() {
  const { token, profile, setProfile } = useAuthStore();
  const [loading, setLoading] = useState(!profile && !!token);

  useEffect(() => {
    if (!token || profile) return;
    usersApi
      .getMe()
      .then((res) => setProfile(res.data.data))
      .finally(() => setLoading(false));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return { profile: profile as UserProfile | null, loading };
}
