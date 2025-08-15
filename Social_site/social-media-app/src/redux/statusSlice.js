// src/features/status/statusSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://yaroverse-a-social-site.onrender.com/api/status";

// ======= Async Thunks =======

// Create Status
export const createStatus = createAsyncThunk(
  "status/createStatus",
  async (formData, { rejectWithValue }) => {
    // console.log("data is", Array.from(formData.entries()));

    try {
      const token = localStorage.getItem("access_token"); // ✅ Get token
      const { data } = await axios.post(
        `${API_BASE_URL}/status/create/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Pass token
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating status");
    }
  }
);


// List Status
export const listStatus = createAsyncThunk(
  "status/listStatus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/status/`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching statuses");
    }
  }
);

// Delete Status
export const deleteStatus = createAsyncThunk(
  "status/deleteStatus",
  async (statusId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token"); // ✅ get token
      await axios.delete(`${API_BASE_URL}/status/${statusId}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });
      return statusId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error deleting status");
    }
  }
);


// ======= Slice =======
const statusSlice = createSlice({
  name: "status",
  initialState: {
    statuses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses.unshift(action.payload);
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // List
      .addCase(listStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(listStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(listStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.statuses = state.statuses.filter(
          (status) => status.id !== action.payload
        );
      });
  },
});

export default statusSlice.reducer;
