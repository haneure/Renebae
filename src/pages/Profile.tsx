import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonAvatar,
  IonContent,
  IonText,
  IonImg,
  IonGrid,
  IonRow,
  IonCard,
  IonButton,
  useIonViewWillEnter,
  IonLoading,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import firebaseInit from "../firebase_config";
import { firebaseFunction } from "../services/firebase";
import { toast } from "../toast";
import "./Profile.css";

const Profile: React.FC = () => {
  const [userInfo, setUser] = useState<Array<any>>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const auth = getAuth(firebaseInit);
  const user = auth.currentUser;
  const firebase = new firebaseFunction();

  useIonViewWillEnter(() => {
    getData();
  });

  const getData = async () => {
    setBusy(true);
    try {
      const productFirebase = firebase.getData("user");
      setUser(await productFirebase);
      setBusy(false);
    } catch (error: any) {
      toast(error.message);
      setBusy(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent>
        <IonCard>
          {userInfo
            .filter((info) => info.userId === user?.uid)
            .map((info, index) => (
              <IonGrid key={index}>
                <IonRow>
                  <div className="contentCenter">
                    <IonAvatar className="profilePicture">
                      <IonImg src={info.image} />
                    </IonAvatar>
                  </div>
                </IonRow>
                <IonRow>
                  <div className="contentCenter">
                    <IonText className="centerText">
                      <h1>{info.name}</h1>
                    </IonText>
                  </div>
                </IonRow>
                <IonRow>
                  <div className="contentCenter">
                    <IonText className="centerText">
                      <h1>{info.email}</h1>
                    </IonText>
                  </div>
                </IonRow>
                <IonRow>
                  <div className="contentCenter">
                    <IonText className="centerText">
                      <h1>{info.birthdate}</h1>
                    </IonText>
                  </div>
                </IonRow>
                <IonRow>
                  <div className="contentCenter">
                    <IonText className="centerText">
                      <h1>{info.phone}</h1>
                    </IonText>
                  </div>
                </IonRow>
                <IonRow>
                  <div className="contentCenter">
                    <IonText className="centerText">
                      <h1>
                        {info.address1} <br /> {info.address2}
                      </h1>
                    </IonText>
                  </div>
                </IonRow>
                <IonRow>
                  <div className="contentCenter">
                    <IonButton
                      className="editProfileBtn"
                      routerLink="/page/editprofile"
                    >
                      Edit Profile
                    </IonButton>
                  </div>
                </IonRow>
              </IonGrid>
            ))}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
