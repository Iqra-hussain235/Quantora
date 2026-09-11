import { createSlice } from "@reduxjs/toolkit";
import {
  addFinancial,
  addSwot,
  addMetrics,
  getBusinessScore
} from "../../action/analysisAction";

const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    financial: null,
    swot: null,
    metrics: null,
    score: null,
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(addFinancial.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFinancial.fulfilled, (state, action) => {
        state.loading = false;
        state.financial = action.payload;
      })
      .addCase(addFinancial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addSwot.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSwot.fulfilled, (state, action) => {
        state.loading = false;
        state.swot = action.payload;
      })
      .addCase(addSwot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(addMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBusinessScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessScore.fulfilled, (state, action) => {
        state.loading = false;
        state.score = action.payload;
      })
      .addCase(getBusinessScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default analysisSlice.reducer;
