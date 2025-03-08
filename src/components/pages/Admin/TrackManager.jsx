import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, ConfigProvider, theme, Upload, Select } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import TrackService from '../../../Services/TrackService';
import GenreService from '../../../Services/GenreServices';

const TrackManager = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();
  const pageSize = 10;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await GenreService.getAllGenres();
        setGenres(response);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        message.error("Lỗi khi lấy danh sách thể loại");
      }
    };
    fetchGenres();
  }, []);


  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await TrackService.GetAllTrack();
      console.log(response)
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
    setImageFile(null);
    setImagePreview(record?.trackImage || null);

    if (record) {
      form.setFieldsValue({
        Title: record.title,
        AlbumId: record.albumId,
        GenreId: record.genre?.id
      });
    } else {
      form.resetFields();
      setImagePreview(null);
    }
  };

  const handleImageChange = (info) => {
    if (info.file) {
      const file = info.file.originFileObj || info.file;
      setImageFile(file);

      // Tạo bản xem trước
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ chấp nhận file ảnh!');
        return Upload.LIST_IGNORE;
      }
      return false; // Ngăn tự động upload
    },
    onChange: handleImageChange,
    showUploadList: false,
  };

  const filteredTracks = tracks.filter(track => {
    const matchesTitle = track.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArtist = track.artist?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTitle || matchesArtist;
  });
  
  const handleCreateOrUpdate = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append('Title', values.Title);
      formData.append('AlbumId', values.AlbumId || '');
      formData.append("GenreId", values.GenreId || ''); 
      
      if (fileList.length > 0) {
        formData.append('File', fileList[0].originFileObj);
      }

      if (imageFile) {
        formData.append('ImageFile', imageFile);
      } else if (imagePreview && editingTrack) {
        // Nếu có ảnh hiện tại và đang chỉnh sửa, giữ nguyên ảnh cũ
        formData.append('CurrentImage', editingTrack.trackImage);
      }

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
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
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
      newFileList = newFileList
        .filter(file => file.type?.startsWith('audio/'))
        .slice(-1);
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
      title: "Thể Loại",
      dataIndex: "genre",
      key: "genre",
      align: "center",
      render: (genre) => genre?.name || "Chưa có thể loại",
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Quản lý Bài Hát</h2>
        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder="Tìm kiếm theo tên bài hát hoặc nghệ sĩ"
            style={{ width: 300 }}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="bg-[#1db954] hover:bg-[#1ed760]"
          >
            Thêm bài hát mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(filteredTracks) ? filteredTracks : []}
        rowKey="trackId"
        loading={loading}
        pagination={false}
        className="custom-table"
      />

        <Modal
          title={editingTrack ? "Cập nhật bài hát" : "Thêm bài hát mới"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          className="dark-modal"
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
            <Form.Item
              label="Tên bài hát"
              name="Title"
              rules={[{ required: true, message: "Vui lòng nhập tên bài hát" }]}
            >
              <Input placeholder="Nhập tên bài hát" />
            </Form.Item>

            <Form.Item label="Ảnh bài hát">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-600 flex items-center justify-center bg-gray-700">
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
                <Upload {...imageUploadProps}>
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
                <span className="text-sm text-gray-400">
                  {imageFile ? imageFile.name : "Chọn file hình ảnh"}
                </span>
              </div>
            </Form.Item>

            <Form.Item
              label="File audio"
              required={!editingTrack}
              help={editingTrack ? "Để trống nếu giữ nguyên file cũ" : ""}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Chọn file</Button>
              </Upload>
            </Form.Item>
            
            <Form.Item
              label="Thể loại"
              name="GenreId"
              rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
            >
              <Select
                placeholder="Chọn thể loại"
                options={genres.map(genre => ({
                  value: genre.id,
                  label: genre.name
                }))}
              />
            </Form.Item>
            
            <Form.Item
              label="Album ID"
              name="AlbumId"
            >
              <Input placeholder="Nhập ID album (không bắt buộc)" />
            </Form.Item>

            <Form.Item className="flex justify-end space-x-2">
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#1db954]"
                loading={submitting}
              >
                {editingTrack ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TrackManager;