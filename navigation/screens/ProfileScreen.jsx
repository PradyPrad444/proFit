import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const logOut = async () => {
  const response = await auth().signOut();
};
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

        <TouchableOpacity style={styles.continueButton} onPress={logOut}>
          <Text style={styles.logInHeading}>{'LogOut'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'black' },
  keyboardView: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  credentialContainer: { marginTop: 20 },
  enterEmailText: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  emailTextInput: {
    marginTop: 30,
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  bottomContainer: {},
  continueButton: {
    marginBottom: 20,
    backgroundColor: '#2E2A26',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logInHeading: { fontSize: 18, fontWeight: '600', color: 'white' },
});
