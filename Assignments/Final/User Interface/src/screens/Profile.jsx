import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView  } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation, loggedIn, loggedInUser, setLoggedIn }) => {

    const handleLogin = async () => {
        try {
            if (loggedIn) {
                await AsyncStorage.clear();
                setLoggedIn(!loggedIn);
                navigation.navigate('Home');
            } else {
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error("Error during login:", error);

        }
    
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{!loggedIn? `Welcome, Guest `: `Welcome, ${loggedInUser?.username}`}</Text> 
            <View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>{loggedIn?`Logout` : `Login`}</Text>
                </TouchableOpacity>
                {
                    loggedIn?
                        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('UploadImage')}>
                            <Text style={styles.loginText}>Upload Profile Pic</Text>
                        </TouchableOpacity>
                    :
                     null
                }

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 15,
        fontWeight:  600,
    },

    loginText: {
        fontSize: 18,
        fontWeight:  "bold",
        textAlign:"center"
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    loginButton: {
        marginTop: 20,
        backgroundColor: '#E5E4E2',
        padding: 15,
        paddingHorizontal:'20%',
        borderRadius: 5,
        fontWeight: 500,
    }
  });

export default Profile


  
