import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
  AppState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../../constants/theme';
import AttendanceService, {
  STORAGE_KEYS,
  getUserStorageKey,
} from '../../../services/AttendanceService';
import { useAuth } from '../../../context/AuthContext';

// ---------- Constants ----------
const SHIFT_DURATION_MON_FRI = 8.5 * 3600; // 30600 seconds
const SHIFT_DURATION_SAT = 7 * 3600;       // 25200 seconds

// ---------- Pure Helper ----------
const getShiftDurationInSeconds = () => {
  const today = new Date().getDay();
  if (today === 6) return SHIFT_DURATION_SAT;
  return SHIFT_DURATION_MON_FRI;
};

// ---------- Main Component ----------
const MarkAttendanceScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // ----- States -----
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('NOT_CHECKED_IN');
  const [checkInTimestamp, setCheckInTimestamp] = useState(null);
  const [shiftEndTimestamp, setShiftEndTimestamp] = useState(null);
  const [checkInTimeDisplay, setCheckInTimeDisplay] = useState(null);
  const [checkOutTimeDisplay, setCheckOutTimeDisplay] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // ----- Refs -----
  const timerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // ----- User‑scoped persistence helpers -----
  const getUserKeys = () => {
    if (!user?.id) return null;
    return {
      checkIn: getUserStorageKey(STORAGE_KEYS.CHECK_IN_TIMESTAMP, user.id),
      shiftEnd: getUserStorageKey(STORAGE_KEYS.SHIFT_END_TIMESTAMP, user.id),
      duration: getUserStorageKey(STORAGE_KEYS.SHIFT_DURATION, user.id),
    };
  };

  const persistCheckInData = async (checkIn, shiftEnd, duration) => {
    const keys = getUserKeys();
    if (!keys) return;
    try {
      await AsyncStorage.multiSet([
        [keys.checkIn, String(checkIn)],
        [keys.shiftEnd, String(shiftEnd)],
        [keys.duration, String(duration)],
      ]);
    } catch (error) {
      console.log('Failed to persist check-in data', error);
    }
  };

  const clearPersistedCheckInData = async () => {
    const keys = getUserKeys();
    if (!keys) return;
    try {
      await AsyncStorage.multiRemove([keys.checkIn, keys.shiftEnd, keys.duration]);
    } catch (error) {
      console.log('Failed to clear persisted data', error);
    }
  };

  const loadPersistedCheckInData = async () => {
    const keys = getUserKeys();
    if (!keys) return false;
    try {
      const [checkInStr, shiftEndStr, durationStr] = await AsyncStorage.multiGet([
        keys.checkIn,
        keys.shiftEnd,
        keys.duration,
      ]);
      if (checkInStr[1] && shiftEndStr[1] && durationStr[1]) {
        const checkIn = parseInt(checkInStr[1], 10);
        const shiftEnd = parseInt(shiftEndStr[1], 10);
        if (shiftEnd > Date.now()) {
          setCheckInTimestamp(checkIn);
          setShiftEndTimestamp(shiftEnd);
          setAttendanceStatus('CHECKED_IN');
          setCheckInTimeDisplay(formatTimeFromTimestamp(checkIn));
          return true;
        } else {
          await clearPersistedCheckInData();
        }
      }
    } catch (error) {
      console.log('Failed to load persisted check-in data', error);
    }
    return false;
  };

  // ----- Helper: Format timestamp to HH:mm -----
  const formatTimeFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ----- Format remaining seconds to HH:MM:SS -----
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----- Reset local state for user switch / logout -----
  const resetAttendanceState = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setAttendanceStatus('NOT_CHECKED_IN');
    setCheckInTimestamp(null);
    setShiftEndTimestamp(null);
    setCheckInTimeDisplay(null);
    setCheckOutTimeDisplay(null);
    setRemainingSeconds(0);
  };

  // ----- Check current status from API + persistence -----
  const checkCurrentStatus = async () => {
    if (!user?.id) return;
    try {
      // 1. Try to restore from AsyncStorage (user‑scoped)
      await loadPersistedCheckInData();

      // 2. Verify with API (always authoritative)
      const today = new Date().toISOString().split('T')[0];
      const summary = await AttendanceService.getMySummary({
        fromDate: today,
        toDate: today,
      });

      if (summary?.records?.length > 0) {
        const record = summary.records[0];
        if (record.inTime && !record.outTime) {
          const inTimeMs = new Date(record.inTime).getTime();
          if (!isNaN(inTimeMs)) {
            // If local state differs from API, use API data
            if (!checkInTimestamp || checkInTimestamp !== inTimeMs) {
              const shiftDuration = getShiftDurationInSeconds();
              const shiftEnd = inTimeMs + shiftDuration * 1000;
              setCheckInTimestamp(inTimeMs);
              setShiftEndTimestamp(shiftEnd);
              setCheckInTimeDisplay(formatTimeFromTimestamp(inTimeMs));
              setAttendanceStatus('CHECKED_IN');
              await persistCheckInData(inTimeMs, shiftEnd, shiftDuration);
            }
          }
        } else if (record.inTime && record.outTime) {
          setAttendanceStatus('CHECKED_OUT');
          setCheckInTimeDisplay(formatTimeFromTimestamp(new Date(record.inTime).getTime()));
          setCheckOutTimeDisplay(formatTimeFromTimestamp(new Date(record.outTime).getTime()));
          await clearPersistedCheckInData();
        }
      }
    } catch (error) {
      console.log('Error checking status', error);
    }
  };

  // ----- React to user changes -----
  useEffect(() => {
    resetAttendanceState();
    if (user?.id) {
      checkCurrentStatus();
    }
  }, [user?.id]); // Re‑run when user logs in, logs out, or switches

  // ----- Timer Effect -----
  useEffect(() => {
    if (attendanceStatus === 'CHECKED_IN' && shiftEndTimestamp) {
      if (timerRef.current) clearInterval(timerRef.current);

      const updateRemaining = () => {
        const now = Date.now();
        const remainingMs = shiftEndTimestamp - now;
        if (remainingMs <= 0) {
          setRemainingSeconds(0);
          clearInterval(timerRef.current);
          timerRef.current = null;
        } else {
          setRemainingSeconds(Math.floor(remainingMs / 1000));
        }
      };

      updateRemaining();
      timerRef.current = setInterval(updateRemaining, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [attendanceStatus, shiftEndTimestamp]);

  // ----- Location Permission & Fetch -----
  const requestLocationPermission = async () => {
    try {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to mark attendance.');
        setLocationLoading(false);
        return null;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCurrentLocation(location);
      setLocationLoading(false);
      return location;
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location. Please try again.');
      setLocationLoading(false);
      return null;
    }
  };

  // ----- Handle Check-In -----
  const handleCheckIn = async () => {
    const location = await requestLocationPermission();
    if (!location) return;

    setLoading(true);
    try {
      const response = await AttendanceService.geoCheckIn({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      if (response.success) {
        const now = Date.now();
        const shiftDuration = getShiftDurationInSeconds();
        const shiftEnd = now + shiftDuration * 1000;

        setCheckInTimestamp(now);
        setShiftEndTimestamp(shiftEnd);
        setCheckInTimeDisplay(formatTimeFromTimestamp(now));
        setAttendanceStatus('CHECKED_IN');
        setRemainingSeconds(shiftDuration);
        await persistCheckInData(now, shiftEnd, shiftDuration);

        Alert.alert('Success', 'Checked In Successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  // ----- Handle Check-Out -----
  const handleCheckOut = async () => {
    const location = await requestLocationPermission();
    if (!location) return;

    Alert.alert(
      'Confirm Check-Out',
      'Are you sure you want to check out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await AttendanceService.geoCheckOut({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
              });

              const now = Date.now();
              setCheckOutTimeDisplay(formatTimeFromTimestamp(now));
              setAttendanceStatus('CHECKED_OUT');
              setShiftEndTimestamp(null);
              await clearPersistedCheckInData();

              Alert.alert('Success', 'Checked Out Successfully!');
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Check-out failed');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // ----- UI Helpers -----
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getShiftLabel = () => {
    const today = new Date().getDay();
    return today === 6 ? '7-Hour Shift' : '8-Hour 30-Minute Shift';
  };

  // ----- Render (unchanged) -----
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={[styles.headerBg, { height: insets.top + 60 }]}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Attendance Panel</Text>
        <Text style={styles.subtitle}>Track your work hours & check-in / check-out status</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={24} color={theme.colors.white} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Attendance Panel</Text>
              <Text style={styles.cardSubtitle}>Track your work hours & check-in / check-out status</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {checkInTimeDisplay ? (
            <View style={styles.statusRow}>
              <Ionicons name="log-in-outline" size={20} color={theme.colors.success} />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>CHECK-IN TIME</Text>
                <Text style={styles.statusValue}>{getCurrentDate()}, {checkInTimeDisplay}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <Ionicons name="log-in-outline" size={20} color={theme.colors.textTertiary} />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>CHECK-IN TIME</Text>
                <Text style={styles.statusValue}>Not Checked In</Text>
              </View>
            </View>
          )}

          {checkOutTimeDisplay && (
            <View style={[styles.statusRow, { marginTop: 16 }]}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>CHECK-OUT TIME</Text>
                <Text style={styles.statusValue}>{getCurrentDate()}, {checkOutTimeDisplay}</Text>
              </View>
            </View>
          )}

          {attendanceStatus === 'CHECKED_IN' && (
            <View style={styles.timerContainer}>
              <Ionicons name="hourglass-outline" size={18} color={theme.colors.warning} />
              <Text style={styles.timerLabel}>Time Remaining ({getShiftLabel()})</Text>
              <Text style={styles.timerValue}>{formatTime(remainingSeconds)}</Text>
            </View>
          )}

          <View style={styles.actionContainer}>
            {attendanceStatus === 'NOT_CHECKED_IN' && (
              <TouchableOpacity
                style={[styles.button, styles.checkInButton]}
                onPress={handleCheckIn}
                disabled={loading || locationLoading}
              >
                {loading || locationLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="location" size={18} color="#FFF" />
                    <Text style={styles.buttonText}>Geo Check In</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {attendanceStatus === 'CHECKED_IN' && (
              <TouchableOpacity
                style={[styles.button, styles.checkOutButton]}
                onPress={handleCheckOut}
                disabled={loading || locationLoading}
              >
                {loading || locationLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="location" size={18} color="#FFF" />
                    <Text style={styles.buttonText}>Geo Check Out</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {attendanceStatus === 'CHECKED_OUT' && (
              <View style={styles.completedContainer}>
                <Text style={styles.completedText}>Attendance Marked for Today</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ----- Styles (unchanged) -----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0 },
  content: { padding: 20 },
  title: { ...theme.typography.h2, marginBottom: 8 },
  subtitle: { ...theme.typography.bodySmall, marginBottom: 24 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.medium,
    marginTop: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTitle: { ...theme.typography.h4, fontWeight: '700' },
  cardSubtitle: { ...theme.typography.captionSmall, color: theme.colors.textSecondary },
  divider: { height: 1, backgroundColor: theme.colors.divider, marginVertical: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start' },
  statusInfo: { marginLeft: 12 },
  statusLabel: { ...theme.typography.label, color: theme.colors.success, marginBottom: 4 },
  statusValue: { ...theme.typography.body, fontWeight: '600' },
  timerContainer: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  timerLabel: { ...theme.typography.bodySmall, marginTop: 8, marginBottom: 4 },
  timerValue: { fontSize: 36, fontWeight: '800', color: theme.colors.error, letterSpacing: 2 },
  actionContainer: { marginTop: 16 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.full || 30,
    gap: 8,
  },
  checkInButton: { backgroundColor: theme.colors.success },
  checkOutButton: { backgroundColor: theme.colors.error },
  buttonText: { ...theme.typography.button, fontSize: 16, fontWeight: '700' },
  completedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.borderRadius.md,
  },
  completedText: { ...theme.typography.body, color: theme.colors.success, fontWeight: '600' },
});

export default MarkAttendanceScreen;