import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { firebase } from "../firebase/config";

const AllDonors = () => {
  const [allDonors, setAllDonors] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    const fetchAllDonors = async () => {
      const donorsCollection = firebase.firestore().collection("users");
      const snapshot = await donorsCollection.where("donar", "!=", null).get();

      const donorsData = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        const donorDetails = userData.donar;

        donorDetails.forEach((detail) => {
          donorsData.push(detail);
        });
      });

      setAllDonors(donorsData);
    };

    fetchAllDonors();
  }, []);

  const filteredDonors = allDonors.filter((donor) => {
    return (
      (!selectedBloodType || donor.Btype === selectedBloodType) &&
      (!selectedDistrict || donor.distric === selectedDistrict)
    );
  });

  const sortedDonors = filteredDonors.sort((a, b) => {
    if (a.distric !== b.distric) {
      return a.distric.localeCompare(b.distric);
    } else {
      return a.Btype.localeCompare(b.Btype);
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.header}>All Donors Details</Text>
        <View style={styles.dropdownContainer}>
          <Text>Select District: </Text>
          <Picker
            selectedValue={selectedDistrict}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
          >
            <Picker.Item label="Select District" value="" />
            <Picker.Item label="Kegalle" value="Kegalle" />
            <Picker.Item label="Rathnapura" value="Rathnapura" />
            {/* Add other district options as needed */}
          </Picker>
        </View>
        <View style={styles.dropdownContainer}>
          <Text>Select Blood Type: </Text>
          <Picker
            selectedValue={selectedBloodType}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => setSelectedBloodType(itemValue)}
          >
            <Picker.Item label="Select Blood Type" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="B-" value="B-" />
            {/* Add more blood types as needed */}
          </Picker>
        </View>

        {/* Display filtered donors based on the selected blood type */}
        {sortedDonors.map((donor, index) => (
          <View key={index} style={styles.donorContainer}>
            <Text>Name: {donor.dname}</Text>
            <Text>Blood Type: {donor.Btype}</Text>
            <Text>Contact Number: {donor.number}</Text>
            <Text>District: {donor.distric}</Text>
            <Text>Area: {donor.area}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF1515",
  },
  donorContainer: {
    borderWidth: 1,
    borderColor: "#F76363",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default AllDonors;
