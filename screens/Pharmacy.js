import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function Pharmacy({ navigation }) {
  const pharmacies = [
    {
      name: "Farmacia Nueva Ecija",
      image: require("../assets/1.jpg"),
      map: require("../assets/map1.png"),
      description:
        "Farmacia Nueva Ecija is dedicated to providing high-quality, affordable medicines to the community. With friendly staff and wide product availability, it ensures proper customer care and reliable service to meet everyday health needs.",
    },
    {
      name: "Pharma-Care Drugmart",
      image: require("../assets/2.jpg"),
      map: require("../assets/map2.png"),
      description:
        "Pharma-Care Drugmart offers a complete selection of generic and branded medicines. Known for excellent customer service, it provides fast assistance, trustworthy pharmacists, and a comfortable pharmacy environment.",
    },
    {
      name: "Med 77 Drugmart",
      image: require("../assets/3.jpg"),
      map: require("../assets/map3.png"),
      description:
        "Med 77 Drugmart delivers convenient healthcare solutions with accessible medicine, vitamins, and medical supplies. The pharmacy is known for its helpful staff and consistent availability of essential products.",
    },
    {
      name: "TGP (The Generics Pharmacy)",
      image: require("../assets/4.jpg"),
      map: require("../assets/map4.png"),
      description:
        "TGP provides affordable generic medications trusted nationwide. With reliable pharmacists and complete stock, it serves as a go-to pharmacy for budget-friendly healthcare and everyday medical needs.",
    },
    {
      name: "Botika ng Bayan Drugmart Corporation (Zaragoza, Nueva Ecija)",
      image: require("../assets/5.jpg"),
      map: require("../assets/map5.png"),
      description:
        "Botika ng Bayan in Zaragoza focuses on offering government-supported medicine prices to ensure access to essential health services for all families in the area.",
    },
    {
      name: "Our Generics",
      image: require("../assets/6.jpg"),
      map: require("../assets/map6.png"),
      description:
        "Our Generics provides quality assured medicines with affordable options for customers. The pharmacy aims to promote accessible healthcare through reliable generic brands.",
    },
    {
      name: "DOX Pharmacy",
      image: require("../assets/7.jpg"),
      map: require("../assets/map7.png"),
      description:
        "DOX Pharmacy offers a clean and organized environment for buying medicines, health supplements, and medical items. Their staff ensures customers receive proper guidance.",
    },
    {
      name: "Botika ng Bayan Drugmart Corporation (Carmen, Zaragoza)",
      image: require("../assets/8.jpg"),
      map: require("../assets/map8.png"),
      description:
        "Located in Carmen, Zaragoza, this Botika ng Bayan branch continues to provide affordable medicine programs while maintaining excellent service and consistent supply.",
    },
    {
      name: "Healthgenic Drugstore",
      image: require("../assets/9.jpg"),
      map: require("../assets/map9.png"),
      description:
        "Healthgenic Drugstore features a wide collection of over-the-counter medications, vitamins, and healthcare essentials. It promotes wellness and community health through quality products.",
    },
    {
      name: "D and J Drug Store",
      image: require("../assets/10.jpg"),
      map: require("../assets/map10.png"),
      description:
        "D and J Drug Store is known for its friendly staff and reliable medicine availability. The pharmacy offers affordable health products and provides fast customer service.",
    },
  ];

  const [selected, setSelected] = useState(0);
  const data = pharmacies[selected];

  return (
    <LinearGradient
      colors={["#f9b3b3", "#e36b6b"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Pharmacy Information</Text>
        </View>

        {/* WHITE BOX */}
        <View style={styles.whiteBox}>
          
          {/* DROPDOWN */}
          <Text style={styles.label}>Select Pharmacy</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selected}
              onValueChange={(value) => setSelected(value)}
              style={styles.picker}
            >
              {pharmacies.map((item, index) => (
                <Picker.Item label={item.name} value={index} key={index} />
              ))}
            </Picker>
          </View>

          {/* PHARMACY TITLE */}
          <Text style={styles.pharmacyTitle}>{data.name}</Text>

          {/* PHARMACY IMAGE */}
          <Image source={data.image} style={styles.pharmacyImage} />

          {/* DESCRIPTION */}
          <Text style={styles.description}>{data.description}</Text>

          {/* LOCATION TITLE */}
          <Text style={styles.locationTitle}>Location</Text>

          {/* MAP IMAGE */}
          <Image source={data.map} style={styles.mapImage} />

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  header: {
    marginTop: 40,
    marginBottom: 15,
    alignItems: "center",
    position: "relative",
  },
  goBack: {
    position: "absolute",
    left: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  whiteBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },

  label: {
  fontSize: 15,
  fontWeight: "600",
  lineHeight: 20, 
  },

  dropdownContainer: {
     borderWidth: 1,
  borderColor: "#999",
  borderRadius: 10,
  marginBottom: 20,
  paddingHorizontal: 10,
  height: 45,            // make sure container is tall enough for text
  justifyContent: "center",
  },

 
  picker: {
  height: 50,               // slightly taller for Android
  color: "#000",            // text color
  justifyContent: "center", // vertically center text
},


  pharmacyTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },

  pharmacyImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: "cover",
  },

  description: {
    fontSize: 15,
    textAlign: "justify",
    marginBottom: 25,
  },

  locationTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  mapImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
});
