import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Table, Divider, Spin, Button, message, Tag, Input } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

class Orders extends Component {
  state = {
    orders: null,
    loading: true,
    statusChange: false,
    searchText: "",
    searchedColumn: "",
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}>
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <a onClick={() => this.orderInfoForm(record.id)}>View Order</a>
      ),
      // ...this.getColumnSearchProps("id"),
    },
    {
      title: "Customer Name",
      dataIndex: "cusName",
      key: "cusName",
      ...this.getColumnSearchProps("cusName"),
    },
    // {
    //   title: "Product Name",
    //   dataIndex: "productName",
    //   key: "productName",
    // },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "des",
    // },
    // {
    //   title: "Quantity",
    //   dataIndex: "quantity",
    //   key: "quantity",
    // },
    // {
    //   title: "Size",
    //   dataIndex: "size",
    //   key: "size",
    // },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone No",
      dataIndex: "mobile",
      key: "mobile",
      ...this.getColumnSearchProps("mobile"),
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
      render: (text, record) => {
        return (
          <Tag key={record.id} color="purple">
            Rs. {text}
          </Tag>
        );
      },
    },
    // {
    //   title: "Payment Method",
    //   dataIndex: "payMethod",
    //   key: "payMethod",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (
        status // Non-Approved(Cancelled), Approved, Pending, Delievered, Returned,Returned Confirmed, Completed
      ) => {
        if (status === "Pending")
          return (
            <Tag key={status} color="#DC143C">
              {status}
            </Tag>
          );
        else if (status === "Confirmed")
          return (
            <Tag key={status} color="olive">
              {status}
            </Tag>
          );
        else if (status === "Delivered")
          return (
            <Tag key={status} color="blue">
              {status}
            </Tag>
          );
        else if (status === "Completed")
          return (
            <Tag key={status} color="green">
              {status}
            </Tag>
          );
        else if (status === "Returned")
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
        else if (status === "Cancelled")
          return (
            <Tag key={status} color="red">
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
            <span>
              {record.status === "Pending" ? (
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
              ) : record.status === "Confirmed" ? (
                <div>
                  <Button
                    type="primary"
                    shape="round"
                    style={{ float: "right", marginBottom: "10px" }}
                    loading={this.state.statusChange}
                    onClick={() => this.deliverOrder(record.id)}>
                    Delievered
                  </Button>
                </div>
              ) : record.status === "Delivered" ? (
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
                    onClick={() => this.completeOrder(record)}>
                    Complete
                  </Button>
                </div>
              ) : record.status === "Returned" ? (
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
              )}
            </span>
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
                onClick={() => this.supplierDetails(record)}>
                <UserSwitchOutlined /> Supplier Details
              </Button>
            </div>
          )}
        </span>
      ),
    },
  ];

  supplierDetails = (record) => {
    this.props.history.push("/profileInfo/" + record.vendor.id);
  };

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

      message.success("Order has been Successfully Confirmed", 1.5);
    } else {
      message.warning("Products of this order are Out of Stock", 2.5);
    }
  };

  deliverOrder = (id) => {
    authedAxios
      .put(`/orders/${id}`, { status: "Delivered" })
      .then(async (res) => {
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
        message.success("Order has been Successfully Delivered", 2.0);
      })
      .catch((err) => {
        message.error("Error: " + err, 3.5);
      });
  };

  completeOrder = async (record) => {
    await authedAxios
      .put(`/orders/${record.id}`, { status: "Completed" })
      .then(async (res) => {
        let previousOrders = this.state.orders;
        this.setState({ loading: true });
        await previousOrders.forEach((element) => {
          if (element.id === record.id) {
            element.status = "Completed";
            return;
          }
        });
        this.setState({
          orders: previousOrders,
          loading: false,
        });
        const margin_amount = record.margin_amount;
        const delivery_charges = record.delivery_charges;

        const order_amount = record.total_amount;
        const total_products_price =
          order_amount - (margin_amount + delivery_charges);
        const margin_applied = 5;
        const return_to_amount = (total_products_price * margin_applied) / 100;
        const earned_amount = total_products_price - return_to_amount;
        const data = {
          total_products_price,
          margin_applied,
          order_amount,
          return_to_amount,
          earned_amount,
          order: record.id,
        };
        await authedAxios.post(`/order-invoices`, data);
        message.success("Order has been Successfully Completed", 1.5);
        // window.location.reload();
      })
      .catch((err) => {
        message.error("Error: " + err, 3.5);
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
        message.success("Order has been Successfully Cancelled", 1.5);
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
        message.success("Order has been Successfully Return Confirmed", 1.5);
      })
      .catch((err) => {
        message.error("Error: " + err, 3.5);
      });
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

  allOrders = async () => {
    await authedAxios
      .get(`/orders`)
      .then((res) => {
        console.log(res.data);
        var pro = [];
        res.data.forEach((element) => {
          if (
            element.vendor.id === localStorage.getItem("userId") ||
            localStorage.getItem("userRole") === "admin"
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
          loading: false,
        });
      })
      .catch((err) => {
        message.error("Error: " + err, 3.5);
        console.log(err);
      });
  };

  componentWillMount = () => {
    this.allOrders();
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <h4>All Orders </h4>
        <Divider />
        {this.state.loading ? (
          <Spin spinning={true} tip="Loading Orders..." />
        ) : (
          <Table
            loading={this.state.loading}
            columns={this.columns}
            dataSource={this.state.orders}
            rowKey="id"
          />
        )}
      </MainLayout>
    );
  }
}

export default Orders;
