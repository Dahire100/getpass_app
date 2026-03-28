import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, Home, QrCode as QrIcon, History as HistoryIcon, User as UserIcon, CheckCircle, Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GuardHistoryScreen() {
  const router = useRouter();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const res = await axios.get(`${API_URL}/passes/all`);
        // Show scans the guard has processed (approved, completed, etc)
        setPasses(res.data.filter((p: any) => ['approved', 'completed', 'expired', 'rejected'].includes(p.status.toLowerCase())));
      } catch (err) {
        console.error('Failed to fetch passes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPasses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(guard)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : passes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <HistoryIcon size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No recent scans</Text>
          </View>
        ) : (
          passes.map((pass) => (
            <View key={pass._id} style={styles.passCard}>
              <View style={styles.passRow}>
                <View style={styles.passStatusIcon}>
                  {pass.status === 'approved' ? <CheckCircle size={20} color="#19E65E" /> : <Clock size={20} color={Colors.textSecondary} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passReason}>{pass.userId?.name || 'Unknown'} - {pass.qrCode}</Text>
                  <Text style={styles.passDate}>{pass.exitDate} at {pass.exitTime}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(guard)')}>
          <Home size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(guard)/scan' as any)}>
          <QrIcon size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <HistoryIcon size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(guard)/profile' as any)}>
          <UserIcon size={24} color={Colors.textSecondary} />
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
  scrollContent: { padding: 20, paddingBottom: 110 },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary },
  passCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  passStatusIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  passReason: { fontSize: 15, fontWeight: '700', color: Colors.text },
  passDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
