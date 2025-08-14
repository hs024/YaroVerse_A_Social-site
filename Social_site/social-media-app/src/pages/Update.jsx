import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useParams,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UpdatePost } from "../redux/postSlice"; 

function Update() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  // const { postid } = useParams();
  const location = useLocation();
  const post = location.state?.post; // full post object from Link
  const postid=post.id

  // State
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [preview, setPreview] = useState([]);

  // Pre-fill form on mount
  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setPreview(
        (post.media || []).map((m) => ({
          url: m.media_url,
          type: m.type,
        }))
      );
      // Keep original media in case user doesn't change them
      setMedia(post.media || []);
    }
  }, [post]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    const newFiles = files.filter(
      (file) =>
        !media.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        )
    );

    if (newFiles.length === 0) return;

    setMedia((prev) => [...prev, ...newFiles]);
    setPreview((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : file.type.startsWith("audio")
          ? "audio"
          : "other",
      })),
    ]);
  };

  const removeFile = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      UpdatePost({
        id: postid,
        user: currentUser.id,
        media,
        content,
      })
    );
    // Reset form
    // console.log("updated data" ,postid,currentUser,media,content);
    
    alert("Post updated!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Update Post</h2>

        <textarea
          className="border rounded-lg p-3 focus:outline-none focus:border-purple-400 resize-none"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={handleMediaChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />

        {/* Preview */}
        {preview.length > 0 && (
          <div className="flex flex-col gap-3">
            {preview.map((item, idx) => (
              <div key={idx} className="relative">
                {/* {console.log(item)} */}
                {item.type === "image" && (
                  <img
                    src={
                      item?.url?.startsWith("/media/post_media")
                        ? `http://127.0.0.1:8000${item.url}`
                        : item.url // empty or placeholder if no DB image
                    }
                    alt="preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                )}
                {item.type === "video" && (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                )}
                {item.type === "audio" && (
                  <audio
                    src={item.url}
                    controls
                    className="w-full rounded-lg border"
                  />
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="mt-2 px-6 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default Update;
