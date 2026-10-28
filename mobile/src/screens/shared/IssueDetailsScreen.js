import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { issueService } from '../../services/issueService';
import { getActiveApiUrl } from '../../config/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusStepper } from '../../components/issues/StatusStepper';
import { formatDate } from '../../utils/formatters';

export default function IssueDetailsScreen({ route, navigation }) {
  const { issueId, action } = route.params;
  const { user, isStudent, isStaff, isAdmin } = useAuth();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Resolution modal state
  const [resolveModalVisible, setResolveModalVisible] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionImageUri, setResolutionImageUri] = useState(null);
  const [resolving, setResolving] = useState(false);

  const fetchIssueData = useCallback(async () => {
    try {
      const [issueData, commentsData] = await Promise.all([
        issueService.getIssueDetail(issueId),
        issueService.getComments(issueId).catch(() => []),
      ]);
      setIssue(issueData);
      setComments(Array.isArray(commentsData) ? commentsData : []);

      if (action === 'resolve' && issueData.status === 'IN_PROGRESS') {
        setResolveModalVisible(true);
      }
    } catch (err) {
      console.error('Failed to load issue details:', err);
      Alert.alert('Error', 'Could not load ticket details.');
    } finally {
      setLoading(false);
    }
  }, [issueId, action]);

  useEffect(() => {
    fetchIssueData();
  }, [fetchIssueData]);

  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = getActiveApiUrl().replace(/\/api$/, '');
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleClaim = async () => {
    setActionLoading(true);
    try {
      await issueService.claimIssue(issue.id);
      Alert.alert('Claimed! 🛠️', 'You have claimed this ticket.');
      fetchIssueData();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to claim ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await issueService.acceptIssue(issue.id);
      Alert.alert('Accepted! 🚀', 'Ticket status updated to IN_PROGRESS.');
      fetchIssueData();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to accept ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePickResolutionPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!res.canceled && res.assets?.length > 0) {
        setResolutionImageUri(res.assets[0].uri);
      }
    } catch (e) {
      console.warn('Resolution image picker error:', e);
    }
  };

  const handleResolveSubmit = async () => {
    if (!resolutionNotes.trim()) {
      Alert.alert('Required', 'Please add brief notes explaining how the issue was fixed.');
      return;
    }

    setResolving(true);
    try {
      let resolutionImgUrl = null;
      if (resolutionImageUri) {
        try {
          const uploadRes = await issueService.uploadImage(resolutionImageUri);
          resolutionImgUrl = uploadRes.imageUrl;
        } catch (e) {
          console.warn('Resolution photo upload failed:', e);
        }
      }

      await issueService.updateStatus(issue.id, 'RESOLVED', resolutionNotes.trim(), resolutionImgUrl);
      setResolveModalVisible(false);
      Alert.alert('Marked Resolved! ✅', 'Ticket has been marked resolved.');
      fetchIssueData();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
    } finally {
      setResolving(false);
    }
  };

  const handleStudentClose = async () => {
    Alert.alert(
      'Confirm Ticket Closure',
      'Are you satisfied with the maintenance resolution and ready to close this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Close',
          style: 'default',
          onPress: async () => {
            setActionLoading(true);
            try {
              await issueService.updateStatus(issue.id, 'CLOSED', 'Student confirmed service completed satisfactorily');
              Alert.alert('Ticket Closed! 🔒', 'Thank you for verifying the campus service.');
              fetchIssueData();
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to close ticket');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentSubmitting(true);
    try {
      await issueService.addComment(issue.id, newComment.trim());
      setNewComment('');
      const updated = await issueService.getComments(issue.id);
      setComments(Array.isArray(updated) ? updated : []);
    } catch (err) {
      Alert.alert('Error', 'Failed to post comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingText}>Loading ticket details...</Text>
      </View>
    );
  }

  if (!issue) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Ticket not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAssignedToMe = isStaff && issue.assignedStaffId === user?.id;
  const isMyReportedIssue = isStudent && issue.createdById === user?.id;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.topBarCode}>
            <Text style={styles.topBarCodeText}>#{issue.issueCode || issue.id}</Text>
          </View>
          <View style={styles.badgeRow}>
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </View>
        </View>

        {/* Title & Description */}
        <View style={styles.card}>
          <Text style={styles.issueTitle}>{issue.title}</Text>
          <Text style={styles.issueDescription}>{issue.description}</Text>

          {issue.imageUrl && (
            <View style={styles.evidenceSection}>
              <Text style={styles.subHeader}>ATTACHED PHOTO EVIDENCE</Text>
              <Image
                source={{ uri: resolveImageUrl(issue.imageUrl) }}
                style={styles.evidenceImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Status Lifecycle Stepper */}
        <StatusStepper issue={issue} />

        {/* Metadata Details */}
        <View style={styles.card}>
          <Text style={styles.subHeader}>TICKET DETAILS & LOCATION</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{issue.categoryDisplayName || issue.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Campus Location</Text>
              <Text style={styles.metaValue}>{issue.location}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Reported By</Text>
              <Text style={styles.metaValue}>{issue.createdByName || 'Student'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Assigned Staff</Text>
              <Text style={[styles.metaValue, !issue.assignedStaffName && { color: '#f59e0b' }]}>
                {issue.assignedStaffName || 'Unassigned'}
              </Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Reported Time</Text>
              <Text style={styles.metaValue}>{formatDate(issue.createdAt || issue.reportedTime)}</Text>
            </View>
            {issue.resolvedTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Resolved Time</Text>
                <Text style={[styles.metaValue, { color: '#10b981' }]}>
                  {formatDate(issue.resolvedTime)}
                </Text>
              </View>
            )}
          </View>

          {/* Resolution Note if resolved */}
          {issue.resolutionNotes ? (
            <View style={styles.resolutionBox}>
              <View style={styles.resolutionHeader}>
                <Ionicons name="checkmark-done-circle" size={18} color="#10b981" />
                <Text style={styles.resolutionTitle}>Resolution Summary</Text>
              </View>
              <Text style={styles.resolutionText}>{issue.resolutionNotes}</Text>
              {issue.resolutionImageUrl && (
                <Image
                  source={{ uri: resolveImageUrl(issue.resolutionImageUrl) }}
                  style={styles.resolutionImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </View>

        {/* Action Panel */}
        <View style={styles.actionsContainer}>
          {/* Staff: Claim Unassigned */}
          {isStaff && !issue.assignedStaffId && (
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: '#f59e0b' }]}
              onPress={handleClaim}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="hand-right" size={18} color="#ffffff" />
                  <Text style={styles.actionBtnText}>⚡ Claim & Start Work</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Staff: Accept Assigned Ticket */}
          {isAssignedToMe && issue.status === 'ASSIGNED' && (
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: '#0284c7' }]}
              onPress={handleAccept}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="play" size={18} color="#ffffff" />
                  <Text style={styles.actionBtnText}>Accept & Begin Work</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Staff: Mark Resolved */}
          {isAssignedToMe && issue.status === 'IN_PROGRESS' && (
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: '#10b981' }]}
              onPress={() => setResolveModalVisible(true)}
            >
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              <Text style={styles.actionBtnText}>Mark Resolved</Text>
            </TouchableOpacity>
          )}

          {/* Student: Confirm and Close */}
          {isMyReportedIssue && issue.status === 'RESOLVED' && (
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: '#0284c7' }]}
              onPress={handleStudentClose}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="lock-closed" size={18} color="#ffffff" />
                  <Text style={styles.actionBtnText}>Confirm & Close Ticket</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Comments Section */}
        <View style={styles.card}>
          <Text style={styles.subHeader}>COMMENTS & UPDATES ({comments.length})</Text>

          {comments.map((c) => (
            <View key={c.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{c.authorName || 'Campus User'}</Text>
                <Text style={styles.commentTime}>{formatDate(c.createdAt)}</Text>
              </View>
              <Text style={styles.commentContent}>{c.content}</Text>
            </View>
          ))}

          {comments.length === 0 && (
            <Text style={styles.noCommentsText}>No comments or operational notes yet.</Text>
          )}

          <View style={styles.addCommentBox}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a message or status update..."
              placeholderTextColor="#475569"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.commentSendBtn, commentSubmitting && { opacity: 0.5 }]}
              onPress={handleAddComment}
              disabled={commentSubmitting}
            >
              {commentSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="send" size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Resolution Modal */}
      <Modal
        visible={resolveModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setResolveModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mark Issue as Resolved</Text>
              <TouchableOpacity onPress={() => setResolveModalVisible(false)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Describe the maintenance action taken to fix this campus issue:
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Replaced faulty circuit breaker and tested voltage."
              placeholderTextColor="#475569"
              value={resolutionNotes}
              onChangeText={setResolutionNotes}
              multiline
              numberOfLines={3}
            />

            {resolutionImageUri ? (
              <View style={styles.modalImgPreview}>
                <Image source={{ uri: resolutionImageUri }} style={styles.modalPreviewImg} />
                <TouchableOpacity
                  style={styles.removeModalImg}
                  onPress={() => setResolutionImageUri(null)}
                >
                  <Ionicons name="close" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.modalPhotoBtn}
                onPress={handlePickResolutionPhoto}
              >
                <Ionicons name="camera-outline" size={18} color="#38bdf8" />
                <Text style={styles.modalPhotoBtnText}>Attach Proof Photo (Optional)</Text>
              </TouchableOpacity>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setResolveModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, resolving && { opacity: 0.6 }]}
                onPress={handleResolveSubmit}
                disabled={resolving}
              >
                {resolving ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>Confirm Resolved</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
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
  topBarCode: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topBarCodeText: {
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontWeight: '800',
    fontSize: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 14,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  issueDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
  evidenceSection: {
    marginTop: 14,
  },
  evidenceImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 6,
  },
  subHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f8fafc',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 10,
  },
  resolutionBox: {
    marginTop: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: 12,
    padding: 12,
  },
  resolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resolutionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  resolutionText: {
    fontSize: 12,
    color: '#e2e8f0',
    lineHeight: 18,
  },
  resolutionImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginTop: 8,
  },
  actionsContainer: {
    marginBottom: 14,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  commentItem: {
    backgroundColor: '#020617',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38bdf8',
  },
  commentTime: {
    fontSize: 10,
    color: '#64748b',
  },
  commentContent: {
    fontSize: 13,
    color: '#e2e8f0',
    lineHeight: 18,
  },
  noCommentsText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  addCommentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 13,
    maxHeight: 80,
  },
  commentSendBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  modalSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    color: '#f8fafc',
    fontSize: 13,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    marginBottom: 16,
  },
  modalPhotoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38bdf8',
  },
  modalImgPreview: {
    position: 'relative',
    marginBottom: 16,
  },
  modalPreviewImg: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  removeModalImg: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
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
  modalSubmitBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
