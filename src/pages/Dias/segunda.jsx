import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Grid from '../../components/Grid';
import img from '../../../assets/imgs/workouts.png';
import Button from '../../components/Button';
import { useTreinos } from '../Treinos/treinoCtx';
import IconButton from '../../components/IconButton';
import YoutubeIframe from 'react-native-youtube-iframe';
import Dialog from '../../components/Dialog';

export default function SegundaFeira({ navigation }) {
  const { diaSemana } = useTreinos();
  const { removeTreinoDia } = useTreinos();
  const treinos = diaSemana.segunda || [];
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const categoriaIcones = {
    cardio: 'bike',
    superiores: 'arm-flex',
    inferiores: 'weight-lifter',
    gluteo: 'kettlebell',
    musculacao: 'dumbbell',
    abdomem: 'human',
    flexibilidade: 'yoga',
  };

  const handleImagePress = (id) => {
    if (id) {
      setVideoId(id);
      setModalVisible(true);
    }
  };

  const handleDelete = () => {
    if (selectedTreino) {
      removeTreinoDia('segunda', selectedTreino.key);
      setDialogVisible(false);
      setSelectedTreino(null);
    }
  };

  const renderLista = ({ item }) => {
    const isYoutube = item.midia && item.midia.includes('youtube');
    const videoId = isYoutube ? item.midia.split('v=')[1]?.split('&')[0] : null;

    return (
      <Grid>
        <Text style={styles.containerText}>Treinos de Segunda-Feira</Text>
        <Grid key={item.key} style={styles.cardContainer}>
          <TouchableOpacity onPress={() => handleImagePress(videoId)}>
            <Image
              source={
                isYoutube
                  ? { uri: `https://img.youtube.com/vi/${videoId}/0.jpg` }
                  : item.midia && { uri: item.midia }
              }
              style={styles.leftImage}
              resizeMode="cover"
            />
            <IconButton
              icon="play"
              iconColor={'#f0f0f0'}
              size={45}
              style={styles.playButton}
            />
          </TouchableOpacity>

          <Grid style={styles.textContainer}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Grid style={styles.subtitleContainer}>
              <IconButton
                style={styles.iconButtonCat}
                icon={categoriaIcones[item.categorias]}
                iconColor={'rgb(140, 51, 179)'}
                size={13}
              />
              <Text style={styles.cardSubtitle}>
                {item.categorias || 'Categoria não especificada'}
              </Text>
            </Grid>
          </Grid>

          <IconButton
            icon="close"
            size={23}
            onPress={() => {
              setSelectedTreino(item);
              setDialogVisible(true);
            }}
            style={styles.iconButton}
          />
        </Grid>
      </Grid>
    );
  };

  const listVazia = () => (
    <Grid style={styles.listaVazia}>
      <Image source={img} style={styles.image} resizeMode="cover" />
      <Text style={styles.text}>Nenhum treino cadastrado para este dia.</Text>
    </Grid>
  );

  return (
    <FlatList
      data={treinos}
      keyExtractor={(item) => item.key}
      renderItem={renderLista}
      contentContainerStyle={styles.container}
      ListEmptyComponent={listVazia}
      ListFooterComponent={() => (
        <>
          <Grid style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() =>
                navigation.navigate('SelecionarTreino', { dia: 'segunda' })
              }
            >
              Adicionar treino
            </Button>
          </Grid>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Grid style={styles.modalContent}>
              <YoutubeIframe
                height={300}
                width={'100%'}
                play={true}
                videoId={videoId}
              />
              <Button onPress={() => setModalVisible(false)}>Fechar</Button>
            </Grid>
          </Modal>
          <Dialog
            text={'Deseja realmente excluir este treino?'}
            visible={dialogVisible}
            setVisibility={setDialogVisible}
            onDismiss={() => setDialogVisible(false)}
            actions={[
              {
                text: 'Cancelar',
                onPress: () => {
                  setDialogVisible(false);
                },
              },
              {
                text: 'Excluir',
                onPress: () => {
                  handleDelete();
                  setDialogVisible(false);
                },
              },
            ]}
          />
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 120,
  },
  containerText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 15,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'rgb(246, 235, 249)',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: -20,
    left: -20,
    zIndex: 1,
  },
  playButton: {
    position: 'absolute',
    bottom: 5,
    right: 20,
    zIndex: 1,
  },
  leftImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
  },
  iconButton: {
    marginLeft: 10,
  },
  iconButtonCat: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgb(140, 51, 179)',
    borderStyle: 'solid',
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#777',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    marginBottom: 15,
  },
});
