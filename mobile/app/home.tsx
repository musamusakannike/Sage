import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Shield,
  CheckCircle2,
  X,
  User,
  Building2,
  Landmark,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '@/constants';
import { usersApi } from '@/src/api/users.api';
import { useAuthStore } from '@/src/store/auth.store';
import { useToastStore } from '@/src/store/toast.store';

const { height } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'salary' | 'withdrawal' | 'verification_flag' | 'bonus';
  title: string;
  amount?: string;
  date: string;
  status: 'completed' | 'pending' | 'flagged';
  description?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  orgName: string;
  orgId: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'salary',
    title: 'Salary Received',
    amount: '+₦250,000.00',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'completed',
    description: 'Monthly salary - May 2026',
  },
  {
    id: '2',
    type: 'withdrawal',
    title: 'Withdrawal to Bank',
    amount: '-₦50,000.00',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'completed',
    description: 'GTBank •••• 4582',
  },
  {
    id: '3',
    type: 'bonus',
    title: 'Performance Bonus',
    amount: '+₦25,000.00',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'completed',
    description: 'Q2 Performance reward',
  },
  {
    id: '4',
    type: 'withdrawal',
    title: 'ATM Withdrawal',
    amount: '-₦20,000.00',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: 'completed',
    description: 'Ikeja City Mall ATM',
  },
  {
    id: '5',
    type: 'salary',
    title: 'Salary Received',
    amount: '+₦250,000.00',
    date: new Date(Date.now() - 86400000 * 32).toISOString(),
    status: 'completed',
    description: 'Monthly salary - April 2026',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { show } = useToastStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount] = useState(1);

  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);

  const loadProfile = useCallback(async (isPullRefresh = false) => {
    if (isPullRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await usersApi.getMe();
      setProfile(res.data.data);
    } catch {
      show({ type: 'error', title: 'Error', message: 'Failed to load profile' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [show]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (showModal) {
      translateY.value = withSpring(0, { damping: 25, stiffness: 300 });
      backdropOpacity.value = withTiming(0.5, { duration: 200 });
    } else {
      translateY.value = withSpring(height, { damping: 25, stiffness: 300 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [showModal, translateY, backdropOpacity]);

  const onRefresh = useCallback(() => {
    loadProfile(true);
  }, [loadProfile]);

  const handleSimulateFlag = () => {
    const flagTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'verification_flag',
      title: 'Verification Required',
      date: new Date().toISOString(),
      status: 'flagged',
      description: 'Anomalies detected in your account',
    };
    setTransactions([flagTransaction, ...transactions]);
    setShowModal(true);
    show({
      type: 'warning',
      title: 'Verification Flagged',
      message: 'Anomalies detected. Please verify your identity.',
    });
  };

  const handleVerify = () => {
    setShowModal(false);
    router.push('/verify');
  };

  const handleLogout = () => {
    logout();
    show({ type: 'success', title: 'Logged out', message: 'See you soon!' });
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        setShowModal(false);
      } else {
        translateY.value = withSpring(0, { damping: 25, stiffness: 300 });
      }
    });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'salary':
        return <Wallet size={20} color={Colors.verified} />;
      case 'withdrawal':
        return <ArrowUpRight size={20} color={Colors.error} />;
      case 'bonus':
        return <ArrowDownLeft size={20} color={Colors.verified} />;
      case 'verification_flag':
        return <AlertTriangle size={20} color={Colors.frozen} />;
      default:
        return <Wallet size={20} color={Colors.primary} />;
    }
  };

  const getTransactionBg = (type: string) => {
    switch (type) {
      case 'salary':
      case 'bonus':
        return { backgroundColor: '#E6F4F0' };
      case 'withdrawal':
        return { backgroundColor: '#FDECEC' };
      case 'verification_flag':
        return { backgroundColor: '#FFF7E6' };
      default:
        return { backgroundColor: '#F5F5F5' };
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <User size={24} color={Colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{profile?.name || 'Employee'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleLogout}>
            <Bell size={24} color={Colors.text} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Company Card */}
        <View style={styles.companyCard}>
          <View style={styles.companyIconContainer}>
            <Building2 size={24} color="#FFFFFF" />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyLabel}>Organization</Text>
            <Text style={styles.companyName}>{profile?.orgName || 'Company Name'}</Text>
          </View>
          <View style={styles.statusBadge}>
            <CheckCircle2 size={14} color={Colors.verified} />
            <Text style={styles.statusText}>Verified</Text>
          </View>
        </View>

        {/* Simulate Flag Button */}
        <TouchableOpacity style={styles.simulateButton} onPress={handleSimulateFlag}>
          <View style={styles.simulateIconContainer}>
            <Shield size={20} color="#FFFFFF" />
          </View>
          <View style={styles.simulateTextContainer}>
            <Text style={styles.simulateTitle}>Security Test</Text>
            <Text style={styles.simulateSubtitle}>Simulate verification flag</Text>
          </View>
          <ArrowUpRight size={20} color={Colors.frozen} style={{ transform: [{ rotate: '90deg' }] }} />
        </TouchableOpacity>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  transaction.type === 'verification_flag' && styles.flaggedItem,
                ]}
                onPress={() => {
                  if (transaction.type === 'verification_flag') {
                    setShowModal(true);
                  }
                }}
              >
                <View style={[styles.transactionIcon, getTransactionBg(transaction.type)]}>
                  {getTransactionIcon(transaction.type)}
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                </View>
                {transaction.amount && (
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.amount.startsWith('+') ? styles.positiveAmount : styles.negativeAmount,
                    ]}
                  >
                    {transaction.amount}
                  </Text>
                )}
                {transaction.type === 'verification_flag' && (
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagBadgeText}>Action needed</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Verification Modal */}
      {showModal && (
        <View style={styles.modalOverlay} pointerEvents="box-none">
          <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents="auto">
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowModal(false)} />
          </Animated.View>

          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.modalContainer, modalStyle]}>
              <View style={styles.modalHandle} />

              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <Landmark size={40} color={Colors.frozen} />
                </View>

                <Text style={styles.modalTitle}>Verification Required</Text>
                <Text style={styles.modalDescription}>
                  Our system has detected anomalies in your account. To ensure the security of your payroll and prevent fraud, please complete a quick identity verification.
                </Text>

                <View style={styles.alertBox}>
                  <AlertTriangle size={20} color={Colors.frozen} />
                  <Text style={styles.alertText}>
                    Your account may be temporarily restricted until verification is completed.
                  </Text>
                </View>

                <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
                  <Shield size={20} color="#FFFFFF" />
                  <Text style={styles.verifyButtonText}>Verify Identity Now</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dismissButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.dismissButtonText}>I'll do this later</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F4F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    gap: 2,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.frozen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  companyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  companyLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(58,110,87,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#4ADE80',
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3F2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  simulateIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.frozen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulateTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  simulateTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  simulateSubtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  transactionsSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.primary,
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
  },
  flaggedItem: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 14,
  },
  transactionTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#999999',
  },
  transactionAmount: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginLeft: 8,
  },
  positiveAmount: {
    color: Colors.verified,
  },
  negativeAmount: {
    color: Colors.error,
  },
  flagBadge: {
    backgroundColor: Colors.frozen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  flagBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 34,
    maxHeight: height * 0.7,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E1E1E1',
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFF7E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.pending,
    lineHeight: 20,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    width: '100%',
    height: 56,
    borderRadius: 16,
    marginBottom: 12,
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  dismissButton: {
    paddingVertical: 12,
  },
  dismissButtonText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
});
