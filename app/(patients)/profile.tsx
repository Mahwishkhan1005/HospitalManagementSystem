import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RazorpayCheckout, { SuccessResponse } from "react-native-razorpay";
interface Appointment {
  id: string;
  doctorName?: string;
  hospitalName?: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  issue: string;
}
export default function ProfilePage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );
  const [uploading, setUploading] = useState(false);
  const PATIENT_ID = 1;
  const BASE_URL = "http://192.168.0.217:8081";
  const userData = {
    name: "shanmukhi",
    email: "shanmukhi@example.com",
    phone: "+91 9874532345",
    city: "Hyderabad",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/patient/profile/${PATIENT_ID}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.imagePath) {
            const fullImageUrl = data.imagePath.startsWith("http")
              ? data.imagePath
              : `${BASE_URL}/${data.imagePath}`;

            setProfileImage(fullImageUrl);
          }
        }
      } catch (e) {
        console.error("Failed to load profile image", e);
      }
    };

    fetchProfile();
    loadAppointments();
  }, []);
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to change your profile picture."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      uploadImage(selectedUri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append("file", {
        uri: uri,
        name: `profile_${PATIENT_ID}.jpg`,
        type: "image/jpeg",
      });

      const response = await fetch(
        `${BASE_URL}/api/patient/upload-profile/${PATIENT_ID}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.ok) {
        setProfileImage(uri);
        Alert.alert("Success", "Profile picture updated!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to upload image to server.");
    } finally {
      setUploading(false);
    }
  };

  const enrichAppointmentData = async (data: any[]) => {
    return await Promise.all(
      data.map(async (item: any) => {
        if (!item.doctorName && item.doctorId) {
          try {
            const docRes = await fetch(
              `${BASE_URL}/api/doctors/${item.doctorId}`
            );
            if (docRes.ok) {
              const docInfo = await docRes.json();
              return {
                ...item,
                doctorName: docInfo.name,
                hospitalName: docInfo.hospital?.name || "General Hospital",
              };
            }
          } catch (e) {
            console.error("Error fetching doctor details:", e);
          }
        }
        return item;
      })
    );
  };
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/patient/appointments/${PATIENT_ID}`
      );

      if (response.ok) {
        const data = await response.json();

        const fullData = await enrichAppointmentData(data);
        setAppointments(fullData.reverse());
      } else {
        const saved = await AsyncStorage.getItem("my_appointments");
        if (saved) {
          const localData = JSON.parse(saved);
          const fullData = await enrichAppointmentData(localData);
          setAppointments(fullData.reverse());
        }
      }
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setLoading(false);
    }
  };
  const handlePayment = async (appointment: { id: any; doctorName: any }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/patient/payments/create/${appointment.id}/${PATIENT_ID}`,
        {
          method: "POST",
        }
      );
      const orderData = await response.json();

      const options = {
        description: `Appointment with ${appointment.doctorName}`,
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        currency: "INR",
        key: orderData.key,
        amount: orderData.amount,
        name: "Healthcare App",
        order_id: orderData.razorpayOrderId,
        prefill: {
          email: userData.email,
          contact: userData.phone,
          name: userData.name,
        },
        theme: { color: "#2eb8b8" },
      };

      const successData = await RazorpayCheckout.open(options);

      await verifyPayment(successData, appointment.id);
    } catch (error) {
      console.error("Payment failed", error);
      Alert.alert(
        "Payment Cancelled",
        "The payment process was not completed."
      );
    }
  };
  const verifyPayment = async (
    paymentData: SuccessResponse,
    appointmentId: any
  ) => {
    const response = await fetch(`${BASE_URL}/api/patient/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpaySignature: paymentData.razorpay_signature,
        razorpayOrderId: paymentData.razorpay_order_id,
      }),
    });

    if (response.ok) {
      Alert.alert("Success", "Payment Successful! Appointment Confirmed.");
      loadAppointments();
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
            {uploading ? (
              <View className="w-28 h-28 rounded-full border-4 border-white/30 items-center justify-center bg-black/20">
                <ActivityIndicator color="white" />
              </View>
            ) : (
              <Image
                source={{ uri: profileImage }}
                className="w-28 h-28 rounded-full border-4 border-white/30"
              />
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm"
              onPress={pickImage}
            >
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
              <AppointmentCard
                key={index}
                data={item}
                onPay={(item) => handlePayment(item)}
              />
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

const AppointmentCard = ({
  data,
  onPay,
}: {
  data: any;
  onPay: (item: any) => void;
}) => {
  const status = data.status?.toLowerCase();
  const isPaid = status === "paid";
  const isApproved = status === "approved";

  return (
    <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-slate-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-800">
            {data.doctorName}
          </Text>
          <Text className="text-slate-500 text-sm mb-2">
            {data.hospitalName}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            isPaid ? "bg-green-100" : "bg-orange-100"
          }`}
        >
          <Text
            className={`text-[10px] font-bold uppercase ${
              isPaid ? "text-green-600" : "text-orange-600"
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
            {data.timeSlot?.replace("_", " ")}
          </Text>
        </View>
      </View>

      {isApproved && !isPaid && (
        <TouchableOpacity
          onPress={() => onPay(data)}
          className="mt-4 bg-[#2eb8b8] py-3 rounded-xl flex-row justify-center items-center"
        >
          <FontAwesome name="credit-card" size={14} color="white" />
          <Text className="text-white font-bold ml-2">Pay & Confirm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
