import React, { Component } from "react";

import { BrowserRouter } from "react-router-dom";
import { MainRoutes } from "../config/routes.config";

import { Spin, notification, message } from "antd";

import "antd/dist/antd.css";
import { messaging } from "../init-fcm";

const openNotificationWithIcon = (message) => {
  notification["info"]({
    message: message.title,
    description: message.body,
  });
};

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
  };
  componentDidMount() {
    const token = localStorage.getItem("jwt");
    if (token) {
      this.setState({
        authed: true,
        loading: false,
      });
    } else {
      this.setState({
        authed: false,
        loading: false,
      });
    }

    navigator.serviceWorker.addEventListener("message", (message) => {
      console.log(message);
      if (message.data["firebase-messaging-msg-data"])
        openNotificationWithIcon(
          message.data["firebase-messaging-msg-data"].notification
        );
    });
  }
  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    return this.state.loading === true ? (
      <div style={{ textAlign: "center" }}>
        <Spin spinning={this.state.loading} tip="Loading Application..." />
      </div>
    ) : (
      <BrowserRouter>
        <MainRoutes authed={this.state.authed} />
      </BrowserRouter>
    );
  }
}
