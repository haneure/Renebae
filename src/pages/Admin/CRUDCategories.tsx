import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewWillEnter,
} from "@ionic/react";
import { addOutline, pencilOutline, trashBinOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { firebaseFunction } from "../../services/firebase";
import { useHistory, useParams } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "../../toast";

const CRUDCategories: React.FC = () => {
  const firebase = new firebaseFunction();
  const [categories, setCategories] = useState<Array<any>>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const history = useHistory();
  const [present] = useIonAlert();

  useIonViewWillEnter(() => {
    getData();
  });

  async function getData() {
    setBusy(true);
    try {
      const categoriesFirebase = firebase.getData("categories");
      setCategories(await categoriesFirebase);
    } catch (e: any) {
      toast(e.message);
    }
    setBusy(false);
  }

  const deleteCat = async (id: any) => {
    setBusy(true);
    try {
      await firebase.deleteData("categories", id);
      getData();
    } catch (e: any) {
      toast(e.message);
    }
    setBusy(false);
    history.push("/page/Admin/Categories");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>CRUD Categories</IonTitle>
          <IonAvatar className="avatarImage" slot="end">
            <img src="https://avatars3.githubusercontent.com/u/52709818?s=460&u=f9f8b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8&v=4" />
          </IonAvatar>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">CRUD Categories</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonTitle>Categories</IonTitle>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  color="success"
                  routerLink={`/page/addcategory/`}
                >
                  <IonIcon slot="icon-only" icon={addOutline} />
                  Add Category
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div className="table-responsive">
            <table className="table table-light table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    <IonText>#</IonText>
                  </th>
                  <th>
                    <IonText>Name</IonText>
                  </th>
                  <th>
                    <IonText>Action</IonText>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
                  return (
                    <tr>
                      <td>
                        <IonText>{index + 1}</IonText>
                      </td>
                      <td>
                        <IonText>{category.name}</IonText>
                      </td>
                      <td>
                        <IonRow key={category.id}>
                          <IonCol>
                            {window.innerWidth < 500 ? (
                              <IonButton
                                color="warning"
                                routerLink={`/page/editcategory/${category.id}`}
                              >
                                <IonIcon slot="icon-only" icon={pencilOutline} />
                              </IonButton>
                            ) : (
                              <IonButton
                                color="warning"
                                routerLink={`/page/editcategory/${category.id}`}
                              >
                                <IonIcon slot="icon-only" icon={pencilOutline} />
                                Edit
                              </IonButton>
                            )}
                          </IonCol>
                          <IonCol>
                            {window.innerWidth < 500 ? (
                              <IonButton
                                color="danger"
                                onClick={() =>
                                  present({
                                    cssClass: 'my-css',
                                    header: 'Are you sure you want to delete this category?',
                                    message: 'this action cannot be undone!',
                                    buttons: [
                                      'Cancel',
                                      { text: 'Yes', handler: (d) => deleteCat(category.id) },
                                    ],
                                    onDidDismiss: (e) => console.log('did dismiss'),
                                  })
                                }
                              >
                                <IonIcon
                                  slot="icon-only"
                                  icon={trashBinOutline}
                                />
                              </IonButton>
                            ) : (
                              <IonButton
                                color="danger"
                                onClick={() =>
                                  present({
                                    cssClass: 'my-css',
                                    header: 'Are you sure you want to delete this category?',
                                    message: 'this action cannot be undone!',
                                    buttons: [
                                      'Cancel',
                                      { text: 'Yes', handler: (d) => deleteCat(category.id) },
                                    ],
                                    onDidDismiss: (e) => console.log('did dismiss'),
                                  })
                                }
                              >
                                <IonIcon
                                  slot="icon-only"
                                  icon={trashBinOutline}
                                />
                                Delete
                              </IonButton>
                            )}
                          </IonCol>
                        </IonRow>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CRUDCategories;
