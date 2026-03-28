import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, FileCheck, BarChart3, PieChart as PieIcon, Settings, UserPlus, FileSpreadsheet, Plus, Home, LayoutList, UserCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileArea}>
          <TouchableOpacity style={styles.menuBtn}>
            <LayoutList size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notifyBtn}>
            <LayoutList size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.adminAvatar}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnEP8paeVXOwCJTmQY_EGTjjZOQnQeAVOgqeGbW-3fF83qKYuvRqfQih7RLRmHWDcLHbXYU98IC_PIrd0TobpRz2RtOnOE7XtSkmb3gBwTj3H-o5AVq_0GHVktfVkj-gh2S4iZtQmDtJv6ryWD97RL8HxViYflx_mnYqbhYAOUN9-CNxWdLDQs7AKR4nIAfllJZ05_c9LHFOmoKir-dfZCs7CwnBfWQmYCVISDcuLKBQV329I0xUtsT9TGA24B-I4_fHBQhMwk_CGl' }}
              style={styles.avatarImg}
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(25, 230, 94, 0.1)' }]}>
                <Users size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statTrend}>+5%</Text>
            </View>
            <Text style={styles.statLabel}>Total Students</Text>
            <Text style={styles.statValue}>1,245</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <FileCheck size={20} color="#3B82F6" />
              </View>
              <Text style={[styles.statTrend, { color: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)' }]}>+12%</Text>
            </View>
            <Text style={styles.statLabel}>Active Passes</Text>
            <Text style={styles.statValue}>156</Text>
          </View>
        </View>

        {/* Analytics Section (Mock Chart) */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Pass Requests</Text>
              <Text style={styles.chartSub}>Last 30 Days Activity</Text>
            </View>
            <BarChart3 size={20} color={Colors.textSecondary} />
          </View>
          
          <View style={styles.mockChart}>
            {/* Mocking a bar graph with views */}
            {[40, 60, 45, 80, 55, 70, 90, 65].map((h, i) => (
              <View key={i} style={[styles.chartBar, { height: h, backgroundColor: i === 6 ? Colors.primary : 'rgba(25, 230, 94, 0.2)' }]} />
            ))}
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <Text style={styles.legendLabel}>Approved</Text>
              <Text style={[styles.legendValue, { color: Colors.primary }]}>854</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendLabel}>Rejected</Text>
              <Text style={[styles.legendValue, { color: Colors.danger }]}>124</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendLabel}>Pending</Text>
              <Text style={styles.legendValue}>45</Text>
            </View>
          </View>
        </View>

        {/* Request Distribution Section */}
        <View style={styles.distributionBox}>
          <Text style={styles.boxTitle}>Request Distribution</Text>
          <View style={styles.pieRow}>
            <View style={styles.mockPie}>
              <View style={styles.pieCenter}>
                <Text style={styles.piePercent}>92%</Text>
                <Text style={styles.pieSub}>Done</Text>
              </View>
            </View>
            <View style={styles.pieLegend}>
              <View style={styles.pieLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.pieLegendText}>Approved (65%)</Text>
              </View>
              <View style={styles.pieLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: Colors.danger }]} />
                <Text style={styles.pieLegendText}>Rejected (20%)</Text>
              </View>
              <View style={styles.pieLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: Colors.textSecondary }]} />
                <Text style={styles.pieLegendText}>Pending (15%)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.gridAction} onPress={() => router.push('/(admin)/users' as any)}>
            <View style={[styles.gridIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <UserPlus size={24} color="#6366F1" />
            </View>
            <Text style={styles.gridText}>User Control</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridAction}>
            <View style={[styles.gridIconBox, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <FileSpreadsheet size={24} color="#F97316" />
            </View>
            <Text style={styles.gridText}>Reports</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={logout}>
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Logout Admin Session</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={22} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/scan' as any)}>
          <LayoutList size={22} color={Colors.textSecondary} />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <View style={styles.fabWrapper}>
          <TouchableOpacity style={styles.fabBtn} onPress={() => router.push('/(admin)/requests' as any)}>
            <Plus size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/requests' as any)}>
          <LayoutList size={22} color={Colors.textSecondary} />
          <Text style={styles.navText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/profile' as any)}>
          <UserCircle size={22} color={Colors.textSecondary} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  profileArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuBtn: { padding: 8 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifyBtn: { padding: 8 },
  adminAvatar: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 16 }, // resizeMode passed in props usually
  scrollContent: { padding: 20, paddingBottom: 110 },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statTrend: { fontSize: 10, fontWeight: '800', color: Colors.primary, backgroundColor: 'rgba(25, 230, 94, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  chartSection: { backgroundColor: Colors.surface, borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  chartSub: { fontSize: 11, color: Colors.textSecondary },
  mockChart: { height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, paddingHorizontal: 10, paddingBottom: 8 },
  chartBar: { width: width / 12, borderRadius: 8 },
  chartLegend: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 16, marginTop: 16 },
  legendItem: { flex: 1, alignItems: 'center' },
  legendLabel: { fontSize: 10, color: Colors.textSecondary, marginBottom: 4 },
  legendValue: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  distributionBox: { backgroundColor: Colors.surface, borderRadius: 24, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  boxTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 24 },
  pieRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  mockPie: { width: 100, height: 100, borderRadius: 50, borderWidth: 10, borderColor: Colors.primary, borderLeftColor: Colors.danger, borderBottomColor: Colors.textSecondary, justifyContent: 'center', alignItems: 'center' },
  pieCenter: { alignItems: 'center' },
  piePercent: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  pieSub: { fontSize: 8, color: Colors.textSecondary, textTransform: 'uppercase' },
  pieLegend: { flex: 1, gap: 10 },
  pieLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorDot: { width: 8, height: 8, borderRadius: 4 },
  pieLegendText: { fontSize: 12, color: Colors.textSecondary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 16, paddingLeft: 4 },
  actionGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  gridAction: { flex: 1, backgroundColor: Colors.surface, borderRadius: 24, padding: 24, alignItems: 'center', gap: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  gridIconBox: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  gridText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  logoutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  logoutText: { color: Colors.danger, fontWeight: '600' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 25 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  fabWrapper: { flex: 1, alignItems: 'center', position: 'relative', top: -20 },
  fabBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
});
