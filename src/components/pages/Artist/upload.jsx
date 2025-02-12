import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import TrackService from "../../../Services/TrackService";
import { Upload as UploadIcon, Music, Image, X } from 'lucide-react';

export default function Upload() {
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const selectedFile = watch("File");
  const progressIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

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
      if (!userInfo) {
        throw new Error("User not logged in.");
      }
      formData.append("ArtistId", userInfo.userId);

      // Calculate progress based on file size
      const fileSize = data.File[0].size;
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(fileSize / chunkSize);
      let uploadedChunks = 0;

      progressIntervalRef.current = setInterval(() => {
        uploadedChunks++;
        const calculatedProgress = Math.min((uploadedChunks / totalChunks) * 100, 99);
        setProgress(calculatedProgress);

        if (uploadedChunks >= totalChunks) {
          clearInterval(progressIntervalRef.current);
        }
      }, Math.max(50, Math.min(500, fileSize / 1000000))); // Adjust interval based on file size

      await TrackService.addTrack(formData);
      clearInterval(progressIntervalRef.current);
      setProgress(100);
      alert("Track uploaded successfully!");
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload track.");
      console.error(err);
    } finally {
      clearInterval(progressIntervalRef.current);
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        // Manually set the file to the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;

        // Trigger change event for react-hook-form
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      } else {
        setError("Only audio files are allowed");
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <UploadIcon className="w-8 h-8 text-blue-500" />
          Upload Track
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="Title" className="block text-sm font-medium text-gray-300 mb-2">
              Track Title *
            </label>
            <input
              {...register("Title", { required: "Title is required" })}
              type="text"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              placeholder="Enter track title"
            />
            {errors.Title && (
              <p className="mt-2 text-sm text-red-400">{errors.Title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="TrackImage" className="block text-sm font-medium text-gray-300 mb-2">
              Track Image URL
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                {...register("TrackImage")}
                type="text"
                className="w-full p-3 pl-12 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="Enter track image URL"
              />
            </div>
          </div>

          <div>
            <label htmlFor="File" className="block text-sm font-medium text-gray-300 mb-2">
              Audio File *
            </label>
            <label
              className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                {...register("File", {
                  required: "Audio file is required",
                  validate: {
                    acceptedFormats: files =>
                      !files[0] || files[0].type.startsWith('audio/') ||
                      "Only audio files are allowed"
                  }
                })}
                type="file"
                className="hidden"
                accept="audio/*"
                onClick={(e) => e.stopPropagation()} // Prevent the label's click from triggering the input again
              />
              <Music className="w-12 h-12 text-gray-500 mb-3" />
              <span className="text-gray-400">
                {selectedFile?.[0]?.name || "Choose an audio file"}
              </span>
              <span className="text-sm text-gray-500 mt-2">
                {selectedFile?.[0]?.size
                  ? `Size: ${(selectedFile[0].size / (1024 * 1024)).toFixed(2)} MB`
                  : "Drag and drop or click to select"}
              </span>
            </label>
            {errors.File && (
              <p className="mt-2 text-sm text-red-400">{errors.File.message}</p>
            )}
          </div>


          <button
            onClick={handleSubmit(onSubmit)}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors
              ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Track'}
          </button>

          {loading && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Uploading your track...</span>
                <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}