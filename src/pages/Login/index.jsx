import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import Modal from '../../components/Modal';
import { Portal, Provider } from 'react-native-paper';
import Grid from '../../components/Grid';
import { useSession } from '../../Services/ctx';
import { redefinirSenha } from '../../Services/userSettings';
import Snackbar from '../../components/Snackbar';

export default function Login() {
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false);
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [helpData, setHelpData] = useState({
    email: null,
    password: null,
  });

  const handleLogin = async () => {
    if (email.length > 0 && password.length > 0) {
      setLoading(true);
      try {
        await signIn(email, password);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Erro ao tentar logar', error);
        if (error.message.includes('auth/invalid-credential')) {
          showSnackbar('Dados de usuário inválidos');
        } else {
          showSnackbar('Erro desconhecido');
        }
      }
      setLoading(false);
    } else {
      showSnackbar('Preencha todos os campos');
      verifyFields(email, 'email');
      verifyFields(password, 'password');
    }
  };

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

  const verifyFields = (text, name) => {
    setHelpData((v) => ({
      ...v,
      [name]: text.length === 0 ? 'Campo obrigatório' : null,
    }));
  };

  const showSnackbar = (msg) => {
    setMessage(msg);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Provider>
        <Grid style={styles.headerContainer}>
          <Grid style={styles.header}>
            <Text style={styles.titulo}>Bem-vindo de volta!</Text>
            <Text style={styles.subTitulo}>Entre com seu e-mail e senha.</Text>
          </Grid>
        </Grid>

        <Grid style={styles.inputContainer}>
          <Input
            label="E-mail"
            value={email}
            keyboardType="email-address"
            style={styles.input}
            onChangeText={(text) => {
              setEmail(text);
              verifyFields(text, 'email');
            }}
            helpText={helpData.email}
            error={helpData.email !== null}
          />
          <Input
            label="Senha"
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              verifyFields(text, 'password');
            }}
            helpText={helpData.password}
            error={helpData.password !== null}
          />
        </Grid>

        <Grid style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.navigate('Cadastro')}
          >
            Criar uma conta
          </Button>
        </Grid>
        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <Portal>
          <Modal visible={openModal} onDismiss={() => setOpenModal(false)}>
            <Grid style={styles.modalContent}>
              <Text style={styles.modalText}>
                Digite seu e-mail que enviaremos uma mensagem de recuperação de
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
    marginBottom: 30,
    backgroundColor: 'rgb(140, 51, 179)',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingLeft: 15,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e5e5e5',
  },
  subTitulo: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 10,
    padding: 20,
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
    marginBottom: 15,
  },
  link: {
    marginTop: 20,
    color: '#6200ee',
    textAlign: 'center',
  },
  modalContent: {
    padding: 10,
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
});
