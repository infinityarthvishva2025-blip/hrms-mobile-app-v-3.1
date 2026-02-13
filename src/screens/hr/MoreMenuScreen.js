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
        {
            title: 'HR Management',
            items: [
                { icon: 'briefcase-outline', label: 'Leave Management', screen: 'LeaveManagementScreen' },
                { icon: 'cash-outline', label: 'Payroll', screen: 'PayrollScreen' },
                { icon: 'book-outline', label: 'Gurukul Admin', screen: 'GurukulAdminScreen' },
            ]
        },
        {
            title: 'Communication',
            items: [
                { icon: 'megaphone-outline', label: 'Announcements', screen: 'AnnouncementsScreen' },
                { icon: 'document-text-outline', label: 'Resignation Requests', screen: 'ResignationScreen' },
            ]
        },
        {
            title: 'Reports & Analytics',
            items: [
                { icon: 'stats-chart-outline', label: 'Reports', screen: 'ReportsScreen' },
            ]
        },
        {
            title: 'Settings',
            items: [
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
                    <View style={styles.badgeContainer}>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleBadgeText}>HR ADMIN</Text>
                        </View>
                        <Text style={styles.headerSubtitle}>
                            {user.employeeName} • {user.employeeCode}
                        </Text>
                    </View>
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
    badgeContainer: {
        marginTop: theme.spacing.sm,
    },
    roleBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.xs,
        alignSelf: 'flex-start',
        marginBottom: theme.spacing.xs,
    },
    roleBadgeText: {
        ...theme.typography.captionSmall,
        color: theme.colors.white,
        fontWeight: '700',
        letterSpacing: 1,
    },
    headerSubtitle: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
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
