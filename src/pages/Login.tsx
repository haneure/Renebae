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
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseInit from "../firebase_config";
import "./Login.css";
import { toast } from "../toast";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  const db = getFirestore(firebaseInit);
  const auth = getAuth(firebaseInit);
  const history = useHistory();

  async function login() {
    setBusy(true);
    try {
      const res = await signInWithEmailAndPassword(auth, username, password);
      toast("Login Successful");
      setBusy(false);
      if (username === "admin@renebae.com") {
        history.push("/page/Admin");
      } else {
        history.push("/Home");
      }
    } catch (error: any) {
      toast(error.message);
      setBusy(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent>
        <div className="contentCenter">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Login</IonCardTitle>
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
                  <IonCol size="5">
                    <IonButton expand="block" onClick={login}>
                      Login
                    </IonButton>
                  </IonCol>
                  <IonCol size="2"></IonCol>
                  <IonCol size="5">
                    <IonButton
                      expand="block"
                      color="tertiary"
                      href="/page/signup"
                    >
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

export default Login;
