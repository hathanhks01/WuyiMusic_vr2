import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, InputNumber, Select, message } from "antd";
import RatingService from "../../../Services/RatingService";

const RatingAdm = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRating, setEditingRating] = useState(null);

  // Fetch all ratings
  const fetchRatings = async () => {
    setLoading(true);
    try {
      const data = await RatingService.getAllRatings();
      setRatings(data);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingRating) {
        // Update rating
        await RatingService.updateRating(editingRating.RatingId, values);
        message.success("Đã cập nhật đánh giá thành công!");
      } else {
        // Create new rating
        await RatingService.createRating(values);
        message.success("Đã thêm đánh giá thành công!");
      }
      fetchRatings();
      handleCloseModal();
    } catch (error) {
      message.error("Lỗi khi gửi dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  // Open modal
  const handleOpenModal = (rating = null) => {
    setEditingRating(rating);
    if (rating) {
      form.setFieldsValue(rating);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRating(null);
    form.resetFields();
  };

  // Delete rating
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await RatingService.deleteRating(id);
      message.success("Đã xóa đánh giá thành công!");
      fetchRatings();
    } catch (error) {
      message.error("Lỗi khi xóa đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID Đánh giá",
      dataIndex: "RatingId",
      key: "RatingId",
    },
    {
      title: "Track ID",
      dataIndex: "TrackId",
      key: "TrackId",
    },
    {
      title: "User ID",
      dataIndex: "UserId",
      key: "UserId",
    },
    {
      title: "Điểm số",
      dataIndex: "Score",
      key: "Score",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Sửa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Quản lý đánh giá</h1>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Thêm đánh giá
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={ratings}
        loading={loading}
        rowKey="RatingId"
        style={{ width: "100%" }}
      />
      <Modal
        title={editingRating ? "Sửa đánh giá" : "Thêm đánh giá"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        style={{ top: "20px" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="TrackId"
            label="Track ID"
            rules={[{ required: true, message: "Vui lòng nhập Track ID!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="UserId"
            label="User ID"
            rules={[{ required: true, message: "Vui lòng nhập User ID!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="Score"
            label="Điểm số"
            rules={[
              { required: true, message: "Vui lòng nhập điểm số!" },
              { type: "number", min: 1, max: 5, message: "Điểm số phải từ 1 đến 5!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingRating ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RatingAdm;
