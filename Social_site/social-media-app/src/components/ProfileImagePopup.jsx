import { useState } from "react";

export default function ProfileImagePopup({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const getSafeAvatarUrl = (avatar) => {
    return avatar?.trim()
      ? `${avatar}`
      : "/assets/avatar.png";
  };

  return (
    <>
      {/* Profile Image Button (circle style on profile) */}
      {/* {console.log(user)
      } */}
      <img
        src={getSafeAvatarUrl(user.avatar)}
        alt={user.username}
        className="w-28 h-28 rounded-full border-4 border-purple-400 mb-4 object-cover cursor-pointer hover:opacity-90 transition"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/avatar.png";
        }}
        onClick={() => setIsOpen(true)}
      />

      {/* Overlay Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 relative max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            {/* Large Profile Image (square format) */}
            <img
              src={getSafeAvatarUrl(user.avatar)}
              alt={user.username}
              className="w-full h-72 border-4 border-purple-400 object-cover mx-auto rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/avatar.png";
              }}
            />

            {/* Username */}
            <h2 className="mt-4 text-lg font-semibold">{user.username}</h2>
          </div>
        </div>
      )}
    </>
  );
}
