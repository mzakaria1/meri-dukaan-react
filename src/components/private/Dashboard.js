import React from "react";
import Chart from "react-apexcharts";
import { Divider, Card, Col, Row, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import MainLayout from "../common/Layout";
import { authedAxios } from "../../config/axios.config";
const userRole = localStorage.getItem("userRole");
export class Dashboard extends React.Component {
  state = {
    loading: true,
    pendingOrders: null,
    confirmedOrders: null,
    deliveredOrders: null,
    completedOrders: null,
    cancelledOrders: null,
    totalOrders: null,
    totalProducts: null,
    totalCollections: null,

    total_earnings: null,
    amount_to_pay: null,
    best_selling_product: null,
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "17 June",
          "18 June",
          "19 June",
          "20 June",
          "21 June",
          "22 June",
          "23 June",
        ],
      },
    },
    series: [
      {
        name: "series-1",
        data: [0, 0, 2, 1, 0, 0],
      },
    ],
  };

  cardStyle = {
    height: "140px",
    fontSize: "20px",
    borderRadius: "4px",
    boxShadow:
      "0 0.46875rem 2.1875rem rgba(90, 97, 105, 0.1), 0 0.9375rem 1.40625rem rgba(90, 97, 105, 0.1),   0 0.25rem 0.53125rem rgba(90, 97, 105, 0.12),0 0.125rem 0.1875rem rgba(90, 97, 105, 0.1)",
    fontFamily: "Poppins, sans-serif",
  };

  loadCardData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");
      let {
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        completedOrders,
        cancelledOrders,
        totalOrders,
        totalProducts,
        totalCollections,
        total_earnings,
        amount_to_pay,
      } = 0;
      var best_selling_product = [];
      if (userRole === "admin") {
        pendingOrders = await authedAxios.get("/orders/count?status=Pending");
        confirmedOrders = await authedAxios.get(
          "/orders/count?status=Confirmed"
        );
        deliveredOrders = await authedAxios.get(
          "/orders/count?status=Delivered"
        );
        completedOrders = await authedAxios.get(
          "/orders/count?status=Completed"
        );
        cancelledOrders = await authedAxios.get(
          "/orders/count?status=Cancelled"
        );
        totalOrders = await authedAxios.get("/orders/count");
        totalProducts = await authedAxios.get("/products/count");
        totalCollections = await authedAxios.get("/collections/count");
        await authedAxios.get(`/order-invoices`).then((res) => {
          let amount = 0;
          let toPay = 0;
          res.data.map((ele) => {
            amount = amount + ele.earned_amount;
            toPay = toPay + ele.return_to_amount;
          });
          total_earnings = amount;
          amount_to_pay = toPay;
        });

        // await authedAxios.get("/orders").then((res) => {
        //   const orders = res.data;
        //   let products = [];
        //   let data = [];
        //   orders.map((element) => {
        //     element.ordered_products.map((ele) => {
        //       products.push(ele.product.id);
        //       data.push(ele.product);
        //     });
        //   });
        //   console.log(data);
        //   console.log(products);
        //   let dic = {};
        //   for (let index = 0; index < products.length; index++) {
        //     if (dic[products[index]] !== undefined) {
        //       console.log(products[index]);
        //       var temp = dic[products[index]];
        //       dic[products[index]] = temp + 1;
        //     } else {
        //       dic[products[index]] = 1;
        //     }
        //   }
        //   var kk = Object.keys(dic).reduce((a, b) => (dic[a] > dic[b] ? a : b));
        //   var max = dic[kk];
        //   var name = "";
        //   data.map((ele) => {
        //     if (kk === ele.id) {
        //       name = ele.title;
        //       return;
        //     }
        //   });
        //   var best_selling = { id: kk, total_orders: max, name };
        //   best_selling_product = best_selling;
        //   console.log(best_selling);
        // });
      } else if (userRole === "supplier") {
        //Supplier Requests
        pendingOrders = await authedAxios.get(
          `/orders/count?status=Pending&vendor.id=${userId}`
        );
        confirmedOrders = await authedAxios.get(
          `/orders/count?status=Confirmed&vendor.id=${userId}`
        );
        deliveredOrders = await authedAxios.get(
          `/orders/count?status=Delivered&vendor.id=${userId}`
        );
        completedOrders = await authedAxios.get(
          `/orders/count?status=Completed&vendor.id=${userId}`
        );
        cancelledOrders = await authedAxios.get(
          `/orders/count?status=Cancelled&vendor.id=${userId}`
        );
        totalOrders = await authedAxios.get(
          `/orders/count?vendor.id=${userId}`
        );
        totalProducts = await authedAxios.get(
          `/products/count?vendor.id=${userId}`
        );
        totalCollections = await authedAxios.get(
          `/collections/count?vendor.id=${userId}`
        );
        await authedAxios.get(`/order-invoices`).then((res) => {
          let amount = 0;
          let toPay = 0;
          res.data.map((ele) => {
            amount = amount + ele.earned_amount;
            toPay = toPay + ele.return_to_amount;
          });
          total_earnings = amount;
          amount_to_pay = toPay;
        });
      }

      this.setState(
        {
          pendingOrders: pendingOrders.data,
          confirmedOrders: confirmedOrders.data,
          deliveredOrders: deliveredOrders.data,
          completedOrders: completedOrders.data,
          cancelledOrders: cancelledOrders.data,
          totalOrders: totalOrders.data,
          totalProducts: totalProducts.data,
          totalCollections: totalCollections.data,
          total_earnings,
          amount_to_pay,
          best_selling_product,
          loading: false,
        },
        () => {
          console.log(this.state.best_selling_product);
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount = () => {
    this.loadCardData();
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <h1
          style={{
            fontSize: "28px",
            textAlign: "center",
            fontFamily: "Quantico",
            fontWeight: "bold",
            color: "#6666ff",
          }}>
          {userRole.toUpperCase()} Dashboard{" "}
          <span style={{ fontFamily: "Lucida Console", paddingTop: "10px" }}>
            {" "}
            <h6>All the basic reports will be here</h6>
          </span>
        </h1>
        <Divider />
        <div>
          <Row gutter={[32, 32]}>
            <Col span={12}>
              {userRole === "supplier" ? (
                <Card style={this.cardStyle} loading={this.state.loading}>
                  <Statistic
                    title="Total Earnings"
                    value={"Rs. " + this.state.total_earnings}
                    // precision={2}
                    valueStyle={{ color: "#6A5ACD", fontSize: "30px" }}
                    prefix={<ArrowUpOutlined />}
                    // suffix="%"
                  />
                </Card>
              ) : (
                <Card style={this.cardStyle} loading={this.state.loading}>
                  <Statistic
                    title="Total Application's Earning: "
                    value={"Rs. " + this.state.amount_to_pay}
                    // precision={2}
                    valueStyle={{ color: "#6A5ACD", fontSize: "30px" }}
                    prefix={<ArrowUpOutlined />}
                    // suffix="%"
                  />
                </Card>
              )}
            </Col>
            <Col span={12}>
              {userRole === "supplier" ? (
                <Card style={this.cardStyle} loading={this.state.loading}>
                  <Statistic
                    title="Payable to ''Meri Dukaan''"
                    value={"Rs. " + this.state.amount_to_pay}
                    // precision={2}
                    valueStyle={{ color: "#6A5ACD", fontSize: "30px" }}
                    prefix={<ArrowUpOutlined />}
                    // suffix="%"
                  />
                </Card>
              ) : (
                <Card style={this.cardStyle} loading={this.state.loading}>
                  <Statistic
                    title="All Suppliers Total Earning: "
                    value={"Rs. " + this.state.total_earnings}
                    // precision={2}
                    valueStyle={{ color: "#6A5ACD", fontSize: "30px" }}
                    prefix={<ArrowUpOutlined />}
                    // suffix="%"
                  />
                </Card>
              )}
            </Col>
          </Row>
          <Row gutter={[32, 32]}>
            <Col className="gutter-row" span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Total Orders"
                  value={this.state.totalOrders}
                  valueStyle={{ color: "#FF6347", fontSize: "30px" }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Pending Orders"
                  value={this.state.pendingOrders}
                  // precision={2}
                  valueStyle={{ color: "#008080", fontSize: "30px" }}
                  prefix={<ArrowUpOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Confirmed Orders"
                  value={this.state.confirmedOrders}
                  // precision={2}
                  valueStyle={{ color: "#228B22", fontSize: "30px" }}
                  prefix={<ArrowUpOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Delivered Orders"
                  value={this.state.deliveredOrders}
                  valueStyle={{ color: "#32CD32", fontSize: "30px" }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[32, 32]}>
            <Col span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Completed Orders"
                  value={this.state.completedOrders}
                  valueStyle={{ color: "#708090", fontSize: "30px" }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Cancelled Orders"
                  value={this.state.cancelledOrders}
                  valueStyle={{ color: "#DC143C", fontSize: "30px" }}
                  prefix={<ArrowDownOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Total Products"
                  value={this.state.totalProducts}
                  // precision={2}
                  valueStyle={{ color: "#6B8E23", fontSize: "30px" }}
                  prefix={<ArrowUpOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={this.cardStyle} loading={this.state.loading}>
                <Statistic
                  title="Total Collections"
                  value={this.state.totalCollections}
                  // precision={2}
                  valueStyle={{ color: "#6A5ACD", fontSize: "30px" }}
                  prefix={<ArrowUpOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </MainLayout>
    );
  }
}

export default Dashboard;
