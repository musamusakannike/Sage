import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export const FilterChip = ({ label, isActive, onPress }: FilterChipProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.chip, 
        isActive ? styles.activeChip : styles.inactiveChip
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.label, 
        isActive ? styles.activeLabel : styles.inactiveLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
  },
  inactiveChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E1E1',
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  inactiveLabel: {
    color: Colors.textSecondary,
  },
  activeLabel: {
    color: '#FFFFFF',
  },
});
