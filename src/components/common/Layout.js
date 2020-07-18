import React from "react";

import { Layout, Button, Tag } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import Navigation from "../common/Navigation";

const { Header, Content, Footer, Sider } = Layout;

export class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  onLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("LoggedInUsername");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    window.location = "/login";
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}>
          <div
            className="logo"
            style={{
              height: "32px",
              background: "rgba(255, 255, 255, 0.2)",
              margin: "16px",
              color: "white",
            }}
          />
          <Navigation {...this.props} />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              background: "#fff",
              // textAlign: "right",
              paddingRight: "10px",
            }}>
            <div
              style={{
                textAlign: "center",
                width: "100%",
                overflow: "hidden",
              }}>
              <div
                style={{
                  // display: "inlineBlock",
                  // float: "left",
                  position: "absolute",
                  paddingTop: "15px",
                  // textAlign: "center",
                }}>
                <h1
                  style={{
                    textAlign: "center",
                    marginLft: "30px",
                    paddingLeft: "30px",
                    fontFamily: "Arial Black",
                    fontSize: "30px",
                    color: "purple",
                  }}>
                  <span style={{ fontFamily: "Bookman", fontSize: "22px" }}>
                    Welcome to
                  </span>
                  {"   "}
                  Meri Dukaan{"  "}
                  <span style={{ fontFamily: "Bookman", fontSize: "22px" }}>
                    Dashboard
                  </span>
                </h1>
              </div>
              <div
                style={{
                  float: "right",
                  overflow: "hidden",
                }}>
                {localStorage.getItem("userRole") === "supplier" ? (
                  <Button style={{ marginRight: "30px" }}>
                    Supplier:{" "}
                    {localStorage.getItem("LoggedInUsername").toUpperCase()}
                  </Button>
                ) : (
                  <Button style={{ marginRight: "30px" }}>
                    {localStorage.getItem("LoggedInUsername").toUpperCase()}
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<PoweroffOutlined />}
                  loading={this.state.iconLoading}
                  onClick={this.onLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </Header>
          <Content style={{ margin: "20px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360, background: "#fff" }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Meri Dukaan ©2020 Created by M. Zakaria Nazir
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;
