import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import GenreServices from "../../../Services/GenreServices";

const Genre = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch genres from the API
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
                // If we are editing an existing genre
                await GenreServices.addGenre({ ...values, id: editingGenre.id }); // Update genre
                message.success("Cập nhật thể loại thành công");
            } else {
                // If we are adding a new genre
                await GenreServices.addGenre(values); // Create new genre
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
            fetchGenres(); // Refresh the list
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
        },
        {
            title: "Mô Tả",
            dataIndex: "description",
            key: "description",
            align: "center",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => openModal(record)}>
                        Sửa
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </>
            ),
            align: "center",
        },
    ];

    return (
        <div className="genre-management my-2 w-full">
            <h2>Quản lý Thể Loại</h2>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: "20px" }}
                onClick={() => openModal()}
            >
                Thêm thể loại mới
            </Button>

            <Table
                columns={columns}
                dataSource={Array.isArray(genres) ? genres : []} // Ensure genres is an array
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: genres?.length || 0,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            <Modal
                title={editingGenre ? "Cập nhật Thể Loại" : "Thêm mới Thể Loại"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
                    <Form.Item label="Tên Thể Loại" name="name" rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}>
                        <Input placeholder="Nhập tên thể loại" />
                    </Form.Item>
                    <Form.Item label="Mô Tả" name="description">
                        <Input.TextArea placeholder="Nhập mô tả thể loại" rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: "10px" }}>Lưu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Genre;
