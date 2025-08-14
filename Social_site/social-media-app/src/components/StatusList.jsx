import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteStatus } from "../redux/statusSlice";
import { fetchAllUsers } from "../redux/userSlice";
const StatusList = ({ statuses }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
//   const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
const { users, currentUser, loading, error } = useSelector(
    (state) => state.user
  );
  const handleDelete = (statusId) => {
    dispatch(deleteStatus(statusId));
    setSelectedStatus(null);
  };

  const getsafeurl = (url) => {
    return "http://127.0.0.1:8000" + url; // Adjust if you change backend base URL
  };

  // Fallback avatar
  const getAvatar = (status) => {
    // console.log(users);
    
const user = users[status.user];
// console.log(user);

    if (user && user.avatar) {
      return (user.avatar); // use the actual avatar from user
    }

    return "/assets/avatar.png"; // fallback
  };
// console.log(statuses);
useEffect(() => {
      dispatch(fetchAllUsers());
    
  }, [currentUser, users, dispatch]);
  return (
    <div>
      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <div
            key={status.id}
            onClick={() => setSelectedStatus(status)}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          >
            {/* Media Preview */}
            {status.media_type === "image" ? (
              <img
                src={getsafeurl(status.media_file)}
                alt="status"
                className="w-full h-48 object-cover"
              />
            ) : (
              <video
                src={getsafeurl(status.media_file)}
                className="w-full h-48 object-cover"
                muted
              />
            )}

            {/* User Info */}
            <div className="flex items-center gap-2 p-3 border-t border-gray-100">
              <img
                src={getAvatar(status)}
                alt="user"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <span className="font-bold text-purple-700 text-sm truncate">
                {status.user_name}
              </span>
            </div>

            {/* Content */}
            {status.content && (
              <div className="px-3 pb-3 text-gray-600 text-sm truncate">
                {status.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {selectedStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative max-w-3xl w-full p-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStatus(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200"
            >
              ✖
            </button>

            {/* Media Content */}
            <div className="bg-white p-4 rounded-lg shadow-xl">
              {selectedStatus.media_type === "image" ? (
                <img
                  src={getsafeurl(selectedStatus.media_file)}
                  alt="status"
                  className="max-h-[70vh] mx-auto rounded-lg"
                />
              ) : (
                <video
                  src={getsafeurl(selectedStatus.media_file)}
                  controls
                  autoPlay
                  className="max-h-[70vh] mx-auto rounded-lg"
                />
              )}

              {/* Content */}
              {selectedStatus.content && (
                <p className="mt-4 text-gray-700 text-center">
                  {selectedStatus.content}
                </p>
              )}
            </div>

            {/* Delete Button for Current User */}
            {currentUser?.username ===
              (selectedStatus.user?.username ||
                selectedStatus.user_username ||
                selectedStatus.user_name) && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleDelete(selectedStatus.id)}
                  className="bg-gradient-to-r from-red-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow hover:from-red-500 hover:to-orange-400 transition"
                >
                  Delete Status
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusList;
