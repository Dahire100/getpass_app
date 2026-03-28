import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, History as HistoryIcon, Home, QrCode as QrIcon, User as UserIcon, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { cacheData, getCachedData } from '../utils/cache';

export default function PassesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const fetchPasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/passes/history`);
      setPasses(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch passes', err);
      return null;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadCache = async () => {
      const cached = await getCachedData('student_passes');
      if (cached) setPasses(cached);
    };
    loadCache();

    fetchPasses().then(data => {
      if (data) cacheData('student_passes', data);
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPasses();
  }, []);

  const filteredPasses = filter === 'all' ? passes : passes.filter(p => p.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={20} color="#19E65E" />;
      case 'pending': return <Clock size={20} color="#FFB800" />;
      case 'rejected': return <XCircle size={20} color="#FF3B30" />;
      default: return <Clock size={20} color={Colors.textSecondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#19E65E';
      case 'pending': return '#FFB800';
      case 'rejected': return '#FF3B30';
      case 'expired': return '#8F9BB3';
      default: return Colors.textSecondary;
    }
  };

  const filters = ['all', 'pending', 'approved', 'rejected', 'expired'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(student)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Passes</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Filter Tabs */}
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
            <QrIcon size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No passes found</Text>
            <TouchableOpacity style={styles.applyBtn} onPress={() => router.push('/(student)/apply' as any)}>
              <Text style={styles.applyBtnText}>Apply for a Pass</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredPasses.map((pass) => (
            <View key={pass._id} style={styles.passCard}>
              <View style={styles.passRow}>
                <View style={styles.passStatusIcon}>
                  {getStatusIcon(pass.status)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passReason}>{pass.reason}</Text>
                  <Text style={styles.passDate}>{pass.exitDate} at {pass.exitTime}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pass.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(pass.status) }]}>
                    {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                  </Text>
                </View>
              </View>
              {pass.qrCode && (
                <View style={styles.qrRow}>
                  <QrIcon size={14} color={Colors.primary} />
                  <Text style={styles.qrText}>{pass.qrCode}</Text>
                </View>
              )}
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
        <TouchableOpacity style={styles.navItem}>
          <QrIcon size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Passes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/history' as any)}>
          <HistoryIcon size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>History</Text>
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
  filterBar: { maxHeight: 50, paddingHorizontal: 20 },
  filterContent: { gap: 8, paddingRight: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  applyBtn: { marginTop: 12, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 12 },
  applyBtnText: { color: Colors.background, fontWeight: '700', fontSize: 14 },
  passCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  passStatusIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  passReason: { fontSize: 15, fontWeight: '700', color: Colors.text },
  passDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  qrRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  qrText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '500', color: Colors.textSecondary },
});
