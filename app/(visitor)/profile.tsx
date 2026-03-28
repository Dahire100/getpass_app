import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, FileText, History as HistoryIcon, User as UserIcon, LogOut, Edit2, Check, X } from 'lucide-react-native';
import { useState } from 'react';

export default function VisitorProfileScreen() {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(visitor)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visitor Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'V'}</Text>
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
            <Text style={styles.title}>{user?.name || 'Guest User'}</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Edit2 size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.subtitle}>{user?.email || 'visitor@example.com'}</Text>
        
        <TouchableOpacity style={styles.logoutRow} onPress={logout}>
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Logout Session</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(visitor)')}>
          <Home size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(visitor)/requests' as any)}>
          <FileText size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(visitor)/history' as any)}>
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
  content: { flex: 1, alignItems: 'center', padding: 20, paddingTop: 60, gap: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.primary },
  avatarText: { fontSize: 40, fontWeight: '800', color: Colors.primary },
  title: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', paddingHorizontal: 20 },
  nameInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, color: '#FFF', fontSize: 18, fontWeight: '700', borderWidth: 1, borderColor: Colors.primary },
  editActions: { flexDirection: 'row', gap: 8 },
  saveBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  cancelBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary },
  logoutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 20, marginTop: 40, width: '100%', backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 16 },
  logoutText: { color: Colors.danger, fontWeight: '600', fontSize: 16 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
