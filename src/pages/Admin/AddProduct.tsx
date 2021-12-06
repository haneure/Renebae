import { getAuth, useDeviceLanguage } from "@firebase/auth";
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
import { getFirestore } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import firebaseInit from "../../firebase_config";
import { firebaseFunction } from "../../services/firebase";
import { useHistory } from "react-router";
import "./../Page.css";
import { compassSharp } from "ionicons/icons";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { toast } from "../../toast";

const AddProduct: React.FC = () => {
  let [takenPhoto, setTakenPhoto] = useState<{
    preview: string;
  }>();

  const firebase = new firebaseFunction();
  const [file, setFile] = useState<File>();
  const history = useHistory();
  const storage = getStorage();
  const [fileName, setFileName] = useState("");
  const [newName, setName] = useState(null);
  const [categoryName, setCategory] = useState<Array<any>>([]);
  const [busy, setBusy] = useState<boolean>(false);

  const nameRef = useRef<HTMLIonInputElement>(null);
  const categoryRef = useRef<HTMLIonSelectElement>(null);
  const speedRef = useRef<HTMLIonInputElement>(null);
  const gravityRef = useRef<HTMLIonInputElement>(null);
  const lightingRef = useRef<HTMLIonInputElement>(null);
  const mrenderRef = useRef<HTMLIonInputElement>(null);
  const priceRef = useRef<HTMLIonInputElement>(null);
  const reflectionRef = useRef<HTMLIonInputElement>(null);
  const releaseRef = useRef<HTMLIonInputElement>(null);

  const createUrl = async () => {
    if (
      fileName === "" ||
      file === null ||
      nameRef.current!.value === null ||
      categoryRef.current!.value === "" ||
      speedRef.current!.value === "" ||
      gravityRef.current!.value === "" ||
      lightingRef.current!.value === "" ||
      mrenderRef.current!.value === "" ||
      priceRef.current!.value === "" ||
      reflectionRef.current!.value === "" ||
      releaseRef.current!.value === ""
    ) {
      return toast("All field must be filled");
    } else {
      const storageRef = ref(storage, fileName);
      uploadBytes(storageRef, file as Blob)
        .then(() => {
          getDownloadURL(ref(storage, fileName)).then((url) => {
            addDataProduct(url);
          });
        })
        .catch((error) => {
          toast(error.message);
        });
    }
  };

  useIonViewWillEnter(() => {
    getData();
  });

  async function getData() {
    setBusy(true);
    try {
      const categoryFirebase = firebase.getData("categories");
      setCategory(await categoryFirebase);
    } catch (error: any) {
      toast(error.message);
    }
    setBusy(false);
  }

  async function resetForm() {
    setName(null);
  }

  const addDataProduct = async (url: string) => {
    toast("Please Wait", 5000)
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
      const myJSON = JSON.stringify(field);
      await firebase.addData(field, "product");
    } catch (error: any) {
      toast(error.message);
    }
    resetForm();
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
          <IonTitle>Add Product</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add Product</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid className="ion-padding">
          <form>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel>Image</IonLabel>
                  <input type="file" onChange={fileChangeHandler} required />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Name</IonLabel>
                  <IonInput
                    value={newName}
                    type="text"
                    ref={nameRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Category</IonLabel>
                  <IonSelect
                    value={newName}
                    placeholder="Select One"
                    ref={categoryRef}
                  >
                    {categoryName.map((cat) => (
                      <IonSelectOption key={cat.id}>{cat.name}</IonSelectOption>
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
                    value={newName}
                    type="number"
                    ref={priceRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Effective Speed</IonLabel>
                  <IonInput
                    value={newName}
                    type="number"
                    ref={speedRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Ligthing</IonLabel>
                  <IonInput
                    value={newName}
                    type="number"
                    ref={lightingRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Reflection</IonLabel>
                  <IonInput
                    value={newName}
                    type="number"
                    ref={reflectionRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">mRender</IonLabel>
                  <IonInput
                    value={newName}
                    type="number"
                    ref={mrenderRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Gravity</IonLabel>
                  <IonInput
                    value={newName}
                    type="number"
                    ref={gravityRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Release</IonLabel>
                  <IonInput
                    value={newName}
                    type="text"
                    ref={releaseRef}
                    required
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </form>
          <IonButton expand="block" color="medium" onClick={() => createUrl()}>
            Add
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddProduct;
