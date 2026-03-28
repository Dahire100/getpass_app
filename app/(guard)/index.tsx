import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, HelpCircle, Zap, RefreshCw, QrCode as QrIcon, CheckCircle2, History as HistoryIcon, LayoutDashboard, Settings } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function GuardScanner() {
  const router = useRouter();
  const { logout } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [flash, setFlash] = useState(false);
  const scanAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const result = JSON.parse(data);
      setScanResult(result);
    } catch (e) {
      setScanResult({ name: 'Unknown User', id: 'Invalid QR', role: 'Unknown', status: 'Invalid' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Camera */}
      <CameraView 
        style={StyleSheet.absoluteFill} 
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        enableTorch={flash}
      />

      {/* Header Overlay */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Gate Pass</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <HelpCircle size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Viewfinder Overlay */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.middleRow}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            <Animated.View 
              style={[
                styles.scanLine, 
                { transform: [{ translateY: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 240] }) }] }
              ]} 
            />
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}>
          <Text style={styles.hintText}>Position QR code within frame</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setFlash(!flash)}>
          <Zap size={24} color={flash ? Colors.primary : "#FFF"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainActionBtn} onPress={() => setScanned(false)}>
          <QrIcon size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <RefreshCw size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Result Bottom Sheet */}
      {scanned && (
        <View style={styles.resultSheet}>
          <View style={styles.dragHandle} />
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.statusLabel}>Scan Status</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusIconCircle}>
                  <CheckCircle2 size={16} color="#000" strokeWidth={3} />
                </View>
                <Text style={styles.statusTitle}>Access Granted</Text>
              </View>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Time</Text>
              <Text style={styles.timeValue}>10:42 AM</Text>
            </View>
          </View>

          <View style={styles.userCard}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_J2-jvjvS4LITG2LasZwmZJcMbMh6F6PgTjYwCYckibEPLKxhrt6zlmpDKDdxgBOeG-_EDcvLIX5Wz_tR0HLY_BWRDIDULl7vQ1RMxEHD5yUQhQ8XR_827EUoZl0v2f2wdABBMxjDBcC9-grUTTbkkH_LI-9oyunPTQNrBykH1d0IgRgjF46PwT2Dx4izFdIoct7jE7D_XNxhRegoi5axznamZL4NbNj_2N_pl8qwCfhLWjVeRO-t1SVw9yUfdxlZea4eORNxCiA-' }}
                style={styles.resultAvatar}
              />
              <View style={styles.userStatusBadge}>
                <Text style={styles.userStatusText}>ACTIVE</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userInfoTop}>
                <View>
                  <Text style={styles.resName}>Alex Johnson</Text>
                  <Text style={styles.resId}>Student ID: 20234589</Text>
                </View>
                <View style={styles.campusBadge}>
                  <Text style={styles.campusText}>Campus A</Text>
                </View>
              </View>
              <View style={styles.resGrid}>
                <View style={styles.resGridItem}>
                  <Text style={styles.resGridLabel}>Department</Text>
                  <Text style={styles.resGridValue}>Computer Science</Text>
                </View>
                <View style={styles.resGridItem}>
                  <Text style={styles.resGridLabel}>Expires</Text>
                  <Text style={styles.resGridValue}>Oct 12, 5:00 PM</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.logsButton}>
              <HistoryIcon size={20} color={Colors.text} />
              <Text style={styles.logsButtonText}>View Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={() => setScanned(false)}>
              <CheckCircle2 size={20} color="#000" />
              <Text style={styles.confirmButtonText}>Confirm Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Nav */}
      {!scanned && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <LayoutDashboard size={26} color={Colors.primary} />
            <Text style={[styles.navText, { color: Colors.primary }]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(guard)/scan' as any)}>
            <QrIcon size={26} color={Colors.textSecondary} />
            <Text style={styles.navText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(guard)/history' as any)}>
            <HistoryIcon size={26} color={Colors.textSecondary} />
            <Text style={styles.navText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(guard)/profile' as any)}>
            <Settings size={26} color={Colors.textSecondary} />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: 'rgba(0,0,0,0.4)' },
  headerBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  overlay: { flex: 1 },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  middleRow: { flexDirection: 'row', height: 260 },
  viewfinder: { width: 260, height: 260, borderRadius: 30, overflow: 'hidden', backgroundColor: 'transparent' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: Colors.primary, borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
  scanLine: { width: '100%', height: 2, backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  hintText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '500', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  controls: { position: 'absolute', bottom: 100, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, zIndex: 20 },
  controlBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  mainActionBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 15 },
  resultSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingTop: 12, minHeight: '45%', zIndex: 30 },
  dragHandle: { width: 40, height: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 20 },
  statusLabel: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusIconCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  statusTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  timeInfo: { alignItems: 'flex-end' },
  timeLabel: { fontSize: 10, color: Colors.textSecondary },
  timeValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  userCard: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', gap: 16 },
  avatarWrapper: { position: 'relative' },
  resultAvatar: { width: 80, height: 80, borderRadius: 12 },
  userStatusBadge: { position: 'absolute', bottom: -8, right: -8, backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 2, borderColor: Colors.surface },
  userStatusText: { fontSize: 9, fontWeight: '900', color: '#000' },
  userInfo: { flex: 1 },
  userInfoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  resName: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  resId: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  campusBadge: { backgroundColor: 'rgba(25, 230, 94, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  campusText: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
  resGrid: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12, gap: 16 },
  resGridItem: { flex: 1 },
  resGridLabel: { fontSize: 9, color: Colors.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
  resGridValue: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  actionButtons: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 20 },
  logsButton: { flex: 1, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  logsButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  confirmButton: { flex: 1, height: 56, borderRadius: 16, backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  confirmButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: Colors.background },
  permissionText: { color: '#FFF', textAlign: 'center', marginBottom: 24, fontSize: 16 },
  permissionBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  permissionBtnText: { color: '#000', fontWeight: '700' },
});
