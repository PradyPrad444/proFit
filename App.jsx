import * as React from 'react';
import { View, StatusBar } from 'react-native';
import MainContainer from './navigation/MainContainer';
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  return (
    <MenuProvider>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <MainContainer />
      </View>
    </MenuProvider>
  );
}
