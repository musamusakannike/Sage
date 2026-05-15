import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Send, Edit2, Check, X } from 'lucide-react-native';
import { Colors } from '@/constants';
import { payrollApi } from '@/src/api/payroll.api';
import { useToastStore } from '@/src/store/toast.store';
import type { PayrollSchedule } from '@/src/types/payroll.types';
import axios from 'axios';

function getNextDisbursement(disbursementDay: number): { daysUntil: number; dateString: string } {
  const now = new Date();
  let next = new Date(now.getFullYear(), now.getMonth(), disbursementDay);
  if (next <= now) next = new Date(now.getFullYear(), now.getMonth() + 1, disbursementDay);
  const daysUntil = Math.max(0, Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const dateString = next.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return { daysUntil, dateString };
}

const Schedule = () => {
  const { show } = useToastStore();
  const [schedule, setSchedule] = useState<PayrollSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingInvites, setIsSendingInvites] = useState(false);

  const [editDay, setEditDay] = useState('');
  const [editHours, setEditHours] = useState('');

  const loadSchedule = useCallback(async (isPullRefresh = false) => {
    if (isPullRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await payrollApi.getSchedule();
      setSchedule(res.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        show({ type: 'error', title: 'Error', message: Array.isArray(msg) ? msg[0] : (msg ?? 'Failed to load schedule.') });
      } else {
        show({ type: 'error', title: 'Network error', message: 'Unable to reach the server.' });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [show]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const onRefresh = useCallback(() => {
    loadSchedule(true);
  }, [loadSchedule]);

  const handleEditStart = () => {
    if (!schedule) return;
    setEditDay(String(schedule.disbursementDay));
    setEditHours(String(schedule.smsHoursBefore));
    setIsEditing(true);
  };

  const handleSave = async () => {
    const day = parseInt(editDay, 10);
    const hours = parseInt(editHours, 10);
    if (isNaN(day) || day < 1 || day > 28) {
      show({ type: 'warning', title: 'Invalid day', message: 'Disbursement day must be between 1 and 28.' });
      return;
    }
    if (isNaN(hours) || hours < 1) {
      show({ type: 'warning', title: 'Invalid hours', message: 'SMS hours must be at least 1.' });
      return;
    }
    setIsSaving(true);
    try {
      const res = await payrollApi.updateSchedule({ disbursementDay: day, smsHoursBefore: hours });
      setSchedule(res.data.data);
      setIsEditing(false);
      show({ type: 'success', title: 'Saved', message: 'Payroll schedule updated successfully.' });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        show({ type: 'error', title: 'Save failed', message: Array.isArray(msg) ? msg[0] : (msg ?? 'Could not save schedule.') });
      } else {
        show({ type: 'error', title: 'Network error', message: 'Unable to reach the server.' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendInvites = async () => {
    setIsSendingInvites(true);
    try {
      const res = await payrollApi.sendInvites();
      show({ type: 'success', title: 'Invites sent', message: res.data.data.message });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        show({ type: 'error', title: 'Failed', message: Array.isArray(msg) ? msg[0] : (msg ?? 'Could not send invites.') });
      } else {
        show({ type: 'error', title: 'Network error', message: 'Unable to reach the server.' });
      }
    } finally {
      setIsSendingInvites(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Schedule</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const disbursement = schedule ? getNextDisbursement(schedule.disbursementDay) : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >

          {/* Countdown Card */}
          {disbursement && (
            <View style={styles.countdownCard}>
              <Text style={styles.countdownLabel}>Next disbursement in</Text>
              <View style={styles.countdownRow}>
                <Text style={styles.countdownDays}>{disbursement.daysUntil}</Text>
                <Text style={styles.countdownDaysLabel}>days</Text>
              </View>
              <Text style={styles.countdownDate}>{disbursement.dateString}</Text>
            </View>
          )}

          {/* Schedule Config Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Payroll Configuration</Text>
              {!isEditing ? (
                <TouchableOpacity onPress={handleEditStart} style={styles.editBtn}>
                  <Edit2 size={16} color={Colors.primary} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editActions}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelEditBtn} disabled={isSaving}>
                    <X size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Check size={16} color="#fff" />}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.configRow}>
              <View style={styles.configIconBox}>
                <Calendar size={20} color={Colors.primary} />
              </View>
              <View style={styles.configInfo}>
                <Text style={styles.configLabel}>Disbursement Day</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.configInput}
                    value={editDay}
                    onChangeText={setEditDay}
                    keyboardType="number-pad"
                    placeholder="1–28"
                    placeholderTextColor={Colors.textSecondary}
                    maxLength={2}
                  />
                ) : (
                  <Text style={styles.configValue}>
                    Day {schedule?.disbursementDay} of every month
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.configDivider} />

            <View style={styles.configRow}>
              <View style={styles.configIconBox}>
                <Clock size={20} color={Colors.primary} />
              </View>
              <View style={styles.configInfo}>
                <Text style={styles.configLabel}>SMS Notification</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.configInput}
                    value={editHours}
                    onChangeText={setEditHours}
                    keyboardType="number-pad"
                    placeholder="Hours before"
                    placeholderTextColor={Colors.textSecondary}
                    maxLength={3}
                  />
                ) : (
                  <Text style={styles.configValue}>
                    {schedule?.smsHoursBefore}h before disbursement
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Send Invites */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Verification Invites</Text>
            <Text style={styles.inviteDescription}>
              Send SMS verification links to all active employees for the current payroll cycle.
            </Text>
            <TouchableOpacity
              style={[styles.sendButton, isSendingInvites && { opacity: 0.8 }]}
              onPress={handleSendInvites}
              disabled={isSendingInvites}
            >
              {isSendingInvites ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Send size={18} color="#fff" />
                  <Text style={styles.sendButtonText}>Send Verification Invites</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  countdownCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
  },
  countdownLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginBottom: 8,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  countdownDays: {
    color: '#FFFFFF',
    fontSize: 72,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 80,
  },
  countdownDaysLabel: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  countdownDate: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelEditBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  configIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E6F4F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configInfo: {
    flex: 1,
  },
  configLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  configValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  configInput: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  configDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  inviteDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
