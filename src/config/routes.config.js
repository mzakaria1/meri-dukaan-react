import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "../components/public/Login";
import Signup from "../components/public/Signup";
import ResetPassword from "../components/public/ResetPassword";
import Dashboard from "../components/private/Dashboard";
import Profile from "../components/private/Profiles/Profile";
import AllCollections from "../components/private/Collections/AllCollections";
import CollectionInfo from "../components/private/Collections/CollectionInfo";
import EditCollection from "../components/private/Collections/EditCollection";
import CreateCollection from "../components/private/Collections/CreateCollection";
import AllProducts from "../components/private/Products/AllProducts";
import AddNewProduct from "../components/private/Products/AddNewProduct";
import Orders from "../components/private/Orders/Orders";
import OrderInfo from "../components/private/Orders/OrderInfo";
import PendingOrders from "../components/private/Orders/PendingOrders";
import CompletedOrders from "../components/private/Orders/CompletedOrders";
import ConfirmedOrders from "../components/private/Orders/ConfirmedOrders";
import DeliveredOrders from "../components/private/Orders/DeliveredOrders";
import ReturnedOrders from "../components/private/Orders/ReturnedOrders";
import CancelledOrders from "../components/private/Orders/CancelledOrders";

import EditProduct from "../components/private/Products/EditProduct";
import ProductInfo from "../components/private/Products/ProductInfo";
import AllOrderInvoices from "../components/private/Invoices/AllOrderInvoices";
import SupplierInvoices from "../components/private/Invoices/SupplierInvoices";
import SupplierInvoice from "../components/private/Invoices/SupplierInvoice";
import OrderInvoice from "../components/private/Invoices/OrderInvoice";

import Suppliers from "../components/private/Profiles/Suppliers";
import ProfileInfo from "../components/private/Profiles/ProfileInfo";

export const MainRoutes = ({ authed }) => (
  <Switch>
    <PrivateRoute exact authed={authed} path="/" component={Dashboard} />
    <PrivateRoute authed={authed} path="/profile" component={Profile} />
    <PrivateRoute
      authed={authed}
      path="/collections"
      component={AllCollections}
    />
    <PrivateRoute
      authed={authed}
      path="/newCollectionForm"
      component={CreateCollection}
    />
    <PrivateRoute
      authed={authed}
      path="/collectionInfo"
      component={CollectionInfo}
    />
    <PrivateRoute
      authed={authed}
      path="/editCollection"
      component={EditCollection}
    />
    <PrivateRoute authed={authed} path="/products" component={AllProducts} />
    <PrivateRoute authed={authed} path="/productInfo" component={ProductInfo} />

    <PrivateRoute
      authed={authed}
      path="/addNewProduct"
      component={AddNewProduct}
    />
    <PrivateRoute authed={authed} path="/orders" component={Orders} />
    <PrivateRoute
      authed={authed}
      path="/pendingOrders"
      component={PendingOrders}
    />
    <PrivateRoute
      authed={authed}
      path="/completedOrders"
      component={CompletedOrders}
    />
    <PrivateRoute
      authed={authed}
      path="/confirmedOrders"
      component={ConfirmedOrders}
    />
    <PrivateRoute
      authed={authed}
      path="/deliveredOrders"
      component={DeliveredOrders}
    />
    <PrivateRoute
      authed={authed}
      path="/returnedOrders"
      component={ReturnedOrders}
    />
    <PrivateRoute
      authed={authed}
      path="/cancelledOrders"
      component={CancelledOrders}
    />
    <PrivateRoute authed={authed} path="/orderInfo" component={OrderInfo} />
    <PrivateRoute authed={authed} path="/editProduct" component={EditProduct} />

    <PrivateRoute
      authed={authed}
      path="/allOrderInvoices"
      component={AllOrderInvoices}
    />
    <PrivateRoute
      authed={authed}
      path="/supplierInvoices"
      component={SupplierInvoices}
    />
    <PrivateRoute
      authed={authed}
      path="/supplierInvoice"
      component={SupplierInvoice}
    />
    <PrivateRoute
      authed={authed}
      path="/orderInvoice"
      component={OrderInvoice}
    />
    <PrivateRoute authed={authed} path="/suppliers" component={Suppliers} />
    <PrivateRoute authed={authed} path="/profileInfo" component={ProfileInfo} />

    {/* All the Public Routes access to anybody */}
    <PublicRoute authed={authed} path="/login" component={Login} />
    <PublicRoute authed={authed} path="/signup" component={Signup} />
    <PublicRoute
      authed={authed}
      path="/reset-password"
      component={ResetPassword}
    />
    <Route render={() => <h3>No Match</h3>} />
  </Switch>
);

export function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === false ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
