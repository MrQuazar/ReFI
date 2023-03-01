import { StyleSheet, Text, View } from 'react-native';
import { TextInput ,TouchableOpacity ,Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import {getAuth, signOut,createUserWithEmailAndPassword } from "firebase/auth";
import app from './firebase';
import { getFirestore } from "firebase/firestore";
import { doc, setDoc} from "firebase/firestore"; 
import { getStorage, ref as strRef, uploadBytes, getDownloadURL } from "firebase/storage"; 

export default function UserRegistration({navigation}) {
  const [image, setImage] = useState("https://firebasestorage.googleapis.com/v0/b/refi-41245.appspot.com/o/camera-icon.png?alt=media&token=9ffe8366-65f4-477d-99dd-303ddc35ef27");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState({});
  var tempProfile ={Name:"",Contact:"",Email:""};

  const auth = getAuth();
  const db = getFirestore(app);
  const storage = getStorage();
  const metadata = {
    contentType: 'image/jpg',
  };

  useEffect(() => {
    setProfile(tempProfile);
  },[]);
  tempProfile = profile;

  const handleEmailRegistration = async (email, password) => {
  try {
    if(email!="test@test.com") {
      await createUserWithEmailAndPassword(auth,email, password);
      const storageRef = strRef(storage, auth.currentUser.uid+'.jpg');
      const response = await fetch(image);
      const blob = await response.blob();
        uploadBytes(storageRef, blob, metadata).then((snapshot) => {
        getDownloadURL(storageRef).then((url)=>{
        tempProfile.ProfileImage= url;
        setProfile(tempProfile);
        const docRef = setDoc(doc(db, "users/"+auth.currentUser.uid), profile);
        auth.signOut();
    })})   
      
      navigation.push('UserLogin');
    }
    else alert("Looks like you are an admin, please try admin login.");
    // Handle successful authentication
  } catch (error) {
    console.log(error);
    // Handle authentication errors
  }
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
  
return (
  <View style={styles.container}>
    <Text style={[styles.container1,{padding: 25, alignItems: 'center', fontSize: 30, textAlign: 'center'}]}>Register Page</Text>
    <View style={styles.container1}>
    <TouchableOpacity onPress={pickImage} style={styles.ImageStyle}>
           <Image source={image} style={styles.ImageStyle} />
           </TouchableOpacity>
      <TextInput  style={styles.inputField} placeholder = 'User Name'
defaultValue={profile.Name}
  onChangeText={(text) => 
    {tempProfile.Name = text
    setProfile(tempProfile)}
    }/>
<TextInput  style={styles.inputField} placeholder = 'Email'
defaultValue={profile.Email}
  onChangeText={(text) => 
    {tempProfile.Email = text
    setProfile(tempProfile)}
    }/>
<TextInput  style={styles.inputField} placeholder = 'Contact'
defaultValue={profile.Contact}
                            onChangeText={(text) => 
                            {tempProfile.Contact = text
                            setProfile(tempProfile)}
                            }/>
                            <TextInput  style={styles.inputField} placeholder = 'Password' 
  defaultValue={profile.Password}
  onChangeText={(text) => setPassword(text)
    }
secureTextEntry={true}/>
</View>
    <View style={styles.container1}>     
      
</View>
          <View style={styles.container2}>
          <TouchableOpacity  title='Register' style={styles.button}
              onPress={
                () => {
                  handleEmailRegistration(profile.Email,password); 
                }
              }
              >
              <Text style={styles.buttonLabel}>Register</Text>
            </TouchableOpacity>
          <TouchableOpacity  title='Back' style={styles.button}
              onPress={
                 () => {
                      navigation.push('UserLogin')
                }
              }
              >
              <Text style={styles.buttonLabel}>Back</Text>
            </TouchableOpacity>
            </View>
      </View>
    );
    }
    
    const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   alignItems: 'center',
      paddingHorizontal: 400,
      justifyContent: 'center',
      backgroundColor: '#81ABBD',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
    },
    container1: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      paddingTop: 10,
      paddingHorizontal: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container2: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 0,
        paddingBottom: 10,
        flexDirection: 'column',
        backgroundColor: '#fff',
      },
      ImageStyle:{
        resizeMode:'fill',
        width: '75px', 
        height: '75px',
        padding:5,
        bottom:10,
      },
    box: {
      width: 50,
      height: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      paddingHorizontal: 5,
      paddingVertical: 10,
      borderRadius: 4,
      backgroundColor: '#0081FE',
      alignSelf: 'center',
      marginHorizontal: '1%',
      marginBottom: 6,
      minWidth: '45%',
      textAlign: 'center',
    },
    inputField: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: '#CFEAF5',
      alignSelf: 'center ',
      marginHorizontal: '1%',
      marginBottom: 6,
      minWidth: '42%',
      textAlign: 'center',
    },
    buttonLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: 'white',
        },
      });