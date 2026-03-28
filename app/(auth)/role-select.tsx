import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { User, Shield, GraduationCap, Building2 } from 'lucide-react-native';

const roles = [
  { id: 'student', title: 'Student', icon: GraduationCap, color: Colors.roles.student, description: 'Quick access with your college ID' },
  { id: 'visitor', title: 'Visitor', icon: User, color: Colors.roles.visitor, description: 'Temporary entry for guests' },
  { id: 'guard', title: 'Campus Security', icon: Shield, color: Colors.roles.guard, description: 'Scan & verify entries' },
  { id: 'admin', title: 'Administrator', icon: Building2, color: Colors.roles.admin, description: 'Manage campus and reports' },
];

export default function RoleSelectScreen() {
  const router = useRouter();

  const handleRoleSelect = (roleId: string) => {
    router.push({ pathname: '/(auth)/register', params: { role: roleId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Who are you?</Text>
          <Text style={styles.subtitle}>Select your role to continue</Text>
        </View>

        <View style={styles.rolesGrid}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[styles.roleCard, { borderColor: role.color + '20' }]}
              onPress={() => handleRoleSelect(role.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: role.color + '15' }]}>
                <role.icon size={32} color={role.color} />
              </View>
              <View style={styles.roleInfo}>
                <Text style={[styles.roleTitle, { color: role.id === 'guard' ? Colors.danger : Colors.text }]}>{role.title}</Text>
                <Text style={styles.roleDesc}>{role.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkSpan}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  rolesGrid: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  loginLink: {
    marginTop: 40,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loginLinkSpan: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
