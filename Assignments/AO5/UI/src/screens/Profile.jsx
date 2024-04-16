import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView  } from 'react-native'
import { useNavigation } from '@react-navigation/native';

const Profile = ({ loggedIn, setLoggedIn, loggedInUser }) => {
    const navigation = useNavigation();

    const handleLogin = () => {
        if(loggedIn) {
          setLoggedIn(!loggedIn)
          navigation.navigate('Home')
        } else {
          navigation.navigate('Login')
        }
       };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{!loggedIn? `Welcome, Guest `: `Welcome, ${loggedInUser.username}`}</Text>
            <View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>{loggedIn?`Logout` : `Login`}</Text>
                </TouchableOpacity>
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


  
// {
//     loggedIn? <Text>{loggedIn? `Welcome, ${loggedInUser.username}`: ''}</Text>: null  /// need to change to user name 
// }