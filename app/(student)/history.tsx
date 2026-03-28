import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, History as HistoryIcon, Home, QrCode as QrIcon, User as UserIcon, Clock, Calendar } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/passes/history`);
      setPasses(res.data);
    } catch (err) {
      console.error('Failed to fetch passes', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchPasses(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPasses();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed': return '#19E65E';
      case 'pending': return '#FFB800';
      case 'rejected': return '#FF3B30';
      case 'expired': return '#8F9BB3';
      default: return Colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(student)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pass History</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{passes.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#19E65E' }]}>{passes.filter(p => ['approved', 'completed'].includes(p.status.toLowerCase())).length}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FFB800' }]}>{passes.filter(p => p.status.toLowerCase() === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FF3B30' }]}>{passes.filter(p => p.status.toLowerCase() === 'rejected').length}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Pass List */}
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : passes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <HistoryIcon size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No pass history found</Text>
            <Text style={styles.emptySubtext}>Your gate pass requests will appear here</Text>
          </View>
        ) : (
          passes.map((pass) => (
            <View key={pass._id} style={styles.passCard}>
              <View style={styles.passHeader}>
                <View style={styles.passIconBox}>
                  <Calendar size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passReason}>{pass.reason}</Text>
                  <Text style={styles.passDate}>{pass.exitDate} • {pass.exitTime}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pass.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(pass.status) }]}>
                    {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.passFooter}>
                <View style={styles.passDetail}>
                  <Clock size={14} color={Colors.textSecondary} />
                  <Text style={styles.passDetailText}>Return: {pass.returnTime}</Text>
                </View>
                {pass.qrCode && (
                  <Text style={styles.qrCode}>QR: {pass.qrCode}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(student)')}>
          <Home size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/passes' as any)}>
          <QrIcon size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Passes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <HistoryIcon size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/profile' as any)}>
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
  scrollContent: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statNumber: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptySubtext: { fontSize: 14, color: Colors.textSecondary },
  passCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  passHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  passIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center' },
  passReason: { fontSize: 16, fontWeight: '700', color: Colors.text },
  passDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  passFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  passDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  passDetailText: { fontSize: 12, color: Colors.textSecondary },
  qrCode: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '500', color: Colors.textSecondary },
});
