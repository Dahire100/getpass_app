import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth, API_URL } from '../context/AuthContext';
import { Bell, Menu, Hourglass, CheckCircle, TrendingUp, ChevronRight, Stethoscope, Users, Briefcase } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ pending: 12, approved: 45 });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn}>
            <Menu size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Faculty Portal</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifyBtn}>
            <Bell size={24} color={Colors.textSecondary} />
            <View style={styles.notifyDot} />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYrolPZbYuHKKnpj6CY4SBTb0OWwDIW7s87tXd5yqfe6Uweu5Ha6lXMwGQIhsvI8Qgf9WjUfFXPjQHo6DLgwhiy0v84q1LH0LTr7OJp0ETqegw_zuXkoYbhTDCAI_f97_PPhu1eYWHIOIlxK43k5_b_-cJ9VasIRIsg_1FID7-c1mdY9csNY8flc55QmYJ5aNJH9-fVsC27ehRRI5XV_4lw6a7yxbPVWpYz3fv_TcKlAVcRxxuHe2n5KJ6OZLpl-Mt9K0sccq62_4c' }}
            style={styles.avatarImg}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,184,0,0.1)' }]}>
              <Hourglass size={20} color="#FFB800" />
            </View>
            <Text style={styles.statLabel}>Pending Requests</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{stats.pending}</Text>
              <View style={styles.trendRow}>
                <TrendingUp size={12} color={Colors.primary} />
                <Text style={styles.trendText}>+2</Text>
              </View>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(25,230,94,0.1)' }]}>
              <CheckCircle size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Approved Today</Text>
            <Text style={styles.statValue}>{stats.approved}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Priority Actions</Text>
          <TouchableOpacity onPress={() => router.push('/(faculty)/requests' as any)}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Item 1 */}
        <View style={styles.requestCard}>
          <View style={styles.cardHeader}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBR7787sPaEs2DNkszCLiJICvme7NkvSpazUWekggdYq41m2lxSH-2nyLl1z3r8OL084PKVJQ3oO1s_aWkXWlgvtQGyZXtunDmIzFT85O5vjkYYh0JTaWR6SnaVnULzN8Uj6IahWVCQl-Ayc1yySqCFNa_oK3uSCWFmVaBL3bf5sV1P5jd8kt5OjmswZMpK7nN2R22aps_cfcrPVMmHZdj7FgHgWZPWJIj9ddeey8Thqox-7qrNaVeTc1hm9wDmQ2VUHekFBAfoGYX' }}
              style={styles.studentImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>Alex Morgan</Text>
              <Text style={styles.studentDept}>Computer Science • Year 3</Text>
            </View>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          </View>
          <View style={styles.reasonBox}>
            <View style={styles.reasonHeader}>
              <Stethoscope size={14} color={Colors.textSecondary} />
              <Text style={styles.reasonTitle}>REASON</Text>
            </View>
            <Text style={styles.reasonDesc}>Severe migraine, need to visit the campus clinic immediately. Requested early exit.</Text>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.declineBtn}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.approveBtn}>
              <Text style={styles.approveText}>Review & Approve</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Priority Item 2 */}
        <View style={styles.requestCard}>
          <View style={styles.cardHeader}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqEpTA9r6-cbbcOkiL9lpcpt3aO5icTElsFP5UiIlU9KZ0Jxh36Xw6QJ_uICRcGzmCRmw0qRA5cQYo5kF-e7KJqT2-E1pKR1NyhBjS6cTqlxZHB2Gi29feoG6uGQ_CBuh3Z1vNofloGzWAwsOsZepVEHisZe81CJgGfXIgQagkNpcmoKGcKe1Tn-B_9F-qM9q1Cz2buAqxN-gFbUb6J5Smb7IvaZO7t0cXkR8caXNFMn67USbORcTYnZ8x3rWwREvHzdk1BMqIFis' }}
              style={styles.studentImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>Sarah Jenkins</Text>
              <Text style={styles.studentDept}>Electrical Eng • Year 2</Text>
            </View>
            <View style={[styles.urgentBadge, { backgroundColor: 'rgba(255,184,0,0.1)' }]}>
              <Text style={[styles.urgentText, { color: '#FFB800' }]}>Pending</Text>
            </View>
          </View>
          <View style={styles.reasonBox}>
            <View style={styles.reasonHeader}>
              <Users size={14} color={Colors.textSecondary} />
              <Text style={styles.reasonTitle}>REASON</Text>
            </View>
            <Text style={styles.reasonDesc}>Family emergency at home. Parents are waiting at the main gate.</Text>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.declineBtn}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.approveBtn}>
              <Text style={styles.approveText}>Review & Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fabBtn}>
        <ChevronRight size={32} color={Colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  iconBtn: { padding: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifyBtn: { position: 'relative', padding: 4 },
  notifyDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.background },
  avatarImg: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 },
  viewAll: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 16 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(25,230,94,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  trendText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
  requestCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  studentImg: { width: 40, height: 40, borderRadius: 20 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  studentDept: { fontSize: 12, color: Colors.textSecondary },
  urgentBadge: { backgroundColor: 'rgba(255,59,48,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  urgentText: { fontSize: 10, fontWeight: '800', color: '#FF3B30' },
  reasonBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, marginBottom: 16 },
  reasonHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  reasonTitle: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
  reasonDesc: { fontSize: 13, color: Colors.text, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 12 },
  declineBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  declineText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
  approveBtn: { flex: 2, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  approveText: { color: Colors.background, fontWeight: '800', fontSize: 14 },
  fabBtn: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
});
