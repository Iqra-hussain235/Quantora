import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api";


export const addFinancial = createAsyncThunk(
  "analysis/addFinancial",
  async ({ businessId, data }, thunkAPI) => {

    try {

      const res = await API.post(
        `/analysis/${businessId}/financial`,
        data
      );

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Financial Add Failed"
      );

    }

  }
);




export const addSwot = createAsyncThunk(
  "analysis/addSwot",
  async ({ businessId, data }, thunkAPI) => {

    try {

      const res = await API.post(
        `/analysis/${businessId}/swot`,
        data
      );

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "SWOT Add Failed"
      );

    }

  }
);




export const addMarketResearch = createAsyncThunk(
  "analysis/addMarketResearch",
  async ({ businessId, data }, thunkAPI) => {

    try {

      const res = await API.post(
        `/analysis/${businessId}/market`,
        data
      );

      return res.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Market Research Add Failed"
      );
    }

  }
);


export const addMetrics = createAsyncThunk(
  "analysis/addMetrics",
  async ({ businessId, data }, thunkAPI) => {

    try {

      const res = await API.post(
        `/analysis/${businessId}/metrics`,
        data
      );

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Metrics Add Failed"
      );

    }

  }
);




// GET BUSINESS SCORE
export const getBusinessScore = createAsyncThunk(
  "analysis/getScore",
  async (businessId, thunkAPI) => {

    try {

      const res = await API.get(`/analysis/${businessId}/score`);

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Score Fetch Failed"
      );

    }

  }
);