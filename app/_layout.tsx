import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(hospital)" options={{ headerShown: false }} />
      <Stack.Screen name="(patients)" options={{ headerShown: false }} />
      <Stack.Screen name="(receptionist)" options={{ headerShown: false }} />
      <Stack.Screen name="(superAdmin)" options={{ headerShown: false }} />
      <Stack.Screen name="receptionist" options={{ headerShown: false }} />

      <Stack.Screen name="extrafiles" options={{ headerShown: false }} />
      {/* <Stack.Screen name="hospitals" options={{ headerShown: false }} />
      <Stack.Screen name="doctors_details" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
