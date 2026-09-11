import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import analysisReducer from "./reducer/analysisReducer"; 
import postReducer from "./reducer/postReducer/index";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: postReducer, 
    analysis: analysisReducer
  }
});

