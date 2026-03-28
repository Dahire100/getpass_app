import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, Home, FileText, History as HistoryIcon, User as UserIcon, Plus, Clock, CheckCircle } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function VisitorRequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/passes/history`);
      // Show only pending or recently approved (but not completed)
      setRequests(res.data.filter((p: any) => p.status === 'pending' || p.status === 'approved'));
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(visitor)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Requests</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No active requests</Text>
            <TouchableOpacity style={styles.applyBtn} onPress={() => router.push('/(visitor)/apply' as any)}>
              <Text style={styles.applyBtnText}>New Visit Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          requests.map((req) => (
            <View key={req._id} style={styles.reqCard}>
               <View style={styles.reqHeader}>
                  <View style={styles.statusBox}>
                    {req.status === 'pending' ? <Clock size={20} color="#FFB800" /> : <CheckCircle size={20} color={Colors.primary} />}
                  </View>
                  <View style={{ flex: 1 }}>
                     <Text style={styles.reqTitle}>{req.reason}</Text>
                     <Text style={styles.reqDate}>{req.exitDate} • {req.exitTime}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: req.status === 'approved' ? 'rgba(25,230,94,0.1)' : 'rgba(255,184,0,0.1)' }]}>
                     <Text style={[styles.badgeText, { color: req.status === 'approved' ? Colors.primary : '#FFB800' }]}>
                        {req.status.toUpperCase()}
                     </Text>
                  </View>
               </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(visitor)')}>
          <Home size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FileText size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(visitor)/history' as any)}>
          <HistoryIcon size={24} color={Colors.textSecondary} />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 110 },
  emptyContainer: { alignItems: 'center', marginTop: 100, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary },
  applyBtn: { marginTop: 12, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 12 },
  applyBtnText: { color: Colors.background, fontWeight: '700', fontSize: 14 },
  reqCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  reqHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center' },
  reqTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  reqDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
