//import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Homepage, Login, Register, Profile} from './src/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login">
          {(props) => <Login {...props}  setLoggedIn={setLoggedIn} setLoggedInUser = {setLoggedInUser} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home">
          {(props) => <Homepage {...props} loggedIn={loggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {(props) => <Profile {...props} loggedIn={loggedIn} setLoggedIn={setLoggedIn} loggedInUser = {loggedInUser}/>}
        </Stack.Screen>
      </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;