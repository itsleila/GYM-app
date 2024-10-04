import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  getStorage,
  uploadBytes,
  deleteObject,
} from '@firebase/storage';
import { firebaseApp } from './firebase';

const uriToBlob = async (uri) => {
  const response = await fetch(uri);
  return await response.blob();
};

export default async function uploadImageStorage(uri, path, name) {
  const imageBlog = await uriToBlob(uri);
  try {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `Image/${path}/${name}`);
    await uploadBytes(storageRef, imageBlog);
    return await getDownloadURL(storageRef);
  } catch (err) {
    console.error(`[uploadImageStorage] >> Error: ${err}`);
    throw err;
  }
}
