import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { message, Descriptions, Spin, Divider, Table, Tag } from "antd";
import { authedAxios } from "../../../config/axios.config";

class OrderInfo extends Component {
  state = {
    order_details: null,
    product_details: [],
    loading_orders: false,
    loading_products: false,
  };

  columns = [
    {
      title: " Images",
      dataIndex: "pictures",
      key: "pictures",
      render: (pictures) => {
        if (pictures.length !== 0) {
          console.log("Pictures: ", pictures);

          return (
            <img
              src={`${pictures[0].url}`}
              alt="Uploaded Images"
              height="100"
              width="150"
            />
          );
        } else {
          return <span>No Picture</span>;
        }
      },
    },
    {
      title: "Product Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a
          onClick={() => {
            // this.productInfo(record.id);
          }}>
          {text}
        </a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "Description",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Ordered Quantity",
      dataIndex: "ordered_quantity",
      key: "ordered_quantity",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      render: (text, record) => {
        return record.stock_quantity === 0 ? (
          <span
            style={{
              color: "red",
            }}>
            Out of Stock
          </span>
        ) : (
          record.stock_quantity
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return (
          <Tag key={price} color="green">
            Rs. {price}
          </Tag>
        );
      },
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text, record) => (
    //     <span>
    //       <Button
    //         type="primary"
    //         icon={<EditOutlined />}
    //         block
    //         style={{
    //           backgroundColor: "green",
    //         }}
    //         onClick={() => this.editProductForm(record.id)}>
    //         Edit
    //       </Button>

    //       <Divider type="vertical" />
    //       <Popconfirm
    //         title="Are you sure？"
    //         icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    //         onConfirm={() => this.deleteProduct(record.id)}
    //         okText="Yes"
    //         cancelText="No">
    //         <Button block type="danger" icon={<DeleteOutlined />}>
    //           Delete
    //         </Button>
    //       </Popconfirm>
    //     </span>
    //   ),
    // },
  ];

  loadData = () => {
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    var ww = [];
    authedAxios
      .get(`/orders/${key[2]}`)
      .then(async (res) => {
        console.log(res);
        console.log(res.data.ordered_products);
        ww = res.data;

        const element = res.data.ordered_products;
        const productsData = await Promise.all(
          await element.map(async (ele, i) => {
            const ee = await authedAxios.get(`/products/${ele.product.id}`);
            console.log(element);
            return {
              ...ee.data,
              ordered_size: element[i].size,
              ordered_quantity: element[i].quantity + " x",
              vendor: ee.data.vendor.name,
              category: ee.data.category.category_name,
            };
          })
        );
        console.log(productsData);
        this.setState({
          order_details: ww,
          product_details: productsData,
          loading_products: true,
          loading_orders: true,
        });
      })

      .catch((err) => {
        message.error("There is some error", 1.0);
        console.log(err);
      });
  };
  componentDidMount = () => {
    this.loadData();
    console.log(this.state.order_details);
    console.log(this.state.product_details);
  };
  render() {
    return (
      <MainLayout {...this.props}>
        {this.state.loading_orders === false ? (
          <Spin spinning={true} tip="Loading Orders..." />
        ) : (
          <div>
            <Descriptions
              title="Order Info"
              bordered={true}
              layout="vertical"
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item key={0} name="id" label="Order ID">
                {this.state.order_details.id}
              </Descriptions.Item>
              <Descriptions.Item key={1} name="cusName" label="Customer Name">
                {this.state.order_details.customer.name}
              </Descriptions.Item>
              <Descriptions.Item key={2} label="Mobile">
                {this.state.order_details.customer.mobile}
              </Descriptions.Item>
              <Descriptions.Item key={3} label="City">
                {this.state.order_details.customer.city}
              </Descriptions.Item>
              <Descriptions.Item key={4} label="Amount to Collect">
                <Tag key={this.state.order_details.id} color="darkGreen">
                  Rs. {this.state.order_details.total_amount}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item key={5} label="Total Porduct Price">
                <Tag key={this.state.order_details.total_amount} color="blue">
                  Rs.{" "}
                  {this.state.order_details.total_amount -
                    (this.state.order_details.margin_amount +
                      this.state.order_details.delivery_charges)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item key={6} label="Status">
                {this.state.order_details.status}
              </Descriptions.Item>
              <Descriptions.Item key={7} label="Address">
                {this.state.order_details.customer.address}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
        <Divider />
        {!this.state.loading_products ? (
          <Spin spinning={true} tip="Loading Product..." />
        ) : (
          <Table
            columns={this.columns}
            dataSource={this.state.product_details}
            rowKey="id"
          />
        )}
      </MainLayout>
    );
  }
}

export default OrderInfo;
