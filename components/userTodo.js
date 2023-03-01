import React, { useState ,useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker'; 
import { View, FlatList, CheckBox, Text, StyleSheet,  TouchableOpacity ,Modal,TextInput,ScrollView ,Image} from 'react-native';
import app from './firebase';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs ,doc, getDoc, deleteDoc, updateDoc, setDoc} from "firebase/firestore";
import { getStorage, ref as strRef, uploadBytes, getDownloadURL } from "firebase/storage"; 

export default function UserTodo({navigation , route}) {
  const [uid, setUid] = useState(route.params ? route.params : "");
  const [items,setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [image, setImage] = useState(null);
  const [newTaskStatus,setNewTaskStatus] = useState(false);
  const [deleteState,setDeleteState] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  var tempPersonal ={Name:"",Contact:"",Email:"",Profile:""};
  var tempId = 0;
  var rand =[];
  // var uid = "tnWx56EqxYPxAxfAXqBbhNeOxVf2";
  const [editor,setEditor] = useState(0);
  
  const storage = getStorage();
  const metadata = {
    contentType: 'image/jpg',
  };
  const db = getFirestore(app);

  async function sendFirebaseData(){
    const storageRef = strRef(storage, uid+'.jpg');
    const response = await fetch(image);
    const blob = await response.blob();
    uploadBytes(storageRef, blob, metadata).then((snapshot) => {
      getDownloadURL(storageRef).then((url)=>{
        tempPersonal.ProfileImage = url;
        setPersonal(tempPersonal);
        updateDoc(doc(db, "users/"+uid), personal);
  })})    
}
  async function doThis(){
    const docRef = doc(db, "users", uid);
    const querySnapshot = await getDocs(collection(db, "users/"+uid+"/tasks"));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        setPersonal(docSnap.data());
        setImage(docSnap.data().ProfileImage);
      } else {
        alert("No data available!");
      }
    var status = [];
    querySnapshot.forEach((doc) => {
    rand.push(doc.data());
    if(doc.data().status) status.push(doc.data().id);
  });
  setCheckedItems(status);
  setItems(rand);
}
useEffect(() => {
  doThis();
},[]);
    tempPersonal= personal;
    tempId = items.length;
    const handleToggleCheckbox = async (itemId) => {
      const isChecked = checkedItems.includes(itemId);
      if (isChecked) {
        setCheckedItems(checkedItems.filter((id) => id !== itemId));
      } else {
        setCheckedItems([...checkedItems, itemId]);
      }
      const docRef2 = await updateDoc(doc(db, "users/"+uid+"/tasks/"+itemId), {
        status: !isChecked,
      });
    };
  
    const pickImage = async () => {
    
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }

    async function deleteTask(id){
      try {
        console.log("deleting!");
        await deleteDoc(doc(db, "users/"+uid+"/tasks/"+id));
      } catch (e) {
        console.error("Error deleting document");
      }
    }

    async function editTasks(){
    if (editor == 0){
    try {
      console.log("adding!");
      if(newTask==""){ return null}
      const docRef = await setDoc(doc(db, "users/"+uid+"/tasks/"+(tempId+1)), {
        task: newTask,
        status: newTaskStatus,
        id: tempId+1
      });
      setNewTask("");
    } catch (e) {
      console.error("Error adding document");
      tempId -= 1;
    }
  }
  else{
    try {
      console.log("editing!");
      if(newTask==""){ return null}
      const docRef = await updateDoc(doc(db, "users/"+uid+"/tasks/"+editor), {
        task: newTask,
        status: newTaskStatus,
        id: editor
      });
      setNewTask("");
    } catch (e) {
      console.error("Error editing document: ", e);
    }
    setEditor(0);
  }
    }
    const renderItem = ({ item }) => (
      <View style={{padding:5,height:'100%',width:'100%', flexDirection: 'row',justifyContent: "flex-end"}}>
        <TouchableOpacity style={{flex:3}} onPress={() => {
          setDeleteState(false);
          setEditor(item.id);
          setModalVisible(true);
        }}>
        <Text >{item.task}</Text>
        </TouchableOpacity>
        {/* <View style={styles.vertiLine}/> */}
        <View style = {{flex:3}}>
        <CheckBox
          value={checkedItems.includes(item.id)}
          onValueChange={() => handleToggleCheckbox(item.id)}
        />
        </View>
      </View>
    );
 return (
  <View style={{flexDirection:'column',flex:1}}>
  <View style={styles.container1}>
    <View style={{flex:2}}>
    <Text style={styles.title}>Your Details:</Text>
    <Image source={ image} style={styles.ImageStyle} />
    </View>
    <View style={{flex:2, top:50}}>
    <Text>Name: {personal.Name}</Text> 
    <Text>Contact: {personal.Contact}</Text>
    <Text>Email: {personal.Email}</Text>
    </View>
    <View style={{flexDirection:'column',justifyContent:'space-between'}}>
    <TouchableOpacity  title='User Login' style={styles.redButton}
          onPress={
             () => navigation.push('UserLogin') }
          >
          <Text>Logout</Text>
        </TouchableOpacity> 
    <TouchableOpacity  style={styles.redButton} onPress={() => {
      setDeleteState(true);
      setModalVisible(true)
    }}>
                      <Text>Add Task</Text>
                  </TouchableOpacity>
                  <Modal
                      animationType='slide'
                      visible={modalVisible}
                      transparent={true}
                      onRequestClose={() => {
                          Alert.alert("Task Added successfully.");
                          setModalVisible(!modalVisible);
                      }}
                  >
                      <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <View Style={styles.container1}>
                            <Text>Task:</Text>
                            <TextInput 
                            value={newTask}
                            onChangeText={(text) => setNewTask(text)}/>
                            </View>
                            <View Style={styles.container1}>
                            <Text>Status:</Text>
                            <CheckBox
                            value={newTaskStatus}
                            onValueChange={setNewTaskStatus}
                            />
                            </View>
                            <TouchableOpacity  style={styles.redButton} onPress={async () => {
                              setModalVisible(false);
                              editTasks();
                              navigation.push("UserTodo",uid);
                            }
                          }>
                          <Text>Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  
                        // activeOpacity = { .5 } 
                        disabled={deleteState}
                         onPress={async () => {
                              setModalVisible(false);
                              deleteTask(editor);
                              navigation.push("UserTodo",uid);
                            }
                          }>
                          <Text>Delete</Text>
                        </TouchableOpacity>
                          </View>
                      </View>
                  </Modal>
        <TouchableOpacity   style={styles.redButton} onPress={() => setModalVisible2(true)}>
                      <Text>Edit Profile</Text>
                      </TouchableOpacity>
                      <Modal
                      animationType='slide'
                      visible={modalVisible2}
                      transparent={true}
                      onRequestClose={() => {
                          Alert.alert("Profile edited successfully.");
                          setModalVisible2(!modalVisible2);
                      }}>
                      <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                          <TouchableOpacity onPress={pickImage} style={styles.ImageStyle}>
                          <Image source={image} style={styles.ImageStyle} />
                            </TouchableOpacity>
                            <View Style={styles.container1}>
                            <Text>Name:</Text>
                            <TextInput 
                            defaultValue={personal.Name}
                            onChangeText={(text) => 
                            {tempPersonal.Name = text
                            setPersonal(tempPersonal)}
                            }/>
                            </View>
                            <View Style={styles.container1}>
                            <Text>Contact:</Text>
                            <TextInput 
                            defaultValue={personal.Contact}
                            onChangeText={(text) => {
                              tempPersonal.Contact = text
                              setPersonal(tempPersonal)
                            }}/>
                            </View>
                            <TouchableOpacity style={styles.redButton} onPress={async () => {
                              try {
                                sendFirebaseData();
                                // const docRef1 = await updateDoc(doc(db, "users/"+uid), personal);
                              } catch (e) {
                                console.error("Error updating document: ", e);
                              }
                              setModalVisible2(false);
                            }}>
                          <Text>Done</Text>
                        </TouchableOpacity>
                          </View>
                      </View>
                  </Modal>
                  </View>
    </View>
    <View style={styles.container}>
    <View style={{flexDirection:'row'}}>
    <Text style={{flex:3}}>Task</Text> 
    <Text style={{flex:3}}>Status</Text>
    </View>
    <View style={styles.horiLine}/>
      <ScrollView contentContainerStyle={{ justifyContent: 'space-around' }}
                           showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                          <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
                        />
                      </ScrollView>
  </View>
  </View>
);
}

