import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  ProfileOutlined,
  HddOutlined,
  ContainerOutlined,
  SnippetsOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;

const Navigation = (props) => {
  const pathname = props.location.pathname;
  const userRole = localStorage.getItem("userRole");
  return (
    <div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[pathname]}
        mode="inline"
        onClick={(e) => {
          if (e.key !== "logout") {
            props.history.push(e.key);
          }
        }}>
        <Menu.Item key="/">
          <HomeOutlined />
          <span>Dashboard</span>
        </Menu.Item>

        <Menu.Item key="/collections">
          <HddOutlined />
          <span>Collections</span>
        </Menu.Item>

        <Menu.Item key="/products">
          <HddOutlined />
          <span>Products</span>
        </Menu.Item>

        <SubMenu
          key="orders"
          title={
            <span>
              <SnippetsOutlined />
              <span>Orders</span>
            </span>
          }>
          <Menu.Item key="/orders">All Orders</Menu.Item>
          <Menu.Item key="/pendingOrders">Pending Orders</Menu.Item>
          <Menu.Item key="/confirmedOrders">Confirmed Orders</Menu.Item>
          <Menu.Item key="/deliveredOrders">Delivered Orders</Menu.Item>
          <Menu.Item key="/returnedOrders">Returned Orders</Menu.Item>
          <Menu.Item key="/completedOrders">Completed Orders</Menu.Item>
          <Menu.Item key="/cancelledOrders">Cancelled Orders</Menu.Item>
        </SubMenu>

        {userRole === "supplier" ? (
          <SubMenu
            key="/reports"
            title={
              <span>
                <ContainerOutlined />
                <span>Invoices</span>
              </span>
            }>
            <Menu.Item key="/allOrderInvoices">Order Invoices</Menu.Item>
          </SubMenu>
        ) : (
          <Menu.Item key="/suppliers">
            <UsergroupDeleteOutlined />
            <span>Suppliers</span>
          </Menu.Item>
        )}
        {localStorage.getItem("userRole") === "admin" ? (
          <SubMenu
            key="/reports"
            title={
              <span>
                <ContainerOutlined />
                <span>Invoices</span>
              </span>
            }>
            <Menu.Item key="/supplierInvoices">Supplier Invoices</Menu.Item>
          </SubMenu>
        ) : (
          ""
        )}

        <Menu.Item key="/profile">
          <ProfileOutlined />
          <span>My Profile</span>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Navigation;
