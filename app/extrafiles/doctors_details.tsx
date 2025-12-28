import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DOCTORS_DATA = [
  {
    id: 101,
    hospitalId: "1",
    name: "Dr. Sarah Smith",
    specialty: "Cardiology",
    image:
      "https://media.istockphoto.com/id/2104270041/photo/portrait-of-a-young-caucasian-female-doctor-at-the-ordination.jpg?s=612x612&w=0&k=20&c=FlykOJlw7rFfutD_7OmFy5z4rATURYdSEz9MmFECFDE=",
  },
  {
    id: 102,
    hospitalId: "1",
    name: "Dr. John Doe",
    specialty: "Pediatrics",
    image:
      "https://www.shutterstock.com/image-photo/portrait-handsome-male-doctor-stethoscope-600nw-2480850611.jpg",
  },
  {
    id: 202,
    hospitalId: "2",
    name: "Dr. John Doe",
    specialty: "Pediatrics",
    image:
      "https://www.shutterstock.com/image-photo/portrait-handsome-male-doctor-stethoscope-600nw-2480850611.jpg",
  },
  {
    id: 201,
    hospitalId: "2",
    name: "Dr. Emily White",
    specialty: "Oncology",
    image:
      "https://media.istockphoto.com/id/1425798958/photo/photo-of-confident-female-doctor-in-hospital-looking-at-camera-with-smile.jpg?s=612x612&w=0&k=20&c=i91idG544pXuYkw5ju6iIzm1m-lEqQaygeOOrjG5GEk=",
  },
  {
    id: 301,
    hospitalId: "3",
    name: "Dr. Emily White",
    specialty: "Oncology",
    image:
      "https://media.istockphoto.com/id/1425798958/photo/photo-of-confident-female-doctor-in-hospital-looking-at-camera-with-smile.jpg?s=612x612&w=0&k=20&c=i91idG544pXuYkw5ju6iIzm1m-lEqQaygeOOrjG5GEk=",
  },
  {
    id: 302,
    hospitalId: "3",
    name: "Dr. Emily White",
    specialty: "Oncology",
    image:
      "https://media.istockphoto.com/id/1425798958/photo/photo-of-confident-female-doctor-in-hospital-looking-at-camera-with-smile.jpg?s=612x612&w=0&k=20&c=i91idG544pXuYkw5ju6iIzm1m-lEqQaygeOOrjG5GEk=",
  },
];

