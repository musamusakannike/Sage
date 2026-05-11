import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, X, Check } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants';

const { width } = Dimensions.get('window');

const ScoreRow = ({ label, score, total, color, status }: any) => (
  <View style={styles.scoreRow}>
    <Text style={styles.scoreLabel}>{label}</Text>
    <View style={styles.scoreValueContainer}>
      <Text style={[styles.scoreValue, { color }]}>{score} / {total}</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${(score/total)*100}%`, backgroundColor: color }]} />
      </View>
      {status === 'success' ? (
        <Check size={16} color="#3A6E57" />
      ) : (
        <X size={16} color="#D43A3A" />
      )}
    </View>
  </View>
);

const EmployeeDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=1' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>Chukwuemeka Obi</Text>
          <Text style={styles.role}>Senior Accountant · ID #LAG-00214</Text>
          <View style={[styles.statusBadge, { backgroundColor: Colors.status.frozen.bg }]}>
            <Text style={[styles.statusText, { color: Colors.status.frozen.text }]}>Frozen</Text>
          </View>
        </View>

        {/* Identity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity</Text>
          <View style={styles.identityRow}>
            <Text style={styles.identityLabel}>Account No.</Text>
            <Text style={styles.identityValue}>**** **** 7734</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.identityRow}>
            <Text style={styles.identityLabel}>Phone number</Text>
            <Text style={styles.identityValue}>080****2261</Text>
          </View>
        </View>

        {/* DNA Score Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>June 2026 - DNA Score</Text>
          <View style={styles.dnaScoreContainer}>
            <Text style={styles.dnaScoreValue}>28</Text>
            <View>
              <Text style={[styles.riskLevel, { color: Colors.risk.high }]}>HIGH RISK</Text>
              <Text style={styles.verificationTime}>Verified 15 May 2026, 07:43</Text>
              <Text style={styles.location}>Lagos, Nigeria</Text>
            </View>
          </View>

          <View style={styles.scoreList}>
            <ScoreRow label="Liveness Match" score={8} total={30} color="#D43A3A" />
            <ScoreRow label="Geolocation Cluster" score={0} total={20} color="#D43A3A" />
            <ScoreRow label="Device Fingerprint" score={10} total={20} color="#B45309" />
            <ScoreRow label="Check-in Time" score={10} total={15} color="#3A6E57" status="success" />
            <ScoreRow label="Post-pay velocity" score={0} total={15} color="#D43A3A" />
          </View>
        </View>

        {/* Verification History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification History</Text>
          <View style={styles.historyRow}>
            <Text style={styles.historyMonth}>May 2026</Text>
            <View style={styles.historyRight}>
              <View style={styles.smallScoreBadge}><Text style={styles.smallScoreText}>28</Text></View>
              <View style={[styles.miniStatusBadge, { backgroundColor: Colors.status.frozen.bg }]}><Text style={[styles.miniStatusText, { color: Colors.status.frozen.text }]}>Frozen</Text></View>
            </View>
          </View>
          <View style={styles.historyRow}>
            <Text style={styles.historyMonth}>Apr 2026</Text>
            <View style={styles.historyRight}>
              <View style={styles.smallScoreBadge}><Text style={styles.smallScoreText}>52</Text></View>
              <View style={[styles.miniStatusBadge, { backgroundColor: Colors.status.review.bg }]}><Text style={[styles.miniStatusText, { color: Colors.status.review.text }]}>Review</Text></View>
            </View>
          </View>
          <View style={styles.historyRow}>
            <Text style={styles.historyMonth}>Mar 2026</Text>
            <View style={styles.historyRight}>
              <View style={styles.smallScoreBadgeGreen}><Text style={styles.smallScoreTextGreen}>28</Text></View>
              <View style={[styles.miniStatusBadge, { backgroundColor: Colors.status.approved.bg }]}><Text style={[styles.miniStatusText, { color: Colors.status.approved.text }]}>Approved</Text></View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.hold.bg }]}>
            <Text style={[styles.actionButtonText, { color: Colors.hold.text }]}>Hold Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.freeze.bg }]}>
            <Text style={[styles.actionButtonText, { color: Colors.freeze.text }]}>Freeze Payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  identityLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  identityValue: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dnaScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  dnaScoreValue: {
    fontSize: 64,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#D43A3A',
  },
  riskLevel: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 2,
  },
  verificationTime: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  location: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  scoreList: {
    backgroundColor: '#FCFCFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  scoreLabel: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreValue: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    width: 50,
    textAlign: 'right',
  },
  progressBarBg: {
    width: 80,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyMonth: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallScoreBadge: {
    backgroundColor: '#FDECEC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  smallScoreText: {
    fontSize: 12,
    color: '#D43A3A',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  smallScoreBadgeGreen: {
    backgroundColor: '#E6F4F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  smallScoreTextGreen: {
    fontSize: 12,
    color: '#3A6E57',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  miniStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  miniStatusText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
