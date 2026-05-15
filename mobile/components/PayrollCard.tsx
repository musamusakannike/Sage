import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants';

interface PayrollCardProps {
  disbursementDay?: number;
}

function getNextDisbursement(disbursementDay: number): { daysUntil: number; dateString: string } {
  const now = new Date();
  let next = new Date(now.getFullYear(), now.getMonth(), disbursementDay);
  if (next <= now) {
    next = new Date(now.getFullYear(), now.getMonth() + 1, disbursementDay);
  }
  const daysUntil = Math.max(0, Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const dateString = next.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return { daysUntil, dateString };
}

export const PayrollCard = ({ disbursementDay }: PayrollCardProps) => {
  const { daysUntil, dateString } = disbursementDay
    ? getNextDisbursement(disbursementDay)
    : { daysUntil: '—', dateString: 'Loading...' };

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <Text style={styles.label}>Next payroll in</Text>
        <View style={styles.daysContainer}>
          <Text style={styles.daysValue}>{daysUntil}</Text>
          <Text style={styles.daysText}>days</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.date}>{dateString}</Text>
        <View style={styles.statusContainer}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Scheduled</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginBottom: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  daysValue: {
    color: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  date: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  leftContent: {
    flex: 1,
  }
});
