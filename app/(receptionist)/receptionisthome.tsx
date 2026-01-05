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
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* -------------------- COMPONENT -------------------- */
const ReceptionistHome = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("All");

  // Modal and Action states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isWeb = Platform.OS === "web";
  const numColumns = isWeb ? 4 : 1;
  
  // Base URL provided in your snippet
  const BASE_URL = "http://192.168.0.246:8080/api/appointments";

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    try {
      // Clears token and role to ensure the Application tab is wiped
      await AsyncStorage.multiRemove(["AccessToken", "userRole"]);
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  /* -------------------- FETCH DATA (BASE_URL/hospital + JWT) -------------------- */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("AccessToken");

      if (!token) return handleLogout();

      // Updated endpoint: BASE_URL/hospital
      const response = await axios.get(`${BASE_URL}/hospital`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      // Auto-logout if token is expired (401) or unauthorized (403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert("Session Expired", "Please login again.");
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UPDATE STATUS (BASE_URL/{id}/{status} + JWT) -------------------- */
  const handleUpdateStatus = async (
    id: number,
    action: "approve" | "reject"
  ) => {
    try {
      setActionLoading(true);
      const token = await AsyncStorage.getItem("AccessToken");

      // 1. Map the action to the status string expected by your backend
      const statusValue = action === "approve" ? "APPROVED" : "REJECTED";

      // 2. Updated endpoint: BASE_URL/{id}/status
      // We pass the status value in the body object
      const response = await axios.put(
        `${BASE_URL}/${id}/status`,
        { status: statusValue }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const msg = `Appointment ${action === "approve" ? "Approved" : "Rejected"} successfully!`;
        isWeb ? window.alert(msg) : Alert.alert("Success", msg);

        // 3. Refresh list after change using the hospital-specific GET endpoint
        const refreshedData = await axios.get(`${BASE_URL}/hospital`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(refreshedData.data);

        // 4. Update the selected appointment state with the new data from the server
        const updatedAppt = refreshedData.data.find(
          (a: any) => a.id === id
        );
        setSelectedAppt(updatedAppt);
        setModalVisible(false);
      }
    } catch (error: any) {
      console.error(`Failed to ${action} appointment:`, error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // handleLogout(); // Uncomment if you have your logout logic ready
      } else {
        const msg = `Failed to ${action} appointment.`;
        isWeb ? window.alert(msg) : Alert.alert("Error", msg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------- FILTER LOGIC -------------------- */
  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchesSearch = item.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDate =
        selectedDate === "All" || item.appointmentDate === selectedDate;
      return matchesSearch && matchesDate;
    });
  }, [searchQuery, selectedDate, appointments]);

  const uniqueDates = useMemo(() => {
    const dates = appointments.map((item) => item.appointmentDate);
    return ["All", ...new Set(dates)];
  }, [appointments]);

  /* -------------------- RENDER ITEMS -------------------- */
  const renderAppointmentItem = ({ item }: { item: any }) => {
    if (isWeb) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setSelectedAppt(item);
            setModalVisible(true);
          }}
          className="bg-white m-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden flex-1 aspect-square max-w-[23.5%]"
        >
          <View className={`h-1.5 ${item.status === "PENDING" ? "bg-orange-400" : item.status === "REJECTED" ? "bg-red-500" : "bg-teal-500"}`} />
          <div className="p-3 flex-1 justify-between">
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 rounded-full bg-teal-50 items-center justify-center">
                  <Ionicons name="person" size={16} color="#0d9488" />
                </View>
                <View className="bg-teal-50 px-2 py-0.5 rounded">
                  <Text className="text-[9px] font-bold text-teal-700">{item.timeSlot?.replace(/_/g, " ")}</Text>
                </View>
              </View>
              <Text className="text-base font-bold text-gray-800" numberOfLines={1}>{item.patientName}</Text>
              <Text className="text-[10px] text-gray-400 mb-2">ID: {item.id}</Text>
              <View className="space-y-1">
                <DetailIconRow icon="calendar" text={item.appointmentDate} />
                <DetailIconRow icon="medkit" text={item.issue} />
              </View>
            </View>
            <View className="pt-2 border-t border-gray-50 flex-row justify-between items-center">
               <Text className="text-[9px] text-gray-400">Doc: {item.docId}</Text>
               <Text className={`text-[9px] font-bold ${item.status === "PENDING" ? "text-orange-600" : item.status === "REJECTED" ? "text-red-600" : "text-teal-600"}`}>
                {item.status}
              </Text>
            </View>
          </div>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setSelectedAppt(item);
          setModalVisible(true);
        }}
        className="bg-white mx-3 my-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden"
      >
        <View className={`h-1.5 ${item.status === "PENDING" ? "bg-orange-400" : item.status === "REJECTED" ? "bg-red-500" : "bg-teal-500"}`} />
        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center">
                <Ionicons name="person" size={20} color="#0d9488" />
              </View>
              <View className="ml-3">
                <Text className="text-lg font-bold text-gray-800">{item.patientName}</Text>
                <Text className="text-xs text-gray-400">ID: {item.id} • User ID: {item.userid}</Text>
              </View>
            </View>
            <View className="bg-teal-50 px-2 py-1 rounded-md">
              <Text className="text-[10px] font-bold text-teal-700">{item.timeSlot?.replace(/_/g, " ")}</Text>
            </View>
          </View>
          <View className="space-y-1 mt-2">
            <DetailIconRow icon="calendar" text={item.appointmentDate} />
            <DetailIconRow icon="medkit" text={`Issue: ${item.issue}`} />
            <DetailIconRow icon="call" text={item.phoneNumber} />
            <DetailIconRow icon="location" text={item.address} />
          </View>
          <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-50">
            <Text className="text-[11px] text-gray-400 font-medium">Doctor ID: {item.docId}</Text>
            <View className={`px-2 py-0.5 rounded ${item.status === "PENDING" ? "bg-orange-50" : item.status === "REJECTED" ? "bg-red-50" : "bg-teal-50"}`}>
              <Text className={`text-[10px] font-bold ${item.status === "PENDING" ? "text-orange-600" : item.status === "REJECTED" ? "text-red-600" : "text-teal-600"}`}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
            <Text className="text-lg font-bold text-gray-700">Receptionist Desk</Text>
            <Text className="text-[11px] italic text-gray-600">Manage daily appointments efficiently</Text>
          </View>
          <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/80 mt-3 rounded-xl px-3 shadow-sm`}>
            <Ionicons name="search" size={16} color="#6b7280" />
            <TextInput
              placeholder="Search patients..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 px-3 py-2 text-sm text-gray-800"
            />
          </View>
        </View>
      </LinearGradient>

      <View className="mt-4 px-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {uniqueDates.map((date) => (
            <TouchableOpacity
              key={date}
              onPress={() => setSelectedDate(date)}
              className={`mr-2 px-4 py-2 rounded-full border ${selectedDate === date ? "bg-teal-500 border-teal-600" : "bg-white border-gray-200"}`}
            >
              <Text className={`text-xs font-semibold ${selectedDate === date ? "text-white" : "text-gray-600"}`}>{date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="flex-1 mt-2">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0d9488" />
          </View>
        ) : (
          <FlatList
            key={isWeb ? "web-grid-4" : "mobile-list-1"}
            data={filteredAppointments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAppointmentItem}
            numColumns={numColumns}
            columnWrapperStyle={isWeb ? { justifyContent: "flex-start", paddingHorizontal: 10 } : null}
            contentContainerStyle={{ paddingBottom: 30 }}
            ListEmptyComponent={
              <Text className="text-center mt-20 text-gray-400">No appointments found</Text>
            }
          />
        )}
      </View>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center bg-black/60 p-6">
          <View className={`bg-white rounded-3xl overflow-hidden shadow-2xl self-center ${isWeb ? "w-[450px] max-h-[85%]" : "w-full max-h-[90%]"}`}>
            <View className="bg-teal-600 p-4 flex-row justify-between items-center">
              <Text className="text-white font-bold text-lg">Full Patient Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {selectedAppt && (
                <View className="space-y-4">
                  <ModalDataRow label="Full Name" value={selectedAppt.patientName} />
                  <ModalDataRow label="Appointment ID" value={selectedAppt.id} />
                  <ModalDataRow label="Doctor Assigned (ID)" value={selectedAppt.docId} />
                  <ModalDataRow label="Contact Number" value={selectedAppt.phoneNumber} />
                  <ModalDataRow label="Appointment Date" value={selectedAppt.appointmentDate} />
                  <ModalDataRow label="Time Slot" value={selectedAppt.timeSlot?.replace(/_/g, " ")} />
                  <ModalDataRow label="Reported Issue" value={selectedAppt.issue} />
                  <ModalDataRow label="Residential Address" value={selectedAppt.address} />
                  <ModalDataRow label="Current Status" value={selectedAppt.status} isStatus />
                </View>
              )}
            </ScrollView>
            {selectedAppt && (
              <View className="flex-row p-4 border-t border-gray-100 gap-3">
                <TouchableOpacity
                  onPress={() => handleUpdateStatus(selectedAppt.id, "reject")}
                  disabled={actionLoading}
                  className={`flex-1 py-3 rounded-xl items-center ${selectedAppt.status === "REJECTED" ? "bg-red-700" : "bg-red-500"}`}
                >
                  <Text className="text-white font-bold">{selectedAppt.status === "REJECTED" ? "Rejected" : "Reject"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleUpdateStatus(selectedAppt.id, "approve")}
                  disabled={actionLoading}
                  className={`flex-1 py-3 rounded-xl items-center ${selectedAppt.status === "APPROVED" ? "bg-teal-800" : "bg-teal-600"}`}
                >
                  {actionLoading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-bold">{selectedAppt.status === "APPROVED" ? "Approved" : "Approve"}</Text>}
                </TouchableOpacity>
              </View>
            )}
            <View className="px-4 pb-4">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-100 p-3 rounded-xl items-center">
                <Text className="text-gray-600 font-bold">Close Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* --- HELPER COMPONENTS --- */
const DetailIconRow = ({ icon, text }: any) => (
  <View className="flex-row items-center mb-1">
    <Ionicons name={icon} size={12} color="#94a3b8" />
    <Text className="ml-2 text-[10px] text-gray-500" numberOfLines={1}>{text}</Text>
  </View>
);

const ModalDataRow = ({ label, value, isStatus }: any) => (
  <View className="border-b border-gray-50 pb-2 mb-2">
    <Text className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</Text>
    <Text className={`text-sm font-medium ${isStatus ? "text-teal-600 font-bold" : "text-gray-800"}`}>{value}</Text>
  </View>
);

export default ReceptionistHome;
