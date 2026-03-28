import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, CheckCircle, ShieldCheck, Clock, XCircle, Home, QrCode as QrIcon, Bell, User as UserIcon } from 'lucide-react-native';
import { useState } from 'react';

export default function NotificationsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Pass Approved',
      subtitle: 'Pass ID: GP-84920',
      message: 'Your gate pass for Jane Doe has been approved and is ready to use.',
      time: 'Just now',
      type: 'success',
      icon: <CheckCircle size={24} color="#19E65E" />,
      unread: true
    },
    {
      id: '2',
      title: 'Security Scan Successful',
      subtitle: 'Pass ID: GP-84920',
      message: 'You have successfully scanned your QR code at the Main Gate Entry.',
      time: '15 mins ago',
      type: 'info',
      icon: <ShieldCheck size={24} color="#3B82F6" />,
      unread: true
    },
    {
      id: '3',
      title: 'Reminder: Return by 6:00 PM',
      message: 'Please ensure you return by 6:00 PM to avoid any overstay penalties.',
      time: '2 hours ago',
      type: 'warning',
      icon: <Clock size={24} color="#FFB800" />,
      unread: false
    },
    {
      id: '4',
      title: 'Pass Rejected',
      subtitle: 'Pass ID: GP-84915',
      message: 'Your request for Contractor Access was denied. Reason: Missing documentation.',
      time: 'Yesterday',
      type: 'error',
      icon: <XCircle size={24} color="#FF3B30" />,
      unread: false
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => (
          <View key={item.id} style={[styles.notiCard, item.unread && styles.unreadCard]}>
            <View style={styles.notiRow}>
              <View style={[styles.iconBox, { backgroundColor: item.type === 'success' ? 'rgba(25,230,94,0.1)' : 'rgba(255,255,255,0.05)' }]}>
                {item.icon}
              </View>
              <View style={styles.notiInfo}>
                <Text style={styles.notiTitle}>{item.title}</Text>
                {item.subtitle && <Text style={styles.notiSub}>{item.subtitle}</Text>}
                <Text style={styles.notiMsg}>{item.message}</Text>
                <Text style={styles.notiTime}>{item.time}</Text>
              </View>
              {item.unread && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.divider} />
          </View>
        ))}
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
        <TouchableOpacity style={styles.navItem}>
          <Bell size={24} color={Colors.primary} />
          <Text style={[styles.navText, { color: Colors.primary }]}>Alerts</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: 'rgba(17,33,22,0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  markRead: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  scrollContent: { paddingBottom: 100 },
  notiCard: { padding: 20, position: 'relative' },
  unreadCard: { backgroundColor: 'rgba(25,230,94,0.05)', borderLeftWidth: 4, borderLeftColor: Colors.primary },
  notiRow: { flexDirection: 'row', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  notiInfo: { flex: 1 },
  notiTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  notiSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4, fontWeight: '600' },
  notiMsg: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  notiTime: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, position: 'absolute', top: 0, right: 0 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', position: 'absolute', bottom: 0, left: 20, right: 20 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#1C261F', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 25 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
