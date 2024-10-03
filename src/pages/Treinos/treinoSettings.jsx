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
import firebaseApp from '../../Storage/firebase';

export async function inserirTreino(titulo, categorias, descricao, midia) {
  const db = getDatabase(firebaseApp);
  const treinoRef = ref(db, 'Treino');
  const newTreinoRef = push(treinoRef);
  await set(newTreinoRef, {
    titulo: titulo,
    midia: midia,
    descricao: descricao,
    categorias: categorias,
  });
  return newTreinoRef.key;
}

export async function listarTreinos(setTreinos) {
  const db = getDatabase(firebaseApp);
  const treinosRef = ref(db, 'Treino');
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
}

export async function obterTreino(key) {
  const db = getDatabase(firebaseApp);
  const treinoRef = ref(db, `Treino/${key}`);
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
}

export async function excluirTreino(key) {
  const db = getDatabase(firebaseApp);
  const treinoRef = ref(db, `Treino/${key}`);
  await remove(treinoRef);
}

export async function atualizarTreino(key, titulo, descricao) {
  const db = getDatabase(firebaseApp);
  const treinoRef = ref(db, `Treino/${key}`);
  await update(treinoRef, {
    titulo: titulo,
    midia: midia,
    descricao: descricao,
    categorias: categorias,
  });
}
