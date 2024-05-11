import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserList = ({ users, setSelectedUser, loggedIn}) => {

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedUser(item)}>
            <View style={styles.userContainer} >
                <View style={styles.iconBck} >
                    <Icon  style={styles.iconButton}  name="person" size={30} color="#000" />
                </View>

                <View style={styles.info}>
                    <View style={styles.name}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.date}>yesterday</Text>
                    </View>
                    <View> 
                        <Text style={styles.msg} >latest message</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
      );
    
  return (
    <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
  />
  )
}
const styles = StyleSheet.create({
    user:{

    },

    userContainer: {
      display:'flex',
      flexDirection:'row',
      gap:10,
      padding: 15,
      //boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
    },
    userName: {
      fontSize: 18,
      fontWeight:"bold",
    },
    iconButton: {
        color: 'black',
    },
    iconBck: {
        backgroundColor: '#E5E4E2',
        width: 40, 
        height: 40,
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    name:{
        display: 'flex',
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        minWidth:362,
    },
    msg: {
       fontWeight:"bold",
       fontSize: 14,
       color: 'rgb(128, 128, 128)'
    },
    date: {
        fontWeight:"bold",
        fontSize: 12,
        color: 'rgb(128, 128, 128)'
     }
  });

export default UserList



