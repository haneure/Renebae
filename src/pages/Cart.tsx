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

const Cart: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const firebase = new firebaseFunction();
  const carts = new cartFunction();
  const auth = getAuth();
  const user = auth.currentUser;
  const [cart, setCart] = useState<Array<any>>([]);
  const [wish, setWish] = useState<Array<any>>([]);
  let cartArray: Array<any> = [];
  let dataArray: Array<any> = [];
  let updatedDataArray: Array<any> = [];
  let filteredDataArray: Array<string> = [];
  let cartId = "";
  let subTotal = 0;

  const numberFormat = (value:number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value);

  useIonViewWillEnter(() => {
    getData();
  });

  async function getData() {
    try {
      const productFirebase = firebase.getData("cart");
      setCart(await productFirebase);
      const wishFirebase = firebase.getData("wishlists");
      setWish(await wishFirebase);
    } catch (e: any) {
      toast(e.message);
    }
  }

  async function addToWishlist(
    idP: string,
    image: string,
    name: string,
    price: number
  ) {
    let i = 1;
    let qty = 0;
    let wishArray: Array<any> = [];
    let updatedWishArray: Array<any> = [];
    let wishId = "";
    let count = 0;
    setBusy(true);
    let cartId: string;
    try {
      wish
        .filter((wish) => wish.userId === user?.uid)
        .map((wish) => {
          wishId = wish.id;
          wishArray = wish.items;

          if (wishArray.length == 0) {
            var obj = {
              idP: idP,
              name: name,
              image: image,
              price: price,
            };
            wishArray.push(obj);

            carts.updateData(wishArray, user?.uid, wishId, "wishlists");
            count = 1;
          } else {
            wishArray.forEach((e: any) => {
              if (e.idP === idP) {
                count = 1;
                toast("Item already listed");
              }
            });
          }
        });

      wish
        .filter((wish) => wish.userId === user?.uid)
        .map((wish) => {
          wishArray = wish.items;
          if (count !== 1) {
            var obj = {
              idP: idP,
              name: name,
              image: image,
              price: price,
            };

            wishArray.push(obj);

            carts.updateData(wishArray, user?.uid, wishId, "wishlists");
          }
        });
      setBusy(false);
    } catch (e: any) {
      toast(e);
    }
    getData();
  }

  //buat ngeprint cartnya
  cart
    .filter((cart) => cart.userId === user?.uid)
    .map((cart) => {
      cartId = cart.id;
      cartArray = cart.items;
      cartArray.forEach((e) => {
        subTotal += parseInt(e.price) * parseInt(e.qty);

        dataArray.push(e);
      });
    });

  const deleteFromCart = (idP: string) => {
    try {
      cart
        .filter((cart) => cart.userId === user?.uid)
        .map((cart) => {
          cartId = cart.id;
          cartArray = dataArray.filter((e) => e.idP !== idP);
        });
      cartArray.forEach((e) => {
        filteredDataArray.push(e);
      });

      carts.updateData(filteredDataArray, user?.uid, cartId, "cart");
      getData();
    } catch (e: any) {
      toast(e.message);
    }
  };

  let grandTotal = 0;
  grandTotal = subTotal + 10000;
  const plusmin = (idP: string, plusmin: string) => {
    let index = 0;
    let count = 0;
    let qty = 0;
    try {
      cart
        .filter((cart) => cart.userId === user?.uid)
        .map((cart) => {
          cartId = cart.id;
          dataArray = cart.items;

          if (plusmin === "plus") {
            dataArray.forEach((e: any) => {
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
            });
            carts.updateData(updatedDataArray, user?.uid, cartId, "cart");
          } else if (plusmin === "min") {
            dataArray.forEach((e: any) => {
              if (e.idP === idP) {
                qty = e.qty;
                qty--;
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
            });
            carts.updateData(updatedDataArray, user?.uid, cartId, "cart");
          }
        });
      getData();
    } catch (e: any) {
      toast(e.meesage);
    }
  };

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
            <h3>Shopping Cart</h3>
          </IonRow>
          {dataArray.length === 0 && (
            <IonRow>
              <IonCol>
                <h5>Keranjang Belanja anda masih kosong</h5>
              </IonCol>
            </IonRow>
          )}
          {dataArray &&
            dataArray.map(
              (dataArray: {
                idP: string;
                image: string;
                name: string;
                price: number;
                qty: number;
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
                    <IonRow>
                      <IonCol className="ion-text-center">
                        {dataArray.name}
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol className="ion-text-center">
                        {numberFormat(dataArray.price)}
                      </IonCol>
                    </IonRow>
                  </IonCol>
                  <IonCol size="7">
                    <IonRow>
                      <IonCol className="ion-text-center">
                        <IonButton
                          color="dark"
                          fill="outline"
                          onClick={() => plusmin(dataArray.idP, "min")}
                          size="small"
                        >
                          -
                        </IonButton>
                      </IonCol>
                      <IonCol>
                        <IonInput
                          className="ion-text-center"
                          type="number"
                          value={dataArray.qty}
                          disabled
                        ></IonInput>
                      </IonCol>
                      <IonCol className="ion-text-center">
                        <IonButton
                          color="dark"
                          fill="outline"
                          onClick={() => plusmin(dataArray.idP, "plus")}
                          size="small"
                        >
                          +
                        </IonButton>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonButton
                          onClick={() =>
                            addToWishlist(
                              dataArray.idP,
                              dataArray.image,
                              dataArray.name,
                              dataArray.price
                            )
                          }
                          color="success"
                          fill="outline"
                          className="moveToBtn"
                          expand="block"
                        >
                          <IonIcon icon={heartOutline} slot="start" />
                          Add to Wishlist
                        </IonButton>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonButton
                          onClick={() => deleteFromCart(dataArray.idP)}
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

        <IonGrid>
          <IonRow>
            <h5>Cart Summary</h5>
          </IonRow>
          <IonRow className="cart-summary">
            <IonCol>Sub Total</IonCol>
            <IonCol>
              <NumberFormat
                thousandsGroupStyle="thousand"
                value={subTotal}
                prefix="Rp. "
                decimalSeparator=","
                displayType="text"
                type="text"
                thousandSeparator="."
                allowNegative={true}
              />
            </IonCol>
          </IonRow>
          <IonRow className="cart-summary">
            <IonCol>Shipping</IonCol>
            <IonCol>Rp. 10.000</IonCol>
          </IonRow>
          <IonRow className="cart-summary">
            <IonCol>Tax 0%</IonCol>
            <IonCol>Rp. 0.00</IonCol>
          </IonRow>
          <hr color="light" />
          <IonRow className="cart-summary">
            <IonCol>Grand Total</IonCol>
            <IonCol>
              <NumberFormat
                thousandsGroupStyle="thousand"
                value={grandTotal}
                prefix="Rp. "
                decimalSeparator=","
                displayType="text"
                type="text"
                thousandSeparator="."
                allowNegative={true}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                routerLink="/page/Cart/Checkout"
                expand="block"
                color="medium"
              >
                Proceed To Checkout
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput
                className="coupon"
                placeholder=" Apply coupon code here"
              ></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonButton expand="block" color="medium">
              Apply Coupon
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Cart;
