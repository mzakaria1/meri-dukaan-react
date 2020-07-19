import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Button, message, Spin, Divider, Table, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { authedAxios } from "../../../config/axios.config";
export class AllCustomers extends Component {
  state = {
    loading: false,
    customers: null,
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
      title: "Customer ID",
      dataIndex: "id",
      key: "id",
      ...this.getColumnSearchProps("id"),
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      ...this.getColumnSearchProps("mobile"),
    },
    {
      title: "Street",
      dataIndex: "street",
      key: "street",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      ...this.getColumnSearchProps("city"),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Pin Code",
      dataIndex: "code",
      key: "code",
      ...this.getColumnSearchProps("code"),
    },
  ];

  componentDidMount() {
    this.loadCustomers();
  }

  loadCustomers = async () => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      this.setState({ loading: true });
      await authedAxios
        .get(`/customers`)
        .then((res) => {
          console.log(res.data);
          this.setState({
            customers: res.data,
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
          message.error("Error: " + err, 3.5);
        });
    } else {
      message.error("Only Admin can View This Page ", 4.5);
    }
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <div
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#fff",
            paddingRight: "10px",
          }}>
          <h3 style={{ float: "left", margin: "10px", marginLeft: 0 }}>
            All Customers
          </h3>
        </div>
        <Divider />
        <Table
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.customers}
          rowKey="id"
        />
      </MainLayout>
    );
  }
}

export default AllCustomers;
