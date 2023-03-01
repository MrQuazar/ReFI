import React, { useState ,useEffect} from 'react';
import { View, FlatList, CheckBox, Text, StyleSheet,  TouchableOpacity ,Modal,TextInput,ScrollView ,Image} from 'react-native';
import app from './firebase';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore"; 


export default function AdminTodo({navigation}) {
  const [users,setUsers] = useState([]);
  const [usersId,setUsersId] = useState([]);
  const [tasks,setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const db = getFirestore(app);

  async function doThis(){
    const querySnapshot = await getDocs(collection(db, "users"));
    var rand = [];
    var rand1 = [];
    querySnapshot.forEach((doc) => {
    rand.push(doc.data());
    rand1.push(doc.id)
  });
  setUsers(rand);
  setUsersId(rand1);
}
useEffect(() => {
  doThis();
},[]);

function keyFinder(email)
{
  var i=0;
  for(i=0;i<users.length;i++)
  {
    if (users[i].Email == email)
      return i;
  }
  return -1;
}

const renderTasks = ({ item }) => (
  <View style={{height:'100%',width:'100%', flexDirection: 'row',justifyContent: "flex-end"}}>
    <Text style={{paddingRight:120}}>{item.task}</Text>
    <View style={styles.vertiLine}/>
    <CheckBox
      value={item.status}
      style={{alignSelf:'center'}}
    />
  </View>
);
    const renderItem = ({ item }) => (
      <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style ={{flex:3,  paddingBottom: 10,}} onPress={async ()=>
          { 
            var key = keyFinder(item.Email);
            const querySnapshot1 = await getDocs(collection(db, "users/"+usersId[key]+"/tasks"));
            var rand2 = [];
            querySnapshot1.forEach((doc) => {
            rand2.push(doc.data());
            });
            setTasks(rand2);
            setModalVisible(true);
        }}>
          <Image source={item.ProfileImage} style={styles.ImageStyle}/>
          </TouchableOpacity>
          <Modal
                      animationType='slide'
                      visible={modalVisible}
                      transparent={true}
                      onRequestClose={() => {
                          setModalVisible(!modalVisible);
                      }}
                  >
                      <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <Text style={styles.title}> Tasks</Text> 
                            <ScrollView contentContainerStyle={{ justifyContent: 'space-around' }}
                           showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false}>
                          <FlatList
        data={tasks}
        renderItem={renderTasks}
                        />
                      </ScrollView>  
                      <TouchableOpacity style={styles.redButton} onPress={()=>setModalVisible(false)}>
      <Text>Close</Text>
      </TouchableOpacity>  
                          </View>
                          
                      </View>
                  </Modal>
          <Text style ={{flex:3}}>{item.Name}</Text>
          <Text style ={{flex:3}}>{item.Email}</Text>
          <Text style ={{flex:3}}>{item.Contact}</Text>
          </View>
          <View style={styles.horiLine}/>
      </View>
    );
  
 return (
  <View style={styles.container}>
    <Text style={styles.title}> User's Information </Text>
    <View style = {{flexDirection:'row'}}>
    <Text style={styles.header}> Image </Text>
    <Text style={styles.header}> Name </Text>
    <Text style={styles.header}> Email </Text>
    <Text style={styles.header}> Contact </Text>
    </View>
    <View style={styles.horiLine}/>
    <ScrollView contentContainerStyle={{ justifyContent: 'space-around' }}
                           showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false}>
                          <FlatList
        data={users}
        renderItem={renderItem}
                        />
                      </ScrollView>
    <TouchableOpacity style={styles.redButton} onPress={()=> navigation.navigate("AdminLogin")}>
      <Text style={{alignSelf:'center'}}>Logout</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
container: { 
  flex: 1,
  padding: 18,
  paddingTop: 35,
  backgroundColor: '#ffffff' 
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
redButton:
{
top:10,
padding: 10,
borderRadius: 10,
alignSelf:'center' ,
backgroundColor:'red'
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
  alignSelf: 'center',
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
flexDirection: 'row',
backgroundColor: '#fff',
},
});

