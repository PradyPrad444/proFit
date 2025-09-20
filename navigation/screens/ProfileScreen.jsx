import * as React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ backgroundColor: '#171412' }}>
      <View
        style={{ backgroundColor: '#171412', width: '100%', height: '100%' }}
      >
        <Text
          onPress={() => navigation.navigate('Profile')}
          style={{ color: 'white' }}
        >
          This is the Profile Screen!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
