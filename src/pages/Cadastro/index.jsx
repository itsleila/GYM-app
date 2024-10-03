import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Grid from '../../components/Grid';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '../../Storage/ctx';

export default function Cadastro() {
  const { signUp } = useSession();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [helpData, setHelpData] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });

  const handleCadastro = async () => {
    if (email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
      if (password !== confirmPassword) {
        setMessage('As senhas não coincidem');
        return;
      }

      setLoading(true);
      try {
        await signUp(email, password);
        navigation.navigate('Inicio');
      } catch (error) {
        console.error('Erro ao tentar criar conta', error);
        if (error.message.includes('auth/email-already-in-use')) {
          setMessage('Este e-mail já está em uso');
        } else if (error.message.includes('auth/weak-password')) {
          setMessage('A senha é muito fraca');
        } else {
          setMessage('Erro desconhecido');
        }
      }
      setLoading(false);
    } else {
      setMessage('Preencha todos os campos');
      verifyFields(email, 'email');
      verifyFields(password, 'password');
      verifyFields(confirmPassword, 'confirmPassword');
    }
  };

  const verifyFields = (text, name) => {
    setHelpData((v) => ({
      ...v,
      [name]: text.length === 0 ? 'Campo obrigatório' : null,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Grid style={styles.headerContainer}>
        <Grid style={styles.header}>
          <Text style={styles.titulo}>Seja bem-vindo!</Text>
          <Text style={styles.subTitulo}>
            Crie uma conta, cadastre-se com um e-mail e senha
          </Text>
        </Grid>
      </Grid>

      <Grid style={styles.inputContainer}>
        <Input
          label="E-mail"
          keyboardType="email-address"
          style={styles.input}
          value={email}
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
        <Input
          label="Confirme a senha"
          style={styles.input}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            verifyFields(text, 'confirmPassword');
          }}
          helpText={helpData.confirmPassword}
          error={helpData.confirmPassword !== null}
        />
      </Grid>

      {message && <Text style={styles.errorText}>{message}</Text>}

      <Grid style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Cadastrar'}
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem uma conta?</Text>
        </TouchableOpacity>
      </Grid>
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
  },
  link: {
    marginTop: 20,
    color: '#6200ee',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
