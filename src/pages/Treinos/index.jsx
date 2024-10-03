import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import Grid from '../../components/Grid';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { excluirTreino, listarTreinos } from './treinoSettings';
import Dialog from '../../components/Dialog';
import IconButton from '../../components/IconButton';
import YoutubeIframe from 'react-native-youtube-iframe';

export default function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTreinos();
  }, []);

  async function fetchTreinos() {
    listarTreinos(setTreinos);
  }

  const handleDelete = async () => {
    if (selectedTreino) {
      await excluirTreino(selectedTreino.key);
      fetchTreinos();
    }
  };

  const handleEdit = async (treino) => {
    if (treino) {
      setSelectedTreino(treino);
      navigation.navigate('Formulario', { id: treino.key });
    }
  };

  const handleImagePress = (videoId) => {
    setVideoId(videoId);
    setModalVisible(true);
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
    <ScrollView>
      <Grid style={styles.header}>
        <Text style={styles.headerText}>Todos os seus Treinos</Text>
      </Grid>
      {treinos.map((treino) => {
        const isYoutube = treino.midia && treino.midia.includes('youtube');
        const videoId = isYoutube
          ? treino.midia.split('v=')[1]?.split('&')[0]
          : null;

        return (
          <Grid key={treino.key} style={styles.cardContainer}>
            <IconButton
              icon="close-circle"
              size={20}
              onPress={() => {
                setSelectedTreino(treino);
                setDialogVisible(true);
              }}
              style={styles.deleteButton}
            />
            <TouchableOpacity onPress={() => handleImagePress(videoId)}>
              <Image
                source={
                  isYoutube
                    ? { uri: `https://img.youtube.com/vi/${videoId}/0.jpg` }
                    : treino.midia && { uri: treino.midia }
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
              <Text style={styles.cardTitle}>{treino.titulo}</Text>
              <Grid style={styles.subtitleContainer}>
                <IconButton
                  style={{ ...styles.iconButtonCat }}
                  icon={categoriaIcones[treino.categorias]}
                  iconColor={'rgb(140, 51, 179)'}
                  size={13}
                />
                <Text style={styles.cardSubtitle}>
                  {treino.categorias
                    ? treino.categorias
                    : 'Categoria não especificada'}
                </Text>
              </Grid>
            </Grid>

            <IconButton
              icon="information-outline"
              size={23}
              onPress={() => handleEdit(treino)}
              style={styles.iconButton}
            />
          </Grid>
        );
      })}

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

      <Grid style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Formulario')}
        >
          Criar um novo treino
        </Button>
      </Grid>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    marginTop: 50,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 20,
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
