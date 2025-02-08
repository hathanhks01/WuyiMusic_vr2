import http from "../common/http-common"; // Import http từ http-common
const ArtistService = {
     CreateArtist: async (artistDto) => {
          const storedUser = localStorage.getItem('user');
          if (!storedUser) {
            console.log('User information not found');
            return null;
          }
          
          const user = JSON.parse(storedUser);
          const userId = user.userId;
      
          try {
            // Convert base64 image to File object
            const imageFile = artistDto.artistImage ? 
              await (await fetch(artistDto.artistImage)).blob() : null;
      
            const formData = new FormData();
            formData.append('Name', artistDto.name);
            formData.append('Bio', artistDto.bio);
            formData.append('userId', userId);
            if (imageFile) {
              formData.append('ArtistImageFile', new File([imageFile], 'artist-image.jpg', { type: 'image/jpeg' }));
            }
      
            const response = await http.post('/Artist/CreateArtist', formData, {
              params: { [ArtistId]: userId },
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
      
            return response.data;
          } catch (error) {
            console.error('Có lỗi xảy ra khi tạo nghệ sĩ:', error);
            throw error;
          }
        },
     
     updateArtist: async (id, artistData) => {
          try {
              const response = await http.put(`Artist/${id}`, artistData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     GetArtistByUserId: async () => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            const userId = user.userId;  
            console.log("User ID:", userId);  // In ra userId để debug
            try {
              const response = await http.get(`/Artist/user/${userId}`);
              return response.data;
            } catch (error) {
              console.error('Có lỗi khi lấy dữ liệu nghệ sĩ:', error);
              throw error;
            }
          } else {
            console.log('User information not found');
            return null;
          }
        },

     getAllArtist: async () => {
          try {
               const response = await http.get('Artist'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default ArtistService;