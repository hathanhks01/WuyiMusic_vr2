import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, ConfigProvider, theme } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import GenreServices from "../../../Services/GenreServices";

const GenreManager = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchGenres = async () => {
        setLoading(true);
        try {
            const data = await GenreServices.getAllGenres();
            setGenres(data);
            message.success("Lấy danh sách thể loại thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách thể loại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const openModal = (record = null) => {
        setModalVisible(true);
        setEditingGenre(record);
        if (record) {
            form.setFieldsValue({ ...record });
        } else {
            form.resetFields();
        }
    };

    const handleCreateOrUpdate = async () => {
        try {
            const values = await form.validateFields();
            if (editingGenre) {
                await GenreServices.addGenre({ ...values, id: editingGenre.id });
                message.success("Cập nhật thể loại thành công");
            } else {
                await GenreServices.addGenre(values);
                message.success("Thêm mới thể loại thành công");
            }
            setModalVisible(false);
            fetchGenres();
        } catch (error) {
            message.error("Lỗi khi xử lý dữ liệu");
        }
    };

    const handleDelete = async (id) => {
        try {
            await GenreServices.deleteGenre(id);
            message.success("Xóa thể loại thành công");
            fetchGenres();
        } catch (error) {
            message.error("Lỗi khi xóa thể loại");
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 70,
            align: "center",
        },
        {
            title: "Tên Thể Loại",
            dataIndex: "name",
            key: "name",
            align: "center",
            width: '30%',
        },
        {
            title: "Mô Tả",
            dataIndex: "description",
            key: "description",
            align: "center",
            width: '40%',
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <div className="space-x-2">
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
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </div>
            ),
            align: "center",
            width: '20%',
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Quản lý Thể Loại</h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            className="bg-[#1db954] hover:bg-[#1ed760]"
                        >
                            Thêm thể loại mới
                        </Button>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <Table
                            columns={columns}
                            dataSource={Array.isArray(genres) ? genres : []}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: genres?.length || 0,
                                onChange: (page) => setCurrentPage(page),
                            }}
                            className="w-full"
                            scroll={{ x: true }}
                        />
                    </div>
                </div>

                <Modal
                    title={editingGenre ? "Cập nhật Thể Loại" : "Thêm mới Thể Loại"}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    className="dark-modal"
                    width={800}
                >
                    <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate} className="w-full">
                        <Form.Item 
                            label="Tên Thể Loại" 
                            name="name" 
                            rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}
                        >
                            <Input placeholder="Nhập tên thể loại" />
                        </Form.Item>
                        <Form.Item 
                            label="Mô Tả" 
                            name="description"
                        >
                            <Input.TextArea placeholder="Nhập mô tả thể loại" rows={4} />
                        </Form.Item>
                        <Form.Item className="flex justify-end space-x-2">
                            <Button onClick={() => setModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                className="bg-[#1db954]"
                            >
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default GenreManager;