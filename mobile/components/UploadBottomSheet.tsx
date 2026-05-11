import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '@/constants';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

interface UploadBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const UploadBottomSheet = ({ visible, onClose }: UploadBottomSheetProps) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep('upload'), 300);
  };

  const handleImport = () => {
    setStep('success');
    setTimeout(() => {
      handleClose();
    }, 2000);
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
                <Text style={styles.successSubtitle}>56 employees have been added to your roster.</Text>
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
                    onPress={() => setStep('preview')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.folderIcon}>
                      <Text style={{ fontSize: 40 }}>📂</Text>
                    </View>
                    <Text style={styles.uploadTitle}>Choose a CSV file</Text>
                    <Text style={styles.uploadSubtitle}>Tap to browse your files</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.downloadTemplate}>
                    <Download size={18} color={Colors.primary} />
                    <Text style={styles.downloadText}>Download template CSV</Text>
                  </TouchableOpacity>

                  {step === 'preview' && (
                    <Animated.View entering={FadeIn} style={styles.previewContainer}>
                      <View style={styles.fileHeader}>
                        <View style={styles.fileIconBox}>
                          <FileText size={20} color="#4F46E5" />
                        </View>
                        <View>
                          <Text style={styles.fileName}>employees_may2026.csv</Text>
                          <Text style={styles.fileRows}>58 rows found</Text>
                        </View>
                      </View>

                      <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                          <Text style={[styles.columnLabel, { flex: 1.2 }]}>NAME</Text>
                          <Text style={[styles.columnLabel, { flex: 1.5 }]}>ROLE</Text>
                          <Text style={[styles.columnLabel, { flex: 1.5 }]}>ACCOUNT</Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={[styles.cellText, { flex: 1.2 }]}>C. Obi</Text>
                          <Text style={[styles.cellText, { flex: 1.5 }]}>Sr. Accountant</Text>
                          <Text style={[styles.cellText, { flex: 1.5 }]}>012••••7734</Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={[styles.cellText, { flex: 1.2 }]}>C. Obi</Text>
                          <Text style={[styles.cellText, { flex: 1.5 }]}>Budget Analyst</Text>
                          <Text style={[styles.cellText, { flex: 1.5 }]}>012••••7734</Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={[styles.cellText, { flex: 1.2 }]}>C. Obi</Text>
                          <Text style={[styles.cellText, { flex: 1.5 }]}>Finance Officer</Text>
                          <Text style={[styles.cellText, { flex: 1.5 }]}>012••••7734</Text>
                        </View>
                      </View>

                      <View style={styles.alertBox}>
                        <AlertCircle size={16} color="#B45309" />
                        <Text style={styles.alertText}>2 rows have missing data and will be skipped</Text>
                      </View>
                    </Animated.View>
                  )}

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={[styles.primaryButton, { backgroundColor: Colors.primary }]}
                      onPress={handleImport}
                    >
                      <Text style={styles.primaryButtonText}>Import 56 Employees</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={handleClose}
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
