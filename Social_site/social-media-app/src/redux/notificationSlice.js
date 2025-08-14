// redux/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import notificationsData from "../data/notifications.json"; // use static JSON for now

const initialState = {
  notifications: notificationsData,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    markAsRead(state, action) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) notification.read = true;
    },
  },
});

export const { addNotification, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
