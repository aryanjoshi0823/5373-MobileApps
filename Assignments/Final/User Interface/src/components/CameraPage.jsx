import React,{useState, useEffect}  from 'react'
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image  } from 'react-native'
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons'; 

const CameraPage = ({setImageAsset, navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [])

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setImage(photo.uri)
      setPreviewVisible(true);
    }
  }
  const navigateToPhoto =  () => {
    setImageAsset(image);
    navigation.navigate('Photo')
  }
  if (hasPermission === false) {
    alert("No access to camera");
  }


  return (
    <SafeAreaView style={styles.container}>
      {previewVisible ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image  }} style={styles.previewImage} />
          <View style={styles.retakeChooseBtnCtn}>
            <TouchableOpacity style={styles.retakeChooseBtn} >
              <FontAwesome name="check"  style={styles.iconBtn}  onPress={navigateToPhoto}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retakeChooseBtn} onPress={() => {setPreviewVisible(false); setImage(null) }}>
              <FontAwesome name="times"  style={styles.iconBtn} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCamera(ref)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 10,
    borderRadius:40,
    zIndex:999,

  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  retakeChooseBtnCtn: {
    flexDirection: 'row',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 40,
    borderRadius:40,
    zIndex:999,
    width: '40%',
    gap:20,
  },

  retakeChooseBtn: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },

  iconBtn:{
    padding:10,
    fontSize:20,
    color:'white'
  }
});

export default CameraPage