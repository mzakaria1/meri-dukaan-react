import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import Highlighter from "react-highlight-words";
import {
  message,
  Descriptions,
  Spin,
  Carousel,
  Divider,
  Table,
  Input,
  Button,
  Tag,
} from "antd";
import { SearchOutlined, BorderOutlined } from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

class ProductInfo extends Component {
  state = {
    p_details: null,
    loading_product: false,
    loading_reviews: false,
    reviews: null,
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}>
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      ...this.getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...this.getColumnSearchProps("email"),
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
    },
  ];

  loadData = () => {
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    authedAxios
      .get(`/products/${key[2]}`)
      .then(async (res) => {
        console.log(res);
        var review = [];
        this.setState({
          p_details: res.data,
          loading_product: true,
        });
        if (res.data.reviews) {
          await authedAxios.get(`/reviews`).then((response) => {
            console.log(response.data);
            const allReviews = response.data;
            allReviews.map((element) => {
              if (element.product.id === res.data.id) {
                review.push({
                  email: element.reseller.email,
                  name: element.reseller.username,
                  ...element,
                });
              }
            });
            this.setState({
              loading_reviews: true,
              reviews: review,
            });
          });
        } else {
          this.setState({
            loading_reviews: true,
          });
        }
      })
      .catch((err) => {
        message.error("There is some error", 1.0);
        console.log(err);
      });
  };
  collectionInfo = (id) => {
    this.props.history.push("/collectionInfo/" + id);
  };
  componentDidMount() {
    this.loadData();
    console.log(this.state.p_details);
  }
  render() {
    return (
      <MainLayout {...this.props}>
        {this.state.loading_product === false ? (
          <Spin spinning={true} tip="Loading Product..." />
        ) : (
          <div>
            <Descriptions
              title="Product Info"
              bordered={true}
              layout="vertical"
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item key={1} name="title" label="Title">
                {this.state.p_details.title}
              </Descriptions.Item>
              <Descriptions.Item key={2} label="Category">
                {this.state.p_details.category.category_name}
              </Descriptions.Item>
              <Descriptions.Item key={3} label="Type">
                {this.state.p_details.type}
              </Descriptions.Item>
              <Descriptions.Item key={4} label="Price">
                <div>
                  <Tag key={this.state.p_details.id + 1} color="green">
                    Rs. {this.state.p_details.price}
                  </Tag>
                </div>
              </Descriptions.Item>
              <Descriptions.Item key={5} label="Vendor">
                {this.state.p_details.vendor.username}
              </Descriptions.Item>
              <Descriptions.Item key={6} label="Stock Quantity">
                {this.state.p_details.stock_quantity}
              </Descriptions.Item>
              <Descriptions.Item key={7} label="Description">
                {this.state.p_details.description}
              </Descriptions.Item>
              <Descriptions.Item key={8} label="Collection">
                {/* {this.state.p_details.description} */}
                {!this.state.p_details.product_collection ||
                this.state.p_details.product_collection === null ? (
                  <div>
                    <Tag key={this.state.p_details.id} color="purple">
                      Not Exist in any Collection
                    </Tag>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<BorderOutlined />}
                      style={{
                        marginBottom: "10px",
                        backgroundColor: "green",
                        color: "white",
                      }}
                      // loading={this.state.statusChange}
                      onClick={() =>
                        this.collectionInfo(
                          this.state.p_details.product_collection.id
                        )
                      }>
                      View Collection
                    </Button>
                  </div>
                )}
              </Descriptions.Item>
            </Descriptions>
            <Divider />

            <div>
              <Carousel
                style={{
                  align: "center",
                  textAlign: "center",
                  width: "400px",
                  height: "260px",
                  lineHeight: "260px",
                  backgroundColor: "#364d79",
                  overflow: "hidden",
                }}
                autoplay>
                {this.state.p_details.pictures.map((element) => (
                  <div key={element.id}>
                    <img
                      style={{ width: "400px", height: "260px" }}
                      src={`${element.url}`}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        )}
        <Divider>Reviews</Divider>
        {!this.state.loading_reviews ? (
          <Spin spinning={true} tip="Loading Reviews..." />
        ) : (
          <Table
            columns={this.columns}
            dataSource={this.state.reviews}
            rowKey="id"
          />
        )}
      </MainLayout>
    );
  }
}

export default ProductInfo;
