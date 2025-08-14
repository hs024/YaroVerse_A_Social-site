import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, updateUserProfile, clearError } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: null,
    password: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        avatar: null,
        password: "",
      });
      setAvatarPreview('http://localhost:8000'+currentUser.avatar || null);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setSuccessMessage("");

    try {
      const formPayload = new FormData();
      if (formData.name) formPayload.append("name", formData.name);
      if (formData.email) formPayload.append("email", formData.email);
      if (formData.bio) formPayload.append("bio", formData.bio);
      if (formData.password) formPayload.append("password", formData.password);
      if (formData.avatar) formPayload.append("avatar", formData.avatar);
      
    await dispatch(updateUserProfile(formPayload)).unwrap();
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-xl text-purple-700">
          Please login to view settings
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-purple-700 mb-2">
          User Settings
        </h2>

        {error && (
          <div className="text-red-500 text-sm">
            {typeof error === "object" ? Object.values(error).join(" ") : error}
          </div>
        )}

        {successMessage && (
          <div className="text-green-500 text-sm">{successMessage}</div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-400 resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-400"
            />
            <img src={avatarPreview} alt="Avatar Preview" className="mt-2 h-24 w-24 rounded-full object-cover border" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 px-6 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 px-6 py-2 rounded-lg bg-pink-100 text-pink-600 font-semibold shadow hover:bg-pink-200 transition"
        >
          Logout
        </button>
      </form>
    </div>
  );
}

export default Settings;
