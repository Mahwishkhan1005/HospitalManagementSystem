import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ColorValue, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";


const ReceptionDoctor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isWeb = Platform.OS === "web";

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AccessToken");
      
      {isWeb?alert("loging out are you sure web"):Alert.alert("loging out are you sure")}
          router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const gradientColors: readonly [ColorValue, ColorValue] = isWeb
  ? ["#9BE7FF", "#6FFFE9"]
  : ["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"];



  return (
    <View className="flex-1 bg-gray-50">
      {/* Replicated Header from receptionisthome.tsx */}
      <LinearGradient
  colors={gradientColors}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  className={`
    ${isWeb ? "px-12 py-6" : "px-5 pt-10 pb-4"}
    ${isWeb ? "rounded-b-[30px]" : "rounded-b-[25px]"}
    shadow-lg
  `}
>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <FontAwesome name="heartbeat" size={isWeb ? 28 : 22} color="#2eb8b8" />
            <Text className={`${isWeb ? "text-2xl" : "text-xl"} ml-2 font-bold text-gray-800 tracking-tight`}>
              WECARE
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center bg-white/40 px-3 py-1.5 rounded-full border border-white/30"
          >
            <FontAwesome name="sign-out" size={16} color="#444" />
            <Text className="ml-2 text-gray-800 font-semibold text-xs uppercase">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className={`${isWeb ? "flex-row justify-between items-end" : "flex-col"}`}>
          <View className={isWeb ? "flex-1" : "mb-3"}>
            <Text className={`${isWeb ? "text-lg" : "text-base"} font-bold text-gray-700`}>Doctor Directory</Text>
            <Text className="italic text-gray-600 text-[11px] font-medium leading-tight">
              "Connecting patients with the right care providers."
            </Text>
          </View>
          <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/70 rounded-xl px-3 border border-white/20 shadow-sm`}>
            <FontAwesome name="search" size={14} color="#666" />
            <TextInput
              placeholder="Search doctors..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 px-3 py-2 text-sm ${isWeb ? "outline-none" : ""}`}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Page Content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Doctor Management Content Goes Here</Text>
      </View>
    </View>
  );
};

export default ReceptionDoctor;