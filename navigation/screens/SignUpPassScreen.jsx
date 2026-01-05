import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

const SignUpPassScreen = ({ route }) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    if (!password) return;

    try {
      setLoading(true);
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      Alert.alert('Sign Up failed', error?.message ?? 'Something went wrong');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.credentialContainer}>
            <Text style={styles.enterEmailText}>Create your Password</Text>

            <TextInput
              style={styles.emailTextInput}
              placeholder="enter here"
              placeholderTextColor="gray"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.bottomContainer}>
            <Text style={{ color: 'white', marginBottom: 20 }}>
              By clicking 'Sign Up', you agree to our Terms of Service
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={signUp}
              disabled={loading || !password}
            >
              <Text style={styles.logInHeading}>{'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpPassScreen;

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
