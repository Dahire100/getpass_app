import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, History as HistoryIcon, Home, QrCode as QrIcon, User as UserIcon, LogOut, Mail, Shield, Calendar, Edit2, Check, X } from 'lucide-react-native';
import { useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await updateProfile({ name: newName });
      setIsEditing(false);
    } catch (err: any) {
      const msg = err.message || 'Update failed';
      if (typeof window !== 'undefined' && window.alert) window.alert(msg);
      else Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Mail, label: 'Email', value: user?.email || 'N/A' },
    { icon: Shield, label: 'Role', value: (user?.role || 'student').charAt(0).toUpperCase() + (user?.role || 'student').slice(1) },
    { icon: Calendar, label: 'Joined', value: new Date(user?.createdAt || Date.now()).toLocaleDateString() },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(student)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar & Name */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.statusDot} />
          </View>
          
          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.nameInput}
                value={newName}
                onChangeText={setNewName}
                autoFocus
                placeholder="Enter Name"
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
                  {loading ? <ActivityIndicator size="small" color="#000" /> : <Check size={20} color="#000" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setIsEditing(false); setNewName(user?.name || ''); }}>
                  <X size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{user?.name || 'Student'}</Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Edit2 size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{(user?.role || 'student').toUpperCase()}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {menuItems.map((item, idx) => (
            <View key={idx} style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <item.icon size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Student ID */}
        {user?.rollNo && (
          <View style={styles.idCard}>
            <Text style={styles.idLabel}>Student ID</Text>
            <Text style={styles.idValue}>{user.rollNo}</Text>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/history' as any)}>
          <HistoryIcon size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <UserIcon size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Profile</Text>
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
  profileCard: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.primary },
  avatarText: { fontSize: 40, fontWeight: '800', color: Colors.primary },
  statusDot: { position: 'absolute', bottom: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#19E65E', borderWidth: 3, borderColor: Colors.background },
  profileName: { fontSize: 24, fontWeight: '800', color: Colors.text },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '90%', marginBottom: 12 },
  nameInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, color: '#FFF', fontSize: 18, fontWeight: '700', borderWidth: 1, borderColor: Colors.primary },
  editActions: { flexDirection: 'row', gap: 8 },
  saveBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  cancelBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  profileEmail: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(25, 230, 94, 0.15)', borderWidth: 1, borderColor: 'rgba(25, 230, 94, 0.3)' },
  roleBadgeText: { fontSize: 12, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
  infoSection: { backgroundColor: Colors.surface, borderRadius: 20, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  infoIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(25, 230, 94, 0.1)', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
  idCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  idLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  idValue: { fontSize: 22, fontWeight: '800', color: Colors.primary, letterSpacing: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.2)' },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: '700' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '500', color: Colors.textSecondary },
});
