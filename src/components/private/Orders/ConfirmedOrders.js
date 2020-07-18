import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Table, Divider, message, Tag, Button } from "antd";
import { FundViewOutlined } from "@ant-design/icons";

import { authedAxios } from "../../../config/axios.config";

class ConfirmedOrders extends Component {
  state = {
    orders: null,
    loading_orders: false,
    loading: true,
    statusChange: false,
  };
  columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            icon={<FundViewOutlined />}
            block
            style={{
              backgroundColor: "lightBlue",
              color: "black",
            }}
            onClick={() => this.orderInfoForm(record.id)}>
            View Order
          </Button>
        </div>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "cusName",
      key: "cusName",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone No",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "No of Products",
      dataIndex: "no_of_products",
      key: "no_of_products",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (price) => {
        return (
          <Tag key={price} color="purple">
            Rs. {price}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <Tag key={status} color="green">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          <div>
            <div>
              <Button
                type="primary"
                shape="round"
                style={{ float: "right", marginBottom: "10px" }}
                loading={this.state.loading}
                onClick={() => this.deliverOrder(record.id)}>
                Delivered
              </Button>
            </div>
            <Divider type="vertical" />
            <div>
              <Button
                type="danger"
                style={{
                  width: "75px",
                  background_color: "Green",
                }}
                loading={this.state.statusChange}
                onClick={() => this.cancelOrder(record.id)}>
                Cancel
              </Button>
            </div>
          </div>
        </span>
      ),
    },
  ];

  orderInfoForm = (id) => {
    this.props.history.push("/orderInfo/" + id);
  };
  deliverOrder = (id) => {
    let product_id = "";
    authedAxios
      .put(`/orders/${id}`, { status: "Delivered" })
      .then(async (res) => {
        product_id = res.data.ordered_products;
        let previousOrders = this.state.orders;
        this.setState({ loading: true });
        await previousOrders.forEach((element) => {
          if (element.id === id) {
            element.status = "Delivered";
            return;
          }
        });
        this.setState({
          orders: previousOrders,
          loading: false,
        });
        await message.success("Order has been Successfully Delivered", 2.0);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  cancelOrder = (id) => {
    authedAxios
      .put(`/orders/${id}`, { status: "Cancelled" })
      .then(async (res) => {
        let previousOrders = this.state.orders;
        this.setState({ loading: true });
        await previousOrders.forEach((element) => {
          if (element.id === id) {
            element.status = "Cancelled";
            return;
          }
        });
        this.setState({
          orders: previousOrders,
          loading: false,
        });
        await message.success("Order has been Successfully Cancelled", 1.5);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  allOrders = async () => {
    await authedAxios
      .get(`/orders`)
      .then((res) => {
        console.log(res);

        var pro = [];
        res.data.map((element) => {
          if (
            (element.vendor.id === localStorage.getItem("userId") &&
              element.status === "Confirmed") ||
            (localStorage.getItem("userRole") === "admin" &&
              element.status === "Confirmed")
          ) {
            let productsCount = element.ordered_products;
            pro.push({
              ...element,
              cusName: element.customer.name,
              mobile: element.customer.mobile,
              size: element.customer.size,
              address: element.customer.address,
              city: element.customer.city,
              no_of_products: productsCount.length,
            });
          }
        });
        this.setState({
          orders: pro,
          loading_orders: true,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentWillMount = () => {
    this.allOrders();
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <h4>Confirmed Orders </h4>
        <Divider />
        <Table
          loading={!this.state.loading_orders}
          columns={this.columns}
          dataSource={this.state.orders}
          rowKey="id"
        />
      </MainLayout>
    );
  }
}

export default ConfirmedOrders;
