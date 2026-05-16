import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
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
  ScanLine,
  MapPin,
  Fingerprint,
  Clock,
  Zap,
  Calendar,
  AlertCircle,
  ChevronRight,
  Circle,
  LogOut,
  Mail,
  Briefcase,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '@/constants';
import { usersApi } from '@/src/api/users.api';
import { useAuthStore } from '@/src/store/auth.store';
import { useToastStore } from '@/src/store/toast.store';
import { usePushNotifications } from '@/src/hooks/usePushNotifications';

const { height } = Dimensions.get('window');

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  orgName: string;
  orgId: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { show } = useToastStore();

  // Register Expo push token with the server on first authenticated load
  usePushNotifications();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);

  const profileTranslateY = useSharedValue(height);
  const profileBackdropOpacity = useSharedValue(0);

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

  useEffect(() => {
    if (showProfileSheet) {
      profileTranslateY.value = withSpring(0, { damping: 25, stiffness: 300 });
      profileBackdropOpacity.value = withTiming(0.5, { duration: 200 });
    } else {
      profileTranslateY.value = withSpring(height, { damping: 25, stiffness: 300 });
      profileBackdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [showProfileSheet, profileTranslateY, profileBackdropOpacity]);

  const onRefresh = useCallback(() => {
    loadProfile(true);
  }, [loadProfile]);

  const handleLogout = () => {
    setShowProfileSheet(false);
    // Small delay to let the sheet close before logging out
    setTimeout(() => {
      logout();
      router.replace('/login');
    }, 300);
  };

  const handleVerify = () => {
    setShowModal(false);
    router.push('/verify');
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const profileBackdropStyle = useAnimatedStyle(() => ({
    opacity: profileBackdropOpacity.value,
  }));

  const profileSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: profileTranslateY.value }],
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

  const profileGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        profileTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        setShowProfileSheet(false);
      } else {
        profileTranslateY.value = withSpring(0, { damping: 25, stiffness: 300 });
      }
    });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletBrand}>Sage Wallet • Lagos State Government</Text>
            <TouchableOpacity
              style={styles.profileIconButton}
              onPress={() => setShowProfileSheet(true)}
              activeOpacity={0.8}
            >
              <User size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>₦0.00</Text>
            <Text style={styles.incomingText}>+₦350,000 arriving 25 May 2026</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile?.name || 'Chukwuemeka Obi'}</Text>
            <Text style={styles.cardNumber}>•••• •••• 7734</Text>
          </View>
        </View>

        {/* Verification Status Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verification Status</Text>
            <Text style={styles.sectionSubtitle}>May 2026</Text>
          </View>

          {/* Payment Frozen Alert */}
          <View style={styles.frozenAlert}>
            <View style={styles.frozenIconContainer}>
              <AlertCircle size={20} color={Colors.frozen} />
            </View>
            <View style={styles.frozenTextContainer}>
              <Text style={styles.frozenTitle}>Payment Frozen</Text>
              <Text style={styles.frozenDesc}>
                Your salary is on hold. Your HR team has been notified and will reach out to you.
              </Text>
            </View>
          </View>

          {/* Verification Items */}
          <View style={styles.statusList}>
            <StatusItem icon={<ScanLine size={20} color="#999" />} label="Liveness verification" value="Failed" status="error" />
            <StatusItem icon={<MapPin size={20} color="#999" />} label="Location check" value="Flagged" status="error" />
            <StatusItem icon={<Fingerprint size={20} color="#999" />} label="Device fingerprint" value="Shared device" status="warning" />
            <StatusItem icon={<Clock size={20} color="#999" />} label="Check-in time" value="Normal" status="success" />
            <StatusItem icon={<Zap size={20} color="#999" />} label="Post-pay velocity" value="Flagged" status="error" />
          </View>
        </View>

        {/* Next Payday Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleStandalone}>Next Payday</Text>
          <View style={styles.paydayRow}>
            <View style={styles.paydayLeft}>
              <View style={styles.calendarIconBg}>
                <Calendar size={20} color="#666" />
              </View>
              <View style={styles.paydayInfo}>
                <Text style={styles.paydayLabel}>Scheduled disbursement</Text>
                <Text style={styles.paydayDate}>25 May 2026</Text>
                <Text style={styles.paydayOrg}>Ministry of Finance</Text>
              </View>
            </View>
            <View style={styles.paydayRight}>
              <Text style={styles.paydayAmount}>₦350,000</Text>
              <View style={styles.frozenBadge}>
                <Text style={styles.frozenBadgeText}>Frozen</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payroll Summary Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleStandalone}>Payroll Summary</Text>
          <View style={styles.summaryList}>
            <SummaryItem 
              bank="GT Bank ****4421" 
              detail="47 sec after receipt — velocity flag" 
              amount="₦280,000" 
              status="error" 
            />
            <SummaryItem 
              bank="Opay ****9981" 
              detail="2 minutes 12 seconds after receipt — velocity flag" 
              amount="₦60,000" 
              status="error" 
            />
            <SummaryItem 
              bank="Kuda ****1207" 
              detail="15 May, 10:40 AM — ATM withdrawal · Mushin, Lagos" 
              amount="₦10,000" 
              status="normal" 
            />
          </View>
        </View>

        {/* Verification History Section */}
        <View style={[styles.sectionCard, { marginBottom: 40 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verification History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyList}>
            <HistoryItem month="May 2026" score="28" status="Frozen" statusType="error" />
            <HistoryItem month="April 2026" score="41" status="Review" statusType="warning" />
            <HistoryItem month="March 2026" score="90" status="Clear" statusType="success" />
          </View>
        </View>
      </ScrollView>

      {/* Verification Modal (Kept from original for functionality) */}
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
      {/* Profile Bottom Sheet */}
      {showProfileSheet && (
        <View style={styles.modalOverlay} pointerEvents="box-none">
          <Animated.View style={[styles.backdrop, profileBackdropStyle]} pointerEvents="auto">
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowProfileSheet(false)} />
          </Animated.View>

          <GestureDetector gesture={profileGesture}>
            <Animated.View style={[styles.modalContainer, profileSheetStyle]}>
              <View style={styles.modalHandle} />

              {/* Profile Header */}
              <View style={styles.profileSheetHeader}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CO'}
                  </Text>
                </View>
                <View style={styles.profileSheetInfo}>
                  <Text style={styles.profileSheetName}>{profile?.name || 'Chukwuemeka Obi'}</Text>
                  <Text style={styles.profileSheetRole}>{profile?.role || 'Employee'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.profileCloseButton}
                  onPress={() => setShowProfileSheet(false)}
                >
                  <X size={18} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.profileDivider} />

              {/* Profile Details */}
              <View style={styles.profileDetailsList}>
                <View style={styles.profileDetailItem}>
                  <View style={styles.profileDetailIcon}>
                    <Mail size={16} color={Colors.primary} />
                  </View>
                  <View style={styles.profileDetailText}>
                    <Text style={styles.profileDetailLabel}>Email</Text>
                    <Text style={styles.profileDetailValue}>{profile?.email || '—'}</Text>
                  </View>
                </View>
                <View style={styles.profileDetailItem}>
                  <View style={styles.profileDetailIcon}>
                    <Briefcase size={16} color={Colors.primary} />
                  </View>
                  <View style={styles.profileDetailText}>
                    <Text style={styles.profileDetailLabel}>Organisation</Text>
                    <Text style={styles.profileDetailValue}>{profile?.orgName || '—'}</Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.profileDivider} />

              {/* Logout Button */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <View style={styles.logoutIconContainer}>
                  <LogOut size={18} color={Colors.frozen} />
                </View>
                <Text style={styles.logoutText}>Log out</Text>
                <ChevronRight size={16} color={Colors.frozen} />
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
        </View>
      )}
    </View>
  );
}

