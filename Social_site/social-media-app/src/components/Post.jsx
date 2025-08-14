import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import { useDispatch } from "react-redux";
import { toggleLike } from "../redux/postSlice";

const Post = ({ post, user }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  // console.log(post.likes);
  const users = useSelector((state) => state.user.users);
  // console.log(users);
  
  const [liked, setLiked] = useState(
    Array.isArray(post.likes) && currentUser 
      ? post.likes.includes(currentUser.id)
      : false
  );

  const [likeCount, setLikeCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  // Simulate current user
  function SafePosturl(url){    
    return "http://127.0.0.1:8000/"+url;

  }
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
  // ! handle like 
  const handleLike = () => {
    if (!currentUser) {
      alert("Please login first to Like.");
      return;
    }

    // Optimistic UI update
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);

    // Send request to backend
    
    dispatch(toggleLike({ postId: post.id, userId: currentUser.id }));
  };

  const handleAddComment = (text) => {
    setComments([
      ...comments,
      {
        id: Date.now(),
        userId: currentUser.id,
        text,
      },
    ]);
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };


  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <img
          src={getSafeAvatarUrl(user.avatar)}
          alt={user?.username}
          className="w-12 h-12 rounded-full border-2 border-purple-400"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "/assets/avatar.png";
          }}
        />
        <div>
          <div className="font-semibold text-lg text-purple-700">
            <Link to={`/user/${user?.id}`}>{user?.name}</Link>
          </div>
          <div className="text-xs text-gray-400">@{user?.username}</div>
        </div>
      </div>
      {/* Render all media types */}
      {post.media && post.media.length > 0 && (
        <div className="flex flex-row gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
          {post.media.map((m, idx) => {
            if (m.type === "image") {
              return (
                <img
                  key={idx}
                  src={SafePosturl(m.media_url)}
                  alt={post.content}
                  className="w-full h-64 object-contain p-4 bg-white rounded-xl border border-purple-200 shadow-sm"
                />
              );
            }
            if (m.type === "audio") {
              // console.log("Rendering audio:", m.media_url);
              return (
                <div
                  key={idx}
                  className="min-w-[300px] bg-white rounded-xl border border-purple-200 shadow-sm p-4 flex flex-col items-center"
                >
                  {/* Cover image for the audio */}
                  <img
                    src="assets/music.png"
                    alt="Audio cover"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />

                  {/* Audio player */}
                  <audio
                    controls
                    className="w-full rounded-lg border border-purple-100"
                  >
                    <source src={SafePosturl(m.media_url)} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              );
            }
            if (m.type === "video") {
              return (
                <video
                  key={idx}
                  controls
                  className="w-full h-64 object-cover rounded-xl border border-purple-100"
                >
                  <source src={SafePosturl(m.media_url)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              );
            }
            return null;
          })}
        </div>
      )}
      <p className="text-gray-800 text-base">{post.content}</p>
      <div className="flex items-center justify-between mt-2">
        <button
          className="flex items-center gap-1 font-bold focus:outline-none transition-colors duration-200"
          onClick={handleLike}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "#ec4899" : "none"}
            viewBox="0 0 24 24"
            stroke="#ec4899"
            strokeWidth={2}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.75a5.25 5.25 0 00-4.5 2.475A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
            />
          </svg>
          <span className="text-pink-500">{likeCount}</span>
        </button>
        <div className="text-gray-500 text-sm">
          <button
            className="font-bold focus:outline-none transition-colors duration-200"
            onClick={() => {
              if (!currentUser) {
                alert("Please login first to view comments.");
                return;
              }
              setShowComments(true);
            }}
          >
            {comments.length} Comments 💬
          </button>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(post.updated_at).toLocaleString()}
        </span>
      </div>
      {showComments && (
        <Comment
          comments={comments}
          onClose={() => setShowComments(false)}
          onAdd={handleAddComment}
          onDelete={handleDeleteComment}
          postId={post.id}
          currentUser={currentUser}
          users={users}
        />
      )}
    </div>
  );
};

export default Post;
