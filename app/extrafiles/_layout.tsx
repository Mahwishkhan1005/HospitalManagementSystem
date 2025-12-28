import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="hospitals" options={{ headerShown: false }} />
      <Stack.Screen name="doctors_details" options={{ headerShown: false }} />
      <Stack.Screen name="hospital_details" options={{ headerShown: false }} />
    </Stack>
  );
}
