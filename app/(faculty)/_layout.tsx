import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Home, ClipboardList, History, User } from 'lucide-react-native';

export default function FacultyLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#1C2E23',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        height: 85,
        paddingBottom: 20,
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
