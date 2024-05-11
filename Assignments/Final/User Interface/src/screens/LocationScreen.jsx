import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const LocationScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [username, setUsername] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [userLocations, setUserLocations] = useState([]);
    const [markedUser, setMarkedUser] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            //Watch user's location continuously
            Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
                setLocation(newLocation); 
            });
       
        })();
    }, []);

    const handleLocation = async () => {

        const userMarked = markedUser.includes(`${username}`)
        if (!userMarked) {
            try{
                const resp = await fetch(`http://143.244.178.214:8083/getLocation/${username}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json',}
                })
            
                const data = await resp.json();
            
                if (data.success) {
                    console.log(data)
                    setUserLocations(prevLocations => [...prevLocations, data])
                    setModalVisible(!modalVisible);
                    setMarkedUser(prevArray => [...prevArray, username]);
                    setUsername('');
                    alert(`Location shared with: ${username}`);
                }
                else {
                    alert(data.detail);
                }
            
            } catch(error) {
                 console.error('Error:', error);
            }
        }
        else {
            setUsername('');
            setModalVisible(!modalVisible)
            userMarked? alert(`Username already marked`): alert(`Username required.`)
        }
    };

    const handleMarkerPress = (user) => {
        alert(`Name: ${user.user_info.firstName} ${user.user_info.lastName}`);

    };

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                   <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Your Location"
                    />
                    {userLocations?.map((user) => (
                        <Marker
                            key={user.id}
                            coordinate={{
                                latitude: user.location.latitude,
                                longitude: user.location.longitude,
                            }}
                            onPress={() => handleMarkerPress(user)}
                        />
                    ))} 
                </MapView>
            ) : (
                <Text>{errorMsg || 'Waiting for location permission...'}</Text>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={{ fontSize: 24, color:'white', }}>×</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.modalText}
                            placeholder="Enter friend's username"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            autoCapitalize="none"
                            placeholderTextColor="rgba(0, 0, 0, 0.6)"
                        />
                        <View style={styles.locationButton}>
                            <Button
                                title="Share"
                                onPress={() => handleLocation()}
                            />
                            { userLocations.length > 0 && 
                                <Button
                                    title="Clear"
                                    onPress={() => setUserLocations([])}
                                />
                            }
                        </View>
                    </View>
                </View>
            </Modal>
            <Button title="Share Location"  onPress={() => setModalVisible(true)} />
        </View>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: 5,
        top: 5,
        backgroundColor: 'tomato',
        width: 30, 
        height: 30,
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        display:'flex',
        justifyContent:'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        textAlign: 'center',
        width: 200, 
        borderRadius: 6,
        margin: 10,
        padding: 10,
        backgroundColor: '#E5E4E2',
        placeholderTextColor:"black"
    },
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    locationButton: {
        display:'flex',
        flexDirection: 'row',
    },
});

export default LocationScreen;
