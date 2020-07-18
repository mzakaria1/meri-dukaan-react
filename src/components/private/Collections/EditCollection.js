import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
};

export class EditCollection extends Component {
  state = {
    category_names: null,
    category_name: null,
    collection: null,
  };

  onFinish = (values) => {
    authedAxios
      .put(`/collections/${this.state.collection.id}`, {
        name: values.name,
        description: values.description,
        starting_price: values.starting_price,
        category: values.category,
      })
      .then(async (res) => {
        if (res.status === 200) {
          await message.success(
            "Collection has been successfully Updated",
            2.5
          );
          // this.addProductIntoCollection(res.data.id);
          this.props.history.goBack();
        } else {
          message.error("Couldn't created collection" + res.status);
        }
      })
      .catch((err) => {
        message.error("There is some error!" + err);
        console.log(err);
      });
    //   message.error("Only Supplier can Create a Collection", 2.0);
  };

  addProductIntoCollection = (id) => {
    this.props.history.push(`/addNewProduct/${id}`);
  };

  loadCategories = () => {
    authedAxios
      .get("/categories")
      .then((res) => {
        console.log(res);
        var names = [];
        res.data.forEach((element) => {
          names.push({ name: element.category_name, id: element._id });
        });
        this.setState({
          category_names: names,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleCategoryChange = (value) => {
    this.setState({
      category_name: value,
    });
  };

  loadCollection = () => {
    const dd = this.props.history.location.pathname;
    const key = dd.split("/");
    authedAxios
      .get(`/collections/${key[2]}`)
      .then((res) => {
        this.setState({ collection: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.loadCollection();
    this.loadCategories();
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
            Edit Collection Form
          </h3>
        </div>
        <Divider />
        {!this.state.collection ? (
          <Spin spinning={true} tip="Loading Collection..." />
        ) : (
          <Form
            //   {...layout}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            name="Edit_Collection_Form"
            onFinish={this.onFinish}
            validateMessages={validateMessages}
            initialValues={{
              name: this.state.collection.name,
              description: this.state.collection.description,
              category: this.state.collection.category.id,
              vendor: this.state.collection.vendor.username,
              starting_price: this.state.collection.starting_price,
            }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[
                {
                  required: true,
                },
              ]}>
              {this.state.category_names === null ? (
                <Spin spinning={true} tip="Loading Categories..." />
              ) : (
                <Select
                  placeholder={this.state.collection.category.category_name}
                  defaultValue={this.state.collection.category.id}
                  onChange={this.handleCategoryChange}
                  style={{ width: "100%" }}>
                  {this.state.category_names.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              name="starting_price"
              label="Starting Price"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 10000,
                },
              ]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name="vendor" label="Vendor">
              <Input
                disabled={true}
                defaultValue={localStorage.getItem("LoggedInUsername")}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Update Collection
              </Button>
            </Form.Item>
          </Form>
        )}
      </MainLayout>
    );
  }
}

export default EditCollection;
