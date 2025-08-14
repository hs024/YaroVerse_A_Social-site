import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../components/Post";
import { Link } from "react-router-dom";
import { fetchAllUsers } from "../redux/userSlice";
import { fetchAllPosts } from "../redux/postSlice";
const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const { users, currentUser, loading, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (currentUser && Object.keys(users).length === 0) {
      dispatch(fetchAllUsers());
       dispatch(fetchAllPosts());
    }
  }, [currentUser, users, dispatch]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center flex-col gap-4 justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="text-center space-y-8">
          <h2 className="text-2xl font-bold text-gray-700">
            Please log in to view posts and interact.
          </h2>
        </div>
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8">
      <div className="max-w-xl mx-auto space-y-8">
        {posts.map((post) => {
          const user = users[post.user] || {
            name: "Unknown User",
            avatar: "/default-avatar.png",
          };
          // {console.log(post);}
          return <Post key={post.id} post={post} user={user} />;
        })}
      </div>
    </div>
  );
};

export default Home;
