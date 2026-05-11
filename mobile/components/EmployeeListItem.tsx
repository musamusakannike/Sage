import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants';

export type EmployeeStatus = 'Frozen' | 'Review' | 'Clear' | 'Pending';

interface EmployeeListItemProps {
  name: string;
  role: string;
  status: EmployeeStatus;
  badgeCount: number;
  image?: string;
}

export const EmployeeListItem = ({ name, role, status, badgeCount, image }: EmployeeListItemProps) => {
  const statusKey = status.toLowerCase() as keyof typeof Colors.status;
  const statusStyles = Colors.status[statusKey] || Colors.status.pending;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsAvatar}>
            <Text style={styles.initialsText}>
              {name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
          <Text style={[styles.statusText, { color: statusStyles.text }]}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  initialsAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  info: {
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  role: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#D47A3A',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
