import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Mail, Lock, UserCog } from 'lucide-react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'visitor' | 'guard' | 'admin'>('student');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    try {
      await authLogin(email, password, role);
    } catch (err: any) {
      Alert.alert('Login failed', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your credentials to login</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Email Address" 
                placeholderTextColor={Colors.textSecondary} 
                keyboardType="email-address" 
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Password" 
                placeholderTextColor={Colors.textSecondary} 
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.rolePickerContainer}>
              <Text style={styles.rolePickerLabel}>Login as:</Text>
              <View style={styles.roleOptions}>
                {['student', 'visitor', 'guard', 'admin'].map((r) => (
                  <TouchableOpacity 
                    key={r}
                    style={[styles.roleOption, role === r && styles.roleOptionActive]}
                    onPress={() => setRole(r as any)}
                  >
                    <Text style={[styles.roleOptionText, role === r && styles.roleOptionTextActive]}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/(auth)/role-select')}>
            <Text style={styles.registerLinkText}>Don't have an account? <Text style={styles.registerLinkSpan}>Register</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 24, paddingTop: 80 },
  header: { marginBottom: 60 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 18, color: Colors.textSecondary },
  form: { gap: 16, marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: 16, borderRadius: 16, height: 60, borderWidth: 1, borderColor: Colors.divider },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: Colors.text, height: '100%' },
  rolePickerContainer: { marginTop: 16 },
  rolePickerLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 12, marginLeft: 4 },
  roleOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.divider },
  roleOptionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleOptionText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  roleOptionTextActive: { color: '#FFF' },
  loginButton: { height: 56, backgroundColor: Colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  registerLink: { marginTop: 40, alignItems: 'center' },
  registerLinkText: { fontSize: 16, color: Colors.textSecondary },
  registerLinkSpan: { color: Colors.primary, fontWeight: '700' },
});
