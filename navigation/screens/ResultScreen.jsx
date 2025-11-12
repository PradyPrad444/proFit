import * as React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import returnIcon from '../../assets/return.png';
import wardrobeIcon from '../../assets/wardrobe.png';

const ResultScreen = ({ route, navigation }) => {
  const { imageUrl, itemId } = route.params; // saving the base64 image data to imageUrl

  // function to add the item into wardrobe
  const addToWardrobe = async () => {
    await fetch('http://192.168.1.212:8000/wardrobe/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId }),
    });
    Alert.alert('Success', 'Item added to the Wardrobe', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Closet');
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#ffffffff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffffff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={{ uri: imageUrl }} // using the image data to render the image from the backend
          style={{ height: 1000, width: 800, paddingBottom: 300 }}
        />

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
          {/* return button TouchableOpacity here */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={returnIcon}
              style={{
                height: 80,
                width: 80,
                opacity: 0.5,
              }}
            />
          </TouchableOpacity>

          {/* confirmed button TouchableOpacity here */}
          <TouchableOpacity onPress={addToWardrobe}>
            {' '}
            {/* DISABLE WHILE UPLOADING */}
            <Image
              source={wardrobeIcon}
              style={{
                height: 80,
                width: 80,
                opacity: 0.5,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResultScreen;
