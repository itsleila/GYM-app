import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from '../../components/Snackbar';
import { Provider } from 'react-native-paper';

const TreinosContext = createContext();

export const TreinosCtx = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [diaSemana, setDiaSemana] = useState({
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sabado: [],
    domingo: [],
  });
  useEffect(() => {
    const loadTreinos = async () => {
      try {
        const storedTreinos = await AsyncStorage.getItem('@treinos_diaSemana');
        if (storedTreinos) {
          setDiaSemana(JSON.parse(storedTreinos));
        }
      } catch (e) {
        console.error('Erro ao carregar treinos do armazenamento:', e);
      }
    };

    loadTreinos();
  }, []);

  const showSnackbar = (msg) => {
    setMessage(msg);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 2000);
  };

  const addTreinoDia = (dia, treino) => {
    setDiaSemana((prev) => {
      const treinoExiste = prev[dia].some((t) => t.key === treino.key);

      if (treinoExiste) {
        showSnackbar('Treino já adicionado para esse dia.');
        return prev;
      }

      const updatedDiaSemana = {
        ...prev,
        [dia]: [...prev[dia], treino],
      };

      AsyncStorage.setItem(
        '@treinos_diaSemana',
        JSON.stringify(updatedDiaSemana),
      ).catch((e) =>
        console.error('Erro ao salvar treinos no armazenamento:', e),
      );

      return updatedDiaSemana;
    });
  };

  const removeTreinoDia = (dia, treinoKey) => {
    setDiaSemana((prev) => {
      const treinosDia = prev[dia] || [];

      const updatedTreinos = treinosDia.filter(
        (treino) => treino.key !== treinoKey,
      );

      const updatedDiaSemana = {
        ...prev,
        [dia]: updatedTreinos,
      };

      AsyncStorage.setItem(
        '@treinos_diaSemana',
        JSON.stringify(updatedDiaSemana),
      ).catch((e) => {
        console.error('Erro ao salvar treinos no armazenamento:', e);
      });

      return updatedDiaSemana;
    });
  };

  return (
    <>
      <Provider>
        <TreinosContext.Provider
          value={{ diaSemana, addTreinoDia, removeTreinoDia }}
        >
          {children}
        </TreinosContext.Provider>
        {snackbarVisible && (
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            style={{ marginBottom: 70, fontSize: 16 }}
          >
            {message}
          </Snackbar>
        )}
      </Provider>
    </>
  );
};

export const useTreinos = () => useContext(TreinosContext);