function StatusItem({ icon, label, value, status }: { icon: any, label: string, value: string, status: 'error' | 'warning' | 'success' }) {
  const textColor = status === 'error' ? Colors.frozen : status === 'warning' ? Colors.pending : Colors.verified;
  return (
    <View style={styles.statusItem}>
      <View style={styles.statusItemLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.statusLabel}>{label}</Text>
      </View>
      <Text style={[styles.statusValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

function SummaryItem({ bank, detail, amount, status }: { bank: string, detail: string, amount: string, status: 'error' | 'normal' }) {
  const amountColor = status === 'error' ? Colors.frozen : Colors.text;
  return (
    <View style={styles.summaryItem}>
      <View style={styles.summaryLeft}>
        <View style={styles.dotContainer}>
          <View style={[styles.statusDot, { backgroundColor: status === 'error' ? '#D47A3A' : '#D47A3A' }]} />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.bankName}>{bank}</Text>
          <View style={styles.detailRow}>
            {status === 'error' && <Zap size={12} color="#D47A3A" style={{ marginRight: 4 }} />}
            <Text style={[styles.summaryDetail, status === 'error' && { color: '#D47A3A' }]}>{detail}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.summaryAmount, { color: amountColor }]}>{amount}</Text>
    </View>
  );
}

function HistoryItem({ month, score, status, statusType }: { month: string, score: string, status: string, statusType: 'error' | 'warning' | 'success' }) {
  const statusColors = {
    error: { bg: '#FDECEC', text: Colors.frozen },
    warning: { bg: '#FFF7E6', text: Colors.pending },
    success: { bg: '#E6F4F0', text: Colors.verified },
  };
  const colors = statusColors[statusType];
  
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <View style={styles.calendarIconBg}>
          <Calendar size={18} color="#666" />
        </View>
        <Text style={styles.historyMonth}>{month}</Text>
      </View>
      <View style={styles.historyRight}>
        <Text style={[styles.historyScore, { color: colors.text }]}>{score}</Text>
        <View style={[styles.historyBadge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.historyBadgeText, { color: colors.text }]}>{status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  walletCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletBrand: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  balanceContainer: {
    marginVertical: 12,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  incomingText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginTop: 4,
  },
  userInfo: {
    gap: 4,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  sectionTitleStandalone: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  frozenAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  frozenIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  frozenTextContainer: {
    flex: 1,
  },
  frozenTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  frozenDesc: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  statusList: {
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  paydayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paydayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paydayInfo: {
    gap: 2,
  },
  paydayLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#999',
  },
  paydayDate: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  paydayOrg: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#999',
  },
  paydayRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paydayAmount: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  frozenBadge: {
    backgroundColor: '#FDECEC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  frozenBadgeText: {
    color: Colors.frozen,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  summaryList: {
    gap: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  dotContainer: {
    marginTop: 6,
    marginRight: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryText: {
    flex: 1,
  },
  bankName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  summaryDetail: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#999',
  },
  summaryAmount: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginLeft: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyMonth: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyScore: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  historyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  historyBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
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

  // Profile icon on wallet card
  profileIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // Profile bottom sheet
  profileSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  profileSheetInfo: {
    flex: 1,
  },
  profileSheetName: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  profileSheetRole: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  profileCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginBottom: 20,
  },
  profileDetailsList: {
    gap: 16,
    marginBottom: 20,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileDetailIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F7F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetailText: {
    flex: 1,
  },
  profileDetailLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  profileDetailValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 16,
  },
  logoutIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FDECEC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.frozen,
  },
});
