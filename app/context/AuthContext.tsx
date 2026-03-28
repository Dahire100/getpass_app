import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Role = 'student' | 'visitor' | 'guard' | 'admin' | null;

interface AuthContextType {
  user: any;
  role: Role;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (data: any) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import Constants from 'expo-constants';

// Dynamically detect host IP for mobile testing (Expo Go)
// Fallback to localhost for web/emulator
const getApiUrl = () => {
  const host = Constants.expoConfig?.hostUri?.split(':').shift();
  if (host && !['localhost', '127.0.0.1'].includes(host)) {
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();

function navigateToRoleDashboard(router: any, userRole: string) {
  // Small timeout to ensure state is fully updated before navigation
  setTimeout(() => {
    switch (userRole) {
      case 'student': router.replace('/(student)'); break;
      case 'visitor': router.replace('/(visitor)'); break;
      case 'guard': router.replace('/(guard)'); break;
      case 'admin': router.replace('/(admin)'); break;
      default: router.replace('/(auth)/login'); break;
    }
  }, 100);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        axios.defaults.headers.common['Authorization'] = storedToken;
      }
    } catch (e) {
      console.error('Failed to load storage', e);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle protection for unauthenticated access & auto-redirect on stored session
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isIndex = (segments as string[]).length === 0 || segments[0] === 'index' || segments[0] === undefined;
    
    if (!user && !inAuthGroup && !isIndex) {
      // Not logged in and trying to access protected route — redirect to login
      router.replace('/(auth)/login');
    } else if (user && (inAuthGroup || isIndex)) {
      // Logged in but on auth/welcome page — redirect to role dashboard
      navigateToRoleDashboard(router, role as string);
    }
  }, [user, role, segments, isLoading]);

  const login = async (email: string, password: string, userRole: Role) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password, role: userRole });
      const { token, user: loggedUser } = res.data;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(loggedUser));
      
      axios.defaults.headers.common['Authorization'] = token;
      setUser(loggedUser);
      setRole(loggedUser.role);

      // Navigate directly after login — don't rely on useEffect
      navigateToRoleDashboard(router, loggedUser.role);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    try {
      await axios.post(`${API_URL}/auth/register`, data);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) {
        console.error('No user found in context');
        return;
    }
    
    // Fallback for ID field (MongoDB _id or converted id)
    const userId = user.id || user._id;
    if (!userId) {
        console.error('User ID is missing in the local session data', user);
        throw new Error('Local session data missing, please log out and log in again.');
    }

    try {
      console.log('Pushing profile update for:', userId, data);
      const res = await axios.put(`${API_URL}/auth/profile/${userId}`, data);
      const updatedUser = res.data.user;
      
      // Update both storage environments
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('Profile updated successfully!');
    } catch (err: any) {
      console.error('Update Profile REST Error:', {
          code: err.code,
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
      });
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Server error, check your connection.';
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setRole(null);
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

