import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ReceptionistLanding = () => {
  const isWeb = Platform.OS === "web";

  const features = [
    "Seamless Care",
    "Warm and Welcoming Environment",
    "Comprehensive Care",
    "Expert Doctors",
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AccessToken");
      if (isWeb) {
        window.alert("Logged out successfully");
      } else {
        Alert.alert("Logout", "You have been logged out.");
      }
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Main Background Gradient instead of ImageBackground */}
      <LinearGradient
        colors={["#f0fdfa", "#ffffff"]}
        className="flex-1"
      >
        {/* TOP HEADER */}
        <View
          className={`absolute z-10 flex-row items-center justify-between w-full ${
            isWeb ? "px-10 py-8" : "px-5 py-4"
          }`}
        >
          <View className="flex-row items-center">
            <View className="bg-teal-600 p-2 rounded-lg">
                <FontAwesome name="heartbeat" size={24} color="white" />
            </View>
            <Text className="ml-3 text-2xl font-bold text-gray-800 tracking-tighter">WECARE</Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-white px-4 py-2 rounded-full border border-teal-100 shadow-sm"
          >
            <FontAwesome name="sign-out" size={16} color="#0d9488" />
            <Text className="ml-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View
            className={`flex-1 ${
              isWeb ? "flex-row px-20 py-32" : "flex-col p-6 pt-24"
            } items-center justify-between`}
          >
            {/* LEFT SECTION - TEXT & BUTTONS */}
            <View className={`${isWeb ? "w-1/2" : "w-full mb-10"}`}>
              <View className="bg-teal-100 self-start px-3 py-1 rounded-md mb-4">
                <Text className="text-teal-700 font-bold uppercase tracking-widest text-[10px]">
                    Healthcare Management
                </Text>
              </View>

              <Text className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                Your Digital Hub for{" "}
                <Text className="text-teal-600">Patient Care</Text>
              </Text>

              <Text className="text-gray-500 leading-relaxed mb-8 text-base max-w-md">
                Efficiency meets empathy. Manage appointments, coordinate with doctors, 
                and ensure every patient receives the finest care and amenities.
              </Text>

              <View className="gap-y-4">
                <View className="flex-row flex-wrap gap-4">
                  <TouchableOpacity
                    onPress={() => router.push("/(receptionist)/receptionisthome")}
                    className="flex-row items-center bg-teal-600 px-6 py-4 rounded-2xl shadow-lg shadow-teal-200"
                  >
                    <Ionicons name="calendar" size={20} color="#fff" />
                    <Text className="ml-3 text-white font-bold">Manage Appointments</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push("/(receptionist)/receptionDoctor")}
                    className="flex-row items-center bg-white border-2 border-teal-600 px-6 py-4 rounded-2xl"
                  >
                    <FontAwesome name="user-md" size={20} color="#0d9488" />
                    <Text className="ml-3 text-teal-600 font-bold">Doctor Directory</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => router.push("/(hospital)/hospitalhome")}
                  className="flex-row items-center bg-white border border-gray-200 px-6 py-4 rounded-2xl shadow-sm"
                >
                  <View className="bg-emerald-100 p-2 rounded-xl">
                    <MaterialCommunityIcons name="stethoscope" size={22} color="#059669" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-gray-800 font-bold">Doctor's Portal</Text>
                    <Text className="text-gray-500 text-xs">Hii Doctor, view appointments here →</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* RIGHT SECTION - REPLACED IMAGES WITH ICON CARDS */}
            <View className={`${isWeb ? "w-[400px]" : "w-full"}`}>
              {/* Feature List Card */}
              <View className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl w-full">
                
                {/* Visual Placeholder for the removed Image */}
                <LinearGradient
                    colors={['#0d9488', '#2dd4bf']}
                    className="w-full h-40 rounded-3xl mb-8 items-center justify-center"
                >
                    <Ionicons name="shield-checkmark" size={60} color="white" opacity={0.9} />
                </LinearGradient>

                <Text className="text-xl font-bold text-slate-900 mb-6">Why Choose WECARE</Text>
                
                {features.map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-4">
                    <View className="bg-teal-50 p-1.5 rounded-full">
                      <Ionicons name="checkmark" size={16} color="#0d9488" />
                    </View>
                    <Text className="ml-3 text-slate-700 font-medium">{feature}</Text>
                  </View>
                ))}

                <View className="mt-4 pt-6 border-t border-gray-100 flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-black text-teal-600">5K+</Text>
                    <Text className="text-[10px] text-gray-400 font-bold uppercase">Patients Served</Text>
                  </View>
                  <View className="h-8 w-[1px] bg-gray-200" />
                  <View>
                    <Text className="text-2xl font-black text-teal-600">99%</Text>
                    <Text className="text-[10px] text-gray-400 font-bold uppercase">Satisfaction</Text>
                  </View>
                </View>
              </View>

              {/* Hii Admin Quick Access */}
              <TouchableOpacity 
                onPress={() => router.push("/(superAdmin)/adminhome")}
                className="mt-8 self-center"
              >
                <Text className="text-gray-400 text-xs font-semibold italic">
                  Hii Super Admin, view analytics here →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ReceptionistLanding;