import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { authedAxios } from "../../../config/axios.config";

import {
  Form,
  Select,
  InputNumber,
  Spin,
  Button,
  message,
  Upload,
  Input,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export class AddNewProduct extends Component {
  state = {
    category_names: null,
    type_names: null,
    loading: false,
  };

  normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  onFinish = async (values) => {
    this.setState({ loading: true });
    console.log("Received values of form: ", values);
    console.log(values.pictures);
    const data = { ...values };
    data.vendor = localStorage.getItem("userId");
    delete data.pictures;

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (values.pictures) {
      const files = await values.pictures.fileList.map((f) => f.originFileObj);
      console.log(files);
      files.forEach((file) =>
        formData.append("files.pictures", file, file.name)
      );
    }

    await authedAxios
      .post("/products", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        this.setState({ loading: false });
        await message.success(
          "Successfully Added Product into the Collection",
          3.0
        );
        this.props.history.push("/products");
      })
      .catch((err) => {
        console.log(err);
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

  componentWillMount = () => {
    this.loadCategories();
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <div>
          <h2>Add Product into Collection</h2>
          <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={this.onFinish}
            initialValues={{
              ["input-number"]: 3,
              ["checkbox-group"]: ["A", "B"],
              rate: 3.5,
            }}>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Please Enter Title of the Product",
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="size" label="Size">
              <Input />
            </Form.Item>
            <Form.Item name="product_code" label="Product_code">
              <Input />
            </Form.Item>
            <Form.Item name="stock_quantity" label="Stock Quantity">
              <InputNumber />
            </Form.Item>
            <Form.Item name="price" label="price">
              <InputNumber />
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
              <Input
                disabled={true}
                defaultValue={localStorage.getItem("LoggedInUsername")}
              />
            </Form.Item>

            <Form.Item
              name="pictures"
              label="Pictures"
              // valuePropName="fileList"
              // getValueFromEvent={this.normFile}
              // extra="longgggggggggggggggggggggggggggggggggg"
            >
              <Upload
                beforeUpload={(file) => false}
                listType="picture"
                multiple>
                <Button>
                  <UploadOutlined /> Click to upload
                </Button>
              </Upload>
              {/* <Input name="files" type="file"></Input> */}
            </Form.Item>

            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button
                loading={this.state.loading}
                type="primary"
                htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </MainLayout>
    );
  }
}

export default AddNewProduct;
