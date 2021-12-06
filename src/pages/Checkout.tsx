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
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseInit from "../firebase_config";
import "./Checkout.css";
import { cartFunction } from "../services/cart";
import { firebaseFunction } from "../services/firebase";
import NumberFormat from "react-number-format";
import { Geolocation } from "@capacitor/geolocation";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { async } from "@firebase/util";
import { userInfo } from "os";
import { toast } from "../toast";

const Checkout: React.FC = () => {
  const history = useHistory();
  const [busy, setBusy] = useState<boolean>(false);
  const db = getFirestore(firebaseInit);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const firebase = new firebaseFunction();
  const carts = new cartFunction();
  const [cart, setCart] = useState<Array<any>>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const auth = getAuth();
  const user = auth.currentUser;
  let cartArray: Array<any> = [];
  let dataArray: Array<any> = [];
  var clearCart: Array<any> = [];
  let cartId = "";
  let subTotal = 0;

  // useEffect(()=>{

  // },[])

  useIonViewWillEnter(() => {
    getCurrentPosition();
    getData();
  });

  async function getData() {
    try {
      const productFirebase = firebase.getData("cart");
      setCart(await productFirebase);
    } catch (e: any) {
      toast(e);
    }
  }

  async function updateData() {
    try {
      const productFirebase = carts.updateData(
        clearCart,
        user?.uid,
        cartId,
        "cart"
      );
      await productFirebase;
    } catch (e: any) {
      toast(e);
    }
  }

  async function addData(data: object) {
    //data: any, collectionName: string
    try {
      await firebase.addData(data, "orders");
      toast("Order successfuly added");
      updateData();
      history.push("/Home");
    } catch (e: any) {
      toast(e.message);
    }
  }

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
  let grandTotal = 0;
  grandTotal += subTotal + 10000;

  const getCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    const numberFormat = (value:number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(value);

    setLat(coordinates.coords.latitude);
    setLng(coordinates.coords.longitude);
  };

  function selectPos(e: google.maps.MapMouseEvent) {
    if (e.latLng?.lat()) {
      setLat(e.latLng.lat());
    }
    if (e.latLng?.lng()) {
      setLat(e.latLng.lng());
    }
  }
  //buat ngeprint cartnya
  function addtoOrder() {
    if (
      name === "" ||
      email === "" ||
      address === "" ||
      city === "" ||
      country === "" ||
      postalCode === ""
    ) {
      toast("Input field must be filled");
    } else {
      var users = {
        name: name,
        email: email,
        address: address,
        city: city,
        country: country,
        postalCode: postalCode,
        lat: lat,
        lng: lng,
      };
      var data = {
        total: grandTotal,
        users: users,
        items: dataArray,
        status: 2,
        timestamp: serverTimestamp(),
        userId: user?.uid,
      };
      addData(data);
    }
  }
  const containerStyle = {
    width: "100%",
    height: "50%",
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
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />

      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <h3>Checkout</h3>
          <h6>Billing Address</h6>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Full Name</IonLabel>
                <IonInput
                  onIonChange={(e: any) => setName(e.target.value)}
                  required
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  onIonChange={(e: any) => setEmail(e.target.value)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Street Address</IonLabel>
                <IonInput
                  onIonChange={(e: any) => setAddress(e.target.value)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">City</IonLabel>
                <IonInput
                  onIonChange={(e: any) => setCity(e.target.value)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Country</IonLabel>
                <IonInput
                  onIonChange={(e: any) => setCountry(e.target.value)}
                ></IonInput>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Postal Code</IonLabel>
                <IonInput
                  onIonChange={(e: any) => setPostalCode(e.target.value)}
                  type="number"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        Map:
        <LoadScript googleMapsApiKey="AIzaSyAlLM8KDJySDya6H2ErQ5ZPB07CzpnMutA">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: lat, lng: lng }}
            //onClick={selectPos}
            zoom={18}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <></>
            <Marker position={{ lat: lat, lng: lng }} />
          </GoogleMap>
        </LoadScript>
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
                decimalSeparator="."
                displayType="text"
                type="text"
                thousandSeparator={true}
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
                decimalSeparator="."
                displayType="text"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <hr />
        <IonGrid>
          <IonRow>Payment methods:</IonRow>
          <IonRow className="payment-method">
            <IonSegment>
              <IonSegmentButton value="BCA">
                <img
                  width="150px"
                  src="https://image.cermati.com/v1428073854/brands/avqoa9rfng8bklutfhm6.jpg"
                  alt=""
                />
              </IonSegmentButton>
            </IonSegment>
          </IonRow>
        </IonGrid>
        <IonButton expand="block" onClick={() => addtoOrder()} color="medium">
          Pay
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Checkout;
