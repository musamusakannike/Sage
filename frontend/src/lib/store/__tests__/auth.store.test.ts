import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../auth.store';
import type { AuthUser, UserProfile } from '@/lib/types';

const fakeUser: AuthUser = { sub: 'u1', email: 'amara@gov.ng', role: 'hr_admin', orgId: 'org1' };
const fakeProfile: UserProfile = { _id: 'u1', name: 'Amara Eze', email: 'amara@gov.ng', role: 'hr_admin', orgName: 'Ministry of Finance', orgId: 'org1' };

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, profile: null });
  });

  it('starts with no token or user', () => {
    const { token, user, profile } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(user).toBeNull();
    expect(profile).toBeNull();
  });

  it('setToken stores token and user', () => {
    useAuthStore.getState().setToken('tok123', fakeUser);
    const { token, user } = useAuthStore.getState();
    expect(token).toBe('tok123');
    expect(user).toEqual(fakeUser);
  });

  it('setProfile stores profile', () => {
    useAuthStore.getState().setProfile(fakeProfile);
    expect(useAuthStore.getState().profile).toEqual(fakeProfile);
  });

  it('logout clears all auth state', () => {
    useAuthStore.getState().setToken('tok123', fakeUser);
    useAuthStore.getState().setProfile(fakeProfile);
    useAuthStore.getState().logout();

    const { token, user, profile } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(user).toBeNull();
    expect(profile).toBeNull();
  });
});
