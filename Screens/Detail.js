import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../Firebase";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Detail = ({ route }) => {

  
  const navigation = useNavigation();


const [textHeading, onchangeHeadingText] = useState(route.params.item.name);
 const todoRef = firebase.firestore().collection("todos");
  const updateTodo = () => {
    if (textHeading && textHeading.length > 0) {
      todoRef
        .doc(route.params.item.id)
        .update({
          heading: textHeading,
        })
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{ color: "lightblue", fontSize: 20, fontWeight: "bold" }}
          onPress={() => navigation.goBack()}
        >
          {" "}
          GoBack
        </Text>
      </View>
      <TextInput
        style={styles.textField}
        onChangeText={onchangeHeadingText}
        value={textHeading}
        placeholder="Update Todo"
      />

      <Pressable
        style={styles.buttonUpdate}
        onPress={() => {
          updateTodo();
        }}
      >
        <Text> UPDATE TODO</Text>
      </Pressable>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  textField: {
    marginBottom: 5,
    padding: 10,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 30,
  },
  buttonUpdate: {
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: "#0de065",
  },
});
