import React, { useEffect, useState } from 'react';
import { useMusic } from '../PlayerMusicControl/MusicContext';
import { CloseOutlined } from '@ant-design/icons';
import QueueServices from '../../../Services/QueueServices';

const QueueSidebar = ({ isOpen, onClose }) => {
  const { 
    currentTrack,
    playTrack,
    playHistory,
    isPlaying
  } = useMusic();

  const [queueData, setQueueData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQueueData = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (!userInfo?.userId) {
          throw new Error('User ID not found');
        }

        const response = await QueueServices.GetQueueByUserId(userInfo.userId);
        console.log("Queue data fetched:", response);

        if (response) {
          const upcomingTracks = response.queueItems
            .filter(item => item.position > 0)
            .sort((a, b) => a.position - b.position);

          setQueueData({
            currentTrack: response.currentTrack,
            queueItems: upcomingTracks
          });
        }
      } catch (err) {
        setError('Failed to load queue');
        console.error("Error fetching queue data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueueData();
  }, [isOpen, currentTrack]); // Re-fetch khi currentTrack thay đổi

  const handlePlayTrackFromQueue = async (track) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      if (!userInfo?.userId) {
        throw new Error('User ID not found');
      }
      await playTrack(track);
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
          {/* Play History Section */}
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-sm text-zinc-400 mb-3">Recently Played</h3>
            {playHistory.map((track) => (
              <div 
                key={track.trackId} 
                className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-zinc-800 p-2 rounded"
                onClick={() => handlePlayTrackFromQueue(track)}
              >
                <img 
                  src={track.trackImage}
                  alt={track.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-zinc-400">{track.artist?.name}</p>
                </div>
              </div>
            ))}
            {playHistory.length === 0 && (
              <p className="text-zinc-500 text-center">No play history</p>
            )}
          </div>
          {/* Now Playing Section */}
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-sm text-zinc-400 mb-3">Now Playing</h3>
            {currentTrack && (
              <div className="flex items-center space-x-3">
                <img 
                  src={currentTrack.trackImage}
                  alt={currentTrack.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{currentTrack.title}</p>
                  <p className="text-sm text-zinc-400">{currentTrack.artist?.name}</p>
                </div>
              </div>
            )}
          </div>

          

          {/* Up Next Section */}
          <div className="p-4">
            <h3 className="text-sm text-zinc-400 mb-3">Up Next</h3>
            {isLoading ? (
              <p className="text-zinc-500 text-center">Loading queue...</p>
            ) : error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : queueData ? (
              <>
                {queueData.queueItems.map((queueItem) => (
                  <div 
                    key={queueItem.queueItemId}
                    className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-zinc-800 p-2 rounded"
                    onClick={() => handlePlayTrackFromQueue(queueItem.track)}
                  >
                    <div className="flex-shrink-0 w-12">
                      <img 
                        src={queueItem.track.trackImage}
                        alt={queueItem.track.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-medium truncate">{queueItem.track.title}</p>
                      <p className="text-sm text-zinc-400 truncate">
                        {queueItem.track.artist?.name}
                      </p>
                    </div>
                  </div>
                ))}
                {queueData.queueItems.length === 0 && (
                  <p className="text-zinc-500 text-center">No tracks in queue</p>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default QueueSidebar;