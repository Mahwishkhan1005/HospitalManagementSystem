import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import '../globals.css';

// API Configuration
const API_BASE_URL = 'http://192.168.0.246:8080/api';
const HOSPITAL_API = `${API_BASE_URL}/hospitals`;
const DEPARTMENT_API = `${API_BASE_URL}/departments`;
const DOCTOR_API = `${API_BASE_URL}/doctors`;
const SIGNUP_API = 'http://192.168.0.246:8080/api/auth/create-receptionist';

/* -------------------- HOSPITAL CARD -------------------- */

const HospitalCard = ({ item, onPress, onEdit, onDelete }) => {
  return (
    <View className="w-1/3 px-1.5 mb-4">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#ffffff', '#f0f7ff']}
          className="rounded-3xl p-4 shadow-xl h-full"
        >
        {/* Action Buttons */}
        <View className="absolute top-3 right-3 flex-row space-x-2 z-10">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="bg-blue-500 w-8 h-8 rounded-full items-center justify-center"
          >
            <Text className="text-white">✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="bg-red-500 w-8 h-8 rounded-full items-center justify-center"
          >
            <Text className="text-white">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar/Image */}
        <View className="items-center mt-2">
            <View className="w-16 h-16 rounded-2xl overflow-hidden bg-green-200">
              <Image
                source={{
                  uri: item.picture
                    ? item.picture
                    : 'https://via.placeholder.com/150?text=Hospital',
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>


          <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
            {item.name}
          </Text>

          <View className="flex-row items-center mt-1">
            <Text className="text-blue-600 text-sm">{item.city}</Text>
            <Text className="text-gray-500 text-sm mx-1">•</Text>
            <Text className="text-blue-600 text-sm">{item.rating} ⭐</Text>
          </View>
        </View>

        {/* Info */}
          <View className="mt-4 space-y-2">
            <View className="flex-row items-center bg-white p-2 rounded-xl">
            <Ionicons
              name="location-outline"
              size={18}
              color="#2563EB"
              style={{ marginRight: 8 }}
            />
            <Text className="text-gray-700 text-sm flex-1" numberOfLines={1}>
              {item.address}
            </Text>
          </View>
          
          <View className="flex-row justify-between">
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 text-xs">👨‍⚕️ {item.numberOfDoctors}</Text>
            </View>
            <View className="bg-purple-100 px-3 py-1 rounded-full">
              <Text className="text-purple-700 text-xs">🛏️ {item.numberOfBeds}</Text>
            </View>
            <View className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="text-orange-700 text-xs">📅 {item.ageOfHospital}yrs</Text>
            </View>
          </View>
        </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------- ADD HOSPITAL CARD -------------------- */

const AddHospitalCard = ({ onPress }) => {
  return (
    <View className="w-1/3 px-1.5 mb-4">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#f0f9ff', '#e0f2fe']}
          className="rounded-3xl p-4 shadow-xl border-2 border-dashed border-sky-300 h-full"
        >
          <View className="items-center justify-center h-full">
            <View className="w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-3">
              <Text className="text-3xl">➕</Text>
            </View>

            <Text className="text-base font-bold text-gray-900 text-center">
              Add New Hospital
            </Text>

            <Text className="text-blue-600 text-sm mt-2 text-center">
              Click to add hospital details
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

/* -------------------- DOCTOR CARD (GRID VIEW - 3 PER ROW) -------------------- */

const DoctorCard = ({ item, onPress, onEdit, onDelete }) => (
  <View className="w-40 px-2 mb-3">
    <View className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
      {/* Action buttons */}
      <View className="absolute top-1 right-1 flex-row space-x-1 z-10">
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onEdit && onEdit(item);
          }}
          className="bg-blue-500 w-6 h-6 rounded-full items-center justify-center"
        >
          <Text className="text-white text-xs">✎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onDelete && onDelete(item);
          }}
          className="bg-red-500 w-6 h-6 rounded-full items-center justify-center"
        >
          <Text className="text-white text-xs">✕</Text>
        </TouchableOpacity>
      </View>
      
      <View className="w-full h-24 rounded-lg bg-gray-100 overflow-hidden mb-2">
        <Image
          source={{ 
            uri: item.picture || 'https://via.placeholder.com/150?text=Doctor'
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      
      <Text className="font-bold text-sm text-gray-900 mb-1" numberOfLines={1}>
        {item.name}
      </Text>
      <Text className="text-blue-600 text-xs mb-1" numberOfLines={1}>
        {item.specialization}
      </Text>
      <Text className="text-gray-500 text-xs mb-1">
        Exp: {item.experience} yrs
      </Text>
      <Text className="text-green-600 text-xs mb-2">
        ₹{item.fee}
      </Text>

      <View className="flex-row space-x-1">
      </View>
    </View>
  </View>
);

/* -------------------- SIGNUP COMPONENT -------------------- */

const SignupComponent = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receiptionist');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        password,
        role,
      };
const token = await AsyncStorage.getItem("AccessToken"); // Admin's Token
      const res = await axios.post(SIGNUP_API, payload, {
      headers: {
        'Authorization': `Bearer ${token}` // Attach JWT
      }
    });

      setSuccessMessage(
        res.data?.message || `${role} registered successfully`
      );
      setSuccessModalVisible(true);
      
      // Reset form
      setEmail('');
      setPassword('');
      setRole('receiptionist');
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center bg-black/40">
          {/* 🌈 BACKGROUND 3D GRADIENT */}
          <LinearGradient
            colors={['#c7d2fe', '#e9d5ff', '#fae8ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />

          {/* 📦 CARD */}
          <View
            style={{
              transform: [{ scale: 0.92 }],
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 25,
              shadowOffset: { width: 0, height: 15 },
              elevation: 15,
            }}
            className="w-full max-w-md rounded-3xl overflow-hidden"
          >
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              className="p-6"
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-3xl font-bold text-gray-800">
                  Create Account
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={28} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* EMAIL */}
              <View className="mb-4">
                <Text className="text-sm mb-1 text-gray-600">Email</Text>
                <TextInput
                  className="border rounded-xl p-3 bg-white"
                  placeholder="doctor123@gmail.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* PASSWORD */}
              <View className="mb-4">
                <Text className="text-sm mb-1 text-gray-600">Password</Text>
                <View className="border rounded-xl p-3 flex-row items-center bg-white">
                  <TextInput
                    className="flex-1"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ROLE DROPDOWN */}
              <View className="mb-6">
                <Text className="text-sm mb-1 text-gray-600">Role</Text>

                <TouchableOpacity
                  onPress={() => setShowRoleDropdown(v => !v)}
                  className="border rounded-xl p-3 bg-white flex-row justify-between items-center"
                >
                  <Text className="text-gray-800 capitalize">
                    {role}
                  </Text>
                  <Ionicons
                    name={showRoleDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                  />
                </TouchableOpacity>

                {showRoleDropdown && (
                  <View className="mt-2 border rounded-xl overflow-hidden bg-white">
                    {['receiptionist'].map(item => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setRole(item);
                          setShowRoleDropdown(false);
                        }}
                        className="p-3 border-b last:border-b-0"
                      >
                        <Text className="capitalize text-gray-700">
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* REGISTER BUTTON */}
              <TouchableOpacity disabled={loading} onPress={handleRegister}>
                <LinearGradient
                  colors={['#6366f1', '#4f46e5', '#4338ca']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-xl p-4"
                >
                  <Text className="text-white text-center font-bold text-lg">
                    {loading ? 'Please wait...' : 'Register'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* SUCCESS MODAL */}
          <Modal visible={successModalVisible} transparent animationType="fade">
            <View className="flex-1 items-center justify-center bg-black/40">
              <View className="bg-white rounded-3xl p-6 w-[90%] max-w-sm">
                <Text className="text-xl font-bold mb-3 text-green-600">
                  Success 🎉
                </Text>

                <Text className="text-gray-700 mb-6">
                  {successMessage}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setSuccessModalVisible(false);
                    onClose();
                  }}
                  className="bg-indigo-600 rounded-xl py-3"
                >
                  <Text className="text-white text-center font-bold">
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

/* -------------------- APP -------------------- */

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [addHospitalModalVisible, setAddHospitalModalVisible] = useState(false);
  const [editHospitalModalVisible, setEditHospitalModalVisible] = useState(false);
  const [viewDepartmentsModalVisible, setViewDepartmentsModalVisible] = useState(false);
  const [addDepartmentModalVisible, setAddDepartmentModalVisible] = useState(false);
  const [editDepartmentModalVisible, setEditDepartmentModalVisible] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hospitalStep, setHospitalStep] = useState(1);
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [activeTab, setActiveTab] = useState('hospitals');

  // New state variables
  const [searchDepartment, setSearchDepartment] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [signupModalVisible, setSignupModalVisible] = useState(false);

  // Doctor management states
  const [addDoctorModalVisible, setAddDoctorModalVisible] = useState(false);
  const [editDoctorModalVisible, setEditDoctorModalVisible] = useState(false);
  const [viewDoctorsModalVisible, setViewDoctorsModalVisible] = useState(false);
  const [viewDoctorsDepartmentId, setViewDoctorsDepartmentId] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDepartmentForDoctors, setSelectedDepartmentForDoctors] = useState(null);
  const [uploadingDoctorImage, setUploadingDoctorImage] = useState(false);

  // New hospital form state
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    city: '',
    numberOfDoctors: '',
    numberOfBeds: '',
    ageOfHospital: '',
    rating: '',
    about: '',
    contactNumber: '',
    picture: null,
    localImage: null,
  });

  // Edit hospital state
  const [editHospital, setEditHospital] = useState({
    id: '',
    name: '',
    address: '',
    city: '',
    numberOfDoctors: '',
    numberOfBeds: '',
    ageOfHospital: '',
    rating: '',
    about: '',
    contactNumber: '',
    picture: null,
    localImage: null,
  });

  // Department form states
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
  });

  const [editDepartment, setEditDepartment] = useState({
    id: '',
    name: '',
    description: '',
    hospitalId: '',
  });

  // Doctor form states
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    phone: '',
    mail: '',
    specialization: '',
    experience: '',
    fee: '',
    education: '',
    departmentId: '',
    cabinNumber: '',
    picture: null,
    localImage: null,
  });

  const [editDoctor, setEditDoctor] = useState({
    id: '',
    name: '',
    phone: '',
    mail: '',
    specialization: '',
    experience: '',
    fee: '',
    education: '',
    departmentId: '',
    cabinNumber: '',
    picture: null,
    localImage: null,
  });

  // Helper functions for 3D effects
  const getDepartmentColors = (index) => {
    const colorSchemes = [
      ['#667eea', '#764ba2'], // Blue-Purple
      ['#f093fb', '#f5576c'], // Pink-Red
      ['#4facfe', '#00f2fe'], // Blue-Cyan
      ['#43e97b', '#38f9d7'], // Green-Turquoise
      ['#fa709a', '#fee140'], // Pink-Yellow
      ['#a8edea', '#fed6e3'], // Pastel Blue-Pink
      ['#ffecd2', '#fcb69f'], // Peach
      ['#89f7fe', '#66a6ff'], // Sky Blue
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  const getShadowColor = (index) => {
    const colors = [
      '#764ba2', '#f5576c', '#00f2fe', '#38f9d7', 
      '#fee140', '#fed6e3', '#fcb69f', '#66a6ff'
    ];
    return colors[index % colors.length];
  };

  // Load hospitals from API with proper image handling
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("AccessToken");

      const response = await fetch(`${HOSPITAL_API}/all`, {
      headers: {
        'Authorization': `Bearer ${token}` // 2. Add Header
      }
    });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched hospitals:', data);
      
      // For each hospital, check AsyncStorage for persisted image
      const normalizedHospitals = await Promise.all(
        data.map(async (h) => {
          try {
            const key = `hospital:${h.id}:picture`;
            const savedPicture = await AsyncStorage.getItem(key);
            
            // Use server picture first, then saved picture, then null
            const picture = h.picture || savedPicture || null;
            
            // If server returned picture but different from saved one, update storage
            if (h.picture && h.picture !== savedPicture) {
              await AsyncStorage.setItem(key, h.picture);
            }
            
            return { ...h, picture };
          } catch (e) {
            console.log('Error reading picture from storage for hospital:', h.id, e);
            return { ...h, picture: h.picture || null };
          }
        })
      );

      setHospitals(normalizedHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      Alert.alert('Error', 'Failed to fetch hospitals. Please check your connection.');
      setHospitals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsAddingHospital(false);
    }
  };

  // Load departments for a hospital
  const fetchDepartments = async (hospitalId) => {
    if (!hospitalId) return;
    
    try {
      setLoadingDepartments(true);
      const token = await AsyncStorage.getItem("AccessToken");
      const response = await fetch(`${DEPARTMENT_API}/hospital/${hospitalId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Key addition for JWT
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched departments:', data);
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      Alert.alert('Error', 'Failed to fetch departments.');
      setDepartments([]);
      setFilteredDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Load doctors for a department
  const fetchDoctorsByDepartment = async (departmentId) => {
    if (!departmentId) return;
    
    try {
      setLoadingDoctors(true);
      const token = await AsyncStorage.getItem("AccessToken");
      const response = await fetch(`${DOCTOR_API}/department/${departmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the JWT here
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched doctors:', data);
      
      // Normalize doctors with persisted images
      const normalized = await Promise.all(
        data.map(async (d) => {
          try {
            const key = `doctor:${d.id}:picture`;
            const savedPicture = await AsyncStorage.getItem(key);
            
            // Use server picture first, then saved picture, then null
            const picture = d.picture || savedPicture || null;
            
            // If server returned picture but different from saved one, update storage
            if (d.picture && d.picture !== savedPicture) {
              await AsyncStorage.setItem(key, d.picture);
            }
            
            return { ...d, picture };
          } catch (e) {
            console.log('Error reading doctor picture from storage', e);
            return { ...d, picture: d.picture || null };
          }
        })
      );
      
      setDoctors(normalized);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert('Error', 'Failed to fetch doctors.');
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Load all doctors for selected hospital (from all departments)
  const fetchAllDoctorsForHospital = async () => {
    if (!selectedHospital?.id) return;
    
    try {
      setLoadingDoctors(true);
      // Get all departments first
      const deptResponse = await fetch(`${DEPARTMENT_API}/hospital/${selectedHospital.id}`);
      if (!deptResponse.ok) {
        throw new Error(`HTTP error! status: ${deptResponse.status}`);
      }
      const departments = await deptResponse.json();
      
      // Fetch doctors for each department
      const allDoctors = [];
      for (const dept of departments) {
        const doctorResponse = await fetch(`${DOCTOR_API}/department/${dept.id}`);
        if (doctorResponse.ok) {
          const doctors = await doctorResponse.json();
          allDoctors.push(...doctors);
        }
      }

      // Normalize and load persisted pictures
      const normalized = await Promise.all(
        allDoctors.map(async (d) => {
          try {
            const key = `doctor:${d.id}:picture`;
            const savedPicture = await AsyncStorage.getItem(key);
            
            // Use server picture first, then saved picture, then null
            const picture = d.picture || savedPicture || null;
            
            // If server returned picture but different from saved one, update storage
            if (d.picture && d.picture !== savedPicture) {
              await AsyncStorage.setItem(key, d.picture);
            }
            
            return { ...d, picture };
          } catch (e) {
            console.log('Error reading doctor picture from storage', e);
            return { ...d, picture: d.picture || null };
          }
        })
      );

      console.log('Fetched all doctors for hospital:', normalized);
      setDoctors(normalized);
    } catch (error) {
      console.error('Error fetching all doctors:', error);
      Alert.alert('Error', 'Failed to fetch doctors.');
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital?.id && viewDepartmentsModalVisible) {
      fetchDepartments(selectedHospital.id);
    }
  }, [selectedHospital, viewDepartmentsModalVisible]);

  // useEffect for filtering departments
  useEffect(() => {
    if (departments.length > 0) {
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchDepartment.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchDepartment.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [searchDepartment, departments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHospitals();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['AccessToken', 'userRole']);
      router.replace('/');
    } catch (e) {
      console.log('Logout failed', e);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const filteredHospitals = useMemo(() => {
    const q = (search || '').toLowerCase();
    return hospitals.filter(h => {
      const name = (h?.name || '').toString().toLowerCase();
      const city = (h?.city || '').toString().toLowerCase();
      const address = (h?.address || '').toString().toLowerCase();
      return name.includes(q) || city.includes(q) || address.includes(q);
    });
  }, [search, hospitals]);

  // Image Picker Function with better error handling
  const pickImage = async (isEdit = false, isDoctor = false) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        
        // For new hospital/doctor, store in state
        if (isDoctor) {
          if (isEdit) {
            setEditDoctor(prev => ({
              ...prev,
              localImage: imageUri
            }));
          } else {
            setNewDoctor(prev => ({
              ...prev,
              localImage: imageUri
            }));
          }
        } else {
          if (isEdit) {
            setEditHospital(prev => ({
              ...prev,
              localImage: imageUri
            }));
          } else {
            setNewHospital(prev => ({
              ...prev,
              localImage: imageUri
            }));
          }
        }
        
        Alert.alert('Success', 'Image selected successfully. It will be uploaded when you save.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Load any unsaved images on component mount
  useEffect(() => {
    const loadUnsavedImages = async () => {
      try {
        // Load unsaved new hospital image
        const hospitalUri = await AsyncStorage.getItem('unsaved:newHospital:picture');
        if (hospitalUri) {
          setNewHospital(prev => ({ ...prev, localImage: hospitalUri }));
        }
        
        // Load unsaved new doctor image
        const doctorUri = await AsyncStorage.getItem('unsaved:newDoctor:picture');
        if (doctorUri) {
          setNewDoctor(prev => ({ ...prev, localImage: doctorUri }));
        }
      } catch (e) {
        console.log('Error loading unsaved images', e);
      }
    };
    loadUnsavedImages();
  }, []);

  // Add new hospital with proper image persistence
  const handleAddHospital = async () => {
    if (!newHospital.name.trim() || !newHospital.address.trim() || !newHospital.city.trim()) {
      Alert.alert('Error', 'Please fill required fields (Name, Address, City)');
      return;
    }

    if (isAddingHospital) return;

    try {
      setIsAddingHospital(true);
      setUploadingImage(true);

      const hospitalData = {
        name: newHospital.name,
        address: newHospital.address,
        city: newHospital.city,
        numberOfDoctors: parseInt(newHospital.numberOfDoctors) || 0,
        numberOfBeds: parseInt(newHospital.numberOfBeds) || 0,
        ageOfHospital: parseInt(newHospital.ageOfHospital) || 0,
        rating: parseFloat(newHospital.rating) || 0,
        about: newHospital.about || '',
        contactNumber: newHospital.contactNumber || '',
      };

      const formData = new FormData();
      formData.append(
        'hospital',
        new Blob([JSON.stringify(hospitalData)], {
          type: 'application/json',
        })
      );

      // ✅ IMAGE PART (OPTIONAL)
      if (newHospital.localImage) {
        const uri = newHospital.localImage;
        const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('picture', {
          uri,
          name: filename,
          type,
        });
      }
const token = await AsyncStorage.getItem("AccessToken"); // Get Token
      const res = await axios.post(`${HOSPITAL_API}/add`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add Header
        'Content-Type': 'multipart/form-data'
      }
    });
      
      // Extract the response properly
      const savedHospital = res.data || {};
      console.log('Hospital add response:', savedHospital);
      
      // Get the picture URL from response - try multiple possible fields
      const pictureUrl = savedHospital.picture || 
                        savedHospital.image || 
                        (savedHospital.hospital && savedHospital.hospital.picture) || 
                        null;

      // Create the hospital object with proper picture
      const hospitalWithPicture = {
        ...savedHospital,
        picture: pictureUrl,
      };

      // Update state
      setHospitals(prev => [hospitalWithPicture, ...prev]);
      
      // Persist picture in AsyncStorage if we have an ID and picture URL
      if (hospitalWithPicture.id && hospitalWithPicture.picture) {
        try {
          await AsyncStorage.setItem(`hospital:${hospitalWithPicture.id}:picture`, hospitalWithPicture.picture);
        } catch (e) {
          console.log('Error saving hospital picture to storage', e);
        }
      }
      
      // Clean up unsaved image
      try {
        await AsyncStorage.removeItem('unsaved:newHospital:picture');
      } catch (e) {
        console.log('Failed removing unsaved image after save', e);
      }

      // Reset form
      setNewHospital({
        name: '',
        address: '',
        city: '',
        numberOfDoctors: '',
        numberOfBeds: '',
        ageOfHospital: '',
        rating: '',
        about: '',
        contactNumber: '',
        picture: null,
        localImage: null,
      });

      setHospitalStep(1);
      setAddHospitalModalVisible(false);
      
      // If we have the hospital data, set it as selected
      if (hospitalWithPicture.id) {
        setSelectedHospital(hospitalWithPicture);
      }

      Alert.alert('Success ✅', 'Hospital added successfully!');

    } catch (error) {
      console.error('Add hospital failed:', error?.response?.data || error.message || error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to add hospital. Please try again.'
      );
    } finally {
      setIsAddingHospital(false);
      setUploadingImage(false);
    }
  };

  // Update hospital with proper image persistence
 const handleEditHospital = async () => {
  if (!editHospital.id) return;

  try {
    setUploadingImage(true);

    // 1. Retrieve the token from storage
    const token = await AsyncStorage.getItem('AccessToken');

    const hospitalInfoPayload = {
      // Use optional chaining to prevent the "null reading toString" error
      name: editHospital?.name || '',
      address: editHospital?.address || '',
      city: editHospital?.city || '',
      numberOfDoctors: editHospital?.numberOfDoctors ? parseInt(editHospital.numberOfDoctors) : 0,
      numberOfBeds: editHospital?.numberOfBeds ? parseInt(editHospital.numberOfBeds) : 0,
      ageOfHospital: editHospital?.ageOfHospital ? parseInt(editHospital.ageOfHospital) : 0,
      rating: editHospital?.rating ? parseFloat(editHospital.rating) : 0,
      about: editHospital?.about || '',
      contactNumber: editHospital?.contactNumber || '',
    };

    const formData = new FormData();
    formData.append(
      'hospital',
      new Blob([JSON.stringify(hospitalInfoPayload)], {
        type: 'application/json',
      })
    );

    // ✅ IMAGE PART
    if (editHospital.localImage) {
      const uri = editHospital.localImage;
      const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('picture', {
        uri,
        name: filename,
        type,
      } as any); // Use 'as any' for TypeScript
    }

    // 2. Add the Authorization header
    const res = await axios.put(
      `${HOSPITAL_API}/update/${editHospital.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let axios set Content-Type for FormData automatically
        },
      }
    );

    // --- EXTRACT RESPONSE ---
    const updatedData = res.data || {};
    const pictureUrl = updatedData.picture || 
                       updatedData.image || 
                       (updatedData.hospital && updatedData.hospital.picture) ||
                       editHospital.localImage ||
                       null;

    const updatedHospital = { ...updatedData, picture: pictureUrl };

    // --- UPDATE STATE ---
    setHospitals(prev => prev.map(h => h.id === editHospital.id ? updatedHospital : h));

    if (updatedHospital.id && updatedHospital.picture) {
      await AsyncStorage.setItem(`hospital:${updatedHospital.id}:picture`, updatedHospital.picture);
    }

    setSelectedHospital(prev => prev?.id === updatedHospital.id ? updatedHospital : prev);
    setEditHospitalModalVisible(false);

    Alert.alert('Success ✅', 'Hospital updated successfully!');

  } catch (error) {
    console.error('Update hospital failed:', error?.response?.data || error.message);
    
    // Handle specific session expiration
    if (error.response?.status === 403 || error.response?.status === 401) {
      Alert.alert('Unauthorized', 'Your session has expired. Please login again.');
    } else {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update hospital.');
    }
  } finally {
    setUploadingImage(false);
  }
};

  // DELETE HOSPITAL
  const handleDeleteHospital = async (hospital) => {
    const id = hospital?.id;
    if (!id) return;

    try {
      const token = await AsyncStorage.getItem('AccessToken');
      await axios.delete(`${HOSPITAL_API}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setHospitals(prev => prev.filter(h => h.id !== id));

      // Remove persisted picture for deleted hospital
      try {
        await AsyncStorage.removeItem(`hospital:${id}:picture`);
      } catch (e) {
        console.log('Error removing hospital picture from storage', e);
      }

      if (selectedHospital?.id === id) {
        setSelectedHospital(null);
      }
      
      Alert.alert('Success', 'Hospital deleted successfully!');
    } catch (error) {
      console.log('Delete failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete hospital');
    }
  };

  // Department Functions
  // const handleAddDepartment = async () => {
  //   if (!newDepartment.name.trim() || !newDepartment.description.trim()) {
  //     Alert.alert('Error', 'Please fill required fields (Name and Description)');
  //     return;
  //   }

  //   if (!selectedHospital?.id) {
  //     Alert.alert('Error', 'No hospital selected');
  //     return;
  //   }

  //   try {
  //     const departmentData = {
  //       name: newDepartment.name,
  //       description: newDepartment.description,
  //       hospitalId: selectedHospital.id
  //     };
  //     const token = await AsyncStorage.getItem("AccessToken"); // Get Token
  //     const response = await axios.post(`${DEPARTMENT_API}/add`, departmentData, , {
  //     headers: {
  //       'Authorization': `Bearer ${token}`, // Add Header
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   });
      
  //     Alert.alert('Success', 'Department added successfully!');
  //     setNewDepartment({ name: '', description: '' });
  //     setAddDepartmentModalVisible(false);
  //     // Refresh departments list
  //     fetchDepartments(selectedHospital.id);
  //   } catch (error) {
  //     console.error('Add department failed:', error?.response?.data || error.message);
  //     Alert.alert('Error', error?.response?.data?.message || 'Failed to add department');
  //   }
  // };

  const handleAddDepartment = async () => {
  // 1. Basic Validation
  if (!newDepartment.name.trim() || !newDepartment.description.trim()) {
    Alert.alert('Error', 'Please fill required fields (Name and Description)');
    return;
  }

  if (!selectedHospital?.id) {
    Alert.alert('Error', 'No hospital selected');
    return;
  }

  try {
    // 2. Retrieve the Token
    const token = await AsyncStorage.getItem("AccessToken");

    const departmentData = {
      name: newDepartment.name,
      description: newDepartment.description,
      hospitalId: selectedHospital.id
    };

    // 3. Make the Authorized API Call
    // Axios post structure: axios.post(url, data, config)
    const response = await axios.post(`${DEPARTMENT_API}/add`, departmentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Changed from multipart to application/json
      }
    });

    // 4. Success Handling
    Alert.alert('Success', 'Department added successfully!');
    setNewDepartment({ name: '', description: '' });
    setAddDepartmentModalVisible(false);
    
    // Refresh the list
    fetchDepartments(selectedHospital.id);

  } catch (error) {
    console.error('Add department failed:', error?.response?.data || error.message);
    
    // 5. Handle Session Expiry
    if (error.response?.status === 401 || error.response?.status === 403) {
      Alert.alert("Session Expired", "Please login again.");
      handleLogout(); // Assuming you have your handleLogout function defined
    } else {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to add department');
    }
  }
};

 const handleUpdateDepartment = async () => {
  // Ensure we check for both potential ID field names
  const departmentId = editDepartment?.id || editDepartment?.departmentId;

  if (!departmentId) {
    Alert.alert("Error", "Invalid Department ID");
    return;
  }

  try {
    // 1. Retrieve the token from storage
    const token = await AsyncStorage.getItem('AccessToken');

    const departmentData = {
      // Use optional chaining to prevent "null reading toString" errors
      name: editDepartment?.name || '',
      description: editDepartment?.description || '',
    };

    // 2. Add the Authorization header to the axios.put call
    const response = await axios.put(
      `${DEPARTMENT_API}/update/${departmentId}`, 
      departmentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    Alert.alert('Success', 'Department updated successfully!');
    setEditDepartmentModalVisible(false);
    
    // Refresh departments list
    if (selectedHospital?.id) {
      fetchDepartments(selectedHospital.id);
    }
    
  } catch (error) {
    console.error('Update department failed:', error?.response?.data || error.message);
    
    // Specific check for token issues
    if (error.response?.status === 403 || error.response?.status === 401) {
      Alert.alert('Unauthorized', 'Your session has expired. Please login again.');
    } else {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update department');
    }
  }
};

  const handleDeleteDepartment = async (department) => {
    const id = department?.id;
    if (!id) return;

    try {
      const token = await AsyncStorage.getItem('AccessToken');
      await axios.delete(`${DEPARTMENT_API}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Remove department from local state
      setDepartments(prev => prev.filter(d => d.id !== id));

      // If the currently edited department is deleted, close edit modal
      if (editDepartment?.id === id) {
        setEditDepartmentModalVisible(false);
      }

      Alert.alert('Success', 'Department deleted successfully!');
    } catch (error) {
      console.log('Delete failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete department');
    }
  };

  // Doctor Functions
 const handleAddDoctor = async () => {
  if (!newDoctor.name.trim() || !newDoctor.phone.trim() || !newDoctor.specialization.trim() || !newDoctor.departmentId) {
    Alert.alert('Error', 'Please fill required fields (Name, Phone, Specialization, and select Department)');
    return;
  }

  try {
    setUploadingDoctorImage(true);

    // 1. Retrieve the JWT token from storage
    const token = await AsyncStorage.getItem("AccessToken");

    const doctorData = {
      name: newDoctor.name,
      phone: newDoctor.phone,
      mail: newDoctor.mail || '',
      specialization: newDoctor.specialization,
      experience: parseInt(newDoctor.experience) || 0,
      fee: parseFloat(newDoctor.fee) || 0,
      education: newDoctor.education || '',
      departmentId: newDoctor.departmentId,
      cabinNumber: newDoctor.cabinNumber || null,
    };

    const formData = new FormData();
    formData.append(
      'doctor',
      new Blob([JSON.stringify(doctorData)], {
        type: 'application/json',
      })
    );

    // ✅ IMAGE PART (OPTIONAL)
    if (newDoctor.localImage) {
      const uri = newDoctor.localImage;
      const filename = uri.split('/').pop() || `doctor_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('picture', {
        uri,
        name: filename,
        type,
      });
    }

    // 2. Add the Authorization header to the axios request
    const res = await axios.post(`${DOCTOR_API}/add`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the JWT here
        'Content-Type': 'multipart/form-data',
      }
    });

    const savedDoctor = res.data || {};
    console.log('Doctor add response:', savedDoctor);

    // Get picture URL from response
    const pictureUrl = savedDoctor.picture || 
                      savedDoctor.image || 
                      (savedDoctor.doctor && savedDoctor.doctor.picture) ||
                      newDoctor.localImage ||
                      null;

    const doctorWithPicture = {
      ...savedDoctor,
      picture: pictureUrl,
    };

    // Persist doctor picture locally
    if (doctorWithPicture.id && doctorWithPicture.picture) {
      try {
        await AsyncStorage.setItem(`doctor:${doctorWithPicture.id}:picture`, doctorWithPicture.picture);
      } catch (e) {
        console.log('Error saving doctor picture to storage', e);
      }
    }

    // Clean up unsaved image
    try {
      await AsyncStorage.removeItem('unsaved:newDoctor:picture');
    } catch (e) {
      console.log('Failed removing unsaved doctor image', e);
    }

    Alert.alert('Success', 'Doctor added successfully!');

    // Reset form
    setNewDoctor({
      name: '',
      phone: '',
      mail: '',
      specialization: '',
      experience: '',
      fee: '',
      education: '',
      departmentId: '',
      cabinNumber: '',
      picture: null,
      localImage: null,
    });

    setAddDoctorModalVisible(false);

    // Refresh doctors list (Refresh logic also needs JWT in those functions)
    if (viewDoctorsDepartmentId) {
      fetchDoctorsByDepartment(viewDoctorsDepartmentId);
    } else if (selectedHospital?.id) {
      fetchAllDoctorsForHospital();
    }

  } catch (error) {
    console.error('Add doctor failed:', error?.response?.data || error.message);
    
    // 3. Handle Session Expiry (Unauthorized)
    if (error.response?.status === 401 || error.response?.status === 403) {
      Alert.alert("Session Expired", "Please login again.");
      handleLogout(); // Assuming your logout function is defined
    } else {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to add doctor'
      );
    }
  } finally {
    setUploadingDoctorImage(false);
  }
};

  const handleUpdateDoctor = async () => {
  if (!editDoctor.id) return;

  try {
    setUploadingDoctorImage(true);

    // 1. Retrieve the token from storage
    const token = await AsyncStorage.getItem('AccessToken');

    const doctorData = {
      // Use optional chaining to prevent the "toString/null" error
      name: editDoctor?.name || '',
      phone: editDoctor?.phone || '',
      mail: editDoctor?.mail || '',
      specialization: editDoctor?.specialization || '',
      experience: editDoctor?.experience ? parseInt(editDoctor.experience) : 0,
      fee: editDoctor?.fee ? parseFloat(editDoctor.fee) : 0,
      education: editDoctor?.education || '',
      departmentId: editDoctor?.departmentId,
      cabinNumber: editDoctor?.cabinNumber || null,
    };

    const formData = new FormData();
    formData.append(
      'doctor',
      new Blob([JSON.stringify(doctorData)], {
        type: 'application/json',
      })
    );

    // ✅ IMAGE PART
    if (editDoctor.localImage) {
      const uri = editDoctor.localImage;
      const filename = uri.split('/').pop() || `doctor_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('picture', {
        uri,
        name: filename,
        type,
      } as any); // Use 'as any' for TypeScript compatibility
    }

    // 2. Pass the token in the headers object
    const res = await axios.put(
      `${DOCTOR_API}/update/${editDoctor.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let Axios handle the Content-Type automatically for FormData
        },
      }
    );

    const updatedData = res.data || {};
    
    // Get picture URL from response
    const pictureUrl = updatedData.picture || 
                      updatedData.image || 
                      (updatedData.doctor && updatedData.doctor.picture) ||
                      editDoctor.localImage ||
                      null;

    const updatedDoctor = {
      ...updatedData,
      picture: pictureUrl,
    };

    // Update doctors list UI
    setDoctors(prev =>
      prev.map(d => (d.id === editDoctor.id ? updatedDoctor : d))
    );

    // Persist updated doctor picture locally
    if (updatedDoctor.id && updatedDoctor.picture) {
      try {
        await AsyncStorage.setItem(`doctor:${updatedDoctor.id}:picture`, updatedDoctor.picture);
      } catch (e) {
        console.log('Error saving updated doctor picture to storage', e);
      }
    }

    Alert.alert('Success', 'Doctor updated successfully!');
    setEditDoctorModalVisible(false);

  } catch (error) {
    console.error('Update doctor failed:', error?.response?.data || error.message);
    
    // Handle specific Unauthorized error
    if (error.response?.status === 403 || error.response?.status === 401) {
      Alert.alert('Unauthorized', 'Your session has expired. Please login again.');
    } else {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to update doctor'
      );
    }
  } finally {
    setUploadingDoctorImage(false);
  }
};

  const handleDeleteDoctor = async (doctor) => {
    const id = doctor?.id;
    if (!id) return;

    try {
      const token = await AsyncStorage.getItem('AccessToken');
      await axios.delete(`${DOCTOR_API}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

      // Remove doctor from local state
      setDoctors(prev => prev.filter(d => d.id !== id));

      Alert.alert('Success', 'Doctor deleted successfully!');
    } catch (error) {
      console.log('Delete doctor failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete doctor');
    }
  };

  const openEditModal = (hospital) => {
    setEditHospital({
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      numberOfDoctors: hospital.numberOfDoctors.toString(),
      numberOfBeds: hospital.numberOfBeds.toString(),
      ageOfHospital: hospital.ageOfHospital.toString(),
      rating: hospital.rating.toString(),
      about: hospital.about || '',
      contactNumber: hospital.contactNumber || '',
      picture: hospital.picture,
      localImage: null,
    });
    setEditHospitalModalVisible(true);
  };

  const openEditDepartmentModal = (department) => {
    setEditDepartment({
      id: department.id,
      name: department.name,
      description: department.description,
      hospitalId: department.hospitalId,
    });
    setEditDepartmentModalVisible(true);
  };

  const openAddDoctorModal = (departmentId = null) => {
    setNewDoctor({
      name: '',
      phone: '',
      mail: '',
      specialization: '',
      experience: '',
      fee: '',
      education: '',
      departmentId: departmentId || '',
      cabinNumber: '',
      picture: null,
      localImage: null,
    });
    setAddDoctorModalVisible(true);
  };

  const openEditDoctorModal = (doctor) => {
    setEditDoctor({
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      mail: doctor.mail || '',
      specialization: doctor.specialization,
      experience: doctor.experience.toString(),
      fee: doctor.fee.toString(),
      education: doctor.education || '',
      departmentId: doctor.departmentId,
      cabinNumber: doctor.cabinNumber || '',
      picture: doctor.picture,
      localImage: null,
    });
    setEditDoctorModalVisible(true);
  };

  const openViewDoctorsModal = (departmentId = null, departmentName = null) => {
    setViewDoctorsDepartmentId(departmentId);
    setSelectedDepartmentForDoctors(departments.find(d => d.id === departmentId) || null);
    
    if (departmentId) {
      fetchDoctorsByDepartment(departmentId);
    } else {
      fetchAllDoctorsForHospital();
    }
    
    setViewDoctorsModalVisible(true);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-xl font-bold text-blue-700 mt-4">Loading hospitals...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#e0ecff', '#f7e8ff']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" />
        {activeTab === 'hospitals' ? (
          <>
            <View className="px-6 pt-4 pb-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-2xl font-bold text-gray-900">
                    🏥 Hospital Search
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Find best hospitals near you
                  </Text>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={onRefresh}
                    className="bg-blue-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white text-sm">Refresh</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-red-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white text-sm">Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search */}
              <View className="mt-4 bg-white rounded-2xl px-4 py-3 flex-row items-center shadow">
                <Text className="mr-3">🔍</Text>
                <TextInput
                  placeholder="Search hospital by name, city or address..."
                  value={search}
                  onChangeText={setSearch}
                  className="flex-1"
                />
              </View>
            </View>

            {/* Hospital Cards */}
            <FlatList
              data={filteredHospitals}
              keyExtractor={item => item.id?.toString() || item._id?.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={true}
              columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#4F46E5']}
                />
              }
              contentContainerStyle={{ paddingTop: 0, paddingBottom: 20 }}
              renderItem={({ item }) => (
                <HospitalCard
                  item={item}
                  onPress={() => setSelectedHospital(item)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteHospital}
                />
              )}
              ListFooterComponent={
                <AddHospitalCard onPress={() => setAddHospitalModalVisible(true)} />
              }
              ListEmptyComponent={
                <View className="w-full items-center py-10">
                  <Text className="text-gray-500 text-lg">No hospitals found</Text>
                </View>
              }
            />

            {/* ALL MODALS FOR HOSPITAL MANAGEMENT */}
            {/* ================= ADD HOSPITAL MODAL ================= */}
            <Modal 
              visible={addHospitalModalVisible} 
              animationType="slide" 
              transparent
              onRequestClose={() => {
                setHospitalStep(1);
                setAddHospitalModalVisible(false);
                setNewHospital({
                  name: '',
                  address: '',
                  city: '',
                  numberOfDoctors: '',
                  numberOfBeds: '',
                  ageOfHospital: '',
                  rating: '',
                  about: '',
                  contactNumber: '',
                  picture: null,
                  localImage: null,
                });
              }}
            >
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-2xl overflow-hidden max-h-[90%]">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-4 py-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-xl font-bold">
                          Add New Hospital
                        </Text>
                        <Text className="text-indigo-100 text-sm">
                          Step {hospitalStep} of 2
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setHospitalStep(1);
                          setAddHospitalModalVisible(false);
                          setNewHospital({
                            name: '',
                            address: '',
                            city: '',
                            numberOfDoctors: '',
                            numberOfBeds: '',
                            ageOfHospital: '',
                            rating: '',
                            about: '',
                            contactNumber: '',
                            picture: null,
                            localImage: null,
                          });
                        }}
                        disabled={isAddingHospital || uploadingImage}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-4 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {hospitalStep === 1 ? (
                      <>
                        {/* Step 1: Basic Information with Image Upload */}
                        <View className="mb-6 items-center">
                          <TouchableOpacity
                            onPress={() => pickImage(false)}
                            disabled={isAddingHospital || uploadingImage}
                            className={`w-32 h-32 rounded-2xl ${
                              newHospital.localImage 
                                ? 'border-2 border-blue-500' 
                                : 'border-2 border-dashed border-gray-300'
                            } items-center justify-center overflow-hidden`}
                          >
                            {newHospital.localImage ? (
                              <Image
                                source={{ uri: newHospital.localImage }}
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="items-center">
                                <Ionicons name="camera" size={40} color="#9CA3AF" />
                                <Text className="text-gray-500 mt-2 text-center text-xs">
                                  Upload Hospital Image
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                          {uploadingImage && (
                            <View className="mt-2 flex-row items-center">
                              <ActivityIndicator size="small" color="#4F46E5" />
                              <Text className="text-gray-600 ml-2 text-sm">Uploading image...</Text>
                            </View>
                          )}
                          <Text className="text-gray-500 text-xs mt-2">
                            Tap to upload hospital image (optional)
                          </Text>
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">Hospital Name *</Text>
                          <TextInput
                            placeholder="Enter hospital name"
                            value={newHospital.name}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, name: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">Address *</Text>
                          <TextInput
                            placeholder="Enter address"
                            value={newHospital.address}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, address: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">City *</Text>
                          <TextInput
                            placeholder="Enter city"
                            value={newHospital.city}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, city: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">About Hospital</Text>
                          <TextInput
                            placeholder="Describe the hospital"
                            value={newHospital.about}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, about: text }))
                            }
                            multiline
                            numberOfLines={3}
                            className="border border-gray-300 rounded-xl p-3 h-24"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        {/* Step 2: Detailed Information */}
                        <View className="grid grid-cols-2 gap-4 mb-4">
                          <View>
                            <Text className="font-bold mb-2">Number of Doctors</Text>
                            <TextInput
                              placeholder="Enter number"
                              keyboardType="numeric"
                              value={newHospital.numberOfDoctors}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, numberOfDoctors: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold mb-2">Number of Beds</Text>
                            <TextInput
                              placeholder="Enter number"
                              keyboardType="numeric"
                              value={newHospital.numberOfBeds}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, numberOfBeds: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold mb-2">Age of Hospital (years)</Text>
                            <TextInput
                              placeholder="Enter age"
                              keyboardType="numeric"
                              value={newHospital.ageOfHospital}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, ageOfHospital: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold mb-2">Rating</Text>
                            <TextInput
                              placeholder="Enter rating (0-5)"
                              keyboardType="decimal-pad"
                              value={newHospital.rating}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, rating: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">Contact Number</Text>
                          <TextInput
                            placeholder="Enter contact number"
                            keyboardType="phone-pad"
                            value={newHospital.contactNumber}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, contactNumber: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>                        
                      </>
                    )}
                  </ScrollView>
                  <View className="flex-row border-t p-4">
                    {hospitalStep === 2 && (
                      <TouchableOpacity
                        onPress={() => setHospitalStep(1)}
                        className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                        disabled={isAddingHospital || uploadingImage}
                      >
                        <Text className="font-bold">Back</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={async () => {
                        if (hospitalStep === 1) {
                          // Validate step 1
                          if (!newHospital.name.trim() || !newHospital.address.trim() || !newHospital.city.trim()) {
                            Alert.alert('Error', 'Please fill all required fields');
                            return;
                          }
                          setHospitalStep(2);
                        } else {
                          // Step 2 - Directly call handleAddHospital which will close modal
                          await handleAddHospital();
                        }
                      }}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center justify-center"
                      disabled={isAddingHospital || uploadingImage}
                      style={{ opacity: (isAddingHospital || uploadingImage) ? 0.7 : 1 }}
                    >
                      {isAddingHospital || uploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold">
                          {hospitalStep === 1 ? 'Next' : 'Add Hospital'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= EDIT HOSPITAL MODAL ================= */}
            <Modal visible={editHospitalModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-2xl overflow-hidden max-h-[90%]">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-4 py-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Edit Hospital
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEditHospitalModalVisible(false)}
                        disabled={uploadingImage}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-4 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {/* Image Upload Section */}
                    <View className="mb-6 items-center">
                      <TouchableOpacity
                        onPress={() => pickImage(true)}
                        disabled={uploadingImage}
                        className={`w-32 h-32 rounded-2xl ${
                          editHospital.localImage || editHospital.picture
                            ? 'border-2 border-blue-500' 
                            : 'border-2 border-dashed border-gray-300'
                        } items-center justify-center overflow-hidden`}
                      >
                        {editHospital.localImage ? (
                          <Image
                            source={{ uri: editHospital.localImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : editHospital.picture ? (
                          <Image
                            source={{ uri: editHospital.picture }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center">
                            <Ionicons name="camera" size={40} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2 text-center text-xs">
                              Upload Hospital Image
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {uploadingImage && (
                        <View className="mt-2 flex-row items-center">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="text-gray-600 ml-2 text-sm">Uploading image...</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-xs mt-2">
                        Tap to change hospital image (optional)
                      </Text>
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Hospital Name</Text>
                      <TextInput
                        value={editHospital.name}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Address</Text>
                      <TextInput
                        value={editHospital.address}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, address: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">City</Text>
                      <TextInput
                        value={editHospital.city}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, city: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="grid grid-cols-2 gap-4 mb-4">
                      <View>
                        <Text className="font-bold mb-2">Number of Doctors</Text>
                        <TextInput
                          value={editHospital.numberOfDoctors}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, numberOfDoctors: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold mb-2">Number of Beds</Text>
                        <TextInput
                          value={editHospital.numberOfBeds}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, numberOfBeds: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold mb-2">Age of Hospital</Text>
                        <TextInput
                          value={editHospital.ageOfHospital}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, ageOfHospital: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold mb-2">Rating</Text>
                        <TextInput
                          value={editHospital.rating}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, rating: text }))
                          }
                          keyboardType="decimal-pad"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">About Hospital</Text>
                      <TextInput
                        value={editHospital.about}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, about: text }))
                        }
                        multiline
                        numberOfLines={3}
                        className="border border-gray-300 rounded-xl p-3 h-24"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Contact Number</Text>
                      <TextInput
                        value={editHospital.contactNumber}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, contactNumber: text }))
                        }
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t p-4">
                    <TouchableOpacity
                      onPress={() => setEditHospitalModalVisible(false)}
                      className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                      disabled={uploadingImage}
                    >
                      <Text className="font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleEditHospital}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center"
                      disabled={uploadingImage}
                      style={{ opacity: uploadingImage ? 0.7 : 1 }}
                    >
                      {uploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold">Update Hospital</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= HOSPITAL DETAILS MODAL ================= */}
            <Modal visible={!!selectedHospital} animationType="slide">
              <SafeAreaView className="flex-1 bg-white">
                <ScrollView>
                  <LinearGradient
                    colors={['#38bdf8', '#0ea5e9']}
                    className="px-6 pt-3 pb-3"
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedHospital(null);
                        setSearchDepartment('');
                      }}
                      className="self-end"
                    >
                      <Text className="text-white text-2xl">✕</Text>
                    </TouchableOpacity>

                    {selectedHospital && (
                      <View className="items-center mt-4">
                        {selectedHospital.picture ? (
                          <View className="w-24 h-24 bg-white/20 rounded-3xl overflow-hidden border-2 border-white">
                            <Image
                              source={{ uri: selectedHospital.picture }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </View>
                        ) : (
                          <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center">
                            <Text className="text-5xl">🏥</Text>
                          </View>
                        )}
                        <Text className="text-2xl font-bold text-white mt-4 text-center">
                          {selectedHospital.name}
                        </Text>
                        <Text className="text-indigo-100 mt-1 text-center">
                          {selectedHospital.city} • {selectedHospital.rating} ⭐
                        </Text>
                      </View>
                    )}
                  </LinearGradient>

                  {selectedHospital && (
                    <View className="p-6">
                      {/* About Section */}
                      <Text className="text-gray-700 leading-7 mb-6">
                        {selectedHospital.about || 'No description available.'}
                      </Text>

                      {/* Hospital Information Card */}
                      <View className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                          <Text className="font-bold text-xl text-gray-900">
                            📋 Hospital Information
                          </Text>
                          <TouchableOpacity
                            onPress={() => setSignupModalVisible(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg shadow-sm"
                            style={{
                              elevation: 4,
                              shadowColor: '#10B981',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.3,
                              shadowRadius: 4,
                            }}
                          >
                            <Text className="text-white font-medium">+ Add Staff</Text>
                          </TouchableOpacity>
                        </View>
                        
                      <View className="flex-row flex-wrap -mx-2">
                    {/* Address */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="location" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Address</Text>
                        <Text className="text-sm font-medium text-center text-gray-900" numberOfLines={2}>
                          {selectedHospital.address}
                        </Text>
                      </View>
                    </View>

                    {/* City */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="business" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">City</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.city}
                        </Text>
                      </View>
                    </View>

                    {/* Doctors */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="people" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Doctors</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.numberOfDoctors}
                        </Text>
                      </View>
                    </View>

                    {/* Beds */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="bed" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Beds</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.numberOfBeds}
                        </Text>
                      </View>
                    </View>

                    {/* Age */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="calendar" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Age</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.ageOfHospital} yrs
                        </Text>
                      </View>
                    </View>

                    {/* Rating */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="star" size={22} color="#F59E0B" />
                        <Text className="text-xs text-gray-500 mt-1">Rating</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.rating} ⭐
                        </Text>
                      </View>
                    </View>

                    {/* Contact */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="call" size={22} color="#10B981" />
                        <Text className="text-xs text-gray-500 mt-1">Contact</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.contactNumber || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

              {/* Available Doctors Section */}
                  <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="font-bold text-lg">👩‍⚕️ Available Doctors({doctors.length})</Text>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity
                          onPress={() => openViewDoctorsModal()}
                          className="bg-indigo-500 px-3 py-1 rounded-lg"
                        >
                          <Text className="text-white font-medium">View All Doctors</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => openAddDoctorModal()}
                          className="bg-green-500 px-3 py-1 rounded-lg"
                        >
                          <Text className="text-white font-medium">+ Add Doctor</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
                      <View className="flex-row px-2">
                        {/* Show actual doctors from API */}
                        {(() => {
                          // Get first 4 doctors from the doctors list
                          const firstFourDoctors = doctors.slice(0, 4);
                          
                          if (firstFourDoctors.length > 0) {
                            return firstFourDoctors.map(doc => (
                              <DoctorCard
                                key={doc.id}
                                item={doc}
                                onPress={(item, action) => {
                                  if (action === 'profile') {
                                    Alert.alert('Profile', 
                                      `Name: ${item.name}\nSpecialization: ${item.specialization}\nExperience: ${item.experience} yrs\nFee: ₹${item.fee}\nEducation: ${item.education}\nPhone: ${item.phone}\nEmail: ${item.mail}`
                                    );
                                  } else if (action === 'appointment') {
                                    Alert.alert('Booking', `Booking not implemented for ${item.name}`);
                                  }
                                }}
                                onEdit={openEditDoctorModal}
                                onDelete={handleDeleteDoctor}
                              />
                            ));
                          } else {
                            // Show placeholder if no doctors
                            return (
                              <View className="w-40 px-2">
                                <View className="bg-gray-100 rounded-xl p-4 items-center justify-center h-32">
                                  <Text className="text-gray-500 text-center">No doctors added yet</Text>
                                  <TouchableOpacity
                                    onPress={() => openAddDoctorModal()}
                                    className="mt-2 bg-green-500 px-3 py-1 rounded-lg"
                                  >
                                    <Text className="text-white">Add Doctor</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          }
                        })()}
                      </View>
                    </ScrollView>
                  </View>
                      {/* Departments Section */}
                      <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                          <Text className="font-bold text-lg">
                            🏥 Departments ({departments.length})
                          </Text>
                          <View className="flex-row items-center">
                            <TouchableOpacity
                              onPress={() => {
                                setViewDepartmentsModalVisible(true);
                                fetchDepartments(selectedHospital.id);
                                setSearchDepartment('');
                              }}
                              className="bg-indigo-500 px-3 py-1 rounded-lg"
                            >
                              <Text className="text-white font-medium">View All</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                setNewDepartment({ name: '', description: '' });
                                setAddDepartmentModalVisible(true);
                              }}
                              className="bg-green-500 px-3 py-1 rounded-lg ml-2"
                            >
                              <Text className="text-white font-medium">+ Add Department</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                        {/* Department Search */}
                        <View className="mb-4">
                          <View className="bg-white rounded-xl px-4 py-3 flex-row items-center shadow-sm border border-gray-100">
                            <Text className="mr-3 text-gray-500">🔍</Text>
                            <TextInput
                              placeholder="Search departments..."
                              value={searchDepartment}
                              onChangeText={setSearchDepartment}
                              className="flex-1"
                            />
                            {searchDepartment.length > 0 && (
                              <TouchableOpacity onPress={() => setSearchDepartment('')}>
                                <Text className="text-gray-500">✕</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        
                        {/* Filtered Departments */}
                        {filteredDepartments.length === 0 ? (
                          <View className="items-center py-6">
                            <Text className="text-gray-500">No departments found</Text>
                            {searchDepartment.length > 0 && (
                              <TouchableOpacity 
                                onPress={() => setSearchDepartment('')}
                                className="mt-2 bg-gray-100 px-3 py-1 rounded-lg"
                              >
                                <Text className="text-blue-600">Clear search</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : (
                          <View className="flex-row flex-wrap -mx-1.5">
                            {filteredDepartments.slice(0, 6).map((department, index) => (
                              <View key={department.id} className="w-1/2 px-1.5 mb-3">
                                <TouchableOpacity 
                                  activeOpacity={0.9}
                                  onPress={() => {
                                    // View doctors for this department
                                    openViewDoctorsModal(department.id, department.name);
                                  }}
                                >
                                  <LinearGradient
                                    colors={getDepartmentColors(index)}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="rounded-xl p-4 shadow-lg"
                                    style={{
                                      elevation: 8,
                                      shadowColor: getShadowColor(index),
                                      shadowOffset: { width: 0, height: 4 },
                                      shadowOpacity: 0.3,
                                      shadowRadius: 6,
                                    }}
                                  >
                                    <View className="flex-row items-center mb-3">
                                      <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-3">
                                        <Text className="text-white font-bold text-lg">
                                          {department.name.charAt(0)}
                                        </Text>
                                      </View>
                                      <Text className="font-bold text-white flex-1" numberOfLines={1}>
                                        {department.name}
                                      </Text>
                                    </View>
                                    <Text className="text-white/90 text-sm mb-3" numberOfLines={2}>
                                      {department.description}
                                    </Text>
                                    <View className="flex-row justify-between items-center">
                                      <View className="flex-row items-center">
                                        <Ionicons name="medical" size={14} color="white" />
                                        <Text className="text-white/80 text-xs ml-1">
                                          View Doctors
                                        </Text>
                                      </View>
                                      <TouchableOpacity
                                        onPress={(e) => {
                                          e.stopPropagation();
                                          openAddDoctorModal(department.id);
                                        }}
                                        className="bg-white/20 px-2 py-1 rounded-lg"
                                      >
                                        <Text className="text-white text-xs">+ Add Doctor</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </LinearGradient>
                                </TouchableOpacity>
                              </View>
                            ))}
                            
                            {filteredDepartments.length > 6 && (
                              <View className="w-full px-1.5">
                                <TouchableOpacity
                                  onPress={() => {
                                    setViewDepartmentsModalVisible(true);
                                    fetchDepartments(selectedHospital.id);
                                    setSearchDepartment('');
                                  }}
                                  className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 items-center shadow-sm border border-indigo-200"
                                  style={{
                                    elevation: 4,
                                    shadowColor: '#8B5CF6',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                  }}
                                >
                                  <Text className="text-indigo-700 font-medium">
                                    + {filteredDepartments.length - 6} more departments
                                  </Text>
                                  <Text className="text-indigo-500 text-xs mt-1">Tap to view all</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </ScrollView>
              </SafeAreaView>
            </Modal>

            {/* ================= VIEW DEPARTMENTS MODAL ================= */}
            <Modal visible={viewDepartmentsModalVisible} animationType="slide">
              <SafeAreaView className="flex-1 bg-white">
                <ScrollView>
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 pt-6 pb-6"
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-xl font-bold">
                          Departments
                        </Text>
                        <Text className="text-indigo-100 text-sm">
                          {selectedHospital?.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setViewDepartmentsModalVisible(false);
                          setSearchDepartment('');
                        }}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <View className="p-4">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-lg font-bold text-gray-900">
                        Hospital Departments ({departments.length})
                      </Text>
                      <TouchableOpacity
                        onPress={() => setAddDepartmentModalVisible(true)}
                        className="bg-green-500 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-white font-medium">+ Add Department</Text>
                      </TouchableOpacity>
                    </View>

                    {loadingDepartments ? (
                      <View className="py-10 items-center">
                        <ActivityIndicator size="large" color="#4F46E5" />
                        <Text className="text-gray-600 mt-2">Loading departments...</Text>
                      </View>
                    ) : departments.length === 0 ? (
                      <View className="py-10 items-center">
                        <Text className="text-gray-500 text-lg">No departments added yet</Text>
                        <TouchableOpacity
                          onPress={() => setAddDepartmentModalVisible(true)}
                          className="mt-4 bg-green-500 px-4 py-2 rounded-lg"
                        >
                          <Text className="text-white">Add First Department</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className="space-y-4">
                        {departments.map((department) => (
                          <View key={department.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <View className="flex-row justify-between items-start">
                              <View className="flex-1">
                                <Text className="font-bold text-lg text-gray-900 mb-1">
                                  {department.name}
                                </Text>
                                <Text className="text-gray-600">
                                  {department.description}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => openViewDoctorsModal(department.id, department.name)}
                                  className="mt-2"
                                >
                                  <Text className="text-blue-600 text-sm">View Doctors →</Text>
                                </TouchableOpacity>
                              </View>
                              <View className="flex-row space-x-2">
                                <TouchableOpacity
                                  onPress={() => openEditDepartmentModal(department)}
                                  className="bg-blue-100 p-2 rounded-lg"
                                >
                                  <Ionicons name="pencil" size={20} color="#3B82F6" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleDeleteDepartment(department)}
                                  className="bg-red-100 p-2 rounded-lg"
                                >
                                  <Ionicons name="trash" size={20} color="#EF4444" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => openAddDoctorModal(department.id)}
                                  className="bg-green-100 p-2 rounded-lg"
                                >
                                  <Ionicons name="person-add" size={20} color="#10B981" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            {/* ================= VIEW DOCTORS MODAL ================= */}
            <Modal visible={viewDoctorsModalVisible} animationType="slide">
              <SafeAreaView className="flex-1 bg-white">
                <ScrollView>
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 pt-6 pb-6"
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-xl font-bold">
                          {selectedDepartmentForDoctors 
                            ? `Doctors - ${selectedDepartmentForDoctors.name}`
                            : 'All Doctors'}
                        </Text>
                        <Text className="text-indigo-100 text-sm">
                          {selectedHospital?.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setViewDoctorsModalVisible(false);
                          setViewDoctorsDepartmentId(null);
                          setSelectedDepartmentForDoctors(null);
                        }}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <View className="p-4">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-lg font-bold text-gray-900">
                        {selectedDepartmentForDoctors 
                          ? `${selectedDepartmentForDoctors.name} Doctors (${doctors.length})`
                          : `All Doctors (${doctors.length})`}
                      </Text>
                      <TouchableOpacity
                        onPress={() => openAddDoctorModal(viewDoctorsDepartmentId)}
                        className="bg-green-500 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-white font-medium">+ Add Doctor</Text>
                      </TouchableOpacity>
                    </View>

                    {loadingDoctors ? (
                      <View className="py-10 items-center">
                        <ActivityIndicator size="large" color="#4F46E5" />
                        <Text className="text-gray-600 mt-2">Loading doctors...</Text>
                      </View>
                    ) : doctors.length === 0 ? (
                      <View className="py-10 items-center">
                        <Text className="text-gray-500 text-lg">No doctors added yet</Text>
                        <TouchableOpacity
                          onPress={() => openAddDoctorModal(viewDoctorsDepartmentId)}
                          className="mt-4 bg-green-500 px-4 py-2 rounded-lg"
                        >
                          <Text className="text-white">Add First Doctor</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap -mx-2">
                        {doctors.map((doctor) => (
                          <View key={doctor.id} className="w-1/2 px-2 mb-4">
                            <DoctorCard
                              item={doctor}
                              onPress={(item, action) => {
                                if (action === 'profile') {
                                  Alert.alert('Doctor Profile', 
                                    `Name: ${item.name}\nSpecialization: ${item.specialization}\nExperience: ${item.experience} yrs\nFee: ₹${item.fee}\nEducation: ${item.education}\nPhone: ${item.phone}\nEmail: ${item.mail}\nCabin: ${item.cabinNumber || 'N/A'}\nDepartment: ${item.departmentName}`
                                  );
                                } else if (action === 'appointment') {
                                  Alert.alert('Booking', `Booking not implemented for ${item.name}`);
                                }
                              }}
                              onEdit={openEditDoctorModal}
                              onDelete={handleDeleteDoctor}
                            />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            {/* ================= ADD DEPARTMENT MODAL ================= */}
            <Modal visible={addDepartmentModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-2xl overflow-hidden max-h-[90%]">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-4 py-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Add New Department
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddDepartmentModalVisible(false);
                          setNewDepartment({ name: '', description: '' });
                        }}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-4 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    <View className="mb-4">
                      <Text className="font-bold mb-2">Department Name *</Text>
                      <TextInput
                        placeholder="Enter department name (e.g., Cardiology)"
                        value={newDepartment.name}
                        onChangeText={text =>
                          setNewDepartment(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Description *</Text>
                      <TextInput
                        placeholder="Enter department description"
                        value={newDepartment.description}
                        onChangeText={text =>
                          setNewDepartment(prev => ({ ...prev, description: text }))
                        }
                        multiline
                        numberOfLines={4}
                        className="border border-gray-300 rounded-xl p-3 h-32"
                      />
                    </View>

                    <Text className="text-gray-500 text-sm mb-6">
                      Department will be added to: {selectedHospital?.name}
                    </Text>
                  </ScrollView>

                  <View className="flex-row border-t p-4">
                    <TouchableOpacity
                      onPress={() => {
                        setAddDepartmentModalVisible(false);
                        setNewDepartment({ name: '', description: '' });
                      }}
                      className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                    >
                      <Text className="font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleAddDepartment}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center"
                    >
                      <Text className="text-white font-bold">Add Department</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= EDIT DEPARTMENT MODAL ================= */}
            <Modal visible={editDepartmentModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-2xl overflow-hidden max-h-[90%]">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-4 py-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Edit Department
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEditDepartmentModalVisible(false)}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-4 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    <View className="mb-4">
                      <Text className="font-bold mb-2">Department Name *</Text>
                      <TextInput
                        placeholder="Enter department name"
                        value={editDepartment.name}
                        onChangeText={text =>
                          setEditDepartment(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Description *</Text>
                      <TextInput
                        placeholder="Enter department description"
                        value={editDepartment.description}
                        onChangeText={text =>
                          setEditDepartment(prev => ({ ...prev, description: text }))
                        }
                        multiline
                        numberOfLines={4}
                        className="border border-gray-300 rounded-xl p-3 h-32"
                      />
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t p-4">
                    <TouchableOpacity
                      onPress={() => setEditDepartmentModalVisible(false)}
                      className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                    >
                      <Text className="font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleUpdateDepartment}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center"
                    >
                      <Text className="text-white font-bold">Update Department</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= ADD DOCTOR MODAL ================= */}
            <Modal visible={addDoctorModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-2xl overflow-hidden max-h-[90%]">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-4 py-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Add New Doctor
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddDoctorModalVisible(false);
                          setNewDoctor({
                            name: '',
                            phone: '',
                            mail: '',
                            specialization: '',
                            experience: '',
                            fee: '',
                            education: '',
                            departmentId: '',
                            cabinNumber: '',
                            picture: null,
                            localImage: null,
                          });
                        }}
                        disabled={uploadingDoctorImage}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-4 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {/* Image Upload Section */}
                    <View className="mb-6 items-center">
                      <TouchableOpacity
                        onPress={() => pickImage(false, true)}
                        disabled={uploadingDoctorImage}
                        className={`w-32 h-32 rounded-2xl ${
                          newDoctor.localImage 
                            ? 'border-2 border-blue-500' 
                            : 'border-2 border-dashed border-gray-300'
                        } items-center justify-center overflow-hidden`}
                      >
                        {newDoctor.localImage ? (
                          <Image
                            source={{ uri: newDoctor.localImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center">
                            <Ionicons name="camera" size={40} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2 text-center text-xs">
                              Upload Doctor Image
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {uploadingDoctorImage && (
                        <View className="mt-2 flex-row items-center">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="text-gray-600 ml-2 text-sm">Uploading image...</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-xs mt-2">
                        Tap to upload doctor image (optional)
                      </Text>
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Name *</Text>
                      <TextInput
                        placeholder="Enter doctor name"
                        value={newDoctor.name}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Phone *</Text>
                      <TextInput
                        placeholder="Enter phone number"
                        value={newDoctor.phone}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, phone: text }))
                        }
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Email</Text>
                      <TextInput
                        placeholder="Enter email"
                        value={newDoctor.mail}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, mail: text }))
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Specialization *</Text>
                      <TextInput
                        placeholder="Enter specialization (e.g., Cardiology)"
                        value={newDoctor.specialization}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, specialization: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Experience (years)</Text>
                      <TextInput
                        placeholder="Enter experience in years"
                        value={newDoctor.experience}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, experience: text }))
                        }
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Consultation Fee (₹)</Text>
                      <TextInput
                        placeholder="Enter fee amount"
                        value={newDoctor.fee}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, fee: text }))
                        }
                        keyboardType="decimal-pad"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Education</Text>
                      <TextInput
                        placeholder="Enter education (e.g., MBBS, MD)"
                        value={newDoctor.education}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, education: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Cabin Number</Text>
                      <TextInput
                        placeholder="Enter cabin number (optional)"
                        value={newDoctor.cabinNumber}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, cabinNumber: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Department *</Text>
                      {departments.length === 0 ? (
                        <Text className="text-red-500">No departments available. Please add a department first.</Text>
                      ) : (
                        <ScrollView className="max-h-40">
                          {departments.map(dept => (
                            <TouchableOpacity
                              key={dept.id}
                              onPress={() => setNewDoctor(prev => ({ ...prev, departmentId: dept.id }))}
                              className={`border rounded-xl p-3 mb-2 ${
                                newDoctor.departmentId === dept.id 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-300'
                              }`}
                            >
                              <Text className="font-medium">{dept.name}</Text>
                              <Text className="text-gray-500 text-xs">{dept.description}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                      {newDoctor.departmentId && (
                        <Text className="text-green-600 text-sm mt-2">
                          Selected: {departments.find(d => d.id === newDoctor.departmentId)?.name}
                        </Text>
                      )}
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t p-4">
                    <TouchableOpacity
                      onPress={() => {
                        setAddDoctorModalVisible(false);
                        setNewDoctor({
                          name: '',
                          phone: '',
                          mail: '',
                          specialization: '',
                          experience: '',
                          fee: '',
                          education: '',
                          departmentId: '',
                          cabinNumber: '',
                          picture: null,
                          localImage: null,
                        });
                      }}
                      className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                      disabled={uploadingDoctorImage}
                    >
                      <Text className="font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleAddDoctor}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center"
                      disabled={uploadingDoctorImage || departments.length === 0}
                      style={{ opacity: (uploadingDoctorImage || departments.length === 0) ? 0.7 : 1 }}
                    >
                      {uploadingDoctorImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold">Add Doctor</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= EDIT DOCTOR MODAL ================= */}
            <Modal visible={editDoctorModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-2xl overflow-hidden max-h-[90%]">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-4 py-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Edit Doctor
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEditDoctorModalVisible(false)}
                        disabled={uploadingDoctorImage}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-4 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {/* Image Upload Section */}
                    <View className="mb-6 items-center">
                      <TouchableOpacity
                        onPress={() => pickImage(true, true)}
                        disabled={uploadingDoctorImage}
                        className={`w-32 h-32 rounded-2xl ${
                          editDoctor.localImage || editDoctor.picture
                            ? 'border-2 border-blue-500' 
                            : 'border-2 border-dashed border-gray-300'
                        } items-center justify-center overflow-hidden`}
                      >
                        {editDoctor.localImage ? (
                          <Image
                            source={{ uri: editDoctor.localImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : editDoctor.picture ? (
                          <Image
                            source={{ uri: editDoctor.picture }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center">
                            <Ionicons name="camera" size={40} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2 text-center text-xs">
                              Upload Doctor Image
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {uploadingDoctorImage && (
                        <View className="mt-2 flex-row items-center">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="text-gray-600 ml-2 text-sm">Uploading image...</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-xs mt-2">
                        Tap to change doctor image (optional)
                      </Text>
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Name *</Text>
                      <TextInput
                        value={editDoctor.name}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Phone *</Text>
                      <TextInput
                        value={editDoctor.phone}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, phone: text }))
                        }
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Email</Text>
                      <TextInput
                        value={editDoctor.mail}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, mail: text }))
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Specialization *</Text>
                      <TextInput
                        value={editDoctor.specialization}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, specialization: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Experience (years)</Text>
                      <TextInput
                        value={editDoctor.experience}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, experience: text }))
                        }
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Consultation Fee (₹)</Text>
                      <TextInput
                        value={editDoctor.fee}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, fee: text }))
                        }
                        keyboardType="decimal-pad"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Education</Text>
                      <TextInput
                        value={editDoctor.education}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, education: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Cabin Number</Text>
                      <TextInput
                        value={editDoctor.cabinNumber}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, cabinNumber: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Department</Text>
                      {departments.length === 0 ? (
                        <Text className="text-red-500">No departments available</Text>
                      ) : (
                        <ScrollView className="max-h-40">
                          {departments.map(dept => (
                            <TouchableOpacity
                              key={dept.id}
                              onPress={() => setEditDoctor(prev => ({ ...prev, departmentId: dept.id }))}
                              className={`border rounded-xl p-3 mb-2 ${
                                editDoctor.departmentId === dept.id 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-300'
                              }`}
                            >
                              <Text className="font-medium">{dept.name}</Text>
                              <Text className="text-gray-500 text-xs">{dept.description}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                      {editDoctor.departmentId && (
                        <Text className="text-green-600 text-sm mt-2">
                          Selected: {departments.find(d => d.id === editDoctor.departmentId)?.name}
                        </Text>
                      )}
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t p-4">
                    <TouchableOpacity
                      onPress={() => setEditDoctorModalVisible(false)}
                      className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                      disabled={uploadingDoctorImage}
                    >
                      <Text className="font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleUpdateDoctor}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center"
                      disabled={uploadingDoctorImage}
                      style={{ opacity: uploadingDoctorImage ? 0.7 : 1 }}
                    >
                      {uploadingDoctorImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold">Update Doctor</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= SIGNUP MODAL ================= */}
            <SignupComponent 
              visible={signupModalVisible} 
              onClose={() => setSignupModalVisible(false)}
            />
          </>
        ) : (
          <>
            {/* SIGNUP TAB CONTENT */}
            <SignupComponent 
              visible={activeTab === 'signup'} 
              onClose={() => setActiveTab('hospitals')}
            />
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}