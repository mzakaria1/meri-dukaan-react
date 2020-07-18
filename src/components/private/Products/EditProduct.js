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
export class EditProduct extends React.Component {
  state = {
    product: null,
    gettingProducts: false,
    id: null,
    category_names: null,
    type_names: null,
    loading: false,
  };
  onFinish = (values) => {
    const data = {
      title: values.title,
      description: values.description,
      type: values.Type,
      price: values.price,
      stock_quantity: values.stock_quantity,
    };
    authedAxios
      .put(`/products/${this.state.id}`, data)
      .then((res) => {
        this.props.history.push("/products");
        message.success("Product has been Edited Successfully!", 1.5);
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
    const dd = this.props.history.location.pathname;
    const key = dd.split("/");

    authedAxios.get(`/products/${key[2]}`).then((res) => {
      console.log(res.data);
      this.setState({
        product: res.data,
        gettingProducts: true,
        id: key[2],
      });
    });
  };

  loadCategories = async () => {
    await authedAxios
      .get("/categories")
      .then((res) => {
        console.log(res.data);
        const data = res.data;
        var category = [];
        data.forEach((element) => {
          category.push({
            id: element.id,
            name: element.category_name,
            type: element.category_types,
          });
        });
        this.setState({
          category_names: category,
        });
        console.log(category);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleCategoryChange = (value) => {
    console.log(value);
    this.state.category_names.forEach((element) => {
      if (element.id === value) {
        this.setState({
          type_names: element.type,
        });
      }
    });
  };

  handleTypeChange = () => {};

  componentDidMount() {
    this.loadCategories();
    this.loadDataForEdit();
  }

  render() {
    return (
      <MainLayout {...this.props}>
        <h4>Eidt Product</h4>
        <Divider />
        {this.state.product ? (
          <Form
            {...layout}
            name="Edit Product"
            onFinish={this.onFinish}
            validateMessages={validateMessages}
            initialValues={{
              title: this.state.product.title,
              description: this.state.product.description,
              type: this.state.product.Type,
              category: this.state.product.category.category_name,
              vendor: this.state.product.vendor.username,
              price: this.state.product.price,
              stock_quantity: this.state.product.stock_quantity,
            }}>
            <Form.Item name="title" label="Product Title">
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
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                },
              ]}>
              {this.state.type_names === null ? (
                <Select
                  placeholder="Please Select Type"
                  defaultValue={"Please Select Type"}
                  onChange={this.handleTypeChange}
                  style={{ width: "100%" }}></Select>
              ) : (
                <Select
                  placeholder="Please Select Type"
                  defaultValue={"Please Select Type"}
                  onChange={this.handleCategoryChange}
                  style={{ width: "100%" }}>
                  {this.state.type_names.map((item) => (
                    <Select.Option key={item.id} value={item.title}>
                      {item.title}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item name="vendor" label="Vendor">
              <Input disabled />
            </Form.Item>
            <Form.Item name="stock_quantity" label="Stock Quantity">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="price">
              <Input />
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
          <Spin spinning tip="Loading Product..." />
        )}
      </MainLayout>
    );
  }
}

export default EditProduct;
