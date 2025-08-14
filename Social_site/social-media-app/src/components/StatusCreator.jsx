import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStatus } from "../redux/statusSlice";

const StatusCreator = () => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [content, setContent] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleCreate = () => {
    if (!mediaFile) return;

    const formData = new FormData();
    formData.append("media_file", mediaFile);
    formData.append("media_type", mediaType);
    formData.append("content", content);
    // formData.append("user", currentUser);

    // No need to append "user" because backend takes request.user
    dispatch(createStatus(formData));

    setMediaFile(null);
    setMediaType("image");
    setContent("");
  };
  // StatusCreator.jsx
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h3 className="text-xl font-semibold text-purple-700 mb-4">
        Create a Status
      </h3>

      <input
        type="file"
        onChange={(e) => setMediaFile(e.target.files[0])}
        className="border border-gray-300 p-2 rounded-lg w-full mb-3"
      />

      <select
        value={mediaType}
        onChange={(e) => setMediaType(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg w-full mb-3"
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="audio">Audio</option>
      </select>

      <textarea
        placeholder="Add a caption..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg w-full mb-3"
      />

      <button
        onClick={handleCreate}
        className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:from-purple-500 hover:to-pink-400 transition"
      >
        Post Status
      </button>
    </div>
  );
};

export default StatusCreator;
