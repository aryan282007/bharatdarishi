import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

window.onerror = function(message, source, lineno, colno, error) {
  fetch('http://localhost:5000/api/health', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message, stack: error?.stack })
  }).catch(console.error);
};
window.addEventListener('unhandledrejection', function(event) {
  fetch('http://localhost:5000/api/health', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: event.reason?.message, stack: event.reason?.stack })
  }).catch(console.error);
});

// Configure API base URL for environment (uses env variable or defaults to production Render backend URL in build mode)
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://aicte-0gje.onrender.com" : "");

if (apiBaseUrl && apiBaseUrl.trim()) {
  axios.defaults.baseURL = apiBaseUrl.trim().replace(/\/$/, "");
} else {
  axios.defaults.baseURL = "";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

