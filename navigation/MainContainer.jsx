import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import ClosetScreen from './screens/ClosetScreen';
import SearchScreen from './screens/SearchScreen';
import AddScreen from './screens/AddScreen';
import ProfileScreen from './screens/ProfileScreen';
import closetIcon from '../assets/wardrobe.png';
import searchIcon from '../assets/search.png';
import addIcon from '../assets/add.png';
import profileIcon from '../assets/user.png';

const closetName = 'Closet';
const searchName = 'Search';
const addName = 'Add';
const profileName = 'Profile';

const Tab = createBottomTabNavigator();

const MainContainer = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={closetName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === closetName) {
              iconName = closetIcon;
            } else if (rn === searchName) {
              iconName = searchIcon;
            } else if (rn === addName) {
              iconName = addIcon;
            } else if (rn === profileName) {
              iconName = profileIcon;
            }

            return (
              <Image
                source={iconName}
                style={{ tintColor: color, width: size, height: size }}
              />
            );
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#26211C',
            paddingTop: 5,
            outlineColor: '#171412',
          },
        })}
      >
        <Tab.Screen name={closetName} component={ClosetScreen} />
        <Tab.Screen name={searchName} component={SearchScreen} />
        <Tab.Screen name={addName} component={AddScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;
