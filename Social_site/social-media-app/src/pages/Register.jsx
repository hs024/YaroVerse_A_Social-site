import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState(null);

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    bio: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      setAvatar(e.target.files[0]);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError()); // Clear any previous errors

    const { username, email, name, password } = form;

    // Basic client-side validation
    if (!username || !email || !name || !password) {
      dispatch(clearError());
      return;
    }

    const userData = {
      ...form,
      avatar: avatar,
    };

    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        navigate("/"); // Redirect after successful registration
      })
      .catch((error) => {
        // Error handling is done in the slice
        console.error("Registration failed:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-purple-100 to-blue-100 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
            required
          />
          <textarea
            name="bio"
            placeholder="Your bio"
            value={form.bio}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              accept="image/*"
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {typeof error === "object"
                ? Object.values(error).join(" ")
                : error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
