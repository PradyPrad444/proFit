// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from '@react-native-firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBxuiG3cqfRKRHB2_L0DCfq16OEJCBUdaI',
  authDomain: 'profit-ac435.firebaseapp.com',
  projectId: 'profit-ac435',
  storageBucket: 'profit-ac435.firebasestorage.app',
  messagingSenderId: '1059768234750',
  appId: '1:1059768234750:web:a169b2cbf2f484a961abaf',
  measurementId: 'G-XEJ4BNW4MV',
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
