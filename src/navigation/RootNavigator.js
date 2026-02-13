import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import EmployeeNavigator from './EmployeeNavigator';
import HRNavigator from './HRNavigator';
import theme from '../constants/theme';

const RootNavigator = () => {
    const { token, role, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // Role-based navigation
    const renderNavigator = () => {
        if (!token) {
            // Not logged in - show auth screens
            return <AuthStack />;
            // return <EmployeeNavigator/>;

            //  return <HRNavigator />;
        }

        // Logged in - show role-based navigation
        if (role === 'Employee') {
            return <EmployeeNavigator />;
        } else if (role === 'HR') {
            return <HRNavigator />;
        } else {
            // Fallback to Employee if role is undefined
            console.warn('Unknown role, defaulting to Employee navigation');
            return <EmployeeNavigator />;
        }
    };

    return (
        <NavigationContainer>
            {renderNavigator()}
        </NavigationContainer>
    );
};

export default RootNavigator;
