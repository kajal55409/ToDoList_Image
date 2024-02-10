import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../Firebase";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { DocumentPicker } from "react-native-document-picker";
const Home = () => {
  const navigation = useNavigation();
  const [todos, setTodos] = useState([]);

  const todoRef = firebase.firestore().collection("todos");

  const [addData, setAddData] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // fetch or read data from firestore
  useEffect(() => {
    todoRef.orderBy("createdAt", "desc").onSnapshot((querySnapshot) => {
      const todos = [];
      querySnapshot.forEach((doc) => {
        const { heading } = doc.data();
        todos.push({
          id: doc.id,
          heading,
        });
      });
      setTodos(todos);
    });
  }, []);

  const ChooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res.uri, res.type, res.name, res.size);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // user cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    const source = { uri: result.uri };
    console.log(source);
    setImage(source);

    // if (!result.cancelled) {
    //   this.setState({ image: result.uri });
    // }
  };

  const uploadImage = async (uri) => {
    // console.log("first", first);
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
    var ref = firebase.storage().ref().child(filename).put(blob);

    try {
      await ref;
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    Alert.alert("Photo uploaded..!!!");
    setImage(null);
  };
  // // Create a root reference

  // const pickImage = async () => {
  //   // let result = await ImagePicker.launchCameraAsync();
  //   let result = await ImagePicker.launchImageLibraryAsync();

  //   if (!result.cancelled) {
  //     this.uploadImage(result.uri, "test-image")
  //       .then(() => {
  //         Alert.alert("Success");
  //       })
  //       .catch((error) => {
  //         Alert.alert(error);
  //       });
  //   }
  // };

  // const uploadImage = async (uri, imageName) => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();

  //   var ref = firebase
  //     .storage()
  //     .ref()
  //     .child("images/" + imageName);
  //   return ref.put(blob);
  // };

  // delete a todo from firestore db

  const deleteTodo = (todos) => {
    todoRef
      .doc(todos.id)
      .delete()
      .then(() => {
        alert("Deleted Successfully");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Add a todo
  const addTodo = () => {
    // check if we have a todo

    if (addData && addData.length > 0) {
      // get the timestamp for arrrangeing todo on descending order
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: addData,
        createdAt: timestamp,
      };
      todoRef
        .add(data)
        .then(() => {
          setAddData("");
          // release keyboard
          Keyboard.dismiss();
        })
        .catch(() => {
          alert("error");
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 80, alignSelf: "center" }}>
        <Text style={{ color: "green", fontSize: 20, fontWeight: "900" }}>
          {" "}
          Welcome To Your TODO List
        </Text>
      </View>

      <TouchableOpacity
        style={{ marginTop: 10, alignSelf: "center", flexDirection: "row" }}
        onPress={pickImage}
      >
        <Text style={{ color: "red", fontSize: 20, fontWeight: "600" }}>
          {" "}
          Pick an Image
        </Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{
              width: 200,
              height: 200,
              alignSelf: "center",
              borderRadius: 100,
              marginVertical: 10,
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => uploadImage()}
          style={{ marginTop: 10, alignSelf: "center", flexDirection: "row" }}
        >
          <Text style={{ color: "red", fontSize: 20, fontWeight: "600" }}>
            {" "}
            Upload Your Image
          </Text>

          <Entypo
            name="upload"
            size={23}
            color="blue"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => ChooseFile()}
          style={{ marginTop: 10, alignSelf: "center", flexDirection: "row" }}
        >
          <Text style={{ color: "red", fontSize: 20, fontWeight: "600" }}>
            {" "}
            Choose your file
          </Text>

          <Entypo
            name="upload"
            size={23}
            color="blue"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add A New Todo"
          placeholderTextColor="#aaaaaa"
          onChangeText={(heading) => setAddData(heading)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}> Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        numColumns={1}
        renderItem={({ item }) => (
          <View>
            <Pressable
              style={styles.container}
              onPress={() => navigation.navigate("Detail", { item })}
            >
              <FontAwesome
                name="trash-o"
                color="red"
                onpress={() => deleteTodo(item)}
                style={styles.todoIcon}
              />

              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>
                  {item.heading[0].toUpperCase() + item.heading.slice(1)}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e5e5",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 45,
  },
  itemHeading: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 22,
  },

  formContainer: {
    flexDirection: "row",
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 60,
  },

  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#788eec",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
  },
});
