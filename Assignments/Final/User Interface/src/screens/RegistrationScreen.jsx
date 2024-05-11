import React, {useState} from  'react'
import {TextInput, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegistrationScreen = () => {

  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  });

  const   handleRegister = async () => {

    setErrors({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
    });

    // Validation
    let isValid = true;

    if (firstName.length < 4) {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: 'First name must be at least 4 characters' }));
      isValid = false;
    }
    if (lastName.length < 4) {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: 'Last name must be at least 4 characters' }));
      isValid = false;
    }
    if (userName.length < 4) {
      setErrors((prevErrors) => ({ ...prevErrors, userName: 'Username must be at least 4 characters' }));
      isValid = false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Invalid email address' }));
      isValid = false;
    }
    if (password.length < 8) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 8 characters' }));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    if(firstName && lastName && userName && email && password){
      try{
        const resp = await fetch('http://143.244.178.214:8083/register', {
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
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={[styles.input, errors.firstName && styles.errorInput]}
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
        autoCapitalize="none"
      />
      {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
      <TextInput
       style={[styles.input, errors.lastName && styles.errorInput]}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
        autoCapitalize="none"
      />
      {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
      <TextInput
        style={[styles.input, errors.userName && styles.errorInput]}
        placeholder="User Name"
        onChangeText={setUserName}
        value={userName}
        autoCapitalize="none"
      />
      {errors.userName ? <Text style={styles.errorText}>{errors.userName}</Text> : null}
      <TextInput
        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 10,
  },
});


export default RegistrationScreen