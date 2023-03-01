import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput ,TouchableOpacity } from 'react-native';
import 'firebase/auth';
import {getAuth, signInWithEmailAndPassword , sendPasswordResetEmail } from "firebase/auth";


export default function UserLogin({navigation}) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const auth = getAuth();
const handleEmailSign = async (email, password) => {
  try {
    if(email!="test@test.com") {
      await signInWithEmailAndPassword(auth,email, password);
      navigation.push('UserTodo',auth.currentUser.uid);
    }
    else alert("Looks like you are an admin, please try admin login.");
    // Handle successful authentication
  } catch (error) {
    console.log(error);
    alert("Please enter correct username or password.");
    // Handle authentication errors
  }
};
return (
  <View style={styles.container}>
    <Text style={[styles.container1,{paddingTop: 25, alignItems: 'center', fontSize: 30, textAlign: 'center'}]}>Login Page</Text>
    <View style={[styles.container1,{paddingTop: 20}]}>
    {/* <Text>Email:</Text> */}
      <TextInput  style={styles.inputField} placeholder = 'Email'
value={email}
onChangeText={(text) => setEmail(text)}/>
</View>
    <View style={styles.container1}>     
    {/* <Text>Password:</Text> */}
      <TextInput  style={styles.inputField} placeholder = 'Password' 
value={password}
onChangeText={(text) => setPassword(text)}
secureTextEntry={true}/>
</View>

<View style={[styles.container1,{alignSelf: 'flex-end', paddingEnd: '30%', paddingStart: '60%', paddingTop: '0%'}]}>   
      <TouchableOpacity  title='Forgot Password' 
          onPress={()=> {
                          if (email!="") alert("Password reset mail has been sent to the entered email address");
                          else alert("Please enter valid email id");
                          sendPasswordResetEmail(auth, email);
                        }}>
          <Text style={{color:'#0081FE',alignSelf: 'flex-end'}}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
      <TouchableOpacity  title='Admin Login' style={styles.button}
          onPress={
             () => {
                  navigation.push('AdminLogin')
            }
          }
          >
          <Text style={styles.buttonLabel}>Admin Login</Text>
        </TouchableOpacity>
        <TouchableOpacity  title='Login' style={styles.button}
          onPress={
            () => {
              handleEmailSign(email,password); 
            }
          }
          >
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity  title='Register' style={styles.button}
          onPress={
             () => {
                  navigation.push('UserRegistration')
  
            }
          }
          >
          <Text style={styles.buttonLabel}>Register</Text>
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
  flexDirection: 'row',
  backgroundColor: '#fff',
  paddingTop: 10,
  paddingHorizontal: 0,
  alignItems: 'center',
  justifyContent: 'center',
},
container2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 0,
    paddingBottom: 10,
    flexDirection: 'column',
    backgroundColor: '#fff',
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
  alignSelf: 'flex-start',
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