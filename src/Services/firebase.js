import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

{
  /* EXPO_PUBLIC_API_KEY= 'AIzaSyDquN0pwI_IlcdEoWLoAzPp3N54RXYkZHs'
EXPO_PUBLIC_AUTH_DOMAIN= 'gym-app-90a25.firebaseapp.com'
EXPO_PUBLIC_PROJECT_ID= 'gym-app-90a25'
EXPO_PUBLIC_DATABASE_URL= "https://gym-app-90a25-default-rtdb.firebaseio.com/"
EXPO_PUBLIC_STORAGE_BUCKET= 'gym-app-90a25.appspot.com'
EXPO_PUBLIC_MESSAGING_SENDER_ID= '324758661488'
EXPO_PUBLIC_APP_ID= '1:324758661488:web:7602b166b680b6008907b5'
EXPO_PUBLIC_DATABASE_SQLITE= 'gym-app'*/
}

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

export default firebaseApp;
export { database };
export { storage };
