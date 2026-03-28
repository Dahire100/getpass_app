import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { LogOut, Plus, History, Navigation, User as UserIcon, Home, FileText, CheckCircle } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';

export default function VisitorDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [latestPass, setLatestPass] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestPass = async () => {
    try {
      const response = await axios.get(`${API_URL}/passes/history`);
      if (response.data.length > 0) {
        setLatestPass(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch pass:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPass();
    // Refresh every 30 seconds to catch guard approval
    const interval = setInterval(fetchLatestPass, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <UserIcon size={24} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Guest Access,</Text>
            <Text style={styles.userName}>{user?.name || 'Visitor'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={logout}>
          <LogOut size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Notification if Completed */}
        {latestPass?.status === 'completed' && (
          <View style={styles.successNotify}>
            <CheckCircle size={24} color={Colors.background} />
            <View>
              <Text style={styles.successTitle}>ACCESS SUCCESSFUL!</Text>
              <Text style={styles.successSub}>Verification complete. You can go now.</Text>
            </View>
          </View>
        )}

        {/* Active Temporary Pass */}
        <View style={styles.passCard}>
          <View style={styles.passHeader}>
            <Text style={styles.passTitle}>Active Visitor Pass</Text>
            <View style={[styles.validBadge, latestPass?.status === 'completed' && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <Text style={[styles.validText, latestPass?.status === 'completed' && { color: '#AAA' }]}>
                {latestPass?.status?.toUpperCase() || 'NO PASS'}
              </Text>
            </View>
          </View>
          
          <View style={[styles.qrContainer, latestPass?.status === 'completed' && { opacity: 0.5 }]}>
            {latestPass ? (
              <QRCode
                value={latestPass.qrCode}
                size={180}
                color={latestPass.status === 'completed' ? '#999' : Colors.primary}
                backgroundColor="transparent"
              />
            ) : (
              <View style={{ width: 180, height: 180, justifyContent: 'center', alignItems: 'center' }}>
                 <ActivityIndicator color={Colors.primary} />
              </View>
            )}
          </View>

          <View style={styles.passFooter}>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Ref ID</Text>
              <Text style={styles.footerValue}>{latestPass?.qrCode || 'N/A'}</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Exit Time</Text>
              <Text style={styles.footerValue}>{latestPass?.exitTime || '--:--'}</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.applyBtn} onPress={() => router.push('/(visitor)/apply' as any)}>
          <View style={styles.applyIcon}>
            <Plus size={24} color="#000" />
          </View>
          <View>
            <Text style={styles.applyTitle}>Apply for New Pass</Text>
            <Text style={styles.applySub}>Request entry for another date</Text>
          </View>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Navigation size={20} color={Colors.primary} />
            <Text style={styles.infoTitle}>Campus Guidelines</Text>
          </View>
          <View style={styles.guidelines}>
            <Text style={styles.guideItem}>• Keep your QR pass ready at gates</Text>
            <Text style={styles.guideItem}>• Carry a valid ID proof (Aadhar/PAN)</Text>
            <Text style={styles.guideItem}>• Entry allowed only during specified hours</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(visitor)/requests' as any)}>
          <FileText size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(visitor)/history' as any)}>
          <History size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(visitor)/profile' as any)}>
          <UserIcon size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 40 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 12, color: Colors.textSecondary },
  userName: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  iconBtn: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(255, 61, 113, 0.1)' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  successNotify: { backgroundColor: Colors.primary, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  successTitle: { fontSize: 16, fontWeight: '900', color: Colors.background, letterSpacing: 0.5 },
  successSub: { fontSize: 11, color: Colors.background, fontWeight: '600', opacity: 0.8 },
  passCard: { backgroundColor: Colors.surface, borderRadius: 28, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 24 },
  passHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  passTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  validBadge: { backgroundColor: 'rgba(25, 230, 94, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  validText: { color: Colors.primary, fontSize: 11, fontWeight: '800' },
  qrContainer: { padding: 20, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 30 },
  passFooter: { width: '100%', flexDirection: 'row', gap: 40, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
  footerItem: { flex: 1 },
  footerLabel: { fontSize: 10, color: Colors.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
  footerValue: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  applyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(25, 230, 94, 0.05)', borderRadius: 24, padding: 20, gap: 16, borderWidth: 1, borderColor: 'rgba(25, 230, 94, 0.1)' },
  applyIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  applyTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  applySub: { fontSize: 12, color: Colors.textSecondary },
  infoSection: { marginTop: 32, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  guidelines: { gap: 10 },
  guideItem: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
