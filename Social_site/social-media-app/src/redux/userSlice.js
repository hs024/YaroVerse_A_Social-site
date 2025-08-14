import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const savedUser = localStorage.getItem("currentUser");






// Async thunks for API calls




export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("bio", userData.bio || "");
      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }

      const response = await axios.post(`${API_BASE_URL}/register/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        identifier: credentials.identifier,
        password: credentials.password,
      });

      // Store tokens in localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/fetchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_BASE_URL}/user/${userId}/`);
      response.data.avatar = "http://localhost:8000"+response.data.avatar;
     
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserFriends = createAsyncThunk(
  "user/fetchFriends",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${API_BASE_URL}/user/${userId}/friends/`
      );
      response.data.forEach((friend) => {
        friend.avatar = "http://localhost:8000" + friend.avatar;
      });
      return { userId, friends: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    
    try {
      const token = localStorage.getItem("access_token");
      
      const response = await axios.put(
        `${API_BASE_URL}/user/update/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const toggleFriend = createAsyncThunk(
  "user/toggleFriend",
  async (friendId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${API_BASE_URL}/user/${friendId}/toggle-friend/`,
        {}, // Empty body since we're just toggling
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_BASE_URL}/user/`
      );

      // Transform array to object with ids as keys
      const usersMap = response.data.reduce((acc, user) => {
        acc[user.id] = user;
        user.avatar = "http://localhost:8000"+user.avatar;
        return acc;
      }, {});

      return usersMap;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  currentUser: savedUser ? JSON.parse(savedUser) : null,
  users: {},
  friends: {},
  loading: false,
  error: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Simple logout reducer
    logout(state) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    // Clear errors
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.users[action.payload.id] = action.payload;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.users[action.payload.id] = action.payload;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.users[action.payload.id] = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user friends
      .addCase(fetchUserFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends[action.payload.userId] = action.payload.friends;
      })
      .addCase(fetchUserFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.users[action.payload.id] = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch  all user
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
