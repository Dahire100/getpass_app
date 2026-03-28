import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, User, Mail, Lock, GraduationCap, Contact as IdCard } from 'lucide-react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    idNumber: '', // Aadhar/PAN for Visitor
  });

  const { register } = useAuth();
  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    try {
      await register({ ...formData, role });
      Alert.alert('Success', 'Registered successfully!', [
        { text: 'Login now', onPress: () => router.push('/(auth)/login' as any) }
      ]);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up as a <Text style={{ color: Colors.primary }}>{role}</Text></Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                placeholderTextColor={Colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder={role === 'student' ? "College Email" : "Email Address"} 
                placeholderTextColor={Colors.textSecondary}
                value={formData.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => setFormData({...formData, email: text})}
              />
            </View>

            {role === 'student' && (
              <View style={styles.inputContainer}>
                <GraduationCap size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Roll Number" 
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.rollNo}
                  onChangeText={(text) => setFormData({...formData, rollNo: text})}
                />
              </View>
            )}

            {role === 'visitor' && (
              <View style={styles.inputContainer}>
                <IdCard size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Aadhar / PAN Number" 
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.idNumber}
                  onChangeText={(text) => setFormData({...formData, idNumber: text})}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Password" 
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  form: {
    gap: 16,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: '100%',
  },
  registerButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
