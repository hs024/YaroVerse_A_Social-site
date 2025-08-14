import React, { useEffect } from "react";
import StatusCreator from "../components/StatusCreator";
import StatusList from "../components/StatusList";
import { listStatus } from "../redux/statusSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFriends } from "../redux/userSlice";
const Status = () => {
  const dispatch = useDispatch();
 const allStatuses = useSelector((state) => state.status.statuses);
 const { currentUser, users } = useSelector((state) => state.user);

 const userFriends = users[currentUser?.id]?.friends || [];

 // Filter statuses: only show if the status belongs to a friend or self
 const friendStatuses = allStatuses.filter(
   (status) =>
     userFriends.includes(status.user) || status.user === currentUser?.id
 );

 useEffect(() => {
   dispatch(listStatus());
   if (currentUser?.id) {
     dispatch(fetchUserFriends(currentUser.id));
   }
 }, [dispatch, currentUser?.id]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <StatusCreator />
      <hr className="my-6" />
      <StatusList statuses={friendStatuses} />
    </div>
  </div>
);
};

export default Status;
