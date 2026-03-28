import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, User, ShieldCheck, X } from 'lucide-react-native';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

export default function VisitorApplyScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [formData, setFormData] = useState({
    reason: '',
    visitDate: '',
    visitTime: '',
    hostName: ''
  });

  const handleApply = async () => {
    if (!formData.reason || !formData.visitDate) {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Reason and date are required');
      } else {
        Alert.alert('Error', 'Reason and date are required');
      }
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/passes/apply`, {
        reason: formData.reason,
        exitDate: formData.visitDate,
        exitTime: formData.visitTime || '10:00 AM',
        returnTime: '06:00 PM'
      });
      
      setSuccessData(response.data.pass);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit visitor request';
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(msg);
      } else {
        Alert.alert('Failed', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Visitor Request</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <View style={styles.bannerGlow} />
          <View style={styles.bannerIcon}>
            <ShieldCheck size={36} color={Colors.primary} />
          </View>
          <Text style={styles.bannerSub}>Request Campus Entry</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purpose of Visit</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Meeting with Professor, Submitting Documents"
              placeholderTextColor={Colors.textSecondary}
              value={formData.reason}
              onChangeText={(t) => setFormData({ ...formData, reason: t })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Visit</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textSecondary}
              value={formData.visitDate}
              onChangeText={(t) => setFormData({ ...formData, visitDate: t })}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Time</Text>
            <TextInput
              style={styles.input}
              placeholder="10:00 AM"
              placeholderTextColor={Colors.textSecondary}
              value={formData.visitTime}
              onChangeText={(t) => setFormData({ ...formData, visitTime: t })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Host Name / Residing Person (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Who are you visiting?"
              placeholderTextColor={Colors.textSecondary}
              value={formData.hostName}
              onChangeText={(t) => setFormData({ ...formData, hostName: t })}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]} 
          onPress={handleApply}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.submitText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={!!successData}
        transparent={true}
        animationType="fade"
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <TouchableOpacity 
              style={modalStyles.closeBtn} 
              onPress={() => {
                setSuccessData(null);
                router.replace('/(visitor)');
              }}
            >
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <View style={modalStyles.successIcon}>
              <ShieldCheck size={40} color={Colors.primary} />
            </View>
            
            <Text style={modalStyles.modalTitle}>Pass Generated!</Text>
            <Text style={modalStyles.modalSubtitle}>Your visitor gate pass is ready.</Text>

            <View style={modalStyles.qrContainer}>
              {successData && (
                <QRCode
                  value={successData.qrCode}
                  size={180}
                  color={Colors.primary}
                  backgroundColor="transparent"
                />
              )}
            </View>

            <View style={modalStyles.idBadge}>
              <Text style={modalStyles.idLabel}>VISITOR REF ID</Text>
              <Text style={modalStyles.idValue}>{successData?.qrCode}</Text>
            </View>

            <TouchableOpacity 
              style={modalStyles.doneBtn}
              onPress={() => {
                setSuccessData(null);
                router.replace('/(visitor)');
              }}
            >
              <Text style={modalStyles.doneBtnText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  banner: { height: 160, backgroundColor: Colors.surface, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  bannerGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.primary, opacity: 0.1, top: -50, right: -50 },
  bannerIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  bannerSub: { fontSize: 13, color: Colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '800' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', paddingLeft: 4, textTransform: 'uppercase' },
  input: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, color: Colors.text, fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 40, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { color: Colors.background, fontSize: 16, fontWeight: '700' },
});

const modalStyles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#1A1D1A', width: '100%', borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  closeBtn: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  modalSubtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: 30 },
  qrContainer: { padding: 20, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 24 },
  idBadge: { backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  idLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 4 },
  idValue: { fontSize: 20, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  doneBtn: { width: '100%', height: 60, backgroundColor: Colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  doneBtnText: { color: Colors.background, fontSize: 16, fontWeight: '700' },
});
