import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, Home, QrCode as QrIcon, History as HistoryIcon, User as UserIcon, Search } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

export default function GuardScanScreen() {
  const router = useRouter();
  const [manualId, setManualId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!manualId.trim()) {
      Alert.alert('Error', 'Please enter a Pass Reference ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/passes/verify/${manualId}`);
      // Redirect to the result page with the pass data
      router.push({
        pathname: '/(guard)/result',
        params: { passData: JSON.stringify(response.data) }
      } as any);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Not Found', 'Invalid Pass ID or Pass does not exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(guard)')}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Pass</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.scannerPlaceholder}>
          <QrIcon size={100} color={Colors.primary} />
          <Text style={styles.title}>Scanner Standby</Text>
          <Text style={styles.subtitle}>Scan QR or use manual entry below</Text>
        </View>

        <View style={styles.manualEntry}>
          <Text style={styles.manualTitle}>Manual ID Verification</Text>
          <View style={styles.inputContainer}>
            <Search size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Enter Pass ID (e.g. PASS-XXXXX)" 
              placeholderTextColor={Colors.textSecondary} 
              autoCapitalize="characters"
              value={manualId}
              onChangeText={setManualId}
            />
          </View>
          <TouchableOpacity 
            style={[styles.verifyBtn, loading && { opacity: 0.7 }]} 
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.verifyBtnText}>Verify ID</Text>}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(guard)')}>
          <Home size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <QrIcon size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(guard)/history' as any)}>
          <HistoryIcon size={24} color={Colors.textSecondary} />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(guard)/profile' as any)}>
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
  content: { flex: 1, padding: 24, gap: 32 },
  scannerPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#FFF', marginTop: 10 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  manualEntry: { backgroundColor: Colors.surface, padding: 24, borderRadius: 24, borderWidth: 1, borderColor: Colors.divider },
  manualTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, paddingHorizontal: 16, borderRadius: 16, height: 56, borderWidth: 1, borderColor: Colors.divider, marginBottom: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: Colors.text, height: '100%' },
  verifyBtn: { height: 56, backgroundColor: Colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  verifyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
