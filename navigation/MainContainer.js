import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

const MainContainer = () => {
  const [user, setUser] = useState();
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);

      if (initialising) {
        setInitialising(false);
      }
    });

    return unsubscribe;
  }, []);

  if (initialising) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default MainContainer;
