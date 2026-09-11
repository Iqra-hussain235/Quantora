import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api";

// CREATE POST
export const createPost = createAsyncThunk(
  "post/create",
  async (postData, thunkAPI) => {
    try {
      const res = await API.post("/posts", postData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create Post Failed"
      );
    }
  }
);

// GET POSTS
export const getPosts = createAsyncThunk(
  "post/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/posts");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch Posts Failed"
      );
    }
  }
);


// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {

    try {

      const res = await API.put("/users/profile", data);

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile Update Failed"
      );

    }

  }
);


// LOGOUT

export const logoutUser = () => {

  localStorage.removeItem("token");

  return {
    type: "auth/logout"
  };

};