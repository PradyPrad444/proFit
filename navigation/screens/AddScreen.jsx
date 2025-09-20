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

const AddScreen = ({ navigation }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraInitialized, setCameraInitialized] = React.useState(false);
  const isFocused = useIsFocused();
  const cameraDevice = useCameraDevice('back');
  const cameraRef = React.useRef(null);

  const [capturedPhoto, setCapturedPhoto] = React.useState(null);

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

  return (
    <SafeAreaView style={{ backgroundColor: '#171412', flex: 1 }}>
      {capturedPhoto ? (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: 'file://' + capturedPhoto }}
            style={{ flex: 1, resizeMode: 'contain' }}
          />
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
          <TouchableOpacity
            style={styles.captureBtn}
            onPress={takePhoto}
            disabled={!cameraInitialized}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>Click</Text>
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
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#00000088',
    padding: 20,
    borderRadius: 50,
  },
});
