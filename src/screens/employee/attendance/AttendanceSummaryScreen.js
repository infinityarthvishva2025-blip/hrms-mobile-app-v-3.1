import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../../constants/theme';
import AttendanceService from '../../../services/AttendanceService';
import { useAuth } from '../../../context/AuthContext';
import DatePickerInput from '../../../components/common/DatePickerInput';
import StatusBadge from '../../../components/common/StatusBadge';
import GradientButton from '../../../components/common/GradientButton';
import AttendanceTable from '../../../components/common/AttendanceTable';

const AttendanceSummaryScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    // State
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30))); // Default 30 days back
    const [toDate, setToDate] = useState(new Date());

    useEffect(() => {
        fetchAttendanceSummary();
    }, []);

    const fetchAttendanceSummary = async () => {
        setLoading(true);
        try {
            // Format dates as YYYY-MM-DD for API
            const formattedFrom = fromDate.toISOString().split('T')[0];
            const formattedTo = toDate.toISOString().split('T')[0];

            const data = await AttendanceService.getMySummary({
                fromDate: formattedFrom,
                toDate: formattedTo
            });

            if (data && data.records) {
                setAttendanceData(data.records);
            } else {
                setAttendanceData([]);
            }
        } catch (error) {
            console.error('Fetch summary error:', error);
            Alert.alert('Error', 'Failed to fetch attendance summary');
        } finally {
            setLoading(false);
        }
    };

    const handleCorrectionRequest = (record) => {
        navigation.navigate('Regularization', {
            attendanceRecord: record
        });
    };

    return (
        <View style={styles.container}>
            <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>
                    Attendance Summary — {user?.name?.toUpperCase()} ({user?.employeeCode || user?.emp_code})
                </Text>
            </View>

            <View style={styles.filterContainer}>
                <View style={styles.dateInputWrapper}>
                    <Text style={styles.label}>From Date</Text>
                    <DatePickerInput
                        date={fromDate}
                        onDateChange={setFromDate}
                        maxDate={new Date()}
                    />
                </View>
                <View style={styles.dateInputWrapper}>
                    <Text style={styles.label}>To Date</Text>
                    <DatePickerInput
                        date={toDate}
                        onDateChange={setToDate}
                        maxDate={new Date()}
                    />
                </View>
                <View style={styles.filterBtnWrapper}>
                    <GradientButton
                        title="Filter"
                        onPress={fetchAttendanceSummary}
                        icon={<Ionicons name="filter" size={16} color="#FFF" />}
                        style={{ height: 48, marginTop: 22 }}
                    />
                </View>
            </View>

            <View style={styles.mainContent}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <AttendanceTable
                        data={attendanceData}
                        onRequestCorrection={handleCorrectionRequest}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    headerTitle: {
        ...theme.typography.h5,
        color: theme.colors.primary,
        textAlign: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: theme.colors.surface,
        gap: 12,
        alignItems: 'flex-start',
    },
    dateInputWrapper: {
        flex: 1,
    },
    filterBtnWrapper: {
        flex: 0.8,
        justifyContent: 'flex-end',
    },
    label: {
        ...theme.typography.label,
        marginBottom: 8,
    },
    mainContent: {
        flex: 1,
        padding: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AttendanceSummaryScreen;
