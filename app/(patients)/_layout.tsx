import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const AdminLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2eb8b8",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="patienthome"
        options={{
          headerShown: false,
          tabBarLabel: "home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default AdminLayout;
