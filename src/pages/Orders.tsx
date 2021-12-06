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
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonText,
  IonImg,
  useIonViewWillEnter,
  IonLoading,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import { eyeOutline } from "ionicons/icons";
import { useState } from "react";
import NumberFormat from "react-number-format";
import firebaseInit from "../firebase_config";
import { firebaseFunction } from "../services/firebase";
import { toast } from "../toast";

const Orders: React.FC = () => {
  const firebase = new firebaseFunction();
  const auth = getAuth(firebaseInit);
  const user = auth.currentUser;
  const [orders, setOrders] = useState<Array<any>>([]);
  const [busy, setBusy] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    getData();
  });

  async function getData() {
    setBusy(true);
    try {
      const productsFirebase = firebase.getDataOrderBy(
        "orders",
        "timestamp",
        "desc"
      );
      setOrders(await productsFirebase);
      setBusy(false);
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
          <IonTitle>CRUD Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">CRUD Orders</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonTitle>Orders</IonTitle>
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
                    <IonText>Order Date</IonText>
                  </th>
                  <th className="ion-hide-md-down">
                    <IonText>Name</IonText>
                  </th>
                  <th>
                    <IonText>Items</IonText>
                  </th>
                  <th>
                    <IonText>Total Price</IonText>
                  </th>
                  <th>
                    <IonText>Status</IonText>
                  </th>
                  <th>
                    <IonText>Action</IonText>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => order.userId === user?.uid)
                  .map((order, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <IonText>{index + 1}</IonText>
                        </td>
                        <td>
                          <IonText>
                            {order.timestamp.toDate().toDateString()}
                          </IonText>
                        </td>
                        <td className="ion-hide-md-down">
                          <IonText>{order.users.name}</IonText>
                        </td>
                        <td>
                          <IonText>{order.items.length}</IonText>
                        </td>
                        <td>
                          <IonText>
                            <NumberFormat
                              thousandsGroupStyle="thousand"
                              value={order.total}
                              prefix="Rp "
                              thousandSeparator="."
                              decimalSeparator=","
                              displayType="text"
                              type="text"
                              allowNegative={true}
                            />
                          </IonText>
                        </td>
                        <td>
                          {order.status === 2 ? (
                            <IonText color="warning">Processing</IonText>
                          ) : order.status === 1 ? (
                            <IonText color="primary">Delivering</IonText>
                          ) : order.status === 0 ? (
                            <IonText color="success">Done</IonText>
                          ) : (
                            <IonText color="danger">Canceled</IonText>
                          )}
                        </td>
                        <td>
                          <IonRow>
                            <IonCol>
                              {window.innerWidth < 500 ? (
                                <IonButton
                                  expand="block"
                                  color="tertiary"
                                  routerLink={`/page/vieworder/${order.id}`}
                                >
                                  <IonIcon slot="icon-only" icon={eyeOutline} />
                                </IonButton>
                              ) : (
                                <IonButton
                                  expand="block"
                                  color="tertiary"
                                  routerLink={`/page/vieworder/${order.id}`}
                                >
                                  <IonIcon slot="icon-only" icon={eyeOutline} />
                                  View
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

export default Orders;
