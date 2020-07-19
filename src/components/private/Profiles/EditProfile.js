import React from "react";
import MainLayout from "../../common/Layout";
import { Form, Input, Button, Divider, message, Spin, Select } from "antd";
import { authedAxios } from "../../../config/axios.config";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "This field is required!",
  types: {
    email: "Not a validate email!",
    number: "Not a validate number!",
  },
  number: {
    range: "Must be between ${min} and ${max}",
  },
};
export class EditProfile extends React.Component {
  state = {
    profile: null,
  };
  onFinish = (values) => {
    const data = {
      name: values.name,
      address: values.address,
      username: values.username,
      password: values.password,
      email: values.email,
    };
    authedAxios
      .put(`/users/${localStorage.getItem("userId")}`, data)
      .then((res) => {
        this.props.history.push("/profile");
        message.success("Profile has been Edited Successfully!", 3.5);
      })
      .catch((err) => {
        console.log(err);
        message.error(err);
      });
  };
  cancelUpdate = () => {
    window.history.back();
  };
  loadDataForEdit = () => {
    // const dd = this.props.history.location.pathname;
    // const key = dd.split("/");
    const userId = localStorage.getItem("userId");
    authedAxios
      .get(`/users/${userId}`)
      .then((res) => {
        this.setState({
          profile: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response);
        message.error("Error : " + err, 3.5);
      });
  };
  componentDidMount() {
    this.loadDataForEdit();
  }

  render() {
    return (
      <MainLayout {...this.props}>
        <h4>Eidt Profile</h4>
        <Divider />
        {this.state.profile ? (
          <Form
            {...layout}
            name="Edit Profile"
            onFinish={this.onFinish}
            validateMessages={validateMessages}
            initialValues={{
              name: this.state.profile.name,
              username: this.state.profile.username,
              password: this.state.profile.password,
              address: this.state.profile.address,
              email: this.state.profile.email,
            }}>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="username" label="Username">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input.Password />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input.TextArea />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="danger" onClick={this.cancelUpdate}>
                CANCEL
              </Button>
              <Divider type="vertical" />
              <Button type="primary" htmlType="submit">
                UPDATE
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Spin spinning tip="Loading Profile..." />
        )}
      </MainLayout>
    );
  }
}

export default EditProfile;
