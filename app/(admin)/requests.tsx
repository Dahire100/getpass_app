import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, Home, QrCode as QrIcon, User as UserIcon, CheckCircle, Clock, XCircle, LayoutList } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function AdminRequestsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('pending');

  const fetchPasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/passes/all`);
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

  const updatePassStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/passes/${id}/status`, { status });
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`Pass ${status} successfully!`);
      } else {
        Alert.alert('Success', `Pass ${status} successfully!`);
      }
      fetchPasses();
    } catch (err) {
      console.error('Failed to update pass', err);
    }
  };

  const filteredPasses = filter === 'all' ? passes : passes.filter(p => p.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={20} color="#19E65E" />;
      case 'pending': return <Clock size={20} color="#FFB800" />;
      case 'rejected': return <XCircle size={20} color="#FF3B30" />;
      default: return <Clock size={20} color={Colors.textSecondary} />;
    }
  };

  const filters = ['pending', 'approved', 'rejected', 'all'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(admin)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pass Requests</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : filteredPasses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LayoutList size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No requests found</Text>
          </View>
        ) : (
          filteredPasses.map((pass) => (
            <View key={pass._id} style={styles.passCard}>
              <View style={styles.passRow}>
                <View style={styles.passStatusIcon}>
                  {getStatusIcon(pass.status)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passReason}>{pass.userId?.name || 'Unknown Student'} - {pass.reason}</Text>
                  <Text style={styles.passDate}>{pass.exitDate} at {pass.exitTime}</Text>
                </View>
              </View>
              {pass.status === 'pending' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => updatePassStatus(pass._id, 'rejected')}>
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => updatePassStatus(pass._id, 'approved')}>
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(admin)')}>
          <Home size={22} color={Colors.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/scan' as any)}>
          <QrIcon size={22} color={Colors.textSecondary} />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <LayoutList size={22} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/profile' as any)}>
          <UserIcon size={22} color={Colors.textSecondary} />
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
  filterBar: { maxHeight: 50, paddingHorizontal: 20 },
  filterContent: { gap: 8, paddingRight: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 110 },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  passCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  passStatusIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  passReason: { fontSize: 15, fontWeight: '700', color: Colors.text },
  passDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  rejectBtn: { backgroundColor: 'rgba(255, 59, 48, 0.1)', borderColor: 'rgba(255, 59, 48, 0.3)' },
  approveBtn: { backgroundColor: 'rgba(25, 230, 94, 0.1)', borderColor: 'rgba(25, 230, 94, 0.3)' },
  rejectText: { color: '#FF3B30', fontWeight: '700' },
  approveText: { color: '#19E65E', fontWeight: '700' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 25 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