export default function HospitalDetails() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const doctors = DOCTORS_DATA.filter((doc) => doc.hospitalId === id);

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof DOCTORS_DATA)[0] | null
  >(null);
  const [bookingStatus, setBookingStatus] = useState<Record<string, string>>(
    {}
  );
  const PATIENT_ID = 1;
  const BASE_URL = "http://192.168.0.215:8081";

  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    appointmentDate: "",
    timeSlot: "",
    address: "",
    issue: "",
  });
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/patient/appointments/${PATIENT_ID}`
      );
      if (response.ok) {
        const appointments = await response.json();
        const statusMap: Record<string, string> = {};

        appointments.forEach((app: any) => {
          const dId = app.doctorId || (app.doctor && app.doctor.id);

          if (dId) {
            statusMap[String(dId)] = (app.status || "booked").toLowerCase();
          }
        });

        console.log("Mapped Statuses:", statusMap);
        setBookingStatus(statusMap);
      }
    } catch (e) {
      console.error("Failed to fetch appointments", e);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBookPress = (doctor: (typeof DOCTORS_DATA)[0]) => {
    if (bookingStatus[doctor.id]) return;
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const submitBooking = async () => {
    if (!selectedDoctor) return;
    setLoading(true);

    let dateToSend = formData.appointmentDate;
    if (dateToSend.includes("-") && dateToSend.split("-")[0].length === 4) {
      const [y, m, d] = dateToSend.split("-");
      dateToSend = `${d}-${m}-${y}`;
    }

    const payload = {
      ...formData,
      appointmentDate: dateToSend,
    };

    const url = `http://192.168.0.215:8081/api/patient/appointments/1/2/${selectedDoctor.id}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newAppointment = {
          ...formData,
          doctorId: selectedDoctor.id,
          status: "booked",
        };

        setBookingStatus((prev) => ({
          ...prev,
          [selectedDoctor.id]: "booked",
        }));

        const existingData = await AsyncStorage.getItem("my_appointments");
        const appointments = existingData ? JSON.parse(existingData) : [];
        appointments.push(newAppointment);
        await AsyncStorage.setItem(
          "my_appointments",
          JSON.stringify(appointments)
        );

        Alert.alert("Success", "Appointment Booked!");
        setModalVisible(false);
        await fetchAppointments();
        setFormData({
          patientName: "",
          phoneNumber: "",
          appointmentDate: "",
          timeSlot: "",
          address: "",
          issue: "",
        });
      } else {
        const err = await response.text();
        console.log("Server Error:", err);
        Alert.alert("Failed", "Server rejected the booking.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Connection Error", "Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <LinearGradient
          colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="p-6"
        >
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <FontAwesome name="chevron-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black">{name}</Text>
          </View>
        </LinearGradient>

        <Text className="text-lg font-semibold text-slate-600 m-4">
          Our Specialists
        </Text>

        {doctors.map((doctor) => {
          const status = bookingStatus[doctor.id] || "idle";
          return (
            <View
              key={doctor.id}
              className="flex-row items-center bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100 mx-4"
            >
              <Image
                source={{ uri: doctor.image }}
                className="w-16 h-16 rounded-full bg-gray-200 mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-800">
                  {doctor.name}
                </Text>
                <Text className="text-[#2eb8b8]">{doctor.specialty}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleBookPress(doctor)}
                disabled={status !== "idle"}
                className={`px-4 py-2 rounded-lg ${
                  status === "pending"
                    ? "bg-orange-400"
                    : status === "booked"
                    ? "bg-blue-400"
                    : "bg-[#2eb8b8]"
                }`}
              >
                <Text className="text-white font-bold capitalize">
                  {status === "idle" ? "Book" : status}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end bg-black/50">
          <View
            className={`bg-white rounded-t-3xl p-6 ${
              isWeb ? "w-1/2 mx-auto mb-10 rounded-3xl" : "w-full"
            }`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Booking Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={24} color="gray" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="max-h-[500px]"
            >
              <InputField
                label="Patient Name"
                value={formData.patientName}
                onChange={(val: string) =>
                  setFormData({ ...formData, patientName: val })
                }
                placeholder="Name"
              />
              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(val: string) =>
                  setFormData({ ...formData, phoneNumber: val })
                }
                placeholder="Phone"
                keyboardType="phone-pad"
              />

              <Text className="text-slate-600 font-bold mb-2">
                Appointment Date
              </Text>
              {isWeb ? (
                <input
                  type="date"
                  className="border border-slate-200 p-2 rounded-lg mb-4"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentDate: e.target.value,
                    })
                  }
                />
              ) : (
                <TextInput
                  className="border border-slate-200 p-3 rounded-xl mb-4"
                  placeholder="DD-MM-YYYY"
                  value={formData.appointmentDate}
                  onChangeText={(val) =>
                    setFormData({ ...formData, appointmentDate: val })
                  }
                />
              )}

              <Text className="text-slate-600 font-bold mb-2">Slot</Text>
              <View className="border border-slate-200 rounded-xl mb-4 bg-slate-50">
                <Picker
                  selectedValue={formData.timeSlot}
                  onValueChange={(val) =>
                    setFormData({ ...formData, timeSlot: val })
                  }
                >
                  <Picker.Item label="Morning 10:00" value="MORNING_10_00" />
                  <Picker.Item label="Morning 11:00" value="MORNING_11_00" />
                  <Picker.Item label="Morning 12:00" value="MORNING_12_00" />
                  <Picker.Item label="Evening 03:00" value="EVENING_03_00" />
                  <Picker.Item label="Evening 04:00" value="EVENING_04_00" />
                  <Picker.Item label="Evening 05:00" value="EVENING_05_00" />
                  <Picker.Item label="Evening 06:00" value="EVENING_06_00" />
                  <Picker.Item label="Evening 07:00" value="EVENING_07_00" />
                </Picker>
              </View>

              <InputField
                label="Address"
                value={formData.address}
                onChange={(val: string) =>
                  setFormData({ ...formData, address: val })
                }
                placeholder="Address"
              />
              <InputField
                label="Issue"
                value={formData.issue}
                onChange={(val: string) =>
                  setFormData({ ...formData, issue: val })
                }
                placeholder="Issue"
              />

              <TouchableOpacity
                onPress={submitBooking}
                disabled={loading}
                className="bg-[#2eb8b8] p-4 rounded-2xl items-center mt-4 mb-8"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Confirm Booking
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
}: any) => (
  <View className="mb-4">
    <Text className="text-slate-600 font-bold mb-2">{label}</Text>
    <TextInput
      className="border border-slate-200 p-3 rounded-xl bg-slate-50"
      placeholder={placeholder}
      value={value}
      keyboardType={keyboardType}
      onChangeText={onChange}
    />
  </View>
);
