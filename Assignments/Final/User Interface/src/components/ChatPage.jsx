import React, {useState, useRef, useEffect} from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet,KeyboardAvoidingView, TextInput } from 'react-native';

const ChatPage = ({ selectedUser, loggedIn, navigation }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const flatListRef = useRef();
  
    const sendMessage = () => {
      if (message.trim() === '') return;
  
      setMessages(prevMessages => [...prevMessages, { sender: 'You', text: message }]);
      setMessage('');
    };
  
    useEffect(() => {
      flatListRef.current.scrollToEnd({ animated: true });
    }, [messages]);
  
    const renderMessage = ({ item }) => (
      <View style={styles.messageContainer}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.message}>{item.text}</Text>
      </View>
    );
  
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={80}>
        <View style={styles.container}>
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMessage}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={text => setMessage(text)}
              placeholder="Type a message"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    userContainer: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    userName: {
      fontSize: 18,
    },
    chatContainer: {
      flex: 1,
      padding: 10,
    },
    messageContainer: {
      marginTop:15,
      maxWidth: '80%',
      marginVertical: 5,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: '#E5E4E2',
      alignSelf: 'flex-end',
    },
    sender: {
      fontWeight: 'bold',
      marginBottom: 3,
    },
    message: {
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      backgroundColor: '#E5E4E2',
      borderRadius:6,
      border: "none",
      outline: "none",
      marginHorizontal: 8,
      paddingVertical:5
    },
    input: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 16,
  
    },
    sendButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#128c7e',
      borderRadius: 20,
      marginHorizontal: 5,
    },
    sendText: {
      color: '#fff',
      fontWeight: 'bold',
    },

  });

  export default ChatPage;