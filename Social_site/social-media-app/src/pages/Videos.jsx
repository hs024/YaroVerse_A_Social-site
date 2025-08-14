import {React,useEffect} from "react";
import Post from "../components/Post.jsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../redux/userSlice.js";
import { fetchAllPosts } from "../redux/postSlice.js";
function Videos() {
  const dispatch = useDispatch();
  const Allposts = useSelector((state) => state.post.posts);
  const users = useSelector((state) => state.user.users); // object now
  const posts = Allposts.filter(
    (p) => p.media.length>0 && p.media.every((pp) => pp.type === "video")
  );
useEffect(() => {
      if ( Object.keys(users).length === 0) {
        dispatch(fetchAllUsers());
      }
      dispatch(fetchAllPosts())
    }, [ users, dispatch]);
    // console.log(posts);
    
    if(posts.length===0){
      return (
        <div className=" min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
            Your Feeds Videos
          </h2>
          <h2 className=" text-2xl font-bold text-gray-700 text-center">
            No videos to show
          </h2>
        </div>
      );
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
        Your Feeds Videos
      </h2>
      <div className="max-w-xl mx-auto space-y-8">
        {posts.map((post) => {
         const user = users[post.user] || {
           name: "Unknown User",
           avatar: "/assets/avatar.png",
         };
          return <Post key={post.id} post={post} user={user} />;
        })}
      </div>
    </div>
  );
}

export default Videos;
