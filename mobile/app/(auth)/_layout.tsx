import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/auth.store';

export default function AuthLayout() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  if (_hasHydrated && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
