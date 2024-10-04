import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Text, TouchableOpacity } from 'react-native';
import Avatar from '../Avatar';
import Grid from '../Grid';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../IconButton';
import Button from '../Button';
import { useSession } from '../../Services/ctx.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';
import { firebaseApp } from '../../Services/firebase.js';
import defaultImage from '../../../assets/imgs/Garrafa.png';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', image: '' });
  const auth = getAuth();
  const { signOut, session } = useSession();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getDatabase(firebaseApp);
        const usuarioRef = ref(db, `usuarios/${user.uid}`);
        const snapshot = await get(usuarioRef);

        let photoURL;
        if (snapshot.exists()) {
          const userData = snapshot.val();
          photoURL = userData.photoURL;
        }

        setUserInfo({
          name: user.displayName || user.email,
          email: user.email,
          image: photoURL,
        });
      } else {
        setUserInfo({ name: '', email: '', image: '' });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.navigate('Login');
  };

  return (
    <Grid style={{ flex: 1, position: 'relative' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Perfil');
        }}
      >
        <Grid
          style={{
            width: '100%',
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 75,
            marginBottom: 20,
            backgroundColor: 'rgb(140, 51, 179)',
            position: 'relative',
          }}
        >
          {userInfo.image ? (
            <Avatar size={120} source={{ uri: userInfo.image }} />
          ) : (
            <Avatar size={120} style={{ backgroundColor: 'rgb(50, 0, 71)' }} />
          )}
          <IconButton
            icon="account-edit"
            size={35}
            iconColor="#fff"
            style={{
              position: 'absolute',
              right: 60,
              top: 48,
            }}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              paddingBottom: 15,
              paddingTop: 15,
            }}
          >
            {userInfo.name ? userInfo.name : userInfo.email}
          </Text>
        </Grid>
      </TouchableOpacity>
      <Button
        icon="logout"
        textColor="#fff"
        style={{
          position: 'absolute',
          left: 50,
          bottom: 20,
          fontSize: 16,
          fontWeight: 'bold',
          padding: 20,
        }}
        onPress={handleSignOut}
      >
        SAIR
      </Button>
      <Grid style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </Grid>
    </Grid>
  );
}

export default function DrawerMenu({ screens }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(140, 51, 179)',
        },
        drawerStyle: {
          backgroundColor: 'rgb(140, 51, 179)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: true,
        drawerActiveTintColor: 'rgb(50, 0, 71)',
        drawerInactiveTintColor: 'rgb(248, 216, 255)',
      }}
    >
      {screens.map(({ name, component, options }) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Drawer.Navigator>
  );
}

{
  /*backgroundColor: theme.colors.primary 
  activeTintColor: theme.colors.onPrimaryContainer,
  inactiveTintColor: theme.colors.primaryContainer,*/
}
