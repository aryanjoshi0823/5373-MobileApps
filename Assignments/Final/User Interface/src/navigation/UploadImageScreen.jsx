import React,{useState}  from 'react'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CameraPage } from '../components';
import { ImageUpload } from '../screens';

const UploadImageScreen = ({loggedIn, loggedInUser, setPhoto}) => {
    const [imageAsset, setImageAsset] = useState(null);
    const Stack = createStackNavigator();
    const navigation = useNavigation();

  return (
    <Stack.Navigator >
        <Stack.Screen name="Photo">
        {({ navigation }) =>  
            <ImageUpload  
                loggedInUser = {loggedInUser}
                imageAsset = {imageAsset} 
                setImageAsset = {setImageAsset}
                loggedIn={loggedIn} 
                navigation={navigation} 
            />
        }
        </Stack.Screen>

        <Stack.Screen name={'Camera'} >
        {({ navigation }) => 
            <CameraPage  
                setImageAsset={setImageAsset}
                loggedIn={loggedIn} 
                navigation={navigation} 
            />
        }
        </Stack.Screen>
    </Stack.Navigator>
  )
}

export default UploadImageScreen