import React from "react";

import { message, Spin, Button, Switch, Table, Input } from "antd";
import MainLayout from "../../common/Layout";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

export class Suppliers extends React.Component {
  state = {
    users: null,
    users_loading: false,
    switch_loading: false,
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...this.getColumnSearchProps("name"),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ...this.getColumnSearchProps("username"),
      render: (text, record) => {
        return (
          <Button onClick={() => this.supplierInvoices(record)}>{text}</Button>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      // ...this.getColumnSearchProps("role"),
      filters: [
        {
          text: "Supplier",
          value: "Supplier",
        },
        {
          text: "Reseller",
          value: "Public",
        },
      ],
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => a.stock_quantity - b.stock_quantity,
      render: (role) => {
        if (role === "Public") return "Reseller";
        else return role;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...this.getColumnSearchProps("email"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Confirmed",
      dataIndex: "confirmed",
      key: "confirmed",
      render: (text, record) => {
        return (
          <div>
            <Switch
              loading={this.state.switch_loading}
              checkedChildren={"Confirmed"}
              unCheckedChildren={"UnConfirmed"}
              //   defaultChecked={text === true ? true : false}
              defaultChecked={record.confirmed}
              //   checked={record.confirmed}
              onChange={() => this.changeConfirm(text, record)}
            />
          </div>
        );
      },
    },
    {
      title: "Blocked",
      dataIndex: "blocked",
      key: "blocked",
      render: (text, record) => {
        return (
          <div>
            <Switch
              loading={this.state.switch_loading}
              checkedChildren={"Blocked"}
              unCheckedChildren={"UnBlocked"}
              defaultChecked={text === true ? true : false}
              onChange={() => this.changeBlocked(text, record)}
            />
          </div>
        );
      },
    },
  ];

  supplierInvoices = (record) => {
    this.props.history.push("/supplierInvoice/" + record.id);
  };

  changeConfirm = async (confirmStatus, record) => {
    this.setState({
      switch_loading: true,
    });
    const users = this.state.users;
    await users.map((ele) => {
      if (ele.id === record.id) {
        ele.confirmed = !confirmStatus;
        return;
      }
    });

    await authedAxios
      .put(`/users/${record.id}`, {
        confirmed: !confirmStatus,
      })
      .then((res) => {
        this.setState({
          switch_loading: false,
          users,
        });
        message.success(
          `Confirming Status of ${record.username.toUpperCase()} has been Successfully Changed`,
          2.5
        );
      })
      .catch((err) => message.error(`There is some Error: ${err}`));
  };

  changeBlocked = async (blockedStatus, record) => {
    this.setState({
      switch_loading: true,
    });
    const users = this.state.users;
    await users.map((ele) => {
      if (ele.id === record.id) {
        ele.blocked = !blockedStatus;
        return;
      }
    });

    await authedAxios
      .put(`/users/${record.id}`, {
        blocked: !blockedStatus,
      })
      .then((res) => {
        this.setState({
          switch_loading: false,
          users,
        });
        message.success(
          `Blocking Status of ${record.username.toUpperCase()} has been Successfully Changed`,
          2.5
        );
      })
      .catch((err) => message.error(`Error: ${err}`));
  };
  getUsers = () => {
    authedAxios
      .get("/users")
      .then((res) => {
        let pros = [];
        res.data.map((ele) => {
          pros.push({
            ...ele,
            role: ele.role.name,
          });
        });
        this.setState({
          users: pros,
          users_loading: true,
        });
      })
      .catch((err) => {
        message.success(`THere is some error: ${err}`);
      });
  };

  componentDidMount() {
    this.getUsers();
  }

  render() {
    return (
      <MainLayout {...this.props}>
        {localStorage.getItem("userRole") === "admin" ? (
          <Table
            loading={!this.state.users_loading}
            columns={this.columns}
            dataSource={this.state.users}
            rowKey="id"
          />
        ) : (
          <Spin
            spinning={this.state.users_loading}
            tip={"Loading User Profile..."}></Spin>
        )}
      </MainLayout>
    );
  }
}

export default Suppliers;
