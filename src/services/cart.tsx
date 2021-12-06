import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import firebaseInit from "../firebase_config";
import { firebaseFunction } from "./firebase";

export class cartFunction {
  db = getFirestore(firebaseInit);
  storage = getStorage(firebaseInit);

  public async updateData(
    items: Array<any>,
    userId: any,
    id: string,
    collectionName: string
  ) {
    const docRef = doc(this.db, collectionName, id);
    try {
      await updateDoc(docRef, { items, userId });
      console.log("Document updated successfully, ", docRef.id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }

  public async addData(myJSON: string) {
    try {
      const docRef = await addDoc(collection(this.db, "cart"), {});
      console.log("Dcocument written with ID: ", docRef.id);
    } catch (e) {
      console.log("Error Adding document", e);
    }
  }
}
