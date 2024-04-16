import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, SafeAreaView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = ({setLoggedIn, setLoggedInUser}) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try{
      const resp = await fetch('http://143.244.178.214:8084/login', {
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
        setEmail('')
        setPassword('')
        alert(data.message);
        navigation.navigate('Home');
      }
      else {
        alert(data.message);
      }

    } catch(error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.register}>
        <Text>Need to register?</Text>
        <Text style={styles.textRegister}  onPress={() =>navigation.navigate('Register')}>Click here</Text>
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
});

export default Login