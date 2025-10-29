import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@emotion/react";
import { PerformanceMonitor } from "./hooks/usePerformanceMonitoring";

import { theme } from "./styles/theme";
import "./styles/global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <PerformanceMonitor
        reportToConsole={process.env.NODE_ENV === "development"}
        reportToAnalytics={process.env.NODE_ENV === "production"}
      />
      <Router />
    </ThemeProvider>
  </React.StrictMode>
);

// register the SW
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
