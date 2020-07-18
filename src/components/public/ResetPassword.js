import React, { Component } from "react";
import { Layout, Form, Button, Input, Row, Col, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { resetPassword } from "../../helpers/auth";

const { Content } = Layout;

export class ResetPassword extends Component {
  state = {
    resetting: false,
  };

  onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { email } = values;
    this.setState({
      resetting: true,
    });
    resetPassword(email)
      .then((res) => {
        console.log(res);
        this.setState({
          resetting: false,
        });
        message.info(
          "A Reset Password Link has been sent to your email. Please check your email for further instructions."
        );
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          resetting: false,
        });
        message.error(error.message);
      });
  };
  render() {
    return (
      <div>
        <Layout className="layout">
          <Content style={{ padding: "50px" }}>
            <Row>
              <Col span={12} offset={6}>
                <div style={{ textAlign: "center" }}>
                  <h3>Reset Account Password</h3>
                </div>
                <Form
                  name="normal_login"
                  className="login-form"
                  onFinish={this.onFinish}>
                  <div style={{ textAlign: "center" }}>
                    Enter your account email below to get password reset link!
                  </div>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Username!",
                      },
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                    ]}>
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Email"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={this.state.resetting}>
                      Get Reset Link
                    </Button>{" "}
                    Or <Link to="/login">Sign In!</Link>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default ResetPassword;
