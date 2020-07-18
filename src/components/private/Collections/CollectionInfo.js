import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import {
  message,
  Descriptions,
  Spin,
  Button,
  Divider,
  Table,
  Modal,
  Input,
  Tag,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  PlusOutlined,
  SearchOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

export class CollectionInfo extends Component {
  state = {
    p_details: null,
    c_details: null,
    c_loading: true,
    p_loading: true,
    deleteingProduct: false,
    loading: false,
    visible: false,
    products: null,
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
      title: " Images",
      dataIndex: "pictures",
      key: "pictures",
      render: (pictures) => {
        if (pictures.length !== 0) {
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
      title: "Category Type",
      dataIndex: "type",
      key: "type",
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
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="danger"
            icon={<MinusCircleOutlined />}
            loading={this.state.loading}
            block
            style={{
              backgroundColor: "red",
            }}
            onClick={() => this.removeProductFormCollection(record)}>
            Remove Product
          </Button>
        </span>
      ),
    },
  ];

  columns_p = [
    {
      title: " Images",
      dataIndex: "pictures",
      key: "pictures",
      render: (pictures) => {
        if (pictures.length !== 0) {
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
      ...this.getColumnSearchProps("title"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "Description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ...this.getColumnSearchProps("category"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      ...this.getColumnSearchProps("type"),
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
      ...this.getColumnSearchProps("price"),
      render: (price) => {
        return (
          <Tag key={price} color="green">
            Rs. {price}
          </Tag>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            // loading={this.state.loading}
            block
            style={{
              backgroundColor: "lightGreen",
            }}
            onClick={() => this.addProductToCollection(record)}>
            Add into Collection
          </Button>
        </span>
      ),
    },
  ];

  showModal = () => {
    console.log("clicked");
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  addProductToCollection = async (record) => {
    this.setState({ loading: true });
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    const collection = this.state.c_details;
    let coll_products = collection.products;
    coll_products.push(record.id);

    let pros = [];
    await this.state.products.map((ele) => {
      if (record.id !== ele.id) {
        pros.push({ ...ele });
      }
    });
    this.setState({
      products: pros,
    });
    console.log(pros);
    console.log(coll_products);
    await authedAxios
      .put(`/collections/${key[2]}`, {
        products: coll_products,
      })
      .then((res) => {
        this.setState({
          p_details: res.data.products,
          c_details: res.data,
          loading: false,
          visible: false,
        });
      })
      .catch((err) => console.log(err));
  };

  removeProductFormCollection = async (record) => {
    this.setState({ loading: true });
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    const hh = this.state.c_details.products;
    let coll_products = [];
    await hh.map((ele) => {
      if (ele.id !== record.id) {
        coll_products.push(ele.id);
      }
    });
    console.log(coll_products);
    await authedAxios
      .put(`/collections/${key[2]}`, { products: coll_products })
      .then((res) => {
        this.setState({
          p_details: res.data.products,
          loading: false,
          c_details: res.data,
        });
        this.loadAllProducts();
      })
      .catch((err) => {
        console.log(err);
        message.err("Error: " + err, 3.5);
      });
  };

  loadAllProducts = () => {
    authedAxios
      .get("/products")
      .then(async (res) => {
        let pros = [];
        await res.data.map((element) => {
          if (
            !element.product_collection ||
            element.product_collection === null
          ) {
            if (element.vendor.id === localStorage.getItem("userId")) {
              if (element.category.id === this.state.c_details.category.id) {
                console.log(element);
                pros.push({
                  ...element,
                  category: element.category.category_name,
                });
              }
            }
          }
        });

        this.setState({
          products: pros,
        });
      })
      .catch((err) => {
        message.error(`Error: ${err}`, 3.0);
      });
  };

  loadCollection = () => {
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    authedAxios
      .get(`/collections/${key[2]}`)
      .then((res) => {
        console.log(res);
        this.setState({
          c_details: res.data,
          p_details: res.data.products,
          c_loading: false,
          p_loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  addNewProduct = () => {
    this.props.history.push("/addNewProduct");
  };
  componentDidMount() {
    this.loadCollection();
    this.loadAllProducts();
  }

  render() {
    return (
      <MainLayout {...this.props}>
        <div>
          {this.state.c_loading ? (
            <Spin spinning={true} tip="Loading Collection..." />
          ) : (
            <div>
              <Divider>Collection Info</Divider>
              <Descriptions
                title="Collection Info"
                bordered={true}
                layout="vertical"
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item key={1} label="Name">
                  {this.state.c_details.name}
                </Descriptions.Item>

                <Descriptions.Item key={2} label="Starting Price">
                  <Tag key={this.state.c_details.starting_price} color="green">
                    Rs. {this.state.c_details.starting_price}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item key={3} label="Category">
                  {!this.state.c_details.category
                    ? "No Category Defined"
                    : this.state.c_details.category.category_name}
                </Descriptions.Item>
                <Descriptions.Item key={4} label="Vendor">
                  {this.state.c_details.vendor.username}
                </Descriptions.Item>
                <Descriptions.Item key={5} label="Description">
                  {this.state.c_details.description}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </div>

        {this.state.p_loading ? (
          <Spin spinning={true} tip="Loading Products..." />
        ) : (
          <div>
            {localStorage.getItem("userRole") === "supplier" ? (
              <div style={{ margin: "50 px 0" }}>
                <h2 style={{ float: "left" }}>
                  Add Product into this Collection:
                  <Button
                    type="primary"
                    style={{ marginLeft: "10px" }}
                    onClick={this.showModal}>
                    Click Here
                  </Button>
                </h2>
                <Modal
                  width="1000px"
                  visible={this.state.visible}
                  title="Title"
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      Return
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      loading={this.state.loading}
                      onClick={this.handleOk}>
                      Submit
                    </Button>,
                  ]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => this.addNewProduct()}
                    style={{ float: "right" }}
                    key="back">
                    All New Product
                  </Button>
                  <Divider />
                  ,
                  <Table
                    columns={this.columns_p}
                    dataSource={this.state.products}
                    rowKey="id"
                  />
                </Modal>
              </div>
            ) : (
              ""
            )}
            <Divider style={{ marginTop: "50px" }}>
              Products in this Collection
            </Divider>
            <Table
              columns={this.columns}
              dataSource={this.state.p_details}
              rowKey="id"
            />
          </div>
        )}
      </MainLayout>
    );
  }
}

export default CollectionInfo;
