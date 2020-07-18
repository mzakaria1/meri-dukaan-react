import React from "react";

import { message, Descriptions, Spin } from "antd";
import MainLayout from "../../common/Layout";
import { authedAxios, axios } from "../../../config/axios.config";

export class ProfileInfo extends React.Component {
  state = {
    user: null,
    user_loading: false,
    users: null,
    users_loading: false,
    switch_loading: false,
  };

  getProfile = async () => {
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    await authedAxios
      .get(`/users/${key[2]}`)
      .then((res) => {
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
            <Descriptions.Item label="Username">
              {this.state.user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {this.state.user.email}
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
            tip={"Loading Supplier Profile..."}></Spin>
        )}
      </MainLayout>
    );
  }
}

export default ProfileInfo;
