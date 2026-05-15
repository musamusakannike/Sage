import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Landmark, MapPin, CheckCircle2, XCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Assuming Colors are available or inline them based on the images
const Colors = {
  text: '#1A1A1A',
  textSecondary: '#666666',
  primary: '#3A6E57', // From existing Colors.ts
  background: '#FFFFFF',
  purpleLight: '#F0EFFF',
  purpleDark: '#5E4B8B', // Approximation from the image
  blueLight: '#F0F5FF',
  blueBorder: '#3B82F6', // Approximation
  red: '#D43A3A',
  teal: '#0D9488',
  yellowLight: '#FEF9C3',
  yellowDark: '#854D0E',
};

type FlowState = 'default' | 'scanning-red' | 'scanning-teal' | 'success' | 'fail';

export default function VerifyScreen() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [flowState, setFlowState] = useState<FlowState>('default');
  const [timeLeft, setTimeLeft] = useState(18);

  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
    if (!locationPermission?.granted) {
      requestLocationPermission();
    }
  }, [cameraPermission, locationPermission]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (flowState === 'scanning-red' || flowState === 'scanning-teal') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Randomly fail or succeed at the end of the timer for demo purposes
            // but let's just do it sequentially in the dummy flow instead of timer-based ending.
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [flowState]);

  const startFlow = () => {
    setFlowState('scanning-red');
    setTimeout(() => {
      setFlowState('scanning-teal');
      setTimeout(() => {
        // Success for demo
        setFlowState('success');
      }, 3000);
    }, 3000);
  };

  const resetFlow = () => {
    setFlowState('default');
    setTimeLeft(18);
  };

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (flowState === 'success') {
    return (
      <SafeAreaView style={styles.resultContainer}>
        <CheckCircle2 size={80} color={Colors.primary} />
        <Text style={styles.resultTitle}>Verification Successful</Text>
        <Text style={styles.resultDesc}>Your liveness check was completed successfully.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (flowState === 'fail') {
    return (
      <SafeAreaView style={styles.resultContainer}>
        <XCircle size={80} color={Colors.red} />
        <Text style={styles.resultTitle}>Verification Failed</Text>
        <Text style={styles.resultDesc}>We couldn't verify your liveness. Please try again.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={resetFlow}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Landmark size={24} color={Colors.purpleDark} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Lagos State Government</Text>
          <Text style={styles.headerSubtitle}>Ministry of Finance · Payroll Verification</Text>
        </View>
      </View>

      <Text style={styles.challengeLabel}>Your challenge for this session</Text>

      {/* Challenge Card */}
      <View style={styles.challengeCard}>
        <Text style={styles.challengeText}>Blink twice, then tilt your head to the right</Text>
        <Text style={styles.challengeSubtext}>
          Challenge generated live · Server-verified · Cannot be replayed
        </Text>
      </View>

      {/* Camera/Face Section */}
      <View style={styles.cameraSection}>
        {/* Step Indicator and Timer overlaying the top of camera section */}
        <View style={styles.cameraOverlayTop}>
          <View style={styles.stepContainer}>
            <View style={[styles.cornerTopLeft]} />
            <Text style={styles.stepText}>1 of 3</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>0:{timeLeft.toString().padStart(2, '0')}</Text>
            <View style={[styles.cornerTopRight]} />
          </View>
        </View>

        <View style={styles.faceContainer}>
          {flowState === 'default' ? (
            // Show face silhouette when not scanning
            <View style={styles.silhouetteWrapper}>
              <Image 
                source={require('../assets/images/face-silhouette.png')}
                style={styles.silhouetteImage}
                resizeMode="contain"
              />
              <View style={styles.dashedOval} />
            </View>
          ) : (
            // Show camera when scanning
            <CameraView 
              style={styles.camera} 
              facing="front"
              animateShutter={false}
            >
              <View 
                style={[
                  styles.dashedOval,
                  flowState === 'scanning-red' && { borderColor: Colors.red },
                  flowState === 'scanning-teal' && { borderColor: Colors.teal },
                ]} 
              />
            </CameraView>
          )}
        </View>

        {/* Bottom corners overlay */}
        <View style={styles.cameraOverlayBottom}>
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </View>

      {/* Dynamic Instruction */}
      <View style={styles.instructionContainer}>
        {flowState === 'scanning-red' && (
          <Text style={[styles.instructionText, { color: Colors.red }]}>Your face should be within the frame</Text>
        )}
        {flowState === 'scanning-teal' && (
          <Text style={[styles.instructionText, { color: '#D97706' }]}>Blink twice</Text>
        )}
      </View>

      {/* Record Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.recordButtonOuter} 
          onPress={flowState === 'default' ? startFlow : undefined}
          activeOpacity={0.8}
        >
          <View style={[
            styles.recordButtonInner, 
            (flowState !== 'default') && styles.recordButtonInnerActive
          ]} />
        </TouchableOpacity>
      </View>

      {/* Location Banner */}
      <View style={styles.locationBanner}>
        <MapPin size={16} color={Colors.yellowDark} style={styles.locationIcon} />
        <Text style={styles.locationText}>
          Location access improves your fraud score. We only capture your city not your exact address.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: Colors.text,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  logoContainer: {
    width: 52,
    height: 52,
    backgroundColor: Colors.purpleLight,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 4,
  },
  challengeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  challengeCard: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 18,
    borderRadius: 10,
    marginBottom: 24,
  },
  challengeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 22,
  },
  challengeSubtext: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  cameraSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    marginBottom: 16,
  },
  cameraOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    paddingHorizontal: 4,
  },
  cameraOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    paddingHorizontal: 4,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  timerText: {
    fontSize: 16,
    color: '#D97706',
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  // Corner markers
  cornerTopLeft: {
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.teal,
    borderTopLeftRadius: 4,
  },
  cornerTopRight: {
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.teal,
    borderTopRightRadius: 4,
  },
  cornerBottomLeft: {
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.teal,
    borderBottomLeftRadius: 4,
  },
  cornerBottomRight: {
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.teal,
    borderBottomRightRadius: 4,
  },
  faceContainer: {
    width: width - 80,
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
  },
  silhouetteWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  silhouetteImage: {
    width: 200,
    height: 280,
    position: 'absolute',
    zIndex: 1,
  },
  dashedOval: {
    position: 'absolute',
    width: 220,
    height: 320,
    borderRadius: 160,
    borderWidth: 3,
    borderColor: 'rgba(200,200,200,0.6)',
    borderStyle: 'dashed',
  },
  camera: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    alignItems: 'center',
    width: '100%',
    minHeight: 30,
    justifyContent: 'center',
    marginTop: 8,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  recordButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'transparent',
  },
  recordButtonInnerActive: {
    backgroundColor: '#FFFFFF',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  locationBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF9C3',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  locationIcon: {
    marginTop: 1,
    marginRight: 10,
    flexShrink: 0,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  resultDesc: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.blueLight,
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
