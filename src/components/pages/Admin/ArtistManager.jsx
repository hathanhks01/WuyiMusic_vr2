import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, ConfigProvider, theme, Upload } from "antd";
import { EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ArtistService from "../../../Services/ArtistServices";

const ArtistManager = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingArtist, setEditingArtist] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const data = await ArtistService.GetAllArtist();
            setArtists(data);
            console.log(data)
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
        setImageFile(null);
        setImagePreview(record?.artistImage || null);
        
        if (record) {
            form.setFieldsValue({ 
                name: record.name,
                bio: record.bio,
                isVerified: record.isVerified,
            });
        } else {
            form.resetFields();
        }
    };

    const handleCreateOrUpdate = async () => {
        try {
            setSubmitLoading(true);
            const values = await form.validateFields();
            
            const formData = new FormData();
            formData.append('Name', values.name.trim());
            formData.append('Bio', values.bio?.trim() || '');
            formData.append('isVerified', values.isVerified?.trim() || 'false');
            if (imageFile) {
                formData.append('ArtistImageFile', imageFile);
            }
            
            if (editingArtist) {
                // Update existing artist
                await ArtistService.UpdateArtist(editingArtist.artistId, formData);
                message.success("Cập nhật nghệ sĩ thành công");
            } else {
                // Create new artist
                await ArtistService.CreateArtistForAdm({
                    name: values.name,
                    bio: values.bio,
                    IsVerified: values.isVerified,
                    artistImage: imagePreview
                });
                message.success("Thêm mới nghệ sĩ thành công");
            }
            
            setModalVisible(false);
            fetchArtists();
        } catch (error) {
            console.error("Error:", error);
            message.error("Lỗi khi xử lý dữ liệu: " + (error.response?.data || error.message));
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleImageChange = (info) => {
        if (info.file) {
            const file = info.file.originFileObj || info.file;
            setImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('Chỉ có thể tải lên các file hình ảnh!');
                return Upload.LIST_IGNORE;
            }
            return false; // Prevent auto upload
        },
        onChange: handleImageChange,
        showUploadList: false,
    };

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
            title: "Tên Nghệ Sĩ",
            dataIndex: "name",
            key: "name",
            align: "center",
            width: '20%',
        },
        {
            title: "Tiểu sử",
            dataIndex: "bio",
            key: "bio",
            align: "center",
            width: '30%',
        },
        {
            title: "Hình ảnh",
            dataIndex: "artistImage",
            key: "artistImage",
            render: (text) => text ? (
                <img 
                    src={text} 
                    alt="Artist" 
                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                />
            ) : "N/A",
            align: "center",
            width: '15%',
        },
        {
            title: "đã xác thực",
            dataIndex: "isVerified",
            key: "isVerified",
            render: (value) => value ? "Có" : "Không",
            align: "center",
            width: '15%',
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => text ? new Date(text).toLocaleDateString() : "N/A",
            align: "center",
            width: '15%',
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => openModal(record)}
                    className="bg-blue-500"
                >
                    Sửa
                </Button>
            ),
            align: "center",
            width: '15%',
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Quản lý Nghệ Sĩ</h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            className="bg-[#1db954] hover:bg-[#1ed760]"
                        >
                            Thêm nghệ sĩ mới
                        </Button>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <Table
                            columns={columns}
                            dataSource={Array.isArray(artists) ? artists : []}
                            rowKey="artistId"
                            loading={loading}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: artists?.length || 0,
                                onChange: (page) => setCurrentPage(page),
                            }}
                            className="w-full"
                            scroll={{ x: true }}
                        />
                    </div>
                </div>

                <Modal
                    title={editingArtist ? "Cập nhật Nghệ Sĩ" : "Thêm mới Nghệ Sĩ"}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    className="dark-modal"
                    width={800}
                >
                    <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate} className="w-full">
                        <Form.Item 
                            label="Tên Nghệ Sĩ" 
                            name="name" 
                            rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ" }]}
                        >
                            <Input placeholder="Nhập tên nghệ sĩ" />
                        </Form.Item>
                        
                        <Form.Item 
                            label="Tiểu sử" 
                            name="bio"
                        >
                            <Input.TextArea placeholder="Nhập tiểu sử nghệ sĩ" rows={4} />
                        </Form.Item>
                        
                        <Form.Item label="Hình ảnh">
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600 flex items-center justify-center bg-gray-700">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-xs text-center">
                                            Chưa có ảnh
                                        </div>
                                    )}
                                </div>
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                                <span className="text-sm text-gray-400">
                                    {imageFile ? imageFile.name : "Chọn file hình ảnh"}
                                </span>
                            </div>
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

export default ArtistManager;