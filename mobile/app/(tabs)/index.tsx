import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Clock, Snowflake, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants';
import { StatCard } from '@/components/StatCard';
import { PayrollCard } from '@/components/PayrollCard';
import { EmployeeListItem, EmployeeStatus } from '@/components/EmployeeListItem';

const EMPLOYEES: { name: string; role: string; status: EmployeeStatus; badgeCount: number; image?: string }[] = [
  { name: 'Chukwuemeka Obi', role: 'Senior Accountant', status: 'Frozen', badgeCount: 28, image: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Chukwuemeka Obi', role: 'Senior Accountant', status: 'Review', badgeCount: 52 },
  { name: 'Jasmine Albright', role: 'Project Manager', status: 'Review', badgeCount: 34 },
  { name: 'Tristan Reed', role: 'Finance officer', status: 'Clear', badgeCount: 28 },
  { name: 'Kamal Ahmed', role: 'Accountant', status: 'Clear', badgeCount: 45, image: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Mira Iyer', role: 'Revenue collector', status: 'Clear', badgeCount: 30, image: 'https://i.pravatar.cc/150?u=3' },
];

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Amara 👋</Text>
          <Text style={styles.location}>Lagos State Government · Ministry of Finance</Text>
        </View>

        {/* Stats Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          <StatCard value="47" label="Verified" Icon={Check} color={Colors.verified} />
          <StatCard value="8" label="Pending" Icon={Clock} color={Colors.pending} />
          <StatCard value="3" label="Frozen" Icon={Snowflake} color={Colors.frozen} />
        </ScrollView>

        {/* Payroll Card */}
        <PayrollCard />

        {/* Employees Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Employees</Text>
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.employeeList}>
          {EMPLOYEES.map((employee, index) => (
            <EmployeeListItem 
              key={index}
              {...employee}
            />
          ))}
        </View>
        
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
});
