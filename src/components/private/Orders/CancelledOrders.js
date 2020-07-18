import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Table, Divider, Tag, Button } from "antd";
import { FundViewOutlined } from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

class CancelledOrders extends Component {
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
  ];

  orderInfoForm = (id) => {
    this.props.history.push("/orderInfo/" + id);
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
              element.status === "Cancelled") ||
            (localStorage.getItem("userRole") === "admin" &&
              element.status === "Cancelled")
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

  componentDidMount = () => {
    this.allOrders();
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <h4>Cancelled Orders </h4>
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

export default CancelledOrders;
