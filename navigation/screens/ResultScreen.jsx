import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResultScreen = ({ route }) => {
  const { imageUrl } = route.params;
  return (
    <SafeAreaView style={{ backgroundColor: '#171412', flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#ffffffff' }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ flex: 1, resizeMode: 'contain' }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResultScreen;
