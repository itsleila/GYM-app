import React, { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import Snackbar from '../components/Snackbar';

export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkNetwork = async () => {
      const status = await Network.getNetworkStateAsync();
      setIsConnected(status.isConnected);
    };
    const intervalo = setInterval(checkNetwork, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      alert('Sem conexão com a internet');
    }
  }, [isConnected]);

  return null;
}
