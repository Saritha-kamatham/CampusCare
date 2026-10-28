import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getActiveApiUrl, setCustomApiUrl } from '../../config/api';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [serverModalVisible, setServerModalVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(getActiveApiUrl());
  const [inputUrl, setInputUrl] = useState(getActiveApiUrl());

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of CampusCare?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const handleSaveServer = async () => {
    if (!inputUrl.trim()) return;
    try {
      const saved = await setCustomApiUrl(inputUrl.trim());
      setCurrentUrl(saved);
      setServerModalVisible(false);
      Alert.alert('Server Updated', `Active API URL set to:\n${saved}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save server URL');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { label: 'Campus Administrator', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' };
      case 'ROLE_STAFF':
        return { label: 'Operations & Maintenance', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      default:
        return { label: 'Enrolled Student', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTag}>ACCOUNT & SETTINGS</Text>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CC'}
          </Text>
        </View>

        <Text style={styles.userName}>{user?.name || 'CampusCare User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <View style={[styles.roleBadge, { backgroundColor: roleInfo.bg, borderColor: roleInfo.color }]}>
          <Text style={[styles.roleBadgeText, { color: roleInfo.color }]}>{roleInfo.label}</Text>
        </View>
      </View>

      {/* Details List */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>PROFILE INFORMATION</Text>

        <View style={styles.row}>
          <Ionicons name="business-outline" size={18} color="#64748b" style={styles.rowIcon} />
          <View style={styles.rowTextWrapper}>
            <Text style={styles.rowLabel}>Department / Faculty</Text>
            <Text style={styles.rowValue}>{user?.department || 'General Campus'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="call-outline" size={18} color="#64748b" style={styles.rowIcon} />
          <View style={styles.rowTextWrapper}>
            <Text style={styles.rowLabel}>Phone Number</Text>
            <Text style={styles.rowValue}>{user?.phone || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="finger-print-outline" size={18} color="#64748b" style={styles.rowIcon} />
          <View style={styles.rowTextWrapper}>
            <Text style={styles.rowLabel}>Account User ID</Text>
            <Text style={styles.rowValue}>#{user?.id || '—'}</Text>
          </View>
        </View>
      </View>

      {/* Backend Server Settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>BACKEND CONNECTION</Text>

        <View style={styles.row}>
          <Ionicons name="server-outline" size={18} color="#64748b" style={styles.rowIcon} />
          <View style={styles.rowTextWrapper}>
            <Text style={styles.rowLabel}>Active API Server Endpoint</Text>
            <Text style={styles.serverUrlText} numberOfLines={1}>{currentUrl}</Text>
          </View>
          <TouchableOpacity
            style={styles.editServerBtn}
            onPress={() => setServerModalVisible(true)}
          >
            <Text style={styles.editServerText}>Configure</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#f43f5e" />
        <Text style={styles.logoutBtnText}>Sign Out of CampusCare</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>CampusCare Mobile v1.0.0 • Connected to Live Backend</Text>

      {/* Server Modal */}
      <Modal
        visible={serverModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setServerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configure API Server</Text>
            <Text style={styles.modalSub}>
              Enter host machine IP address (e.g. your PC's Wi-Fi IP for physical Android or 10.0.2.2 for emulator):
            </Text>

            <TextInput
              style={styles.modalInput}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://192.168.0.135:8080/api"
              placeholderTextColor="#475569"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setServerModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveServer}>
                <Text style={styles.modalSaveText}>Save Endpoint</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 2,
  },
  userCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 2,
    borderColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38bdf8',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  roleBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 12,
  },
  rowTextWrapper: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: 1,
  },
  serverUrlText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#38bdf8',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 12,
  },
  editServerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  editServerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38bdf8',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f43f5e',
  },
  versionText: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 14,
    lineHeight: 18,
  },
  modalInput: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    color: '#f8fafc',
    fontSize: 13,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  modalSave: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
