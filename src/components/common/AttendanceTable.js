import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../constants/theme';
import StatusBadge from './StatusBadge';

const AttendanceTable = ({ data, onRequestCorrection, isHrView = false }) => {

    const formatDate = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    };

    const renderTableHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, { flex: 1.2 }]}>Date</Text>
            <Text style={[styles.columnHeader, { flex: 0.8 }]}>In</Text>
            <Text style={[styles.columnHeader, { flex: 0.8 }]}>Out</Text>
            <Text style={[styles.columnHeader, { flex: 1 }]}>Hrs</Text>
            <Text style={[styles.columnHeader, { flex: 1 }]}>Status</Text>
            <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>{isHrView ? 'Corr' : 'Act'}</Text>
        </View>
    );

    const renderTableRow = (item, index) => {
        const isAlternate = index % 2 === 1;
        return (
            <View key={index} style={[styles.tableRow, isAlternate && styles.tableRowAlt]}>
                <Text style={[styles.cellText, { flex: 1.2 }]}>{formatDate(item.date)}</Text>
                <Text style={[styles.cellText, { flex: 0.8 }]}>{item.inTime || '--'}</Text>
                <Text style={[styles.cellText, { flex: 0.8 }]}>{item.outTime || '--'}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>{item.workingHours || '--'}</Text>
                <View style={{ flex: 1 }}>
                    <StatusBadge status={item.status} style={{ paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3, fontSize: 10 }} />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {item.correctionStatus === 'Pending' ? (
                        <Text style={styles.pendingText}>Pending</Text>
                    ) : item.correctionStatus === 'Approved' ? (
                        <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                    ) : (
                        !isHrView && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => onRequestCorrection(item)}
                            >
                                <Text style={styles.actionButtonText}>Request</Text>
                            </TouchableOpacity>
                        )
                    )}
                    {isHrView && item.correctionStatus !== 'Pending' && item.correctionStatus !== 'Approved' && (
                        <Text style={styles.cellText}>--</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.tableContainer}>
            {renderTableHeader()}
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {data.length > 0 ? (
                    data.map((item, index) => renderTableRow(item, index))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No records found.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    tableContainer: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        ...theme.shadow.light,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    columnHeader: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
        alignItems: 'center',
    },
    tableRowAlt: {
        backgroundColor: theme.colors.surfaceAlt,
    },
    cellText: {
        ...theme.typography.bodySmall,
        color: theme.colors.text,
        fontSize: 12,
    },
    actionButton: {
        backgroundColor: theme.colors.warning,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    actionButtonText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.text,
    },
    pendingText: {
        fontSize: 10,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        fontStyle: 'italic'
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    }
});

export default AttendanceTable;
