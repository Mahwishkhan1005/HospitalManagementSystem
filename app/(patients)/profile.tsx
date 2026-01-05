import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

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
  const [isVisitingVerified, setIsVisitingVerified] = useState<
    Record<string, boolean>
  >({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const PATIENT_ID = 1;
  const DOCTOR_API_URL = "http://192.168.0.133:8080";
  const BASE_URL = "http://192.168.0.186:8081";

  const userData = {
    name: "shanmukhi",
    email: "shanmukhialapati@gmail.com",
    phone: "+91 9874532345",
    city: "Hyderabad",
  };

  useEffect(() => {
    fetchProfile();
    loadAppointments();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/patient/profile/${PATIENT_ID}`);
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
      }
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setLoading(false);
    }
  };
  const handleVisitingPayment = () => {
    if (!selectedAppointment) return;

    const appId = selectedAppointment.appointmentId || selectedAppointment.id;

    setAppointments((prevAppointments) =>
      prevAppointments.map((app) => {
        const currentAppId = selectedAppointment.appointmentId || app.id;

        if (
          currentAppId === appId &&
          app.status?.toLowerCase() === "approved"
        ) {
          return { ...app, status: "Confirmed" };
        }

        return app;
      })
    );

    setModalVisible(false);

    Alert.alert("Success", "Your booking has been confirmed");
  };
  const enrichAppointmentData = async (data: any[]) => {
    return await Promise.all(
      data.map(async (item: any) => {
        const rawId = item.docId || item.doctorId;
        const cleanId = rawId ? String(rawId).trim() : null;
        if (cleanId) {
          try {
            const docRes = await fetch(
              `http://192.168.0.133:8080/api/doctors/bf0d599d-33ae-4eda-b532-46880d25ca03`
            );
            if (docRes.ok) {
              const docInfo = await docRes.json();
              return {
                ...item,
                doctorName: docInfo.name,
                hospitalName: docInfo.hospitalName,
              };
            }
          } catch (e) {
            console.error(e);
          }
        }
        return { ...item, doctorName: "Unknown Doctor", hospitalName: "N/A" };
      })
    );
  };

  const handlePayPress = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const processRazorpay = async () => {
    setModalVisible(false);
    const appointment = selectedAppointment;

    try {
      const appId = appointment.appointmentId || appointment.id;

      const res = await fetch(
        `${BASE_URL}/api/patient/payments/create/${appId}/${PATIENT_ID}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Backend failed to create order");
      if (res.ok) {
        window.alert("payment created successfully");
        Alert.alert("payment created successfully");
      }
      const orderData = await res.json();

      const options = {
        description: `Payment for appointment with ${appointment.doctorName}`,
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        currency: "INR",
        key: "rzp_test_RxJu5AW2ZIFxcL",
        amount: Math.round(orderData.amount * 100),
        name: "Hospital Management",
        order_id: orderData.razorpayOrderId,
        prefill: {
          email: userData.email,
          contact: userData.phone,
          name: userData.name,
        },
        theme: { color: "#2eb8b8" },
      };

      RazorpayCheckout.open(options)
        .then((data: any) => {
          console.log("Success:", data.razorpay_payment_id);

          verifyPayment({
            appointmentId: appId,
            razorpayPaymentId: data.razorpay_payment_id,
            razorpaySignature: data.razorpay_signature,
          });
        })
        .catch((error: any) => {
          console.log("Error Code:", error.code);
          console.log("Error Description:", error.description);
          Alert.alert(
            "Payment Cancelled",
            error.description || "You closed the payment screen."
          );
        });
    } catch (error) {
      console.error("Payment initiation error:", error);
      Alert.alert("Error", "Could not connect to payment gateway.");
    }
  };
  const verifyPayment = async (verifyBody: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/patient/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyBody),
      });

      const result = await response.json();
      if (result.status === "SUCCESS") {
        Alert.alert("Success", "Appointment Booked Successfully!");
        loadAppointments();
      }
    } catch (error) {
      Alert.alert("Error", "Verification failed.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
    }
  };
  const cash = () => {
    window.alert("Your booking has been confirmed ");
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
          <Image
            source={{ uri: profileImage }}
            className="w-28 h-28 rounded-full border-4 border-white/30"
          />
          <Text className="text-white text-2xl font-bold mt-4">
            {userData.name}
          </Text>
          <Text className="text-white/80 font-medium">{userData.email}</Text>
        </LinearGradient>

        <View className="px-6 mt-16 mb-10">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            My Appointments
          </Text>
          {loading ? (
            <ActivityIndicator color="#2eb8b8" />
          ) : (
            appointments.map((item, index) => (
              <AppointmentCard key={index} data={item} onPay={handlePayPress} />
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[40px] p-8 shadow-xl">
            <View className="items-center mb-6">
              <View className="w-12 h-1 bg-slate-200 rounded-full mb-6" />
              <Text className="text-xl font-bold text-slate-800">
                Choose Payment Method
              </Text>
              <Text className="text-slate-500 mt-1">
                Select an option to proceed
              </Text>
            </View>

            <TouchableOpacity
              onPress={processRazorpay}
              className="flex-row items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-4"
            >
              <View className="bg-blue-100 p-3 rounded-full">
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={24}
                  color="#2563eb"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-bold text-slate-800">Razorpay</Text>
                <Text className="text-xs text-slate-500">
                  Secure UPI, Cards, & Netbanking
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={12} color="#cbd5e1" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleVisitingPayment}
              className="flex-row items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-4"
            >
              <View className="bg-teal-100 p-3 rounded-full">
                <MaterialCommunityIcons
                  name="hospital-building"
                  size={24}
                  color="#0d9488"
                />
              </View>
              <TouchableOpacity className="ml-4 flex-1">
                <Text className="font-bold text-slate-800">
                  Pay at Hospital
                </Text>
                <Text className="text-xs text-slate-500">
                  Pay during your visit
                </Text>
              </TouchableOpacity>
              <FontAwesome name="chevron-right" size={12} color="#cbd5e1" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="py-4 items-center"
            >
              <Text className="text-red-500 font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const DetailItem = ({ icon, label, value }: any) => (
  <View className="items-center">
    <FontAwesome name={icon} size={16} color="#2eb8b8" />
    <Text className="text-slate-400 text-[10px] uppercase font-bold mt-1">
      {label}
    </Text>
    <Text className="text-slate-800 font-semibold">{value}</Text>
  </View>
);

const AppointmentCard = ({ data, onPay }: any) => {
  const status = data.status?.toLowerCase();

  const isPaid = status === "paid" || status === "success";
  const isConfirmed = status === "created";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const appId = data.appointmentId || data.id;
  return (
    <View
      className={`bg-white p-4 rounded-2xl mb-4 shadow-sm border ${
        isApproved && !isPaid ? "border-cyan-500" : "border-slate-100"
      }`}
    >
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
            isConfirmed || isPaid
              ? "bg-green-100"
              : isRejected
              ? "bg-red-100"
              : "bg-cyan-100"
          }`}
        >
          <Text
            className={`text-[10px] font-bold uppercase ${
              isConfirmed || isPaid
                ? "text-green-600"
                : isRejected
                ? "text-red-600"
                : "text-cyan-600"
            }`}
          >
            {data.status}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: "#f8fafc",
          paddingTop: 12,
        }}
      >
        <FontAwesome name="calendar" size={12} color="#64748b" />
        <Text style={{ color: "#475569", fontSize: 12, marginLeft: 8 }}>
          {data.appointmentDate}
        </Text>
        <View style={{ width: 16 }} />
        <FontAwesome name="clock-o" size={12} color="#64748b" />
        <Text style={{ color: "#475569", fontSize: 12, marginLeft: 8 }}>
          {data.timeSlot?.replace("_", " ")}
        </Text>
      </View>
      {isApproved && !isPaid && (
        <TouchableOpacity
          onPress={() => onPay(data)}
          className="mt-4 bg-[#2eb8b8] py-3 rounded-xl flex-row justify-center items-center"
        >
          <FontAwesome name="credit-card" size={14} color="white" />
          <Text className="text-white font-bold ml-2">Pay</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
