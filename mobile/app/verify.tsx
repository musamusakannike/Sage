import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
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
    let timer: NodeJS.Timeout;
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

      {/* Camera Section */}
      <View style={styles.cameraSection}>
        {/* Step Indicator and Timer overlaying the top of camera section */}
        <View style={styles.cameraOverlayTop}>
          <View style={styles.stepContainer}>
            <View style={[styles.cornerTopLeft]} />
            <Text style={styles.stepText}>1 of 3</Text>
          </View>
          <View style={styles.timerContainer}>
            <View style={[styles.cornerTopRight]} />
            <Text style={styles.timerText}>0:{timeLeft.toString().padStart(2, '0')}</Text>
          </View>
        </View>

        <View style={styles.cameraWrapper}>
          <CameraView 
            style={styles.camera} 
            facing="front"
            animateShutter={false}
          >
            {/* The oval mask */}
            <View style={styles.maskContainer}>
              <View 
                style={[
                  styles.maskOval,
                  flowState === 'scanning-red' && { borderColor: Colors.red, borderStyle: 'dashed' },
                  flowState === 'scanning-teal' && { borderColor: Colors.teal, borderStyle: 'dashed' },
                  flowState === 'default' && { borderColor: 'rgba(200,200,200,0.5)', borderStyle: 'dashed' },
                ]} 
              />
            </View>
          </CameraView>
        </View>

        {/* Bottom corners overlay */}
        <View style={styles.cameraOverlayBottom}>
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>

        {/* Dynamic Instruction */}
        <View style={styles.instructionContainer}>
          {flowState === 'scanning-red' && (
            <Text style={[styles.instructionText, { color: Colors.red }]}>Your face should be within the frame</Text>
          )}
          {flowState === 'scanning-teal' && (
            <Text style={[styles.instructionText, { color: Colors.teal }]}>Blink twice</Text>
          )}
        </View>
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
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
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
    marginTop: 20,
    marginBottom: 24,
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.purpleLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_700Bold', // assuming this is available based on package.json
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 2,
  },
  challengeLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  challengeCard: {
    backgroundColor: Colors.blueLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blueBorder,
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  challengeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  challengeSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  cameraSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
  },
  cameraOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  cameraOverlayBottom: {
    position: 'absolute',
    bottom: 40, // leave space for instruction text
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  stepText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 10,
    marginTop: 10,
  },
  timerText: {
    fontSize: 16,
    color: '#8B4513', // Brownish color from image
    fontWeight: '700',
    marginRight: 10,
    marginTop: 10,
  },
  // Corner markers
  cornerTopLeft: {
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.teal,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.teal,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.teal,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.teal,
    borderBottomRightRadius: 8,
  },
  cameraWrapper: {
    width: width * 0.7,
    height: width * 0.9,
    borderRadius: 200, // Make it an oval
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  maskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskOval: {
    width: width * 0.65,
    height: width * 0.85,
    borderRadius: 200,
    borderWidth: 3,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    height: 30,
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    justifyContent: 'center',
  },
  recordButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.text, // Black border
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  recordButtonInnerActive: {
    backgroundColor: Colors.text, // Solid black inner when active or white depending on the interpretation, let's make it black
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  locationBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.yellowLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  locationIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: Colors.yellowDark,
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
