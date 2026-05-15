import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus } from 'lucide-react-native';
import { Colors } from '@/constants';
import { EmployeeListItem } from '@/components/EmployeeListItem';
import { FilterChip } from '@/components/FilterChip';
import { UploadBottomSheet } from '@/components/UploadBottomSheet';
import { employeesApi } from '@/src/api/employees.api';
import { useToastStore } from '@/src/store/toast.store';
import type { Employee, ServerEmployeeStatus } from '@/src/types/employee.types';
import axios from 'axios';

const PAGE_LIMIT = 20;

type FilterKey = 'ALL' | 'CLEAR' | 'PENDING' | 'FROZEN';

interface FilterOption {
  key: FilterKey;
  label: string;
  status?: ServerEmployeeStatus;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'ALL', label: 'All' },
  { key: 'CLEAR', label: 'Verified', status: 'CLEAR' },
  { key: 'PENDING', label: 'Pending', status: 'PENDING' },
  { key: 'FROZEN', label: 'Frozen', status: 'FROZEN' },
];

const Employees = () => {
  const { show } = useToastStore();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchEmployees = useCallback(async (currentPage: number, currentSearch: string, currentFilter: FilterKey, isPullRefresh = false) => {
    if (isPullRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const filterOption = FILTER_OPTIONS.find((f) => f.key === currentFilter);
      const res = await employeesApi.list({
        page: currentPage,
        limit: PAGE_LIMIT,
        search: currentSearch || undefined,
        status: filterOption?.status,
      });
      const { data, total: t } = res.data.data;
      setEmployees(data);
      setTotal(t);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const displayMsg = Array.isArray(msg) ? msg[0] : (msg ?? 'Failed to load employees.');
        show({ type: 'error', title: 'Error', message: displayMsg });
      } else {
        show({ type: 'error', title: 'Network error', message: 'Unable to reach the server.' });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [show]);

  useEffect(() => {
    fetchEmployees(page, search, activeFilter);
  }, [page, activeFilter, fetchEmployees]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchEmployees(1, text, activeFilter);
    }, 400);
  };

  const handleFilterChange = (key: FilterKey) => {
    setActiveFilter(key);
    setPage(1);
  };

  const onRefresh = useCallback(() => {
    fetchEmployees(page, search, activeFilter, true);
  }, [fetchEmployees, page, search, activeFilter]);

  const filterLabel = (opt: FilterOption) => opt.label;

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employees</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Search and Upload Section */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput 
              placeholder="Search employees.." 
              style={styles.searchInput}
              placeholderTextColor={Colors.textSecondary}
              value={search}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => setIsUploadModalVisible(true)}
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
          {FILTER_OPTIONS.map((opt) => (
            <FilterChip 
              key={opt.key}
              label={filterLabel(opt)}
              isActive={activeFilter === opt.key}
              onPress={() => handleFilterChange(opt.key)}
            />
          ))}
        </ScrollView>

        {/* Employee List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : employees.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No employees found.</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
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

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <View style={styles.footer}>
            <Text style={styles.footerInfo}>
              Showing {Math.min(page * PAGE_LIMIT, total)} of {total} employees
            </Text>
            <View style={styles.pagination}>
              <TouchableOpacity 
                style={[styles.paginationButton, page === 1 && styles.paginationButtonDisabled]}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <Text style={[styles.paginationText, page === 1 && styles.paginationTextDisabled]}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.paginationButton, page >= totalPages && styles.paginationButtonDisabled]}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <Text style={[styles.paginationText, page >= totalPages && styles.paginationTextDisabled]}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tab bar padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      <UploadBottomSheet
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        onImportSuccess={() => {
          setPage(1);
          fetchEmployees(1, search, activeFilter);
        }}
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
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
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
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  paginationTextDisabled: {
    color: Colors.border,
  },
});
