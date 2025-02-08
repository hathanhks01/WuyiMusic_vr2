import React from 'react';
import http from '../common/http-common';

const QueueServices = {
  // Lấy bài hát hiện tại
  GetCurrentTrack: async () => {
    try {
      const response = await http.get('/api/Queue/current');
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy bài hát hiện tại:', error);
      throw error;
    }
  },

  // Thêm bài hát vào queue
  AddToQueue: async (trackId) => {
    try {
      const response = await http.post('/api/Queue/add', trackId);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi thêm bài hát vào queue:', error);
      throw error;
    }
  },

  // Thay đổi vị trí bài hát trong queue
  ReorderQueue: async (trackId, newPosition) => {
    try {
      const requestBody = { TrackId: trackId, NewPosition: newPosition };
      const response = await http.post('/api/Queue/reorder', requestBody);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi thay đổi vị trí bài hát:', error);
      throw error;
    }
  },

  // Bật/tắt chế độ phát ngẫu nhiên
  ToggleShuffle: async () => {
    try {
      const response = await http.post('/api/Queue/toggle-shuffle');
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi thay đổi chế độ shuffle:', error);
      throw error;
    }
  },

  // Bật/tắt chế độ lặp lại
  ToggleRepeat: async () => {
    try {
      const response = await http.post('/api/Queue/toggle-repeat');
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi thay đổi chế độ repeat:', error);
      throw error;
    }
  },

  // Lấy đề xuất bài hát
  GetRecommendations: async () => {
    try {
      const response = await http.get('/api/Queue/recommendations');
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy đề xuất bài hát:', error);
      throw error;
    }
  },

  // Thêm vào lịch sử nghe nhạc
  AddToHistory: async (trackId, playDuration) => {
    try {
      const requestBody = { TrackId: trackId, PlayDuration: playDuration };
      const response = await http.post('/api/Queue/history', requestBody);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi thêm vào lịch sử nghe nhạc:', error);
      throw error;
    }
  },

  // Lấy thống kê thời gian nghe nhạc
  GetListeningTime: async (startDate, endDate) => {
    try {
      const response = await http.get(`/api/Queue/listening-time`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy thống kê thời gian nghe nhạc:', error);
      throw error;
    }
  },
};

export default QueueServices;
