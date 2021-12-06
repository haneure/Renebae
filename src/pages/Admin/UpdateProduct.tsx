import { getAuth } from "@firebase/auth";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { doc, getFirestore, writeBatch } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import firebaseInit from "../../firebase_config";
import { firebaseFunction } from "../../services/firebase";
import { useHistory } from "react-router";
import "./../Page.css";
import { onAuthStateChanged } from "firebase/auth";
import {
  uploadBytes,
  getDownloadURL,
  ref,
  getStorage,
} from "@firebase/storage";
import { prettyDOM } from "@testing-library/dom";
import { toast } from "../../toast";

const UpdateProduct: React.FC = () => {
  let [takenPhoto, setTakenPhoto] = useState<{
    preview: string;
  }>();

  let idprod = useParams<{ id: string }>().id;
  const db = getFirestore(firebaseInit);
  const batch = writeBatch(db);
  const auth = getAuth(firebaseInit);
  const user = auth.currentUser;
  const firebase = new firebaseFunction();
  const history = useHistory();
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("");
  const [product, setProduct] = useState<Array<any>>([]);
  const [categoryName, setCategory] = useState<Array<any>>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const storage = getStorage();

  const nameRef = useRef<HTMLIonInputElement>(null);
  const categoryRef = useRef<HTMLIonSelectElement>(null);
  const speedRef = useRef<HTMLIonInputElement>(null);
  const gravityRef = useRef<HTMLIonInputElement>(null);
  const lightingRef = useRef<HTMLIonInputElement>(null);
  const mrenderRef = useRef<HTMLIonInputElement>(null);
  const priceRef = useRef<HTMLIonInputElement>(null);
  const reflectionRef = useRef<HTMLIonInputElement>(null);
  const releaseRef = useRef<HTMLIonInputElement>(null);

  useIonViewWillEnter(() => {
    getData();
  });

  useEffect(() => {
    product
      .filter((product) => product.id === idprod)
      .map((product) => {
        setTakenPhoto({
          preview: product.image,
        });
      });
  }, [product]);

  async function getData() {
    setBusy(true);
    try {
      const categoryFirebase = firebase.getData("categories");
      setCategory(await categoryFirebase);

      const productFirebase = firebase.getData("product");
      setProduct(await productFirebase);

    } catch (e: any) {
      toast(e.message);
    }
    setBusy(false);
  }

  const createUrl = async () => {
    try {
      if (fileName === "" || file === null) {
        updateData(takenPhoto!.preview);
      } else {
        const storageRef = ref(storage, fileName);
        uploadBytes(storageRef, file as Blob)
          .then(() => {
            getDownloadURL(ref(storage, fileName)).then((url) => {
              updateData(url);
            });
          })
          .catch((error) => {});
      }
    } catch (e) {}
  };

  const updateData = async (url: string) => {
    const field = {
      name: nameRef.current?.value,
      category: categoryRef.current?.value,
      effectiveSpeed: speedRef.current?.value,
      gravity: gravityRef.current?.value,
      image: url,
      lighting: lightingRef.current?.value,
      mrender: mrenderRef.current?.value,
      price: priceRef.current?.value,
      reflection: reflectionRef.current?.value,
      release: releaseRef.current?.value,
    };
    try {
      await firebase.updateData("product", idprod, field);
    } catch (e) {}
    history.push("/page/Admin/Products");
  };

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
          <IonTitle>Category</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{idprod}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {product
          .filter((product) => product.id === idprod)
          .map((prod) => (
            <IonGrid key={prod.name} className="ion-padding">
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Name</IonLabel>
                    <IonInput
                      type="text"
                      ref={nameRef}
                      value={prod.name}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Category</IonLabel>
                    <IonSelect
                      value={prod.category}
                      placeholder={prod.category}
                      ref={categoryRef}
                    >
                      {categoryName.map((cat) => (
                        <IonSelectOption>{cat.name}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Price</IonLabel>
                    <IonInput
                      type="text"
                      ref={priceRef}
                      value={prod.price}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Gravity</IonLabel>
                    <IonInput
                      type="number"
                      ref={gravityRef}
                      value={prod.gravity}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Effective Speed</IonLabel>
                    <IonInput
                      type="number"
                      ref={speedRef}
                      value={prod.effectiveSpeed}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Ligthing</IonLabel>
                    <IonInput
                      type="number"
                      ref={lightingRef}
                      value={prod.lighting}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">mRender</IonLabel>
                    <IonInput
                      type="number"
                      ref={mrenderRef}
                      value={prod.mrender}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Reflection</IonLabel>
                    <IonInput
                      type="number"
                      ref={reflectionRef}
                      value={prod.reflection}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Release</IonLabel>
                    <IonInput
                      type="text"
                      ref={releaseRef}
                      value={prod.release}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <div className="image-preview">
                      {takenPhoto?.preview == null && (
                        <h3>Silahkan tambah profile picture.</h3>
                      )}
                      {takenPhoto && (
                        <img src={takenPhoto?.preview} alt="Preview" />
                      )}
                    </div>
                    <input type="file" onChange={fileChangeHandler} />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonButton
                expand="block"
                color="medium"
                onClick={() => createUrl()}
              >
                Edit
              </IonButton>
            </IonGrid>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default UpdateProduct;
