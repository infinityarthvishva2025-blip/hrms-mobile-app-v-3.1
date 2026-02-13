import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Employee Screens
import DashboardScreen from '../screens/employee/DashboardScreen';
import ProfileScreen from '../screens/employee/ProfileScreen';
import MoreMenuScreen from '../screens/employee/MoreMenuScreen';

// Attendance Stack Screens
import MarkAttendanceScreen from '../screens/employee/attendance/MarkAttendanceScreen';
import AttendanceSummaryScreen from '../screens/employee/attendance/AttendanceSummaryScreen';
import RegularizationScreen from '../screens/employee/attendance/RegularizationScreen';

// Leave Stack Screens
import ApplyLeaveScreen from '../screens/employee/leaves/ApplyLeaveScreen';
import MyLeavesScreen from '../screens/employee/leaves/MyLeavesScreen';
import HolidaysScreen from '../screens/employee/leaves/HolidaysScreen';
import LeaveBalanceScreen from '../screens/employee/leaves/LeaveBalanceScreen';

// Profile Stack Screens
import PayslipsScreen from '../screens/employee/profile/PayslipsScreen';
import DocumentsScreen from '../screens/employee/profile/DocumentsScreen';
import BenefitsScreen from '../screens/employee/profile/BenefitsScreen';

// More Stack Screens
import ResignationScreen from '../screens/employee/resignation/ResignationScreen';
import SettingsScreen from '../screens/employee/SettingsScreen';
import GurukulScreen from '../screens/employee/gurukul/GurukulScreen';
import AnnouncementsScreen from '../screens/employee/announcements/AnnouncementsScreen';
import DailyReportsScreen from '../screens/employee/reports/DailyReportsScreen';

import theme from '../constants/theme';
import AttSummary from '../screens/employee/attendance/attSummary';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Attendance Stack Navigator
const AttendanceStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: '600' },
        }}
    >
        <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} options={{ title: 'Mark Attendance' }} />
        {/* <Stack.Screen name="AttendanceSummaryy" component={AttendanceSummaryScreen} options={{ title: 'Attendance Summary' }} /> */}
        <Stack.Screen name="Regularization" component={RegularizationScreen} options={{ title: 'Regularization' }} />
    </Stack.Navigator>
);

// Leaves Stack Navigator
const LeavesStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: '600' },
        }}
    >
        <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} options={{ title: 'Apply Leave' }} />
        <Stack.Screen name="MyLeaves" component={MyLeavesScreen} options={{ title: 'My Leaves' }} />
        <Stack.Screen name="Holidays" component={HolidaysScreen} options={{ title: 'Holidays' }} />
        <Stack.Screen name="LeaveBalance" component={LeaveBalanceScreen} options={{ title: 'Leave Balance' }} />
    </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: '600' },
        }}
    >
        <Stack.Screen name="MyProfile" component={ProfileScreen} options={{ title: 'My Profile' }} />
        <Stack.Screen name="Payslips" component={PayslipsScreen} options={{ title: 'Payslips' }} />
        <Stack.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Documents' }} />
        <Stack.Screen name="Benefits" component={BenefitsScreen} options={{ title: 'Benefits' }} />
    </Stack.Navigator>
);

// More Stack Navigator
const MoreStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: '600' },
        }}
    >
        <Stack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResignationScreen" component={ResignationScreen} options={{ title: 'Resignation' }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="GurukulScreen" component={GurukulScreen} options={{ title: 'Gurukul' }} />
        <Stack.Screen name="AnnouncementsScreen" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
        <Stack.Screen name="DailyReportsScreen" component={DailyReportsScreen} options={{ title: 'Daily Reports' }} />
         <Stack.Screen name="AttendanceSummaryy" component={AttendanceSummaryScreen} options={{ title: 'Attendance Summary' }} />

        {/* Shared Screens for local navigation within More tab */}
        <Stack.Screen name="Payslips" component={PayslipsScreen} options={{ title: 'Payslips' }} />
        <Stack.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Documents' }} />
        <Stack.Screen name="Benefits" component={BenefitsScreen} options={{ title: 'Benefits' }} />
        <Stack.Screen name="Regularization" component={RegularizationScreen} options={{ title: 'Regularization' }} />
        <Stack.Screen name="Holidays" component={HolidaysScreen} options={{ title: 'Holidays' }} />
        <Stack.Screen name="LeaveBalance" component={LeaveBalanceScreen} options={{ title: 'Leave Balance' }} />

        <Stack.Screen name="AttendanceSumamry" component={AttSummary} options={{ title: 'Attendance Summary' }} />
    </Stack.Navigator>
);

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.tabBarContainer}>
            <View style={[styles.tabBar, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12 }]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // Icon mapping
                    let iconName;
                    if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
                    else if (route.name === 'Attendance') iconName = isFocused ? 'time' : 'time-outline';
                    else if (route.name === 'Leaves') iconName = isFocused ? 'calendar' : 'calendar-outline';
                    else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';
                    else if (route.name === 'More') iconName = isFocused ? 'menu' : 'menu-outline';

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.8}
                        >
                            {isFocused ? (
                                <LinearGradient
                                    colors={theme.colors.gradientPrimary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.activeTabGradient}
                                >
                                    <Ionicons name={iconName} size={20} color="#FFF" />
                                    <Text style={styles.labelFocused}>{label}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={styles.inactiveTab}>
                                    <Ionicons name={iconName} size={22} color={theme.colors.tabInactive} />
                                    <Text style={styles.labelInactive}>{label}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

// Main Employee Navigator
const EmployeeNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                lazy: true,
            }}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Attendance" component={AttendanceStack} />
            <Tab.Screen name="Leaves" component={LeavesStack} />
            <Tab.Screen name="Profile" component={ProfileStack} />
            <Tab.Screen name="More" component={MoreStack} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        backgroundColor: theme.colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.03)',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 12,
        paddingHorizontal: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    activeTabGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        gap: 8,
        minWidth: 40,
    },
    inactiveTab: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    labelFocused: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    labelInactive: {
        fontSize: 10,
        fontWeight: '500',
        color: theme.colors.tabInactive,
    },
});

export default EmployeeNavigator;
