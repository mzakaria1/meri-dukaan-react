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

export class CreateCollection extends Component {
  state = {
    category_names: null,
    category_name: null,
    loading: false,
  };

  onFinish = async (values) => {
    if (localStorage.getItem("userRole") === "supplier") {
      this.setState({ loading: true });
      const userId = localStorage.getItem("userId");
      await authedAxios
        .post("/collections", {
          name: values.name,
          description: values.description,
          starting_price: values.starting_price,
          rating: "0",
          vendor: userId,
          products: [],
          category: values.category,
        })
        .then(async (res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
            await message.success("Collection has successfully Created", 2.5);
            this.addProductIntoCollection(res.data.id);
          } else {
            message.error("Couldn't created collection" + res.status);
          }
        })
        .catch((err) => {
          message.error("There is some error!" + err);
          console.log(err);
        });
    } else {
      message.error("Only Supplier can Create a Collection", 2.0);
    }
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

  componentDidMount = () => {
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
            Create Collection Form
          </h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ float: "right", marginBottom: "10px" }}
            onClick="">
            Add New Product
          </Button>
        </div>
        <Divider />
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          name="Collection_Form"
          onFinish={this.onFinish}
          validateMessages={validateMessages}>
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
                placeholder="Please Select Category"
                defaultValue={"Please Select Category"}
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
            <Button
              loading={this.state.loading}
              type="primary"
              htmlType="submit">
              Create Collection
            </Button>
          </Form.Item>
        </Form>
      </MainLayout>
    );
  }
}

export default CreateCollection;
