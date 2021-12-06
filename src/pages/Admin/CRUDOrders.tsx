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
  useIonAlert,
} from "@ionic/react";
import { ReactComponentOrElement } from "@ionic/react/dist/types/hooks/useOverlay";
import {
  addOutline,
  checkmarkOutline,
  closeOutline,
  eyeOutline,
  pencilOutline,
  trashBinOutline,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import { firebaseFunction } from "../../services/firebase";
import { toast } from "../../toast";
import "./CRUDProducts.css";

const CRUDOrders: React.FC = () => {
  const firebase = new firebaseFunction();
  const [orders, setOrders] = useState<Array<any>>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const [present] = useIonAlert();
  const [orderId, setorderId] = useState("");
  const [orderStatus, setorderStatus] = useState<any>();
  const [statusFlag, setStatusFlag] = useState<string>();

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

  async function cancelOrder(id: string) {
    setBusy(true);
    try {
      await firebase.updateData("orders", id, { status: 3 });
      toast("Order Canceled");
      getData();
      setBusy(false);
    } catch (error: any) {
      toast(error.message);
      setBusy(false);
    }
  }

  async function updateOrderStatus(id: string, status: number) {
    setBusy(true);
    let updateStatus = 0;

    if (status === 2) {
      updateStatus = 1;
    }

    if (status === 1) {
      updateStatus = 0;
    }

    try {
      await firebase.updateData("orders", id, { status: updateStatus });
      toast("Order Updated");
      getData();
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
                {orders.map((order, index) => {
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
                                color={
                                  order.status === 2
                                    ? "warning"
                                    : order.status === 1
                                    ? "primary"
                                    : order.status === 0
                                    ? "success"
                                    : "danger"
                                }
                                disabled={
                                  order.status === 2 || order.status === 1
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  present({
                                    cssClass: 'my-css',
                                    header: 'Are you sure?',
                                    message: 'This action cannot be undone!',
                                    buttons: [
                                      'Cancel',
                                      { text: 'Yes', handler: (d) => updateOrderStatus(order.id, order.status) },
                                    ],
                                    onDidDismiss: (e) => console.log('did dismiss'),
                                  })
                                }}
                              >
                                <IonIcon
                                  slot="icon-only"
                                  icon={checkmarkOutline}
                                />
                              </IonButton>
                            ) : (
                              <IonButton
                                expand="block"
                                color={
                                  order.status === 2
                                    ? "warning"
                                    : order.status === 1
                                    ? "primary"
                                    : order.status === 0
                                    ? "success"
                                    : "danger"
                                }
                                disabled={
                                  order.status === 2 || order.status === 1
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  present({
                                    cssClass: 'my-css',
                                    header: 'Are you sure?',
                                    message: 'This action cannot be undone!',
                                    buttons: [
                                      'Cancel',
                                      { text: 'Yes', handler: (d) => updateOrderStatus(order.id, order.status) },
                                    ],
                                    onDidDismiss: (e) => console.log('did dismiss'),
                                  })
                                }}
                              >
                                <IonIcon
                                  slot="icon-only"
                                  icon={checkmarkOutline}
                                />
                                {order.status === 2
                                  ? "Deliver"
                                  : order.status === 1
                                  ? "Done"
                                  : order.status === 0
                                  ? "Finished"
                                  : "Canceled"}
                              </IonButton>
                            )}
                          </IonCol>
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
                          <IonCol>
                            {window.innerWidth < 500 ? (
                              <IonButton
                                color="danger"
                                disabled={
                                  order.status === 2 || order.status === 1
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  present({
                                    cssClass: 'my-css',
                                    header: 'Are you sure you want to cancel this order?',
                                    message: 'This action cannot be undone!',
                                    buttons: [
                                      'Cancel',
                                      { text: 'Yes', handler: (d) => cancelOrder(order.id) },
                                    ],
                                    onDidDismiss: (e) => console.log('did dismiss'),
                                  })
                                }}
                              >
                                <IonIcon slot="icon-only" icon={closeOutline} />
                              </IonButton>
                            ) : (
                              <IonButton
                                color="danger"
                                disabled={
                                  order.status === 2 || order.status === 1
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  present({
                                    cssClass: 'my-css',
                                    header: 'Are you sure you want to cancel this order?',
                                    message: 'This action cannot be undone!',
                                    buttons: [
                                      'Cancel',
                                      { text: 'Yes', handler: (d) => cancelOrder(order.id) },
                                    ],
                                    onDidDismiss: (e) => console.log('did dismiss'),
                                  })
                                }}
                              >
                                <IonIcon slot="icon-only" icon={closeOutline} />
                                Cancel
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

export default CRUDOrders;