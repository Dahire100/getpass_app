import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { ArrowLeft, Home, FileText, History as HistoryIcon, User as UserIcon, Calendar, Clock, CheckCircle } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function VisitorHistoryScreen() {
  const router = useRouter();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/passes/history`);
      setPasses(res.data);
    } catch (err) {
      console.error('Failed to fetch visitor passes', err);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(visitor)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit History</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : passes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <HistoryIcon size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No past visits found</Text>
          </View>
        ) : (
          passes.map((pass) => (
            <View key={pass._id} style={styles.passCard}>
               <View style={styles.passHeader}>
                  <View style={styles.iconBox}>
                    <Calendar size={20} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                     <Text style={styles.passTitle}>{pass.reason}</Text>
                     <Text style={styles.passDate}>{pass.exitDate} • {pass.exitTime}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: pass.status === 'completed' ? 'rgba(25,230,94,0.1)' : 'rgba(255,184,0,0.1)' }]}>
                     <Text style={[styles.statusText, { color: pass.status === 'completed' ? Colors.primary : '#FFB800' }]}>
                        {pass.status.toUpperCase()}
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
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(visitor)/requests' as any)}>
          <FileText size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <HistoryIcon size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>History</Text>
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
  passCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  passHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(25,230,94,0.1)', justifyContent: 'center', alignItems: 'center' },
  passTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  passDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
