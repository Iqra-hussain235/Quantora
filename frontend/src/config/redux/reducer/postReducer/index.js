import { createSlice } from "@reduxjs/toolkit";

import {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness
} from "../../action/bussinessAction";


const businessSlice = createSlice({
  name: "business",
  initialState: {
    businesses: [],
    singleBusiness: null,
    loading: false,
    error: null
  },

  reducers:{},

  extraReducers:(builder)=>{

    builder

      .addCase(createBusiness.fulfilled,(state,action)=>{
        state.businesses.push(action.payload)
      })

      .addCase(getBusinesses.fulfilled,(state,action)=>{
        state.businesses=action.payload
      })

      .addCase(getBusiness.fulfilled,(state,action)=>{
        state.singleBusiness=action.payload
      })

      .addCase(updateBusiness.fulfilled,(state,action)=>{
        const index = state.businesses.findIndex(b => b._id === action.payload._id);
        if(index !== -1) {
          state.businesses[index] = action.payload;
        }
        state.singleBusiness = action.payload;
      })

      .addCase(deleteBusiness.fulfilled,(state,action)=>{
        state.businesses = state.businesses.filter(b => b._id !== action.payload._id);
      })

  }

});

export default businessSlice.reducer;