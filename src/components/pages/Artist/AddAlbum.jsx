import { useForm } from "react-hook-form";
import { useState, useRef,useEffect } from "react";
import { Plus, X, ImageIcon, Music, Upload } from "lucide-react";
import AlbumService from "../../../Services/AlbumService";
import GenreService from "../../../Services/GenreServices";

export default function AddAlbum() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [tracks, setTracks] = useState([{ id: 0 }]);
  const [albumImage, setAlbumImage] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const albumImageRef = useRef();

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await GenreService.getAllGenres();
        setGenres(response);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const addTrack = () => {
    setTracks([...tracks, { id: tracks.length }]);
  };

  const removeTrack = (index) => {
    const newTracks = tracks.filter((_, i) => i !== index);
    setTracks(newTracks);
  };

  const handleAlbumImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAlbumImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Album info
      formData.append('Title', data.title);
      formData.append('ReleaseDate', data.releaseDate);
      formData.append('ArtistId', JSON.parse(localStorage.getItem('user')).userId);
      
      // Album image
      if (albumImageRef.current.files[0]) {
        formData.append('ImageFile', albumImageRef.current.files[0]);
      }

      // Tracks
      tracks.forEach((track, index) => {
        const trackData = data.tracks[index];
        formData.append(`Tracks[${index}].Title`, trackData.title);
        formData.append(`Tracks[${index}].GenreId`, trackData.genreId);
        
        const audioFile = document.getElementById(`trackFile-${index}`).files[0];
        if (audioFile) {
          formData.append(`TrackFiles`, audioFile);
        }
      });

      const response = await AlbumService.createAlbum(formData);
      alert('Album created successfully!');
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-16 bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Upload className="w-8 h-8 text-green-500" />
          Create New Album
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Album Info Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Album Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Album Title *</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 text-white"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Release Date</label>
                <input
                  type="date"
                  {...register("releaseDate")}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 text-white"
                />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium mb-2">Album Cover *</label>
                <div className="flex items-center gap-4">
                  <input
                    ref={albumImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAlbumImage}
                    className="hidden"
                    id="albumImage"
                  />
                  <label
                    htmlFor="albumImage"
                    className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-green-500 transition-colors"
                  >
                    {albumImage ? (
                      <img src={albumImage} alt="Album cover" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-500 mx-auto" />
                        <span className="text-xs text-gray-400 mt-1">Upload Image</span>
                      </div>
                    )}
                  </label>
                  <div className="text-gray-400 text-sm">
                    Recommended size: 1000x1000 pixels
                    <br />
                    Format: JPG, PNG, WEBP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracks Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Album Tracks</h2>
              <button
                type="button"
                onClick={addTrack}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Add Track
              </button>
            </div>

            <div className="space-y-6">
              {tracks.map((track, index) => (
                <div key={index} className="bg-gray-900/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Track #{index + 1}</h3>
                    {tracks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTrack(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Track Title *</label>
                      <input
                        {...register(`tracks.${index}.title`, { required: "Title is required" })}
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-green-500 text-white"
                      />
                      {errors.tracks?.[index]?.title && (
                        <p className="text-red-400 text-sm mt-1">{errors.tracks[index].title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Genre *</label>
                      <select
                        {...register(`tracks.${index}.genreId`, { required: "Genre is required" })}
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-green-500 text-white"
                      >
                        <option value="">Select Genre</option>
                        {genres.map(genre => (
                          <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                      </select>
                      {errors.tracks?.[index]?.genreId && (
                        <p className="text-red-400 text-sm mt-1">{errors.tracks[index].genreId.message}</p>
                      )}
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm font-medium mb-2">Audio File *</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          id={`trackFile-${index}`}
                          accept="audio/*"
                          className="hidden"
                        />
                        <label
                          htmlFor={`trackFile-${index}`}
                          className="flex-1 p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-green-500 cursor-pointer flex items-center gap-2"
                        >
                          <Music className="w-6 h-6 text-gray-500" />
                          <span className="text-gray-400">
                            {document.getElementById(`trackFile-${index}`)?.files[0]?.name || "Select audio file"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 py-4 px-6 rounded-xl font-bold disabled:opacity-70"
          >
            {loading ? 'Creating Album...' : 'Publish Album'}
          </button>
        </form>
      </div>
    </div>
  );
}