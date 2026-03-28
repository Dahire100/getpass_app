import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { LogOut, Bell, History, Calendar, ArrowRight, QrCode as QrIcon, Home, User as UserIcon, CheckCircle } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { cacheData, getCachedData } from '../utils/cache';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    // 1. First load from cache for immediate UI (Offline support)
    const loadCache = async () => {
      const cachedPasses = await getCachedData('student_passes');
      if (cachedPasses) setPasses(cachedPasses);
      setLoading(false); // Can show cached data while loading new
    };
    loadCache();

    // 2. Fetch fresh data from server
    fetchPasses().then((freshData) => {
        if (freshData) cacheData('student_passes', freshData);
    });

    const interval = setInterval(async () => {
        const freshData = await fetchPasses();
        if (freshData) cacheData('student_passes', freshData);
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPasses();
  }, []);

  const latestPass = passes[0];

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarPlaceholder}>
             <Text style={styles.avatarInitial}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifyBtn} onPress={() => router.push('/(student)/notifications' as any)}>
          <Bell size={24} color={Colors.textSecondary} />
          {latestPass?.status === 'completed' && <View style={styles.notifyDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Success Notification if Completed */}
        {latestPass?.status === 'completed' && (
          <View style={styles.successNotify}>
            <CheckCircle size={24} color={Colors.background} />
            <View style={{ flex: 1 }}>
              <Text style={styles.successTitle}>VERIFICATION SUCCESSFUL!</Text>
              <Text style={styles.successSub}>Gatekeeper has verified your ID. You can go now.</Text>
            </View>
          </View>
        )}

        {/* ID Info Card */}
        <View style={styles.idCard}>
          <View style={styles.idRow}>
            <View>
              <Text style={styles.idLabel}>Student ID</Text>
              <Text style={styles.idValue}>{user?.rollNo || 'N/A'}</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
          <View style={styles.idFooter}>
            <View>
              <Text style={styles.idSubLabel}>Role</Text>
              <Text style={styles.idSubValue}>Student</Text>
            </View>
            <View>
              <Text style={styles.idSubLabel}>Joined</Text>
              <Text style={styles.idSubValue}>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        {/* Hero Action Card */}
        <TouchableOpacity style={styles.heroCard} activeOpacity={0.9} onPress={() => router.push('/(student)/apply' as any)}>
          <View style={styles.heroGlow} />
          <View style={styles.heroIconContainer}>
            <QrIcon size={28} color={Colors.primary} />
          </View>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>New Gate Pass</Text>
            <Text style={styles.heroDesc}>Generate a QR code for secure entry or exit from the campus.</Text>
          </View>
          <View style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>Apply Now</Text>
            <ArrowRight size={18} color={Colors.background} />
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(student)/history' as any)}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}>
              <History size={24} color="#38BDF8" />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(student)/passes' as any)}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(192, 132, 252, 0.1)' }]}>
              <Calendar size={24} color="#C084FC" />
            </View>
            <Text style={styles.actionText}>Passes</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Requests */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          <TouchableOpacity onPress={() => fetchPasses()}>
            <Text style={styles.viewAllText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsList}>
          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
          ) : passes.length === 0 ? (
            <Text style={styles.emptyText}>No recent pass requests found.</Text>
          ) : (
            passes.slice(0, 5).map((req, i) => (
              <View key={req._id} style={styles.requestItem}>
                <View style={styles.reqIcon}>
                  <History size={20} color={Colors.textSecondary} />
                </View>
                <View style={styles.reqInfo}>
                  <Text style={styles.reqTitle}>{req.reason}</Text>
                  <Text style={styles.reqTime}>{req.exitDate} • {req.exitTime}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(req.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutBtnText}>Logout Session</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/passes' as any)}>
          <QrIcon size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Passes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/history' as any)}>
          <History size={24} color={Colors.textSecondary} />
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
  profileContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  avatarInitial: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#333' },
  welcomeText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  userName: { fontSize: 18, fontWeight: '700', color: Colors.text },
  notifyBtn: { position: 'relative', padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  notifyDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, borderWidth: 2, borderColor: '#112116' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  successNotify: { backgroundColor: Colors.primary, borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  successTitle: { fontSize: 16, fontWeight: '900', color: Colors.background, letterSpacing: 0.5 },
  successSub: { fontSize: 11, color: Colors.background, fontWeight: '600', opacity: 0.8, lineHeight: 16 },
  idCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 24 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  idLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  idValue: { fontSize: 16, fontWeight: '700', color: Colors.text },
  activeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, backgroundColor: 'rgba(25, 230, 94, 0.2)', borderWidth: 1, borderColor: 'rgba(25, 230, 94, 0.3)' },
  activeBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  idFooter: { flexDirection: 'row', gap: 32, marginTop: 20 },
  idSubLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  idSubValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  heroCard: { backgroundColor: '#0A1A10', borderRadius: 24, padding: 24, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(25, 230, 94, 0.1)' },
  heroGlow: { position: 'absolute', top: -100, right: -100, width: 220, height: 220, borderRadius: 110, backgroundColor: Colors.primary, opacity: 0.1 },
  heroIconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heroTextContainer: { marginBottom: 20 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  applyBtn: { flexDirection: 'row', height: 48, backgroundColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  applyBtnText: { color: Colors.background, fontSize: 15, fontWeight: '700' },
  quickActions: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  actionBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 16, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  actionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  viewAllText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  requestsList: { gap: 12, marginBottom: 32 },
  requestItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  reqIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reqInfo: { flex: 1 },
  reqTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  reqTime: { fontSize: 12, color: Colors.textSecondary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 20, fontSize: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  logoutBtnText: { color: Colors.danger, fontWeight: '600' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '500', color: Colors.textSecondary },
});
