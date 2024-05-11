import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, SafeAreaView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({setLoggedIn, setLoggedInUser, USER_STORAGE_KEY}) => {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
      setErrors({ email: '', password: '' });

      if (!email) 
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is required.' }));
    
      if (!password)
        setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required.' }));
      
    if(email && password){
      try{
        const resp = await fetch('http://143.244.178.214:8083/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })

        const data = await resp.json();

        if (data.success) {
          setLoggedIn(true)
          setLoggedInUser(data.user_info);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user_info));
          setEmail('')
          setPassword('')
          alert(data.message);
          navigation.navigate('Main');
        }
        else {
          alert(data.detail);
        }

      } catch(error) {
        console.error('Error:', error);
      }
    }  
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput

        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Email"
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password"
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.register}>
        <Text>Need to register?</Text>
        <Text style={styles.textRegister}  onPress={() =>navigation.navigate('Registration')}>Click here</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  register: {
    display:'flex',
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  textRegister: {
    color: '#007bff',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
  },

  errorInput: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    //marginLeft: 10,
  },
});

export default LoginScreen