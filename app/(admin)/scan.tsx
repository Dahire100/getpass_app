import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, LayoutList, UserCircle, QrCode as QrIcon } from 'lucide-react-native';

export default function AdminScanScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(admin)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Pass</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <QrIcon size={80} color={Colors.primary} />
        <Text style={styles.title}>QR Scanner Module</Text>
        <Text style={styles.subtitle}>Camera preview will be available on physical device.</Text>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(admin)')}>
          <Home size={22} color={Colors.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <QrIcon size={22} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Scan</Text>
        </TouchableOpacity>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#FFF', marginTop: 20 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 25 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
