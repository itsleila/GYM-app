import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import Grid from '../../components/Grid';
import Fab from '../../components/Fab';
import Avatar from '../../components/Avatar';
import { TextInputMask } from 'react-native-masked-text';
import React, { useEffect, useRef, useState } from 'react';
import IconButton from '../../components/IconButton';
import Button from '../../components/Button';
import Camera from '../../components/Camera';
import Snackbar from '../../components/Snackbar';
import Input from '../../components/Input';
import { Portal, Provider, useTheme } from 'react-native-paper';
import Modal from '../../components/Modal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSession } from '../../Services/ctx';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../../Services/firebase.js';
import { atualizarUsuario } from '../../Services/userSettings.js';
import * as ImagePicker from 'expo-image-picker';
import uploadImageStorage from '../../Services/storage.js';

export default function Perfil() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const showSnackbar = (msg) => {
    setMessage(msg);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 2000);
  };

  const cameraRef = useRef(null);
  const [data, setData] = useState({
    image: null,
  });

  ////////////////
  const onCapture = (photo) => {
    setData((value) => ({ ...value, image: photo.uri }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    setLoading(true);
    if (!result.canceled) {
      setData((value) => ({
        ...value,
        image: result.assets[0].uri,
      }));
    }

    setLoading(false);
  };

  ///////

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email);
        setNome(currentUser.displayName);

        const db = getDatabase(firebaseApp);
        const usuarioRef = ref(db, `usuarios/${currentUser.uid}`);
        const snapshot = await get(usuarioRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setTelefone(userData.phoneNumber || '');
          setDataNascimento(userData.birtdayDate || '');
          setData((prevData) => ({
            ...prevData,
            image: userData.photoURL || '',
          }));
        }
      }
    };

    fetchUserData();
  }, [auth]);

  const handleUpdate = async () => {
    if (!email || !nome) {
      showSnackbar('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    let imageUrl = data.image;

    if (data.image?.length > 0) {
      try {
        const img = data.image.split('/');
        if (user) {
          imageUrl = await uploadImageStorage(
            data.image,
            user.uid,
            img.length - 1,
          );
        } else {
          showSnackbar('Usuário não encontrado.');
          return;
        }
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        showSnackbar('Erro ao fazer upload da imagem. Tente novamente.');
        return;
      }
    }
    try {
      setLoading(true);
      await atualizarUsuario(email, nome, telefone, dataNascimento, imageUrl);
      showSnackbar('Dados atualizados com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      showSnackbar('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  //////

  const handleRedefirSenha = async () => {
    if (resetEmail.length > 0) {
      setLoading(true);
      try {
        await redefinirSenha(email);
        showSnackbar('Email de redefinição enviado com sucesso');
      } catch (error) {
        console.error('Erro ao tentar enviar email:', error);
        if (error.code === 'auth/user-not-found') {
          showSnackbar('Não existe usuário com esse email');
        } else if (error.code === 'auth/invalid-email') {
          showSnackbar('Email inválido');
        } else {
          showSnackbar('Erro desconhecido');
        }
      }
      setLoading(false);
    } else {
      showSnackbar('Preencha o email');
      verifyFields(email, 'email');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Provider>
        <Grid style={styles.headerContainer}>
          <Grid style={styles.header}>
            {data.image ? (
              <Avatar size={145} source={{ uri: data.image }} />
            ) : (
              <Avatar size={130} />
            )}
            <Fab
              onPress={pickImage}
              icon="image"
              size="small"
              style={{
                ...styles.fab,
                ...styles.left,
              }}
            />
            <Fab
              onPress={() => setCameraVisible(true)}
              icon="camera"
              size="small"
              style={{
                ...styles.fab,
                ...styles.right,
              }}
            />
          </Grid>
          <Grid>
            <Text style={styles.titulo}>{nome ? nome : email}</Text>
          </Grid>
        </Grid>
        <Grid style={styles.dadosContainer}>
          <Grid style={styles.subTituloGrid}>
            <IconButton icon="account" iconColor="#000" />
            <Text style={styles.subTitulo}>Dados pessoais</Text>
          </Grid>
          <Input
            label="Nome"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          <Input
            label="E-mail"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Telefone"
            mask="+[00] [000] [000] [000]"
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
          />
          <Input
            label="Data de Nascimento"
            value={dataNascimento}
            render={(props) => (
              <TextInputMask
                {...props}
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY',
                }}
                value={dataNascimento}
                onChangeText={(text) => setDataNascimento(text)}
              />
            )}
            style={styles.input}
            placeholder="DD/MM/YYYY"
          />
          <Button
            mode="text"
            style={styles.button}
            icon="lock"
            onPress={() => setOpenModal(true)}
          >
            Alterar senha
          </Button>
        </Grid>
        <Grid style={styles.buttonContainer}>
          <Button
            mode="contained-tonal"
            style={styles.button}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Salvar Alterações'}
          </Button>
        </Grid>
        <Portal>
          <Modal visible={openModal} onDismiss={() => setOpenModal(false)}>
            <Grid style={styles.modalContent}>
              <Text style={styles.modalText}>
                Digite seu e-mail que enviaremos uma mensagem para mudança de
                senha.
              </Text>
              <Input
                label="E-mail"
                keyboardType="email-address"
                style={styles.modalInput}
                value={resetEmail}
                onChangeText={setResetEmail}
              />
              <Button
                mode="contained"
                style={styles.modalButton}
                onPress={handleRedefirSenha}
              >
                {loading ? 'Enviando...' : 'Enviar email'}
              </Button>
            </Grid>
          </Modal>
        </Portal>
      </Provider>
      {snackbarVisible && (
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          style={{ marginBottom: 70, fontSize: 16 }}
        >
          {message}
        </Snackbar>
      )}
      {cameraVisible ? (
        <Camera
          onCapture={onCapture}
          setCameraVisible={setCameraVisible}
          ref={cameraRef}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    height: '25%',
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    marginBottom: 10,
    paddingLeft: 15,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 15,
  },
  subTitulo: {
    fontSize: 14,
    marginTop: 5,
  },
  subTituloGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dadosContainer: {
    margin: 15,
    borderRadius: 5,
    padding: 20,
    backgroundColor: '#f3e8ff',
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
  },
  modalContent: {
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 20,
    width: '100%',
  },
  modalButton: {
    width: '100%',
    padding: 10,
  },
  fab: {
    bottom: 0,
    position: 'absolute',
    borderRadius: 200,
  },
  right: {
    right: 0,
  },
  left: {
    left: 10,
  },
});
