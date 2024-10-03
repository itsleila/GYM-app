import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import Grid from '../../components/Grid';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { atualizarTreino, inserirTreino, obterTreino } from './treinoSettings';
import SegmentedButtons from '../../components/SegmentedButtons';
import img from '../../../assets/imgs/Logo.png';
import YoutubeIframe from 'react-native-youtube-iframe';

export default function Form() {
  const [openModal, setOpenModal] = useState(false);
  const route = useRoute();
  const { id } = route.params || {};
  const navigation = useNavigation();
  const [data, setData] = useState({
    id: null,
    titulo: '',
    categorias: '',
    descricao: '',
    midia: null,
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      obterTreino(id).then((treino) => {
        setData(treino);
      });
    }
  }, [id]);

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const getYouTubeID = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSaveMedia = () => {
    const videoId = getYouTubeID(videoUrl);
    if (videoId) {
      setData((prevState) => ({
        ...prevState,
        midia: `https://www.youtube.com/watch?v=${videoId}`,
      }));
    }
    setOpenModal(false);
  };

  const handleCadastrar = async () => {
    try {
      if (data.id) {
        await atualizarTreino(
          data.id,
          data.titulo,
          data.categorias,
          data.descricao,
          data.midia,
        );
      } else {
        await inserirTreino(
          data.titulo,
          data.categorias,
          data.descricao,
          data.midia,
        );
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
    }
  };

  const resetForm = () => {
    setData({
      id: null,
      titulo: '',
      categorias: '',
      descricao: '',
      midia: null,
    });
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

  const renderMedia = () => {
    if (data.midia && data.midia.includes('youtube')) {
      return (
        <View style={styles.videoContainer}>
          <YoutubeIframe
            height={250}
            width={'100%'}
            play={playing}
            videoId={data.midia.split('v=')[1]}
            onChangeState={onStateChange}
            style={styles.video}
          />
          <Button title={playing ? 'Pause' : 'Play'} onPress={togglePlaying} />
        </View>
      );
    }
    return (
      <View style={styles.noImageContainer}>
        <Image
          source={img}
          style={{ ...styles.placeholderImage, ...styles.noImageOpacity }}
        />
        <Text style={styles.noImageText}>Adicione uma mídia ao item</Text>
      </View>
    );
  };

  return (
    <Grid>
      <ScrollView contentContainerStyle={styles.container}>
        <Grid style={styles.imageContainer}>{renderMedia()}</Grid>
        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <Text style={styles.addMediaText}>
            {data.midia ? 'Editar mídia' : 'Adcionar mídia'}
          </Text>
        </TouchableOpacity>
        <Portal>
          <Modal visible={openModal} onDismiss={() => setOpenModal(false)}>
            <Grid style={styles.modalContent}>
              <Input
                style={styles.modalInput}
                value={videoUrl}
                onChangeText={setVideoUrl}
                placeholder="Cole o link de um vídeo do YouTube"
              />
              <Button onPress={handleSaveMedia}>Salvar Mídia</Button>
            </Grid>
          </Modal>
        </Portal>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          <SegmentedButtons
            value={data.categorias}
            onValueChange={(text) =>
              setData((prevState) => ({ ...prevState, categorias: text }))
            }
            buttons={Object.keys(categoriaIcones).map((key) => ({
              value: key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
              icon: categoriaIcones[key],
            }))}
            multiselect={false}
          />
        </ScrollView>
        <Grid style={{ ...styles.inputGrid, ...styles.width }}>
          <Input
            style={{ ...styles.input }}
            placeholder="Nome do exercício"
            value={data.titulo}
            onChangeText={(text) =>
              setData((prevState) => ({ ...prevState, titulo: text }))
            }
            placeholderTextColor="#888"
          />
        </Grid>
        <Grid style={{ ...styles.inputGrid, ...styles.width }}>
          <Input
            style={{ ...styles.input }}
            placeholder="Descrição"
            multiline
            numberOfLines={6}
            value={data.descricao}
            onChangeText={(text) =>
              setData((prevState) => ({ ...prevState, descricao: text }))
            }
            placeholderTextColor="#888"
          />
        </Grid>
        <Grid style={styles.padding}>
          <Button mode="contained" onPress={handleCadastrar}>
            {data.id ? 'Editar' : 'Cadastrar'}
          </Button>
        </Grid>
        <Button
          mode="contained-tonal"
          onPress={() => navigation.goBack()}
          icon="arrow-left"
          style={{ ...styles.buttonGoback, ...styles.noImageOpacity }}
        >
          Voltar para página anterior
        </Button>
      </ScrollView>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(35, 23, 40, 1)',
  },
  noImageOpacity: {
    opacity: 0.6,
    backgroundColor: 'rgba(35, 23, 40, 0.1)',
  },
  noImageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  placeholderImage: {
    width: 350,
    height: '100%',
    resizeMode: 'contain',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  padding: {
    padding: 20,
  },
  width: {
    width: '100%',
  },
  inputGrid: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgb(255, 255, 255)',
  },
  titleInput: {
    borderWidth: 0,
    borderBottomWidth: 0,
    padding: 10,
    height: 50,
    fontSize: 20,
    color: 'black',
    width: '100%',
  },
  descriptionInput: {
    borderWidth: 0,
    borderBottomWidth: 0,
    padding: 10,
    height: 80,
    fontSize: 16,
    color: 'black',
    width: '100%',
  },
  noImageText: {
    color: 'rgba(105, 89, 109, 0.5)',
    bottom: 25,
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    zIndex: 1,
  },
  categoryScroll: {
    marginVertical: 20,
  },
  selectedCategoriesText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
  addMediaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(140, 51, 179)',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalContent: {
    borderRadius: 10,
    padding: 30,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f3e8ff',
  },
  modalInput: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    width: '100%',
  },
  buttonGoback: {
    width: '90%',
    padding: 10,
    marginTop: 90,
    alignSelf: 'center',
  },
});
