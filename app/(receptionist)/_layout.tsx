import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2eb8b8",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="receptionisthome"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="receptionDoctor"
        options={{
          tabBarLabel: "Doctors",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
