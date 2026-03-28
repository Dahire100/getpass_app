import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Colors } from '../constants/Colors';
import { useAuth } from './context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    if (user) {
      router.replace('/(student)'); // Or appropriate role
    } else {
      router.push('/(auth)/role-select');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>GP</Text>
          </View>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>GatePass Pro</Text>
          <Text style={styles.subtitle}>Smart & Secure Campus Access</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  logoText: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    width: '100%',
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
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
