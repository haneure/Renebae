import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSlide,
  IonSlides,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  car,
  cartOutline,
  heartOutline,
  logoWindows,
  trashBinOutline,
} from "ionicons/icons";
import {
  JSXElementConstructor,
  Key,
  ReactChild,
  ReactElement,
  ReactFragment,
  ReactNodeArray,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseInit from "../firebase_config";
import "./Cart.css";
import { cartFunction } from "../services/cart";
import { firebaseFunction } from "../services/firebase";
import NumberFormat from "react-number-format";
import { async } from "@firebase/util";
import { toast } from "../toast";

const Wishlist: React.FC = () => {
  const db = getFirestore(firebaseInit);
  const [jumlahbarang, setJumlahBarang] = useState<number>(0);

  const [busy, setBusy] = useState<boolean>(false);
  const firebase = new firebaseFunction();
  const storage = getStorage(firebaseInit);
  const carts = new cartFunction();
  const auth = getAuth();
  const user = auth.currentUser;
  const [cart, setCart] = useState<Array<any>>([]);
  const [wish, setWish] = useState<Array<any>>([]);
  const history = useHistory();
  let wishlistArray: Array<any> = [];
  let dataArray: Array<any> = [];
  let updatedDataArray: Array<any> = [];
  let filteredDataArray: Array<string> = [];
  let cartId = "";
  let subTotal = 0;

  useIonViewWillEnter(() => {
    getData();
  });

  async function getData() {
    try {
      const cartFirebase = firebase.getData("cart");
      setCart(await cartFirebase);
      const wishlistFirebase = firebase.getData("wishlists");
      setWish(await wishlistFirebase);
    } catch (e: any) {
      toast(e.message);
    }
  }

  wish
    .filter((wish) => wish.userId === user?.uid)
    .map((wish) => {
      cartId = wish.id;
      wishlistArray = wish.items;
      wishlistArray.forEach((e) => {
        dataArray.push(e);
      });
    });

  let wishId = "";
  const deleteFromWishlist = (idP: string) => {
    try {
      wish
        .filter((wish) => wish.userId === user?.uid)
        .map((wish) => {
          wishId = wish.id;
          wishlistArray = dataArray.filter((e) => e.idP !== idP);
        });
      wishlistArray.forEach((e) => {
        filteredDataArray.push(e);
      });

      carts.updateData(filteredDataArray, user?.uid, wishId, "wishlists");
    } catch (e: any) {
      toast(e.message);
    }
    getData();
  };

  async function addToCart(
    idP: string,
    image: string,
    name: string,
    price: string
  ) {
    let i = 1;
    let qty = 0;
    let dataArray: Array<any> = [];
    let updatedDataArray: Array<any> = [];
    let count = 0;
    setBusy(true);
    let cartId: string;
    try {
      cart
        .filter((cart) => cart.userId === user?.uid)
        .map((cart) => {
          cartId = cart.id;
          dataArray = cart.items;
          if (dataArray.length == 0) {
            var obj = {
              idP: idP,
              name: name,
              image: image,
              price: price,
              qty: 1,
            };
            dataArray.push(obj);
            carts.updateData(dataArray, user?.uid, cartId, "cart");
            count = 2;
          } else {
            dataArray.forEach((e: any) => {
              if (e.idP === idP) {
                count = 1;
              }
            });
          }
        });

      cart
        .filter((cart) => cart.userId === user?.uid)
        .map((cart) => {
          cartId = cart.id;
          dataArray = cart.items;
          dataArray.forEach((e: any) => {
            if (count == 1) {
              if (e.idP === idP) {
                qty = e.qty;
                qty++;
                var obj = {
                  idP: e.idP,
                  name: e.name,
                  image: e.image,
                  price: e.price,
                  qty: qty,
                };
                updatedDataArray.push(obj);
              } else {
                qty = e.qty;
                obj = {
                  idP: e.idP,
                  name: e.name,
                  image: e.image,
                  price: e.price,
                  qty: qty,
                };
                updatedDataArray.push(obj);
              }
              carts.updateData(updatedDataArray, user?.uid, cartId, "cart");
            } else if (count == 0) {
              obj = {
                idP: idP,
                name: name,
                image: image,
                price: price,
                qty: 1,
              };
              dataArray.push(obj);
              carts.updateData(dataArray, user?.uid, cartId, "cart");
              count = 3;
            }
          });
        });
      getData();
      setBusy(false);
    } catch (e: any) {
      toast(e);
    }
  }

  const numberFormat = (value:number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Renebae</IonTitle>
          <IonAvatar className="avatarImage" slot="end">
            <img src="https://avatars3.githubusercontent.com/u/52709818?s=460&u=f9f8b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8&v=4" />
          </IonAvatar>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={3000} isOpen={busy} />

      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            <h3>Wishlist</h3>
          </IonRow>
          {dataArray.length === 0 && (
            <IonRow>
              <IonCol>
                <h5>Wishlist is empty</h5>
              </IonCol>
            </IonRow>
          )}
          {dataArray &&
            dataArray.map(
              (dataArray: {
                idP: string;
                image: string;
                name: string;
                price: string;
              }) => (
                <IonRow key={dataArray.idP}>
                  <IonCol size="5">
                    <IonRow>
                      <img
                        src={dataArray.image}
                        alt=""
                        className="img-container"
                      />
                    </IonRow>
                  </IonCol>
                  <IonCol size="7">
                    <IonRow>
                      <IonCol className="ion-text-center">
                        {dataArray.name}
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol className="ion-text-center">
                        {numberFormat(parseInt(dataArray.price))}
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonButton
                          color="success"
                          fill="outline"
                          onClick={() =>
                            addToCart(
                              dataArray.idP,
                              dataArray.image,
                              dataArray.name,
                              dataArray.price
                            )
                          }
                          className="moveToBtn"
                          expand="block"
                        >
                          <IonIcon icon={cartOutline} slot="start" />
                          Add to Cart
                        </IonButton>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonButton
                          onClick={() => deleteFromWishlist(dataArray.idP)}
                          color="danger"
                          fill="outline"
                          className="removeBtn"
                          expand="block"
                        >
                          <IonIcon icon={trashBinOutline} slot="start" />
                          Remove
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonCol>
                </IonRow>
              )
            )}
        </IonGrid>

        <IonButton routerLink="/Home" expand="block" color="medium">
          Explore our products
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Wishlist;
