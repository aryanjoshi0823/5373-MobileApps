import React,{useState, useEffect, useRef}  from 'react'
import {Modal, View, Text, TouchableOpacity, StyleSheet, Image  } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';

const ImageUpload = ({imageAsset, setImageAsset, navigation,loggedInUser}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoSubmit = async () =>  {
    try {
      const url = `http://143.244.178.214:8083/upload/profile-pic?user_id=${loggedInUser?.user_id}&username=${loggedInUser?.username}&profile_pic=${imageAsset.uri || imageAsset}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
    });

      const data = await response.json();
      console.log(data.success)
      if (data.success) {
        setImageAsset(null)
        alert(data.message);
      }
      else {
        alert(data.detail);
      }
    } catch (error) {
      console.log("error");
    }
  }
  const cameraNavigation = () =>  {
    setImageAsset(null)
    navigation.navigate('Camera')
    setModalVisible(!modalVisible)
  }

  const uploadImgLibrary = async () => {
    setModalVisible(!modalVisible)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission denied', 'Please grant permission to access the photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { assets } = result;

      if (assets && assets.length > 0) {
        const { uri, filename } = assets[0]; 
        setLoading(true);
        setImageAsset({ uri:uri, name: filename });
        setLoading(false);
      }
    }
  };

  return (

    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.uploadContainer}>
          {loading && <ActivityIndicator/>}
          {
            !imageAsset ? 
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.uploadButton}>
                <View style={styles.uploadIconContainer}>
                  <Icon name="cloud-upload" size={50} color="black" />
                  <Text style={styles.uploadText}>Click to upload</Text>
                </View>
                <Text style={styles.uploadHint}>Use high-quality JPG, SVG, PNG, GIF less than 20 MB</Text>
              </TouchableOpacity>
            :
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageAsset?.uri || imageAsset}} style={styles.image} />
                <TouchableOpacity onPress={() => setImageAsset(null)} style={styles.deleteButton}>
                  <Icon name="delete" size={30} color="black" />
                </TouchableOpacity>
              </View>
          }
        </View>
      </View>
      { 
        modalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
                <TouchableOpacity style={styles.modalView}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Icon  name="close" size={20}/>
                    </TouchableOpacity>

                  <View style={styles.modelTextCont}>
                    <TouchableOpacity onPress={() => uploadImgLibrary()} style = {styles.modelIndText}>
                      <Text style={styles.modelText}>Photo Library</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => cameraNavigation()}>
                      <Text style={styles.modelText}>Take photo</Text>
                    </TouchableOpacity>
                  </View>

                </TouchableOpacity>
            </View>
          </Modal>
      )}
      {imageAsset? 
        <TouchableOpacity style={styles.bottomButton} onPress = {handlePhotoSubmit}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      :
        null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display:'flex',
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
    padding: 3,
    margin:20,
    flex: 0.9,
  },
  cardContainer: {
    backgroundColor: '#E5E4E2', 
    padding: 3,
    margin:10,
    flex:1
  },
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: 'gray',
    padding: 10,
    margin:10,
    flex:1
  },
  uploadButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 18,
  },
  uploadHint: {
    marginTop: 32,
    color: 'gray',
  },
  imageContainer: {
    position: 'relative',
    height: '100%',
    flex:1
  },
  image: {
    width:320,
    height:200,
    flex:1
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 5,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
      margin: 20,
      width:300,
      height:170,
      borderRadius: 20,
      padding: 20,
      display:'flex',
      backgroundColor: 'white',
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
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: '#E5E4E2',
    width: 30, 
    height: 30,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
  },

  modelTextCont: {
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#E5E4E2',
    fontSize:25,
    gap:10,
    flex:1,
    width:'94%',
    borderRadius:6,
    marginTop:20
  },

  modelText: {
    fontSize:20,
    padding:5,
  },

  modelIndText:{
    width:'100%',
    borderBottomWidth: 1, 
    borderBottomColor: 'gray', 
    paddingBottom: 10,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },

  bottomButton:{
    width: 100,
    height: 40,
    backgroundColor: '#128c7e',
    borderRadius:10,
    margin:10,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },

  buttonText: {
    fontSize:18,
    fontWeight:'bold',
    color:'white'
  }
});

export default ImageUpload