import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    ColorValue,
    FlatList,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

/* -------------------- DATA -------------------- */
const DOCTORS = [
  {
    id: "DOC-001",
    cabinNo: "101",
    name: "Dr. Sarah Wilson",
    specialisation: "General Physician",
    timeSlots: "09:00 AM - 01:00 PM",
    experience: "12 Years",
    email: "sarah.wilson@wecare.com",
  },
  {
    id: "DOC-002",
    cabinNo: "102",
    name: "Dr. Robert Chen",
    specialisation: "Neurologist",
    timeSlots: "10:00 AM - 02:00 PM",
    experience: "15 Years",
    email: "robert.chen@wecare.com",
  },
  {
    id: "DOC-003",
    cabinNo: "201",
    name: "Dr. Elena Rodriguez",
    specialisation: "Orthopedic Surgeon",
    timeSlots: "02:00 PM - 06:00 PM",
    experience: "10 Years",
    email: "elena.r@wecare.com",
  },
  {
    id: "DOC-004",
    cabinNo: "202",
    name: "Dr. James Lee",
    specialisation: "Dermatologist",
    timeSlots: "11:00 AM - 03:00 PM",
    experience: "8 Years",
    email: "james.lee@wecare.com",
  },
  {
    id: "DOC-005",
    cabinNo: "301",
    name: "Dr. Emily Taylor",
    specialisation: "Pediatrician",
    timeSlots: "08:00 AM - 12:00 PM",
    experience: "9 Years",
    email: "emily.t@wecare.com",
  },
  {
    id: "DOC-006",
    cabinNo: "302",
    name: "Dr. Michael Scott",
    specialisation: "Cardiologist",
    timeSlots: "01:00 PM - 05:00 PM",
    experience: "20 Years",
    email: "michael.s@wecare.com",
  },
  {
    id: "DOC-007",
    cabinNo: "401",
    name: "Dr. Lisa Wang",
    specialisation: "Psychiatrist",
    timeSlots: "09:30 AM - 01:30 PM",
    experience: "11 Years",
    email: "lisa.wang@wecare.com",
  },
];

/* -------------------- COMPONENT -------------------- */
const ReceptionDoctor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isWeb = Platform.OS === "web";

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AccessToken");
      isWeb ? alert("Logging out...") : Alert.alert("Logging out");
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialisation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const gradientColors: readonly [ColorValue, ColorValue] = isWeb
    ? ["#9BE7FF", "#6FFFE9"]
    : ["rgba(177,235,252,0.86)", "rgba(90,250,215,0.86)"];

  /* -------------------- CARD -------------------- */
  const renderDoctorItem = ({ item }: { item: typeof DOCTORS[0] }) => (
    <View className="bg-white mx-3 my-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      
      {/* Accent Strip */}
      <View className="h-1 bg-teal-500" />

      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="w-11 h-11 rounded-full bg-teal-100 items-center justify-center">
              <Ionicons name="medkit" size={20} color="#0d9488" />
            </View>

            <View className="ml-3">
              <Text className="text-lg font-bold text-gray-800">
                {item.name}
              </Text>
              <Text className="text-sm font-semibold text-teal-600">
                {item.specialisation}
              </Text>
              <Text className="text-[11px] text-gray-400">
                {item.id} • Cabin {item.cabinNo}
              </Text>
            </View>
          </View>

          <View className="bg-orange-50 px-3 py-1 rounded-full">
            <Text className="text-[10px] font-bold text-orange-700">
              {item.experience}
            </Text>
          </View>
        </View>

        <View className="mt-4 space-y-2">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text className="ml-2 text-xs text-gray-600">
              {item.timeSlots}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="mail-outline" size={14} color="#6b7280" />
            <Text className="ml-2 text-xs text-gray-600">
              {item.email}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  /* -------------------- UI -------------------- */
  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <LinearGradient
        colors={["rgba(177,235,252,0.86)", "rgba(90,250,215,0.86)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`${isWeb ? "px-10 py-5" : "px-5 pt-10 pb-4"} rounded-b-[28px] shadow-lg`}
      >
        <View className="flex-row justify-between items-center mb-4 mt-4">
          <View className="flex-row items-center">
            <FontAwesome name="heartbeat" size={26} color="#0d9488" />
            <Text className="ml-2 text-2xl font-bold text-gray-800">
              WECARE
            </Text>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.navigate("/receptionist")}
              className="bg-white/40 p-2 rounded-full"
            >
              <Ionicons name="home" size={18} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center bg-white/40 px-3 py-1.5 rounded-full"
            >
              <FontAwesome name="sign-out" size={14} color="#374151" />
              <Text className="ml-2 text-xs font-semibold text-gray-700">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className={`${isWeb ? "flex-row justify-between items-end" : ""}`}>
          <View>
            <Text className="text-lg font-bold text-gray-700">
              Doctor Directory
            </Text>
            <Text className="text-[11px] italic text-gray-600">
              Find specialists available today
            </Text>
          </View>

          <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/80 mt-3 rounded-xl px-3`}>
            <Ionicons name="search" size={14} color="#6b7280" />
            <TextInput
              placeholder="Search doctors or specialty..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 px-3 py-2 text-sm"
            />
          </View>
        </View>
      </LinearGradient>

      {/* LIST */}
      <View className="flex-1 mt-2">
        <View className="flex-row justify-between px-5 pb-2">
          <Text className="text-lg font-bold text-gray-800">
            Available Doctors
          </Text>
          <Text className="text-xs text-gray-400">
            {filteredDoctors.length} listed
          </Text>
        </View>

        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctorItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <View className="items-center mt-16">
              <Text className="text-gray-400 italic">
                No doctors found
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default ReceptionDoctor;
