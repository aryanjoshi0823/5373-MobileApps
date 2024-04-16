import React, {useState} from  'react'
import {TextInput, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Register = () => {

  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const   handleRegister = async () => {
    try{
      const resp = await fetch('http://143.244.178.214:8084/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: userName,
          email: email,
          password: password,
        }),
      })

      const data = await resp.json();
    
      if (data.success) {
        setFirstName('')
        setLastName('')
        setUserName('')
        setEmail('')
        setPassword('')
        alert(data.message);
        navigation.navigate('Login');
      }

    } catch(error) {
      console.error('Error:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
        autoCapitalize="none"

      />
      <TextInput
        style={styles.input}
        placeholder="User Name"
        onChangeText={setUserName}
        value={userName}
        autoCapitalize="none"
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.register}>
        <Text>Already register?</Text>
        <Text style={styles.textRegister}  onPress={() =>navigation.navigate('Login')}>Login</Text>
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


export default Register