import React, { Component } from "react";
import { Layout, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import mainImage from "../../meridukaanLogo.jpeg";
import { axios } from "../../config/axios.config";

const { Content } = Layout;

export class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      email: "",
      password: "",
      address: "",
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
    event.preventDefault();
    const name = this.state.name;
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const address = this.state.address;
    message.loading("Please wait... ", 3.5);
    const roles = await axios.get(`/users-permissions/roles`);
    let role = "";
    roles.data.roles.map((ele) => {
      if (ele.type === "supplier") {
        role = ele.id;
        return;
      }
    });
    await axios
      .post("/auth/local/register", {
        name,
        email,
        password,
        username,
        address,
        role: role,
        confirmed: "true",
      })
      .then(async (res) => {
        console.log(res);
        await message.success("New Account Created Successfully!", 3.5, () => {
          this.props.history.push("/");
        });
      })
      .catch((error) => {
        console.log(error);
        // this.setState({
        //   signingUp: false,
        // });
        message.error(error);
      });
  };

  // state = {
  //   signingUp: false,
  // };

  openLoginForm = () => {
    this.props.history.push("/login");
  };

  onFinish = (values, e) => {
    e.preventDefault();
    console.log("Received values of form: ", values);

    // const { email, password, name } = values;
    // this.setState({
    //   signingUp: true,
    // });

    // axios
    //   .post("/auth/local/register", {
    //     email,
    //     password,
    //     username: name,
    //     role: "Public",
    //     confirmed: "true",
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     message.success("New Account Created Successfully!", 1.5, () => {
    //       this.props.history.push("/");
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.setState({
    //       signingUp: false,
    //     });
    //     message.error(error.message);
    //   });
  };
  render() {
    return (
      // <div>
      //   <Layout className="layout">
      //     <Content style={{ padding: "50px" }}>
      //       <Row
      //         // type="flex"
      //         // justify="center"
      //         align="middle"
      //         style={{ minHeight: "100vh" }}>
      //         <Col span={12} offset={6}>
      //           <div style={{ textAlign: "center" }}>
      //             <h3>Signup</h3>
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
      //             <Form.Item
      //               name="name"
      //               rules={[
      //                 { required: true, message: "Please input your Name!" },
      //               ]}>
      //               <Input
      //                 prefix={<LockOutlined className="site-form-item-icon" />}
      //                 type="text"
      //                 placeholder="Name"
      //               />
      //             </Form.Item>

      //             <Form.Item>
      //               <Button
      //                 type="primary"
      //                 htmlType="submit"
      //                 className="login-form-button"
      //                 loading={this.state.signingUp}>
      //                 Create New Account
      //               </Button>{" "}
      //               Or Already have an account?{" "}
      //               <Link to="/login">Login Now!</Link>
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
                Suuplier <br />
                Signup
              </span>

              <div
                class="wrap-input100 validate-input"
                data-validate="Name is Required">
                <input
                  class="input100"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  required
                />
                <span class="focus-input100"></span>
                <span class="symbol-input100">
                  <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                </span>
              </div>
              <div
                class="wrap-input100 validate-input"
                data-validate="Username is required">
                <input
                  class="input100"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  required
                />
                <span class="focus-input100"></span>
                <span class="symbol-input100">
                  <i class="fa fa-user" aria-hidden="true"></i>
                </span>
              </div>
              <div
                class="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz">
                <input
                  class="input100"
                  type="email"
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

              <div
                class="wrap-input100 validate-input"
                data-validate="Address is Required">
                <input
                  class="input100"
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={this.state.address}
                  onChange={this.handleChange}
                />
                <span class="focus-input100"></span>
                <span class="symbol-input100">
                  <i class="fa fa-address-card-o " aria-hidden="true"></i>
                </span>
              </div>

              <div class="container-login100-form-btn">
                <button type="submit" class="login100-form-btn">
                  SignUp
                </button>
              </div>

              <div class="text-center p-t-136">
                <a class="txt2" onClick={() => this.openLoginForm()}>
                  Already have Account?
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

export default Signup;
