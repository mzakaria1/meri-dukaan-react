import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Button, message, Spin, Divider, Table, Popconfirm, Tag } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  FundViewOutlined,
} from "@ant-design/icons";
import { authedAxios, API_URL } from "../../../config/axios.config";
export class AllCollections extends Component {
  state = {
    loading: true,
    collections: null,
    deleteingCollection: false,
  };

  columns = [
    {
      title: "Collection Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => this.collectionInfo(record)}>{text}</a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Starting Price",
      dataIndex: "starting_price",
      key: "starting_price",
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
                onClick={() => this.editCollectionForm(record.id)}>
                Edit
              </Button>

              <Divider type="vertical" />
              <Popconfirm
                loading={this.state.deleteingCollection}
                title="Are you sure？"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.deleteCollection(record)}
                okText="Yes"
                cancelText="No">
                <Button
                  loading={this.state.deleteingCollection}
                  block
                  type="danger"
                  icon={<DeleteOutlined />}>
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
              onClick={() => this.collectionInfo(record)}>
              View Collection
            </Button>
          )}
        </span>
      ),
    },
  ];

  editCollectionForm = (id) => {
    this.props.history.push(`/editCollection/${id}`);
  };
  deleteCollection = async (record) => {
    this.setState({
      deleteingCollection: true,
    });
    const newCollection = [];
    await this.state.collections.map((element) => {
      console.log(element);
      if (element.id !== record.id) {
        newCollection.push({ ...element });
      }
    });
    console.log(newCollection);

    await authedAxios
      .delete(`/collections/${record.id}`)
      .then(async (res) => {
        this.setState({
          deleteingCollection: false,
          collections: newCollection,
        });
        await message.success("Collection has been successfully deleted.", 3.5);
      })
      .catch((err) => {
        console.log(err);
        message.error("Error: " + err, 3.5);
      });
  };

  componentDidMount() {
    // this.loadCollections();
    this.loadCollections();
  }

  loadCollections = () => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    authedAxios
      .get(`/collections`)
      .then(async (res) => {
        console.log(res);
        const pro = res.data;
        var pp = [];

        if (userRole === "supplier") {
          pro.forEach((element) => {
            const vendorid = element.vendor ? element.vendor.id : "";
            console.log(vendorid);
            if (vendorid === userId) {
              pp.push({
                ...element,
                vendor: element.vendor.username,
                category: element.category.category_name,
              });
            }
          });
          this.setState({
            collections: pp,
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
            collections: colls,
            loading: false,
          });
        } else {
          this.setState({
            collections: pro,
            loading: false,
          });
        }
      })
      .catch((err) => {
        message.error(err, 2.0);
      });
  };

  collectionInfo = (record) => {
    this.props.history.push("/collectionInfo/" + record.id);
  };

  newCollectionForm = () => {
    this.props.history.push("/newCollectionForm");
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
            All Collections
          </h3>
          {localStorage.getItem("userRole") === "supplier" ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ float: "right", marginBottom: "10px" }}
              onClick={this.newCollectionForm}>
              Create Collection
            </Button>
          ) : (
            ""
          )}
        </div>
        <Divider />
        {this.state.loading && !this.state.collections ? (
          <Spin spinning={true} tip="Loading Collections..." />
        ) : (
          <Table
            columns={this.columns}
            dataSource={this.state.collections}
            rowKey="id"
            loading={this.loading}
          />
        )}
      </MainLayout>
    );
  }
}

export default AllCollections;
