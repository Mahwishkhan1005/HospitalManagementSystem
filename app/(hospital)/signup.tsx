import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
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
const API_BASE_URL = 'http://192.168.0.133:8080/api';
const HOSPITAL_API = `${API_BASE_URL}/hospitals`;
const DEPARTMENT_API = `${API_BASE_URL}/departments`;
const SIGNUP_API = 'http://192.168.0.231:8080/admin/signup';

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
            <View className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-100">
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

/* -------------------- DOCTOR CARD (GRID VIEW - 3 PER ROW) -------------------- */

const DoctorCard = ({ item, onPress }) => (
  <View className="w-1/3 px-1.5 mb-3">
    <View className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
      <View className="w-full h-24 rounded-lg bg-gray-100 overflow-hidden mb-2">
        <Image
          source={{ uri: item.image || 'https://i.imgur.com/default-doctor.png' }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      
      <Text className="font-bold text-xs text-gray-900 mb-1" numberOfLines={1}>
        {item.name}
      </Text>
      <Text className="text-blue-600 text-xs mb-1" numberOfLines={1}>
        {item.speciality}
      </Text>
      <Text className="text-gray-500 text-xs mb-2">
        Exp: {item.experience}
      </Text>

      <View className="flex-row space-x-1">
        <TouchableOpacity 
          className="flex-1 border border-gray-300 px-1 py-1 rounded"
          onPress={() => onPress(item, 'profile')}
        >
          <Text className="text-gray-700 text-xs text-center">Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 bg-orange-500 px-1 py-1 rounded"
          onPress={() => onPress(item, 'appointment')}
        >
          <Text className="text-white text-xs text-center">Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

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
          className="rounded-3xl p-4 shadow-xl border-2 border-dashed border-blue-300 h-full"
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

      const res = await axios.post(SIGNUP_API, payload);

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
                    {['receiptionist', 'doctor'].map(item => (
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

  // Hospital doctors data (moved up to avoid conditional hook rendering)
  const [hospitalDoctors, setHospitalDoctors] = useState({});
  // Locally added doctors (should only appear in View Doctors modal)
  const [addedDoctors, setAddedDoctors] = useState({});

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

  // New doctor form state removed (add-doctor UI removed)

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

  const getRandomDoctorCount = () => {
    return Math.floor(Math.random() * 20) + 5;
  };

  // Load hospitals from API
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${HOSPITAL_API}/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched hospitals:', data);
        // For each hospital, if server doesn't return a picture, check AsyncStorage
        // for a locally persisted picture URL for that hospital.
        const normalizedHospitals = [];
        for (const h of data) {
          let picture = h.picture || null;
          if (!picture) {
            try {
              const key = `hospital:${h.id}:picture`;
              const saved = await AsyncStorage.getItem(key);
              if (saved) picture = saved;
            } catch (e) {
              console.log('Error reading picture from storage', e);
            }
          }
          normalizedHospitals.push({ ...h, picture });
        }

        setHospitals(normalizedHospitals);
      
      // Initialize empty doctors array for each hospital
      const doctorsData = {};
      const addedData = {};
      data.forEach((hospital) => {
        doctorsData[hospital.id] = [];
        addedData[hospital.id] = [];
      });
      setHospitalDoctors(doctorsData);
      setAddedDoctors(addedData);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      Alert.alert('Error', 'Failed to fetch hospitals. Please check your connection.');
      // Fallback to empty array
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
      const response = await fetch(`${DEPARTMENT_API}/hospital/${hospitalId}`);
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

  const filteredHospitals = useMemo(() => {
    const q = (search || '').toLowerCase();
    return hospitals.filter(h => {
      const name = (h?.name || '').toString().toLowerCase();
      const city = (h?.city || '').toString().toLowerCase();
      const address = (h?.address || '').toString().toLowerCase();
      return name.includes(q) || city.includes(q) || address.includes(q);
    });
  }, [search, hospitals]);

  // Image Picker Function
  const pickImage = async (isEdit = false) => {
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
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Add new hospital - UPDATED with image upload
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

    // ✅ VERY IMPORTANT FIX (SAME AS EDIT)
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

      // @ts-ignore
      formData.append('picture', {
        uri,
        name: filename,
        type,
      });
    }

    const res = await axios.post(`${HOSPITAL_API}/add`, formData);
    const savedHospital = {
      ...res.data,
      picture:
        res.data.picture ||
        newHospital.localImage || null,
    };



    setHospitals(prev => [savedHospital, ...prev]);
    // Persist picture locally so it survives refreshes if server omits it
    try {
      if (savedHospital.picture) {
        await AsyncStorage.setItem(`hospital:${savedHospital.id}:picture`, savedHospital.picture);
      }
    } catch (e) {
      console.log('Error saving hospital picture to storage', e);
    }
    setHospitalDoctors(prev => ({ ...prev, [savedHospital.id]: [] }));
    setAddedDoctors(prev => ({ ...prev, [savedHospital.id]: [] }));

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
    setSelectedHospital(savedHospital);

    Alert.alert(
      'Hospital Added ✅',
      JSON.stringify(savedHospital, null, 2)
    );

  } catch (error) {
    console.error('Add hospital failed:', error?.response?.data || error.message);
    Alert.alert(
      'Error',
      error?.response?.data?.message || 'Failed to add hospital'
    );
  } finally {
    setIsAddingHospital(false);
    setUploadingImage(false);
  }
};


  // Update hospital - UPDATED with image upload
const handleEditHospital = async () => {
  if (!editHospital.id) return;

  try {
    setUploadingImage(true);

    const hospitalInfoPayload = {
      name: editHospital.name,
      address: editHospital.address,
      city: editHospital.city,
      numberOfDoctors: parseInt(editHospital.numberOfDoctors) || 0,
      numberOfBeds: parseInt(editHospital.numberOfBeds) || 0,
      ageOfHospital: parseInt(editHospital.ageOfHospital) || 0,
      rating: parseFloat(editHospital.rating) || 0,
      about: editHospital.about || '',
      contactNumber: editHospital.contactNumber || '',
    };

    const formData = new FormData();

    // ✅ VERY IMPORTANT FIX
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

      // @ts-ignore
      formData.append('picture', {
        uri,
        name: filename,
        type,
      });
    }

    const res = await axios.put(
      `${HOSPITAL_API}/update/${editHospital.id}`,
      formData
      // ❌ DO NOT set Content-Type manually
    );

    const updatedHospital = {
      ...res.data,
      picture:
        res.data.picture ||
        editHospital.localImage ||
        editHospital.picture ||
        null,
    };


    setHospitals(prev =>
      prev.map(h =>
        h.id === editHospital.id ? updatedHospital : h
      )
    );

    // Persist updated picture locally
    try {
      if (updatedHospital.picture) {
        await AsyncStorage.setItem(`hospital:${updatedHospital.id}:picture`, updatedHospital.picture);
      }
    } catch (e) {
      console.log('Error saving updated hospital picture to storage', e);
    }

    setSelectedHospital(prev =>
        prev?.id === updatedHospital.id ? updatedHospital : prev
      );


    setEditHospitalModalVisible(false);

    Alert.alert(
      'Hospital Updated ✅',
      JSON.stringify(updatedHospital, null, 2)
    );

  } catch (error) {
    console.error('Update hospital failed:', error?.response?.data || error.message);
    Alert.alert(
      'Error',
      error?.response?.data?.message || 'Failed to update hospital'
    );
  } finally {
    setUploadingImage(false);
  }
};



  // DELETE HOSPITAL
  const handleDeleteHospital = async (hospital) => {
    const id = hospital?.id;
    if (!id) return;

    try {
      await axios.delete(`${HOSPITAL_API}/delete/${id}`);

      setHospitals(prev => prev.filter(h => h.id !== id));

      // Remove persisted picture for deleted hospital
      try {
        await AsyncStorage.removeItem(`hospital:${id}:picture`);
      } catch (e) {
        console.log('Error removing hospital picture from storage', e);
      }

      // Remove any local doctor lists for deleted hospital
      setHospitalDoctors(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setAddedDoctors(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

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
  const handleAddDepartment = async () => {
    if (!newDepartment.name.trim() || !newDepartment.description.trim()) {
      Alert.alert('Error', 'Please fill required fields (Name and Description)');
      return;
    }

    if (!selectedHospital?.id) {
      Alert.alert('Error', 'No hospital selected');
      return;
    }

    try {
      const departmentData = {
        name: newDepartment.name,
        description: newDepartment.description,
        hospitalId: selectedHospital.id
      };

      const response = await axios.post(`${DEPARTMENT_API}/add`, departmentData);
      
      if (response.data === 'Department added successfully') {
        Alert.alert('Success', 'Department added successfully!');
        setNewDepartment({ name: '', description: '' });
        setAddDepartmentModalVisible(false);
        // Refresh departments list
        fetchDepartments(selectedHospital.id);
      } else {
        Alert.alert('Success', 'Department added successfully!');
        setNewDepartment({ name: '', description: '' });
        setAddDepartmentModalVisible(false);
        fetchDepartments(selectedHospital.id);
      }
    } catch (error) {
      console.error('Add department failed:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to add department');
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editDepartment.id) return;

    try {
      const departmentData = {
        name: editDepartment.name,
        description: editDepartment.description,
      };

      const response = await axios.put(`${DEPARTMENT_API}/update/${editDepartment.id}`, departmentData);
      
      Alert.alert('Success', 'Department updated successfully!');
      setEditDepartmentModalVisible(false);
      // Refresh departments list
      fetchDepartments(selectedHospital.id);
    } catch (error) {
      console.error('Update department failed:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update department');
    }
  };

  const handleDeleteDepartment = async (department) => {
  const id = department?.id;
  if (!id) return;

  try {
    await axios.delete(`${DEPARTMENT_API}/delete/${id}`);

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

  // Add-doctor handler removed (add-doctor UI removed)

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
                <TouchableOpacity
                  onPress={onRefresh}
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white text-sm">Refresh</Text>
                </TouchableOpacity>
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
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 pt-6 pb-8"
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

                      {/* Departments Section */}
                      <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                          <Text className="font-bold text-lg">
                            🏥 Departments ({departments.length})
                          </Text>
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
                                <TouchableOpacity activeOpacity={0.9}>
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
                                          {getRandomDoctorCount()} Doctors
                                        </Text>
                                      </View>
                                      <TouchableOpacity
                                        onPress={() => {
                                          // Option to view department details
                                          Alert.alert(department.name, department.description);
                                        }}
                                        className="bg-white/20 px-2 py-1 rounded-lg"
                                      >
                                        <Text className="text-white text-xs">View</Text>
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