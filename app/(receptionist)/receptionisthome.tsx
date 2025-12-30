import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* -------------------- DATA -------------------- */
const APPOINTMENTS = [
  {
    id: "BK-1001",
    patientName: "John Doe",
    date: "2023-11-20",
    timeSlot: "09:00 AM - 09:30 AM",
    illness: "Seasonal Flu",
    address: "123 Maple Street, Springfield",
    doctorName: "Dr. Sarah Wilson",
    doctorSpecialisation: "General Physician",
  },
  {
    id: "BK-1002",
    patientName: "Jane Smith",
    date: "2023-11-20",
    timeSlot: "10:15 AM - 10:45 AM",
    illness: "Migraine",
    address: "456 Oak Avenue, Metropolis",
    doctorName: "Dr. Robert Chen",
    doctorSpecialisation: "Neurologist",
  },
  {
    id: "BK-1003",
    patientName: "Michael Brown",
    date: "2023-11-21",
    timeSlot: "02:00 PM - 02:30 PM",
    illness: "Knee Pain",
    address: "789 Pine Road, Gotham",
    doctorName: "Dr. Elena Rodriguez",
    doctorSpecialisation: "Orthopedic Surgeon",
  },
  {
    id: "BK-1004",
    patientName: "Emily Davis",
    date: "2023-11-21",
    timeSlot: "11:30 AM - 12:00 PM",
    illness: "Skin Rash",
    address: "321 Elm Lane, Star City",
    doctorName: "Dr. James Lee",
    doctorSpecialisation: "Dermatologist",
  },
  {
    id: "BK-1005",
    patientName: "William Taylor",
    date: "2023-11-22",
    timeSlot: "08:30 AM - 09:00 AM",
    illness: "Checkup",
    address: "555 Cedar Blvd, Central City",
    doctorName: "Dr. Sarah Wilson",
    doctorSpecialisation: "General Physician",
  },
];

/* -------------------- COMPONENT -------------------- */
const ReceptionistHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("All");
  const isWeb = Platform.OS === "web";

  const uniqueDates = useMemo(() => {
    const dates = APPOINTMENTS.map((item) => item.date);
    return ["All", ...new Set(dates)];
  }, []);

  const filteredAppointments = useMemo(() => {
    return APPOINTMENTS.filter((item) => {
      const matchesSearch = item.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDate = selectedDate === "All" || item.date === selectedDate;
      return matchesSearch && matchesDate;
    });
  }, [searchQuery, selectedDate]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AccessToken");
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  /* -------------------- CARD -------------------- */
  const renderAppointmentItem = ({
    item,
  }: {
    item: (typeof APPOINTMENTS)[0];
  }) => (
    <View className="bg-white mx-3 my-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Accent */}
      <View className="h-1 bg-teal-500" />

      <View className="p-4 mt-2">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="w-11 h-11 rounded-full bg-teal-100 items-center justify-center">
              <Ionicons name="person-outline" size={20} color="#0d9488" />
            </View>

            <View className="ml-3">
              <Text className="text-lg font-bold text-gray-800">
                {item.patientName}
              </Text>
              <Text className="text-[14px] text-gray-400">
                {item.id} {item.date}
              </Text>
            </View>
          </View>

          <View className="bg-teal-50 px-3 py-1 rounded-full">
            <Text className="text-[10px] font-bold text-teal-700">
              {item.timeSlot}
            </Text>
          </View>
        </View>

        <View className="mt-4 space-y-2">
          <View className="flex-row items-center">
            <Ionicons name="medkit-outline" size={14} color="#6b7280" />
            <Text className="ml-2 text-[11.5px] font-medium text-gray-600">
              {item.illness}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="medical-outline" size={14} color="#6b7280" />
            <Text className="ml-2 text-[11.5px] font-medium text-gray-600">
              {item.doctorName}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="medical-outline" size={14} color="#6b7280" />
            <Text className="ml-2 text-[11.5px] font-medium text-gray-600">
              ({item.doctorSpecialisation})
            </Text>
          </View>

          <View className="flex-row items-start">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text
              className="ml-2 text-[11.5] font-medium text-gray-600 flex-1"
              numberOfLines={1}
            >
              {item.address}
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
        className={`${
          isWeb ? "px-10 py-5" : "px-5 pt-10 pb-4"
        } rounded-b-[28px] shadow-lg`}
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

        <View
          className={`${isWeb ? "flex-row justify-between items-end" : ""}`}
        >
          <View>
            <Text className="text-lg font-bold text-gray-700">
              Receptionist Desk
            </Text>
            <Text className="text-[11px] italic text-gray-600">
              Manage daily appointments efficiently
            </Text>
          </View>

          <View
            className={`${
              isWeb ? "w-1/3" : "w-full"
            } flex-row items-center bg-white/80 mt-3 rounded-xl px-3`}
          >
            <Ionicons name="search" size={14} color="#6b7280" />
            <TextInput
              placeholder="Search patients..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 px-3 py-2 text-sm"
            />
          </View>
        </View>
      </LinearGradient>

      {/* DATE FILTER */}
      <View className="mt-4 px-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {uniqueDates.map((date) => (
            <TouchableOpacity
              key={date}
              onPress={() => setSelectedDate(date)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                selectedDate === date
                  ? "bg-teal-500 border-teal-600"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedDate === date ? "text-white" : "text-gray-600"
                }`}
              >
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LIST */}
      <View className="flex-1 mt-2">
        <View className="flex-row justify-between px-5 pb-2">
          <Text className="text-lg font-bold text-gray-800">
            {selectedDate === "All"
              ? "All Appointments"
              : `Appointments for ${selectedDate}`}
          </Text>
          <Text className="text-xs text-gray-400">
            {filteredAppointments.length} found
          </Text>
        </View>

        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <View className="items-center mt-16">
              <Text className="text-gray-400 italic">
                No appointments found
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default ReceptionistHome;
