import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  value: string | number;
  label: string;
  Icon: LucideIcon;
  color: string;
}

export const StatCard = ({ value, label, Icon, color }: StatCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <View style={styles.footer}>
        <Icon size={14} color={Colors.textSecondary} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9F9',
    borderRadius: 20,
    padding: 16,
    width: 110,
    marginRight: 12,
  },
  value: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
