import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Form } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api/posts";

// Fetch all posts
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle like for a post
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId, userId }, { rejectWithValue }) => {
    // console.log("toggleLike thunk STARTED with postId:", postId); // Debug

    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/like-toggle/`,
        { user: userId }
      );
      // console.log("here come like");
      return { postId, updatedPost: response.data };
    } catch (error) {
      console.error("toggleLike error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Add comment to a post
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, userId, text }, { rejectWithValue }) => {
    try {
      // console.log("come in try", postId, userId, text);
      
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/comments/add/`,
        { user: userId, text:text }
      );
      // console.log("for return");
      
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}/delete/`);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//! upload post 
export const UploadPost = createAsyncThunk(
  "posts/UploadPost",
  async ({ content,media,user }, { rejectWithValue }) => {
    // console.log("here before try");
    const formData = new FormData();
    formData.append('content', content);
    formData.append('user', user);
if (Array.isArray(media)) {
  media.forEach((file) => {
    formData.append("media_files", file);
  });
} else if (media) {
  // If it's a single file
  formData.append("media_files", media);
}
// console.log("data is", Array.from(formData.entries()));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/create/`,
        formData
      );
      // console.log("after try");
      
      return { response: response.data };
    } catch (error) {
      console.error("UploadPost error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// ! delete post
export const DeletePost = createAsyncThunk(
  "posts/DeletePost",
  async (postId, { rejectWithValue }) => {
    try {
      // console.log(postId);
      
      await axios.delete(`${API_BASE_URL}/posts/${postId}/delete/`);
      return { postId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//! update post
export const UpdatePost = createAsyncThunk(
  "posts/UpdatePost",
  async ({ id, content, media, user }, { rejectWithValue }) => {
    // console.log("here come in fn");
    
    const formData = new FormData();
    formData.append('content', content);
    formData.append('user', user);
if (Array.isArray(media)) {
  media.forEach((file) => {
    if (file instanceof File) {
      formData.append("media_files", file);
    }
  });
} else if (media instanceof File) {
  formData.append("media_files", media);
}

// console.log("data is", Array.from(formData.entries()));
// console.log("before try");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${id}/update/`,
        formData
      );
      // console.log("after try");
      
      return { response: response.data };
    } catch (error) {
      console.error("UploadPost error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, updatedPost } = action.payload;
        const index = state.posts.findIndex((p) => p.id === postId);
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index], // keep old data
            ...updatedPost, // overwrite only updated fields
          };
        }
      })

      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.comments = [...(post.comments || []), comment];
        }
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post && post.comments) {
          post.comments = post.comments.filter((c) => c.id !== commentId);
        }
      })
      // upload post
      .addCase(UploadPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UploadPost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.response) {
          state.posts.unshift(action.payload.response); // Add new post at start
        }
      })

      .addCase(UploadPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update post
      .addCase(UpdatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdatePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.response) {
          const index = state.posts.findIndex(
            (p) => p.id === action.payload.response.id
          );
          if (index !== -1) {
            state.posts[index] = action.payload.response; // Update existing post
          }
        }
      })

      .addCase(UpdatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete post
      .addCase(DeletePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        state.posts = state.posts.filter((post) => post.id !== postId);
      })
      .addCase(DeletePost.rejected, (state, action) => {
        console.error("Delete post failed:", action.payload);
      })
      ;
  },
});

export default postSlice.reducer;
