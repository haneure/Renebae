import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  archiveOutline,
  archiveSharp,
  bagOutline,
  bagSharp,
  bookmarkOutline,
  cartOutline,
  cartSharp,
  cashOutline,
  cashSharp,
  closeOutline,
  closeSharp,
  cubeOutline,
  cubeSharp,
  gitCompareOutline,
  gitCompareSharp,
  heartOutline,
  heartSharp,
  homeOutline,
  homeSharp,
  logInOutline,
  logInSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  personOutline,
  personSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
} from "ionicons/icons";
import "./Menu.css";
import { getAuth } from "firebase/auth";
import firebaseInit from "../firebase_config";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

let appPages: AppPage[] = [
  {
    title: "Login",
    url: "/page/Login",
    iosIcon: logInOutline,
    mdIcon: logInSharp,
  },
  {
    title: "Home",
    url: "/Home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Profile",
    url: "/page/Profile",
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
  {
    title: "Category",
    url: "/page/Categories/all",
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },
  {
    title: "Wishlist",
    url: "/page/Wishlist",
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: "Cart",
    url: "/page/Cart",
    iosIcon: cartOutline,
    mdIcon: cartSharp,
  },
  {
    title: "Logout",
    url: "/page/Logout",
    iosIcon: closeOutline,
    mdIcon: closeSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  const auth = getAuth(firebaseInit);
  const user = auth.currentUser;

  if (user && user?.email === "admin@renebae.com") {
    appPages = [
      {
        title: "Home",
        url: "/page/Admin",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
      },
      {
        title: "Orders",
        url: "/page/Admin/Orders",
        iosIcon: cashOutline,
        mdIcon: cashSharp,
      },
      {
        title: "Categories",
        url: "/page/Admin/Categories",
        iosIcon: paperPlaneOutline,
        mdIcon: paperPlaneSharp,
      },
      {
        title: "Products",
        url: "/page/Admin/Products",
        iosIcon: cubeOutline,
        mdIcon: cubeSharp,
      },
      {
        title: "Logout",
        url: "/page/Logout",
        iosIcon: closeOutline,
        mdIcon: closeSharp,
      },
    ];
  } else if (user) {
    appPages = [
      {
        title: "Home",
        url: "/Home",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
      },
      {
        title: "Profile",
        url: "/page/Profile",
        iosIcon: personOutline,
        mdIcon: personSharp,
      },
      {
        title: "Orders",
        url: "/page/Orders",
        iosIcon: bagOutline,
        mdIcon: bagSharp,
      },
      {
        title: "Category",
        url: "/page/Categories/all",
        iosIcon: paperPlaneOutline,
        mdIcon: paperPlaneSharp,
      },
      {
        title: "Wishlist",
        url: "/page/Wishlist",
        iosIcon: heartOutline,
        mdIcon: heartSharp,
      },
      {
        title: "Cart",
        url: "/page/Cart",
        iosIcon: cartOutline,
        mdIcon: cartSharp,
      },
      {
        title: "Compare",
        url: "/page/Compare",
        iosIcon: gitCompareOutline,
        mdIcon: gitCompareSharp,
      },
      {
        title: "Logout",
        url: "/page/Logout",
        iosIcon: closeOutline,
        mdIcon: closeSharp,
      },
    ];
  } else {
    appPages = [
      {
        title: "Login",
        url: "/page/Login",
        iosIcon: logInOutline,
        mdIcon: logInSharp,
      },
      {
        title: "Home",
        url: "/Home",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
      },
      {
        title: "Category",
        url: "/page/Categories/all",
        iosIcon: paperPlaneOutline,
        mdIcon: paperPlaneSharp,
      },
    ];
  }

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Renebae</IonListHeader>
          <IonNote>renebaeofficial@gmail.com</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
