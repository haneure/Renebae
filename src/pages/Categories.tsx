import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFabButton,
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
  IonSelect,
  IonSelectOption,
  IonSlide,
  IonSlides,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { cartOutline, closeCircleOutline, gitCompareOutline, heartOutline } from "ionicons/icons";
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseInit from "../firebase_config";
import "./Categories.css";
import { useState, useEffect, useRef } from "react";
import { firebaseFunction } from "../services/firebase";
import { cartFunction } from "../services/cart";
import { useHistory, useParams } from "react-router";
import { getAuth } from "firebase/auth";
import { toast } from "../toast";

const Categories: React.FC = () => {
  const db = getFirestore(firebaseInit);
  const firebase = new firebaseFunction();
  const carts = new cartFunction();
  const [busy, setBusy] = useState<boolean>(false);
  const [wish, setWish] = useState<Array<any>>([]);
  let [product, setProduct] = useState<Array<any>>([]);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [cart, setCart] = useState<Array<any>>([]);
  const [compare, setCompare] = useState<Array<any>>([]);
  const history = useHistory();
  const auth = getAuth(firebaseInit);
  const user = auth.currentUser;
  const [search, setSearch] = useState<string>("");
  const [catSearch, setcatSearch] = useState<string>("");
  let [displayproduct, setDisplayProduct] = useState<Array<any>>([]);
  let [displayproductDefault, setDisplayProductDefault] = useState<Array<any>>([]);
  let [allproduct, setAllProduct] = useState<Array<any>>([]);
  let displayWish: any[] = [];
  const searchbar = useRef<HTMLIonSearchbarElement>(null);
  const searchVal = useParams<{ search: string }>().search;
  const [categoryName, setCategory] = useState<Array<any>>([]);

  useIonViewWillEnter(() => {
    getData();
    if(searchVal != null){
      setSearch(searchVal);
    }
    if(searchVal == "all"){
      setSearch(searchVal);
    }
    setcatSearch("all");
  });

  useIonViewDidEnter(() => {
    setTimeout(() => {
      searchbar.current?.setFocus();
    }, 500);
  });

  async function getData() {
    try {
      const productFirebase = firebase.getData("product");
      setProduct(await productFirebase);
      setDisplayProduct(await productFirebase);
      setAllProduct(await productFirebase);
      const cartFirebase = firebase.getData("cart");
      setCart(await cartFirebase);
      const wishFirebase = firebase.getData("wishlists");
      setWish(await wishFirebase);
      const compareFirebase = firebase.getData("compare");
      setCompare(await compareFirebase);
      const categoryFirebase = firebase.getData("categories");
      setCategory(await categoryFirebase);
    } catch (e: any) {
      toast(e.message);
    }
  }

  const signedOut = () => {
    history.push("/page/Login");
  };

  async function addToWishlist(
    idP: string,
    image: string,
    name: string,
    price: number
  ) {
    setBusy(true);
    let i = 1;
    let qty = 0;
    let wishArray: Array<any> = [];
    let updatedWishArray: Array<any> = [];
    let wishId = "";
    let count = 0;
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
            toast("Item added to wishlist");
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
            toast("Item added to wishlist");
          }
        });
    } catch (e: any) {
      toast(e);
    }
    getData();
    setBusy(false);
  }
  async function addToCart(
    idP: string,
    image: string,
    name: string,
    price: string
  ) {
    setBusy(true);
    let i = 1;
    let qty = 0;
    let dataArray: Array<any> = [];
    let updatedDataArray: Array<any> = [];
    let count = 0;

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
            toast("Added to cart");
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
              toast("Added to cart");
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
              toast("Added to cart");
            }
          });
        });
      getData();
    } catch (e: any) {
      toast(e);
    }
    setBusy(false);
  }

  async function addToCompare(idP: string) {
    setBusy(true);
    let i = 1;
    let qty = 0;
    let dataArray: Array<any> = [];
    let updatedDataArray: Array<any> = [];
    let count = 0;

    let compareId: string;
    try {
      console.log(user?.uid);
      compare
        .filter((compare) => compare.userId === user?.uid)
        .map((compare) => {
          compareId = compare.id;
          dataArray = compare.items;
          if (dataArray.length == 0) {
            product
              .filter((product) => product.id === idP)
              .map((product) => {
                var obj = {
                  idP: idP,
                  name: product.name,
                  effectiveSpeed: product.effectiveSpeed,
                  lighting: product.lighting,
                  reflection: product.reflection,
                  mrender: product.mrender,
                  gravity: product.gravity,
                  image: product.image,
                };
                dataArray.push(obj);
                updateCompare(dataArray, user?.uid, compareId);
                toast("Item added to compare slot 1");
              });
          } else if (dataArray.length == 1) {
            product
              .filter((product) => product.id === idP)
              .map((product) => {
                var obj = {
                  idP: idP,
                  name: product.name,
                  effectiveSpeed: product.effectiveSpeed,
                  lighting: product.lighting,
                  reflection: product.reflection,
                  mrender: product.mrender,
                  gravity: product.gravity,
                  image: product.image,
                };
                dataArray.push(obj);
                updateCompare(dataArray, user?.uid, compareId);
              });
            toast("Item added to compare slot 2");
          } else {
            toast("Compare slot is full");
          }
        });
      getData();
    } catch (e: any) {
      toast(e);
    }
    setBusy(false);
  }

  async function updateCompare(
    items: Array<any>,
    userId: any,
    compareId: string
  ) {
    setBusy(true);
    const docRef = doc(db, "compare", compareId);
    try {
      await updateDoc(docRef, { items, userId });
    } catch (e: any) {
      toast(e);
    }
    setBusy(false);
  }

  const setSearchValue = (e: any) => {
    setSearch(e.target.value!);
  };

  const setCat = (e: any) => {
    setcatSearch(e.target.value!);
  };

  useEffect(() => {
    setDisplayProduct(product);
    if(search == 'all' || search == ''){
      if(catSearch == "all"){
        //no search no categories
        setDisplayProductDefault(allproduct);
        setDisplayProduct(allproduct);
      } else {
        //no search but yes categories

        setDisplayProduct(allproduct.filter((allproduct) => {
          return allproduct.category.includes(catSearch);
        }));
      }
    } else {
      if (search && search.trim() !== '') {
        if(catSearch == "all"){
          //search but no categories
          setDisplayProduct(allproduct.filter((allproduct) => {
            return allproduct.name.toLowerCase().includes(search.toLowerCase());
          }));
        } else {
          //search and categories
          try{
            setDisplayProductDefault(allproduct.filter((allproduct) => {
              return allproduct.name.toLowerCase().includes(search.toLowerCase());
            }));

            setDisplayProduct(displayproductDefault.filter((displayproductDefault) => {
              return displayproductDefault.category.includes(catSearch);
            }));
          } catch ( e: any ){
            toast(e);
          }
        }
      }
    }
    console.log(displayproduct);

    if (user) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, [search, catSearch, product]);

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
      <IonLoading message="Please wait..." duration={0} isOpen={busy} />
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonSearchbar ref={searchbar} debounce={100} placeholder="Search your dream items" onIonChange={setSearchValue}></IonSearchbar>
          <IonSelect onIonChange={setCat} placeholder="Select One" >
            {categoryName.map((cat) => (
              <IonSelectOption key={cat.id} value={cat.name}>{cat.name}</IonSelectOption>
            ))}
          </IonSelect>
          <IonRow>
            {displayproduct && displayproduct.map((product) => (
              <IonCol size-sm="6" sizeMd="4" sizeLg="4">
                <IonCard className="categoryCard">
                  <IonFabButton
                    color="danger"
                    onClick={
                      isSignedIn
                        ? () =>
                            addToWishlist(
                              product.id,
                              product.image,
                              product.name,
                              product.price
                            )
                        : signedOut
                    }
                    size="small"
                    className="wishlist-button"
                  >
                    <IonIcon
                      className="wishlist-icon"
                      icon={heartOutline}
                    ></IonIcon>
                  </IonFabButton>
                  <IonFabButton
                          onClick={
                            isSignedIn
                              ? () => addToCompare(product.id)
                              : signedOut
                          }
                          size="small"
                          className="compare-button"
                        >
                          <IonIcon
                            className="compare-icon"
                            icon={gitCompareOutline}
                          ></IonIcon>
                  </IonFabButton>
                  <img className="cardImages" src={product.image} />
                  <IonCardTitle className="center-txt">
                    {product.name}
                  </IonCardTitle>
                  <IonCardContent className="center-txt font-size20">
                    {product.price == 0 ? (
                      <div>
                        <IonText className="ion-margin"></IonText>
                        <br />
                        <IonButton className="center-txt" color="danger">
                          <IonIcon icon={closeCircleOutline} />
                          Out of Stock
                        </IonButton>
                      </div>
                    ) : (
                      <div>
                        <IonText className="ion-margin">
                          {numberFormat(parseInt(product.price))}
                        </IonText>
                        <br />
                        <IonButton className="center-txt"
                        onClick={
                          isSignedIn
                            ? () =>
                                addToCart(
                                  product.id,
                                  product.image,
                                  product.name,
                                  product.price
                                )
                            : signedOut
                        }>
                          <IonIcon icon={cartOutline} />
                          Add to Cart
                        </IonButton>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Categories;
