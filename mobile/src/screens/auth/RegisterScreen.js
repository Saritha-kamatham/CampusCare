import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { THEME } from '../../utils/constants';

const DEPARTMENTS = {
  ROLE_STUDENT: [
    'Computer Science & Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil & Environmental Engineering',
    'Biotechnology & Chemical Sciences',
    'Business & Management Studies',
  ],
  ROLE_STAFF: [
    'IT Infrastructure & Networks',
    'Electrical & Hardware Maintenance',
    'Facilities & Hostel Operations',
    'Laboratories & Specialized Gear',
    'Campus Transport & Shuttles',
    'Campus Security & Safety',
  ],
  ROLE_ADMIN: [
    'Campus Administration & Operations',
    'Dean of Student Affairs',
    'Estate & Infrastructure Management',
  ],
};

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [role, setRole] = useState('ROLE_STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS.ROLE_STUDENT[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setDepartment(DEPARTMENTS[newRole][0]);
  };

  const handleRegister = async () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        department,
        phone,
      });
      // Navigation is automatically updated by AuthContext state
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join CampusCare Smart Issue Management</Text>
          </View>
        </View>

        {/* Role Selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'ROLE_STUDENT' && styles.roleTabActive]}
            onPress={() => handleRoleChange('ROLE_STUDENT')}
          >
            <Ionicons
              name="school-outline"
              size={18}
              color={role === 'ROLE_STUDENT' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.roleTabText, role === 'ROLE_STUDENT' && styles.roleTabTextActive]}>
              Student
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, role === 'ROLE_STAFF' && styles.roleTabActive]}
            onPress={() => handleRoleChange('ROLE_STAFF')}
          >
            <Ionicons
              name="construct-outline"
              size={18}
              color={role === 'ROLE_STAFF' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.roleTabText, role === 'ROLE_STAFF' && styles.roleTabTextActive]}>
              Staff
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, role === 'ROLE_ADMIN' && styles.roleTabActive]}
            onPress={() => handleRoleChange('ROLE_ADMIN')}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={role === 'ROLE_ADMIN' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.roleTabText, role === 'ROLE_ADMIN' && styles.roleTabTextActive]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#f43f5e" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Alex Johnson"
                placeholderTextColor="#475569"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Campus Email Address *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. alex@campus.edu"
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 characters"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+1 555-0199"
                placeholderTextColor="#475569"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Department Choice */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department / Specialization</Text>
            <View style={styles.deptContainer}>
              {DEPARTMENTS[role].map((dept) => {
                const isSelected = department === dept;
                return (
                  <TouchableOpacity
                    key={dept}
                    style={[styles.deptChip, isSelected && styles.deptChipActive]}
                    onPress={() => setDepartment(dept)}
                  >
                    <Text style={[styles.deptChipText, isSelected && styles.deptChipTextActive]}>
                      {dept}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Link to Login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleWrapper: {},
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  roleTabActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: '#0284c7',
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  roleTabTextActive: {
    color: '#38bdf8',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(225, 29, 72, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#f43f5e',
    flex: 1,
  },
  form: {
    gap: 16,
  },
  inputGroup: {},
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
    paddingVertical: 12,
  },
  deptContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  deptChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  deptChipActive: {
    borderColor: '#0284c7',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  deptChipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  deptChipTextActive: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  loginPrompt: {
    fontSize: 13,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38bdf8',
  },
});
