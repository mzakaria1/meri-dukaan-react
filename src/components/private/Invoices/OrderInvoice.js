import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Tag, Divider, Spin, Descriptions, List } from "antd";

import { authedAxios } from "../../../config/axios.config";

class OrderInvoice extends Component {
  state = {
    loading_orders: false,
    invoice: null,
    order_details: null,
    total_product_price: null,
  };

  loadInvoice = async () => {
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    await authedAxios
      .get(`/order-invoices/${key[2]}`)
      .then(async (res) => {
        console.log(res.data);
        const ordersData = await authedAxios.get(`orders/${res.data.order.id}`);
        console.log(ordersData);
        const tt =
          ordersData.data.total_amount -
          (ordersData.data.margin_amount + ordersData.data.delivery_charges);
        this.setState({
          invoice: res.data,
          order_details: ordersData.data,
          loading_orders: true,
          total_product_price: tt,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.loadInvoice();
  };

  render() {
    return (
      <MainLayout {...this.props}>
        {this.state.loading_orders === false ? (
          <Spin spinning={true} tip="Loading Order Invoice..." />
        ) : (
          <div>
            <h1>Invoice Ref # {this.state.invoice.id}</h1>
            <Divider>Order Invoice</Divider>
            <Descriptions
              title="Order Details"
              bordered={true}
              layout="vertical"
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item key={0} name="InvoiceId" label="Invoice Ref">
                {this.state.invoice.id}
              </Descriptions.Item>
              <Descriptions.Item key={1} name="id" label="Order Ref">
                {this.state.invoice.order.id}
              </Descriptions.Item>
              <Descriptions.Item key={2} label="Order Status">
                {
                  <Tag key={this.state.order_details.status} color="green">
                    {this.state.order_details.status}
                  </Tag>
                }
              </Descriptions.Item>
              <Descriptions.Item key={3} label="Order Delivery Charges">
                {
                  <Tag
                    key={this.state.order_details.delivery_charges}
                    color="blue">
                    Rs. {this.state.order_details.delivery_charges}
                  </Tag>
                }
              </Descriptions.Item>
              <Descriptions.Item key={4} label="Order Price">
                {
                  <Tag key={this.state.order_details.price} color="pink">
                    Rs. {this.state.order_details.total_amount}
                  </Tag>
                }
              </Descriptions.Item>
            </Descriptions>
            <Divider />

            <Descriptions
              title="Customer Details"
              bordered={true}
              layout="vertical"
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item key={3} name="cusName" label="Customer Name">
                {this.state.order_details.customer.name}
              </Descriptions.Item>
              <Descriptions.Item key={4} label="Mobile">
                {this.state.order_details.customer.mobile}
              </Descriptions.Item>
              <Descriptions.Item key={5} label="City">
                {this.state.order_details.customer.city}
              </Descriptions.Item>
              <Descriptions.Item key={6} label="Address">
                {this.state.order_details.customer.address}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Product Details</Divider>
            <List
              // className=""
              // loading={!this.state.loading_orders}
              itemLayout="horizontal"
              // loadMore={loadMore}
              dataSource={this.state.order_details.ordered_products}
              renderItem={(item) => (
                <List.Item key={item.product.title}>
                  <List.Item.Meta
                    title="Product Name"
                    description={item.product.title}
                  />

                  <List.Item.Meta title="Size" description={item.size} />
                  <List.Item.Meta
                    title="Quantity"
                    description={item.quantity + " x"}
                  />
                  <List.Item.Meta
                    title="Price"
                    description={item.product.price}
                  />
                  <List.Item.Meta
                    title="Product Code"
                    description={item.product.product_code}
                  />

                  <List.Item.Meta
                    title="Total"
                    description={item.product.price * item.quantity}
                  />
                </List.Item>
              )}
            />

            <Divider />

            <Descriptions
              title="Earning Details"
              bordered={true}
              layout="vertical"
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item key={8} label="Order Price">
                Rs. {this.state.invoice.order_amount}
              </Descriptions.Item>
              <Descriptions.Item key={11} label="Total Products Price">
                Rs. {this.state.total_product_price}
              </Descriptions.Item>

              <Descriptions.Item key={7} label="Company Margin Applied">
                {this.state.invoice.margin_applied + " % "}
              </Descriptions.Item>

              <Descriptions.Item key={9} label="Commission Deduction">
                <Tag key={this.state.invoice.return_to_amount} color="purple">
                  Rs. {this.state.invoice.return_to_amount}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item key={10} label="Earned Amount">
                {/* {this.state.invoice.earned_amount} */}
                {
                  <Tag key={this.state.invoice.earned_amount} color="green">
                    Rs. {this.state.invoice.earned_amount}
                  </Tag>
                }
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </MainLayout>
    );
  }
}

export default OrderInvoice;
