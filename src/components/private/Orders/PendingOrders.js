import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Table, Divider, message, Button, Tag } from "antd";
import { FundViewOutlined } from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

class PendingOrders extends Component {
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
                style={{ width: "75px", background_color: "Green" }}
                loading={this.state.statusChange}
                onClick={() => this.confirmOrder(record)}>
                Confirm
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

  confirmOrder = async (record) => {
    console.log(record);
    let len = 0;
    let product_ids_quantity = [];
    let ordered_products = record.ordered_products;
    ordered_products.forEach((element) => {
      let stock = element.product.stock_quantity;
      if (element.quantity < stock) {
        len++;
        product_ids_quantity.push({
          id: element.product.id,
          quantity: stock,
          newQuantity: stock - element.quantity,
        });
      }
    });
    console.log(len);

    if (len === ordered_products.length) {
      this.setState({ loading: true, statusChange: true });
      product_ids_quantity.map(async (element) => {
        await authedAxios.put(`/products/${element.id}`, {
          stock_quantity: element.newQuantity,
        });
      });
      await authedAxios.put(`/orders/${record.id}`, { status: "Confirmed" });

      let previousOrders = this.state.orders;

      await previousOrders.forEach((element) => {
        if (element.id === record.id) {
          element.status = "Confirmed";
          return;
        }
      });
      this.setState({
        orders: previousOrders,
        loading: false,
        statusChange: false,
      });

      await message.success("Order has been Successfully Confirmed", 1.5);
      window.location.reload();
    } else {
      message.warning("Products of this order are Out of Stock", 2.5);
    }
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
        res.data.forEach((element) => {
          if (
            (element.vendor.id === localStorage.getItem("userId") &&
              element.status === "Pending") ||
            (localStorage.getItem("userRole") === "admin" &&
              element.status === "Pending")
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
        <h4>Pending Orders </h4>
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

export default PendingOrders;
