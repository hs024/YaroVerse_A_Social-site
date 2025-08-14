import React from "react";
import { useSelector } from "react-redux";

function Notifications() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const users = useSelector((state) => state.user.users);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  const myNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id
  );

  const getUser = (id) => users.find((u) => u.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          Notifications
        </h2>
        {myNotifications.length === 0 ? (
          <div className="text-gray-400 text-center">No notifications.</div>
        ) : (
          <ul className="space-y-4">
            {myNotifications.map((n) => {
              const fromUser = getUser(n.fromUserId);
              return (
                <li
                  key={n.id}
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    n.read
                      ? "bg-purple-50"
                      : "bg-gradient-to-r from-pink-100 to-purple-100"
                  }`}
                >
                  {fromUser && (
                    <img
                      src={fromUser.avatar || "/assets/avatars/default.png"}
                      alt={fromUser.username}
                      className="w-10 h-10 rounded-full border border-purple-300"
                    />
                  )}
                  <div>
                    <div className="text-gray-700">{n.message}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(n.timestamp).toLocaleString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Notifications;
