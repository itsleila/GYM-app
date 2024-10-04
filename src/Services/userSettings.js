import { auth } from './auth.js';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
} from 'firebase/auth';
import firebaseApp from './firebase.js';
import { getDatabase, ref, update as updateDb, set } from 'firebase/database';

/////
const deslogar = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao deslogar usuário --auth:', error);
    throw error;
  }
};

///////
async function atualizarUsuario(
  email,
  nome,
  phoneNumber,
  birtdayDate,
  photoURL,
) {
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase(firebaseApp);
    const usuarioRef = ref(db, `usuarios/${user.uid}`);
    await updateProfile(user, { displayName: nome });
    if (user.email !== email) {
      await updateEmail(user, email);
    }
    await updateDb(usuarioRef, {
      nome: nome,
      email: email,
      phoneNumber: phoneNumber,
      birtdayDate: birtdayDate,
      photoURL: photoURL,
    });
  }
}

//////
const redefinirSenha = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    throw error;
  }
};

/////
const login = async (email, password, setSession) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const user = response.user.toJSON();
    console.log('User data:', user);

    setSession(user.stsTokenManager.accessToken);
    const db = getDatabase(firebaseApp);
    const usuarioRef = ref(db, `usuarios/${user.uid}`);

    await updateDb(usuarioRef, {
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName || null,
      uid: user.uid,
      photoURL: user.photoURL || null,
      phoneNumber: user.phoneNumber || null,
      createdAt: user.createdAt || null,
    });
  } catch (error) {
    console.error('Erro ao logar:', error);
    throw error;
  }
};

///////
const registrar = async (email, password, setSession) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = response.user.toJSON();
    setSession(user.stsTokenManager.accessToken);

    const db = getDatabase(firebaseApp);
    const usuarioRef = ref(db, `usuarios/${user.uid}`);
    await set(usuarioRef, {
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }
};

export { login, registrar, redefinirSenha, deslogar, atualizarUsuario };
