import * as React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import FIREBASE_AUTH from '../../FirebaseConfig';

const SignUpEmailScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState();

  const auth = FIREBASE_AUTH;
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.credentialContainer}>
            <Text style={styles.enterEmailText}>
              Create account using your Email Address
            </Text>

            <TextInput
              style={styles.emailTextInput}
              placeholder="enter here"
              placeholderTextColor="gray"
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.bottomContainer}>
            <Text style={{ color: 'white', marginBottom: 20 }}>
              By clicking 'Continue', you agree to our Term of Service
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('SignUpPassScreen', { email })}
            >
              <Text style={styles.logInHeading}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpEmailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },

  credentialContainer: {
    marginTop: 20,
  },

  enterEmailText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },

  emailTextInput: {
    marginTop: 30,
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },

  continueButton: {
    marginBottom: 20,
    backgroundColor: '#2E2A26',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  logInHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
