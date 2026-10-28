import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import ReportIssueScreen from '../screens/student/ReportIssueScreen';
import StaffHomeScreen from '../screens/staff/StaffHomeScreen';
import IssueDetailsScreen from '../screens/shared/IssueDetailsScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const commonTabScreenOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: '#0f172a',
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarActiveTintColor: '#38bdf8',
  tabBarInactiveTintColor: '#64748b',
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '700',
  },
};

function StudentTabs() {
  return (
    <Tab.Navigator screenOptions={commonTabScreenOptions}>
      <Tab.Screen
        name="StudentHomeTab"
        component={StudentHomeScreen}
        options={{
          tabBarLabel: 'My Tickets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ReportTab"
        component={ReportIssueScreen}
        options={{
          tabBarLabel: 'Report Issue',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size - 2} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function StaffTabs() {
  return (
    <Tab.Navigator screenOptions={commonTabScreenOptions}>
      <Tab.Screen
        name="StaffHomeTab"
        component={StaffHomeScreen}
        options={{
          tabBarLabel: 'Operations',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="construct-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size - 2} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading, isStaff, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#020617' } }}>
      {!isAuthenticated ? (
        // Auth Flow
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        // Authenticated Flow
        <Stack.Group>
          {isStaff || isAdmin ? (
            <Stack.Screen name="StaffMain" component={StaffTabs} />
          ) : (
            <Stack.Screen name="StudentMain" component={StudentTabs} />
          )}
          {/* Shared Stack Screens */}
          <Stack.Screen name="IssueDetails" component={IssueDetailsScreen} />
          <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
