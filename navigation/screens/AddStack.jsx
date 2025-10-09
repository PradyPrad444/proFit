import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScreen from './AddScreen';
import ResultScreen from './ResultScreen';

const Stack = createNativeStackNavigator();

const AddStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddMain" component={AddScreen}></Stack.Screen>
      <Stack.Screen name="ResultScreen" component={ResultScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AddStack;
