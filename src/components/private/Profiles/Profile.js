import React from "react";

import {
  message,
  Descriptions,
  Spin,
  Button,
  Divider,
  Switch,
  Table,
  Input,
} from "antd";
import MainLayout from "../../common/Layout";
import Highlighter from "react-highlight-words";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { authedAxios, axios } from "../../../config/axios.config";

export class Profile extends React.Component {
  state = {
    user: null,
    user_loading: false,
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
              defaultChecked={text === true ? true : false}
              // checked={text === true ? text : false}
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
      render: (text) => {
        return (
          <div>
            <Switch
              loading={this.state.switch_loading}
              checkedChildren={"Blocked"}
              unCheckedChildren={"UnBlocked"}
              defaultChecked={text === true ? true : false}
              checked={text === true ? text : false}
            />
          </div>
        );
      },
    },
  ];

  changeConfirm = async (confirmStatus, record) => {
    this.setState({
      switch_loading: true,
    });
    const users = this.state.users;
    let newUsers = [];
    await users.map((ele) => {
      if (ele.id === record.id) {
        newUsers.push({
          confirmed: !confirmStatus,
          ...ele,
        });
      } else {
        newUsers.push({
          ...ele,
        });
      }
    });
    await authedAxios
      .put(`/users/${record.id}`, {
        confirmed: !confirmStatus,
      })
      .then((res) => {
        this.setState(
          {
            switch_loading: false,
            users: newUsers,
          },
          () => {
            console.log(this.state.users);
          }
        );
        confirmStatus === true
          ? message.success(
              `${record.username.toUpperCase()} has been Confirmed`,
              3.5
            )
          : message.success(`${record.username} has been Un-Confirmed`, 3.5);
      })
      .catch((err) => message.error(`There is some Error: ${err}`));
  };

  getProfile = async () => {
    const allUsers = await axios.get("/users");
    console.log(allUsers);

    await authedAxios
      .get("/users/me")
      .then((res) => {
        console.log(res);
        console.log(res.data.blocked);

        this.setState({
          user: res.data,
          user_loading: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getProfile();
  }

  render() {
    return (
      <MainLayout {...this.props}>
        {this.state.user_loading ? (
          <Descriptions
            title="Supplier Info"
            bordered={true}
            column={1}
            colon={true}>
            <Descriptions.Item label="Name">
              {this.state.user.name}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {this.state.user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {this.state.user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {this.state.user.address}
            </Descriptions.Item>
            <Descriptions.Item label="User Role">
              {this.state.user.role.name}
            </Descriptions.Item>
            <Descriptions.Item label="Blocked">
              {this.state.user.blocked === false ? "NO" : "YES"}
            </Descriptions.Item>
            <Descriptions.Item label="Confirmed" key={5}>
              {this.state.user.confirmed === true ? "YES" : "NO"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Spin
            spinning={this.state.user_loading}
            tip={"Loading User Profile..."}></Spin>
        )}
      </MainLayout>
    );
  }
}

export default Profile;
