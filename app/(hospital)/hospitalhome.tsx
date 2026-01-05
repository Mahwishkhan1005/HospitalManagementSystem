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
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL = "http://192.168.0.186:8081/api/doctor/appointments";

const HospitalHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const isWeb = Platform.OS === "web";

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    try {
      // Clear both the Token and the Role on logout
      await AsyncStorage.multiRemove(["AccessToken", "userRole"]);
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  /* -------------------- FETCH API DATA (WITH JWT) -------------------- */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // 1. Get the JWT token from storage
      const token = await AsyncStorage.getItem("AccessToken");

      // 2. Add the token to the Authorization header
      const response = await axios.get(BASE_URL, {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${token}`, // Key addition for JWT
        },
      });
      
      setAppointments(response.data || []);
    } catch (error: any) {
      console.error("Fetch Error:", error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert("Session Expired", "Please login again.");
        handleLogout();
      } else if (!isWeb && error.message.includes("Network Error")) {
        Alert.alert("Network Error", "Cannot reach the server.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  /* -------------------- UPDATE LOGIC (WITH JWT) -------------------- */
  const handleOpenConsultation = (appt: any) => {
    setSelectedAppt(appt);
    setDoctorNotes(appt.doctorNotes || "");
    setModalVisible(true);
  };

  const submitConsultationUpdate = async () => {
    if (!selectedAppt) return;

    try {
      setUpdateLoading(true);
      const token = await AsyncStorage.getItem("AccessToken"); // Get token for update request

      const payload = {
        consultationStatus: "COMPLETED",
        doctorNotes: doctorNotes,
      };

      const response = await axios.put(
        `${BASE_URL}/${selectedAppt.appointmentId}/consultation`,
        payload,
        { 
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Key addition for JWT
          } 
        }
      );

      if (response.status === 200) {
        isWeb ? window.alert("Consultation updated!") : Alert.alert("Success", "Consultation updated!");
        setModalVisible(false);
        fetchAppointments();
      }
    } catch (error: any) {
      console.error("Update failed", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to update. Check server connection.");
    } finally {
      setUpdateLoading(false);
    }
  };

  /* -------------------- SEARCH FILTER -------------------- */
  const filteredPatients = useMemo(() => {
    return appointments.filter(
      (p) =>
        p.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.appointmentId).includes(searchQuery)
    );
  }, [searchQuery, appointments]);

  /* -------------------- CARD RENDER -------------------- */
  const renderPatientCard = ({ item }: { item: any }) => {
    const isCompleted = item.consultationStatus === "COMPLETED";

    return (
      <View className="bg-white mx-4 my-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <View className={`h-1 ${isCompleted ? "bg-green-500" : "bg-teal-500"}`} />
        <View className="p-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-row items-center">
              <View className={`w-12 h-12 rounded-full ${isCompleted ? 'bg-green-50' : 'bg-teal-50'} items-center justify-center`}>
                <Ionicons name="person-outline" size={24} color={isCompleted ? "#16a34a" : "#0d9488"} />
              </View>
              <View className="ml-3">
                <Text className="text-lg font-bold text-gray-800">{item.patientName}</Text>
                <Text className="text-[11px] text-gray-400 font-medium">Appointment Number : {item.appointmentId}</Text>
              </View>
            </View>
            <View className={`${isCompleted ? 'bg-green-100' : 'bg-orange-100'} px-3 py-1 rounded-full`}>
              <Text className={`text-[10px] font-bold ${isCompleted ? 'text-green-700' : 'text-orange-700'}`}>
                {item.consultationStatus?.replace(/_/g, " ") || "PENDING"}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <DetailRow icon="calendar-outline" text={`${item.appointmentDate} • ${item.timeSlot?.replace(/_/g, " ")}`} />
            <DetailRow icon="call-outline" text={item.phoneNumber} />
            <DetailRow icon="medical-outline" text={item.issue} isItalic />
          </View>

          <TouchableOpacity
            onPress={() => handleOpenConsultation(item)}
            className={`mt-4 py-3 rounded-xl flex-row justify-center items-center ${isCompleted ? 'bg-gray-100' : 'bg-teal-600'}`}
          >
            <Ionicons name={isCompleted ? "eye-outline" : "create-outline"} size={16} color={isCompleted ? "#4b5563" : "white"} />
            <Text className={`ml-2 font-bold text-sm ${isCompleted ? 'text-gray-600' : 'text-white'}`}>
              {isCompleted ? "View Details" : "Update Consultation"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={["rgba(177,235,252,0.86)", "rgba(90,250,215,0.86)"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        className={`${isWeb ? "px-10 py-5" : "px-5 pt-12 pb-6"} rounded-b-[30px] shadow-lg`}
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <FontAwesome name="heartbeat" size={26} color="#0d9488" />
            <Text className="ml-2 text-2xl font-bold text-gray-800">WECARE</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="flex-row items-center bg-white/40 px-3 py-1.5 rounded-full">
            <FontAwesome name="sign-out" size={14} color="#374151" />
            <Text className="ml-2 text-xs font-semibold text-gray-700">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/80 rounded-xl px-3`}>
          <Ionicons name="search" size={16} color="#6b7280" />
          <TextInput
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 px-3 py-2 text-sm text-gray-800"
          />
        </View>
      </LinearGradient>

      <View className="flex-1">
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => String(item.appointmentId)}
          renderItem={renderPatientCard}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          ListEmptyComponent={
            loading ? <ActivityIndicator size="large" color="#0d9488" className="mt-20" /> : (
              <View className="items-center mt-20">
                <Ionicons name="people-outline" size={50} color="#cbd5e1" />
                <Text className="text-gray-400 italic mt-2">No appointments found</Text>
              </View>
            )
          }
        />
      </View>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className={`bg-white rounded-[32px] overflow-hidden ${isWeb ? 'w-[500px]' : 'w-full'}`}>
            <View className="bg-teal-600 p-4 flex-row justify-between items-center">
                <Text className="text-white font-bold text-lg">Consultation Record</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="p-6 max-h-[400px]">
              {selectedAppt && (
                <View className="space-y-4">
                  <ModalDataRow label="Patient Name" value={selectedAppt.patientName} />
                  <Text className="text-[10px] uppercase font-black text-teal-600 mt-4 mb-2">Clinical Notes</Text>
                  <TextInput
                    multiline
                    numberOfLines={5}
                    value={doctorNotes}
                    onChangeText={setDoctorNotes}
                    placeholder="Enter findings..."
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 h-32"
                    textAlignVertical="top"
                  />
                </View>
              )}
            </ScrollView>

            <View className="p-6 bg-gray-50 flex-row gap-3">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="flex-1 bg-white border border-gray-200 py-3 rounded-xl items-center">
                <Text className="text-gray-600 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                disabled={updateLoading}
                onPress={submitConsultationUpdate}
                className="flex-1 bg-teal-600 py-3 rounded-xl items-center justify-center"
              >
                {updateLoading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-bold">Complete</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DetailRow = ({ icon, text, isItalic }: any) => (
  <View className="flex-row items-center mb-2">
    <Ionicons name={icon} size={14} color="#6b7280" />
    <Text className={`ml-2 text-xs text-gray-600 ${isItalic ? 'text-teal-600 italic font-bold' : ''}`}>{text}</Text>
  </View>
);

const ModalDataRow = ({ label, value }: any) => (
  <View className="mb-3">
    <Text className="text-[10px] text-gray-400 uppercase font-bold">{label}</Text>
    <Text className="text-gray-800 font-medium text-base">{value}</Text>
  </View>
);

export default HospitalHome;