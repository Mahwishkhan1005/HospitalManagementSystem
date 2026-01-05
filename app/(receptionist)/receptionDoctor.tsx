import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* -------------------- COMPONENT -------------------- */
const ReceptionDoctor = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const isWeb = Platform.OS === "web";
  
  const API_URL = "http://192.168.0.246:8080/api/doctors/hospital";

  useEffect(() => {
    fetchDoctors();
  }, []);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    try {
      // Clear both token and role for security
      await AsyncStorage.multiRemove(["AccessToken", "userRole"]);
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  /* -------------------- FETCH DATA (JWT INCLUDED) -------------------- */
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // 1. Retrieve the token from storage
      const token = await AsyncStorage.getItem("AccessToken");

      const response = await axios.get(API_URL, {
        timeout: 8000,
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` // 2. Attach JWT Token
        }
      });
      setDoctors(response.data || []);
    } catch (error: any) {
      console.error("Fetch Error:", error.message);
      
      // 3. Auto-logout if token is expired (401) or unauthorized (403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert("Session Expired", "Please login again.");
        handleLogout();
      } else {
        const errorMsg = "Unable to connect to doctor directory. Please check your network.";
        isWeb ? window.alert(errorMsg) : Alert.alert("Connection Error", errorMsg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doc) =>
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, doctors]);

  /* -------------------- CARD RENDER -------------------- */
  const renderDoctorItem = ({ item }: { item: any }) => (
    <View className="bg-white mx-3 my-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <View className="h-1 bg-teal-500" />
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center flex-1">
            {item.picture ? (
              <Image 
                source={{ uri: item.picture }} 
                className="w-14 h-14 rounded-full border-2 border-teal-50"
              />
            ) : (
              <View className="w-14 h-14 rounded-full bg-teal-100 items-center justify-center">
                <Ionicons name="person" size={26} color="#0d9488" />
              </View>
            )}

            <View className="ml-3 flex-1">
              <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-sm font-semibold text-teal-600">
                {item.specialization}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="business-outline" size={12} color="#94a3b8" />
                <Text className="ml-1 text-[11px] text-gray-500 font-medium">
                  {item.hospitalName}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-orange-50 px-2 py-1 rounded-lg">
            <Text className="text-[9px] font-bold text-orange-700">
              {item.experience} YRS EXP
            </Text>
          </View>
        </View>

        <View className="mt-4 pt-3 border-t border-gray-50 space-y-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="school-outline" size={13} color="#64748b" />
              <Text className="ml-2 text-[11px] text-gray-600 font-semibold">{item.education}</Text>
            </View>
            <Text className="text-[11px] text-gray-400 font-medium">Cabin: {item.cabinNumber || "N/A"}</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="call" size={13} color="#0d9488" />
              <Text className="ml-2 text-xs font-bold text-gray-700">{item.phone}</Text>
            </View>
            <View className="flex-row items-center bg-teal-50 px-2 py-1 rounded-md">
              <Text className="text-[10px] text-teal-600 mr-1">Consultation:</Text>
              <Text className="text-sm font-black text-teal-700">₹{item.fee}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
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
            <TouchableOpacity onPress={() => router.navigate("/receptionist")} className="bg-white/40 p-2 rounded-full">
              <Ionicons name="home" size={18} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} className="flex-row items-center bg-white/40 px-3 py-1.5 rounded-full">
              <FontAwesome name="sign-out" size={14} color="#374151" />
              <Text className="ml-2 text-xs font-semibold text-gray-700">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View className={`${isWeb ? "flex-row justify-between items-end" : ""}`}>
          <View>
            <Text className="text-lg font-bold text-gray-700">Doctor Directory</Text>
            <Text className="text-[11px] italic text-gray-600">Find specialists available today</Text>
          </View>
          <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/80 mt-3 rounded-xl px-3 shadow-sm`}>
            <Ionicons name="search" size={16} color="#6b7280" />
            <TextInput
              placeholder="Search by name or specialty..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 px-3 py-2 text-sm text-gray-800"
            />
          </View>
        </View>
      </LinearGradient>

      <View className="flex-1">
        <View className="flex-row justify-between px-5 pb-2 pt-4">
          <Text className="text-lg font-bold text-gray-800">Available Specialists</Text>
          <Text className="text-xs text-gray-400">{filteredDoctors.length} listed</Text>
        </View>

        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctorItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#0d9488" className="mt-20" />
            ) : (
              <View className="items-center mt-16">
                <Ionicons name="search-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-400 italic mt-2">No doctors matching your search</Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
};

export default ReceptionDoctor;