import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postSlice";
import notificationReducer from "./notificationSlice";
import statusReducer from "./statusSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    notification: notificationReducer,
    status: statusReducer,
  },
});
export default store;
