"use client";

import { Provider } from "react-redux";
import { store } from "../config/redux/store";
import { BusinessProvider } from "@/context/BusinessContext";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <BusinessProvider>
        {children}
      </BusinessProvider>
    </Provider>
  );
}