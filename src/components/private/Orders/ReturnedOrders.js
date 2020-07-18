import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Table, Divider, message, Button, Tag } from "antd";
import { BorderOutlined, FundViewOutlined } from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

class ReturnedOrders extends Component {
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
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "Returned")
          return (
            <Tag key={status} color="pink">
              {status}
            </Tag>
          );
        else if (status === "Return Confirmed")
          return (
            <Tag key={status} color="blue">
              {status}
            </Tag>
          );
        else if (status === "Return Rejected")
          return (
            <Tag key={status} color="maroon">
              {status}
            </Tag>
          );
        else return <Tag key={status}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          {localStorage.getItem("userRole") === "supplier" ? (
            record.status === "Returned" ? (
              <div>
                <div>
                  <Button
                    type="primary"
                    shape="round"
                    style={{
                      // float: "right",
                      width: "125px",
                      marginBottom: "10px",
                      backgroundColor: "green",
                      color: "white",
                    }}
                    loading={this.state.statusChange}
                    onClick={() => this.returnConfirmed(record.id)}>
                    Return Confirm
                  </Button>
                </div>
                <Divider type="vertical" />
                <div>
                  <Button
                    type="danger"
                    shape="round"
                    style={{ width: "125px" }}
                    loading={this.state.statusChange}
                    onClick={() => this.returnRejected(record.id)}>
                    Return Reject
                  </Button>
                </div>
              </div>
            ) : record.status === "Return Rejected" ? (
              <div>
                <Button
                  type="primary"
                  shape="round"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    backgroundColor: "green",
                    color: "white",
                  }}
                  loading={this.state.statusChange}
                  onClick={() => this.returnConfirmed(record.id)}>
                  Return Confirm
                </Button>
              </div>
            ) : record.status === "Return Confirmed" ? (
              ""
            ) : (
              ""
            )
          ) : (
            <div>
              <Button
                type="primary"
                shape="round"
                style={{
                  float: "right",
                  marginBottom: "10px",
                  backgroundColor: "green",
                  color: "white",
                }}
                loading={this.state.statusChange}
                onClick={() => this.orderInfoForm(record.id)}>
                <BorderOutlined />
                View Order
              </Button>
            </div>
          )}
        </span>
      ),
    },
  ];

  orderInfoForm = (id) => {
    this.props.history.push("/orderInfo/" + id);
  };
  returnRejected = (id) => {
    authedAxios
      .put(`/orders/${id}`, { status: "Return Rejected" })
      .then(async (res) => {
        let previousOrders = this.state.orders;
        this.setState({ loading: true });
        await previousOrders.forEach((element) => {
          if (element.id === id) {
            element.status = "Return Rejected";
            return;
          }
        });
        this.setState({
          orders: previousOrders,
          loading: false,
        });
        message.success("Order has been Successfully Return Rejected", 1.5);
      })
      .catch((err) => {
        message.error("Error: " + err, 3.5);
      });
  };

  returnConfirmed = (id) => {
    authedAxios
      .put(`/orders/${id}`, { status: "Return Confirmed" })
      .then(async (res) => {
        let previousOrders = this.state.orders;
        this.setState({ loading: true });
        await previousOrders.forEach((element) => {
          if (element.id === id) {
            element.status = "Return Confirmed";
            return;
          }
        });
        this.setState({
          orders: previousOrders,
          loading: false,
        });
        await message.success(
          "Order has been Successfully Return Confirmed",
          1.5
        );
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

        if (localStorage.getItem("userRole") === "supplier") {
          res.data.map((element) => {
            if (element.vendor.id === localStorage.getItem("userId")) {
              if (
                (element.status === "Returned") |
                (element.status === "Return Rejected") |
                (element.status === "Return Confirmed")
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
            }
          });
          this.setState({
            orders: pro,
            loading_orders: true,
            loading: false,
          });
        } else {
          res.data.map((element) => {
            if (
              (element.status === "Returned") |
              (element.status === "Return Rejected") |
              (element.status === "Return Confirmed")
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
        }
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
        <h4>Returned, Return Confirmed and Return Rejected Orders </h4>
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

export default ReturnedOrders;
