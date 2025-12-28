import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilePage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const PATIENT_ID = 1;
  const BASE_URL = "http://192.168.0.215:8081";
  const userData = {
    name: "shanmukhi",
    email: "shanmukhi@example.com",
    phone: "+91 9874532345",
    city: "Hyderabad",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  };

  useEffect(() => {
    loadAppointments();
  }, []);
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/patient/appointments/${PATIENT_ID}`
      );

      if (response.ok) {
        const data = await response.json();

        setAppointments(data.reverse());
      } else {
        console.error("Server responded with error", response.status);
      }
    } catch (e) {
      console.error("Network error fetching appointments", e);

      const saved = await AsyncStorage.getItem("my_appointments");
      if (saved) setAppointments(JSON.parse(saved).reverse());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#2eb8b8", "#25a1a1"]}
          className="pt-16 pb-12 px-6 rounded-b-[40px] items-center"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-6 bg-white/20 p-2 rounded-full"
          >
            <FontAwesome name="chevron-left" size={18} color="white" />
          </TouchableOpacity>

          <View className="relative">
            <Image
              source={{ uri: userData.image }}
              className="w-28 h-28 rounded-full border-4 border-white/30"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm">
              <FontAwesome name="camera" size={14} color="#2eb8b8" />
            </TouchableOpacity>
          </View>

          <Text className="text-white text-2xl font-bold mt-4">
            {userData.name}
          </Text>
          <Text className="text-white/80 font-medium">{userData.email}</Text>
        </LinearGradient>

        <View className="flex-row justify-around bg-white mx-6 -mt-8 p-5 rounded-3xl shadow-sm border border-slate-100">
          <DetailItem icon="phone" label="Phone" value={userData.phone} />
          <View className="w-[1px] bg-slate-100 h-full" />
          <DetailItem
            icon="map-marker"
            label="Location"
            value={userData.city}
          />
        </View>

        <View className="px-6 mt-8 mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-slate-800">
              My Appointments
            </Text>
            <TouchableOpacity onPress={loadAppointments}>
              <FontAwesome name="refresh" size={16} color="#64748b" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#2eb8b8" />
          ) : appointments.length > 0 ? (
            appointments.map((item, index) => (
              <AppointmentCard key={index} data={item} />
            ))
          ) : (
            <View className="bg-white p-10 rounded-3xl items-center border border-dashed border-slate-300">
              <MaterialCommunityIcons
                name="calendar-blank"
                size={40}
                color="#cbd5e1"
              />
              <Text className="text-slate-400 mt-2 font-medium">
                No appointments found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  label: string;
  value: string;
}) => (
  <View className="items-center">
    <FontAwesome name={icon} size={16} color="#2eb8b8" />
    <Text className="text-slate-400 text-[10px] uppercase font-bold mt-1">
      {label}
    </Text>
    <Text className="text-slate-800 font-semibold">{value}</Text>
  </View>
);

const AppointmentCard = ({ data }: { data: any }) => {
  const isBooked = data.status === "booked";

  return (
    <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-slate-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-800">
            {data.doctorName}
          </Text>
          <Text className="text-slate-500 text-sm mb-2">
            {data.hospitalName || "General Clinic"}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            isBooked ? "bg-green-100" : "bg-orange-100"
          }`}
        >
          <Text
            className={`text-[10px] font-bold uppercase ${
              isBooked ? "text-green-600" : "text-orange-600"
            }`}
          >
            {data.status || "Pending"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center border-t border-slate-50 pt-3">
        <View className="flex-row items-center mr-6">
          <FontAwesome name="calendar" size={12} color="#64748b" />
          <Text className="text-slate-600 text-xs ml-2">
            {data.appointmentDate}
          </Text>
        </View>
        <View className="flex-row items-center">
          <FontAwesome name="clock-o" size={12} color="#64748b" />
          <Text className="text-slate-600 text-xs ml-2">
            {data.timeSlot.replace("_", " ")}
          </Text>
        </View>
      </View>

      <View className="mt-2 bg-slate-50 p-2 rounded-lg">
        <Text className="text-slate-500 text-[11px] italic">
          Issue: {data.issue}
        </Text>
      </View>
    </View>
  );
};
