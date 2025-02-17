import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, ConfigProvider, theme, Upload } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import TrackService from '../../../Services/TrackService';

const ManagerTrack = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [currentTrackImage, setCurrentTrackImage] = useState('');
  const [form] = Form.useForm();
  const pageSize = 10;

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await TrackService.GetAllTrack();
      setTracks(response || []);
      message.success("Lấy danh sách bài hát thành công");
    } catch (error) {
      message.error("Lỗi khi lấy danh sách bài hát");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const openModal = (record = null) => {
    setModalVisible(true);
    setEditingTrack(record);
    if (record) {
      form.setFieldsValue({
        Title: record.title,
        TrackImage: record.trackImage,
        AlbumId: record.albumId,
      });
      setCurrentTrackImage(record.trackImage);
    } else {
      form.resetFields();
      setCurrentTrackImage('');
      setFileList([]);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      const values = await form.validateFields();
  
      const formData = new FormData();
      
      // Thêm các trường dữ liệu
      formData.append('Title', values.Title);
      if (values.TrackImage) {
        formData.append('TrackImage', values.TrackImage);
      }
      if (values.AlbumId) {
        formData.append('AlbumId', values.AlbumId);
      }
  
      // Xử lý file audio
      if (!editingTrack && fileList.length === 0) {
        message.error('Vui lòng chọn file audio!');
        return;
      }
      
      if (fileList.length > 0) {
        formData.append('File', fileList[0].originFileObj);
      }
  
      // Thêm ArtistId
    //   const userInfo = JSON.parse(localStorage.getItem('user'));
    //   if (!userInfo?.userId) {
    //     throw new Error('Không tìm thấy thông tin người dùng');
    //   }
    //   formData.append('ArtistId', userInfo.userId);
  
      // Debug: Hiển thị các trường trong FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // Gọi API
      if (editingTrack) {
        await TrackService.updateTrack(editingTrack.trackId, formData);
        message.success("Cập nhật bài hát thành công");
      } else {
        await TrackService.AddTrack(formData);
        message.success("Thêm bài hát thành công");
      }
  
      setModalVisible(false);
      fetchTracks();
      form.resetFields();
      setFileList([]);
    } catch (error) {
      // Xử lý lỗi...
    }
  };

  const handleDelete = async (trackId) => {
    try {
      await TrackService.DeleteAsync(trackId);
      message.success("Xóa bài hát thành công");
      fetchTracks();
    } catch (error) {
      message.error("Lỗi khi xóa bài hát");
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
      return false;
    },
    beforeUpload: (file) => {
      if (!file.type.startsWith('audio/')) {
        message.error('Chỉ chấp nhận file audio!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      let newFileList = [...info.fileList];
      
      // Chỉ giữ file hợp lệ
      newFileList = newFileList
        .filter(file => file.type?.startsWith('audio/'))
        .slice(-1); // Giới hạn 1 file
      
      setFileList(newFileList);
    },
    fileList,
    maxCount: 1,
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
      title: "Ảnh",
      dataIndex: "trackImage",
      key: "trackImage",
      align: "center",
      render: (trackImage) => (
        <img 
          src={trackImage} 
          alt="Track" 
          style={{ width: '50px', height: '50px', borderRadius: '8px' }}
        />
      ),
    },
    {
      title: "Tên Bài Hát",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Thời Lượng",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Nghệ Sĩ",
      dataIndex: "artist",
      key: "artist",
      align: "center",
      render: (artist) => artist?.name || "Chưa có nghệ sĩ",
    },
    {
      title: "Lượt Nghe",
      dataIndex: "listenCount",
      key: "listenCount",
      align: "center",
      render: (count) => count || 0,
    },
    {
      title: "Lượt Thích",
      dataIndex: "likes",
      key: "likes",
      align: "center",
      render: (likes) => likes || 0,
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
            onClick={() => handleDelete(record.trackId)}
          >
            Xóa
          </Button>
        </div>
      ),
      align: "center",
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
      <div className="track-management p-6 w-full min-h-screen bg-[#111727] text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quản lý Bài Hát</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="bg-[#1db954] hover:bg-[#1ed760]"
          >
            Thêm bài hát mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={Array.isArray(tracks) ? tracks : []}
          rowKey="trackId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: tracks?.length || 0,
            onChange: (page) => setCurrentPage(page),
          }}
          className="custom-table"
        />

        <Modal
          title={editingTrack ? "Update Track" : "Add New Track"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          className="dark-modal"
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
            <Form.Item 
              label="Track Title" 
              name="Title" 
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter track title" />
            </Form.Item>

            <Form.Item 
              label="Track Image URL" 
              name="TrackImage"
            >
              <Input 
                placeholder="Enter image URL"
                onChange={(e) => setCurrentTrackImage(e.target.value)}
                addonAfter={currentTrackImage && (
                  <img 
                    src={currentTrackImage} 
                    alt="Preview" 
                    style={{ width: 50, height: 50, borderRadius: 4 }}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Audio File"
              required={!editingTrack}
              help={editingTrack ? "Leave empty to keep existing file" : ""}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>

            <Form.Item 
              label="Album ID" 
              name="AlbumId"
            >
              <Input placeholder="Enter album ID (optional)" />
            </Form.Item>

            <Form.Item className="flex justify-end space-x-2">
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="bg-[#1db954]"
              >
                {editingTrack ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ManagerTrack;
