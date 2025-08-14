import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserDetails,
  fetchUserFriends,
  toggleFriend,
} from "../redux/userSlice";
import { fetchAllPosts, DeletePost } from "../redux/postSlice";

import Post from "../components/Post";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ProfileImagePopup from "../components/ProfileImagePopup";

// ---------------------
// Utility Functions
// ---------------------
const getSafeAvatarUrl = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== "string") {
    return "/assets/avatar.png";
  }

  const trimmedUrl = avatarUrl.trim();

  if (
    !trimmedUrl ||
    trimmedUrl === "undefined" ||
    trimmedUrl.includes("/undefined")
  ) {
    return "/assets/avatar.png";
  }

  try {
    new URL(trimmedUrl);
    return trimmedUrl;
  } catch {
    return "/assets/avatar.png";
  }
};

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ---------------------
  // Redux State
  // ---------------------
  const { currentUser, users, loading, error } = useSelector(
    (state) => state.user
  );
  const posts = useSelector((state) => state.post.posts);

  // ---------------------
  // Local State
  // ---------------------
  const [isFriend, setIsFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // ---------------------
  // Data Fetching
  // ---------------------
  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetails(id));
      dispatch(fetchUserFriends(id));
      dispatch(fetchAllPosts());
    }
  }, [dispatch, id]);

  // ---------------------
  // Friend Status Check
  // ---------------------
  useEffect(() => {
    if (currentUser?.id && users[id]?.friends) {
      setIsFriend(users[id].friends.includes(currentUser.id));
    }
  }, [currentUser, users, id]);

  // ---------------------
  // Handlers
  // ---------------------
  const handleFriendToggle = async () => {
    if (!currentUser || !id) return;
    setIsLoading(true);

    try {
      const response = await dispatch(toggleFriend(id)).unwrap();
      setIsFriend(response.is_friend);
    } catch (err) {
      console.error("Failed to update friend status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (postId) => {
    setSelectedPostId(postId);
  };

  const confirmDelete = () => {
    if (selectedPostId) {
      dispatch(DeletePost(selectedPostId));
      setSelectedPostId(null);
    }
  };

  // ---------------------
  // Derived Data
  // ---------------------
  const user = users[id];
  const userPosts = posts.filter((post) => String(post.user) === id);

  // ---------------------
  // Loading & Error States
  // ---------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-purple-700">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">User not found.</div>
      </div>
    );
  }

  // ---------------------
  // Main Render
  // ---------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        {/* Profile Image & Info */}
        <ProfileImagePopup user={user} />
        <h2 className="text-3xl font-bold text-purple-700">{user.name}</h2>
        <div className="text-gray-500 mb-2">@{user.username}</div>
        <div className="text-center text-gray-700 mb-4">{user.bio}</div>

        {/* Friend/Unfriend Button */}
        {currentUser?.id !== user.id && (
          <button
            onClick={handleFriendToggle}
            disabled={isLoading}
            className={`mb-4 px-6 py-2 rounded-lg font-semibold shadow transition
              ${
                isFriend
                  ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                  : "bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-purple-500 hover:to-pink-400"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading
              ? "Processing..."
              : isFriend
              ? "Unfollow"
              : "Make Friend"}
          </button>
        )}

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <span className="text-sm text-gray-400">
            <b>{user.friends?.length || 0}</b> Friends
          </span>
          <span className="text-sm text-gray-400">
            <b>{userPosts.length}</b> Posts
          </span>
        </div>

        <hr className="w-full mb-6" />

        {/* Posts Section */}
        <div className="w-full">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">Posts</h3>
          {userPosts.length === 0 ? (
            <div className="text-gray-400 text-center">No posts yet.</div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <div key={post.id}>
                  <Post post={post} user={user} />

                  {user.id === currentUser?.id && (
                    <div className="flex justify-start gap-4">
                      <Link to={`/update`} state={{ post }}>
                        <button className="mt-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeleteClick(post.id)}
                        className="mt-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-400 to-orange-500 text-white font-semibold shadow hover:from-red-500 hover:to-orange-400 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={selectedPostId !== null}
        onClose={() => setSelectedPostId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserProfile;
