import * as React from 'react';
import { View, StatusBar } from 'react-native';
import MainContainer from './navigation/MainContainer';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <MainContainer />
    </View>
  );
}
