import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../../constants/theme';
import AttendanceService from '../../../services/AttendanceService';
import { useAuth } from '../../../context/AuthContext';
import GradientButton from '../../../components/common/GradientButton';

const RegularizationScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { attendanceRecord } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [correctionData, setCorrectionData] = useState(null);
    const [remark, setRemark] = useState('');
    const [proofFile, setProofFile] = useState(null);
    const [correctionToken, setCorrectionToken] = useState(null);

    useEffect(() => {
        fetchCorrectionDetails();
    }, []);

    const fetchCorrectionDetails = async () => {
        try {
            // We need employeeId. Assuming user object has it.
            const employeeId = user?.id || user?.employeeId;
            if (!employeeId) {
                Alert.alert('Error', 'Employee ID not found in session.');
                return;
            }

            const data = await AttendanceService.getCorrectionRequestData(employeeId);
            setCorrectionData(data);

            // The API returns a token which is REQUIRED for submission
            if (data.token) {
                setCorrectionToken(data.token);
            }

        } catch (error) {
            console.error('Fetch correction details error:', error);
            // Fallback: use passed attendanceRecord if API fails? 
            // But we need the token. 
            Alert.alert('Error', 'Failed to load correction details.');
        } finally {
            setFetching(false);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Allow all types or specify images/pdf
                copyToCacheDirectory: true
            });

            if (result.canceled === false) {
                setProofFile(result.assets[0]);
            }
        } catch (err) {
            console.log('Document picker error:', err);
        }
    };

    const handleSubmit = async () => {
        if (!remark.trim()) {
            Alert.alert('Validation', 'Please enter a correction remark.');
            return;
        }
        if (!correctionToken) {
            Alert.alert('Error', 'Missing correction token. Please reload the page.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('token', correctionToken);
            formData.append('correctionRemark', remark);

            if (proofFile) {
                formData.append('proofFile', {
                    uri: proofFile.uri,
                    type: proofFile.mimeType || 'image/jpeg',
                    name: proofFile.name || 'proof.jpg',
                });
            }

            const response = await AttendanceService.submitCorrectionRequest(formData);

            Alert.alert(
                'Success',
                response.message || 'Correction requested successfully!',
                [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]
            );

        } catch (error) {
            console.error('Submit correction error:', error);
            const msg = error.response?.data?.message || 'Failed to submit correction request';

            if (msg.includes('already requested')) {
                Alert.alert('Info', 'Correction already requested for this date.');
            } else {
                Alert.alert('Error', msg);
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            {/* Header Section */}
            <View style={styles.headerCard}>
                <Text style={styles.headerTitle}>Correction Request</Text>
                <Text style={styles.employeeName}>{user?.name} ({user?.employeeCode})</Text>

                {/* Display Attendance Info for Correction */}
                {attendanceRecord && (
                    <View style={styles.recordInfo}>
                        <Text style={styles.dateText}>Date: {new Date(attendanceRecord.date).toDateString()}</Text>
                        <Text style={styles.statusText}>Current Status: {attendanceRecord.status}</Text>
                    </View>
                )}
            </View>

            {/* Input Form */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>Correction Remark *</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Enter reason for correction..."
                    placeholderTextColor={theme.colors.textTertiary}
                    multiline
                    numberOfLines={4}
                    value={remark}
                    onChangeText={setRemark}
                    textAlignVertical="top"
                />

                <Text style={styles.label}>Upload Proof (Optional)</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                    <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary} />
                    <Text style={styles.uploadText}>
                        {proofFile ? proofFile.name : 'Select File (Image/PDF)'}
                    </Text>
                </TouchableOpacity>

                <GradientButton
                    title={loading ? "Submitting..." : "Submit Request"}
                    onPress={handleSubmit}
                    disabled={loading}
                    style={{ marginTop: 32 }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: 16,
        marginBottom: 16,
        ...theme.shadow.light,
    },
    headerTitle: {
        ...theme.typography.h4,
        color: theme.colors.primary,
        marginBottom: 4,
    },
    employeeName: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: 12,
    },
    recordInfo: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.divider,
    },
    dateText: {
        ...theme.typography.body,
        fontWeight: '600',
    },
    statusText: {
        ...theme.typography.bodySmall,
        color: theme.colors.textSecondary,
    },
    formContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: 16,
        ...theme.shadow.light,
    },
    label: {
        ...theme.typography.label,
        marginBottom: 8,
        marginTop: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        padding: 12,
        fontSize: 14,
        color: theme.colors.text,
        backgroundColor: '#FFFFFF',
        minHeight: 100,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
        borderRadius: theme.borderRadius.sm,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceAlt,
    },
    uploadText: {
        marginTop: 8,
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '500',
    }
});

export default RegularizationScreen;
