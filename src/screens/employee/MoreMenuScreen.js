import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const MoreMenuScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    const menuItems = [
        // {
        //     title: 'Profile Management',
        //     items: [
        //         { icon: 'document-text-outline', label: 'Payslips', screen: 'Payslips' },
        //         { icon: 'folder-outline', label: 'Documents', screen: 'Documents' },
        //         { icon: 'gift-outline', label: 'Benefits', screen: 'Benefits' },
        //     ]
        // },
        {
            title: 'Attendance & Leaves',
            items: [
                { icon: 'time-outline', label: 'Regularization', screen: 'Regularization' },
                { icon: 'calendar-outline', label: 'Holidays', screen: 'Holidays' },
                { icon: 'stats-chart-outline', label: 'Leave Balance', screen: 'LeaveBalance' },
                { icon: 'stats-chart-outline', label: 'ttendance Summary', screen: 'AttendanceSummaryy' },
            ]
        },
        // {
        //     title: 'Communication',
        //     items: [
        //         { icon: 'book-outline', label: 'Gurukul', screen: 'GurukulScreen' },
        //         { icon: 'megaphone-outline', label: 'Announcements', screen: 'AnnouncementsScreen' },
        //         { icon: 'newspaper-outline', label: 'Daily Reports', screen: 'DailyReportsScreen' },
        //     ]
        // },
        {
            title: 'Other',
            items: [
                { icon: 'exit-outline', label: 'Resignation', screen: 'ResignationScreen' },
                { icon: 'settings-outline', label: 'Settings', screen: 'SettingsScreen' },
            ]
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <LinearGradient
                colors={theme.colors.gradientHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>More</Text>
                {user && (
                    <Text style={styles.headerSubtitle}>
                        {user.employeeName} • {user.employeeCode}
                    </Text>
                )}
            </LinearGradient>

            {menuItems.map((section, sectionIndex) => (
                <View key={sectionIndex} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <View style={styles.menuCard}>
                        {section.items.map((item, itemIndex) => (
                            <TouchableOpacity
                                key={itemIndex}
                                style={[
                                    styles.menuItem,
                                    itemIndex < section.items.length - 1 && styles.menuItemBorder
                                ]}
                                onPress={() => {
                                    if (item.nested) {
                                        navigation.navigate(item.nested, { screen: item.screen });
                                    } else if (item.screen) {
                                        navigation.navigate(item.screen);
                                    }
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
                                    </View>
                                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.logoutGradient}
                >
                    <Ionicons name="log-out-outline" size={22} color="white" />
                    <Text style={styles.logoutText}>Logout</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        paddingBottom: theme.spacing.xxl,
    },
    header: {
        paddingTop: theme.spacing.xxl,
        paddingBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    headerTitle: {
        ...theme.typography.h1,
        color: theme.colors.white,
    },
    headerSubtitle: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: theme.spacing.xs,
    },
    section: {
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.label,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    menuCard: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        ...theme.shadow.light,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    menuItemLabel: {
        ...theme.typography.body,
        color: theme.colors.text,
        fontWeight: '500',
    },
    logoutButton: {
        marginHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        ...theme.shadow.medium,
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md + 2,
        gap: 8,
    },
    logoutText: {
        ...theme.typography.button,
        color: theme.colors.white,
    },
});

export default MoreMenuScreen;
