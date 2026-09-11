import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api";


// CREATE BUSINESS
export const createBusiness = createAsyncThunk(
  "business/create",
  async (data, thunkAPI) => {

    try {

      const res = await API.post("/business", data);

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create Business Failed"
      );

    }

  }
);


// GET USER BUSINESSES

export const getBusinesses = createAsyncThunk(
  "business/getAll",
  async (_, thunkAPI) => {

    try {

      const res = await API.get("/business");

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch Businesses Failed"
      );

    }

  }
);


// GET SINGLE BUSINESS
export const getBusiness = createAsyncThunk(
  "business/getSingle",
  async (id, thunkAPI) => {

    try {

      const res = await API.get(`/business/${id}`);

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch Business Failed"
      );

    }

  }
);


// UPDATE BUSINESS
export const updateBusiness = createAsyncThunk(
  "business/update",
  async ({ id, data }, thunkAPI) => {

    try {

      const res = await API.put(`/business/${id}`, data);

      return res.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update Failed"
      );

    }

  }
);


// DELETE BUSINESS
export const deleteBusiness = createAsyncThunk(
  "business/delete",
  async (id, thunkAPI) => {

    try {

      await API.delete(`/business/${id}`);

      return id;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete Failed"
      );

    }

  }
);




// // ADD FINANCIAL DATA
// export const addFinancial = createAsyncThunk(
//   "analysis/addFinancial",
//   async ({ businessId, data }, thunkAPI) => {

//     try {

//       const res = await API.post(
//         `/analysis/${businessId}/financial`,
//         data
//       );

//       return res.data;

//     } catch (error) {

//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Financial Add Failed"
//       );

//     }

//   }
// );




// // ADD SWOT
// export const addSwot = createAsyncThunk(
//   "analysis/addSwot",
//   async ({ businessId, data }, thunkAPI) => {

//     try {

//       const res = await API.post(
//         `/analysis/${businessId}/swot`,
//         data
//       );

//       return res.data;

//     } catch (error) {

//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "SWOT Add Failed"
//       );

//     }

//   }
// );




// // ADD METRICS
// export const addMetrics = createAsyncThunk(
//   "analysis/addMetrics",
//   async ({ businessId, data }, thunkAPI) => {

//     try {

//       const res = await API.post(
//         `/analysis/${businessId}/metrics`,
//         data
//       );

//       return res.data;

//     } catch (error) {

//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Metrics Add Failed"
//       );

//     }

//   }
// );




// // GET BUSINESS SCORE
// export const getBusinessScore = createAsyncThunk(
//   "analysis/getScore",
//   async (businessId, thunkAPI) => {

//     try {

//       const res = await API.get(`/analysis/${businessId}/score`);

//       return res.data;

//     } catch (error) {

//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Score Fetch Failed"
//       );

//     }

//   }
// );