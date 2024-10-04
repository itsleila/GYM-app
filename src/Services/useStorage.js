import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

async function getStorageItem(key) {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
      return null;
    }
  } else {
    return SecureStore.getItemAsync(key);
  }
}

export async function setStorageItemAsync(key, value) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key) {
  const [state, setState] = useState(null);

  useEffect(() => {
    const loadState = async () => {
      const storedValue = await getStorageItem(key);
      setState(storedValue);
    };
    loadState();
  }, [key]);

  const setStorageState = async (value) => {
    await setStorageItemAsync(key, value);
    setState(value);
  };

  return [state, setStorageState];
}
