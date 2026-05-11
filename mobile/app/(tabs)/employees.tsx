import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus } from 'lucide-react-native';
import { Colors } from '@/constants';
import { EmployeeListItem } from '@/components/EmployeeListItem';
import { FilterChip } from '@/components/FilterChip';
import { UploadBottomSheet } from '@/components/UploadBottomSheet';

const EMPLOYEES: { name: string; role: string; status: any; badgeCount: number; image?: string }[] = [
  { name: 'Chukwuemeka Obi', role: 'Senior Accountant', status: 'Frozen', badgeCount: 28, image: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Chukwuemeka Obi', role: 'Senior Accountant', status: 'Review', badgeCount: 52 },
  { name: 'Jasmine Albright', role: 'Project Manager', status: 'Review', badgeCount: 34 },
  { name: 'Tristan Reed', role: 'Finance officer', status: 'Clear', badgeCount: 28 },
  { name: 'Kamal Ahmed', role: 'Accountant', status: 'Clear', badgeCount: 45, image: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Mira Iyer', role: 'Revenue collector', status: 'Clear', badgeCount: 30, image: 'https://i.pravatar.cc/150?u=3' },
  { name: 'Jared Smith', role: 'Marketing Specialist', status: 'Pending', badgeCount: 25, image: 'https://i.pravatar.cc/150?u=4' },
  { name: 'Aisha Patel', role: 'Software Engineer', status: 'Approved', badgeCount: 28, image: 'https://i.pravatar.cc/150?u=5' },
];

const Employees = () => {
  const [activeFilter, setActiveFilter] = useState('All (58)');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  const filters = ['All (58)', 'Verified (47)', 'Pending (8)', 'Frozen (3)'];

  const handleUploadPress = () => {
    setIsUploadModalVisible(true);
    console.log("Clicked upload")
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employees</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search and Upload Section */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput 
              placeholder="Search employees.." 
              style={styles.searchInput}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUploadPress}
          >
            <Text style={styles.uploadText}>Upload</Text>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <FilterChip 
              key={filter}
              label={filter}
              isActive={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>

        {/* Employee List */}
        <View style={styles.listContainer}>
          {EMPLOYEES.map((employee, index) => (
            <EmployeeListItem 
              key={index}
              {...employee}
            />
          ))}
        </View>

        {/* Pagination Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerInfo}>Showing 8 of 58 employees</Text>
          <View style={styles.pagination}>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab bar padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      <UploadBottomSheet
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Employees;

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 4,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  filterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterContainer: {
    paddingRight: 20,
  },
  listContainer: {
    gap: 4,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 16,
  },
  footerInfo: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  pagination: {
    flexDirection: 'row',
    gap: 12,
  },
  paginationButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    backgroundColor: '#FFFFFF',
  },
  paginationText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
});
