import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        performSearch();
      } else {
        setSearchResults({ tracks: [], artists: [] });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/search`, {
        params: { searchTerm }
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      // Optional: set error state or show notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Tìm kiếm bài hát, nghệ sĩ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <div>Đang tìm kiếm...</div>}

      {searchResults.tracks.length > 0 && (
        <div className="search-results">
          <h3>Bài Hát</h3>
          {searchResults.tracks.map((track) => (
            <div key={track.title} className="search-item">
              <img 
                src={track.trackImage || '/default-track.jpg'} 
                alt={track.title} 
                className="search-item-image"
              />
              <div className="search-item-details">
                <p>{track.title}</p>
                {/* Hiển thị thêm thông tin nếu cần */}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchResults.artists.length > 0 && (
        <div className="search-results">
          <h3>Nghệ Sĩ</h3>
          {searchResults.artists.map((artist) => (
            <div key={artist.artistId} className="search-item">
              <img 
                src={artist.artistImage || '/default-artist.jpg'} 
                alt={artist.name} 
                className="search-item-image"
              />
              <div className="search-item-details">
                <p>{artist.name}</p>
                {/* Hiển thị thêm thông tin nếu cần */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;