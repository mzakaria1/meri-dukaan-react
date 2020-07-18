import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Table, Divider, Tag, Button, Input } from "antd";
import { FundViewOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { authedAxios } from "../../../config/axios.config";

class AllOrderInvoices extends Component {
  state = {
    invoices: null,
    total_earnings: 0,
    loading_invoices: false,
    loading: true,
    supplier_earnings: 0,
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
      title: "Invoice ID",
      dataIndex: "id",
      key: "id",
      ...this.getColumnSearchProps("id"),
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            icon={<FundViewOutlined />}
            block
            style={{
              backgroundColor: "green",
            }}
            onClick={() => this.orderInvoice(record.id)}>
            View Invoice
          </Button>
        </div>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      ...this.getColumnSearchProps("order_id"),
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
            onClick={() => this.orderInfoForm(text)}>
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
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      ...this.getColumnSearchProps("supplier"),
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
      title: "Order Amount",
      dataIndex: "order_amount",
      key: "order_amount",
      render: (amount) => {
        return (
          <Tag key={amount} color="blue">
            {amount}
          </Tag>
        );
      },
    },

    {
      title: "Margin Applied",
      dataIndex: "margin_applied",
      key: "margin_applied",
      render: (amount) => {
        return (
          <Tag key={amount} color="purple">
            {amount}
          </Tag>
        );
      },
    },
    {
      title: "Supplier Earned",
      dataIndex: "earned_amount",
      key: "earned_amount",
      render: (amount) => {
        return (
          <Tag key={amount} color="darkGreen">
            {amount}
          </Tag>
        );
      },
    },
    {
      title: "Application Earned",
      dataIndex: "return_to_amount",
      key: "return_to_amount",
      render: (amount) => {
        return (
          <Tag key={amount} color="darkOrange">
            {amount}
          </Tag>
        );
      },
    },
  ];

  orderInvoice = (id) => {
    this.props.history.push("/orderInvoice/" + id);
  };

  orderInfoForm = (id) => {
    this.props.history.push("/orderInfo/" + id);
  };

  allInvoices = async () => {
    authedAxios
      .get(`/order-invoices`)
      .then(async (res) => {
        console.log(res.data);
        const invoices = res.data;
        let newInvoices = [];
        let se = 0;
        let tm = 0;
        let vendor = "";
        invoices.map((ele) => {
          if (localStorage.getItem("userId") === ele.vendor.id) {
            const products_count = ele.order.ordered_products;

            newInvoices.push({
              ...ele,
              order_id: ele.order.id,
              no_of_products: products_count.length,
              supplier: ele.vendor.name,
              status: ele.order.status,
              cusName: ele.customer.name,
              mobile: ele.customer.mobile,
            });
            se = se + ele.earned_amount;
            tm = tm + ele.return_to_amount;
            vendor = ele.vendor.name;
          }
        });
        console.log(newInvoices);
        this.setState({
          invoices: newInvoices,
          loading_invoices: true,
          total_earnings: tm,
          supplier_earnings: se,
          vendor,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount = () => {
    this.allInvoices();
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <div style={{ float: "left" }}>
          <h3>
            <span>Total Earning: </span>
            &nbsp;&nbsp;
            <span style={{ color: "brown", fontSize: "0.7em" }}>
              Rs. {this.state.supplier_earnings}
            </span>
          </h3>
        </div>
        <div style={{ float: "right" }}>
          <h3>
            <span>Total Amount Owe to Application: </span>
            &nbsp;&nbsp;
            <span style={{ color: "brown", fontSize: "0.7em" }}>
              Rs. {this.state.total_earnings}
            </span>
          </h3>
        </div>
        <Divider>Order Invoices</Divider>
        <Table
          loading={!this.state.loading_invoices}
          columns={this.columns}
          dataSource={this.state.invoices}
          rowKey="id"
        />
      </MainLayout>
    );
  }
}

export default AllOrderInvoices;
