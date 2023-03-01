import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput ,TouchableOpacity } from 'react-native';
import 'firebase/auth';
import {getAuth, signInWithEmailAndPassword , sendPasswordResetEmail } from "firebase/auth";


export default function AdminLogin({navigation}) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const auth = getAuth();
const handleEmailSign = async (email, password) => {
  try {
    if(email=="test@test.com") {
      await signInWithEmailAndPassword(auth,email, password);
      setEmail();
      setPassword();
      navigation.push('AdminTodo',auth.currentUser.uid);
    }
    else alert("Looks like you are user, please try user login.");
    // Handle successful authentication
  } catch (error) {
    alert("Incorrect user id or password");
    // Handle authentication errors
  }
};
return (
  <View style={styles.container}>
    <Text style={[styles.container1,{paddingTop: 25, alignItems: 'center', fontSize: 30, textAlign: 'center'}]}>Admin Login Page</Text>
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
          <View style={styles.container2}>
          <TouchableOpacity  title='Login' style={styles.button}
              onPress={
                () => {
                  handleEmailSign(email,password); 
                }
              }
              >
              <Text style={styles.buttonLabel}>Login</Text>
            </TouchableOpacity>
          <TouchableOpacity  title='User Login' style={styles.button}
              onPress={
                 () => {
                      navigation.push('UserLogin')
                }
              }
              >
              <Text style={styles.buttonLabel}>User Login</Text>
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