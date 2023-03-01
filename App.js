import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AdminLogin from './components/adminLogin';
import AdminTodo from './components/adminTodo';
import UserLogin from './components/userLogin';
import UserRegistration from './components/userRegistration';
import UserTodo from './components/userTodo';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='UserLogin'>
        <Stack.Screen name='UserLogin' component={UserLogin} options={{ headerShown: false }} />
        <Stack.Screen name='AdminLogin' component={AdminLogin} options={{ headerShown: false }} />
        <Stack.Screen name='AdminTodo' component={AdminTodo} options={{ headerShown: false }} />
        <Stack.Screen name='UserRegistration' component={UserRegistration} options={{ headerShown: false }} />
        <Stack.Screen name='UserTodo' component={UserTodo} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
 
