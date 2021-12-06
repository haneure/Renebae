import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonAvatar,
  IonContent,
  IonCard,
  IonGrid,
  IonText,
  IonRow,
  IonCardContent,
  IonInput,
  IonItem,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonButton,
  IonLoading,
} from "@ionic/react";
import React, { useState } from "react";
import firebaseInit from "../firebase_config";
import "./Login.css";
import { toast } from "../toast";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseFunction } from "../services/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useHistory } from "react-router";

const Signup: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const storage = getStorage();

  const auth = getAuth(firebaseInit);
  const firebase = new firebaseFunction();
  const history = useHistory();

  async function Signup() {
    setBusy(true);
    if (password !== cpassword) {
      return toast("Password does not match");
    }
    if (username.trim() === "" || password.trim() === "") {
      return toast("Username and password cannot be empty");
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      await createUser(res.user.uid);
      await createCart(res.user.uid);
      await createWishlist(res.user.uid);
      await createCompare(res.user.uid);
      setBusy(false);
      history.push("/Home");
    } catch (error: any) {
      toast(error.message);
      setBusy(false);
    }
  }

  const createCart = async (uid: string) => {
    let data = {
      userId: uid,
      items: [],
    };
    try {
      await firebase.addData(data, "cart");
    } catch (error) {}
  };

  const createWishlist = async (uid: string) => {
    let data = {
      userId: uid,
      items: [],
    };
    try {
      await firebase.addData(data, "wishlists");
    } catch (error) {}
  };

  const createCompare = async (uid: string) => {
    let data = {
      userId: uid,
      items: [],
    };
    try {
      await firebase.addData(data, "compare");
    } catch (error) {}
  };

  const createUser = async (uid: string) => {
    const storageRef = ref(storage, fileName);
    uploadBytes(storageRef, file as Blob)
      .then(() => {
        getDownloadURL(ref(storage, fileName)).then((url) => {
          addUser(uid, url);
        });
      })
      .catch((error) => {});
  };

  const addUser = async (uid: string, url: string) => {
    let data = {
      userId: uid,
      username: username,
      address1: address1,
      address2: address2,
      birthdate: birthDate,
      email: email,
      image: url,
      name: name,
      blob: "",
      phone: phone,
    };
    try {
      await firebase.addData(data, "user");
    } catch (error) {}
  };

  const check = () => {};

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target!.files![0]);
    setFileName(event.target!.files![0].name);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sign up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent>
        <div className="contentCenter">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Sign up</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Username</IonLabel>
                      <IonInput
                        type="text"
                        onIonChange={(e: any) =>
                          setUsername(e.target.value + "@renebae.com")
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Password</IonLabel>
                      <IonInput
                        type="password"
                        onIonChange={(e: any) => setPassword(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Confirm Password</IonLabel>
                      <IonInput
                        type="password"
                        onIonChange={(e: any) => setCpassword(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Name</IonLabel>
                      <IonInput
                        type="text"
                        onIonChange={(e: any) => setName(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Email</IonLabel>
                      <IonInput
                        type="email"
                        onIonChange={(e: any) => setEmail(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Phone Number</IonLabel>
                      <IonInput
                        type="tel"
                        onIonChange={(e: any) => setPhone(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Address1</IonLabel>
                      <IonInput
                        type="text"
                        onIonChange={(e: any) => setAddress1(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Address2</IonLabel>
                      <IonInput
                        type="text"
                        onIonChange={(e: any) => setAddress2(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="stacked">Birth Date</IonLabel>
                      <IonInput
                        type="date"
                        onIonChange={(e: any) => setBirthDate(e.target.value)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="stacked">Profile Image</IonLabel>
                      <input type="file" onChange={fileChangeHandler} />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton expand="block" color="tertiary" onClick={Signup}>
                      Sign Up
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
