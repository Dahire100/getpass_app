import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, CheckCircle, XCircle, ShieldCheck, QrCode as QrIcon, LogOut, Clock, Calendar } from 'lucide-react-native';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ScanResultScreen() {
  const router = useRouter();
  const { passData } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  
  const pass = passData ? JSON.parse(passData as string) : null;
  const isGranted = pass && (pass.status === 'Approved' || pass.status === 'pending'); // Show 'pending' as grantable

  const handleGrant = async () => {
    if (!pass) return;
    setLoading(true);
    try {
      await axios.put(`${API_URL}/passes/${pass._id}/status`, { status: 'completed' });
      Alert.alert('Success', 'Access Granted Successfully!', [
        { text: 'Done', onPress: () => router.replace('/(guard)/scan' as any) }
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update pass status');
    } finally {
      setLoading(false);
    }
  };

  if (!pass) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isGranted ? '#0A1A10' : '#1A0A0A' }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(guard)/scan' as any)}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Verification</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.statusSection}>
          <View style={[styles.statusIconBox, { backgroundColor: isGranted ? 'rgba(25,230,94,0.1)' : 'rgba(255,59,48,0.1)' }]}>
             {isGranted ? <CheckCircle size={64} color={Colors.primary} /> : <XCircle size={64} color="#FF3B30" />}
          </View>
          <Text style={[styles.statusTitle, { color: isGranted ? Colors.primary : '#FF3B30' }]}>
            {isGranted ? 'PASS VERIFIED' : 'INVALID PASS'}
          </Text>
          <Text style={styles.passId}>REF ID: {pass.qrCode}</Text>
        </View>

        <View style={[styles.profileCard, { borderColor: isGranted ? 'rgba(25,230,94,0.2)' : 'rgba(255,59,48,0.2)' }]}>
           <View style={[styles.cardBanner, { backgroundColor: isGranted ? 'rgba(25,230,94,0.15)' : 'rgba(255,59,48,0.15)' }]}>
              <View style={styles.bannerRow}>
                <ShieldCheck size={16} color={isGranted ? Colors.primary : '#FF3B30'} />
                <Text style={[styles.bannerText, { color: isGranted ? Colors.primary : '#FF3B30' }]}>
                   {pass.userId?.role?.toUpperCase() || 'USER'} PASS
                </Text>
              </View>
              <Text style={styles.bannerValidity}>Status: {pass.status.toUpperCase()}</Text>
           </View>
           
           <View style={styles.cardInfo}>
              <View style={styles.profileRow}>
                <View style={[styles.avatarPlaceholder, { borderColor: isGranted ? Colors.primary : '#FF3B30' }]}>
                  <Text style={styles.avatarInitial}>{pass.userId?.name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{pass.userId?.name || 'Unknown User'}</Text>
                  <Text style={styles.dept}>{pass.userId?.email || ''}</Text>
                  <View style={styles.idBadge}>
                    <Text style={styles.idText}>Pass ID: {pass._id.substring(18).toUpperCase()}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                   <Clock size={16} color={Colors.textSecondary} />
                   <View>
                      <Text style={styles.detailLabel}>EXIT TIME</Text>
                      <Text style={styles.detailValue}>{pass.exitTime}</Text>
                   </View>
                </View>
                <View style={styles.detailItem}>
                   <Calendar size={16} color={Colors.textSecondary} />
                   <View>
                      <Text style={styles.detailLabel}>DATE</Text>
                      <Text style={styles.detailValue}>{pass.exitDate}</Text>
                   </View>
                </View>
              </View>

              <View style={styles.reasonBox}>
                 <Text style={styles.detailLabel}>REASON</Text>
                 <Text style={styles.reasonText}>{pass.reason}</Text>
              </View>
           </View>
        </View>
      </View>

      <View style={styles.footer}>
        {isGranted && pass.status !== 'completed' ? (
          <TouchableOpacity 
            style={[styles.grantBtn, loading && { opacity: 0.7 }]} 
            onPress={handleGrant}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={Colors.background} /> : (
              <>
                <LogOut size={24} color={Colors.background} />
                <Text style={styles.grantText}>Approve Exit/Entry</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.scanNextBtn} onPress={() => router.replace('/(guard)/scan' as any)}>
            <QrIcon size={24} color={Colors.background} />
            <Text style={styles.scanNextText}>Scan Another</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  content: { flex: 1, padding: 20 },
  statusSection: { alignItems: 'center', marginVertical: 20, gap: 8 },
  statusIconBox: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  statusTitle: { fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  passId: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', letterSpacing: 1 },
  profileCard: { backgroundColor: Colors.surface, borderRadius: 32, overflow: 'hidden', borderWidth: 1 },
  cardBanner: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bannerText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  bannerValidity: { fontSize: 10, color: '#FFF', fontWeight: '800', opacity: 0.6 },
  cardInfo: { padding: 24 },
  profileRow: { flexDirection: 'row', gap: 16, alignItems: 'center', marginBottom: 24 },
  avatarPlaceholder: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
  avatarInitial: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  name: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  dept: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  idBadge: { backgroundColor: 'rgba(255,255,255,0.05)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  idText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700' },
  detailsGrid: { flexDirection: 'row', gap: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20, marginBottom: 20 },
  detailItem: { flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center' },
  detailLabel: { fontSize: 9, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  reasonBox: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 16 },
  reasonText: { color: '#DDD', fontSize: 14, lineHeight: 20 },
  footer: { padding: 24, paddingBottom: 40, gap: 12 },
  grantBtn: { height: 64, backgroundColor: Colors.primary, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  grantText: { fontSize: 18, fontWeight: '800', color: Colors.background },
  scanNextBtn: { height: 64, backgroundColor: Colors.surface, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  scanNextText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
