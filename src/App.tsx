import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Admin from './pages/Admin/Admin';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import CRUDCategories from './pages/Admin/CRUDCategories';
import CRUDProducts from './pages/Admin/CRUDProducts';
import EditCategory from './pages/Admin/UpdateCategories';
import AddCategory from './pages/Admin/AddCategories';
import CRUDOrders from './pages/Admin/CRUDOrders';
import ViewOrder from './pages/Admin/ViewOrder';
import Compare from './pages/Compare';
import UpdateProduct from './pages/Admin/UpdateProduct';
import AddProduct from './pages/Admin/AddProduct';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/Home" />
            </Route>
            <Route path="/page/Admin" exact={true}>
              <Admin />
            </Route>
            <Route path="/page/Admin/Categories" exact={true}>
              <CRUDCategories />
            </Route>
            <Route path="/page/Admin/Products" exact={true}>
              <CRUDProducts />
            </Route>
            <Route path="/page/Admin/Orders" exact={true}>
              <CRUDOrders />
            </Route>
            <Route path="/page/Profile" exact={true}>
              <Profile />
            </Route>
            <Route path="/page/Orders" exact={true}>
              <Orders />
            </Route>
            <Route path="/page/Wishlist" exact={true}>
              <Wishlist />
            </Route>
            <Route path="/page/test" exact={true}>
              <Page />
            </Route>
            <Route path="/Home" exact={true}>
              <Home />
            </Route>
            <Route path="/page/Cart" exact={true}>
              <Cart />
            </Route>
            <Route path="/page/Compare" exact={true}>
              <Compare />
            </Route>
            <Route path="/page/Cart/Checkout" exact={true}>
              <Checkout />
            </Route>
            <Route path="/page/Categories/:search" exact={true}>
              <Categories />
            </Route>
            <Route path="/page/Login" exact={true}>
              <Login />
            </Route>
            <Route path="/page/Signup" exact={true}>
              <Signup />
            </Route>
            <Route path="/page/editprofile" exact={true}>
              <EditProfile />
            </Route>
            <Route path="/page/editcategory/:id" exact={true}>
              <EditCategory />
            </Route>
            <Route path="/page/vieworder/:id" exact={true}>
              <ViewOrder />
            </Route>
            <Route path="/page/addcategory" exact={true}>
              <AddCategory />
            </Route>
            <Route path="/page/updateproduct/:id" exact={true}>
              <UpdateProduct />
            </Route>
            <Route path="/page/addproduct" exact={true}>
              <AddProduct />
            </Route>
            <Route path="/page/Logout" exact={true}>
              <Logout />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
