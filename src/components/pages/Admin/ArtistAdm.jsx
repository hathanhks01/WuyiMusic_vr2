import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ArtistService from "../../../Services/ArtistService";

const ArtistAdm = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingArtist, setEditingArtist] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const data = await ArtistService.getAllArtist();
            setArtists(data);
            message.success("Lấy danh sách nghệ sĩ thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách nghệ sĩ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const openModal = (record = null) => {
        setModalVisible(true);
        setEditingArtist(record);
        if (record) {
            form.setFieldsValue({ ...record });
        } else {
            form.resetFields();
        }
    };

    const handleCreateOrUpdate = async () => {
        try {
            const values = await form.validateFields();
            if (editingArtist) {
                await ArtistService.updateArtist(editingArtist.artistId, values);
                message.success("Cập nhật nghệ sĩ thành công");
            } else {
                var reponse = await ArtistService.createArtist(values);
                console.log(reponse);
                message.success("Thêm mới nghệ sĩ thành công");
            }
            setModalVisible(false);
            fetchArtists();
        } catch (error) {
            message.error("Lỗi khi xử lý dữ liệu");
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
            title: "Tên Nghệ Sĩ",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: "Tiểu sử",
            dataIndex: "bio",
            key: "bio",
            align: "center",
        },
        {
            title: "Hình ảnh",
            dataIndex: "artistImage",
            key: "artistImage",
            render: (text) => text ? <img src={text} alt="Artist" style={{ width: 50, height: 50, borderRadius: "50%" }} /> : "N/A",
            align: "center",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => text ? new Date(text).toLocaleDateString() : "N/A",
            align: "center",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button type="primary" icon={<EditOutlined />} onClick={() => openModal(record)}>
                    Sửa
                </Button>
            ),
            align: "center",
        },
    ];

    return (
        <div className="artist-management w-full">
            <h2>Quản lý Nghệ Sĩ</h2>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: "20px" }}
                onClick={() => openModal()}
            >
                Thêm nghệ sĩ mới
            </Button>

            <Table
                columns={columns}
                dataSource={Array.isArray(artists) ? artists : []} // Đảm bảo artists là một mảng
                rowKey="artistId"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: artists?.length || 0,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            <Modal
                title={editingArtist ? "Cập nhật Nghệ Sĩ" : "Thêm mới Nghệ Sĩ"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
                    <Form.Item label="Tên Nghệ Sĩ" name="name" rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ" }]}>
                        <Input placeholder="Nhập tên nghệ sĩ" />
                    </Form.Item>
                    <Form.Item label="Tiểu sử" name="bio">
                        <Input.TextArea placeholder="Nhập tiểu sử nghệ sĩ" rows={4} />
                    </Form.Item>
                    <Form.Item label="Hình ảnh" name="artistImage">
                        <Input placeholder="Nhập URL hình ảnh nghệ sĩ" />
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

export default ArtistAdm;
