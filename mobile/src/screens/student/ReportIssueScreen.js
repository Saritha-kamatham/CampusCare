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
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CATEGORIES, PRIORITIES, COLORS } from '../../utils/constants';
import { issueService } from '../../services/issueService';

const CATEGORY_ICONS = {
  WIFI_INTERNET: 'wifi',
  ELECTRICAL: 'flash',
  CLASSROOM: 'tv-outline',
  LABORATORY: 'flask-outline',
  HOSTEL: 'home-outline',
  CLEANING: 'trash-outline',
  LIBRARY: 'book-outline',
  TRANSPORT: 'bus-outline',
  SECURITY: 'shield-outline',
  OTHER: 'help-circle-outline',
};

export default function ReportIssueScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('WIFI_INTERNET');
  const [priority, setPriority] = useState('MEDIUM');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Please allow media library access to attach photos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Please allow camera access to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera error:', e);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Please provide a title for the issue');
      return;
    }
    if (!location.trim()) {
      setError('Please provide the exact campus location (e.g. Block B, Room 204)');
      return;
    }
    if (!description.trim()) {
      setError('Please write a detailed description of the problem');
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = null;
      if (imageUri) {
        try {
          const uploadRes = await issueService.uploadImage(imageUri);
          uploadedImageUrl = uploadRes?.imageUrl || null;
        } catch (uploadErr) {
          console.warn('Image upload failed, submitting issue without image:', uploadErr);
        }
      }

      const created = await issueService.createIssue({
        title: title.trim(),
        category,
        priority,
        location: location.trim(),
        description: description.trim(),
        imageUrl: uploadedImageUrl,
      });

      Alert.alert(
        'Issue Reported! 🎉',
        `Ticket #${created.issueCode || created.id} has been submitted to campus operations.`,
        [
          {
            text: 'View Ticket',
            onPress: () => {
              navigation.replace('IssueDetails', { issueId: created.id });
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      console.error('Failed to submit issue:', err);
      const msg = err.response?.data?.message || 'Failed to submit issue. Please check your network connection.';
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
          <View>
            <Text style={styles.title}>Report Campus Issue</Text>
            <Text style={styles.subtitle}>Provide full details for immediate staff dispatch</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#f43f5e" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Issue Title */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Issue Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Water leakage in 3rd Floor Restroom"
            placeholderTextColor="#475569"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.key;
              const iconName = CATEGORY_ICONS[cat.key] || 'construct-outline';
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                  onPress={() => setCategory(cat.key)}
                >
                  <Ionicons
                    name={iconName}
                    size={20}
                    color={isSelected ? '#38bdf8' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Priority Level *</Text>
          <View style={styles.priorityRow}>
            {Object.keys(PRIORITIES).map((pKey) => {
              const isSelected = priority === pKey;
              const pInfo = PRIORITIES[pKey];
              return (
                <TouchableOpacity
                  key={pKey}
                  style={[
                    styles.priorityChip,
                    isSelected && {
                      borderColor: pInfo.color,
                      backgroundColor: pInfo.bg,
                    },
                  ]}
                  onPress={() => setPriority(pKey)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      isSelected && { color: pInfo.color, fontWeight: '800' },
                    ]}
                  >
                    {pInfo.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Location */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Campus Location *</Text>
          <View style={styles.locationWrapper}>
            <Ionicons name="location-outline" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.locationInput}
              placeholder="e.g. Block A, 2nd Floor, Lab 204"
              placeholderTextColor="#475569"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Detailed Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain the symptom, exact machine ID or equipment, and when it began..."
            placeholderTextColor="#475569"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Photo Evidence */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Photo Evidence (Optional)</Text>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoActionsRow}>
              <TouchableOpacity
                style={styles.photoActionBtn}
                onPress={takePhotoWithCamera}
              >
                <Ionicons name="camera-outline" size={20} color="#38bdf8" />
                <Text style={styles.photoActionText}>Take Camera Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoActionBtn}
                onPress={pickImageFromGallery}
              >
                <Ionicons name="images-outline" size={20} color="#38bdf8" />
                <Text style={styles.photoActionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Ionicons name="paper-plane" size={18} color="#ffffff" />
              <Text style={styles.submitBtnText}>Submit Issue Ticket</Text>
            </>
          )}
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
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
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 14,
  },
  textArea: {
    height: 100,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  categoryCardActive: {
    borderColor: '#0284c7',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    flex: 1,
  },
  categoryLabelActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
    paddingVertical: 12,
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 14,
  },
  photoActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38bdf8',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 14,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
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
});