const styles = StyleSheet.create({
container: { 
  flex:3,
  padding: 18,
  paddingTop: 35,
  backgroundColor: '#ffffff' 
},
redButton:
{
padding: 10,
borderRadius: 10,
backgroundColor:'red'
},
ImageStyle:{
  resizeMode:'fill',
  width: '100px', 
  height: '100px',
  padding:5,
  top:10,
},
horiLine:{
    borderBottomColor: 'black',
    padding:5,
    borderBottomWidth: StyleSheet.hairlineWidth,
},
vertiLine: {
  height: '100%',
  width: 1,
  right:50,
  backgroundColor: '#909090',
},
ImageStyle:{
  resizeMode:'fill',
  width: '100px', 
  height: '100px',
  padding:5,
  top:10,
},
title:{
  paddingBottom:25,
  alignSelf: 'left',
  fontWeight: 'bold',
},
header:{
  flex:3,
  alignSelf: 'center',
  fontWeight: 'bold',
},
checkboxContainer: {
  flexDirection: 'row',
  marginBottom: 20,
},
checkbox: {
  alignSelf: 'center',
},
HeadStyle: { 
  height: 50,
  alignContent: "center",
  backgroundColor: '#ffe0f0'
},
TableText: { 
  margin: 10
},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
},
modalView: {
  justifyContent:'space-between',
  margin: 20,
  backgroundColor: "#ADD8E6",
  borderRadius: 20,
  padding: 35,
  width: "50%",
  height: "50%",
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
      width: 0,
      height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

modalText: {
  marginBottom: 15,
  textAlign: 'center',
},
container1: {
flex:1,
flexDirection: 'row',
padding:30,
backgroundColor:"#89CFF0"
},
});

