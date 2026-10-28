import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';
import { setCustomApiUrl, getActiveApiUrl } from '../../config/api';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Server IP config modal state
  const [ipModalVisible, setIpModalVisible] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState(getActiveApiUrl());

  const { login } = useAuth();

  const fillCredentials = (e, p) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your institutional email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        (err.message?.includes('Network Error')
          ? 'Network Error: Cannot reach backend. Tap "Server IP" below to verify IP.'
          : 'Invalid credentials. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveServerUrl = async () => {
    try {
      const updated = await setCustomApiUrl(serverUrlInput);
      setIpModalVisible(false);
      Alert.alert('Server Updated', `Active API URL: ${updated}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update server URL');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Branding */}
        <View style={styles.brandBox}>
          <View style={styles.logoPill}>
            <Text style={styles.logoText}>CC</Text>
          </View>
          <Text style={styles.brandTitle}>CampusCare</Text>
          <Text style={styles.brandSubtitle}>Operations & Issue Management Mobile</Text>
        </View>

        {/* Demo Profiles Card */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>⚡ ONE-CLICK DEMO PROFILES</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: COLORS.purple }]}
              onPress={() => fillCredentials('admin@campuscare.com', 'CampusCare@2026!')}
            >
              <Text style={[styles.demoBtnText, { color: COLORS.purple }]}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: COLORS.brandLight }]}
              onPress={() => fillCredentials('staff2@campuscare.com', 'CampusCare@2026!')}
            >
              <Text style={[styles.demoBtnText, { color: COLORS.brandLight }]}>Staff (IT)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: COLORS.success }]}
              onPress={() => fillCredentials('student1@campuscare.com', 'CampusCare@2026!')}
            >
              <Text style={[styles.demoBtnText, { color: COLORS.success }]}>Student</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Alert */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form Inputs */}
        <View style={styles.form}>
          <Text style={styles.label}>Institutional Email</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. name@campuscare.com"
            placeholderTextColor={COLORS.textSubtle}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textSubtle}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            New to CampusCare? <Text style={styles.registerHighlight}>Register as Student</Text>
          </Text>
        </TouchableOpacity>

        {/* Server IP Config Footer */}
        <TouchableOpacity
          style={styles.serverConfigBtn}
          onPress={() => setIpModalVisible(true)}
        >
          <Text style={styles.serverConfigText}>⚙️ Server IP: {getActiveApiUrl()}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Server IP Modal */}
      <Modal
        visible={ipModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Configure Backend Server</Text>
            <Text style={styles.modalDesc}>
              Enter your PC's local Wi-Fi IP address or emulator address (e.g. 192.168.0.135:8080/api)
            </Text>
            <TextInput
              style={styles.modalInput}
              value={serverUrlInput}
              onChangeText={setServerUrlInput}
              placeholder="http://192.168.0.135:8080/api"
              placeholderTextColor={COLORS.textSubtle}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIpModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveServerUrl}
              >
                <Text style={styles.modalSaveText}>Save IP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoPill: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  brandTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  demoBox: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 20,
  },
  demoTitle: {
    color: COLORS.textSubtle,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 10,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    alignItems: 'center',
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#fb7185',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    color: COLORS.text,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  loginBtn: {
    backgroundColor: COLORS.brand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  registerHighlight: {
    color: COLORS.brandLight,
    fontWeight: '700',
  },
  serverConfigBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  serverConfigText: {
    color: COLORS.textSubtle,
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 18,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    color: COLORS.text,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  modalSaveBtn: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});
