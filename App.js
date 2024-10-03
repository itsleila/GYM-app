import 'react-native-gesture-handler';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { TreinosCtx } from './src/pages/Treinos/treinoCtx.jsx';

import Home from './src/pages/Home/index.jsx';
import Avaliacao from './src/pages/Avaliacao/index';
import Cadastro from './src/pages/Cadastro/index';
import Configuracoes from './src/pages/Configuracoes/index';
import Login from './src/pages/Login/index';
import Perfil from './src/pages/Perfil/index';
import Treinos from './src/pages/Treinos/index';
import Form from './src/pages/Treinos/form.jsx';
import TreinosList from './src/pages/Treinos/treinosList.jsx';

import SegundaFeira from './src/pages/Dias/segunda.jsx';
import TercaFeira from './src/pages/Dias/terca.jsx';
import QuartaFeira from './src/pages/Dias/quarta.jsx';
import QuintaFeira from './src/pages/Dias/quinta.jsx';
import SextaFeira from './src/pages/Dias/sexta.jsx';
import Sabado from './src/pages/Dias/sabado.jsx';
import Domingo from './src/pages/Dias/domingo.jsx';

import Drawer from './src/components/Drawer/index.jsx';
import IconButton from './src/components/IconButton/index.jsx';

import { darkTheme, lightTheme } from './src/constants/Theme.js';
import { useSession, SessionProvider } from './src/Storage/ctx.js';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const screens = [
    {
      name: 'Home',
      component: Home,
      options: {
        title: 'Início',
        drawerIcon: ({ color, size }) => (
          <IconButton
            icon="home"
            size={20}
            iconColor="#fff"
            style={{ marginRight: -25 }}
          />
        ),
      },
    },
    {
      name: 'Treinos',
      component: Treinos,
      options: {
        drawerIcon: ({ color, size }) => (
          <IconButton
            icon="dumbbell"
            size={20}
            iconColor="#fff"
            style={{ marginRight: -25 }}
          />
        ),
      },
    },
    {
      name: 'Avaliação Física',
      component: Avaliacao,
      options: {
        drawerIcon: ({ color, size }) => (
          <IconButton
            icon="heart-pulse"
            size={20}
            iconColor="#fff"
            style={{ marginRight: -25 }}
          />
        ),
      },
    },
    {
      name: 'Configurações',
      component: Configuracoes,
      options: {
        drawerIcon: ({ color, size }) => (
          <IconButton
            icon="cog"
            size={20}
            iconColor="#fff"
            style={{ marginRight: -25 }}
          />
        ),
      },
    },
  ];

  function CustomDrawerScreen() {
    return (
      <Drawer
        screens={screens}
        screenOptions={{
          headerShown: false,
        }}
      />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen
            name="Inicio"
            component={CustomDrawerScreen}
            options={{
              title: 'Início',
            }}
          />
          <Stack.Screen
            name="Perfil"
            component={Perfil}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: 'rgb(140, 51, 179)',
              },
            }}
          />
          <Stack.Screen name="Formulario" component={Form} />
          <Stack.Screen
            name="Segunda-feira"
            component={SegundaFeira}
            options={{
              headerShown: true,
              headerTitle: ' ',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Terça-feira"
            component={TercaFeira}
            options={{
              headerShown: true,
              headerTitle: ' ',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Quarta-feira"
            component={QuartaFeira}
            options={{
              headerShown: true,
              headerTitle: ' ',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Quinta-feira"
            component={QuintaFeira}
            options={{
              headerShown: true,
              headerTitle: ' ',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Sexta-feira"
            component={SextaFeira}
            options={{
              headerShown: true,
              headerTitle: ' ',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Sabado"
            component={Sabado}
            options={{
              headerShown: true,
              headerTitle: ' ',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Domingo"
            component={Domingo}
            options={{
              headerShown: true,
              headerTitle: ' ',
              headerTransparent: true,
            }}
          />
          <Stack.Screen name="SelecionarTreino" component={TreinosList} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  const { theme } = useSession();
  const systemTheme = useColorScheme();

  return (
    <SessionProvider>
      <TreinosCtx>
        <TemaContainer>
          <NavigationContainer
            theme={theme === 'dark' ? darkTheme : lightTheme}
          >
            <AppNavigator />
          </NavigationContainer>
        </TemaContainer>
      </TreinosCtx>
    </SessionProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;

function TemaContainer({ children }) {
  const { theme } = useSession();
  const systemTheme = useColorScheme();
  const themeJson = {
    dark: darkTheme,
    light: lightTheme,
  };

  return (
    <PaperProvider
      theme={
        theme === 'automatico' || theme === null
          ? systemTheme === 'dark'
            ? themeJson['dark']
            : themeJson['light']
          : themeJson[theme]
      }
    >
      {children}
    </PaperProvider>
  );
}
