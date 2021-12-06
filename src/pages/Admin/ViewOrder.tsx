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
import {
  addOutline,
  checkmarkOutline,
  closeOutline,
  eyeOutline,
  pencilOutline,
  trashBinOutline,
} from "ionicons/icons";
import { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import { useParams } from "react-router";
import { firebaseFunction } from "../../services/firebase";
import { toast } from "../../toast";
import "./viewOrder.css";

const ViewOrder: React.FC = () => {
  const idOrder = useParams<{ id: string }>().id;
  const firebase = new firebaseFunction();
  const [orders, setOrders] = useState<Array<any>>([]);
  const [busy, setBusy] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    getData();
  });

  async function getData() {
    setBusy(true);
    try {
      const productsFirebase = firebase.getData("orders");
      setOrders(await productsFirebase);
      orders.filter((order) => order.id === idOrder).map((order) => {});
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
                <IonTitle>Ordered Items</IonTitle>
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
                    <IonText>Item Name</IonText>
                  </th>
                  <th>
                    <IonText>Item Image</IonText>
                  </th>
                  <th>
                    <IonText>Item Price</IonText>
                  </th>
                  <th>
                    <IonText>Item qty</IonText>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => order.id === idOrder)
                  .map((order) => {
                    return order.items.map((item: any, index: any) => {
                      return (
                        <tr key={index}>
                          <td>
                            <IonText>{index + 1}</IonText>
                          </td>
                          <td>
                            <IonText>{item.name}</IonText>
                          </td>
                          <td>
                            <div className="imageContainer">
                              <IonImg className="itemImage" src={item.image} />
                            </div>
                          </td>
                          <td>
                            <IonText>
                              <NumberFormat
                                thousandsGroupStyle="thousand"
                                value={item.price}
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
                            <IonText>{item.qty}</IonText>
                          </td>
                        </tr>
                      );
                    });
                  })}
              </tbody>
            </table>
          </div>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonTitle>Order Summary</IonTitle>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="4">
                <IonRow>
                  <IonTitle>Name</IonTitle>
                </IonRow>
                <IonRow>
                  <IonTitle>Email</IonTitle>
                </IonRow>
                <IonRow>
                  <IonTitle>Address</IonTitle>
                </IonRow>
                <IonRow>
                  <IonTitle>City</IonTitle>
                </IonRow>
                <IonRow>
                  <IonTitle>Country</IonTitle>
                </IonRow>
                <IonRow>
                  <IonTitle>Item Type</IonTitle>
                </IonRow>
                <IonRow>
                  <IonTitle>Total Price</IonTitle>
                </IonRow>
                <IonRow>
                  <IonTitle>Order Status</IonTitle>
                </IonRow>
              </IonCol>
              {orders
                .filter((order) => order.id === idOrder)
                .map((order, index) => {
                  return (
                    <IonCol key={index}>
                      <IonRow>
                        <IonTitle>{order.users.name}</IonTitle>
                      </IonRow>
                      <IonRow>
                        <IonTitle>{order.users.email}</IonTitle>
                      </IonRow>
                      <IonRow>
                        <IonTitle>{order.users.address}</IonTitle>
                      </IonRow>
                      <IonRow>
                        <IonTitle>{order.users.city}</IonTitle>
                      </IonRow>
                      <IonRow>
                        <IonTitle>{order.users.country}</IonTitle>
                      </IonRow>
                      <IonRow>
                        <IonTitle>{order.items.length}</IonTitle>
                      </IonRow>
                      <IonRow>
                        <IonTitle>
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
                        </IonTitle>
                      </IonRow>
                      <IonRow>
                        <IonTitle>
                          {order.status === 2 ? (
                            <IonText color="warning">Processing</IonText>
                          ) : order.status === 1 ? (
                            <IonText color="primary">Delivering</IonText>
                          ) : order.status === 0 ? (
                            <IonText color="success">Done</IonText>
                          ) : (
                            <IonText color="danger">Canceled</IonText>
                          )}
                        </IonTitle>
                      </IonRow>
                    </IonCol>
                  );
                })}
            </IonRow>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ViewOrder;
