import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="hospitalhome"
        options={{ headerShown: false }}
      />
    </Tabs>
  );
}
