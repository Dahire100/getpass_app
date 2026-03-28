import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, Search, Plus, Filter, MoreVertical, UserPlus, UserCheck, UserX, ShieldCheck } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

export default function UserManagementScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch users here. Mocking for UI.
    setTimeout(() => {
        setUsers([
            { id: '1', name: 'John Doe', role: 'student', email: 'john@example.com', dept: 'CS', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrTFCcoGQDyV9pJ0b-RmD62NlStf43nBggqdQXuF38qH5KFTB9EI_k5hJyzsEA-ytRPut7vc49RJ9_3ft4k2aWJYVYdTFpXJydhe8gYJRu9f-YrfdTLcAXszUOTAqSfpJn7W2xjc-uLI6quFD9UCyfNjlyy4tPB_40rRC80HX-Pa58CEKHbq1ZE8TSR5adn77ALsGc8a47VY2djGppSkjac7k8_vm5g_hUZBIzRSTMNREpySXyEByGRPiRR7xsnfThwGhUK8U5feY1' },
            { id: '2', name: 'Jane Smith', role: 'student', email: 'jane@example.com', dept: 'EE', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqEpTA9r6-cbbcOkiL9lpcpt3aO5icTElsFP5UiIlU9KZ0Jxh36Xw6QJ_uICRcGzmCRmw0qRA5cQYo5kF-e7KJqT2-E1pKR1NyhBjS6cTqlxZHB2Gi29feoG6uGQ_CBuh3Z1vNofloGzWAwsOsZepVEHisZe81CJgGfXIgQagkNpcmoKGcKe1Tn-B_9F-qM9q1Cz2buAqxN-gFbUb6J5Smb7IvaZO7t0cXkR8caXNFMn67USbORcTYnZ8x3rWwREvHzdk1BMqIFis' },
            { id: '3', name: 'Dr. Robert', role: 'faculty', email: 'robert@faculty.com', dept: 'Physics', avatar: null }
        ]);
        setLoading(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Management</Text>
          <TouchableOpacity style={styles.plusBtn}>
            <UserPlus size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by name, email or ID..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
           <View style={styles.smallStat}>
              <Text style={styles.statVal}>1,245</Text>
              <Text style={styles.statLab}>Total Students</Text>
           </View>
           <View style={styles.smallStat}>
              <Text style={styles.statVal}>84</Text>
              <Text style={styles.statLab}>Faculty</Text>
           </View>
           <View style={styles.smallStat}>
              <Text style={[styles.statVal, { color: Colors.primary }]}>12</Text>
              <Text style={styles.statLab}>Admins</Text>
           </View>
        </View>

        <Text style={styles.sectionTitle}>User Directory</Text>
        
        {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
            users.map(user => (
                <View key={user.id} style={styles.userCard}>
                   <View style={styles.userMain}>
                      {user.avatar ? (
                        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                      ) : (
                        <View style={[styles.userAvatar, { backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                           <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
                        </View>
                      )}
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <View style={styles.roleRow}>
                            <View style={[styles.roleBadge, { backgroundColor: user.role === 'faculty' ? 'rgba(99,102,241,0.1)' : 'rgba(25,230,94,0.1)' }]}>
                                <Text style={[styles.roleText, { color: user.role === 'faculty' ? '#6366F1' : Colors.primary }]}>
                                    {user.role.toUpperCase()}
                                </Text>
                            </View>
                            <Text style={styles.userDept}>• {user.dept}</Text>
                        </View>
                      </View>
                      <TouchableOpacity>
                         <MoreVertical size={20} color={Colors.textSecondary} />
                      </TouchableOpacity>
                   </View>
                </View>
            ))
        )}
      </ScrollView>

      {/* Action FAB */}
      <TouchableOpacity style={styles.fab}>
         <Plus size={30} color={Colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, paddingTop: 40, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  plusBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(25,230,94,0.05)', justifyContent: 'center', alignItems: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14, marginLeft: 12 },
  filterBtn: { padding: 4 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  smallStat: { flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statVal: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  statLab: { fontSize: 10, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 16 },
  userCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  userMain: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  userAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  avatarInitial: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  userEmail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  roleText: { fontSize: 10, fontWeight: '800' },
  userDept: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
});
