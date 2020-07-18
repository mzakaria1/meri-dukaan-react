import React from "react";
import MainLayout from "../../common/Layout";
import {
  Button,
  message,
  Spin,
  Divider,
  Table,
  Popconfirm,
  Input,
  Tag,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  FundViewOutlined,
} from "@ant-design/icons";
import { authedAxios } from "../../../config/axios.config";

class AllProducts extends React.Component {
  state = {
    products: null,
    loading: true,
    deletingProduct: false,
    deleteId: null,
    data: null,
    searchText: "",
    searchedColumn: "",
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

  onChange = (a, b, c) => {
    console.log(a, b, c);
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
      ...this.getColumnSearchProps("title"),
      render: (text, record) => (
        <a
          onClick={() => {
            this.productInfo(record.id);
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
      title: "Category",
      dataIndex: "category",
      key: "Category",
      ...this.getColumnSearchProps("category"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      ...this.getColumnSearchProps("type"),
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      filters: [
        {
          text: "Out of Stock",
          value: "Out of Stock",
        },
      ],
      onFilter: (value, record) => record.stock_quantity === 0,
      sorter: (a, b) => a.stock_quantity - b.stock_quantity,
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
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          {localStorage.getItem("userRole") === "supplier" ? (
            <div>
              <Button
                type="primary"
                icon={<EditOutlined />}
                block
                style={{
                  backgroundColor: "green",
                }}
                onClick={() => this.editProductForm(record.id)}>
                Edit
              </Button>

              <Divider type="vertical" />
              <Popconfirm
                title="Are you sure？"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.deleteProduct(record.id)}
                okText="Yes"
                cancelText="No">
                <Button
                  block
                  type="danger"
                  icon={<DeleteOutlined />}
                  loading={this.state.deletingProduct}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <Button
              type="primary"
              icon={<FundViewOutlined />}
              block
              style={{
                backgroundColor: "green",
              }}
              onClick={() => this.productInfo(record.id)}>
              View Product
            </Button>
          )}
        </span>
      ),
    },
  ];

  deleteProduct = async (id) => {
    this.setState({
      deleteingProduct: true,
      deleteId: id,
    });
    const newProduct = [];
    await this.state.products.map((element) => {
      console.log(element);
      if (element.id !== id) {
        newProduct.push({ ...element });
      }
    });
    console.log(newProduct);

    await authedAxios
      .delete(`/products/${id}`)
      .then(async (res) => {
        this.setState({
          deleteId: null,
          deletingProduct: false,
          products: newProduct,
        });
        await message.success("Product has been successfully deleted.", 3.5);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  productInfo = (selected_product) => {
    this.props.history.push("/productInfo/" + selected_product);
  };

  editProductForm = (id) => {
    this.props.history.push("/editProduct/" + id);
  };
  addNewProduct = () => {
    this.props.history.push("/addNewProduct");
  };

  loadProducts = () => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    authedAxios
      .get("/products")
      .then(async (res) => {
        console.log(res.data);
        const pro = res.data;
        // const pic = res.data.pictures[0].url;

        var pp = [];
        if (userRole === "supplier") {
          pro.forEach((element) => {
            if (
              typeof element.vendor.id !== undefined &&
              element.vendor.id === userId
            ) {
              pp.push({
                ...element,
                category: element.category.category_name,
                vendor: element.vendor.name,
              });
            }
          });
          this.setState({
            products: pp,
            loading: false,
          });
        } else if (userRole === "admin") {
          let colls = [];
          await pro.map((ele) => {
            colls.push({
              ...ele,
              vendor: ele.vendor.username,
              category: ele.category.category_name,
            });
          });
          this.setState({
            products: colls,
            loading: false,
          });
        } else {
          this.setState({
            products: pro,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.loadProducts();
  }

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
            All Products
          </h3>
          {localStorage.getItem("userRole") === "supplier" ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ float: "right", marginBottom: "10px" }}
              onClick={this.addNewProduct}>
              New Product
            </Button>
          ) : (
            ""
          )}
        </div>
        <Divider />
        {this.state.loading && !this.state.products ? (
          <Spin spinning={true} tip="Loading products..." />
        ) : (
          <Table
            columns={this.columns}
            dataSource={this.state.products}
            rowKey="id"
          />
        )}
      </MainLayout>
    );
  }
}

export default AllProducts;
