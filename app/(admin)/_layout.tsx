import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scan" />
      <Stack.Screen name="requests" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="users" />
    </Stack>
  );
}
