import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserFriends } from "../redux/userSlice";

const Friends = () => {
  const dispatch = useDispatch();
  const { currentUser, friends, loading, error } = useSelector(
    (state) => state.user
  );
  function getSafeAvatarUrl(avatarUrl) {
    if (!avatarUrl || typeof avatarUrl !== "string") {
      return "/assets/avatar.png";
    }

    const trimmedUrl = avatarUrl.trim();

    // Check for empty string or 'undefined' in any part of URL
    if (
      !trimmedUrl ||
      trimmedUrl === "undefined" ||
      trimmedUrl.includes("/undefined")
    ) {
      return "/assets/avatar.png";
    }

    // Check if URL is potentially valid
    try {
      new URL(trimmedUrl); // Will throw if invalid URL
      return trimmedUrl;
    } catch {
      return "/assets/avatar.png";
    }
  }
  // Fetch friends when component mounts or currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserFriends(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 flex justify-center items-center">
        <div className="text-2xl text-purple-700">Loading friends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 flex justify-center items-center">
        <div className="text-2xl text-red-500">
          Error loading friends: {error}
        </div>
      </div>
    );
  }

  // Get friends for current user from Redux state
  const currentUserFriends = currentUser?.id
    ? friends[currentUser.id] || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          Your Friends
        </h2>

        {currentUserFriends.length === 0 ? (
          <div className="text-center text-gray-600">
            You don't have any friends yet. Start adding some!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentUserFriends.map((friend) => (
              
              <div
                key={friend.id}
                className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center gap-3 hover:shadow-2xl transition"
              >
                <img
                  src={getSafeAvatarUrl(friend.avatar)}
                  alt={friend.username}
                  className="w-20 h-20 rounded-full border-2 border-pink-400 object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/assets/avatar.png";
                  }}
                />
                <div className="text-lg font-semibold text-purple-700">
                  {friend.name}
                </div>
                <div className="text-sm text-gray-400">@{friend.username}</div>
                <Link
                  to={`/user/${friend.id}`}
                  className="mt-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
