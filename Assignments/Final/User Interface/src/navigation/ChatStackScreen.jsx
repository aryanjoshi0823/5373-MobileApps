import React, {useState, useEffect} from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { UserList } from '../components';
import { useNavigation } from '@react-navigation/native';
import {ChatPage} from '../components';
import UploadImageScreen from './UploadImageScreen';


const ChatStackScreen = ({loggedIn, setLoggedIn, setLoggedInUser, USER_STORAGE_KEY, loggedInUser}) => {
    const Stack = createStackNavigator();
    const navigation = useNavigation();
    const [selectedUser, setSelectedUser] = useState(null);

    const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Alex' },
        { id: 3, name: 'Tina' },
    ];

useEffect(() => {
    if(selectedUser)
        navigation.navigate(selectedUser?selectedUser.name:'users');
},[selectedUser]);


    return (
        <Stack.Navigator>
          <Stack.Screen name="Chats">
            {({ navigation }) =>  
                <UserList  
                    setSelectedUser = {setSelectedUser} 
                    users = {users} 
                    loggedIn={loggedIn} 
                    navigation={navigation} 
                />
            }
          </Stack.Screen>
    
          <Stack.Screen name={selectedUser?selectedUser.name:'users'} >
            {({ navigation }) => 
                <ChatPage 
                    selectedUser={selectedUser}
                    loggedIn={loggedIn} 
                    navigation={navigation} 
                />
            }
          </Stack.Screen>
        </Stack.Navigator>
      )

}

export default ChatStackScreen








