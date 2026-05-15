import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Clock, Snowflake, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants';
import { StatCard } from '@/components/StatCard';
import { PayrollCard } from '@/components/PayrollCard';
import { EmployeeListItem } from '@/components/EmployeeListItem';
import { employeesApi } from '@/src/api/employees.api';
import { payrollApi } from '@/src/api/payroll.api';
import { usersApi } from '@/src/api/users.api';
import { useAuthStore } from '@/src/store/auth.store';
import type { Employee } from '@/src/types/employee.types';
import type { PayrollSchedule } from '@/src/types/payroll.types';

interface Stats {
  verified: number;
  pending: number;
  frozen: number;
}

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<Stats>({ verified: 0, pending: 0, frozen: 0 });
  const [schedule, setSchedule] = useState<PayrollSchedule | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboard = useCallback(async (isPullRefresh = false) => {
    if (isPullRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const [listRes, clearRes, pendingRes, frozenRes, scheduleRes, profileRes] = await Promise.allSettled([
        employeesApi.list({ page: 1, limit: 6 }),
        employeesApi.list({ status: 'CLEAR', limit: 1 }),
        employeesApi.list({ status: 'PENDING', limit: 1 }),
        employeesApi.list({ status: 'FROZEN', limit: 1 }),
        payrollApi.getSchedule(),
        usersApi.getMe(),
      ]);

      if (listRes.status === 'fulfilled') {
        setEmployees(listRes.value.data.data.data);
      }
      setStats({
        verified: clearRes.status === 'fulfilled' ? clearRes.value.data.data.total : 0,
        pending: pendingRes.status === 'fulfilled' ? pendingRes.value.data.data.total : 0,
        frozen: frozenRes.status === 'fulfilled' ? frozenRes.value.data.data.total : 0,
      });
      if (scheduleRes.status === 'fulfilled') {
        setSchedule(scheduleRes.value.data.data);
      }
      if (profileRes.status === 'fulfilled') {
        const profile = profileRes.value.data.data;
        setFirstName(profile.name.split(' ')[0]);
        setOrgName(profile.orgName);
      } else {
        setFirstName(user?.email?.split('@')[0] ?? '');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = useCallback(() => {
    loadDashboard(true);
  }, [loadDashboard]);

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
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          {orgName ? (
            <Text style={styles.location}>{orgName}</Text>
          ) : null}
        </View>

        {/* Stats Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          <StatCard value={stats.verified} label="Verified" Icon={Check} color={Colors.verified} />
          <StatCard value={stats.pending} label="Pending" Icon={Clock} color={Colors.pending} />
          <StatCard value={stats.frozen} label="Frozen" Icon={Snowflake} color={Colors.frozen} />
        </ScrollView>

        {/* Payroll Card */}
        <PayrollCard disbursementDay={schedule?.disbursementDay} />

        {/* Employees Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Employees</Text>
          <TouchableOpacity style={styles.seeAll} onPress={() => router.push('/(tabs)/employees')}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <View style={styles.employeeList}>
            {employees.map((employee) => (
              <EmployeeListItem
                key={employee._id}
                id={employee._id}
                name={employee.name}
                role={employee.roleTitle}
                status={employee.status}
                dnaScore={employee.dnaScore}
              />
            ))}
          </View>
        )}
        
        {/* Bottom Padding for floating tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  statsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  employeeList: {
    gap: 4,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});
