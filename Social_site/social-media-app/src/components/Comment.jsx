import React, { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { addComment, deleteComment } from "../redux/postSlice"; // import your new slice thunks

const Comment = ({  onClose, postId, currentUser, users }) => {
  // console.log(postId);
  
  const [text, setText] = useState("");
  const dispatch = useDispatch();
const comments = useSelector(
  (state) => state.post.posts.find((p) => p.id === postId)?.comments || []
);
  const handleAdd = () => {
    if (text.trim()) {
      // console.log("here come for dispatch");
      
      dispatch(
        addComment({
          postId,
          userId: currentUser.id,
          text,
        })
      );
      setText("");
    }
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment({ commentId, postId }));
  };

  // Access user directly from object instead of using .find
  const getUser = (userId) => users?.[userId] || null;

  return (
    <div className="absolute left-0 right-0 mx-auto top-0 z-50 bg-white rounded-xl shadow-xl p-6 w-full max-w-lg border border-purple-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-purple-700">Comments</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-pink-500 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
        {comments.length === 0 && (
          <div className="text-gray-400 text-center">No comments yet.</div>
        )}
        {comments.map((c) => {
          const user = getUser(c.user);
          return (
            <div
              key={c.id}
              className="flex items-center justify-between bg-purple-50 rounded p-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user?.avatar || "/assets/avatars/default.png"}
                  alt={user?.username || "Unknown"}
                  className="w-7 h-7 rounded-full border border-purple-300"
                />
                <span className="text-xs text-purple-700 font-semibold">
                  @{user?.username || "unknown"}
                </span>
                <span className="text-gray-700">{c.text}</span>
              </div>
              {c.user === currentUser.id && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="ml-2 text-xs text-pink-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 focus:outline-none focus:border-purple-400"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-1 rounded font-semibold"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Comment;
