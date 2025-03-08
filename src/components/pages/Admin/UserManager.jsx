import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, ConfigProvider, theme, message, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserServices from '../../../Services/UserService';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();
  
  // Filter states
  const [usernameFilter, setUsernameFilter] = useState('');
  const [isPremiumFilter, setIsPremiumFilter] = useState('all');

  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserServices.GetAllUsers();
      setUsers(data);
      setError(null);
      message.success("Lấy danh sách người dùng thành công");
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
      message.error("Lỗi khi lấy danh sách người dùng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (record = null) => {
    setModalVisible(true);
    setEditingUser(record);

    if (record) {
      form.setFieldsValue({
        username: record.username,
        email: record.email,
        password: record.password,
        isPremium: record.isPremium,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      setSubmitLoading(true);
      const values = await form.validateFields();

      if (editingUser) {
        await UserServices.UpdateUser(editingUser.userId, {
          ...values,
          isPremium: values.isPremium 
      });
      
        message.success("Cập nhật người dùng thành công");
      } else {
       await UserServices.CreateUser(values);
        message.success("Thêm mới người dùng thành công");
      }

      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      message.error("Lỗi khi xử lý dữ liệu: " + (error.response?.data || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await UserServices.DeleteUser(id);
      message.success("Xóa người dùng thành công");
      fetchUsers();
    } catch (error) {
      message.error("Lỗi khi xóa người dùng");
      console.error('Lỗi khi xóa người dùng:', error);
    }
  };

  const handleSearch = (e) => {
    setUsernameFilter(e.target.value);
  };

  const handleFilterChange = (value) => {
    setIsPremiumFilter(value);
  };

  const filteredUsers = users.filter(user => {
    const matchesUsername = user.username.toLowerCase().includes(usernameFilter.toLowerCase());
    const matchesPremium = isPremiumFilter === 'all'
      ? true
      : isPremiumFilter === 'true'
        ? user.isPremium
        : !user.isPremium;
    return matchesUsername && matchesPremium;
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
      align: "center",
      fixed: 'left',
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "username",
      key: "username",
      align: "center",
      width: '20%',
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      width: '25%',
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      align: "center",
      width: '20%',
      render: (text) => text ? "•••••••••••" : "N/A",
    },
    {
      title: "Premium",
      dataIndex: "isPremium",
      key: "isPremium",
      render: (value) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Premium' : 'Cơ bản'}
        </span>
      ),
      align: "center",
      width: '15%',
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            className="bg-blue-500"
          >
            Sửa
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.userId)}
            className="bg-red-500 hover:bg-red-600"
          >
            Xóa
          </Button>
        </div>
      ),
      align: "center",
      width: '20%',
      fixed: 'right',
    },
  ];

  const darkThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#1db954',
      colorBgBase: '#111727',
      colorBgContainer: '#1a1f32',
      colorBgElevated: '#1a1f32',
      colorText: '#ffffff',
      colorBorder: '#2a3042',
    },
  };

  return (
    <ConfigProvider theme={darkThemeConfig}>
      <div className="w-full h-full bg-[#111727] text-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold">Quản Lý Người Dùng</h2>
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Tìm kiếm theo tên"
                style={{ width: 200 }}
                onChange={handleSearch}
                allowClear
              />
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'Tất cả tài khoản' },
                  { value: 'true', label: 'Premium' },
                  { value: 'false', label: 'Cơ bản' },
                ]}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
                className="bg-[#1db954] hover:bg-[#1ed760]"
              >
                Thêm người dùng mới
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <style>
              {`
              .hide-scrollbar .ant-table-body::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar .ant-table-body {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              `}
            </style>

            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="userId"
              loading={loading}
              pagination={false}
              className="hide-scrollbar w-full"
              scroll={{
                x: 1100,
                y: 600
              }}
            />
          </div>
        </div>

        <Modal
          title={editingUser ? "Cập nhật Người Dùng" : "Thêm mới Người Dùng"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          className="dark-modal"
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate} className="w-full">
            <Form.Item
              label="Tên Người Dùng"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
            >
              <Input placeholder="Nhập tên người dùng" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: 'email', message: "Email không hợp lệ" }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: !editingUser, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
              label="Premium"
              name="isPremium"
              valuePropName="checked"
            >
              <Select 
                options={[
                  { value: true, label: 'Premium' },
                  { value: false, label: 'Cơ bản' },
                ]}
              />
            </Form.Item>

            <Form.Item className="flex justify-end space-x-2">
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#1db954]"
                loading={submitLoading}
              >
                {submitLoading ? "Đang xử lý..." : "Lưu"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default UserManager;