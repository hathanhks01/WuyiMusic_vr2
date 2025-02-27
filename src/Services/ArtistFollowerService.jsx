import http from '../common/http-common';

const ArtistFollowerService = {
  // Get all artists that the current user follows
  getFollowedArtists: async () => {
    try {
      const response = await http.get('/ArtistFollower/followed-artists');
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy danh sách nghệ sĩ đang theo dõi:', error);
      throw error;
    }
  },

  // Get all followers of a specific artist
  getArtistFollowers: async (artistId) => {
    try {
      const response = await http.get(`/ArtistFollower/artist/${artistId}/followers`);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy danh sách người theo dõi nghệ sĩ:', error);
      throw error;
    }
  },

  // Get follower count for an artist
  getFollowerCount: async (artistId) => {
    try {
      const response = await http.get(`/ArtistFollower/artist/${artistId}/follower-count`);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy số lượng người theo dõi:', error);
      throw error;
    }
  },

  // Check if current user is following a specific artist
  isFollowing: async (artistId) => {
    try {
      const response = await http.get(`/ArtistFollower/artist/${artistId}/is-following`);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi kiểm tra trạng thái theo dõi:', error);
      throw error;
    }
  },

  // Follow an artist
  followArtist: async (artistId) => {
    try {
      const response = await http.post(`/ArtistFollower/artist/${artistId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi theo dõi nghệ sĩ:', error);
      throw error;
    }
  },

  // Unfollow an artist
  unfollowArtist: async (artistId) => {
    try {
      const response = await http.post(`/ArtistFollower/artist/${artistId}/unfollow`);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi hủy theo dõi nghệ sĩ:', error);
      throw error;
    }
  }
};

export default ArtistFollowerService;