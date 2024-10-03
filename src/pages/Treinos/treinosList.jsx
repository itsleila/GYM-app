import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useTreinos } from './treinoCtx';
import Button from '../../components/Button';
import { listarTreinos } from './treinoSettings';
import Grid from '../../components/Grid';
import Card from '../../components/Card';
import { TouchableOpacity } from 'react-native';
import IconButton from '../../components/IconButton';

export default function TreinosList({ route, navigation }) {
  const { dia } = route.params;
  const [selectedTreinos, setSelectedTreinos] = useState([]);
  const { addTreinoDia } = useTreinos();
  const [listaTreinos, setListaTreinos] = useState([]);

  useEffect(() => {
    fetchTreinos();
  }, []);

  async function fetchTreinos() {
    listarTreinos(setListaTreinos);
  }

  const toggleWorkout = (treino) => {
    setSelectedTreinos((prev) =>
      prev.includes(treino)
        ? prev.filter((item) => item !== treino)
        : [...prev, treino],
    );
  };

  const handleAdcionarTreino = () => {
    selectedTreinos.forEach((treino) => addTreinoDia(dia, treino));
    navigation.goBack();
  };

  const categoriaIcones = {
    cardio: 'bike',
    superiores: 'arm-flex',
    inferiores: 'weight-lifter',
    gluteo: 'kettlebell',
    musculacao: 'dumbbell',
    abdomem: 'human',
    flexibilidade: 'yoga',
  };

  return (
    <Grid style={styles.container}>
      <Text style={styles.text}>Selecione os treinos para {dia}</Text>
      <FlatList
        data={listaTreinos}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={() => toggleWorkout(item)}>
              <Card
                title={item.titulo}
                subtitle={item.categorias}
                style={{
                  backgroundColor: selectedTreinos.includes(item)
                    ? 'rgb(140, 51, 179)'
                    : 'rgb(241, 220, 244)',
                  marginVertical: 10,
                  borderRadius: 10,
                }}
                contentStyle={{ alignItems: 'center' }}
                left={(props) => (
                  <IconButton
                    {...props}
                    style={styles.iconButtonCat}
                    icon={categoriaIcones[item.categorias]}
                    iconColor={'rgb(235, 178, 255)'}
                    size={25}
                  />
                )}
              />
            </TouchableOpacity>
            <Button
              onPress={handleAdcionarTreino}
              mode="outlined"
              style={styles.button}
            >
              Adicionar Treinos
            </Button>
          </>
        )}
      />
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    padding: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginBottom: 10,
  },
  iconButtonCat: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgb(235, 178, 255)',
    borderStyle: 'solid',
    marginRight: 10,
  },
  button: {
    width: '60%',
    alignSelf: 'center',
    marginTop: 40,
    padding: 5,
  },
});
