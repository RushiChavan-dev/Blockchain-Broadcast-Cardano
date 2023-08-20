import Auth from './Components/Auth/Auth';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navigation } from './Components/Home/Navigation/Navigation';

import ScrollToTop from './Components/ScrollToTop/ScrollToTop';

import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import CartScreen from "./Screens/CartScreen/CartScreen";
import BookScreen from "./Screens/BookScreen/BookScreen";
import WishlistScreen from "./Screens/WishlistScreen/WishlistScreen";
import AuthorBooksScreen from './Screens/AuthorBooksScreen/AuthorBooksScreen';
import Browser from './Screens/Browser/Browser';
import Order from './Screens/Order/Order';
import OrderDetails from './Screens/Order/OrderDetails.tsx';

import { SideBar } from './Components/Dashboard/SideBar/SideBar';
import { ManagePersonalInfo } from './Components/Dashboard/PersonalInfoManager/ManagePersonalInfo';
import { UpdatePersonalInfo } from './Components/Dashboard/PersonalInfoManager/UpdatePersonalInfo';
import { NewCreditCard } from './Components/Dashboard/CreditCardManager/NewCreditCard';
import { NewShippingAddress } from './Components/Dashboard/ShippingAddressManager/NewShippingAddress';
import { ManageCreditCard } from './Components/Dashboard/CreditCardManager/ManageCreditCard';
import { ManageShippingAddress } from './Components/Dashboard/ShippingAddressManager/ManageShippingAddress';
import { UpdateCreditCard } from './Components/Dashboard/CreditCardManager/UpdateCreditCard';
import { UpdateShippingAddress } from './Components/Dashboard/ShippingAddressManager/UpdateShippingAddress';

function App() {
  return (

    <Router >
      <Navigation />
      <ScrollToTop>
        <Switch>

          <Route path='/dashboard'
            exact={true}>
            <div className="dashboard-divider">
              <SideBar />
              <ManagePersonalInfo />
            </div>
          </Route>

          <Route path='/dashboard/updating-shipping-adress'
            exact={true}>
            {/* After the user clicks the dashboard link, it opens the dashboard page */}
            <div className="dashboard-divider">
              <SideBar />
              <UpdateShippingAddress />
            </div>
          </Route>

          <Route path='/dashboard/updating-credit-card'
            exact={true}>
            <div className="dashboard-divider">
              <SideBar />
              <UpdateCreditCard />
            </div>
          </Route>


          <Route path='/dashboard/manage-shipping-address'
            exact={true}>
            <div className="dashboard-divider">
              <SideBar />
              <ManageShippingAddress />
            </div>
          </Route>

          <Route path='/dashboard/manage-credit-card'
            exact={true}>
            <div className="dashboard-divider">
              <SideBar />
              <ManageCreditCard />
            </div>
          </Route>
          <Route path='/dashboard/add-new-shipping-address'
            exact={true}>
            <div className="dashboard-divider">
              <SideBar />
              <NewShippingAddress />
            </div>
          </Route>
          <Route path='/dashboard/add-new-credit-card'
            exact={true}>
            <div className="dashboard-divider">
              <SideBar />
              <NewCreditCard />
            </div>
          </Route>
          <Route path='/dashboard/update-info'
            exact={true}>
            <div className="dashboard-divider">
              <SideBar />
              <UpdatePersonalInfo />
            </div>
          </Route>


          <Route path='/auth' exact={true}>
            <Auth />
          </Route>

          <Route path='/' exact={true}>
            <HomeScreen />
          </Route>

          <Route path='/cart/:id?'>
            <CartScreen />
          </Route>

          <Route path='/order' exact={true}>
            <Order />
          </Route>

          <Route exact path='/browse/:filter?/:sort?' component={Browser} />
          <Route exact path='/book/:id' component={BookScreen} />
          <Route exact path='/wishlist/:id?' component={WishlistScreen} />
          <Route exact path='/authorbooks/:id' component={AuthorBooksScreen} />
          <Route exact path='/order' component={Order} />
          <Route path="/order/:id" component={OrderDetails} />
        </Switch>
      </ScrollToTop>
    </Router>
  );
}

export default App;
