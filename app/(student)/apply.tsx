import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, Send, ShieldCheck, Clock, Calendar, ChevronDown, Plus, History as HistoryIcon, X } from 'lucide-react-native';
import { useState } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

export default function ApplyPassScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [formData, setFormData] = useState({
    reason: 'Weekend Outing',
    exitDate: '',
    exitTime: '',
    returnTime: '',
  });

  const reasons = ['Medical Emergency', 'Family Function', 'Weekend Outing', 'Academic Project', 'Other'];
  const [showReasons, setShowReasons] = useState(false);

  const handleSubmit = async () => {
    if (!formData.reason || !formData.exitDate || !formData.exitTime || !formData.returnTime) {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Please fill all required fields');
      } else {
        Alert.alert('Error', 'Please fill all required fields');
      }
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/passes/apply`, formData);
      setSuccessData(response.data.pass);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong';
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
        <Text style={styles.headerTitle}>Apply Gate Pass</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerGlow} />
          <View style={styles.bannerIcon}>
            <ShieldCheck size={36} color={Colors.primary} />
          </View>
          <Text style={styles.bannerSub}>Secure Campus Entry</Text>
        </View>

        <View style={styles.form}>
          {/* Reason Select */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reason for Leave</Text>
            <TouchableOpacity 
              style={styles.selector} 
              onPress={() => setShowReasons(!showReasons)}
            >
              <Text style={styles.selectorText}>{formData.reason}</Text>
              <ChevronDown size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            {showReasons && (
              <View style={styles.reasonsList}>
                {reasons.map((r) => (
                  <TouchableOpacity 
                    key={r} 
                    style={styles.reasonBtn}
                    onPress={() => {
                      setFormData({...formData, reason: r});
                      setShowReasons(false);
                    }}
                  >
                    <Text style={[styles.reasonText, formData.reason === r && { color: Colors.primary }]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date & Time Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Exit Date</Text>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.input} 
                  placeholder="2024-03-27" 
                  placeholderTextColor="#444"
                  value={formData.exitDate}
                  onChangeText={(t) => setFormData({...formData, exitDate: t})}
                />
                <Calendar size={18} color={Colors.textSecondary} />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Exit Time</Text>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.input} 
                  placeholder="10:00 AM" 
                  placeholderTextColor="#444"
                  value={formData.exitTime}
                  onChangeText={(t) => setFormData({...formData, exitTime: t})}
                />
                <Clock size={18} color={Colors.textSecondary} />
              </View>
            </View>
          </View>

          {/* Return Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Return Time</Text>
            <View style={styles.inputBox}>
              <TextInput 
                style={styles.input} 
                placeholder="March 28, 6:00 PM" 
                placeholderTextColor="#444"
                value={formData.returnTime}
                onChangeText={(t) => setFormData({...formData, returnTime: t})}
              />
              <Clock size={18} color={Colors.textSecondary} />
            </View>
            <Text style={styles.hint}>Pass will automatically expire after this time.</Text>
          </View>

          {/* Submit */}
          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <>
                <Text style={styles.submitText}>Submit Request</Text>
                <Send size={20} color={Colors.background} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navigation */}
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
                router.replace('/(student)');
              }}
            >
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <View style={modalStyles.successIcon}>
              <ShieldCheck size={40} color={Colors.primary} />
            </View>
            
            <Text style={modalStyles.modalTitle}>Pass Generated!</Text>
            <Text style={modalStyles.modalSubtitle}>Your gate pass has been created successfully.</Text>

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
              <Text style={modalStyles.idLabel}>REFERENCE ID</Text>
              <Text style={modalStyles.idValue}>{successData?.qrCode}</Text>
            </View>

            <View style={modalStyles.infoGrid}>
              <View style={modalStyles.infoItem}>
                <Text style={modalStyles.infoLabel}>Reason</Text>
                <Text style={modalStyles.infoText}>{successData?.reason}</Text>
              </View>
              <View style={modalStyles.infoItem}>
                <Text style={modalStyles.infoLabel}>Exit Date</Text>
                <Text style={modalStyles.infoText}>{successData?.exitDate}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={modalStyles.doneBtn}
              onPress={() => {
                setSuccessData(null);
                router.replace('/(student)');
              }}
            >
              <Text style={modalStyles.doneBtnText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(student)')}>
          <View style={styles.navIconBox}>
             <ShieldCheck size={24} color={Colors.textSecondary} />
          </View>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIconBox, { backgroundColor: 'rgba(25, 230, 94, 0.15)' }]}>
             <Plus size={24} color={Colors.primary} />
          </View>
          <Text style={[styles.navText, { color: Colors.primary }]}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconBox}>
             <HistoryIcon size={24} color={Colors.textSecondary} />
          </View>
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconBox}>
             <ShieldCheck size={24} color={Colors.textSecondary} />
          </View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  banner: { height: 130, backgroundColor: '#0A1A10', borderRadius: 24, justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 32, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(25, 230, 94, 0.1)' },
  bannerGlow: { position: 'absolute', width: '100%', height: '100%', backgroundColor: Colors.primary, opacity: 0.05 },
  bannerIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center' },
  bannerSub: { color: Colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  form: { gap: 24 },
  inputGroup: { gap: 10 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginLeft: 4 },
  selector: { height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  selectorText: { color: '#FFF', fontSize: 16 },
  reasonsList: { backgroundColor: Colors.surface, borderRadius: 16, padding: 8, marginTop: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  reasonBtn: { padding: 12, borderRadius: 8 },
  reasonText: { color: Colors.textSecondary, fontSize: 15 },
  inputBox: { height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  input: { flex: 1, color: '#FFF', fontSize: 16, height: '100%' },
  row: { flexDirection: 'row', gap: 16 },
  hint: { fontSize: 11, color: '#666', marginLeft: 4 },
  submitBtn: { height: 60, borderRadius: 16, backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  submitText: { color: Colors.background, fontSize: 16, fontWeight: '800' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingBottom: 25 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navIconBox: { width: 44, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});

const modalStyles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#1A1D1A', width: '100%', borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  closeBtn: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  modalSubtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: 30 },
  qrContainer: { padding: 20, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 24 },
  idBadge: { backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  idLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 4 },
  idValue: { fontSize: 20, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  infoGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  infoItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  infoLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  infoText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  doneBtn: { width: '100%', height: 60, backgroundColor: Colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  doneBtnText: { color: Colors.background, fontSize: 16, fontWeight: '700' },
});

