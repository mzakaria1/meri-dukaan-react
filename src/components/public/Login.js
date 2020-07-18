import React, { Component } from "react";
import { Layout, message } from "antd";

import mainImage from "../../meridukaanLogo.jpeg";
import { axios } from "../../config/axios.config";
import { messaging } from "../../init-fcm";

const { Content } = Layout;

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    const email = this.state.email;
    const password = this.state.password;
    event.preventDefault();
    message.loading("Logging In..", 2.0);
    axios
      .post("/auth/local/", {
        identifier: email,
        password,
      })
      .then(async (res) => {
        const UserId = res.data.user.id;
        const LoggedInUsername = res.data.user.username;
        const role = res.data.user.role.type;
        console.log(res);
        if (res.data.user.role.type === "supplier") {
          message.success(
            "Welcome " + res.data.user.role.name + "  " + res.data.user.name,
            2.0
          );
          const token = res.data.jwt;
          localStorage.setItem("jwt", token);
          localStorage.setItem("LoggedInUsername", LoggedInUsername);
          localStorage.setItem("userId", UserId);
          localStorage.setItem("userRole", role);
          messaging
            .requestPermission()
            .then(async function () {
              const fcm = await messaging.getToken();
              console.log(fcm);
              await axios.put(
                `/users/${UserId}`,
                { fcmToken: fcm },
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
              window.location = "/";
            })
            .catch(function (err) {
              console.log("Unable to get permission to notify.", err);
              window.location = "/";
            });
        } else if (res.data.user.role.type === "admin") {
          message.success("Welcome " + res.data.user.role.name, 2.0);
          const token = res.data.jwt;
          localStorage.setItem("jwt", token);
          localStorage.setItem("LoggedInUsername", LoggedInUsername);
          localStorage.setItem("userId", UserId);
          localStorage.setItem("userRole", role);
          window.location = "/";
        } else {
          message.error("Invalid Account Type!", 1.5);
        }
      })
      .catch((error) => {
        console.log(error);
        const status = error.response.status;
        console.log(status);
        if (status === 400) {
          message.error("The Email or Password is Incorrect! ", 3.5);
        } else if (status === 404) {
          message.error("This Account Doesn't Exist! ", 3.5);
        }
        this.setState({
          loggingIn: false,
        });
      });
  };
  // state = {
  //   loggingIn: false,
  // };
  openSignupForm = () => {
    this.props.history.push("/signup");
  };
  onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { email, password } = values;
    this.setState({
      loggingIn: true,
    });

    axios
      .post("/auth/local/", {
        identifier: email,
        password,
      })
      .then(async (res) => {
        const UserId = res.data.user.id;
        const LoggedInUsername = res.data.user.username;
        const role = res.data.user.role.type;
        console.log(res);

        if (res.data.user.role.type === "supplier") {
          message.success("Welcome " + res.data.user.role.name, 2.0);
          const token = res.data.jwt;
          localStorage.setItem("jwt", token);
          localStorage.setItem("LoggedInUsername", LoggedInUsername);
          localStorage.setItem("userId", UserId);
          localStorage.setItem("userRole", role);
          messaging
            .requestPermission()
            .then(async function () {
              const fcm = await messaging.getToken();
              console.log(fcm);
              await axios.put(
                `/users/${UserId}`,
                { fcmToken: fcm },
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
              window.location = "/";
            })
            .catch(function (err) {
              message.error("Unable to get permission to notify.", err);
              window.location = "/";
            });
        } else if (res.data.user.role.type === "admin") {
          message.success("Welcome " + res.data.user.role.name, 2.0);
          const token = res.data.jwt;
          localStorage.setItem("jwt", token);
          localStorage.setItem("LoggedInUsername", LoggedInUsername);
          localStorage.setItem("userId", UserId);
          localStorage.setItem("userRole", role);
          window.location = "/";
        } else {
          message.error("Invalid Account Type!", 1.5);
        }
      })
      .catch((error) => {
        console.log(error);
        const status = error.response.status;
        console.log(status);
        if (status === 400) {
          message.error("The Email or Password is Incorrect! ", 3.5);
        } else if (status === 404) {
          message.error("This Account Doesn't Exist! ", 3.5);
        }
        this.setState({
          loggingIn: false,
        });
      });
  };
  render() {
    return (
      // <div>
      //   <Layout className="layout">
      //     <Content style={{ padding: "50px" }}>
      //       <Row
      //         type="flex"
      //         justify="center"
      //         align="middle"
      //         style={{ minHeight: "100vh" }}>
      //         <Col span={6} offset={0}>
      //           <div style={{ textAlign: "center" }}>
      //             <h1>Welcome to "Meri Dukaan"</h1>
      //             <h3>Login</h3>
      //           </div>
      //           <Form
      //             name="normal_login"
      //             className="login-form"
      //             onFinish={this.onFinish}>
      //             <Form.Item
      //               name="email"
      //               rules={[
      //                 {
      //                   required: true,
      //                   message: "Please input your Username!",
      //                 },
      //                 {
      //                   type: "email",
      //                   message: "The input is not valid E-mail!",
      //                 },
      //               ]}>
      //               <Input
      //                 prefix={<UserOutlined className="site-form-item-icon" />}
      //                 placeholder="Email"
      //               />
      //             </Form.Item>
      //             <Form.Item
      //               name="password"
      //               rules={[
      //                 {
      //                   required: true,
      //                   message: "Please input your Password!",
      //                 },
      //               ]}>
      //               <Input
      //                 prefix={<LockOutlined className="site-form-item-icon" />}
      //                 type="password"
      //                 placeholder="Password"
      //               />
      //             </Form.Item>
      //             <Form.Item>
      //               <Link to="/reset-password">Forgot password</Link>
      //             </Form.Item>

      //             <Form.Item>
      //               <Button
      //                 type="primary"
      //                 htmlType="submit"
      //                 className="login-form-button"
      //                 loading={this.state.loggingIn}>
      //                 Log in
      //               </Button>
      //               <span style={{ marginLeft: "5px" }}>
      //                 Or <Link to="/signup">Register Now!</Link>
      //               </span>
      //             </Form.Item>
      //           </Form>
      //         </Col>
      //       </Row>
      //     </Content>
      //   </Layout>
      // </div>

      <div class="limiter">
        <div class="container-login100">
          <div class="wrap-login100">
            <div class="login100-pic js-tilt" data-tilt>
              <img src={mainImage} alt="IMG" />
            </div>
            <form
              class="login100-form validate-form"
              onSubmit={this.handleSubmit}>
              <span class="login100-form-title">
                Meri Dukaan <br />
                Login
              </span>

              <div
                class="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz">
                <input
                  class="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
                <span class="focus-input100"></span>
                <span class="symbol-input100">
                  <i class="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div
                class="wrap-input100 validate-input"
                data-validate="Password is required">
                <input
                  class="input100"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
                <span class="focus-input100"></span>
                <span class="symbol-input100">
                  <i class="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div class="container-login100-form-btn">
                <button type="submit" class="login100-form-btn">
                  Login
                </button>
              </div>

              <div class="text-center p-t-136">
                <a class="txt2" onClick={() => this.openSignupForm()}>
                  Create your Account
                  <i
                    class="fa fa-long-arrow-right m-l-5"
                    aria-hidden="true"></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
