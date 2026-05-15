import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '@/constants';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { employeesApi } from '@/src/api/employees.api';
import { useToastStore } from '@/src/store/toast.store';
import axios from 'axios';

interface UploadBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
}

interface PreviewRow {
  Name?: string;
  Role?: string;
  'Account Number'?: string;
  [key: string]: string | undefined;
}

export const UploadBottomSheet = ({ visible, onClose, onImportSuccess }: UploadBottomSheetProps) => {
  const { show } = useToastStore();
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('upload');
      setPickedFile(null);
      setPreviewRows([]);
      setTotalRows(0);
      setImportResult(null);
    }, 300);
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/csv', '*/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const content = await FileSystem.readAsStringAsync(asset.uri);
      const parsed = Papa.parse<PreviewRow>(content, { header: true, skipEmptyLines: true });

      setPickedFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? 'text/csv' });
      setPreviewRows(parsed.data.slice(0, 3));
      setTotalRows(parsed.data.length);
      setStep('preview');
    } catch {
      show({ type: 'error', title: 'File error', message: 'Could not read the selected file.' });
    }
  };

  const handleImport = async () => {
    if (!pickedFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', { uri: pickedFile.uri, name: pickedFile.name, type: pickedFile.mimeType } as any);
      const res = await employeesApi.importCsv(formData);
      const result = res.data.data;
      setImportResult(result);
      setStep('success');
      onImportSuccess?.();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const displayMsg = Array.isArray(msg) ? msg[0] : (msg ?? 'Import failed. Please try again.');
        show({ type: 'error', title: 'Import failed', message: displayMsg });
      } else {
        show({ type: 'error', title: 'Network error', message: 'Unable to reach the server.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const maskAccount = (account?: string) => {
    if (!account || account.length < 4) return '••••';
    return `${account.slice(0, 3)}••••${account.slice(-4)}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.handle} />
          <View style={styles.content}>
            {step === 'success' ? (
              <Animated.View 
                entering={ZoomIn} 
                exiting={FadeOut}
                style={styles.successContainer}
              >
                <CheckCircle2 size={80} color={Colors.primary} />
                <Text style={styles.successTitle}>Import Successful</Text>
                <Text style={styles.successSubtitle}>
                  {importResult
                    ? `${importResult.imported} employees added${importResult.skipped > 0 ? `, ${importResult.skipped} skipped` : ''}.`
                    : 'Employees have been added to your roster.'}
                </Text>
              </Animated.View>
            ) : (
              <View style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.title}>Upload Employee Roster</Text>
                  <Text style={styles.subtitle}>
                    CSV format required · Columns: Name, Role, Account Number, Phone Number
                  </Text>

                  <TouchableOpacity 
                    style={styles.uploadArea} 
                    onPress={handlePickFile}
                    activeOpacity={0.7}
                  >
                    <View style={styles.folderIcon}>
                      <Text style={{ fontSize: 40 }}>📂</Text>
                    </View>
                    <Text style={styles.uploadTitle}>
                      {pickedFile ? pickedFile.name : 'Choose a CSV file'}
                    </Text>
                    <Text style={styles.uploadSubtitle}>
                      {pickedFile ? `${totalRows} rows found` : 'Tap to browse your files'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.downloadTemplate}>
                    <Download size={18} color={Colors.primary} />
                    <Text style={styles.downloadText}>Download template CSV</Text>
                  </TouchableOpacity>

                  {step === 'preview' && previewRows.length > 0 && (
                    <Animated.View entering={FadeIn} style={styles.previewContainer}>
                      <View style={styles.fileHeader}>
                        <View style={styles.fileIconBox}>
                          <FileText size={20} color="#4F46E5" />
                        </View>
                        <View>
                          <Text style={styles.fileName}>{pickedFile?.name}</Text>
                          <Text style={styles.fileRows}>{totalRows} rows found</Text>
                        </View>
                      </View>

                      <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                          <Text style={[styles.columnLabel, { flex: 1.2 }]}>NAME</Text>
                          <Text style={[styles.columnLabel, { flex: 1.5 }]}>ROLE</Text>
                          <Text style={[styles.columnLabel, { flex: 1.5 }]}>ACCOUNT</Text>
                        </View>
                        {previewRows.map((row, i) => (
                          <View key={i} style={styles.tableRow}>
                            <Text style={[styles.cellText, { flex: 1.2 }]} numberOfLines={1}>
                              {row['Name']?.split(' ').map((n) => n[0]).join('. ') ?? '—'}
                            </Text>
                            <Text style={[styles.cellText, { flex: 1.5 }]} numberOfLines={1}>
                              {row['Role'] ?? '—'}
                            </Text>
                            <Text style={[styles.cellText, { flex: 1.5 }]} numberOfLines={1}>
                              {maskAccount(row['Account Number'])}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {totalRows > 3 && (
                        <View style={styles.alertBox}>
                          <AlertCircle size={16} color="#B45309" />
                          <Text style={styles.alertText}>
                            Showing 3 of {totalRows} rows. Duplicates will be skipped automatically.
                          </Text>
                        </View>
                      )}
                    </Animated.View>
                  )}

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={[styles.primaryButton, { backgroundColor: Colors.primary, opacity: isLoading ? 0.8 : 1 }]}
                      onPress={step === 'upload' ? handlePickFile : handleImport}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.primaryButtonText}>
                          {step === 'preview' ? `Import ${totalRows} Employees` : 'Choose File'}
                        </Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={handleClose}
                      disabled={isLoading}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    minHeight: '65%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E1E1E1',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  uploadArea: {
    width: '100%',
    height: 160,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  folderIcon: {
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  downloadTemplate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  downloadText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
  previewContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  fileIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  fileRows: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  columnLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cellText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  alertText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#92400E',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  buttonContainer: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 28,
  },
  primaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  cancelButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E6F4F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
