import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {LoginScreen, RegistrationScreen, LocationScreen } from '../screens'
import { Icon } from 'react-native-elements';
import HomeStackScreen from './HomeStackScreen';
import ChatStackScreen from './ChatStackScreen';
import UploadImageScreen from './UploadImageScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);


  const USER_STORAGE_KEY = 'loggedInUser'; 

    // Load user data from local storage on app startup
    useEffect(() => {
      loadUserFromStorage();
    }, []); 

    const loadUserFromStorage = async () => {
      try {
        const userJSON = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userJSON) {
          const user = JSON.parse(userJSON);
          setLoggedInUser(user);
          setLoggedIn(true);
          
        }
      } catch (error) {
        console.log('Error loading user from storage:', error);
      }
    };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Login') {
            iconName = focused ? 'login' : 'login';
          } else if (route.name === 'Registration') {
            iconName = focused ? 'app-registration' : 'app-registration';
          } else if (route.name === 'Location') {
            iconName = focused ? 'map' : 'map';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chat' : 'chat';
          }
          else if (route.name === 'UploadImage') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload';
          }
          return <Icon name={iconName} type="material" color={color} size={size} />;
        },
        
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        options={({ navigation }) => ({
          headerShown: false 
        })}
      >
        {() => 
          <HomeStackScreen 
            loggedIn={loggedIn}  
            setLoggedIn = {setLoggedIn}  
            setLoggedInUser = {setLoggedInUser} 
            USER_STORAGE_KEY = {USER_STORAGE_KEY}  
            loggedInUser = {loggedInUser}
          />}
      </Tab.Screen>
      {
        (loggedIn)? 
          <>          
            <Tab.Screen name="Location" component={LocationScreen} />
            <Tab.Screen name="Chat" options={({ navigation }) => ({headerShown: false })}>
              {() => <ChatStackScreen           
                loggedIn={loggedIn}  
                setLoggedIn = {setLoggedIn}  
                setLoggedInUser = {setLoggedInUser} 
                loggedInUser = {loggedInUser}
                USER_STORAGE_KEY = {USER_STORAGE_KEY}
            />}
            </Tab.Screen>
            <Tab.Screen name="UploadImage" options={({ navigation }) => ({headerShown: false })}>
              {() => <UploadImageScreen loggedIn={loggedIn} loggedInUser= {loggedInUser} />}
            </Tab.Screen>
          </>

         : 
          <>
            <Tab.Screen
              name="Login"
            >
              {() => 
                <LoginScreen  
                  setLoggedIn = {setLoggedIn}  
                  setLoggedInUser = {setLoggedInUser} 
                  USER_STORAGE_KEY = {USER_STORAGE_KEY}  
                />}
            </Tab.Screen>
            <Tab.Screen name="Registration" component={RegistrationScreen} />
          </>
      }
    </Tab.Navigator>
  );
};



export default BottomTabNavigator;
