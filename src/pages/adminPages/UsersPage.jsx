import { useCallback, useEffect, useState } from "react";
import "./user.scss"; 
import {
  DeleteOutlined,
  AudioOutlined,
  FormOutlined,
  UserAddOutlined,
  UserOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Spin,
  message,
} from "antd";
import { request } from "../../server/request";
import { IMG_URL } from "../../const/const";
const UsersPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgId, setImgId] = useState(null);
  const itemsPerPage = 10;
  const getPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await request.get(
        `user?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
      );
      setDataSource(response.data.data);
      setTotalItems(response.data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  },[currentPage,searchQuery]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const showModal = () => {
    setIsModalOpen(true);
    setSelected(null);
  };

  const handleChange = async (e) => {
    try {
      let form = new FormData();
      form.append("file", e.target.files[0]);
      await request.post("auth/upload", form);
      let res = await request.get("auth/me", form);
      setImgId(res.data.photo);
      getPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const hideModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImagePreviewUrl(null);
  };

  const onFinish = async (values) => {
    try {
      const {
        first_name,
        last_name,
        username,
        phoneNumber,
        birthday,
        address,
        email,
        description,
        password,
      } = values;
      const postData = {
        first_name,
        last_name,
        username,
        phoneNumber,
        birthday: birthday.format("YYYY-MM-DD"),
        address,
        email,
        description,
        photo: imgId,
        password,
      };

      if (selected) {
        let response = await request.put(`user/${selected}`, postData);
        if (response.status === 200) {
          getPosts();
          message.success("User edited successfully!");
          hideModal();
        } else {
          message.error("User update failed. Please try again.");
        }
      } else {
        const response = await request.post("user", postData);

        if (response.status === 201) {
          getPosts();
          message.success("User created successfully!");
          hideModal();
        } else {
          message.error("User creation failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating/editing user:", error);
      message.error(
        "An error occurred while creating/editing the user. Please try again."
      );
    }
  };

  const setFormFieldsForEditing = (data) => {
    form.setFieldsValue({
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      phoneNumber: data.phoneNumber,
      birthday: data.birthday,
      address: data.address,
      email: data.email,
      description: data.description,
      photo: data.photo,
      password: data.password,
    });

    const imageUrl = data.photo ? `${IMG_URL}${data.photo}` : null;

    setImagePreviewUrl(imageUrl);
  };

  async function editUser(id) {
    try {
      let { data } = await request.get(`user/${id}`);
      setFormFieldsForEditing(data.data);
      setSelected(id);
      showModal();
    } catch (err) {
      console.error("Error fetching user data:", err);
      message.error(
        "An error occurred while fetching user data. Please try again."
      );
    }
  }

  async function deleteUser(id) {
    try {
      Modal.confirm({
        title: "Confirm",
        icon: <ExclamationCircleFilled />,
        content: "Are you sure you want to delete this user?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: async () => {
          await request.delete(`user/${id}`);
          message.success("User deleted successfully!");
          getPosts();
        },
        onCancel: () => {
          console.log("Deletion canceled.");
        },
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      message.error(
        "An error occurred while deleting the user. Please try again."
      );
    }
  }

  const onSearch = (value) => {
    setSearchQuery(value);
  };  

  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="containr">
        <div
          className="user__heading__actions pt-4"
          style={{ display: "flex", gap: "10px" }}
        >
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onSearch={onSearch}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Button
            onClick={showModal}
            icon={<UserAddOutlined />}
            size="large"
            type="primary"
          >
            Add User
          </Button>
        </div>
        <table className="responsive-table">
          <thead className="responsive-table__head">
            <tr className="responsive-table__row">
              <th className="responsive-table__head__title responsive-table__head__title--name">
                Full Name
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--status">
                UserName
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--types">
                Phone Number
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--update">
                Email
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--country">
                Address
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--actions">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="responsive-table__body">
            {loading ? (
              <p
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "34px",
                }}
              >
                <Spin size="large" />
              </p>
            ) : (
              dataSource.map((res) => (
                <tr key={res._id} className="responsive-table__row">
                  <td
                    className="responsive-table__body__text responsive-table__body__text--name"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <Image
                        src={
                          res?.photo == undefined ? (
                            <Badge dot>
                              <Avatar shape="square" icon={<UserOutlined />} />
                            </Badge>
                          ) : (
                            `${IMG_URL}${res?.photo}`
                          )
                        }
                        width={60}
                        style={{ borderRadius: "8px" }}
                      />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <span style={{ marginRight: "10px" }}>
                          {res.first_name}
                        </span>
                        <span style={{ color: "green" }}>{res.last_name}</span>
                      </span>
                    </div>
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--status">
                    <span
                      className="status-indicator status-indicator--active px-1"
                      style={{
                        fontStyle: "italic",
                        cursor: "pointer",
                      }}
                    >
                        {res?.username}
                    </span>
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--types">
                    {res?.phoneNumber == null ? (
                      "No data?"
                    ) : (
                        res?.phoneNumber
                    )}
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--update">
                    {res.email == null ? "No Email!" : res?.email}
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--country">
                    {res.address == null
                      ? "Address was not given"
                      : res?.address}
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--actions">
                    <div
                      className="btn_wrappers"
                      style={{ display: "flex", gap: "15px" }}
                    >
                      <Button
                        type="primary"
                        onClick={() => deleteUser(res?._id)}
                        icon={<DeleteOutlined />}
                        
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => editUser(res?._id)}
                        type="primary"
                        icon={<FormOutlined />}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {dataSource.length == 0 || dataSource.length == 1 ? (
              ""
            ) : (
              <Pagination defaultCurrent={1} total={totalItems} onChange={onChangePage}/>
            )}
          </tbody>
        </table>
        <Modal
          title={selected ? "Edit User" : "Add New User"}
          open={isModalOpen}
          onCancel={hideModal}
          footer={false}
        >
          <Form
            id="addPostForm"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              name="first_name"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a Full Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="birthday"
              label="Birthday"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please enter a Address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter a Address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter a Password!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please enter a description!",
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="photo"
              label="Image"
              rules={[
                {
                  required: false,
                  message: "Please upload an image!",
                },
              ]}
            >
              <input type="file" onChange={handleChange} />
              {imagePreviewUrl && (
                <div className="image-preview">
                  <img
                    style={{
                      width: "150px",
                      borderRadius: "10%",
                      marginTop: "15px",
                    }}
                    src={imagePreviewUrl}
                    alt="Preview"
                  />
                </div>
              )}
            </Form.Item>
            <Button danger type="primary" onClick={hideModal}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              {selected ? "Save Post" : "Add Post"}
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UsersPage;
