import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

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

const ReceptionistHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("All"); // 1. State for date filter
  const isWeb = Platform.OS === "web";

  // 2. Generate list of unique dates for the filter bar
  const uniqueDates = useMemo(() => {
    const dates = APPOINTMENTS.map(item => item.date);
    return ["All", ...new Set(dates)];
  }, []);

  // 3. Filter logic for both Search and Date
  const filteredAppointments = useMemo(() => {
    return APPOINTMENTS.filter((item) => {
      const matchesSearch = item.patientName.toLowerCase().includes(searchQuery.toLowerCase());
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

  const renderAppointmentItem = ({ item }: { item: typeof APPOINTMENTS[0] }) => (
    <View className="bg-white m-3 p-4 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-xs font-bold text-teal-600 mb-1">{item.id}</Text>
          <Text className="text-lg font-bold text-gray-800">{item.patientName}</Text>
        </View>
        <View className="bg-teal-50 px-2 py-1 rounded-md">
          <Text className="text-[10px] font-bold text-teal-700">{item.timeSlot}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <FontAwesome name="calendar" size={12} color="#666" />
        <Text className="ml-2 text-gray-600 text-xs">{item.date}</Text>
      </View>

      <View className="border-t border-gray-50 my-2 pt-2">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-400">Illness:</Text>
          <Text className="text-xs font-medium text-gray-700">{item.illness}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-400">Doctor:</Text>
          <Text className="text-xs font-medium text-gray-700">{item.doctorName} ({item.doctorSpecialisation})</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-gray-400">Address:</Text>
          <Text className="text-xs font-medium text-gray-700 text-right flex-1 ml-4" numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        className={`${isWeb ? "px-10 py-5" : "px-5 pt-10 pb-4"} rounded-b-[25px] shadow-md`}
      >
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <FontAwesome name="heartbeat" size={isWeb ? 28 : 22} color="#2eb8b8" />
            <Text className={`${isWeb ? "text-2xl" : "text-xl"} ml-2 font-bold text-gray-800 tracking-tight`}>WECARE</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="flex-row items-center bg-white/40 px-3 py-1.5 rounded-full border border-white/30">
            <FontAwesome name="sign-out" size={16} color="#444" />
            <Text className="ml-2 text-gray-800 font-semibold text-xs uppercase">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className={`${isWeb ? "flex-row justify-between items-end" : "flex-col"}`}>
          <View className={isWeb ? "flex-1" : "mb-3"}>
            <Text className={`${isWeb ? "text-lg" : "text-base"} font-bold text-gray-700`}>Receptionist Desk</Text>
            <Text className="italic text-gray-600 text-[11px] font-medium leading-tight">"Efficiency is the foundation of compassionate care."</Text>
          </View>
          <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/70 rounded-xl px-3 border border-white/20 shadow-sm`}>
            <FontAwesome name="search" size={14} color="#666" />
            <TextInput
              placeholder="Search patients..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 px-3 py-2 text-sm ${isWeb ? "outline-none" : ""}`}
            />
          </View>
        </View>
      </LinearGradient>

      {/* 4. Date Filter Bar */}
      <View className="mt-4 px-3">
        <Text className="text-gray-500 text-[10px] font-bold uppercase mb-2 ml-1">Filter by Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
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
              <Text className={`text-xs font-semibold ${selectedDate === date ? "text-white" : "text-gray-600"}`}>
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-2 mt-2">
        <View className="flex-row justify-between items-center px-3 pt-2 pb-2">
          <Text className="text-gray-800 font-bold text-lg">
            {selectedDate === "All" ? "All Appointments" : `Appointments for ${selectedDate}`}
          </Text>
          <Text className="text-gray-400 text-xs">{filteredAppointments.length} found</Text>
        </View>
        
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-gray-400 italic">No appointments found for this selection.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default ReceptionistHome;