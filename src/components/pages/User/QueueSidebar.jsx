import React, { useEffect, useState } from 'react';
import { useMusic } from '../PlayerMusicControl/MusicContext';
import { CloseOutlined } from '@ant-design/icons';
import QueueServices from '../../../Services/QueueServices';

const QueueSidebar = ({ isOpen, onClose }) => {
  const { 
    currentTrack,
    queue,
    playHistory,
    playTrack,
    setQueue
  } = useMusic();

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await QueueServices.GetQueueByUserId(userId.userId);
        if (response && response.data) {
          setQueue(response.data.queueItems || []);
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching queue data:", err);
      }
    };

    if (isOpen) {
      fetchQueue();
    }
  }, [isOpen, setQueue]);

  const handlePlayTrackFromQueue = async (track) => {
    try {
      playTrack(track);
    } catch (error) {
      console.error("Error playing track from queue:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed right-0 top-0 bottom-20 w-80 bg-zinc-900 text-white shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Queue</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:text-gray-400 transition-colors"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-4">
          {/* Now Playing Section */}
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-sm text-zinc-400 mb-3">Now Playing</h3>
            {currentTrack && (
              <div className="flex items-center space-x-3">
                <img 
                  src={currentTrack.trackImage || "src/assets/image/miaomiao.jpg"}
                  alt={currentTrack.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-small">{currentTrack.title}</p>
                  <p className="text-sm text-zinc-400 text-left">{currentTrack.artist?.name || ""}</p>
                </div>
              </div>
            )}
          </div>

          {/* Play History Section */}
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-sm text-zinc-400 mb-3">Recently Played</h3>
            {playHistory.map((track) => (
              <div 
                key={track.trackId} 
                className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-zinc-800 p-2 rounded"
                onClick={() => playTrack(track)}
              >
                <img 
                  src={track.trackImage || "src/assets/image/miaomiao.jpg"}
                  alt={track.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-small">{track.title}</p>
                  <p className="text-sm text-zinc-400 text-left">{track.artist?.name || ""}</p>
                </div>
              </div>
            ))}
            {playHistory.length === 0 && (
              <p className="text-zinc-500 text-center">No play history</p>
            )}
          </div>

          {/* Up Next Section */}
          <div className="p-4">
            <h3 className="text-sm text-zinc-400 mb-3">Up Next</h3>
            {queue.map((queueItem) => (
              <div 
                key={queueItem.trackId}
                className="flex items-center justify-between mb-3 hover:bg-zinc-800 p-2 rounded group"
              >
                <div 
                  className="flex items-center space-x-3 cursor-pointer flex-grow"
                  onClick={() => handlePlayTrackFromQueue(queueItem.track)}
                >
                  <img 
                    src={queueItem.track.trackImage || "src/assets/image/miaomiao.jpg"}
                    alt={queueItem.track.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-small">{queueItem.track.title}</p>
                    <p className="text-sm text-zinc-400 text-left">{queueItem.track.artist?.name || ""}</p>
                  </div>
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <p className="text-zinc-500 text-center">No tracks in queue</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QueueSidebar;