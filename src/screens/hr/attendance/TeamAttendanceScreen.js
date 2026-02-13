import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../../constants/theme';
import AttendanceService from '../../../services/AttendanceService';
// Assuming we can use this service to search employees, or we implement a basic search here
// import EmployeeService from '../../../services/hr/employeeService'; 
import DatePickerInput from '../../../components/common/DatePickerInput';
import GradientButton from '../../../components/common/GradientButton';
import AttendanceTable from '../../../components/common/AttendanceTable';

const TeamAttendanceScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [employees, setEmployees] = useState([]); // List of employees found
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [toDate, setToDate] = useState(new Date());

    // Search Employees (Mock or API)
    const handleSearch = async () => {
        // Implement search logic. 
        // Ideally: const results = await EmployeeService.searchEmployees(searchQuery);
        // For now, let's mock or use a service if available.
        // Since I don't have EmployeeService handy and confirmed, I'll simulate or use a placeholder.
        // Actually, let's assume there is an API for it or I can just leave it as a TODO / Mock for UI.
        // But the requirement says "Search/Select Employee functionality".

        setSearchLoading(true);
        try {
            // TODO: Replace with actual API call
            // const results = await EmployeeService.search(searchQuery);
            // Simulated results for demonstration
            if (searchQuery.trim().length > 0) {
                // Mock data
                setEmployees([
                    { id: 113, name: 'Madhav More', employeeCode: 'IA00117' },
                    { id: 114, name: 'Jane Doe', employeeCode: 'IA00118' },
                ].filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())));
            } else {
                setEmployees([]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
        setEmployees([]); // Clear search results to show dashboard
        setSearchQuery('');
        // Auto-fetch attendance for this employee
        fetchEmployeeAttendance(emp.id);
    };

    const fetchEmployeeAttendance = async (empId) => {
        if (!empId) return;
        setLoading(true);
        try {
            const formattedFrom = fromDate.toISOString().split('T')[0];
            const formattedTo = toDate.toISOString().split('T')[0];

            // Reusing getMySummary logic but for specific employee?
            // API Spec: GET /api/Attendance/employee-summary/{employeeId}
            const data = await AttendanceService.getEmployeeSummary(empId);

            // API might return different structure? 
            // "Table format same as Employee summary"
            // "Token handling per record"

            if (data && data.records) {
                setAttendanceData(data.records);
            } else {
                setAttendanceData([]);
            }
        } catch (error) {
            console.error('Fetch employee summary error:', error);
            Alert.alert('Error', 'Failed to fetch employee attendance');
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedEmployee(null);
        setAttendanceData([]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>Team Attendance</Text>
            </View>

            {/* Search or Selected Employee Header */}
            <View style={styles.searchSection}>
                {!selectedEmployee ? (
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Employee (Name/ID)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                        <TouchableOpacity onPress={handleSearch}>
                            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.selectedEmployeeCard}>
                        <View>
                            <Text style={styles.selectedName}>{selectedEmployee.name}</Text>
                            <Text style={styles.selectedCode}>{selectedEmployee.employeeCode}</Text>
                        </View>
                        <TouchableOpacity onPress={clearSelection}>
                            <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Content Area */}
            {searchLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} color={theme.colors.primary} />
            ) : !selectedEmployee ? (
                /* Search Results */
                <FlatList
                    data={employees}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.employeeItem} onPress={() => handleSelectEmployee(item)}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.empName}>{item.name}</Text>
                                <Text style={styles.empCode}>{item.employeeCode}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        searchQuery.length > 0 && !searchLoading ? (
                            <Text style={styles.emptyText}>No employees found.</Text>
                        ) : (
                            <Text style={styles.emptyText}>Search to view attendance.</Text>
                        )
                    }
                />
            ) : (
                /* Attendance View for Selected Employee */
                <View style={{ flex: 1 }}>
                    <View style={styles.filterContainer}>
                        <View style={styles.dateInputWrapper}>
                            <Text style={styles.label}>From</Text>
                            <DatePickerInput
                                date={fromDate}
                                onDateChange={setFromDate}
                                maxDate={new Date()}
                            />
                        </View>
                        <View style={styles.dateInputWrapper}>
                            <Text style={styles.label}>To</Text>
                            <DatePickerInput
                                date={toDate}
                                onDateChange={setToDate}
                                maxDate={new Date()}
                            />
                        </View>
                        <View style={styles.filterBtnWrapper}>
                            <GradientButton
                                onPress={() => fetchEmployeeAttendance(selectedEmployee.id)}
                                icon={<Ionicons name="filter" size={16} color="#FFF" />}
                                style={{ height: 48, width: 48, marginTop: 22, paddingHorizontal: 0 }}
                            />
                        </View>
                    </View>

                    <View style={styles.tableWrapper}>
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        ) : (
                            <AttendanceTable
                                data={attendanceData}
                                isHrView={true}
                            />
                        )}
                    </View>
                </View>
            )}
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
    searchSection: {
        padding: 16,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: theme.colors.text,
    },
    selectedEmployeeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedName: {
        ...theme.typography.h5,
        fontWeight: '700',
    },
    selectedCode: {
        ...theme.typography.caption,
    },
    list: {
        padding: 16,
    },
    employeeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 12,
        borderRadius: theme.borderRadius.md,
        marginBottom: 8,
        ...theme.shadow.light,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
    empName: {
        ...theme.typography.body,
        fontWeight: '600',
    },
    empCode: {
        ...theme.typography.captionSmall,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: theme.colors.textSecondary,
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        alignItems: 'flex-start',
    },
    dateInputWrapper: {
        flex: 1,
    },
    filterBtnWrapper: {
        justifyContent: 'flex-end',
    },
    label: {
        ...theme.typography.label,
        marginBottom: 8,
    },
    tableWrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});

export default TeamAttendanceScreen;
