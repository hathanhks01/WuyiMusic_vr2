import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, ConfigProvider, theme, Upload ,Select} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import TrackService from '../../../Services/TrackService';
import GenreService from '../../../Services/GenreServices';

const ManagerTrack = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [genres, setGenres] = useState([]);
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
        AlbumId: record.albumId,
      });
      setImageFileList(record.trackImage ? [{
        uid: '-1',
        name: 'current-image',
        status: 'done',
        url: record.trackImage,
      }] : []);
    } else {
      form.resetFields();
      setImageFileList([]);
    }
  };

  const imageUploadProps = {
    listType: "picture-card",
    maxCount: 1,
    showUploadList: {
      showRemoveIcon: true,
      showPreviewIcon: false,
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ chấp nhận file ảnh!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: ({ fileList: newFileList }) => {
      setImageFileList(newFileList);
    },
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok", file);
      }, 0);
    },
    accept: "image/*",
  };


  const handleCreateOrUpdate = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append('Title', values.Title);
      formData.append('AlbumId', values.AlbumId || '');
      formData.append("GenreId", values.GenreId ||''); 
      if (fileList.length > 0) {
        formData.append('File', fileList[0].originFileObj);
      }

      if (imageFileList.length > 0) {
        if (imageFileList[0].originFileObj) {
          formData.append('ImageFile', imageFileList[0].originFileObj);
        } else if (imageFileList[0].url) {
          formData.append('CurrentImage', imageFileList[0].url);
        }
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
      setImageFileList([]);
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

            <Form.Item
              label="Ảnh bài hát"
              name="TrackImage"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload
                {...imageUploadProps}
                fileList={imageFileList}
              >
                {imageFileList.length >= 1 ? (
                  <div className="relative">
                    <img
                      src={imageFileList[0].url || URL.createObjectURL(imageFileList[0].originFileObj)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <PlusOutlined className="text-white text-2xl" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
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

export default ManagerTrack;