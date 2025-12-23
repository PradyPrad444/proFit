import * as React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'react-native';
import captureIcon from '../../assets/capture.png';
import returnIcon from '../../assets/return.png';
import tickIcon from '../../assets/tick.png';
import { Alert } from 'react-native';

const AddScreen = ({ navigation }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraInitialized, setCameraInitialized] = React.useState(false);
  const isFocused = useIsFocused();
  const cameraDevice = useCameraDevice('back');
  const cameraRef = React.useRef(null);

  const [capturedPhoto, setCapturedPhoto] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const checkPermission = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    };
    checkPermission();
  }, [hasPermission, requestPermission]);

  if (cameraDevice == null) {
    return <ActivityIndicator />;
  }

  const takePhoto = async () => {
    if (cameraRef.current == null) return;

    try {
      const photo = await cameraRef.current.takePhoto();
      setCapturedPhoto(photo.path);
    } catch (e) {
      console.log('Photo did not get captured! Error: ', e);
    }
  };

  const addToWardrobe = async itemId => {
    const response = await fetch('http://192.168.1.212:8000/wardrobe/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId }),
    });

    const json = await response.json();

    Alert.alert('Success', 'Item added to the Wardrobe', [
      {
        text: 'OK',
        onPress: () => {
          setCapturedPhoto(false);
          setIsLoading(false);
          navigation.navigate('Closet');
        },
      },
    ]);
  };

  const uploadPhoto = async () => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('file', {
        uri: 'file://' + capturedPhoto,
        name: 'unprocessedPhoto.png',
        type: 'image/png',
      });

      const response = await fetch('http://192.168.1.212:8000/upload', {
        method: 'POST',
        body: data,
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      const json = await response.json(); // receiving response from the backend
      await addToWardrobe(json.item_id);
      setIsLoading(false);
    } catch (e) {
      console.log('Upload didnt work', e);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#171412', flex: 1 }}>
      {capturedPhoto ? (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: 'file://' + capturedPhoto }}
            style={{ flex: 1, resizeMode: 'contain' }}
          />

          {/* ADD LOADING OVERLAY */}
          {isLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={{ color: '#ffffff', marginTop: 20, fontSize: 18 }}>
                Processing image...
              </Text>
            </View>
          )}

          {/* The return and confirmed button for the picture preview */}
          <View
            style={{
              position: 'absolute',
              bottom: 60,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
              onPress={() => {
                setCapturedPhoto(null);
              }}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <Text style={styles.primaryBtnText}>Retake</Text>
            </TouchableOpacity>

            {/* confirmed button here */}

            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
              onPress={uploadPhoto}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <Text style={styles.primaryBtnText}>Move Ahead</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{ backgroundColor: '#171412', width: '100%', height: '100%' }}
        >
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={cameraDevice}
            isActive={isFocused && hasPermission}
            onInitialized={() => setCameraInitialized(true)}
            photo={true}
          />
          {/* capture button TouchableOpacity here */}
          <TouchableOpacity
            style={styles.captureBtn}
            onPress={takePhoto}
            disabled={!cameraInitialized}
          >
            <Image style={{ height: 80, width: 80 }} source={captureIcon} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  captureBtn: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    paddingTop: 20,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  primaryBtn: {
    height: 56,
    width: '42%',
    borderRadius: 16,
    backgroundColor: '#ED7A29',
    alignItems: 'center',
    justifyContent: 'center',
    // floating effect
    shadowColor: '#ec6313ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10, // Android
  },
  primaryBtnIcon: {
    fontSize: 18,
    color: 'white',
  },
  primaryBtnText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '600',
  },
});
