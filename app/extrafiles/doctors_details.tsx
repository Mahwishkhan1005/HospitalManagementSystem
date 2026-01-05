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

export default function HospitalDetails() {
  const { id, name, deptId } = useLocalSearchParams();
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const [doctors, setDoctors] = useState<any[]>([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [bookingStatus, setBookingStatus] = useState<Record<string, string>>(
    {}
  );
  const PATIENT_ID = 1;
  const BASE_URL = "http://192.168.0.186:8081";

  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    appointmentDate: "",
    timeSlot: "",
    address: "",
    issue: "",
  });

  const fetchDoctorsByDepartment = async () => {
    try {
      setFetchingDoctors(true);

      const response = await fetch(
        `http://192.168.0.133:8080/api/doctors/department/${id}`
      );

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error("Failed to fetch doctors for department:", id);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setFetchingDoctors(false);
    }
  };

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
    if (id) {
      fetchDoctorsByDepartment();
      fetchAppointments();
    }
  }, [id]);

  const handleBookPress = (doctor: any) => {
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
      doctorId: selectedDoctor.id,
    };
    const patientId = PATIENT_ID;
    const receptionId = 2;
    const doctorId = selectedDoctor.id;

    const url = `${BASE_URL}/api/patient/appointments/${patientId}/${receptionId}/101`;
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
        notifySuccess(
          "great",
          "your appointment details submitted successfully"
        );
        const newAppointment = {
          ...formData,
          doctorId: selectedDoctor.id,
          status: "booked",
        };

        setBookingStatus((prev) => ({
          ...prev,
          [String(selectedDoctor.id)]: "booked",
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
        window.alert("enter all valid details ");
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
  const notifySuccess = (title: string, message: string) => {
    if (isWeb) {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };
  return (
    <View className="flex-1 bg-white overflow-hidden">
      {/* <ImageBackground
        source={{
          uri: "https://static.wixstatic.com/media/f38894_57e85570c334409489b69ac509228b4b~mv2.jpg/v1/fill/w_535,h_306,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f38894_57e85570c334409489b69ac509228b4b~mv2.jpg",
        }}
        className={`${isWeb ? "flex-1 " : "flex-1"}`}
        resizeMode="cover"
      > */}
      <ScrollView className="flex-1">
        <LinearGradient
          colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 186, 0.86)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="p-6"
        >
          <View
            className={`${
              isWeb ? "flex-row items-center" : "flex-row items-center pt-5"
            }`}
          >
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <FontAwesome name="chevron-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black">{name}</Text>
          </View>
        </LinearGradient>

        <Text className="text-lg font-semibold text-slate-600 m-4">
          Our Specialists
        </Text>

        {fetchingDoctors ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#2eb8b8" />
            <Text className="mt-4 text-slate-500 font-medium">
              Finding the best specialists...
            </Text>
          </View>
        ) : doctors.length > 0 ? (
          doctors.map((doctor) => {
            const status = bookingStatus[String(doctor.id)] || "idle";
            return (
              <View
                key={doctor.id}
                className={`${
                  isWeb
                    ? "flex-row items-center w-2/3 bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100 mx-8"
                    : "flex-row items-center bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100 mx-4"
                }`}
              >
                <Image
                  source={{ uri: doctor.image }}
                  className="w-16 h-16 rounded-full bg-gray-200 mr-4"
                />
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-800">
                    {doctor.name}
                  </Text>
                  <Text className="text-[#2eb8b8] my-1">
                    {doctor.specialization}
                  </Text>
                  <Text className="text-slate-500">
                    {doctor.experience} years experience
                  </Text>
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
          })
        ) : (
          <View className="items-center justify-center py-20 px-10">
            <View className="bg-slate-100 p-8 rounded-full mb-6">
              <FontAwesome name="user-md" size={60} color="#cbd5e1" />
            </View>
            <Text className="text-xl font-bold text-slate-800 text-center mb-2">
              No Doctors Available
            </Text>
            <Text className="text-slate-500 text-center leading-relaxed mb-8">
              We couldn't find any specialists for this department at the
              moment. Please check back later or try another department.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-[#2eb8b8] px-10 py-3 rounded-2xl shadow-sm"
            >
              <Text className="text-white font-bold">Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
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
                required={true}
                onChange={(val: string) =>
                  setFormData({ ...formData, patientName: val })
                }
                placeholder="Name"
              />
              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                required={true}
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
                required={true}
                onChange={(val: string) =>
                  setFormData({ ...formData, address: val })
                }
                placeholder="Address"
              />
              <InputField
                label="Issue"
                value={formData.issue}
                required={true}
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
  required,
  keyboardType = "default",
}: any) => (
  <View className="mb-4">
    <View className="flex-row">
      <Text className="text-slate-600 font-bold">{label}</Text>
      {required && <Text className="text-red-500 ml-1 font-bold">*</Text>}
    </View>
    <TextInput
      className="border border-slate-200 p-3 rounded-xl bg-slate-50"
      placeholder={placeholder}
      value={value}
      keyboardType={keyboardType}
      onChangeText={onChange}
    />
  </View>
);
