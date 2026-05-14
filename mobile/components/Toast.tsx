import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { ToastItem, ToastType } from '@/src/store/toast.store';

const TOAST_CONFIG: Record<
  ToastType,
  { icon: React.ComponentProps<typeof Ionicons>['name']; accent: string; bg: string; iconBg: string }
> = {
  success: {
    icon: 'checkmark-circle',
    accent: '#3A6E57',
    bg: '#FFFFFF',
    iconBg: '#E6F4F0',
  },
  error: {
    icon: 'close-circle',
    accent: '#D43A3A',
    bg: '#FFFFFF',
    iconBg: '#FDECEC',
  },
  info: {
    icon: 'information-circle',
    accent: '#2563EB',
    bg: '#FFFFFF',
    iconBg: '#EFF6FF',
  },
  warning: {
    icon: 'warning',
    accent: '#D47A3A',
    bg: '#FFFFFF',
    iconBg: '#FFF7E6',
  },
};

const DEFAULT_DURATION = 3800;

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const config = TOAST_CONFIG[toast.type];
  const duration = toast.duration ?? DEFAULT_DURATION;

  const translateY = useSharedValue(-90);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const progressWidth = useSharedValue(1);

  const handleDismiss = useCallback(() => {
    onDismiss(toast.id);
  }, [toast.id, onDismiss]);

  const animateOut = useCallback(() => {
    opacity.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.quad) });
    scale.value = withTiming(0.92, { duration: 220 });
    translateY.value = withTiming(
      -90,
      { duration: 240, easing: Easing.in(Easing.quad) },
      (finished) => {
        'worklet';
        if (finished) runOnJS(handleDismiss)();
      },
    );
  }, [handleDismiss, opacity, scale, translateY]);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 260, mass: 0.8 });
    opacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
    scale.value = withSpring(1, { damping: 20, stiffness: 260 });
    progressWidth.value = withTiming(0, {
      duration,
      easing: Easing.linear,
    });

    const timer = setTimeout(() => {
      animateOut();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.card, { backgroundColor: config.bg, borderLeftColor: config.accent }]}>
        <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
          <Ionicons name={config.icon} size={20} color={config.accent} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {toast.title}
          </Text>
          {toast.message ? (
            <Text style={styles.message} numberOfLines={2}>
              {toast.message}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={animateOut}
          hitSlop={10}
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="close" size={14} color="#9E9E9E" />
        </Pressable>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: `${config.accent}20` }]}>
        <Animated.View style={[styles.progressBar, { backgroundColor: config.accent }, progressStyle]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderLeftWidth: 4,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1A1A1A',
    lineHeight: 18,
  },
  message: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666666',
    lineHeight: 17,
  },
  closeBtn: {
    padding: 4,
    flexShrink: 0,
  },
  progressTrack: {
    height: 3,
  },
  progressBar: {
    height: 3,
  },
});
