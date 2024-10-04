import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  get,
  update,
  remove,
} from 'firebase/database';
import firebaseApp from '../../Services/firebase';
import { getAuth } from 'firebase/auth';

export async function inserirTreino(titulo, categorias, descricao, midia) {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase(firebaseApp);
    const treinoRef = ref(db, `Treinos/${user.uid}`);
    const newTreinoRef = push(treinoRef);

    await set(newTreinoRef, {
      titulo: titulo,
      midia: midia,
      descricao: descricao,
      categorias: categorias,
    });

    return newTreinoRef.key;
  } else {
    throw new Error('Usuário não autenticado.');
  }
}

export async function listarTreinos(setTreinos) {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase(firebaseApp);
    const treinosRef = ref(db, `Treinos/${user.uid}`);

    onValue(treinosRef, (snapshot) => {
      const treinos = [];
      snapshot.forEach((childTreino) => {
        treinos.push({
          key: childTreino.key,
          titulo: childTreino.val().titulo,
          midia: childTreino.val().midia,
          descricao: childTreino.val().descricao,
          categorias: childTreino.val().categorias,
        });
      });
      setTreinos(treinos);
    });
  } else {
    console.error('Usuário não autenticado.');
  }
}

export async function obterTreino(key) {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase(firebaseApp);
    const treinoRef = ref(db, `Treinos/${user.uid}/${key}`);
    const snapshot = await get(treinoRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        key: key,
        titulo: data.titulo,
        midia: data.midia,
        descricao: data.descricao,
        categorias: data.categorias,
      };
    }
  } else {
    console.error('Usuário não autenticado.');
  }
}

export async function excluirTreino(key) {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase(firebaseApp);
    const treinoRef = ref(db, `Treinos/${user.uid}/${key}`);
    await remove(treinoRef);
  } else {
    console.error('Usuário não autenticado.');
  }
}

export async function atualizarTreino(
  key,
  titulo,
  descricao,
  midia,
  categorias,
) {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase(firebaseApp);
    const treinoRef = ref(db, `Treinos/${user.uid}/${key}`);
    await update(treinoRef, {
      titulo: titulo,
      midia: midia,
      descricao: descricao,
      categorias: categorias,
    });
  } else {
    console.error('Usuário não autenticado.');
  }
}
