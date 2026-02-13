import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Keyboard,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';
import GradientButton from '../../../components/common/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
    const { login } = useAuth();

    // Form State
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        Keyboard.dismiss();
        setError('');

        if (!userId.trim() || !password) {
            setError('Please enter both User ID and Password');
            return;
        }

        setLoading(true);
        try {
            const result = await login(userId.trim(), password);
            if (!result.success) {
                setError(result.message || 'Login failed');
            }
            // Success redirect handled automatically by RootNavigator
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={theme.colors.gradientHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <Ionicons name="briefcase" size={60} color="white" />
                    <Text style={styles.appTitle}>HRMS Portal</Text>
                    <Text style={styles.appSubtitle}>Employee & HR Management System</Text>
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    <Text style={styles.welcomeTitle}>Welcome Back</Text>
                    <Text style={styles.welcomeSubtitle}>Sign in to access your portal</Text>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>User ID</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your User ID (e.g., IA00087)"
                                value={userId}
                                onChangeText={setUserId}
                                autoCapitalize="characters"
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(prev => !prev)}
                                style={styles.eyeIcon}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color={theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <GradientButton
                        title={loading ? "Signing In..." : "Sign In"}
                        onPress={handleLogin}
                        disabled={loading}
                        loading={loading}
                        style={styles.loginButton}
                    />

                    <View style={styles.infoContainer}>
                        <Ionicons name="information-circle-outline" size={18} color={theme.colors.info} />
                        <Text style={styles.infoText}>
                            Use your employee credentials to access the HRMS portal
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
        paddingHorizontal: theme.spacing.lg,
    },
    headerContent: {
        alignItems: 'center',
    },
    appTitle: {
        ...theme.typography.h1,
        color: theme.colors.white,
        marginTop: theme.spacing.md,
        fontWeight: '800',
    },
    appSubtitle: {
        ...theme.typography.caption,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: theme.spacing.xs,
        fontWeight: '500',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
    },
    formContainer: {
        flex: 1,
    },
    welcomeTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    welcomeSubtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
    },
    inputContainer: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        ...theme.typography.label,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        ...theme.shadow.light,
    },
    inputIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
    },
    eyeIcon: {
        padding: 8,
    },
    loginButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.lg,
        gap: 8,
    },
    errorText: {
        flex: 1,
        color: theme.colors.error,
        fontSize: 14,
        fontWeight: '500',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#DBEAFE',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        gap: 8,
    },
    infoText: {
        flex: 1,
        color: theme.colors.info,
        fontSize: 13,
        lineHeight: 18,
    },
});

export default LoginScreen;