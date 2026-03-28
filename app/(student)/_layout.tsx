import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="apply" />
      <Stack.Screen name="history" />
      <Stack.Screen name="passes" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
