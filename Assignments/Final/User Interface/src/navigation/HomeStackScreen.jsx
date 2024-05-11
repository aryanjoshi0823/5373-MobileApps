import React, {useState,useEffect} from 'react'
import {HomeScreen,  Profile, LoginScreen, RegistrationScreen} from '../screens'
import { createStackNavigator } from '@react-navigation/stack';
import UploadImageScreen from './UploadImageScreen';

const HomeStackScreen = ({loggedIn, setLoggedIn, setLoggedInUser, USER_STORAGE_KEY, loggedInUser}) => {
  const Stack = createStackNavigator(); 

  return (
    <Stack.Navigator>
      <Stack.Screen name="Main">
      {({ navigation }) =>  <HomeScreen  loggedInUser= {loggedInUser} loggedIn={loggedIn} navigation={navigation} />}
      </Stack.Screen>

      <Stack.Screen name="Profile" >
        {({ navigation }) => 
            <Profile  
                setLoggedIn = {setLoggedIn}
                loggedIn={loggedIn} 
                navigation={navigation}
                loggedInUser = {loggedInUser}
            />
        }
      </Stack.Screen>

      <Stack.Screen name="Login">
        {() => 
          <LoginScreen 
            loggedIn={loggedIn}  
            setLoggedIn = {setLoggedIn}  
            setLoggedInUser = {setLoggedInUser} 
            USER_STORAGE_KEY = {USER_STORAGE_KEY}  
          />
        }
      </Stack.Screen> 
      <Stack.Screen name="UploadImage" options={({ navigation }) => ({headerShown: false })}>
        {() => 
          <UploadImageScreen 
            loggedIn={loggedIn}  
            loggedInUser={loggedInUser}
            setLoggedIn = {setLoggedIn}  
            setLoggedInUser = {setLoggedInUser} 
            USER_STORAGE_KEY = {USER_STORAGE_KEY}  
          />
        }
      </Stack.Screen> 
      <Stack.Screen name="Registration" component={RegistrationScreen} />
    </Stack.Navigator>
  )
}

export default HomeStackScreen