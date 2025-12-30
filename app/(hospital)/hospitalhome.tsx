import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* -------------------- STATIC DATA -------------------- */
const PATIENTS = [
  {
    id: "PT-5001",
    name: "Alice Johnson",
    age: "28",
    gender: "Female",
    roomNo: "305-A",
    status: "Admitted",
    attendingDoctor: "Dr. Sarah Wilson",
    admissionDate: "2023-11-18",
    ailment: "Pneumonia Recovery",
  },
  {
    id: "PT-5002",
    name: "Robert Miller",
    age: "54",
    gender: "Male",
    roomNo: "102-B",
    status: "Observation",
    attendingDoctor: "Dr. Robert Chen",
    admissionDate: "2023-11-19",
    ailment: "Post-Cardiac Surgery",
  },
  {
    id: "PT-5003",
    name: "Catherine Davis",
    age: "35",
    gender: "Female",
    roomNo: "401",
    status: "Admitted",
    attendingDoctor: "Dr. Elena Rodriguez",
    admissionDate: "2023-11-20",
    ailment: "Fracture Management",
  },
  {
    id: "PT-5004",
    name: "David Wilson",
    age: "12",
    gender: "Male",
    roomNo: "Ped-04",
    status: "Discharged",
    attendingDoctor: "Dr. Emily Taylor",
    admissionDate: "2023-11-15",
    ailment: "Viral Fever",
  },
];

/* -------------------- COMPONENT -------------------- */
const HospitalHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isWeb = Platform.OS === "web";

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AccessToken");
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const filteredPatients = useMemo(() => {
    return PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  /* -------------------- CARD RENDER -------------------- */
  const renderPatientCard = ({ item }: { item: typeof PATIENTS[0] }) => {
    const isDischarged = item.status === "Discharged";

    return (
      <View className="bg-white mx-4 my-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Top Accent Strip */}
        <View className={`h-1 ${isDischarged ? "bg-gray-400" : "bg-teal-500"}`} />

        <View className="p-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-row items-center">
              {/* Avatar Icon */}
              <View className={`w-12 h-12 rounded-full ${isDischarged ? "bg-gray-100" : "bg-teal-50"} items-center justify-center`}>
                <Ionicons 
                  name={item.gender === "Male" ? "man-outline" : "woman-outline"} 
                  size={24} 
                  color={isDischarged ? "#9ca3af" : "#0d9488"} 
                />
              </View>

              <View className="ml-3">
                <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                <Text className="text-[11px] text-gray-400 font-medium">
                  {item.id} • {item.age}Y • {item.gender}
                </Text>
              </View>
            </View>

            {/* Status Badge */}
            <View className={`${isDischarged ? "bg-gray-100" : "bg-teal-50"} px-3 py-1 rounded-full`}>
              <Text className={`text-[10px] font-bold ${isDischarged ? "text-gray-600" : "text-teal-700"}`}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View className="mt-4 flex-row flex-wrap">
            <View className="w-1/2 flex-row items-center mb-2">
              <MaterialCommunityIcons name="door-open" size={14} color="#6b7280" />
              <Text className="ml-2 text-xs text-gray-600 font-semibold">Room: {item.roomNo}</Text>
            </View>
            <View className="w-1/2 flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={14} color="#6b7280" />
              <Text className="ml-2 text-xs text-gray-600  font-semibold">{item.admissionDate}</Text>
            </View>
            <View className="w-full flex-row items-center mb-2">
              <FontAwesome name="user-md" size={14} color="#6b7280" />
              <Text className="ml-2 text-xs text-gray-600  font-semibold">Doctor: {item.attendingDoctor}</Text>
            </View>
            <View className="w-full flex-row items-center">
              <Ionicons name="medical-outline" size={14} color="#6b7280" />
              <Text className="ml-2 text-xs font-medium text-teal-600 italic  font-semibold">
                {item.ailment}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER - Styled like Receptionist Home */}
      <LinearGradient
        colors={["rgba(177,235,252,0.86)", "rgba(90,250,215,0.86)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`${isWeb ? "px-10 py-5" : "px-5 pt-12 pb-6"} rounded-b-[30px] shadow-lg`}
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <FontAwesome name="heartbeat" size={26} color="#0d9488" />
            <Text className="ml-2 text-2xl font-bold text-gray-800">WECARE</Text>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.replace("/")}
              className="bg-white/40 p-2 rounded-full"
            >
              <Ionicons name="home" size={18} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center bg-white/40 px-3 py-1.5 rounded-full"
            >
              <FontAwesome name="sign-out" size={14} color="#374151" />
              <Text className="ml-2 text-xs font-semibold text-gray-700">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className={`${isWeb ? "flex-row justify-between items-end" : ""}`}>
          <View>
            <Text className="text-xl font-bold text-gray-800">Hospital Management</Text>
            <Text className="text-[11px] italic text-gray-600">Monitoring admitted patients</Text>
          </View>

          <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/80 mt-4 rounded-xl px-3 shadow-sm`}>
            <Ionicons name="search" size={16} color="#6b7280" />
            <TextInput
              placeholder="Search by patient name or ID..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 px-3 py-2 text-sm text-gray-800"
            />
          </View>
        </View>
      </LinearGradient>

      {/* PATIENT LIST */}
      <View className="flex-1 mt-4">
        <View className="flex-row justify-between px-6 pb-2">
          <Text className="text-lg font-bold text-gray-800">Patient Directory</Text>
          <Text className="text-xs text-gray-400 font-medium">{filteredPatients.length} Patients</Text>
        </View>

        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={renderPatientCard}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Ionicons name="people-outline" size={50} color="#cbd5e1" />
              <Text className="text-gray-400 italic mt-2">No patients found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default HospitalHome;