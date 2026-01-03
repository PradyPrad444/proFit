import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInEmailScreen from './screens/LogInEmailScreen';
import LogInPassScreen from './screens/LogInPassScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={'LogInEmailScreen'}
        component={LogInEmailScreen}
      ></Stack.Screen>

      <Stack.Screen
        name={'LogInPassScreen'}
        component={LogInPassScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
