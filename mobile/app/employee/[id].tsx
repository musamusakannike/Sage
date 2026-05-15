import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants';
import { employeesApi } from '@/src/api/employees.api';
import { useToastStore } from '@/src/store/toast.store';
import type { Employee } from '@/src/types/employee.types';
import axios from 'axios';

function getRiskLabel(score: number | null): { label: string; color: string } {
  if (score === null) return { label: 'UNVERIFIED', color: Colors.textSecondary };
  if (score < 40) return { label: 'HIGH RISK', color: Colors.risk.high };
  if (score < 70) return { label: 'MEDIUM RISK', color: Colors.risk.medium };
  return { label: 'LOW RISK', color: Colors.risk.low };
}

function maskAccount(account: string): string {
  if (account.length < 4) return '****';
  return `**** **** ${account.slice(-4)}`;
}

function maskPhone(phone: string): string {
  if (phone.length < 7) return '***';
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

function getScoreColor(score: number | null): string {
  if (score === null) return Colors.textSecondary;
  if (score < 40) return Colors.risk.high;
  if (score < 70) return Colors.risk.medium;
  return Colors.risk.low;
}

const EmployeeDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { show } = useToastStore();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<'hold' | 'freeze' | null>(null);

  const loadEmployee = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await employeesApi.getById(id);
      setEmployee(res.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const displayMsg = Array.isArray(msg) ? msg[0] : (msg ?? 'Failed to load employee.');
        show({ type: 'error', title: 'Error', message: displayMsg });
      } else {
        show({ type: 'error', title: 'Network error', message: 'Unable to reach the server.' });
      }
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id, show, router]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const handleAction = (type: 'hold' | 'freeze') => {
    const label = type === 'hold' ? 'Hold Payment' : 'Freeze Payment';
    const message = type === 'hold'
      ? 'This will set the employee status to Pending and pause payment.'
      : 'This will freeze the employee\'s payment until manually cleared.';

    Alert.alert(label, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: async () => {
          if (!id) return;
          setActionLoading(type);
          try {
            const res = type === 'hold'
              ? await employeesApi.hold(id)
              : await employeesApi.freeze(id);
            setEmployee(res.data.data);
            show({ type: 'success', title: 'Done', message: `Employee payment ${type === 'hold' ? 'held' : 'frozen'} successfully.` });
          } catch (err) {
            if (axios.isAxiosError(err)) {
              const msg = err.response?.data?.message;
              const displayMsg = Array.isArray(msg) ? msg[0] : (msg ?? 'Action failed.');
              show({ type: 'error', title: 'Error', message: displayMsg });
            } else {
              show({ type: 'error', title: 'Network error', message: 'Unable to reach the server.' });
            }
          } finally {
            setActionLoading(null);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!employee) return null;

  const statusKey = employee.status.toLowerCase() as keyof typeof Colors.status;
  const statusStyles = Colors.status[statusKey] || Colors.status.pending;
  const displayStatus = employee.status.charAt(0) + employee.status.slice(1).toLowerCase();
  const { label: riskLabel, color: riskColor } = getRiskLabel(employee.dnaScore);
  const scoreColor = getScoreColor(employee.dnaScore);

  const verifiedDate = employee.lastVerifiedAt
    ? new Date(employee.lastVerifiedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.initialsAvatar}>
            <Text style={styles.initialsText}>
              {employee.name.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.role}>{employee.roleTitle}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
            <Text style={[styles.statusText, { color: statusStyles.text }]}>{displayStatus}</Text>
          </View>
        </View>

        {/* Identity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity</Text>
          <View style={styles.identityRow}>
            <Text style={styles.identityLabel}>Account No.</Text>
            <Text style={styles.identityValue}>{maskAccount(employee.accountNumber)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.identityRow}>
            <Text style={styles.identityLabel}>Phone number</Text>
            <Text style={styles.identityValue}>{maskPhone(employee.phone)}</Text>
          </View>
          {employee.email && (
            <>
              <View style={styles.divider} />
              <View style={styles.identityRow}>
                <Text style={styles.identityLabel}>Email</Text>
                <Text style={styles.identityValue}>{employee.email}</Text>
              </View>
            </>
          )}
        </View>

        {/* DNA Score Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DNA Score</Text>
          <View style={styles.dnaScoreContainer}>
            <Text style={[styles.dnaScoreValue, { color: scoreColor }]}>
              {employee.dnaScore ?? '—'}
            </Text>
            <View>
              <Text style={[styles.riskLevel, { color: riskColor }]}>{riskLabel}</Text>
              {verifiedDate ? (
                <Text style={styles.verificationTime}>Verified {verifiedDate}</Text>
              ) : (
                <Text style={styles.verificationTime}>Not yet verified</Text>
              )}
            </View>
          </View>

          {employee.dnaScore !== null && (
            <View style={styles.scoreBarContainer}>
              <View style={styles.scoreBarBg}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${Math.min(employee.dnaScore, 100)}%`,
                      backgroundColor: scoreColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.scoreBarLabel}>{employee.dnaScore} / 100</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.hold.bg, opacity: actionLoading ? 0.7 : 1 }]}
            onPress={() => handleAction('hold')}
            disabled={actionLoading !== null}
          >
            {actionLoading === 'hold' ? (
              <ActivityIndicator size="small" color={Colors.hold.text} />
            ) : (
              <Text style={[styles.actionButtonText, { color: Colors.hold.text }]}>Hold Payment</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.freeze.bg, opacity: actionLoading ? 0.7 : 1 }]}
            onPress={() => handleAction('freeze')}
            disabled={actionLoading !== null}
          >
            {actionLoading === 'freeze' ? (
              <ActivityIndicator size="small" color={Colors.freeze.text} />
            ) : (
              <Text style={[styles.actionButtonText, { color: Colors.freeze.text }]}>Freeze Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initialsText: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  name: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  identityLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  identityValue: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dnaScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  dnaScoreValue: {
    fontSize: 64,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  riskLevel: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 2,
  },
  verificationTime: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  scoreBarContainer: {
    marginTop: 4,
  },
  scoreBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  scoreBarLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  scoreList: {
    backgroundColor: '#FCFCFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  scoreLabel: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreValue: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    width: 50,
    textAlign: 'right',
  },
  progressBarBg: {
    width: 80,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyMonth: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallScoreBadge: {
    backgroundColor: '#FDECEC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  smallScoreText: {
    fontSize: 12,
    color: '#D43A3A',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  smallScoreBadgeGreen: {
    backgroundColor: '#E6F4F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  smallScoreTextGreen: {
    fontSize: 12,
    color: '#3A6E57',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  miniStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  miniStatusText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
