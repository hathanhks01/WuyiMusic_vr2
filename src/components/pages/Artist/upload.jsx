import { useForm } from "react-hook-form";
import { useState } from "react";
import TrackService from "../../../Services/TrackService";

export default function Upload() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("Title", data.Title);
      formData.append("TrackImage", data.TrackImage);
      formData.append("File", data.File[0]);

      if (data.AlbumId) {
        formData.append("AlbumId", data.AlbumId);
      }
      const userInfo = JSON.parse(localStorage.getItem('user'));
      console.log("đã có " +userInfo.userId)
      if (userInfo) {
          formData.append("ArtistId", userInfo.userId);
      } else {
          throw new Error("User not logged in.");
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) {
            clearInterval(progressInterval);
            return 99; // Stop at 99% until upload actually completes
          }
          return prev + 1;
        });
      }, 50);

      await TrackService.addTrack(formData);
      clearInterval(progressInterval);
      setProgress(100); // Only set to 100% after upload is actually complete
      alert("Track uploaded successfully!");
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload track.");
      console.error(err);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Fun sticker characters for the progress indicator
  const stickers = {
    rocket: "🚀",
    star: "⭐",
    heart: "❤️",
    music: "🎵",
    disc: "💿",
    sparkles: "✨",
  };

  // Choose music note as our sticker
  const progressSticker = stickers.music;

  return (
    <div className="min-h-screen mt-16 bg-slate-100 p-6">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Track</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            {...register("Title", { required: "Title is required" })}
            type="text"
            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter track title"
          />
          {errors.Title && (
            <p className="mt-1 text-sm text-red-600">{errors.Title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="TrackImage" className="block text-sm font-medium text-gray-700 mb-1">
            Track Image URL
          </label>
          <input
            {...register("TrackImage")}
            type="text"
            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter track image URL"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="File" className="block text-sm font-medium text-gray-700 mb-1">
            Audio File *
          </label>
          <div className="w-full h-44 flex items-center justify-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent relative">
            <input
              {...register("File", {
                required: "Audio file is required",
                validate: {
                  acceptedFormats: files =>
                    !files[0] || files[0].type.startsWith('audio/') ||
                    "Only audio files are allowed"
                }
              })}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="audio/*"
            />
            <span className="text-gray-500">Choose an audio file</span>
          </div>
          {errors.File && (
            <p className="mt-1 text-sm text-red-600">{errors.File.message}</p>
          )}
        </div>


        <button
          onClick={handleSubmit(onSubmit)}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Track'}
        </button>

        {loading && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Uploading...</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 bg-gray-200 relative">
              <div
                className="h-full bg-blue-600 relative"
                style={{ width: `${progress}%` }}
              >
                <div
                  className="absolute -top-2 -right-2 transform transition-all duration-200 hover:scale-125"
                  style={{
                    fontSize: '16px',
                    animation: 'bounce 0.5s infinite alternate'
                  }}
                >
                  {progressSticker}
                </div>
              </div>
            </div>
            <style jsx>{`
              @keyframes bounce {
                from {
                  transform: translateY(0);
                }
                to {
                  transform: translateY(-4px);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}