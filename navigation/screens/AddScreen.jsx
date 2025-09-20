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
              onPress={() => {
                setCapturedPhoto(null);
              }}
            >
              <Image source={returnIcon} style={{ height: 80, width: 80 }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log('✅ Confirmed')}>
              <Image source={tickIcon} style={{ height: 80, width: 80 }} />
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
    // backgroundColor: '#00000088',
    paddingTop: 20,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
});
